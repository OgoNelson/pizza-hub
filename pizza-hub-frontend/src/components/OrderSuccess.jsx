import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './OrderSuccess.css';

const OrderSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { orderData, reference } = location.state || {};

  const handleNewOrder = () => {
    navigate('/');
  };

  const formatCurrency = (amount) => {
    if (!amount) return '₦0';
    return `₦${Number(amount).toLocaleString()}`;
  };

  return (
    <div className="success-container">
      <div className="success-card">
        <div className="success-icon">✓</div>
        <h1 className="success-title">Order Successful!</h1>
        <p className="success-message">
          Thank you for your order. We'll deliver your delicious pizza soon!
        </p>

        <div className="order-details">
          <h2 className="details-title">Order Details</h2>

          <div className="detail-row">
            <span className="detail-label">Order Reference:</span>
            <span className="detail-value">{reference}</span>
          </div>

          <div className="detail-row">
            <span className="detail-label">Name:</span>
            <span className="detail-value">{orderData?.fullName}</span>
          </div>

          <div className="detail-row">
            <span className="detail-label">Email:</span>
            <span className="detail-value">{orderData?.email}</span>
          </div>

          <div className="detail-row">
            <span className="detail-label">Pizza:</span>
            <span className="detail-value">
              {orderData?.quantity}x {orderData?.pizzaType} ({orderData?.pizzaSize})
            </span>
          </div>

          <div className="detail-row">
            <span className="detail-label">Delivery Address:</span>
            <span className="detail-value">{orderData?.deliveryAddress}</span>
          </div>

          <div className="detail-row total">
            <span className="detail-label">Total Paid:</span>
            <span className="detail-value">
              {orderData?.totalPrice ? formatCurrency(orderData.totalPrice) :
               orderData?.amountPaid ? formatCurrency(orderData.amountPaid) : 'N/A'}
            </span>
          </div>
        </div>

        <div className="success-actions">
          <button onClick={handleNewOrder} className="btn-primary">
            Place Another Order
          </button>
        </div>

        <div className="order-note">
          <p>
            <strong>Important:</strong> Save your order reference ({reference}) for tracking.
            You'll receive an email confirmation shortly.
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
