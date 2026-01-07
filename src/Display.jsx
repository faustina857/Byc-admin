import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './components/Login'
import Register from './components/Register'
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Blogs from './pages/Blogs';
import Customers from './pages/Customers';
import Orders from './pages/Orders';


const Display = () => {
  return (
    <React.Fragment>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Login />} />
          <Route path='register' element={<Register />} />
          <Route path='dashboard' element={<Dashboard />} />
          <Route path='products' element={<Products />} />
          <Route path='blogs' element={<Blogs />} />
          <Route path='customers' element={<Customers />} />
          <Route path='orders' element={<Orders />} />
        </Routes>
      </BrowserRouter>
    </React.Fragment>
  )
}

export default Display
