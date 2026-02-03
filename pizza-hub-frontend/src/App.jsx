import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import HomePage from './components/HomePage';
import OrderForm from './components/OrderForm';
import OrderPreview from './components/OrderPreview';
import OrderSuccess from './components/OrderSuccess';
import PaymentCallback from './components/PaymentCallback';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/order" element={<OrderForm />} />
          <Route path="/preview" element={<OrderPreview />} />
          <Route path="/callback" element={<PaymentCallback />} />
          <Route path="/success" element={<OrderSuccess />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
