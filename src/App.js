import React from 'react';
import CreateCustomerForm from './components/CreateCustomerForm';
import { Layout } from 'antd';
import Navigation from './components/Navigation';

const { Header, Content, Footer } = Layout;

const App = () => {
  return (
    <Layout>
      <Header>
        <Navigation />
      </Header>
      <Content style={{ padding: '50px' }}>
        <h1>Welcome to the Home Page</h1>
      </Content>
      <Footer style={{ textAlign: 'center' }}>
        ©2024 Created by Jivesh Anand
      </Footer>
    </Layout>
  );
};

export default App;
