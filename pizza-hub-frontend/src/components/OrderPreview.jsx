import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { PaystackPop } from '@paystack/inline-js';
import { paymentAPI } from '../services/api';
import './OrderPreview.css';

const OrderPreview = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { orderData } = location.state || {};

  if (!orderData) {
    navigate('/');
    return null;
  }

  const handlePayment = async () => {
    const paystackPublicKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY;

    if (!paystackPublicKey || paystackPublicKey === 'your_paystack_public_key_here') {
      alert('Paystack public key not configured. Please check your .env file.');
      return;
    }

    try {
      // Initialize payment
      const initResponse = await paymentAPI.init(orderData);
      const { authorization_url, reference } = initResponse.data.data.data;

      // Open Paystack popup
      const popup = PaystackPop.setup({
        key: paystackPublicKey,
        email: orderData.email,
        amount: orderData.totalPrice * 100, // Convert to kobo
        reference: reference,
        onClose: () => {
          console.log('Payment closed');
        },
        callback: async (response) => {
          try {
            // Verify payment
            await paymentAPI.verify(response.reference);

            // Create order
            const finalOrderData = {
              ...orderData,
              paymentReference: response.reference,
              amountPaid: orderData.totalPrice,
            };
            await paymentAPI.createOrder(finalOrderData);

            // Navigate to success page
            navigate('/success', {
              state: {
                orderData: finalOrderData,
                reference: response.reference,
              },
            });
          } catch (error) {
            console.error('Error processing payment:', error);
            alert('Payment verification failed. Please contact support.');
          }
        },
      });

      popup.openIframe();
    } catch (error) {
      console.error('Error initializing payment:', error);
      alert('Failed to initialize payment. Please try again.');
    }
  };

  const handleEdit = () => {
    navigate('/', { state: { orderData } });
  };

  return (
    <div className="preview-container">
      <div className="preview-card">
        <h1 className="preview-title">Order Preview</h1>

        <div className="preview-section">
          <h2 className="section-title">Customer Information</h2>
          <div className="preview-info">
            <p><strong>Name:</strong> {orderData.fullName}</p>
            <p><strong>Email:</strong> {orderData.email}</p>
            <p><strong>Phone:</strong> {orderData.phone}</p>
          </div>
        </div>

        <div className="preview-section">
          <h2 className="section-title">Pizza Details</h2>
          <div className="preview-info">
            <p><strong>Type:</strong> {orderData.pizzaType}</p>
            <p><strong>Size:</strong> {orderData.pizzaSize}</p>
            <p><strong>Quantity:</strong> {orderData.quantity}</p>
            <p><strong>Unit Price:</strong> {orderData.formattedTotal}</p>
          </div>
        </div>

        <div className="preview-section">
          <h2 className="section-title">Delivery Information</h2>
          <div className="preview-info">
            <p><strong>Address:</strong> {orderData.deliveryAddress}</p>
          </div>
        </div>

        <div className="preview-total">
          <h2 className="total-label">Total Amount</h2>
          <p className="total-amount">{orderData.formattedTotal}</p>
        </div>

        <div className="preview-actions">
          <button onClick={handleEdit} className="btn-secondary">
            Edit Order
          </button>
          <button onClick={handlePayment} className="btn-primary">
            Proceed to Payment
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderPreview;
