import React, { useState } from "react";
import OrderForm from "./components/OrderForm";
import OrderPreview from "./components/OrderPreview";
import type { OrderData } from "./types";

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<"form" | "preview">("form");
  const [orderData, setOrderData] = useState<OrderData | null>(null);

  const handlePreview = (data: OrderData) => {
    setOrderData(data);
    setCurrentView("preview");
  };

  const handleBackToForm = () => {
    setCurrentView("form");
  };

  return (
    <div className="app">
      {currentView === "form" && <OrderForm onPreview={handlePreview} />}
      {currentView === "preview" && orderData && (
        <OrderPreview
          orderData={orderData}
          onProceed={() => {}}
          onCancel={handleBackToForm}
        />
      )}
    </div>
  );
};

export default App;
