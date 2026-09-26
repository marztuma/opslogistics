# Neon DB & Cloudinary Integration Guide

## Setup Instructions

### 1. Neon PostgreSQL Database

#### Step 1: Get Your Connection String
1. Log in to [Neon Console](https://console.neon.tech)
2. Navigate to your project
3. Click on your database
4. Copy the connection string (looks like: `postgresql://username:password@ep-xxxx.region.neon.tech/database?sslmode=require`)

#### Step 2: Update .env File
Create `.env` file in `/backend` directory:

```env
# Neon Database Connection
DATABASE_URL=postgresql://username:password@ep-xxxx.region.neon.tech/ops_logistics?sslmode=require

# JWT Configuration
JWT_SECRET=your_secure_random_string_here
JWT_EXPIRY=7d

# Server
PORT=5000
NODE_ENV=development

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

#### Step 3: Initialize Database Schema
```bash
cd backend
npm install
npm run db:migrate
```

This will create all 28 tables in your Neon database.

---

### 2. Cloudinary Image & File Storage

#### Step 1: Get Your Cloudinary Credentials
1. Log in to [Cloudinary Dashboard](https://cloudinary.com/console)
2. Go to **Dashboard** tab
3. Copy these three values:
   - **Cloud Name**
   - **API Key**
   - **API Secret**

#### Step 2: Add to .env File
```env
CLOUDINARY_CLOUD_NAME=your_cloud_name_here
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here
```

#### Step 3: Create Upload Folder (Optional)
In Cloudinary dashboard:
1. Go to **Settings** → **Upload**
2. Set "Upload presets" for automated folder organization
3. Recommended: Create preset named "opslogistics" with folder "opslogistics"

---

## API Endpoints for File Management

### Upload Single Document
```bash
POST /api/uploads/document
Authorization: Bearer {token}
Content-Type: multipart/form-data

File: document.pdf
Body: { "document_type": "shipment_proof" }
```

### Upload Multiple Shipment Images
```bash
POST /api/uploads/shipment-images/:shipmentId
Authorization: Bearer {token}
Content-Type: multipart/form-data

Files: image1.jpg, image2.jpg, image3.jpg
```

### Get User Documents
```bash
GET /api/uploads/documents
Authorization: Bearer {token}
```

### Get Shipment Images
```bash
GET /api/uploads/shipment-images/:shipmentId
Authorization: Bearer {token}
```

### Delete Document
```bash
DELETE /api/uploads/documents/:documentId
Authorization: Bearer {token}
```

---

## Frontend Integration (JavaScript)

### Upload File via Frontend
```javascript
// Get upload signature from backend
const getSignature = async () => {
  const response = await fetch('http://localhost:5000/api/uploads/signature');
  return response.json();
};

// Upload directly to Cloudinary
const uploadToCloudinary = async (file) => {
  const { timestamp, signature, cloudName, apiKey } = await getSignature();
  
  const formData = new FormData();
  formData.append('file', file);
  formData.append('api_key', apiKey);
  formData.append('timestamp', timestamp);
  formData.append('signature', signature);
  formData.append('folder', 'opslogistics');
  
  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    { method: 'POST', body: formData }
  );
  
  return response.json();
};
```

### Upload via Backend Endpoint
```javascript
const uploadDocument = async (file, token) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('document_type', 'shipment_proof');
  
  const response = await fetch('http://localhost:5000/api/uploads/document', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` },
    body: formData
  });
  
  return response.json();
};
```

---

## Database Tables for File Management

### documents table
```sql
CREATE TABLE documents (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  document_type VARCHAR(100),
  file_url TEXT NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  file_size INTEGER,
  cloudinary_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### shipment_images table
```sql
CREATE TABLE shipment_images (
  id SERIAL PRIMARY KEY,
  shipment_id INTEGER NOT NULL REFERENCES shipments(id),
  image_url TEXT NOT NULL,
  cloudinary_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## Testing the Integration

### 1. Test Neon Connection
```bash
cd backend
npm start

# Check console for: "OPS Logistics API running on port 5000"
# Visit http://localhost:5000/health
```

### 2. Test Cloudinary Upload
```bash
# Login to get token
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}'

# Copy token from response

# Upload test file
curl -X POST http://localhost:5000/api/uploads/document \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@test.pdf" \
  -F "document_type=invoice"
```

---

## Environment Variables Checklist

- [ ] `DATABASE_URL` — Neon connection string
- [ ] `JWT_SECRET` — Random 32+ character string
- [ ] `JWT_EXPIRY` — "7d" for 7 days
- [ ] `PORT` — 5000 or your preferred port
- [ ] `NODE_ENV` — "development" or "production"
- [ ] `CLOUDINARY_CLOUD_NAME` — From Cloudinary dashboard
- [ ] `CLOUDINARY_API_KEY` — From Cloudinary dashboard
- [ ] `CLOUDINARY_API_SECRET` — From Cloudinary dashboard

---

## Troubleshooting

### Connection Timeout on Neon
```
Error: connect ECONNREFUSED
```
**Solution:** Ensure DATABASE_URL includes `?sslmode=require` and you're using the correct IP/region.

### Cloudinary Authentication Failed
```
Error: Invalid API Key
```
**Solution:** Double-check your API credentials in .env file. No spaces or typos.

### File Upload Size Limit
```
Error: File too large
```
**Solution:** Default limit is 50MB. Change in `backend/middleware/cloudinary.js` line 18.

### Images Not Showing
```
Cloudinary URL returns 404
```
**Solution:** Check that folder "opslogistics" exists in your Cloudinary account. Images must be in the correct folder.

---

## Security Notes

1. **Never commit .env file** — Add to .gitignore
2. **API Secret never in frontend** — Use server-side uploads or signed URLs
3. **Validate file types** — Already configured to allow: jpg, jpeg, png, gif, pdf, zip
4. **File size limits** — 50MB max per file
5. **User authentication** — All upload endpoints require valid JWT token

---

## Next Steps

1. ✅ Configure .env with Neon and Cloudinary credentials
2. ✅ Run `npm install` to install dependencies
3. ✅ Run `npm run db:migrate` to create database schema
4. ✅ Run `npm start` to start the backend
5. ✅ Test endpoints with provided cURL examples
6. ✅ Integrate upload UI into frontend forms

All files are ready. Just add your credentials and you're live! 🚀
