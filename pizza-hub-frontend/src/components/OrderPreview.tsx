import React from "react";
import type { OrderData } from "../types";
import "../styles/OrderPreview.css";

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
  const formatPrice = (price: number): string =>
    new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(price);

  return (
    <div className="order-preview-container">
      <h2>Order Preview</h2>

      <p>
        <strong>Name:</strong> {orderData.fullName}
      </p>
      <p>
        <strong>Email:</strong> {orderData.email}
      </p>
      <p>
        <strong>Phone:</strong> {orderData.phone}
      </p>
      <p>
        <strong>Delivery Address:</strong> {orderData.deliveryAddress}
      </p>
      <p>
        <strong>Pizza:</strong> {orderData.pizzaType}
      </p>
      <p>
        <strong>Size:</strong> {orderData.pizzaSize}
      </p>
      <p>
        <strong>Quantity:</strong> {orderData.quantity}
      </p>
      <p>
        <strong>Unit Price:</strong> {formatPrice(orderData.unitPrice)}
      </p>
      <p>
        <strong>Total:</strong> {formatPrice(orderData.totalPrice)}
      </p>

      <div className="preview-actions">
        <button onClick={onProceed}>Proceed to Payment</button>
        <button onClick={onCancel}>Back to Form</button>
      </div>
    </div>
  );
};

export default OrderPreview;
