import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Layout, Typography, Button, Card, notification } from 'antd';
import { axiosInstance } from '../axios';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import Navigation from '../components/Navigation';
import useCustomerStore from '../store/customStore';
import { SubscriptionForm } from './Subscription';

import { loadStripe } from '@stripe/stripe-js';

const { Header, Content, Footer } = Layout;
const { Title, Paragraph, Text } = Typography;

const stripePromise = loadStripe(
  'pk_test_51PRH4lK28JpGLXfjAbtt9bNEk5Wbh8LEwAW6PBV4inaW9LTAobsJNQL81N2YNiAg2EwbMeOWmSLqoW1X5sRD1j1d00zGOmLtsz'
);

const CustomerDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();
  const { selectedCustomer } = useCustomerStore();
  const [paymentIntentId, setPaymentIntentId] = useState('');
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [chargeList, setChargeList] = useState([]);

  console.log('SelectedCustomer', selectedCustomer);

  const openNotification = (type, message, description) => {
    notification[type]({
      message,
      description,
    });
  };

  const createCustomerAndPaymentIntent = async () => {
    try {
      const cardElement = elements.getElement(CardElement);
      const { paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
        billing_details: {
          name: 'Test User',
        },
      });

      await axiosInstance.post('/payments/attach-method', {
        customerId: selectedCustomer.id,
        paymentMethodId: paymentMethod.id,
      });

      const paymentIntentResponse = await axiosInstance.post(
        '/payments/create-intent',
        {
          amount: 3300,
          currency: 'usd',
          customerId: selectedCustomer.id,
          paymentMethodId: paymentMethod.id,
        }
      );

      const { id } = paymentIntentResponse.data;
      setPaymentIntentId(id);
      setPaymentMethod(paymentMethod);

      openNotification(
        'success',
        'Success',
        'Payment Intent Created Successfully'
      );
    } catch (error) {
      openNotification('error', 'Error', 'Failed to Create Payment Intent');
    }
  };

  const confirmPayment = async () => {
    try {
      const response = await axiosInstance.post('/payments/confirm-intent', {
        paymentIntentId,
        paymentMethod: paymentMethod.id,
        returnUrl: 'http://localhost:3000',
      });

      console.log(response);
      openNotification('success', 'Success', 'Payment Confirmed Successfully');
    } catch (error) {
      openNotification('error', 'Error', 'Failed to Confirm Payment');
    }
  };

  const createAndCapture = async () => {
    try {
      const cardElement = elements.getElement(CardElement);
      const { paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
        billing_details: {
          name: 'Test User',
        },
      });

      await axiosInstance.post('/payments/create-and-capture-intent', {
        amount: 4400,
        currency: 'usd',
        customerId: selectedCustomer?.id,
        paymentMethodId: paymentMethod.id,
      });

      openNotification(
        'success',
        'Success',
        'Payment Created and Captured Successfully'
      );
    } catch (error) {
      openNotification(
        'error',
        'Error',
        'Failed to Create and Capture Payment'
      );
    }
  };

  const capturePayment = async () => {
    try {
      const response = await axiosInstance.post(
        `/payments/capture/${paymentIntentId}`
      );

      const { latest_charge } = response.data;

      openNotification(
        'success',
        'Success',
        <p>
          Payment Intent Created Successfully with charge Id
          <Text strong type='success'>
            {` ${latest_charge}`}
          </Text>
        </p>
      );
    } catch (error) {
      openNotification('error', 'Error', 'Failed to Capture Payment');
    }
  };

  const getListOfCharges = async () => {
    try {
      const response = await axiosInstance.get(
        `/charges/list/${selectedCustomer.id}`
      );
      setChargeList(response.data?.data);

      openNotification('success', 'Success', 'Charges Retrieved Successfully');
    } catch (error) {
      openNotification('error', 'Error', 'Failed to Retrieve Charges');
    }
  };

  return (
    <Layout className='min-h-screen'>
      <Header className='bg-gray-800'>
        <Navigation />
      </Header>
      <Content className='p-8 bg-gray-100'>
        <Card className='max-w-4xl mx-auto'>
          <Title level={2}>Customer Detail</Title>
          {selectedCustomer && selectedCustomer.id === id ? (
            <>
              <Paragraph>
                <strong>ID:</strong> {selectedCustomer.id}
              </Paragraph>
              <Paragraph>
                <strong>Name:</strong> {selectedCustomer.name}
              </Paragraph>
              <Paragraph>
                <strong>Email:</strong> {selectedCustomer.email}
              </Paragraph>
            </>
          ) : (
            <Paragraph>No customer selected or customer not found.</Paragraph>
          )}

          {selectedCustomer?.paymentIntentSecret && selectedCustomer?.id && (
            <>
              <Card className='w-full max-w-lg mx-auto shadow-lg p-6'>
                <Title level={2} className='text-center mb-4'>
                  Payment Information
                </Title>
                <div className='mb-8'>
                  {/* <CardElement className='p-4 border border-gray-300 rounded' /> */}
                </div>

                <div className='mb-8 p-4 border border-gray-300 rounded'>
                  <Title level={4} className='mb-4'>
                    Payment Intent Actions
                  </Title>
                  <div className='flex flex-col items-center space-y-2'>
                    <Button
                      type='primary'
                      className='w-full sm:w-1/2'
                      onClick={createCustomerAndPaymentIntent}
                    >
                      Create Payment Intent
                    </Button>
                    <Button
                      type='primary'
                      className='w-full sm:w-1/2'
                      onClick={confirmPayment}
                      disabled={!paymentIntentId}
                    >
                      Authorize Payment
                    </Button>
                    <Button
                      type='primary'
                      className='w-full sm:w-1/2'
                      onClick={capturePayment}
                      disabled={!paymentIntentId}
                    >
                      Capture Payment
                    </Button>
                  </div>
                </div>

                <div className='mb-8 p-4 border border-gray-300 rounded'>
                  <Title level={4} className='mb-4'>
                    Capture Payment
                  </Title>
                  <div className='flex flex-col items-center space-y-2'>
                    <Button
                      type='primary'
                      className='w-full sm:w-1/2'
                      onClick={createAndCapture}
                    >
                      Create and Capture Payment ($44)
                    </Button>
                  </div>
                </div>

                <div className='p-4 border border-gray-300 rounded'>
                  <Title level={4} className='mb-4'>
                    Charges
                  </Title>
                  <div className='flex flex-col items-center space-y-2'>
                    <Button
                      type='primary'
                      className='w-full sm:w-1/2'
                      onClick={getListOfCharges}
                    >
                      List of Charges
                    </Button>
                  </div>
                </div>
              </Card>
            </>
          )}

          {chargeList && chargeList.length > 0 ? (
            <div className='mt-8 p-4 border border-gray-300 rounded'>
              <Title level={4} className='mb-4'>
                Charges List
              </Title>
              <div className='grid grid-cols-1 gap-4'>
                {chargeList.map((charge) => (
                  <Card key={charge.id} className='cursor-pointer shadow-md'>
                    <Paragraph>
                      <strong>Charge ID:</strong> {charge.id}
                    </Paragraph>
                    <Paragraph>
                      <strong>Amount:</strong> $
                      {(charge.amount / 100).toFixed(2)} USD
                    </Paragraph>
                    <Paragraph>
                      <strong>Status:</strong> {charge.status}
                    </Paragraph>
                    {charge.amount_refunded === 0 ? (
                      <Button
                        type='primary'
                        className='w-full'
                        onClick={async () => {
                          try {
                            const response = await axiosInstance.post(
                              `/charges/refund/${charge.id}`
                            );
                            console.log(response);
                            openNotification(
                              'success',
                              'Success',
                              'Refund Issued Successfully'
                            );
                          } catch (error) {
                            openNotification(
                              'error',
                              'Error',
                              'Failed to Issue Refund'
                            );
                          }
                        }}
                      >
                        Issue Refund
                      </Button>
                    ) : (
                      <Text strong type='success'>
                        Refund already issued
                      </Text>
                    )}
                  </Card>
                ))}
              </div>
            </div>
          ) : (
            chargeList.length === 0 && (
              <div> No Charges found for the current customercustomer </div>
            )
          )}
        </Card>
      </Content>

      <SubscriptionForm />
      <Footer className='text-center bg-gray-800 text-white'>
        ©2024 Created by Jivesh Anand
      </Footer>
    </Layout>
  );
};

export default CustomerDetail;
