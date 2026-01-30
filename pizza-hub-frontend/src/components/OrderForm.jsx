import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PIZZA_TYPES, PIZZA_SIZES, PIZZA_PRICES } from '../utils/constants';
import { orderAPI } from '../services/api';
import './OrderForm.css';

const OrderForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    pizzaType: PIZZA_TYPES[0],
    pizzaSize: PIZZA_SIZES[1],
    quantity: 1,
    deliveryAddress: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'quantity' ? parseInt(value) || 1 : value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.deliveryAddress.trim()) newErrors.deliveryAddress = 'Delivery address is required';
    if (formData.quantity < 1) newErrors.quantity = 'Quantity must be at least 1';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePreview = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await orderAPI.preview(formData);
      navigate('/preview', { state: { orderData: response.data } });
    } catch (error) {
      console.error('Error previewing order:', error);
      alert('Failed to preview order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getEstimatedPrice = () => {
    const sizeKey = formData.pizzaSize.toLowerCase();
    const price = PIZZA_PRICES[formData.pizzaType]?.[sizeKey] || 0;
    return price * formData.quantity;
  };

  return (
    <div className="order-form-container">
      <div className="order-form-card">
        <h1 className="form-title">Order Your Pizza</h1>
        <form onSubmit={handlePreview} className="order-form">
          {/* Customer Information */}
          <div className="form-section">
            <h2 className="section-title">Customer Information</h2>

            <div className="form-group">
              <label htmlFor="fullName">Full Name *</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className={errors.fullName ? 'error' : ''}
                placeholder="John Doe"
              />
              {errors.fullName && <span className="error-message">{errors.fullName}</span>}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="phone">Phone Number *</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={errors.phone ? 'error' : ''}
                  placeholder="08012345678"
                />
                {errors.phone && <span className="error-message">{errors.phone}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="email">Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={errors.email ? 'error' : ''}
                  placeholder="john@example.com"
                />
                {errors.email && <span className="error-message">{errors.email}</span>}
              </div>
            </div>
          </div>

          {/* Pizza Selection */}
          <div className="form-section">
            <h2 className="section-title">Pizza Selection</h2>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="pizzaType">Pizza Type *</label>
                <select
                  id="pizzaType"
                  name="pizzaType"
                  value={formData.pizzaType}
                  onChange={handleChange}
                >
                  {PIZZA_TYPES.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="pizzaSize">Size *</label>
                <select
                  id="pizzaSize"
                  name="pizzaSize"
                  value={formData.pizzaSize}
                  onChange={handleChange}
                >
                  {PIZZA_SIZES.map(size => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
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
                className={errors.quantity ? 'error' : ''}
              />
              {errors.quantity && <span className="error-message">{errors.quantity}</span>}
            </div>

            <div className="price-estimate">
              <strong>Estimated Total: {getEstimatedPrice().toLocaleString()} NGN</strong>
            </div>
          </div>

          {/* Delivery Information */}
          <div className="form-section">
            <h2 className="section-title">Delivery Information</h2>

            <div className="form-group">
              <label htmlFor="deliveryAddress">Delivery Address *</label>
              <textarea
                id="deliveryAddress"
                name="deliveryAddress"
                value={formData.deliveryAddress}
                onChange={handleChange}
                className={errors.deliveryAddress ? 'error' : ''}
                placeholder="123 Main St, Lagos, Nigeria"
                rows="3"
              />
              {errors.deliveryAddress && <span className="error-message">{errors.deliveryAddress}</span>}
            </div>
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Processing...' : 'Preview Order'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default OrderForm;
