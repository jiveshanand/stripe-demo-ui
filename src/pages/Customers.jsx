import React from 'react';
import { Layout, Typography } from 'antd';
import Navigation from '../components/Navigation';
import { CustomerList } from '../components/CustomerList';

const { Header, Content, Footer } = Layout;
const { Title } = Typography;

const Customers = () => (
  <Layout>
    <Header>
      <Navigation />
    </Header>
    <Content style={{ padding: '50px' }}>
      <Title>Customer List</Title>
      <CustomerList />
    </Content>
    <Footer style={{ textAlign: 'center' }}>
      ©2024 Created by Jivesh Anand
    </Footer>
  </Layout>
);

export default Customers;
