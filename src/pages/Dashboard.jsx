import React, { useState, useEffect } from 'react'
import Sidebar from './Sidebar'
import Cards from './Cards'
import Category from './Category'
import './pages.css'
import Products from './Products'
import Blogs from './Blogs'
import Customers from './Customers'
import Orders from './Orders'
import OrderAnalytics from '../components/OrderAnalytics'
import axios from 'axios'

const Dashboard = () => {
  const [activeContent, setActiveContent] = useState('dashboard');
  const [orders, setOrders] = useState([]);

  const handleButtonClick = (content) => {
    setActiveContent(content);
  };

   useEffect(() => {
    axios.get('http://localhost:3001/api/byc-stores/order/get-all-orders') 
      .then(res => {
        setOrders(res.data);
      })
      .catch(err => console.error('Failed to fetch orders:', err));
  }, []);

  return (
    <React.Fragment>
      <Sidebar onButtonClick={handleButtonClick} activeContent={activeContent}/>
      <div className="main-content mt-5 p-3">
          <header>
            <i className="las la-bars">Admin Dashboard</i>
          </header>
          {activeContent === 'dashboard' && (
            <>
          <Cards />
          <OrderAnalytics orders={orders}/>
          </>) }
          {activeContent === 'categories' && <Category />}
          {activeContent === 'products' && <Products />}
          {activeContent === 'blogs' && <Blogs />}
          {activeContent === 'customers' && <Customers />}
          {activeContent === 'orders' && <Orders />}

      </div>
    </React.Fragment>
  )
}

export default Dashboard
