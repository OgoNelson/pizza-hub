# Pizza Hub - System Flow Diagrams

## Overall System Architecture

```mermaid
graph TB
    subgraph "Client Side"
        A[Customer Browser] --> B[React Frontend - pizza-hub-frontend]
        B --> C[Order Form with Size Selection]
        B --> D[Order Preview Page]
        B --> E[Payment Processing]
    end
    
    subgraph "Backend Services"
        F[NestJS API - pizza-hub-api]
        G[Order Service]
        H[Payment Service]
        I[Email Service]
        J[Auth Service]
    end
    
    subgraph "External Services"
        K[Paystack Payment Gateway]
        L[Email Provider - Gmail SMTP]
        M[MongoDB Database]
    end
    
    subgraph "Admin Side"
        N[Admin Dashboard]
        O[Order Management]
    end
    
    C --> F
    D --> F
    E --> H
    F --> G
    F --> H
    F --> I
    F --> J
    H --> K
    I --> L
    G --> M
    J --> M
    N --> F
    O --> F
    K --> H
```

## Customer Order Flow

```mermaid
sequenceDiagram
    participant C as Customer
    participant F as Frontend
    participant API as Backend API
    participant DB as MongoDB
    participant PS as Paystack
    participant ES as Email Service
    
    C->>F: 1. Select pizza type, size, quantity
    F->>API: 2. POST /api/orders/preview
    API->>API: 3. Calculate price based on size
    API->>F: 4. Return price breakdown
    F->>C: 5. Show order preview
    C->>F: 6. Click "Pay Now"
    F->>API: 7. POST /api/payment/init
    API->>PS: 8. Initialize transaction
    PS->>API: 9. Return payment URL
    API->>F: 10. Return payment URL
    F->>C: 11. Redirect to Paystack
    C->>PS: 12. Complete payment
    PS->>API: 13. Webhook notification
    API->>PS: 14. Verify transaction
    API->>DB: 15. Save order (with size details)
    API->>ES: 16. Send confirmation email
    API->>F: 17. Return success status
    F->>C: 18. Show order confirmation
```

## Admin Order Management Flow

```mermaid
sequenceDiagram
    participant A as Admin
    participant D as Dashboard
    participant API as Backend API
    participant DB as MongoDB
    
    A->>D: 1. Login with credentials
    D->>API: 2. POST /api/admin/login
    API->>DB: 3. Verify admin credentials
    API->>D: 4. Return JWT token
    D->>API: 5. GET /api/admin/orders (with JWT)
    API->>DB: 6. Fetch all orders
    API->>D: 7. Return orders list
    D->>A: 8. Display orders with size details
    A->>D: 9. Click "Mark as Delivered"
    D->>API: 10. PATCH /api/admin/orders/:id/deliver
    API->>DB: 11. Update delivery status
    API->>D: 12. Return updated order
    D->>A: 13. Refresh orders list
```

## Pizza Size Pricing Logic Flow

```mermaid
flowchart TD
    A[Customer selects pizza type] --> B[Customer selects size]
    B --> C{Size selected?}
    C -->|Small| D[Apply small price]
    C -->|Medium| E[Apply medium price]
    C -->|Large| F[Apply large price]
    D --> G[Multiply by quantity]
    E --> G
    F --> G
    G --> H[Calculate total price]
    H --> I[Show price breakdown]
    I --> J[Display in order preview]
```

## Database Schema Relationships

```mermaid
erDiagram
    ORDER {
        string id PK
        string fullName
        string phone
        string email
        string pizzaType
        string pizzaSize
        number quantity
        number unitPrice
        number totalPrice
        string deliveryAddress
        number amountPaid
        string paymentReference
        string paymentStatus
        string deliveryStatus
        datetime createdAt
        datetime updatedAt
    }
    
    ADMIN {
        string id PK
        string email
        string password
        string role
        datetime createdAt
        datetime lastLogin
    }
    
    PIZZA_MENU {
        string id PK
        string namea
        string description
        object sizes
        array ingredients
        string image
        boolean available
    }
    
    ADMIN ||--o{ ORDER : manages
    PIZZA_MENU ||--o{ ORDER : contains
```

## Component Architecture (Frontend)

```mermaid
graph TB
    subgraph "App Component"
        A[App.jsx]
    end
    
    subgraph "Pages"
        B[Order Page]
        C[Preview Page]
        D[Payment Page]
        E[Success Page]
        F[Admin Login]
        G[Admin Dashboard]
    end
    
    subgraph "Components"
        H[OrderForm]
        I[PizzaSelector]
        J[SizeSelector]
        K[QuantitySelector]
        L[OrderSummary]
        M[PaymentForm]
        N[OrderList]
        O[OrderCard]
    end
    
    subgraph "Services"
        P[orderService]
        Q[authService]
        R[paymentService]
    end
    
    A --> B
    A --> C
    A --> D
    A --> E
    A --> F
    A --> G
    
    B --> H
    B --> I
    B --> J
    B --> K
    
    C --> L
    D --> M
    G --> N
    N --> O
    
    H --> P
    I --> P
    J --> P
    K --> P
    L --> P
    M --> R
    F --> Q
    G --> Q
```

## API Endpoint Structure

```mermaid
graph LR
    subgraph "Order Endpoints"
        A[POST /api/orders/preview]
        B[POST /api/orders/create]
        C[GET /api/orders/:reference]
    end
    
    subgraph "Payment Endpoints"
        D[POST /api/payment/init]
        E[GET /api/payment/verify/:ref]
        F[POST /api/payment/webhook]
    end
    
    subgraph "Admin Endpoints"
        G[POST /api/admin/login]
        H[GET /api/admin/orders]
        I[GET /api/admin/orders/:id]
        J[PATCH /api/admin/orders/:id/deliver]
        K[DELETE /api/admin/orders/:id]
        L[GET /api/admin/stats]
    end
    
    subgraph "Auth Middleware"
        M[JWT Guard]
    end
    
    G --> M
    H --> M
    I --> M
    J --> M
    K --> M
    L --> M
```

These diagrams provide a comprehensive visual representation of the pizza ordering system, including the enhanced pizza size feature and the updated project structure with Tailwind CSS styling.