import React from 'react';
import ReactDOM from 'react-dom/client';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import './index.css';
// import App from './App';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import reportWebVitals from './reportWebVitals';
// import { CustomerList } from './customers/Customers';
import './index.css';
import './tailwind.css';
import AppRouter from './router';

const App = () => <AppRouter />;

const stripePromise = loadStripe(
  'pk_test_51PRH4lK28JpGLXfjAbtt9bNEk5Wbh8LEwAW6PBV4inaW9LTAobsJNQL81N2YNiAg2EwbMeOWmSLqoW1X5sRD1j1d00zGOmLtsz'
);

// const router = createBrowserRouter([
//   {
//     path: '/',
//     element: <App />,
//   },
//   {
//     path: '/customers',
//     element: <CustomerList />,
//   },
// ]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
  <Elements stripe={stripePromise}>
    <AppRouter />
  </Elements>
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
