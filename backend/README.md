# OPS Logistics Backend API

Node.js + Express + PostgreSQL REST API for OPS Logistics shipping and logistics platform.

## Setup Instructions

### Prerequisites
- Node.js 16+
- PostgreSQL 12+
- npm or yarn

### Installation

1. **Clone and install dependencies**
```bash
cd backend
npm install
```

2. **Setup environment variables**
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. **Create PostgreSQL database**
```bash
createdb ops_logistics
```

4. **Run database migrations**
```bash
psql -U postgres -d ops_logistics -f config/schema.sql
```

5. **Start the server**
```bash
npm run dev  # Development with nodemon
npm start   # Production
```

The API will be available at `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires token)

### Customers
- `GET /api/customers/profile` - Get customer profile
- `PUT /api/customers/profile` - Update customer profile
- `GET /api/customers/addresses` - Get customer addresses
- `POST /api/customers/addresses` - Add address
- `DELETE /api/customers/addresses/:id` - Delete address
- `GET /api/customers/stats` - Get customer statistics

### Shipments
- `POST /api/shipments` - Create shipment
- `GET /api/shipments` - Get all customer shipments
- `GET /api/shipments/:id` - Get shipment details
- `PUT /api/shipments/:id/status` - Update shipment status

### Tracking (Public)
- `GET /api/tracking/:trackingNumber` - Track shipment by tracking number
- `POST /api/tracking/batch` - Track multiple shipments

### Quotes
- `POST /api/quotes` - Generate quote
- `GET /api/quotes` - Get customer quotes
- `GET /api/quotes/:id` - Get quote details

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders` - Get customer orders
- `GET /api/orders/:id` - Get order details
- `PUT /api/orders/:id/status` - Update order status
- `PUT /api/orders/:id/payment` - Update payment status

### Pricing (Admin)
- `GET /api/pricing/rules` - Get pricing rules
- `POST /api/pricing/rules` - Create pricing rule (admin)
- `PUT /api/pricing/rules/:id` - Update pricing rule (admin)
- `GET /api/pricing/tariffs` - Get tariff rates
- `PUT /api/pricing/tariffs/:id` - Update tariff rate (admin)
- `GET /api/pricing/discounts` - Get volume discounts (admin)
- `POST /api/pricing/discounts` - Create volume discount (admin)

### Admin
- `GET /api/admin/dashboard` - Dashboard statistics
- `GET /api/admin/shipments` - All shipments (paginated)
- `GET /api/admin/customers` - All customers (paginated)
- `GET /api/admin/customers/:id` - Customer details
- `PUT /api/admin/customers/:id/tier` - Update customer tier
- `GET /api/admin/orders` - All orders (paginated)
- `GET /api/admin/reports/revenue` - Revenue report
- `GET /api/admin/reports/shipments` - Shipment analytics
- `GET /api/admin/users` - All users
- `POST /api/admin/users` - Create admin user

## Authentication

The API uses JWT tokens for authentication. Include the token in the Authorization header:

```
Authorization: Bearer YOUR_JWT_TOKEN
```

## User Roles

- **customer** - Regular customers, can create/track shipments
- **admin** - Full admin access to all features
- **support** - Support staff, limited admin access

## Database Schema

The database includes tables for:
- Users & Customers
- Shipments & Tracking
- Orders & Invoices
- Quotes & Pricing
- Inventory & Containers
- Fleet & Delivery Routes
- Compliance & Customs
- Notifications

## Development

### Running Tests
```bash
npm test
```

### Database Backup
```bash
pg_dump ops_logistics > backup.sql
```

### Database Restore
```bash
psql ops_logistics < backup.sql
```

## Deployment

### Using Docker
```bash
docker build -t ops-logistics-api .
docker run -p 5000:5000 --env-file .env ops-logistics-api
```

### Using Heroku
```bash
heroku create ops-logistics-api
git push heroku main
```

## Error Handling

All errors are returned as JSON with appropriate HTTP status codes:
- 400 - Bad request
- 401 - Unauthorized
- 403 - Forbidden
- 404 - Not found
- 500 - Server error

## Rate Limiting

Rate limiting is not yet implemented. Consider adding it for production.

## Security

- All passwords are hashed with bcryptjs
- JWT tokens expire after 7 days
- SQL injection is prevented with parameterized queries
- CORS is configured for the frontend domain

## Support

For issues or questions, contact support@opslogistic.com
