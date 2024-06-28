import React from 'react';
import { Menu } from 'antd';
import { Link } from 'react-router-dom';

const Navigation = () => (
  <Menu mode='horizontal' theme='dark'>
    <Menu.Item key='home'>
      <Link to='/'>Home</Link>
    </Menu.Item>
    <Menu.Item key='customers'>
      <Link to='/customers'>Customers</Link>
    </Menu.Item>
  </Menu>
);

export default Navigation;
