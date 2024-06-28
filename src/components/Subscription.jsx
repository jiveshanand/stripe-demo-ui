// src/components/SubscriptionForm.jsx
import React, { useState } from 'react';
import { axiosInstance } from '../axios';
import { Form, Input, Button, Card, Typography, notification } from 'antd';

const { Title } = Typography;

const SubscriptionForm = () => {
  const [customerId, setCustomerId] = useState('');
  const [loading, setLoading] = useState(false);

  const openNotification = (type, message, description) => {
    notification[type]({
      message,
      description,
    });
  };

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.post(
        '/payments/create-checkout-session',
        { customerId }
      );
      const data = await response.data;
      if (data.url) {
        window.location.href = data.url;
      } else {
        // setMessage(`Error: ${data.error}`);
        openNotification('error', 'Checkout Error', data.error);
      }
    } catch (error) {
      openNotification(
        'error',
        'Checkout Error',
        'Failed to create checkout session'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex justify-center items-center  bg-gray-100 p-4'>
      <Card className='w-full max-w-lg shadow-lg'>
        <Title level={2} className='text-center mb-4'>
          Subscribe
        </Title>
        <Form layout='vertical'>
          <Form.Item label='Customer ID' required>
            <Input
              placeholder='Enter Customer ID'
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
            />
          </Form.Item>
          <Form.Item>
            <Button
              type='primary'
              className='w-full'
              onClick={handleCheckout}
              loading={loading}
            >
              Checkout
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export { SubscriptionForm };
