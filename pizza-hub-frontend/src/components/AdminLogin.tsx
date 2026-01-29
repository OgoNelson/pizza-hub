import React, { useState } from "react";
import axios, { AxiosError } from "axios";
import "../styles/AdminLogin.css";

/* ================= TYPES ================= */

interface LoginData {
  email: string;
  password: string;
}

interface AdminInfo {
  id: string;
  email: string;
  role: string;
}

interface LoginResponse {
  access_token: string;
  admin: AdminInfo;
}

interface ApiResponse<T> {
  data: T;
}

interface LoginErrors {
  email?: string;
  password?: string;
  general?: string;
}

/* ================= COMPONENT ================= */

const AdminLogin: React.FC = () => {
  const [loginData, setLoginData] = useState<LoginData>({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<LoginErrors>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);

  /* ================= HANDLERS ================= */

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setLoginData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name as keyof LoginErrors]) {
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated[name as keyof LoginErrors];
        return updated;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: LoginErrors = {};

    if (!loginData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!loginData.password.trim()) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const response = await axios.post<ApiResponse<LoginResponse>>(
        "http://localhost:3000/api/admin/login",
        loginData
      );

      const { access_token, admin } = response.data.data;

      localStorage.setItem("adminToken", access_token);
      localStorage.setItem("adminInfo", JSON.stringify(admin));

      window.location.href = "/admin/dashboard";
    } catch (err) {
      const error = err as AxiosError;

      console.error("Login error:", error);

      setErrors({
        general:
          error.response?.status === 401
            ? "Invalid email or password"
            : "Login failed. Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  /* ================= JSX ================= */

  return (
    <div className="admin-login-container">
      <div className="login-card">
        <h2>Admin Login</h2>

        <form onSubmit={handleLogin} noValidate>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={loginData.email}
              onChange={handleChange}
              className={errors.email ? "error" : ""}
              placeholder="Enter your email"
            />
            {errors.email && (
              <span className="error-message">{errors.email}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={loginData.password}
              onChange={handleChange}
              className={errors.password ? "error" : ""}
              placeholder="Enter your password"
            />
            {errors.password && (
              <span className="error-message">{errors.password}</span>
            )}
          </div>

          {errors.general && (
            <div className="error-message general">{errors.general}</div>
          )}

          <div className="form-group">
            <button type="submit" disabled={isLoading} className="login-btn">
              {isLoading ? "Logging in..." : "Login"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
