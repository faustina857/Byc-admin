import React, { useState, useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis,CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell} from 'recharts';
import { Banknote, ShoppingCart, Package, AlertCircle } from 'lucide-react';

const OrderAnalytics = ({ orders = [] }) => {
  const [timeRange, setTimeRange] = useState('week');

//   process data
  const { chartData, statusData } = useMemo(() => {
    if (!orders.length) {
      return { chartData: [], statusData: [] };
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const cutoffDate =
      timeRange === 'week'
        ? new Date(today.getTime() - 6 * 24 * 60 * 60 * 1000)
        : new Date(today.getTime() - 29 * 24 * 60 * 60 * 1000);

    // Filter orders by date
    const filteredOrders = orders.filter(order => {
      const date = new Date(order.createdAt);
      return !isNaN(date) && date >= cutoffDate;
    });

    // Group orders
    const grouped = {};

    filteredOrders.forEach(order => {
      const date = new Date(order.createdAt);
      const key =
        timeRange === 'week'
          ? date.toLocaleDateString('en-US', { weekday: 'short' })
          : `Week ${Math.ceil(date.getDate() / 7)}`;

      if (!grouped[key]) {
        grouped[key] = { date: key, orders: 0, revenue: 0 };
      }

      grouped[key].orders += 1;
      grouped[key].revenue += Number(order.totalAmount) || 0;
    });

    // Ensure empty days/weeks show as 0
    const keys =
      timeRange === 'week'
        ? Array.from({ length: 7 }).map((_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - i);
            return d.toLocaleDateString('en-US', { weekday: 'short' });
          }).reverse()
        : ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5'];

    const chartData = keys.map(key => ({
      date: key,
      orders: grouped[key]?.orders || 0,
      revenue: grouped[key]?.revenue || 0
    }));

    // Status data
    const statusCount = {};
    orders.forEach(order => {
      const status = order.deliveryStatus || 'pending';
      statusCount[status] = (statusCount[status] || 0) + 1;
    });

    const statusData = [
      { name: 'Delivered', value: statusCount.delivered || 0, color: 'green' },
      { name: 'Shipped', value: statusCount.shipped || 0, color: '#3b82f6' },
      { name: 'Pending', value: statusCount.pending || 0, color: '#BD3A3A' },
      { name: 'Processing', value: statusCount.processing || 0, color: 'yellow' },
      { name: 'Cancelled', value: statusCount.cancelled || 0, color: 'red' }
    ].filter(item => item.value > 0);

    return { chartData, statusData };
  }, [orders, timeRange]);

  const totalOrders = orders.length;
  const totalRevenue = orders.reduce(
    (sum, o) => sum + (Number(o.totalAmount) || 0),
    0
  );
  const totalItems = orders.reduce(
    (sum, o) => sum + (o.items?.length || 0),
    0
  );

  return (
    <div className="container-fluid p-4" style={{ background: '#f8f9fa' }}>
      <h2 className="mb-4 fw-bold">Order Analytics</h2>

      {/* STATS */}
      <div className="row mb-4">
        <StatCard title="Total Orders" value={totalOrders} Icon={ShoppingCart} />
        <StatCard title="Total Revenue" value={`₦${totalRevenue}`} Icon={Banknote} />
        <StatCard title="Total Items" value={totalItems} Icon={Package} />
      </div>

      <div className="row">
        {/* BAR CHART */}
        <div className="col-lg-8 mb-4">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <div className="d-flex justify-content-between mb-3">
                <h5 className="fw-semibold">Orders & Revenue</h5>
                <select
                  className="form-select form-select-sm w-auto"
                  value={timeRange}
                  onChange={e => setTimeRange(e.target.value)}
                >
                  <option value="week">Last 7 Days</option>
                  <option value="month">Last 30 Days</option>
                </select>
              </div>

              {chartData.length ? (
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="orders" fill="#3b82f6" />
                    <Bar dataKey="revenue" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center text-muted py-5">
                  <AlertCircle size={40} />
                  <p>No order data available</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* PIE CHART */}
        <div className="col-lg-4">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h5 className="fw-semibold mb-3">Delivery Status</h5>

              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={statusData} dataKey="value" outerRadius={70} label>
                    {statusData.map((item, i) => (
                      <Cell key={i} fill={item.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, Icon }) => (
  <div className="col-md-4 mb-3">
    <div className="card shadow-sm border-0">
      <div className="card-body d-flex justify-content-between align-items-center">
        <div>
          <p className="text-muted mb-1">{title}</p>
          <h4 className="fw-bold">{value}</h4>
        </div>
        <Icon size={28} color="#b6cc00" />
      </div>
    </div>
  </div>
);

export default OrderAnalytics;
