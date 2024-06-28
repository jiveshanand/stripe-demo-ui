import React, { useState } from 'react';
import {
  useStripe,
  useElements,
  PaymentElement,
} from '@stripe/react-stripe-js';

const PaymentForm = ({ clientSecret, customerId }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState('');

  console.log('stripe', stripe, elements);
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const { setupIntent, error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: 'http://localhost:3001/success',
        // handleActions: false,
      },
    });
    console.log(setupIntent);
    console.log('after response', setupIntent);

    if (error) {
      console.log('here');
      setMessage(error.message);
    } else {
      console.log('There');
      setMessage('Payment method attached successfully!');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />

      <div className='flex flex-col items-center space-y-2'>
        <button
          type='submit'
          className='w-full sm:w-1/2 my-2 border-2 border-blue-800'
          disabled={!stripe}
        >
          Submit for $55
        </button>
      </div>
      {message && <div>{message}</div>}
    </form>
  );
};

export default PaymentForm;
