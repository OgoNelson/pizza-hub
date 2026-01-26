# Pizza Hub API Documentation

## Overview

This document describes the RESTful API for the Pizza Hub ordering and payment system. The API allows users to order pizzas with different sizes and toppings, process payments through Paystack, and provides admin functionality for order management.

## Base URL

```
http://localhost:3000/api
```

## Authentication

All admin endpoints require JWT authentication. Include the token in the Authorization header:

```
Authorization: Bearer <JWT_TOKEN>
```

## API Endpoints

### Public Endpoints

#### Order Preview

Calculate the total price for an order based on pizza type, size, and quantity.

- **Endpoint**: `POST /orders/preview`
- **Authentication**: None
- **Request Body**:
```json
{
  "fullName": "John Doe",
  "phone": "08012345678",
  "email": "john.doe@example.com",
  "pizzaType": "Pepperoni",
  "pizzaSize": "Medium",
  "quantity": 2,
  "deliveryAddress": "123 Main St, Lagos, Nigeria"
}
```
- **Response**:
```json
{
  "unitPrice": 4000,
  "totalPrice": 8000,
  "formattedTotal": "₦8,000",
  "fullName": "John Doe",
  "phone": "08012345678",
  "email": "john.doe@example.com",
  "pizzaType": "Pepperoni",
  "pizzaSize": "Medium",
  "quantity": 2,
  "deliveryAddress": "123 Main St, Lagos, Nigeria"
}
```

#### Payment Initialization

Initialize a Paystack payment transaction.

- **Endpoint**: `POST /payment/init`
- **Authentication**: None
- **Request Body**:
```json
{
  "fullName": "John Doe",
  "phone": "08012345678",
  "email": "john.doe@example.com",
  "pizzaType": "Pepperoni",
  "pizzaSize": "Medium",
  "quantity": 2,
  "deliveryAddress": "123 Main St, Lagos, Nigeria"
}
```
- **Response**:
```json
{
  "statusCode": 200,
  "message": "Payment initialized successfully",
  "data": {
    "status": true,
    "message": "Payment URL generated",
    "data": {
      "authorization_url": "https://checkout.paystack.com/...",
      "access_code": "123456",
      "reference": "PIZZA_1234567890_abc123"
    },
    "orderData": {
      "fullName": "John Doe",
      "phone": "08012345678",
      "email": "john.doe@example.com",
      "pizzaType": "Pepperoni",
      "pizzaSize": "Medium",
      "quantity": 2,
      "deliveryAddress": "123 Main St, Lagos, Nigeria",
      "unitPrice": 4000,
      "totalPrice": 8000,
      "formattedTotal": "₦8,000",
      "paymentReference": "PIZZA_1234567890_abc123"
    }
  }
}
```

#### Payment Verification

Verify the status of a payment transaction.

- **Endpoint**: `GET /payment/verify/:reference`
- **Authentication**: None
- **URL Parameters**:
  - `reference`: The payment reference returned from Paystack

- **Response**:
```json
{
  "statusCode": 200,
  "message": "Payment verification completed",
  "data": {
    "status": "success",
    "data": {
      "id": 123456,
      "status": "success",
      "reference": "PIZZA_1234567890_abc123",
      "amount": 800000,
      "paid_at": "2023-01-25T12:34:56.000Z",
      "customer": {
        "email": "john.doe@example.com",
        "first_name": "John",
        "last_name": "Doe"
      }
    }
  }
}
```

#### Create Order After Payment

Create an order after successful payment verification.

- **Endpoint**: `POST /payment/create-order`
- **Authentication**: None
- **Request Body**:
```json
{
  "fullName": "John Doe",
  "phone": "08012345678",
  "email": "john.doe@example.com",
  "pizzaType": "Pepperoni",
  "pizzaSize": "Medium",
  "quantity": 2,
  "deliveryAddress": "123 Main St, Lagos, Nigeria",
  "unitPrice": 4000,
  "totalPrice": 8000,
  "paymentReference": "PIZZA_1234567890_abc123",
  "amountPaid": 8000
}
```
- **Response**:
```json
{
  "statusCode": 201,
  "message": "Order created successfully",
  "data": {
    "_id": "63f8a1b2c3d4e5f6a7b8",
    "fullName": "John Doe",
    "phone": "08012345678",
    "email": "john.doe@example.com",
    "pizzaType": "Pepperoni",
    "pizzaSize": "Medium",
    "quantity": 2,
    "unitPrice": 4000,
    "totalPrice": 8000,
    "deliveryAddress": "123 Main St, Lagos, Nigeria",
    "paymentReference": "PIZZA_1234567890_abc123",
    "amountPaid": 8000,
    "paymentStatus": "success",
    "deliveryStatus": "undelivered",
    "createdAt": "2023-01-25T12:34:56.789Z",
    "updatedAt": "2023-01-25T12:34:56.789Z",
    "__v": 0
  }
}
```

#### Get Order by Reference

Retrieve order details using the payment reference.

- **Endpoint**: `GET /orders/:reference`
- **Authentication**: None
- **URL Parameters**:
  - `reference`: The payment reference of the order

- **Response**: Same as Create Order response

#### Webhook Handler

Handle Paystack webhook events for payment status updates.

- **Endpoint**: `POST /payment/webhook`
- **Authentication**: None
- **Request Body**: Paystack webhook payload

- **Response**:
```json
{
  "received": true
}
```

### Admin Endpoints

#### Admin Login

Authenticate an admin user and return JWT token.

- **Endpoint**: `POST /admin/login`
- **Authentication**: None
- **Request Body**:
```json
{
  "email": "admin@example.com",
  "password": "password123"
}
```
- **Response**:
```json
{
  "statusCode": 200,
  "message": "Login successful",
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "admin": {
      "id": "63f8a1b2c3d4e5f6a7b8",
      "email": "admin@example.com",
      "role": "admin"
    }
  }
}
```

#### Create Admin User

Create a new admin user.

- **Endpoint**: `POST /admin/create`
- **Authentication**: None
- **Request Body**:
```json
{
  "email": "admin@example.com",
  "password": "password123"
}
```
- **Response**:
```json
{
  "statusCode": 201,
  "message": "Admin created successfully",
  "data": {
    "id": "63f8a1b2c3d4e5f6a7b8",
    "email": "admin@example.com",
    "role": "admin"
  }
}
```

#### Get All Orders (Admin)

Retrieve all orders with pagination and filtering.

- **Endpoint**: `GET /admin/orders`
- **Authentication**: JWT required
- **Response**:
```json
{
  "statusCode": 200,
  "message": "Orders retrieved successfully",
  "data": [
    {
      "_id": "63f8a1b2c3d4e5f6a7b8",
      "fullName": "John Doe",
      "phone": "08012345678",
      "email": "john.doe@example.com",
      "pizzaType": "Pepperoni",
      "pizzaSize": "Medium",
      "quantity": 2,
      "unitPrice": 4000,
      "totalPrice": 8000,
      "deliveryAddress": "123 Main St, Lagos, Nigeria",
      "paymentReference": "PIZZA_1234567890_abc123",
      "amountPaid": 8000,
      "paymentStatus": "success",
      "deliveryStatus": "undelivered",
      "createdAt": "2023-01-25T12:34:56.789Z",
      "updatedAt": "2023-01-25T12:34:56.789Z",
      "__v": 0
    }
  ]
}
```

#### Get Order by ID (Admin)

Retrieve a specific order by ID.

- **Endpoint**: `GET /admin/orders/:id`
- **Authentication**: JWT required
- **URL Parameters**:
  - `id`: The order ID

- **Response**: Same as Get All Orders response

#### Update Delivery Status (Admin)

Mark an order as delivered.

- **Endpoint**: `PATCH /admin/orders/:id/deliver`
- **Authentication**: JWT required
- **URL Parameters**:
  - `id`: The order ID

- **Response**:
```json
{
  "statusCode": 200,
  "message": "Order delivery status updated successfully",
  "data": {
    "_id": "63f8a1b2c3d4e5f6a7b8",
    "fullName": "John Doe",
    "phone": "08012345678",
    "email": "john.doe@example.com",
    "pizzaType": "Pepperoni",
    "pizzaSize": "Medium",
    "quantity": 2,
    "unitPrice": 4000,
      "totalPrice": 8000,
      "deliveryAddress": "123 Main St, Lagos, Nigeria",
      "paymentReference": "PIZZA_1234567890_abc123",
      "amountPaid": 8000,
      "paymentStatus": "success",
      "deliveryStatus": "delivered",
      "createdAt": "2023-01-25T12:34:56.789Z",
      "updatedAt": "2023-01-25T12:34:56.789Z",
      "__v": 0
    }
  }
}
```

#### Delete Order (Admin)

Delete an order by ID.

- **Endpoint**: `DELETE /admin/orders/:id`
- **Authentication**: JWT required
- **URL Parameters**:
  - `id`: The order ID

- **Response**:
```json
{
  "statusCode": 200,
  "message": "Order deleted successfully",
  "data": {
    "_id": "63f8a1b2c3d4e5f6a7b8",
    "fullName": "John Doe",
    "phone": "08012345678",
    "email": "john.doe@example.com",
    "pizzaType": "Pepperoni",
    "pizzaSize": "Medium",
    "quantity": 2,
    "unitPrice": 4000,
    "totalPrice": 8000,
    "deliveryAddress": "123 Main St, Lagos, Nigeria",
    "paymentReference": "PIZZA_1234567890_abc123",
    "amountPaid": 8000,
    "paymentStatus": "success",
    "deliveryStatus": "undelivered",
    "createdAt": "2023-01-25T12:34:56.789Z",
    "updatedAt": "2023-01-25T12:34:56.789Z",
    "__v": 0
  }
}
```

#### Get Order Statistics (Admin)

Retrieve order statistics.

- **Endpoint**: `GET /admin/stats`
- **Authentication**: JWT required
- **Response**:
```json
{
  "statusCode": 200,
  "message": "Order statistics retrieved successfully",
  "data": {
    "totalOrders": 10,
    "deliveredOrders": 7,
    "pendingOrders": 3,
    "totalRevenue": 56000,
    "deliveryRate": 70
  }
}
```

## Pizza Types and Pricing

### Available Pizza Types
- Margherita
- Pepperoni
- Hawaiian
- Vegetarian
- BBQ Chicken

### Size Pricing (in Nigerian Naira)

| Pizza Type | Small | Medium | Large |
|-------------|-------|-------|------|
| Margherita | ₦2,500 | ₦3,500 | ₦4,500 |
| Pepperoni | ₦3,000 | ₦4,000 | ₦5,500 |
| Hawaiian | ₦2,800 | ₦3,800 | ₦5,000 |
| Vegetarian | ₦2,600 | ₦3,600 | ₦4,800 |
| BBQ Chicken | ₦3,200 | ₦4,200 | ₦5,800 |

## Error Responses

All endpoints return consistent error responses:

```json
{
  "statusCode": <HTTP_STATUS_CODE>,
  "message": "<Error message>",
  "error": "<Detailed error message if applicable>"
}
```

## Testing

You can test the API using tools like Postman or curl:

```bash
# Test order preview
curl -X POST http://localhost:3000/api/orders/preview \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "John Doe",
    "phone": "08012345678",
    "email": "john.doe@example.com",
    "pizzaType": "Pepperoni",
    "pizzaSize": "Medium",
    "quantity": 2,
    "deliveryAddress": "123 Main St, Lagos, Nigeria"
  }'

# Test admin login
curl -X POST http://localhost:3000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "password123"
  }'