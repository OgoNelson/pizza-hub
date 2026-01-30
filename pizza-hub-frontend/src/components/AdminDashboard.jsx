import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { formatCurrency } from '../utils/constants';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { token, logout } = useAuth();
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, ordersRes] = await Promise.all([
        adminAPI.getStats(token),
        adminAPI.getOrders(token),
      ]);
      setStats(statsRes.data.data);
      setOrders(ordersRes.data.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      if (error.response?.status === 401) {
        logout();
        navigate('/admin/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const handleMarkDelivered = async (orderId) => {
    try {
      await adminAPI.updateDeliveryStatus(orderId, token);
      fetchDashboardData();
    } catch (error) {
      console.error('Error updating delivery status:', error);
      alert('Failed to update delivery status');
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to delete this order?')) return;

    try {
      await adminAPI.deleteOrder(orderId, token);
      fetchDashboardData();
    } catch (error) {
      console.error('Error deleting order:', error);
      alert('Failed to delete order');
    }
  };

  const getFilteredOrders = () => {
    if (filter === 'all') return orders;
    if (filter === 'delivered') return orders.filter(order => order.deliveryStatus === 'delivered');
    if (filter === 'pending') return orders.filter(order => order.deliveryStatus === 'undelivered');
    return orders;
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div>
          <h1>Pizza Hub Admin</h1>
          <p>Welcome back!</p>
        </div>
        <button onClick={handleLogout} className="btn-logout">
          Logout
        </button>
      </header>

      {stats && (
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon total">📊</div>
            <div className="stat-info">
              <h3>Total Orders</h3>
              <p className="stat-value">{stats.totalOrders}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon delivered">✓</div>
            <div className="stat-info">
              <h3>Delivered</h3>
              <p className="stat-value">{stats.deliveredOrders}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon pending">⏱</div>
            <div className="stat-info">
              <h3>Pending</h3>
              <p className="stat-value">{stats.pendingOrders}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon revenue">💰</div>
            <div className="stat-info">
              <h3>Total Revenue</h3>
              <p className="stat-value">{formatCurrency(stats.totalRevenue)}</p>
            </div>
          </div>
        </div>
      )}

      <div className="orders-section">
        <div className="orders-header">
          <h2>Orders</h2>
          <div className="filter-buttons">
            <button
              className={filter === 'all' ? 'active' : ''}
              onClick={() => setFilter('all')}
            >
              All
            </button>
            <button
              className={filter === 'pending' ? 'active' : ''}
              onClick={() => setFilter('pending')}
            >
              Pending
            </button>
            <button
              className={filter === 'delivered' ? 'active' : ''}
              onClick={() => setFilter('delivered')}
            >
              Delivered
            </button>
          </div>
        </div>

        <div className="orders-list">
          {getFilteredOrders().length === 0 ? (
            <div className="no-orders">No orders found</div>
          ) : (
            getFilteredOrders().map(order => (
              <div key={order._id} className="order-card">
                <div className="order-header">
                  <div>
                    <h3>{order.fullName}</h3>
                    <p className="order-email">{order.email}</p>
                  </div>
                  <div className="order-status">
                    <span className={`status-badge ${order.deliveryStatus}`}>
                      {order.deliveryStatus}
                    </span>
                  </div>
                </div>

                <div className="order-details">
                  <div className="detail-item">
                    <span className="detail-label">Pizza:</span>
                    <span>{order.quantity}x {order.pizzaType} ({order.pizzaSize})</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Phone:</span>
                    <span>{order.phone}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Address:</span>
                    <span>{order.deliveryAddress}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Reference:</span>
                    <span className="reference">{order.paymentReference}</span>
                  </div>
                  <div className="detail-item total">
                    <span className="detail-label">Total:</span>
                    <span className="total-amount">{formatCurrency(order.totalPrice)}</span>
                  </div>
                </div>

                <div className="order-actions">
                  {order.deliveryStatus === 'undelivered' && (
                    <button
                      onClick={() => handleMarkDelivered(order._id)}
                      className="btn-deliver"
                    >
                      Mark as Delivered
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteOrder(order._id)}
                    className="btn-delete"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
