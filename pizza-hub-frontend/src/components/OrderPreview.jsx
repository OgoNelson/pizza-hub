import React from 'react';

const OrderPreview = ({ orderData, onProceed, onCancel }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
    }).format(price);
  };

  return (
    <div className="order-preview-container">
      <h2>Order Preview</h2>
      
      <div className="preview-details">
        <div className="detail-row">
          <span className="detail-label">Name:</span>
          <span className="detail-value">{orderData.fullName}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Email:</span>
          <span className="detail-value">{orderData.email}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Phone:</span>
          <span className="detail-value">{orderData.phone}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Delivery Address:</span>
          <span className="detail-value">{orderData.deliveryAddress}</span>
        </div>
      </div>
      
      <div className="pizza-details">
        <h3>Pizza Details</h3>
        
        <div className="detail-row">
          <span className="detail-label">Pizza Type:</span>
          <span className="detail-value">{orderData.pizzaType}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Size:</span>
          <span className="detail-value">{orderData.pizzaSize}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Quantity:</span>
          <span className="detail-value">{orderData.quantity}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Unit Price:</span>
          <span className="detail-value">{formatPrice(orderData.unitPrice)}</span>
        </div>
        <div className="detail-row total-row">
          <span className="detail-label">Total Price:</span>
          <span className="detail-value total-price">{formatPrice(orderData.totalPrice)}</span>
        </div>
      </div>
      
      <div className="preview-actions">
        <button onClick={onProceed} className="proceed-btn">
          Proceed to Payment
        </button>
        <button onClick={onCancel} className="cancel-btn">
          Back to Form
        </button>
      </div>
      
      <style jsx>{`
        .order-preview-container {
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
          font-family: Arial, sans-serif;
        }
        
        .preview-details {
          background-color: #f8f9fa;
          padding: 20px;
          border-radius: 8px;
          margin-bottom: 20px;
        }
        
        .detail-row {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          border-bottom: 1px solid #eee;
        }
        
        .detail-label {
          font-weight: bold;
          color: #333;
        }
        
        .detail-value {
          color: #555;
        }
        
        .pizza-details {
          background-color: #e9ecef;
          padding: 20px;
          border-radius: 8px;
          margin-bottom: 20px;
        }
        
        .total-row {
          border-bottom: none;
          font-weight: bold;
        }
        
        .total-price {
          color: #28a745;
          font-size: 18px;
        }
        
        .preview-actions {
          display: flex;
          justify-content: space-between;
          margin-top: 20px;
        }
        
        .proceed-btn,
        .cancel-btn {
          padding: 12px 20px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-weight: bold;
        }
        
        .proceed-btn {
          background-color: #007bff;
          color: white;
        }
        
        .cancel-btn {
          background-color: #6c757d;
          color: white;
        }
      `}</style>
    </div>
  );
};

export default OrderPreview;