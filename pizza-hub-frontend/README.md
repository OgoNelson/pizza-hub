# Pizza Hub Frontend

A modern React-based frontend for the Pizza Hub ordering system.

## Features

- Customer order flow with pizza selection
- Order preview with price calculation
- Paystack payment integration
- Admin dashboard with order management
- Responsive design for all devices
- Beautiful gradient UI

## Prerequisites

- Node.js (v16 or higher)
- npm or pnpm
- Backend API running on http://localhost:3000

## Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
Copy `.env.example` to `.env` and update with your values:
```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_PAYSTACK_PUBLIC_KEY=your_paystack_public_key_here
```

## Running the Application

Start the development server:
```bash
npm run dev
```

The application will be available at http://localhost:5173

## Building for Production

Create an optimized production build:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## Project Structure

```
src/
├── components/           # React components
│   ├── HomePage.jsx     # Landing page
│   ├── OrderForm.jsx    # Customer order form
│   ├── OrderPreview.jsx # Order preview page
│   ├── OrderSuccess.jsx # Order success page
│   ├── AdminLogin.jsx   # Admin login page
│   └── AdminDashboard.jsx # Admin dashboard
├── context/             # React Context
│   └── AuthContext.jsx  # Authentication context
├── services/            # API services
│   └── api.js          # Axios API configuration
├── utils/              # Utility functions
│   └── constants.js    # Pizza types, sizes, and pricing
├── App.jsx             # Main app component with routing
└── main.jsx            # Application entry point
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Features Overview

### Customer Features
- Browse pizza menu with prices
- Select pizza type, size, and quantity
- Real-time price calculation
- Delivery information form
- Secure payment via Paystack
- Order confirmation page

### Admin Features
- Secure authentication
- Dashboard with statistics
- View all orders
- Mark orders as delivered
- Delete orders
- Filter orders by status

## API Integration

The frontend connects to the Pizza Hub API at the configured base URL. Ensure the backend is running before starting the frontend.

Main API endpoints used:
- POST `/api/orders/preview` - Preview order
- POST `/api/payment/init` - Initialize payment
- GET `/api/payment/verify/:reference` - Verify payment
- POST `/api/payment/create-order` - Create order
- POST `/api/admin/login` - Admin login
- GET `/api/admin/orders` - Get all orders
- GET `/api/admin/stats` - Get statistics

## Payment Integration

The app uses Paystack for payment processing. Make sure to configure your Paystack public key in the `.env` file.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT
