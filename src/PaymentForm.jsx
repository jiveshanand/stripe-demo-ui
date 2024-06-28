import React, { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, useStripe, useElements } from '@stripe/react-stripe-js';
import { axiosInstance } from './axios';
import { Form, Button, Card, Typography, notification } from 'antd';
import useCustomerStore from './store/customStore';
import PaymentForm1 from './PaymentForm1';

const { Title } = Typography;

const stripePromise = loadStripe(
  'pk_test_51PRH4lK28JpGLXfjAbtt9bNEk5Wbh8LEwAW6PBV4inaW9LTAobsJNQL81N2YNiAg2EwbMeOWmSLqoW1X5sRD1j1d00zGOmLtsz'
);

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const { selectedCustomer } = useCustomerStore();
  const { id: customerId } = selectedCustomer;
  const [message, setMessage] = useState('');
  const [clientSecret, setClientSecret] = useState(undefined);
  const [loading, setLoading] = useState(false);

  const openNotification = (type, message, description) => {
    notification[type]({
      message,
      description,
    });
  };

  const fetchClientSecret = async () => {
    try {
      const response = await axiosInstance.post(
        '/payments/create-payment-intends-payment-methods',
        { customerId }
      );
      setClientSecret(response?.data?.clientSecret);
    } catch (error) {
      openNotification('error', 'Error', 'Failed to fetch client secret');
    }
  };

  useEffect(() => {
    if (customerId) fetchClientSecret();
  }, [customerId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setLoading(true);
    const result = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: 'http://localhost:3000/confirmation',
      },
    });

    if (result.error) {
      setMessage(result.error.message);
      openNotification('error', 'Payment Error', result.error.message);
    } else {
      setMessage('Payment successful!');
      openNotification(
        'success',
        'Payment Successful',
        'Your payment was successful!'
      );
    }
    setLoading(false);
  };
  console.log(clientSecret);

  return (
    <div className='flex justify-center items-center bg-gray-100 p-4'>
      {clientSecret ? (
        <Card className='w-full max-w-lg shadow-lg'>
          <Title level={2} className='text-center mb-4'>
            Checkout
          </Title>
          {clientSecret && (
            <Elements stripe={stripePromise} options={{ clientSecret }}>
              <PaymentForm1 clientSecret={clientSecret} />
            </Elements>
          )}
          {message && (
            <Typography.Paragraph className='text-center mt-4'>
              {message}
            </Typography.Paragraph>
          )}
        </Card>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default CheckoutForm;
