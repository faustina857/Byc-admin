
# Byc-admin dashboard
A responsive admin dashboard for managing the BYC e-commerce platform, including users, products, orders, and payments, built with React and Vite.

## Features

- Secure admin-only login with JWT authentication
- Role-based access control — non-admin users are blocked at login
- Full CRUD operations for managing store data
- Responsive UI with clean layout
- Payment monitoring (Paystack integration)

## Tech Stack

- **Frontend:** React.js, React Router, Axios, CSS, Bootstrap
- **Auth:** JWT (stored in localStorage)
- **Backend API:** Node.js / Express (hosted on Render)


# Folder structure

Byc-admin/
├── src/
│   ├── assets/              # Images, fonts, icons, etc.
│   │   ├── index.jsx
│   │   └── images/
│   ├── components/          # Reusable UI components
│   │   ├── Login.jsx
│   │   ├── OrderAnalytics.jsx
│   │   ├── Register.jsx
│   │   └── style.css
│   ├── pages/               # Pages
│   │   ├── Blogs.jsx
│   │   ├── Cards.jsx
│   │   ├── Category.jsx
│   │   ├── Customers.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Details.jsx
|   |   ├── Orders.jsx
|   |   ├── pages.css
|   |   ├── Products.jsx
│   │   └── Sidebar.jsx
│   ├── App.test.js        
│   ├── App.jsx
│   ├── Display.jsx    
│   ├── index.js        
│   ├── main.jsx            
│   ├── reportWebVital.js           
│   └── setupTests.js         
├── .gitignore
├── index.html
├── package-lock.json
├── package.json
├── vite.config.js
└── README.md

## Live Demo
https://byc-admin-three.vercel.app/

> **Demo credentials**
> Email: `faustinaifunanya03@gmail.com`
> Password: `33655884`
>
> Click **"Use Demo Account"** on the login page to auto-fill credentials, then click Login.

## Getting Started

### Installation

```bash
git clone https://github.com/faustina857/Byc-admin.git
cd Byc-admin
npm install
npm start
```

## Author

**Faustina**
