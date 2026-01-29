import React, { useState } from "react";
import OrderForm from "./components/OrderForm";
import OrderPreview from "./components/OrderPreview";
import "./App.css";

/* ================= TYPES ================= */

type View = "form" | "preview";

interface OrderData {
  fullName: string;
  phone: string;
  email: string;
  pizzaType: string;
  pizzaSize: string;
  quantity: number;
  deliveryAddress: string;
  unitPrice: number;
  totalPrice: number;
}

/* ================= COMPONENT ================= */

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>("form");
  const [orderData, setOrderData] = useState<OrderData | null>(null);

  const handleBackToForm = (): void => {
    setCurrentView("form");
    setOrderData(null);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Pizza Hub</h1>
        <p>Order delicious pizzas with different sizes and toppings</p>
      </header>

      <main className="app-main">
        {currentView === "form" && <OrderForm />}

        {currentView === "preview" && orderData && (
          <OrderPreview
            orderData={orderData}
            onProceed={() => console.log("Proceeding to payment...")}
            onCancel={handleBackToForm}
          />
        )}
      </main>

      <footer className="app-footer">
        <p>&copy; {new Date().getFullYear()} Pizza Hub. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default App;
