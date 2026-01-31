import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { paymentAPI } from '../services/api';
import './PaymentCallback.css';

const PaymentCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('processing');
  const [message, setMessage] = useState('Verifying your payment...');

  useEffect(() => {
    const verifyPayment = async () => {
      const reference = searchParams.get('reference');

      if (!reference) {
        setStatus('error');
        setMessage('No payment reference found. Please contact support.');
        return;
      }

      try {
        // Verify payment with backend
        const verifyResponse = await paymentAPI.verify(reference);

        if (verifyResponse.data.data.status === 'success') {
          // Payment successful - create order
          setStatus('success');

          // Store payment reference for order creation
          // We'll need to retrieve order data from session storage or local storage
          const orderDataString = sessionStorage.getItem('pendingOrder');
          if (!orderDataString) {
            setStatus('error');
            setMessage('Order data not found. Please contact support.');
            return;
          }

          const orderData = JSON.parse(orderDataString);

          // Create order with payment reference - only send required fields
          const finalOrderData = {
            fullName: orderData.fullName,
            phone: orderData.phone,
            email: orderData.email,
            pizzaType: orderData.pizzaType,
            pizzaSize: orderData.pizzaSize,
            quantity: orderData.quantity,
            deliveryAddress: orderData.deliveryAddress,
            paymentReference: reference,
            amountPaid: orderData.totalPrice,
          };

          await paymentAPI.createOrder(finalOrderData);

          // Clear session storage
          sessionStorage.removeItem('pendingOrder');

          // Redirect to success page
          setTimeout(() => {
            navigate('/success', {
              state: {
                orderData: finalOrderData,
                reference: reference,
              },
            });
          }, 2000);
        } else {
          setStatus('failed');
          setMessage('Payment verification failed. Please try again.');
        }
      } catch (error) {
        console.error('Payment verification error:', error);
        setStatus('error');
        setMessage('An error occurred while verifying your payment. Please contact support if amount was deducted.');
      }
    };

    verifyPayment();
  }, [searchParams, navigate]);

  const handleReturnHome = () => {
    navigate('/');
  };

  return (
    <div className="callback-container">
      <div className="callback-card">
        {status === 'processing' && (
          <>
            <div className="spinner"></div>
            <h2>Processing Payment</h2>
            <p>{message}</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="success-icon">✓</div>
            <h2>Payment Successful!</h2>
            <p>Creating your order...</p>
          </>
        )}

        {status === 'failed' && (
          <>
            <div className="error-icon">✕</div>
            <h2>Payment Failed</h2>
            <p>{message}</p>
            <button onClick={handleReturnHome} className="btn-primary">
              Return to Home
            </button>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="error-icon">⚠</div>
            <h2>Payment Error</h2>
            <p>{message}</p>
            <button onClick={handleReturnHome} className="btn-primary">
              Return to Home
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentCallback;
