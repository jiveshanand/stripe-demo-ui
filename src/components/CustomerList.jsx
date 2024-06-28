import { useEffect, useCallback, useState } from 'react';
import { Button, Table, Space, Typography, Alert, Card } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { axiosInstance } from '../axios';
import useCustomerStore from '../store/customStore';

const { Text } = Typography;

function CustomerList(props) {
  const [customers, setCustomers] = useState([]);
  const { setSelectedCustomer: setGlobalSelectedCustomer } = useCustomerStore();
  const navigate = useNavigate();

  const getCustomerList = useCallback(async () => {
    const response = await axiosInstance.get('/customers/list');
    setCustomers(response?.data?.data);
  }, []);

  useEffect(() => {
    getCustomerList();
  }, [getCustomerList]);

  const createSetUpIntent = useCallback(async (customerId) => {
    const setupIntentResponse = await axiosInstance.post(
      `/customers/setup-intent/${customerId}`
    );
    const setupIntentData = setupIntentResponse?.data;
    return setupIntentData;
  }, []);

  const renderName = (text, record) => (
    <Link
      to={`/customers/${record.id}`}
      onClick={async () => {
        const setupIntentData = await createSetUpIntent(record?.id);
        console.log(setupIntentData, record);
        if (setupIntentData?.client_secret && record?.id) {
          setGlobalSelectedCustomer({
            ...record,
            paymentIntentSecret: setupIntentData?.client_secret,
          });
        }
      }}
    >
      {text}
    </Link>
  );

  const renderCheckout = (text, record) => (
    <Link
      to={`/checkout`}
      onClick={() => {
        setGlobalSelectedCustomer({
          ...record,
        });
      }}
    >
      {text}
    </Link>
  );

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: renderName,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Customer Id',
      dataIndex: 'id',
      key: 'id',
      render: renderCheckout,
    },
  ];

  return (
    <div className='p-4'>
      <Card className='mb-4'>
        <Alert
          message={
            <div>
              <Text strong>Instructions:</Text>
              <br />
              <Text>
                Click on the <Text strong>Name</Text> of any record in the list
                to navigate to the payment intent and custom payment charges
                page.
              </Text>
              <br />
              <Text>
                Click on the <Text strong>Customer Id</Text> to navigate to the
                checkout page and complete the payment with different methods.
              </Text>
            </div>
          }
          type='info'
          showIcon
        />
      </Card>
      <Space direction='vertical' style={{ width: '100%' }}>
        <Button
          type='primary'
          style={{ marginBottom: 16 }}
          onClick={() => navigate('/customer/create')}
        >
          Add Customer
        </Button>
        {customers && customers.length > 0 && (
          <Table dataSource={customers} columns={columns} />
        )}
      </Space>
    </div>
  );
}

export { CustomerList };
