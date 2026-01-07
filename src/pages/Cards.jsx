import React, { useEffect, useState } from "react";
import axios from "axios";
import "./pages.css";

const Cards = () => {
  const [stats, setStats] = useState({
    categories: 0,
    products: 0,
    orders: 0,
    customers: 0,
    blogs: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const token = localStorage.getItem("adminToken");
        const headers = {
          "x-auth-token": token,
        };

        const [
          categoriesRes,
          productsRes,
          ordersRes,
          customersRes,
          blogsRes,
        ] = await Promise.all([
          axios.get(
            "http://localhost:3001/api/byc-stores/category/get-all-categories",
            { headers }
          ),
          axios.get(
            "http://localhost:3001/api/byc-stores/product/get-all-products",
            { headers }
          ),
          axios.get(
            "http://localhost:3001/api/byc-stores/order/get-all-orders",
            { headers }
          ),
          axios.get(
            "http://localhost:3001/api/byc-stores/customer/get-all-customers",
            { headers }
          ),
          axios.get(
            "http://localhost:3001/api/byc-stores/blog/get-all-blogs",
            { headers }
          ),
        ]);

        setStats({
          categories: categoriesRes.data.length,
          products: productsRes.data.length,
          orders: ordersRes.data.length,
          customers: customersRes.data.length,
          blogs: blogsRes.data.length,
        });
      } catch (err) {
        setError(err.message || "Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  const cardItems = [
    {
      id: 1,
      icon: "las la-clipboard-list",
      label: "Total Categories",
      value: stats.categories,
    },
    {
      id: 2,
      icon: "las la-layer-group",
      label: "Total Products",
      value: stats.products,
    },
    {
      id: 3,
      icon: "las la-shopping-cart",
      label: "Total Orders",
      value: stats.orders,
    },
    {
      id: 4,
      icon: "las la-users",
      label: "Total Customers",
      value: stats.customers,
    },
    {
      id: 5,
      icon: "las la-blog",
      label: "Total Blogs",
      value: stats.blogs,
    },
  ];

  if (loading) return <p>Loading dashboard...</p>;
  if (error) return <p className="text-danger">{error}</p>;

  return (
    <div className="card-container">
      <div className="dash-cards">
        {cardItems.map((item) => (
          <div className="card-single mb-3" key={item.id}>
            <div className="card-body">
              <span
                className={item.icon}
                style={{ color: "#b6cc00", fontSize: "32px" }}
              ></span>
              <div className="d-flex justify-content-between">
                <h6>{item.label}</h6>
                <span>{item.value}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Cards;
