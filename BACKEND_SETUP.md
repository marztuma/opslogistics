# OPS Logistics Backend Setup Guide

Complete setup instructions for the Node.js + Express + PostgreSQL backend system.

## Project Structure

```
ops-logistics/
├── backend/                    # Node.js Express API
│   ├── config/
│   │   ├── database.js        # PostgreSQL connection
│   │   └── schema.sql         # Database schema
│   ├── middleware/
│   │   └── auth.js            # JWT authentication
│   ├── routes/
│   │   ├── auth.js            # Authentication endpoints
│   │   ├── shipments.js       # Shipment management
│   │   ├── quotes.js          # Quote generation
│   │   ├── orders.js          # Order management
│   │   ├── tracking.js        # Public tracking
│   │   ├── pricing.js         # Pricing management
│   │   ├── customers.js       # Customer management
│   │   └── admin.js           # Admin dashboard API
│   ├── server.js              # Express app entry point
│   ├── package.json           # Dependencies
│   ├── .env.example           # Environment template
│   └── README.md              # Backend documentation
│
├── admin-dashboard/           # Admin interface
│   ├── index.html            # Dashboard UI
│   ├── login.html            # Login page
│   ├── app.js                # Dashboard logic
│   └── styles.css            # (embedded in HTML)
│
├── opslogistic/              # Frontend (existing)
└── BACKEND_SETUP.md          # This file
```

## Prerequisites

### Required Software
- **Node.js**: v16.0.0 or higher
- **PostgreSQL**: v12.0 or higher
- **npm**: v7.0.0 or higher (comes with Node.js)
- **Git**: For version control

### System Requirements
- 2GB RAM minimum
- 500MB disk space for database
- Internet connection for npm packages

## Installation Steps

### Step 1: Install Node.js and PostgreSQL

**Windows:**
- Download Node.js from https://nodejs.org/ (LTS recommended)
- Download PostgreSQL from https://www.postgresql.org/download/
- Follow the installation wizards, remember the PostgreSQL password

**macOS:**
```bash
brew install node
brew install postgresql@14
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install nodejs npm postgresql postgresql-contrib
```

### Step 2: Create PostgreSQL Database

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE ops_logistics;

# Create admin user (optional)
CREATE USER ops_admin WITH PASSWORD 'secure_password_here';
GRANT ALL PRIVILEGES ON DATABASE ops_logistics TO ops_admin;

# Exit
\q
```

### Step 3: Setup Backend

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Copy and configure environment variables
cp .env.example .env

# Edit .env file with your configuration
# (Update DB credentials, JWT secret, etc.)
```

### Step 4: Initialize Database Schema

```bash
# Run database migrations
psql -U postgres -d ops_logistics -f config/schema.sql
```

### Step 5: Create Initial Admin User

```bash
# Connect to database
psql -U postgres -d ops_logistics

# Insert admin user
INSERT INTO users (email, password_hash, first_name, last_name, role, status)
VALUES ('admin@opslogistic.com', '$2a$10$YixLn2/lKr/tTR6CyYYjjOfRqkRAiXLbXTNlOvbFvmJIqJI5cSmg6', 'Admin', 'User', 'admin', 'active');

# Exit
\q
```

**Note:** The password hash above is for "admin123". For production, generate a new hash using bcryptjs.

### Step 6: Start Backend Server

```bash
# Development mode (with auto-reload)
npm run dev

# Or production mode
npm start
```

You should see:
```
OPS Logistics API running on port 5000
```

### Step 7: Setup Admin Dashboard

```bash
# The admin dashboard is in admin-dashboard/
# Serve it using a simple HTTP server

# Option 1: Using Python (if installed)
cd admin-dashboard
python -m http.server 8000

# Option 2: Using Node.js
npx http-server admin-dashboard -p 8000
```

Access the dashboard at `http://localhost:8000/login.html`

## Environment Configuration

Edit `.env` file:

```bash
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ops_logistics
DB_USER=postgres
DB_PASSWORD=your_postgres_password

# JWT
JWT_SECRET=your_super_secret_jwt_key_change_this
JWT_EXPIRY=7d

# Server
PORT=5000
NODE_ENV=development

# Payment Gateway (optional)
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_PUBLISHABLE_KEY=pk_test_xxx

# Email Service (optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password
```

## API Endpoints Summary

### Authentication
```
POST   /api/auth/register      - Register new user
POST   /api/auth/login         - Login user
GET    /api/auth/me            - Get current user
```

### Customers
```
GET    /api/customers/profile   - Get customer profile
PUT    /api/customers/profile   - Update customer profile
GET    /api/customers/addresses - Get addresses
POST   /api/customers/addresses - Add address
GET    /api/customers/stats     - Get statistics
```

### Shipments
```
POST   /api/shipments           - Create shipment
GET    /api/shipments           - Get all shipments
GET    /api/shipments/:id       - Get shipment details
PUT    /api/shipments/:id/status - Update status
```

### Tracking (Public)
```
GET    /api/tracking/:trackingNumber - Track shipment
POST   /api/tracking/batch      - Batch tracking
```

### Quotes
```
POST   /api/quotes              - Generate quote
GET    /api/quotes              - Get customer quotes
GET    /api/quotes/:id          - Get quote details
```

### Orders
```
POST   /api/orders              - Create order
GET    /api/orders              - Get customer orders
GET    /api/orders/:id          - Get order details
PUT    /api/orders/:id/status   - Update order status
PUT    /api/orders/:id/payment  - Update payment status
```

### Pricing (Admin)
```
GET    /api/pricing/rules       - Get pricing rules
POST   /api/pricing/rules       - Create pricing rule
PUT    /api/pricing/rules/:id   - Update pricing rule
GET    /api/pricing/tariffs     - Get tariff rates
PUT    /api/pricing/tariffs/:id - Update tariff rate
GET    /api/pricing/discounts   - Get volume discounts
POST   /api/pricing/discounts   - Create volume discount
```

### Admin
```
GET    /api/admin/dashboard     - Dashboard statistics
GET    /api/admin/shipments     - All shipments
GET    /api/admin/customers     - All customers
GET    /api/admin/customers/:id - Customer details
PUT    /api/admin/customers/:id/tier - Update customer tier
GET    /api/admin/orders        - All orders
GET    /api/admin/reports/revenue - Revenue report
GET    /api/admin/reports/shipments - Shipment analytics
GET    /api/admin/users         - All users
POST   /api/admin/users         - Create user
```

## Testing the API

### Using cURL

```bash
# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@opslogistic.com","password":"admin123"}'

# Get dashboard stats (requires token)
curl -X GET http://localhost:5000/api/admin/dashboard \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Create shipment
curl -X POST http://localhost:5000/api/shipments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "origin_address_id": 1,
    "destination_address_id": 2,
    "shipment_type": "parcel",
    "service_type": "express",
    "weight": 2.5,
    "contents": "Electronics"
  }'

# Track shipment
curl http://localhost:5000/api/tracking/OPS12345678
```

### Using Postman

1. Download Postman from https://www.postman.com/downloads/
2. Import the API collection:
   - Create a new collection
   - Add requests for each endpoint
   - Set up environment variables for host, port, token
   - Use pre-request scripts to set authorization header

## Database Backup & Restore

### Backup
```bash
pg_dump -U postgres -d ops_logistics > backup.sql
```

### Restore
```bash
psql -U postgres -d ops_logistics < backup.sql
```

## Troubleshooting

### Port Already in Use
```bash
# Kill process using port 5000
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:5000 | xargs kill -9
```

### Database Connection Error
- Check PostgreSQL is running: `psql -U postgres`
- Verify .env credentials
- Check database exists: `psql -U postgres -l`

### JWT Token Expired
- Generate new token by logging in again
- Token expires after 7 days (configurable in .env)

### CORS Errors
- Ensure frontend is running on correct port
- Update CORS in server.js if needed
- Browser may cache CORS settings

## Performance Optimization

### Database
- Add more indexes for frequently queried fields
- Archive old shipments to separate table
- Use connection pooling (already configured)

### API
- Implement caching (Redis)
- Add API rate limiting
- Pagination for large datasets

### Frontend
- Lazy load dashboard sections
- Implement infinite scroll for tables
- Cache API responses locally

## Security Checklist

- [ ] Change default JWT secret in .env
- [ ] Use strong PostgreSQL password
- [ ] Enable HTTPS in production
- [ ] Implement rate limiting
- [ ] Add CORS whitelist
- [ ] Sanitize user inputs
- [ ] Use environment variables for secrets
- [ ] Enable SQL query logging
- [ ] Regular security audits
- [ ] Backup database daily

## Production Deployment

### Using Heroku

```bash
# Login to Heroku
heroku login

# Create app
heroku create ops-logistics-api

# Add PostgreSQL
heroku addons:create heroku-postgresql:standard-0

# Set environment variables
heroku config:set JWT_SECRET=your_secret_key

# Deploy
git push heroku main
```

### Using AWS

1. Create EC2 instance (Ubuntu 20.04)
2. Install Node.js and PostgreSQL
3. Clone repository
4. Configure environment variables
5. Use PM2 for process management
6. Setup Nginx as reverse proxy
7. Configure SSL with Let's Encrypt

### Using Docker

```bash
# Build image
docker build -t ops-logistics-api .

# Run container
docker run -p 5000:5000 \
  -e DB_HOST=postgres \
  -e DB_PASSWORD=postgres \
  ops-logistics-api
```

## Monitoring & Logging

### Using PM2 (Node.js Process Manager)

```bash
npm install -g pm2

# Start application
pm2 start server.js --name "ops-api"

# Monitor
pm2 monit

# View logs
pm2 logs ops-api
```

### Database Monitoring

```bash
# Connect to database
psql -U postgres -d ops_logistics

# View table sizes
SELECT schemaname, tablename, pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables
WHERE schemaname NOT IN ('pg_catalog', 'information_schema')
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

## Support & Resources

- Node.js Documentation: https://nodejs.org/docs/
- Express.js Guide: https://expressjs.com/
- PostgreSQL Manual: https://www.postgresql.org/docs/
- JWT Introduction: https://jwt.io/introduction/
- API Design Best Practices: https://restfulapi.net/

## Next Steps

1. **Frontend Integration**: Connect the React frontend to these API endpoints
2. **Real-time Updates**: Add WebSocket support for live tracking
3. **Advanced Features**: Implement rate limiting, caching, queue jobs
4. **Testing**: Add unit and integration tests with Jest
5. **Documentation**: Generate API docs with Swagger/OpenAPI
6. **Monitoring**: Setup application performance monitoring
7. **Payment Integration**: Add Stripe/PayPal payment processing
8. **Email Service**: Setup email notifications

## Contact

For support or questions:
- Email: support@opslogistic.com
- GitHub: https://github.com/opslogistics
