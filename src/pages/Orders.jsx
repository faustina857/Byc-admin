import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { ShoppingCart } from "lucide-react";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setShowModal(true)
  };

  const handleClose = () => {
    setSelectedOrder(null);
    setShowModal(false)
  };

  const token = localStorage.getItem("adminToken");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get(
        "http://localhost:3001/api/byc-stores/order/get-all-orders",
        {
          headers: { "x-auth-token": token },
        }
      );
      setOrders(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };


  const handlePaymentChange = async (orderId, newStatus) => {
    try {
      await axios.put(
        `http://localhost:3001/api/byc-stores/order/update-payment-status/${orderId}`,
        { paymentStatus: newStatus,
            headers:{
                 "x-auth-token": token 
            }
         }
      );
      fetchOrders();
    } catch (err) {
     Swal.fire(
        "Error",
        err.response?.data?.message || "Update failed",
        "error"
      );
    } 
  };

  const handleUpdateDeliveryStatus = async (orderId, status) => {

    try {
      await axios.put(
        `http://localhost:3001/api/byc-stores/order/update-delivery-status/${orderId}`,
        { deliveryStatus: status },
        {
          headers: { "x-auth-token": token },
        }
      );

      Swal.fire("Updated!", "Delivery status updated", "success");
      fetchOrders();
    } catch (err) {
      Swal.fire(
        "Error",
        err.response?.data?.message || "Update failed",
        "error"
      );
    }
  };

  if (loading) return <p>Loading orders...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="orders-page">
      <h2>Orders</h2>
      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card shadow-sm border-0">
            <div className="card-body d-flex justify-content-between align-items-center">
              <div>
                <p className="text-muted mb-1">Total Orders</p>
                <h3 className="fw-bold">{orders.length}</h3>
              </div>
              <ShoppingCart size={32} color="#3b82f6" />
            </div>
          </div>
        </div>
      </div>

      <div className="table-wrapper">
        <table className="orders-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Customer's email</th>
              <th>Total (₦)</th>
              <th>Payment Method</th>
              <th>Payment Status</th>
              <th>Delivery Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order,index) => (
              <tr key={order._id}>
                <td>{index}</td>
                <td>{order._id.slice(-6)}</td>
                <td>{order.customerSnapshot?.fullName}</td>
                <td>{order.customerSnapshot?.emailAddress}</td>
                <td>₦{order.totalAmount}</td>

                <td>
                  <span className="method-badge">
                    {order.paymentMethod}
                  </span>
                </td>

                <td>
                  <select className="form-select form-select-sm"
                  value={order.paymentStatus}
                  onChange={(e) => handlePaymentChange(order._id, e.target.value)}>
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="failed">Failed</option>
                    <option value="refunded">Refunded</option>
                  </select>
                </td>

                <td>
                  <select className="form-select form-select-sm"
                    value={order.deliveryStatus}
                    onChange={(e) =>
                      handleUpdateDeliveryStatus(order._id, e.target.value)
                    }
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>

                <td>
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
                <td>
                    <button style={{backgroundColor:'#BD3A3A',color:'#fff'}} 
                        className="btn" onClick={() => handleViewDetails(order)}>
                            View Details
                    </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

        {showModal && selectedOrder && (
        <div className="modal d-block">
            <div className="modal-dialog modal-md">
            <div className="modal-content">
                <div className="modal-header" style={{backgroundColor:'#BD3A3A'}}>
                <h5 className="modal-title">Order Details</h5>
                </div>
             <div className="modal-body">
                {selectedOrder ? (
                <>
                  <p><strong>Order ID:</strong> {selectedOrder._id}</p>
                  <p><strong>Customer:</strong> {selectedOrder.customerSnapshot.fullName}</p>
                  <p><strong>Email:</strong> {selectedOrder.customerSnapshot.emailAddress}</p>
                  <p><strong>Phone:</strong> {selectedOrder.customerSnapshot.phone}</p>
                  <p>
                    <strong>Address:</strong> {selectedOrder.customerSnapshot.address}, {selectedOrder.customerSnapshot.city}, {selectedOrder.customerSnapshot.state}, {selectedOrder.customerSnapshot.country}
                  </p>
                  <p><strong>Payment Status:</strong> {selectedOrder.paymentStatus}</p>
                  <p><strong>Delivery Status:</strong> {selectedOrder.deliveryStatus}</p>
                  <p><strong>Total Amount:</strong> ₦{selectedOrder.totalAmount}</p>

                  <h6>Items</h6>
                  <table className="table table-sm table-bordered">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Color</th>
                        <th>Size</th>
                        <th>Qty</th>
                        <th>SubTotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedOrder.items.map((item) => (
                        <tr key={item.productId}>
                          <td>{item.name}</td>
                          <td>{item.color}</td>
                          <td>{item.size}</td>
                          <td>{item.quantity}</td>
                          <td>₦{item.subTotal || item.price * item.quantity}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </>
              ) : (
                <p>Loading...</p>
              )}

      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={handleClose}>Close</button>
      </div>
    </div>
  </div>
        </div>
         )}
    </div>
  );
};

export default Orders;
