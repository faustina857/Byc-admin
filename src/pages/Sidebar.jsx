import React from 'react'
import './pages.css'

const Sidebar = ({ onButtonClick, activeContent }) => {
    const buttonItems = [
        {
            id: 0,
            name: 'Dashboard',
            las: 'lar la-chart-bar px-3',
            bname: 'dashboard'
        },
        {
            id: 1,
            name: 'Categories',
            las: 'las la-layer-group px-3',
            bname: 'categories'
        },
        {
            id: 2,
            name: 'Products',
            las: 'las la-file-upload px-3',
            bname: 'products'
        },
        {
            id: 3,
            name: 'Orders',
            las: 'las la-file-upload px-3',
            bname: 'orders'
        },
        {
            id: 4,
            name: 'Blogs',
            las: 'las la-user px-3',
            bname: 'blogs'
        },
        {
            id: 5,
            name: 'Customers',
            las: 'las la-user px-3',
            bname: 'customers'
        }
    ]


    const showMenu = buttonItems.map((item) => { 
        return <button key={item.id} className={activeContent === item.bname ? 'sidebar-menu button active': 'sidebar-menu button'} 
        onClick={() => { onButtonClick(item.bname)}}>
        <i className={item.las} style={{color: '#b6cc00'}} ></i>
        {item.name}
        </button>
    })

  return (
    <React.Fragment>
        <div className="sidebar">
            <div className="sidebar-menu">
                { showMenu }
            </div>
        </div>
        
    </React.Fragment>
  )
}

export default Sidebar
