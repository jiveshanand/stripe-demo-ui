import React, { useState } from 'react';
import {
  Layout,
  notification,
  Typography,
  Button,
  Space,
  Input,
  Modal,
  Card,
} from 'antd';
import Navigation from '../components/Navigation';
import { axiosInstance } from '../axios';
import { useNavigate } from 'react-router-dom';

const { Header, Content, Footer } = Layout;
const { Title, Text } = Typography;

const CreateCustomerForm = () => {
  const navigate = useNavigate();
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerId, setCustomerId] = useState('');
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);

  const createCustomer = async () => {
    try {
      const response = await axiosInstance.post('customers/create', {
        customerName,
        customerEmail,
      });

      if (response?.data?.customerId) {
        setCustomerId(response?.data?.customerId);
        setIsConfirmationModalOpen(true);
        notification.success({
          message: 'Customer Created',
          description: (
            <p>
              The customer with customerId{' '}
              <Text strong type='success'>
                {response?.data?.customerId}
              </Text>{' '}
              has been successfully created.
            </p>
          ),
        });
      }
    } catch (error) {
      const messages = (
        <ol>
          {typeof error?.response?.data?.message === 'object' ? (
            error.response.data.message.map((err) => <li key={err}>{err}</li>)
          ) : (
            <div>{error?.response?.data?.message}</div>
          )}
        </ol>
      );

      console.error('Error creating customer:', error);
      notification.error({
        message: 'Creation Failed',
        description: messages,
      });
    }
  };

  return (
    <Layout className='min-h-screen'>
      <Header className='bg-gray-800'>
        <Navigation />
      </Header>
      <Content className='p-8 bg-gray-100 flex justify-center items-center'>
        <div className='w-full max-w-md'>
          <Card className='shadow-lg p-6'>
            <Title level={2} className='text-center mb-4'>
              Add New Customer
            </Title>
            <Space direction='vertical' className='w-full'>
              <Input
                value={customerName}
                placeholder='Enter Customer Name'
                onChange={(e) => {
                  setCustomerName(e.target.value);
                }}
              />
              <Input
                value={customerEmail}
                placeholder='Enter Customer Email'
                onChange={(e) => {
                  setCustomerEmail(e.target.value);
                }}
              />
              <Button
                type='primary'
                onClick={createCustomer}
                className='w-full'
              >
                Add New Customer
              </Button>
            </Space>
          </Card>
        </div>
      </Content>
      <Footer className='text-center bg-gray-800 text-white'>
        ©2024 Created by Jivesh Anand
      </Footer>

      <Modal
        title='Customer Created Successfully'
        visible={isConfirmationModalOpen}
        onCancel={() => setIsConfirmationModalOpen(false)}
        footer={null}
      >
        <div className='flex flex-col items-center'>
          <p>
            Here is the customer ID:{' '}
            <Typography.Text mark>{customerId}</Typography.Text>
          </p>
          <Button
            type='primary'
            onClick={() => navigate('/customers')}
            className='mt-4'
          >
            Navigate to Customer List
          </Button>
        </div>
      </Modal>
    </Layout>
  );
};

export default CreateCustomerForm;
