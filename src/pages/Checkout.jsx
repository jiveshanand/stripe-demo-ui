import React from 'react';
import { Layout, Typography } from 'antd';
import Navigation from '../components/Navigation';
import CheckoutForm from '../PaymentForm';

const { Header, Content, Footer } = Layout;
const { Title } = Typography;

const Checkout = () => (
  <Layout>
    <Header>
      <Navigation />
    </Header>
    <Content style={{ padding: '50px' }}>
      <Title>Checkout</Title>
      <CheckoutForm />
    </Content>
    <Footer style={{ textAlign: 'center' }}>
      ©2024 Created by Jivesh Anand
    </Footer>
  </Layout>
);

export default Checkout;
