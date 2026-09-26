# OPS Logistics - Quick Start Guide

## What's Included

### Backend (Node.js + Express + PostgreSQL)
✅ Complete REST API with 8 route modules  
✅ JWT authentication system  
✅ Database schema with 28 tables  
✅ Admin dashboard API endpoints  
✅ Quote generation & pricing calculations  
✅ Real-time shipment tracking  
✅ Customer management  
✅ Order & invoice processing  

### Admin Dashboard
✅ Login page with authentication  
✅ Dashboard with 8 KPI cards  
✅ Shipment management interface  
✅ Order tracking  
✅ Customer management  
✅ Pricing rule management  
✅ Revenue & analytics reports  
✅ User management  

## 5-Minute Setup

### 1. Install PostgreSQL
**Windows:** Download from https://www.postgresql.org/download/  
**Mac:** `brew install postgresql@14`  
**Linux:** `sudo apt install postgresql`

### 2. Create Database
```bash
psql -U postgres
CREATE DATABASE ops_logistics;
\q
```

### 3. Setup Backend
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your database credentials
psql -U postgres -d ops_logistics -f config/schema.sql
npm run dev
```

The API runs on `http://localhost:5000`

### 4. Start Admin Dashboard
```bash
cd admin-dashboard
# Option A: Python
python -m http.server 8000

# Option B: Node.js
npx http-server . -p 8000
```

Access at `http://localhost:8000/login.html`

### 5. Login
- Email: `admin@opslogistic.com`
- Password: `admin123`

## File Structure Created

```
backend/
├── config/
│   ├── database.js         - PostgreSQL connection pool
│   └── schema.sql          - Complete database schema (28 tables)
├── middleware/
│   └── auth.js             - JWT & role-based access control
├── routes/
│   ├── auth.js             - Registration & login (2 endpoints)
│   ├── shipments.js        - Shipment CRUD (5 endpoints)
│   ├── quotes.js           - Quote generation (3 endpoints)
│   ├── orders.js           - Order management (5 endpoints)
│   ├── tracking.js         - Public tracking (2 endpoints)
│   ├── pricing.js          - Pricing rules & tariffs (6 endpoints)
│   ├── customers.js        - Customer management (6 endpoints)
│   └── admin.js            - Admin dashboard (10 endpoints)
├── server.js               - Express app setup
├── package.json            - Dependencies
├── .env.example            - Configuration template
└── README.md               - Backend documentation

admin-dashboard/
├── index.html              - Main dashboard interface
├── login.html              - Admin login page
└── app.js                  - Dashboard JavaScript logic

BACKEND_SETUP.md            - Complete setup & deployment guide
QUICK_START.md             - This file
```

## Core Features Built

### 1. Authentication System
- User registration
- Email/password login
- JWT token-based sessions
- Role-based access (customer, admin, support)

### 2. Shipment Management
- Create shipments with tracking numbers
- Track shipments in real-time
- Update shipment status with history
- Multiple shipment types (document, parcel, freight, container)

### 3. Quote & Pricing
- Dynamic pricing based on weight, distance, service type
- Automatic tariff/duty calculations
- Volume discount management
- Pricing rule configuration

### 4. Order Processing
- Create orders from shipments
- Payment status tracking
- Invoice generation
- Order history

### 5. Customer Management
- Customer profiles
- Address book
- Shipment history
- Spending analytics

### 6. Admin Dashboard
- 8-panel KPI dashboard
- Real-time shipment status overview
- Customer & order management
- Revenue reports
- Pricing configuration
- User management

### 7. Database Features
- 28 comprehensive tables
- Proper foreign key relationships
- Performance indexes
- Soft delete support
- Audit trails

## API Examples

### Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "secure123",
    "first_name": "John",
    "last_name": "Doe",
    "business_name": "ABC Corp"
  }'
```

### Generate Quote
```bash
curl -X POST http://localhost:5000/api/quotes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{
    "origin_country": "USA",
    "destination_country": "UK",
    "weight": 5,
    "service_type": "express",
    "shipment_type": "parcel",
    "items": [{"value": 100, "hs_code": "1234567890"}]
  }'
```

### Create Shipment
```bash
curl -X POST http://localhost:5000/api/shipments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{
    "origin_address_id": 1,
    "destination_address_id": 2,
    "shipment_type": "parcel",
    "service_type": "express",
    "weight": 2.5,
    "contents": "Electronics"
  }'
```

### Track Shipment (Public)
```bash
curl http://localhost:5000/api/tracking/OPS123456789
```

### Get Dashboard Stats (Admin)
```bash
curl http://localhost:5000/api/admin/dashboard \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

## Database Tables

**Users & Customers**
- users, customers, addresses

**Shipments**
- shipments, shipment_items, shipment_tracking

**Orders & Invoices**
- orders, invoices, invoice_items, payments

**Quotes & Pricing**
- quotes, pricing_rules, tariff_rates, volume_discounts

**Inventory**
- containers, warehouse_zones, cargo_storage

**Cold Chain**
- cold_chain_shipments, temperature_readings

**Fleet**
- vehicles, delivery_routes, delivery_stops

**Compliance**
- customs_documents, compliance_checks

**Support**
- notifications

## Environment Variables

```bash
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ops_logistics
DB_USER=postgres
DB_PASSWORD=your_password

# Security
JWT_SECRET=change_this_secret_key
JWT_EXPIRY=7d

# Server
PORT=5000
NODE_ENV=development
```

## Testing the System

### Step 1: Create Admin Account
```bash
psql -U postgres -d ops_logistics
INSERT INTO users (email, password_hash, first_name, last_name, role)
VALUES ('admin@example.com', '$2a$10$YixLn2/lKr/tTR6CyYYjjOfRqkRAiXLbXTNlOvbFvmJIqJI5cSmg6', 'Admin', 'User', 'admin');
\q
```

### Step 2: Login to Dashboard
- Go to `http://localhost:8000/login.html`
- Use credentials above
- View dashboard statistics

### Step 3: Create Customer Account
- Use API to register new customer
- Create addresses
- Generate quotes
- Create shipments
- Track in real-time

### Step 4: Test Admin Functions
- View all shipments
- Monitor orders & payments
- Adjust pricing rules
- Manage users
- View revenue reports

## Next Steps

### 1. Connect to Frontend
Update your React/Vue frontend to use these endpoints:
```javascript
const API_URL = 'http://localhost:5000/api';
const token = localStorage.getItem('authToken');

// Example: Get quotes
fetch(`${API_URL}/quotes`, {
  headers: { 'Authorization': `Bearer ${token}` }
})
```

### 2. Add WebSocket Support
For real-time tracking updates:
```javascript
const socket = io('http://localhost:5000');
socket.on('shipment:update', (data) => {
  console.log('Shipment status:', data);
});
```

### 3. Implement Payment Processing
Integrate Stripe or PayPal to the orders endpoint for payment collection.

### 4. Add Email Notifications
Setup SMTP in .env to send:
- Order confirmations
- Shipment updates
- Delivery notifications

### 5. Deploy to Production
- Set up on AWS, Heroku, or DigitalOcean
- Configure HTTPS/SSL
- Setup monitoring & alerting
- Configure database backups

## Troubleshooting

**Port 5000 Already in Use?**
```bash
# Kill process
lsof -ti:5000 | xargs kill -9
```

**Can't Connect to Database?**
```bash
# Check PostgreSQL is running
psql -U postgres -c "SELECT version();"
```

**Admin Login Not Working?**
```bash
# Reset admin password
psql -U postgres -d ops_logistics
UPDATE users SET password_hash = '$2a$10$YixLn2/lKr/tTR6CyYYjjOfRqkRAiXLbXTNlOvbFvmJIqJI5cSmg6' WHERE email = 'admin@opslogistic.com';
\q
```

## Support

📧 Email: support@opslogistic.com  
📚 Docs: See BACKEND_SETUP.md for complete documentation  
🐛 Issues: Check logs in `npm run dev` output  

## Architecture Overview

```
┌─────────────────────────────────────────┐
│     Admin Dashboard (Browser)           │
│  ├─ Login, Shipments, Orders            │
│  ├─ Customers, Pricing, Reports         │
│  └─ Real-time Statistics                │
└──────────────┬──────────────────────────┘
               │ HTTP/REST
               ▼
┌─────────────────────────────────────────┐
│    Express.js API Server (Port 5000)    │
│  ├─ Authentication (JWT)                │
│  ├─ Business Logic                      │
│  ├─ Validation & Authorization          │
│  └─ Error Handling                      │
└──────────────┬──────────────────────────┘
               │ SQL
               ▼
┌─────────────────────────────────────────┐
│   PostgreSQL Database (28 Tables)       │
│  ├─ Users & Customers                   │
│  ├─ Shipments & Tracking                │
│  ├─ Orders & Payments                   │
│  ├─ Pricing & Tariffs                   │
│  └─ Compliance & Documents              │
└─────────────────────────────────────────┘
```

---

Ready to go! Start with Step 1 above, and you'll have a fully functional logistics backend running in minutes.
