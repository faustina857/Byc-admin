import React, { useEffect, useState } from "react";
import axios from "axios";

const Customers = () => {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:3001/api/byc-stores/customer/get-all-customers",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setCustomers(data);
      } catch (err) {
        console.error("Failed to load customers", err);
      }
    };

    fetchCustomers();
  }, []);

  return (
    <div className="customers">
      <h2>Customers</h2>
       <div className="table-wrapper">
          <table className="customers-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Email</th>
            <th>Address</th>
            <th>City</th>
            <th>State</th>
            <th>Country</th>
            <th>Landmark</th>
            <th>Phone no.</th>
          </tr>
        </thead>

        <tbody>
          {customers.map((customer, index) => (
            <tr key={customer._id}>
              <td>{index + 1}</td>
              <td>{customer.fullName}</td>
              <td>{customer.emailAddress}</td>
              <td>{customer.address}</td>
              <td>{customer.city}</td>
              <td>{customer.state}</td>
              <td>{customer.country}</td>
              <td>{customer.landMark}</td>
              <td>{customer.phone}</td>
            </tr>
          ))}
        </tbody>
      </table>
       </div>
     
    </div>
  );
};

export default Customers;
