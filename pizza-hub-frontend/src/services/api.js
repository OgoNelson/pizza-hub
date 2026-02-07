import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 80000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Order APIs
export const orderAPI = {
  preview: (orderData) => api.post("/orders/preview", orderData),
  getByReference: (reference) => api.get(`/orders/${reference}`),
};

// Payment APIs
export const paymentAPI = {
  init: (orderData) => api.post("/payment/init", orderData),
  verify: (reference) => api.get(`/payment/verify/${reference}`),
  createOrder: (orderData) => api.post("/payment/create-order", orderData),
};

// Admin APIs
export const adminAPI = {
  login: (credentials) => api.post("/admin/login", credentials),
  create: (adminData) => api.post("/admin/create", adminData),
  getOrders: (token) =>
    api.get("/admin/orders", {
      headers: { Authorization: `Bearer ${token}` },
    }),
  getOrderById: (id, token) =>
    api.get(`/admin/orders/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    }),
  updateDeliveryStatus: (id, token) =>
    api.patch(
      `/admin/orders/${id}/deliver`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    ),
  deleteOrder: (id, token) =>
    api.delete(`/admin/orders/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    }),
  getStats: (token) =>
    api.get("/admin/stats", {
      headers: { Authorization: `Bearer ${token}` },
    }),
};

export default api;
