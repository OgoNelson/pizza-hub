import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/AdminDashboard.css";

interface Order {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  pizzaType: string;
  pizzaSize: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  deliveryAddress: string;
  paymentReference: string;
  amountPaid: number;
  paymentStatus: string;
  deliveryStatus: string;
  createdAt: string;
  updatedAt: string;
}

interface OrderStats {
  totalOrders: number;
  deliveredOrders: number;
  pendingOrders: number;
  totalRevenue: number;
  deliveryRate: number;
}

const AdminDashboard: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<OrderStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      window.location.href = "/admin/login";
      return;
    }

    const fetchOrders = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/admin/orders",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setOrders(response.data.data);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError("Failed to fetch orders");
      }
    };

    const fetchStats = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/admin/stats",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setStats(response.data.data);
      } catch (err) {
        console.error("Error fetching stats:", err);
        setError("Failed to fetch statistics");
      }
    };

    fetchOrders();
    fetchStats();
    setIsLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminInfo");
    window.location.href = "/admin/login";
  };

  const handleUpdateDeliveryStatus = async (orderId: string) => {
    try {
      const token = localStorage.getItem("adminToken");
      await axios.patch(
        `http://localhost:3000/api/admin/orders/${orderId}/deliver`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Refresh orders after update
      const response = await axios.get(
        "http://localhost:3000/api/admin/orders",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setOrders(response.data.data);
    } catch (err) {
      console.error("Error updating delivery status:", err);
      setError("Failed to update delivery status");
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (!window.confirm("Are you sure you want to delete this order?")) {
      return;
    }

    try {
      const token = localStorage.getItem("adminToken");
      await axios.delete(`http://localhost:3000/api/admin/orders/${orderId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Refresh orders after deletion
      const response = await axios.get(
        "http://localhost:3000/api/admin/orders",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setOrders(response.data.data);
    } catch (err) {
      console.error("Error deleting order:", err);
      setError("Failed to delete order");
    }
  };

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(price);
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <div className="admin-dashboard">
      <header className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <div className="header-actions">
          <span>Welcome, Admin!</span>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </header>

      {error && <div className="error-message">{error}</div>}

      <div className="dashboard-content">
        <div className="stats-section">
          <h2>Order Statistics</h2>
          {stats ? (
            <div className="stats-grid">
              <div className="stat-card">
                <h3>Total Orders</h3>
                <p className="stat-value">{stats.totalOrders}</p>
              </div>
              <div className="stat-card">
                <h3>Delivered Orders</h3>
                <p className="stat-value">{stats.deliveredOrders}</p>
              </div>
              <div className="stat-card">
                <h3>Pending Orders</h3>
                <p className="stat-value">{stats.pendingOrders}</p>
              </div>
              <div className="stat-card">
                <h3>Total Revenue</h3>
                <p className="stat-value">{formatPrice(stats.totalRevenue)}</p>
              </div>
              <div className="stat-card">
                <h3>Delivery Rate</h3>
                <p className="stat-value">{stats.deliveryRate.toFixed(1)}%</p>
              </div>
            </div>
          ) : (
            <div className="loading">Loading statistics...</div>
          )}
        </div>

        <div className="orders-section">
          <h2>Recent Orders</h2>
          {isLoading ? (
            <div className="loading">Loading orders...</div>
          ) : (
            <div className="orders-table">
              <table>
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Pizza</th>
                    <th>Size</th>
                    <th>Quantity</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id}>
                      <td>{order._id}</td>
                      <td>{order.fullName}</td>
                      <td>{order.pizzaType}</td>
                      <td>{order.pizzaSize}</td>
                      <td>{order.quantity}</td>
                      <td>{formatPrice(order.totalPrice)}</td>
                      <td>
                        <span className={`status ${order.paymentStatus}`}>
                          {order.paymentStatus}
                        </span>
                      </td>
                      <td>
                        <span className={`status ${order.deliveryStatus}`}>
                          {order.deliveryStatus}
                        </span>
                      </td>
                      <td>{formatDate(order.createdAt)}</td>
                      <td>
                        <div className="action-buttons">
                          {order.deliveryStatus === "undelivered" && (
                            <button
                              onClick={() =>
                                handleUpdateDeliveryStatus(order._id)
                              }
                              className="deliver-btn"
                            >
                              Mark Delivered
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteOrder(order._id)}
                            className="delete-btn"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
