import React, { useState } from 'react';
import OrderForm from './components/OrderForm';
import OrderPreview from './components/OrderPreview';

function App() {
  const [currentView, setCurrentView] = useState('form');
  const [orderData, setOrderData] = useState(null);

  const handlePreview = (data) => {
    setOrderData(data);
    setCurrentView('preview');
  };

  const handleBackToForm = () => {
    setCurrentView('form');
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Pizza Hub</h1>
        <p>Order delicious pizzas with different sizes and toppings</p>
      </header>
      
      <main className="app-main">
        {currentView === 'form' && (
          <OrderForm onPreview={handlePreview} />
        )}
        
        {currentView === 'preview' && (
          <OrderPreview 
            orderData={orderData} 
            onProceed={() => console.log('Proceeding to payment...')}
            onCancel={handleBackToForm}
          />
        )}
      </main>
      
      <footer className="app-footer">
        <p>&copy; 2023 Pizza Hub. All rights reserved.</p>
      </footer>
      
      <style jsx>{`
        .app {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          font-family: Arial, sans-serif;
        }
        
        .app-header {
          background-color: #ff6b35;
          color: white;
          padding: 20px;
          text-align: center;
        }
        
        .app-header h1 {
          margin: 0;
        }
        
        .app-header p {
          margin: 5px 0 0 10px;
        }
        
        .app-main {
          flex: 1;
          padding: 20px;
        }
        
        .app-footer {
          background-color: #f8f9fa;
          padding: 20px;
          text-align: center;
          margin-top: auto;
        }
      `}</style>
    </div>
  );
}

export default App;