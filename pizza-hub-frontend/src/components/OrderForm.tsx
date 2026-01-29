import React, { useState } from "react";
import axios from "axios";
import "../styles/OrderForm.css";

/* ================= TYPES ================= */

interface FormData {
  fullName: string;
  phone: string;
  email: string;
  pizzaType: string;
  pizzaSize: string;
  quantity: number;
  deliveryAddress: string;
}

interface PreviewData extends FormData {
  unitPrice: number;
  totalPrice: number;
}

interface Errors {
  fullName?: string;
  phone?: string;
  email?: string;
  deliveryAddress?: string;
}

/* ================= COMPONENT ================= */

const OrderForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    phone: "",
    email: "",
    pizzaType: "Margherita",
    pizzaSize: "Medium",
    quantity: 1,
    deliveryAddress: "",
  });

  const [previewData, setPreviewData] = useState<PreviewData | null>(null);
  const [errors, setErrors] = useState<Errors>({});

  const pizzaTypes = [
    "Margherita",
    "Pepperoni",
    "Hawaiian",
    "Vegetarian",
    "BBQ Chicken",
  ];

  const pizzaSizes = ["Small", "Medium", "Large"];

  /* ================= HELPERS ================= */

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

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email address";
    }

    if (!formData.deliveryAddress.trim())
      newErrors.deliveryAddress = "Delivery address is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const formatPrice = (price: number): string =>
    new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(price);

  /* ================= API CALLS ================= */

  const handlePreview = async () => {
    if (!validateForm()) return;

    try {
      const response = await axios.post<PreviewData>(
        "http://localhost:3000/api/orders/preview",
        formData
      );
      setPreviewData(response.data);
    } catch (error) {
      console.error("Preview error:", error);
    }
  };

  const handlePayment = async () => {
    if (!previewData) return;

    try {
      const response = await axios.post<{
        data: {
          public_key: string;
          reference: string;
        };
      }>("http://localhost:3000/api/payment/init", previewData);

      initializePaystackPopup(response.data.data, previewData);
    } catch (error) {
      console.error("Payment init error:", error);
      alert("Payment initialization failed");
    }
  };

  /* ================= PAYSTACK ================= */

  const initializePaystackPopup = (
    paymentData: { public_key: string; reference: string },
    orderData: PreviewData
  ) => {
    const handler = (window as any).PaystackPop.setup({
      key: paymentData.public_key,
      email: orderData.email,
      amount: orderData.totalPrice * 100,
      currency: "NGN",
      ref: paymentData.reference,
      callback: (response: any) => {
        if (response.status === "success") {
          alert("Payment successful 🎉");
        }
      },
      onClose: () => {
        alert("Payment cancelled");
      },
    });

    handler.openIframe();
  };

  /* ================= JSX ================= */

  return (
    <div className="order-form-container">
      <h1>Pizza Order Form</h1>

      <div className="form-grid">
        {/* Customer Info */}
        <div className="form-section">
          <h2>Customer Information</h2>

          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={formData.fullName}
            onChange={handleChange}
          />
          {errors.fullName && <span>{errors.fullName}</span>}

          <input
            type="tel"
            name="phone"
            placeholder="Phone"
            value={formData.phone}
            onChange={handleChange}
          />
          {errors.phone && <span>{errors.phone}</span>}

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && <span>{errors.email}</span>}

          <textarea
            name="deliveryAddress"
            placeholder="Delivery Address"
            value={formData.deliveryAddress}
            onChange={handleChange}
          />
          {errors.deliveryAddress && <span>{errors.deliveryAddress}</span>}
        </div>

        {/* Pizza Details */}
        <div className="form-section">
          <h2>Pizza Details</h2>

          <select
            name="pizzaType"
            value={formData.pizzaType}
            onChange={handleChange}
          >
            {pizzaTypes.map((type) => (
              <option key={type}>{type}</option>
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

      {previewData && (
        <div className="order-preview">
          <h2>Order Preview</h2>

          <p>
            <strong>Name:</strong> {previewData.fullName}
          </p>
          <p>
            <strong>Email:</strong> {previewData.email}
          </p>
          <p>
            <strong>Pizza:</strong> {previewData.pizzaType}
          </p>
          <p>
            <strong>Size:</strong> {previewData.pizzaSize}
          </p>
          <p>
            <strong>Quantity:</strong> {previewData.quantity}
          </p>
          <p>
            <strong>Total:</strong> {formatPrice(previewData.totalPrice)}
          </p>

          <button onClick={handlePayment}>Proceed to Payment</button>
          <button onClick={() => setPreviewData(null)}>Cancel</button>
        </div>
      )}
    </div>
  );
};

export default OrderForm;
