import React from 'react';
import { Layout, Typography } from 'antd';
import Navigation from '../components/Navigation';

const { Header, Content, Footer } = Layout;
const { Title, Paragraph } = Typography;

const Home = () => (
  <Layout>
    <Header>
      <Navigation />
    </Header>
    <Content style={{ padding: '50px' }}>
      <Title>Welcome to the Home Page</Title>
      <Paragraph>
        To get started, click on "Customers" in the navigation bar.
      </Paragraph>
    </Content>
    <Footer style={{ textAlign: 'center' }}>
      ©2024 Created by Jivesh Anand
    </Footer>
  </Layout>
);

export default Home;
