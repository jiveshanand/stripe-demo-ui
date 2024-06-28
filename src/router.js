import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Customers from './pages/Customers';
import CustomerDetail from './components/CustomerDetail';
import CreateCustomerForm from './components/CreateCustomerForm';
import CheckoutForm from './pages/Checkout';
import Success from './pages/Success';

const AppRouter = () => (
  <Router>
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/customers' element={<Customers />} />
      <Route path='/customers/:id' element={<CustomerDetail />} />
      <Route path='/customer/create' element={<CreateCustomerForm />} />
      <Route path='/checkout' element={<CheckoutForm />} />
      <Route path='/success' element={<Success />} />
    </Routes>
  </Router>
);

export default AppRouter;
