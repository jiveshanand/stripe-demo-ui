import { useEffect, useCallback, useState } from 'react';
import { Button, Table } from 'antd';
import { axiosInstance } from '../axios';
import { PaymentFormModal } from '../PaymentFormModal';
import { SubscriptionForm } from '../Subscription';
import { CheckoutForm } from '../PaymentForm';
import { loadStripe } from '@stripe/stripe-js';

import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(
  'pk_test_51PRH4lK28JpGLXfjAbtt9bNEk5Wbh8LEwAW6PBV4inaW9LTAobsJNQL81N2YNiAg2EwbMeOWmSLqoW1X5sRD1j1d00zGOmLtsz'
);

function CustomerList(props) {
  const [customers, setCustomers] = useState([]);
  const [isPaymentaFormModalOpen, setIsPaymentFormModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const renderAction = (record) => {
    return (
      <Button
        type='primary'
        onClick={async () => {
          const setupIntentData = await createSetUpIntent(record?.id);
          if (setupIntentData?.clientSecret && record?.id) {
            setSelectedCustomer({
              secret: setupIntentData.clientSecret,
              id: record.id,
            });
            setIsPaymentFormModalOpen(true);
          }
        }}
      >
        Attach
      </Button>
    );
  };
  const columns = [
    {
      title: 'Name',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Action',
      key: 'action',
      render: renderAction,
    },
  ];

  const getCustomerList = useCallback(async () => {
    const response = await axiosInstance.get('/stripe/customers');
    setCustomers(response?.data?.customers);
  }, []);

  const createSetUpIntent = useCallback(async (customerId) => {
    const setupIntentResponse = await fetch(
      'http://localhost:3000/stripe/create-setup-intent',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customerId }),
      }
    );
    const setupIntentData = await setupIntentResponse.json();
    return setupIntentData;
  }, []);

  useEffect(() => {
    getCustomerList();
  }, [getCustomerList]);

  const stripe = useStripe();
  const elements = useElements();
  const [paymentIntentId, setPaymentIntentId] = useState('');
  const [chargeId, setChargeId] = useState('');
  const [chargeList, setChargeList] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState(null);

  const createCustomerAndPaymentIntent = async () => {
    const cardElement = elements.getElement(CardElement);
    const { paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
      billing_details: {
        name: 'Test User',
      },
    });

    await fetch('http://localhost:3000/payments/attach-payment-method', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customerId: selectedCustomer.id,
        paymentMethodId: paymentMethod.id,
      }),
    });

    const paymentIntentResponse = await fetch(
      'http://localhost:3000/payments/create-payment-intent',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: 3300,
          currency: 'usd',
          customerId: selectedCustomer.id,
          paymentMethodId: paymentMethod.id,
        }),
      }
    );

    const { paymentIntentId } = await paymentIntentResponse.json();
    setPaymentIntentId(paymentIntentId?.id);
    setPaymentMethod(paymentMethod);
  };

  const confirmPayment = async () => {
    const response = await axiosInstance.post('/payments/confirm-payment', {
      paymentIntentId,
      paymentMethod: paymentMethod.id,
      returnUrl: 'http://localhost:3000',
    });

    console.log(response);
  };

  const createAndCapture = async () => {
    const cardElement = elements.getElement(CardElement);
    const { paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
      billing_details: {
        name: 'Test User',
      },
    });
    const response = await axiosInstance.post(
      '/payments/create-capture-payment-intent',
      {
        amount: 4400,
        currency: 'usd',
        customerId: selectedCustomer?.Id,
        paymentMethodId: paymentMethod.id,
      }
    );
  };
  const capturePayment = async () => {
    const response = await fetch(
      'http://localhost:3000/payments/capture-payment',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentIntentId }),
      }
    );
    const { chargeId } = await response.json();
    setChargeId(chargeId);
  };

  const getListOfCharges = async () => {
    const response = await axiosInstance.get(
      `/payments/customer-charges?customerId=${selectedCustomer.id}`
    );
    setChargeList(response?.data?.charges?.data);
  };
  console.log('chargeList', chargeList);
  return (
    <>
      {customers && customers.length > 0 && (
        <Table dataSource={customers} columns={columns} />
      )}
      <PaymentFormModal
        isOpen={isPaymentaFormModalOpen}
        confirmIsLoading={false}
        handleSubmit={() => {}}
        handleCancel={() => {
          setIsPaymentFormModalOpen(false);
        }}
      >
        {selectedCustomer?.secret && selectedCustomer?.id && (
          <>
            <CardElement />
            <div className='flex flex-col align-middle'>
              <Button
                type='secondary'
                className='my-2 w-[50%]'
                onClick={createCustomerAndPaymentIntent}
              >
                Create Payment Intent
              </Button>
              <Button
                type='secondary'
                className='my-2 w-[50%]'
                onClick={confirmPayment}
                disabled={!paymentIntentId}
              >
                Authorize Payment
              </Button>
              <Button
                type='secondary'
                className='my-2 w-[50%]'
                onClick={capturePayment}
                disabled={!paymentIntentId}
              >
                Capture Payment
              </Button>

              <Button
                type='secondary'
                className='my-2 w-[50%]'
                onClick={createAndCapture}
                // disabled={!paymentIntentId}
              >
                Create and Capture Payment ($44)
              </Button>
              <Button
                type='secondary'
                className='my-2 w-[50%]'
                onClick={getListOfCharges}
              >
                List of Charges
              </Button>
            </div>
            {/* {chargeId && <div>Charge ID: {chargeId}</div>} */}
          </>
        )}

        {chargeList &&
          chargeList.length > 0 &&
          chargeList?.map((charge) => {
            return (
              <div
                className='cursor-pointer'
                onClick={async () => {
                  const response = await axiosInstance.post(
                    '/payments/issue-refund',
                    { chargeId: charge?.id }
                  );
                  console.log(response);
                }}
              >
                {charge?.id}
              </div>
            );
          })}

        <CheckoutForm customerId={selectedCustomer?.id} />
      </PaymentFormModal>
      <SubscriptionForm />
    </>
  );
}

export { CustomerList };
