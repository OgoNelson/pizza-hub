import React, { useState } from 'react';
import axios from 'axios';

interface FormData {
  fullName: string;
  phone: string;
  email: string;
  pizzaType: string;
  pizzaSize: string;
  quantity: number;
  deliveryAddress: string;
}

interface PreviewData {
  unitPrice: number;
  totalPrice: number;
  formattedTotal: string;
  fullName: string;
  phone: string;
  email: string;
  pizzaType: string;
  pizzaSize: string;
  quantity: number;
  deliveryAddress: string;
}

interface Errors {
  fullName?: string;
  phone?: string;
  email?: string;
  deliveryAddress?: string;
}

const OrderForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    phone: '',
    email: '',
    pizzaType: 'Margherita',
    pizzaSize: 'Medium',
    quantity: 1,
    deliveryAddress: '',
  });

  const [previewData, setPreviewData] = useState<PreviewData | null>(null);
  const [errors, setErrors] = useState<Errors>({});

  const pizzaTypes = [
    'Margherita',
    'Pepperoni',
    'Hawaiian',
    'Vegetarian',
    'BBQ Chicken',
  ];

  const pizzaSizes = [
    'Small',
    'Medium',
    'Large',
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Clear error for this field
    if (errors[name]) {
      const newErrors = { ...errors };
      delete newErrors[name];
      setErrors(newErrors);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Errors = {};
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!formData.deliveryAddress.trim()) {
      newErrors.deliveryAddress = 'Delivery address is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePreview = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      const response = await axios.post('http://localhost:3000/api/orders/preview', formData);
      setPreviewData(response.data);
    } catch (error) {
      console.error('Error fetching preview:', error);
    }
  };

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      // Initialize payment
      const response = await axios.post('http://localhost:3000/api/payment/init', formData);
      
      if (response.data.data && response.data.data.authorization_url) {
        // Redirect to Paystack payment page
        window.location.href = response.data.data.authorization_url;
      } else {
        alert('Payment initialization failed. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting order:', error);
      alert('Order submission failed. Please try again.');
    }
  };

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
    }).format(price);
  };

  return (
    <div className="order-form-container">
      <h1>Pizza Order Form</h1>
      
      <div className="form-grid">
        <div className="form-section">
          <h2>Customer Information</h2>
          
          <div className="form-group">
            <label htmlFor="fullName">Full Name *</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className={errors.fullName ? 'error' : ''}
              placeholder="Enter your full name"
            />
            {errors.fullName && <span className="error-message">{errors.fullName}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="phone">Phone Number *</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={errors.phone ? 'error' : ''}
              placeholder="Enter your phone number"
            />
            {errors.phone && <span className="error-message">{errors.phone}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email Address *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? 'error' : ''}
              placeholder="Enter your email address"
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="deliveryAddress">Delivery Address *</label>
            <textarea
              id="deliveryAddress"
              name="deliveryAddress"
              value={formData.deliveryAddress}
              onChange={handleChange}
              className={errors.deliveryAddress ? 'error' : ''}
              placeholder="Enter your delivery address"
              rows={3}
            />
            {errors.deliveryAddress && <span className="error-message">{errors.deliveryAddress}</span>}
          </div>
        </div>
        
        <div className="form-section">
          <h2>Pizza Details</h2>
          
          <div className="form-group">
            <label htmlFor="pizzaType">Pizza Type *</label>
            <select
              id="pizzaType"
              name="pizzaType"
              value={formData.pizzaType}
              onChange={handleChange}
            >
              {pizzaTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="pizzaSize">Size *</label>
            <div className="size-options">
              {pizzaSizes.map((size) => (
                <label key={size} className="size-option">
                  <input
                    type="radio"
                    name="pizzaSize"
                    value={size}
                    checked={formData.pizzaSize === size}
                    onChange={handleChange}
                  />
                  <span>{size}</span>
                </label>
              ))}
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="quantity">Quantity *</label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              min="1"
              className="quantity-input"
            />
          </div>
        </div>
      </div>
      
      <div className="action-buttons">
        <button onClick={handlePreview} className="preview-btn">
          Preview Order
        </button>
        <button onClick={handleOrderSubmit} className="order-btn">
          Place Order
        </button>
      </div>
      
      {previewData && (
        <div className="order-preview">
          <h2>Order Preview</h2>
          <div className="preview-details">
            <p><strong>Name:</strong> {previewData.fullName}</p>
            <p><strong>Email:</strong> {previewData.email}</p>
            <p><strong>Phone:</strong> {previewData.phone}</p>
            <p><strong>Delivery Address:</strong> {previewData.deliveryAddress}</p>
            <p><strong>Pizza Type:</strong> {previewData.pizzaType}</p>
            <p><strong>Size:</strong> {previewData.pizzaSize}</p>
            <p><strong>Quantity:</strong> {previewData.quantity}</p>
            <p><strong>Unit Price:</strong> {formatPrice(previewData.unitPrice)}</p>
            <p><strong>Total Price:</strong> {formatPrice(previewData.totalPrice)}</p>
          </div>
          <div className="preview-actions">
            <button onClick={handleOrderSubmit} className="order-btn">
              Proceed to Payment
            </button>
            <button onClick={() => setPreviewData(null)} className="cancel-btn">
              Cancel
            </button>
          </div>
        </div>
      )}
      
      <style jsx>{`
        .order-form-container {
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
          font-family: Arial, sans-serif;
        }
        
        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }
        
        .form-section {
          background-color: #f8f9fa;
          padding: 20px;
          border-radius: 8px;
        }
        
        .form-group {
          margin-bottom: 15px;
        }
        
        .form-group label {
          display: block;
          margin-bottom: 5px;
          font-weight: bold;
        }
        
        .form-group input,
        .form-group textarea,
        .form-group select {
          width: 100%;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 4px;
          box-sizing: border-box;
        }
        
        .form-group input.error,
        .form-group textarea.error,
        .form-group select.error {
          border-color: #dc3545;
        }
        
        .error-message {
          color: #dc3545;
          font-size: 12px;
          margin-top: 5px;
        }
        
        .size-options {
          display: flex;
          gap: 15px;
        }
        
        .size-option {
          display: flex;
          align-items: center;
          gap: 5px;
          cursor: pointer;
        }
        
        .quantity-input {
          width: 100px;
        }
        
        .action-buttons {
          display: flex;
          justify-content: space-between;
          margin-top: 20px;
        }
        
        .preview-btn,
        .order-btn {
          padding: 12px 20px;
          background-color: #007bff;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-weight: bold;
        }
        
        .preview-btn {
          background-color: #6c757d;
        }
        
        .cancel-btn {
          background-color: #6c757d;
        }
        
        .order-preview {
          margin-top: 20px;
          background-color: #e9ecef;
          padding: 20px;
          border-radius: 8px;
        }
        
        .preview-details p {
          margin-bottom: 8px;
        }
        
        .preview-actions {
          display: flex;
          justify-content: space-between;
          margin-top: 15px;
        }
      `}</style>
    </div>
  );
};

export default OrderForm;