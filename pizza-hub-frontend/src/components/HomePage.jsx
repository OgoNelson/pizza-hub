import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

const HomePage = () => {
  return (
    <div className="home-container">
      <nav className="navbar">
        <div className="nav-content">
          <h1 className="logo">🍕 Pizza Hub</h1>
          <div className="nav-links">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/admin/login" className="nav-link">Admin</Link>
          </div>
        </div>
      </nav>

      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Delicious Pizza Delivered To Your Door</h1>
          <p className="hero-subtitle">
            Order your favorite pizza now and enjoy fast, fresh delivery
          </p>
          <div className="hero-actions">
            <Link to="/order" className="btn-primary btn-large">
              Order Now
            </Link>
          </div>
        </div>
      </div>

      <div className="features-section">
        <div className="features-container">
          <div className="feature-card">
            <div className="feature-icon">🍕</div>
            <h3>Fresh Ingredients</h3>
            <p>We use only the freshest ingredients to make our delicious pizzas</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🚀</div>
            <h3>Fast Delivery</h3>
            <p>Get your pizza delivered hot and fresh in no time</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">💳</div>
            <h3>Easy Payment</h3>
            <p>Secure payment with Paystack - quick and hassle-free</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">⭐</div>
            <h3>Quality Service</h3>
            <p>Our team is dedicated to providing you with the best experience</p>
          </div>
        </div>
      </div>

      <div className="menu-preview-section">
        <div className="menu-container">
          <h2 className="section-title">Our Popular Pizzas</h2>
          <div className="pizza-grid">
            <div className="pizza-card">
              <div className="pizza-emoji">🍕</div>
              <h3>Margherita</h3>
              <p>Classic cheese and tomato</p>
              <p className="pizza-price">From ₦2,500</p>
            </div>

            <div className="pizza-card">
              <div className="pizza-emoji">🍕</div>
              <h3>Pepperoni</h3>
              <p>Loaded with pepperoni</p>
              <p className="pizza-price">From ₦3,000</p>
            </div>

            <div className="pizza-card">
              <div className="pizza-emoji">🍕</div>
              <h3>Hawaiian</h3>
              <p>Ham and pineapple</p>
              <p className="pizza-price">From ₦2,800</p>
            </div>

            <div className="pizza-card">
              <div className="pizza-emoji">🍕</div>
              <h3>Vegetarian</h3>
              <p>Fresh vegetables</p>
              <p className="pizza-price">From ₦2,600</p>
            </div>

            <div className="pizza-card">
              <div className="pizza-emoji">🍕</div>
              <h3>BBQ Chicken</h3>
              <p>Grilled chicken and BBQ sauce</p>
              <p className="pizza-price">From ₦3,200</p>
            </div>
          </div>

          <div className="cta-section">
            <h2>Ready to Order?</h2>
            <p>Choose your favorite pizza and place your order now!</p>
            <Link to="/order" className="btn-primary">
              Order Your Pizza
            </Link>
          </div>
        </div>
      </div>

      <footer className="footer">
        <div className="footer-content">
          <p>&copy; 2024 Pizza Hub. All rights reserved.</p>
          <p>Delicious pizza delivered with love</p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
