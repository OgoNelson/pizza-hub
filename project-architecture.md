# Pizza Ordering & Payment Portal - Detailed Architecture Plan

## Project Overview
A full-stack pizza ordering system with payment integration via Paystack, admin dashboard, and email notifications.

## Enhanced Tech Stack

### Backend
- **Framework**: NestJS (Node.js framework)
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT with bcrypt for password hashing
- **Payment**: Paystack (test/demo mode)
- **Email**: Nodemailer (Gmail SMTP or provider)
- **Validation**: Joi or class-validator
- **Environment**: dotenv

### Frontend
- **Framework**: React with Vite
- **HTTP Client**: Axios
- **Styling**: Tailwind css
- **State Management**: React Context API or useState/useReducer

## Database Schema Design

### Order Schema (Enhanced)
```javascript
{
  fullName: String (required),
  phone: String (required),
  email: String (required),
  pizzaType: String (required), // e.g., "Margherita", "Pepperoni", "Hawaiian"
  pizzaSize: String (required), // "Small", "Medium", "Large"
  quantity: Number (required, min: 1),
  unitPrice: Number (required), // price per pizza based on size
  totalPrice: Number (required), // unitPrice * quantity
  deliveryAddress: String (required),
  amountPaid: Number (required),
  paymentReference: String (unique),
  paymentStatus: String, // "success", "failed", "pending"
  deliveryStatus: String, // "undelivered", "delivered"
  createdAt: Date (default: Date.now),
  updatedAt: Date (default: Date.now)
}
```

### Admin Schema
```javascript
{
  email: String (required, unique),
  password: String (required), // hashed
  role: String (default: "admin"),
  createdAt: Date (default: Date.now),
  lastLogin: Date
}
```

### Pizza Menu Schema (Optional - for dynamic pricing)
```javascript
{
  name: String (required), // "Margherita", "Pepperoni"
  description: String,
  sizes: {
    small: { price: Number, available: Boolean },
    medium: { price: Number, available: Boolean },
    large: { price: Number, available: Boolean }
  },
  ingredients: [String],
  image: String, // URL
  available: Boolean (default: true)
}
```

## API Endpoints Design

### Client/Order Endpoints
```
POST   /api/orders/preview          // Validate order & calculate price
POST   /api/orders/create           // Create order (after payment verification)
GET    /api/orders/:reference       // Get order by reference
```

### Payment Endpoints
```
POST   /api/payment/init            // Initialize Paystack payment
GET    /api/payment/verify/:ref     // Verify payment status
POST   /api/payment/webhook         // Paystack webhook handler
```

### Admin Endpoints
```
POST   /api/admin/login             // Admin authentication
GET    /api/admin/orders            // Fetch all orders (paginated)
GET    /api/admin/orders/:id        // Get single order details
PATCH  /api/admin/orders/:id/deliver // Mark as delivered
DELETE /api/admin/orders/:id        // Delete order (admin only)
GET    /api/admin/stats             // Dashboard statistics
```

## Project Structure

### Backend Structure (NestJS)
```
pizza-hub-api/
├── src/
│   ├── config/
│   │   ├── database.config.ts
│   │   ├── paystack.config.ts
│   │   └── mail.config.ts
│   ├── models/
│   │   ├── order.model.ts
│   │   ├── admin.model.ts
│   │   └── pizza-menu.model.ts
│   ├── modules/
│   │   ├── order/
│   │   │   ├── order.controller.ts
│   │   │   ├── order.service.ts
│   │   │   ├── order.module.ts
│   │   │   └── dto/
│   │   │       ├── create-order.dto.ts
│   │   │       └── preview-order.dto.ts
│   │   ├── payment/
│   │   │   ├── payment.controller.ts
│   │   │   ├── payment.service.ts
│   │   │   └── payment.module.ts
│   │   ├── admin/
│   │   │   ├── admin.controller.ts
│   │   │   ├── admin.service.ts
│   │   │   └── admin.module.ts
│   │   └── auth/
│   │       ├── auth.controller.ts
│   │       ├── auth.service.ts
│   │       ├── auth.module.ts
│   │       └── guards/
│   │           └── jwt-auth.guard.ts
│   ├── common/
│   │   ├── guards/
│   │   ├── interceptors/
│   │   └── filters/
│   ├── main.ts
│   └── app.module.ts
├── .env
├── .env.example
├── package.json
└── tsconfig.json
```

### Frontend Structure (React + Vite)
```
pizza-hub-frontend/
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Header.jsx
│   │   │   ├── Footer.jsx
│   │   │   └── Loading.jsx
│   │   ├── order/
│   │   │   ├── OrderForm.jsx
│   │   │   ├── OrderPreview.jsx
│   │   │   └── Payment.jsx
│   │   └── admin/
│   │       ├── Login.jsx
│   │       ├── Dashboard.jsx
│   │       └── OrderList.jsx
│   ├── services/
│   │   ├── api.js
│   │   ├── orderService.js
│   │   └── authService.js
│   ├── hooks/
│   │   └── useAuth.js
│   ├── context/
│   │   └── AuthContext.js
│   ├── utils/
│   │   └── constants.js
│   ├── styles/
│   │   └── global.css
│   ├── App.jsx
│   └── main.jsx
├── package.json
└── vite.config.js
```

## Pizza Size Pricing Logic

### Size Pricing Matrix
```javascript
const PIZZA_PRICES = {
  "Margherita": {
    small: 2500,  // NGN
    medium: 3500,
    large: 4500
  },
  "Pepperoni": {
    small: 3000,
    medium: 4000,
    large: 5500
  },
  "Hawaiian": {
    small: 2800,
    medium: 3800,
    large: 5000
  }
  // Add more pizza types as needed
};
```

### Price Calculation Service
```javascript
calculateOrderTotal(pizzaType, size, quantity) {
  const unitPrice = PIZZA_PRICES[pizzaType][size];
  const totalPrice = unitPrice * quantity;
  return {
    unitPrice,
    totalPrice,
    formattedTotal: `₦${totalPrice.toLocaleString()}`
  };
}
```

## Payment Flow Enhancement

### Enhanced Order Process
1. **Order Form**: User selects pizza type, size, quantity
2. **Price Calculation**: Real-time price updates based on size selection
3. **Preview Page**: Shows detailed breakdown including size pricing
4. **Payment Initialization**: Creates Paystack transaction with calculated amount
5. **Payment Verification**: Verifies payment and saves order with size details
6. **Email Confirmation**: Includes size information in receipt

## Security Considerations

### Backend Security
- Input validation and sanitization
- Rate limiting on payment endpoints
- CORS configuration
- Environment variable protection
- SQL injection prevention (though using MongoDB)
- XSS protection

### Payment Security
- Verify all Paystack webhooks
- Use reference-based verification
- Implement idempotency for payment processing
- Log all payment attempts

## Development Phases

### Phase 1: Backend Foundation (Week 1-2)
- Set up NestJS project structure
- Database connection and models
- Basic CRUD operations
- Authentication system

### Phase 2: Payment Integration (Week 2-3)
- Paystack integration
- Webhook handling
- Order processing logic
- Email service setup

### Phase 3: Frontend Development (Week 3-4)
- React project setup
- Order form with size selection
- Payment integration
- Basic styling

### Phase 4: Admin Dashboard (Week 4-5)
- Admin authentication
- Order management UI
- Dashboard statistics
- Responsive design

### Phase 5: Testing & Deployment (Week 5-6)
- End-to-end testing
- Performance optimization
- Deployment preparation
- Documentation

## Environment Variables

### Backend (.env)
```
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://localhost:27017/pizza-hub
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d

# Paystack Configuration
PAYSTACK_SECRET_KEY=sk_test_your-paystack-secret-key
PAYSTACK_PUBLIC_KEY=pk_test_your-paystack-public-key

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173
```

### Frontend (.env)
```
VITE_API_BASE_URL=http://localhost:3000/api
VITE_PAYSTACK_PUBLIC_KEY=pk_test_your-paystack-public-key
```

## Testing Strategy

### Backend Testing
- Unit tests for services and controllers
- Integration tests for API endpoints
- Payment flow testing with Paystack test mode
- Database operation testing

### Frontend Testing
- Component testing with React Testing Library
- Integration testing for user flows
- Payment form validation testing
- Responsive design testing

## Deployment Considerations

### Backend Deployment
- Docker containerization
- Environment-specific configurations
- Database migration strategies
- SSL/TLS setup

### Frontend Deployment
- Static asset optimization
- Environment variable management
- CDN configuration
- Progressive Web App (PWA) features

This architecture provides a solid foundation for building a scalable and maintainable pizza ordering system with all the requested features including pizza size selection.
