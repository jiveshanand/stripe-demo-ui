import React from 'react';
import { Button, Card, Typography } from 'antd';

const { Title, Paragraph } = Typography;

const Success = () => {
  return (
    <div className='flex justify-center items-center min-h-screen bg-gray-100'>
      <Card className='w-full max-w-lg p-6 shadow-lg'>
        <Title level={2} className='text-center mb-4'>
          Payment Successful!
        </Title>
        <Paragraph className='text-center'>
          Your payment was processed successfully. Thank you for your purchase!
        </Paragraph>
        <div className='flex justify-center mt-4'>
          <Button type='primary' href='/'>
            Go to Home
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Success;
