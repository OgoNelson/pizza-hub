import React from "react";
import "../styles/OrderPreview.css";

/**
 * Order data shape
 */
interface OrderData {
  fullName: string;
  email: string;
  phone: string;
  deliveryAddress: string;
  pizzaType: string;
  pizzaSize: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

/**
 * Component props
 */
interface OrderPreviewProps {
  orderData: OrderData;
  onProceed: () => void;
  onCancel: () => void;
}

const OrderPreview: React.FC<OrderPreviewProps> = ({
  orderData,
  onProceed,
  onCancel,
}) => {
  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
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
          <span className="detail-value">
            {formatPrice(orderData.unitPrice)}
          </span>
        </div>

        <div className="detail-row total-row">
          <span className="detail-label">Total Price:</span>
          <span className="detail-value total-price">
            {formatPrice(orderData.totalPrice)}
          </span>
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
    </div>
  );
};

export default OrderPreview;
