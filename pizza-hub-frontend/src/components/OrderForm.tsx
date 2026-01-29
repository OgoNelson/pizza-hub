import React, { useState } from "react";
import axios from "axios";
import type { OrderData } from "../types";
import "../styles/OrderForm.css";

interface FormData {
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

interface OrderFormProps {
  onPreview: (data: OrderData) => void;
}

const OrderForm: React.FC<OrderFormProps> = ({ onPreview }) => {
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    phone: "",
    email: "",
    pizzaType: "Margherita",
    pizzaSize: "Medium",
    quantity: 1,
    deliveryAddress: "",
  });

  const [errors, setErrors] = useState<Errors>({});

  const pizzaTypes = [
    "Margherita",
    "Pepperoni",
    "Hawaiian",
    "Vegetarian",
    "BBQ Chicken",
  ];

  const pizzaSizes = ["Small", "Medium", "Large"];

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));

    if (errors[name as keyof Errors]) {
      const newErrors = { ...errors };
      delete newErrors[name as keyof Errors];
      setErrors(newErrors);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Errors = {};

    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "Invalid email address";
    if (!formData.deliveryAddress.trim())
      newErrors.deliveryAddress = "Delivery address is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePreview = async () => {
    if (!validateForm()) return;

    try {
      const response = await axios.post<OrderData>(
        "http://localhost:3000/api/orders/preview",
        formData
      );

      onPreview(response.data);
    } catch (error) {
      console.error("Preview error:", error);
    }
  };

  return (
    <div className="order-form-container">
      <h1>Pizza Order Form</h1>

      <div className="form-grid">
        <div className="form-section">
          <h2>Customer Information</h2>
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={formData.fullName}
            onChange={handleChange}
          />
          {errors.fullName && <span className="error">{errors.fullName}</span>}

          <input
            type="tel"
            name="phone"
            placeholder="Phone"
            value={formData.phone}
            onChange={handleChange}
          />
          {errors.phone && <span className="error">{errors.phone}</span>}

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && <span className="error">{errors.email}</span>}

          <textarea
            name="deliveryAddress"
            placeholder="Delivery Address"
            value={formData.deliveryAddress}
            onChange={handleChange}
          />
          {errors.deliveryAddress && (
            <span className="error">{errors.deliveryAddress}</span>
          )}
        </div>

        <div className="form-section">
          <h2>Pizza Details</h2>
          <select
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

          {pizzaSizes.map((size) => (
            <label key={size}>
              <input
                type="radio"
                name="pizzaSize"
                value={size}
                checked={formData.pizzaSize === size}
                onChange={handleChange}
              />
              {size}
            </label>
          ))}

          <input
            type="number"
            name="quantity"
            min={1}
            value={formData.quantity}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="action-buttons">
        <button onClick={handlePreview}>Preview Order</button>
      </div>
    </div>
  );
};

export default OrderForm;
