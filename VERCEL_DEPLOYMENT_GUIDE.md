# Deploy OPS Logistics Backend to Vercel

Complete step-by-step guide to deploy your Node.js backend to Vercel with Neon database and Cloudinary integration.

---

## PART 1: PREPARE BACKEND FOR VERCEL

### Step 1: Update package.json
Make sure your backend `package.json` has:

```json
{
  "name": "ops-logistics-backend",
  "version": "1.0.0",
  "description": "OPS Logistics Backend API",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "engines": {
    "node": "18.x"
  },
  "dependencies": {
    "express": "^4.18.2",
    "pg": "^8.10.0",
    "dotenv": "^16.3.1",
    "jsonwebtoken": "^9.1.0",
    "bcryptjs": "^2.4.3",
    "cors": "^2.8.5",
    "helmet": "^7.1.0",
    "cloudinary": "^1.40.0",
    "multer": "^1.4.5-lts.1",
    "multer-storage-cloudinary": "^4.0.0"
  }
}
```

### Step 2: Create vercel.json
Create a file named `vercel.json` in the `/backend` folder:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "server.js"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
```

### Step 3: Update server.js (if needed)
Make sure your server.js listens on the correct port:

```javascript
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`OPS Logistics API running on port ${PORT}`);
});
```

✅ **Backend is ready!**

---

## PART 2: SET UP VERCEL ACCOUNT

### Step 1: Go to Vercel
1. Open: https://vercel.com
2. Click **"Sign Up"** (or Sign In if you have account)
3. Choose **"Continue with GitHub"**
4. Authorize Vercel to access your GitHub account

### Step 2: You're In!
Once signed in, you'll see the Vercel dashboard.

---

## PART 3: CONNECT GITHUB REPO TO VERCEL

### Step 1: Import Project
1. On Vercel dashboard, click **"Add New"** button (top right)
2. Select **"Project"**
3. Click **"Import Git Repository"**

### Step 2: Select Your Repo
1. Look for: `marztuma/opslogistics`
2. Click **"Select"** or **"Import"**
3. If you don't see it, click **"Configure GitHub App"** and give Vercel access

### Step 3: Configure Project
On the "Import Project" page:

**Project Name:** `opslogistics-backend` (or any name)

**Framework Preset:** Select `"Other"` (it's a Node.js backend, not Next.js)

**Root Directory:** Change to `backend` (since your backend code is in `/backend` folder)

Then click **"Deploy"**

✅ **Vercel will start building!** This takes 2-5 minutes.

---

## PART 4: ADD ENVIRONMENT VARIABLES

### Step 1: Go to Project Settings
1. After deployment completes, click on your project
2. Go to **"Settings"** tab (top menu)
3. Click **"Environment Variables"** on the left sidebar

### Step 2: Add Each Variable
Click **"Add New"** for each variable and fill in:

| Variable Name | Value | Production |
|---|---|---|
| `DATABASE_URL` | `postgresql://neondb_owner:npg_2M9lmUtSbyqj@ep-shy-sea-b5qk55ac-pooler.c-7.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require` | ✅ |
| `JWT_SECRET` | `a7f8e9c2b1d4e5f6a7c8b9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9` | ✅ |
| `JWT_EXPIRY` | `7d` | ✅ |
| `CLOUDINARY_CLOUD_NAME` | `tvt96rdp` | ✅ |
| `CLOUDINARY_API_KEY` | `878758565797914` | ✅ |
| `CLOUDINARY_API_SECRET` | `aiplss9zWSgmAOIns_VMcdmgmDk` | ✅ |
| `NODE_ENV` | `production` | ✅ |

**For each one:**
1. Enter the variable name (left box)
2. Enter the value (right box)
3. Check the **"Production"** checkbox
4. Click **"Save"**

✅ **All variables added!**

---

## PART 5: REDEPLOY WITH ENVIRONMENT VARIABLES

### Step 1: Trigger Redeploy
1. Go to **"Deployments"** tab (top menu)
2. Click the three dots (**...**) on the latest deployment
3. Select **"Redeploy"**
4. Confirm **"Redeploy"**

Vercel will rebuild with the environment variables. This takes 2-5 minutes.

### Step 2: Check Status
You should see a green checkmark (✅) when deployment is complete.

---

## PART 6: GET YOUR LIVE URL

### Step 1: Find Your URL
1. Go to **"Overview"** tab
2. Look for **"Production"** section
3. Your URL is displayed (looks like: `https://opslogistics-backend.vercel.app`)

### Step 2: Test It
Open in browser:
```
https://opslogistics-backend.vercel.app/health
```

You should see:
```json
{"status":"OK","timestamp":"2026-09-26T..."}
```

✅ **Backend is LIVE!**

---

## PART 7: UPDATE FRONTEND TO USE LIVE API

Now update your frontend to use the live API URL instead of localhost:

### In `/opslogistic` folder, update all JavaScript files:

**Change this:**
```javascript
const API_URL = 'http://localhost:5000/api';
```

**To this:**
```javascript
const API_URL = 'https://opslogistics-backend.vercel.app/api';
```

**Files to update:**
- `login-script.js`
- `register-script.js`
- `quote.js` or `quote-script.js`
- `ship-now-script.js`
- `admin-dashboard-script.js`
- `track.html` (if it has inline JavaScript)
- `live-tracking-script.js`
- `batch-shipments-script.js`
- `containers-shop-script.js`
- `chat-widget.js`
- `customer-portal.html` (if it has inline scripts)

### Quick Find & Replace:
Use your editor's Find & Replace (Ctrl+H):
- Find: `http://localhost:5000/api`
- Replace: `https://opslogistics-backend.vercel.app/api`

---

## PART 8: DEPLOY FRONTEND TO VERCEL

Repeat the same process for the frontend:

### Step 1: Add Frontend Project
1. In Vercel dashboard, click **"Add New"** → **"Project"**
2. Import the same `opslogistics` repo again
3. **Project Name:** `opslogistics-frontend`
4. **Framework Preset:** Select `"Other"` (static HTML/JS)
5. **Root Directory:** Change to `opslogistic`
6. Click **"Deploy"**

### Step 2: Configure Frontend Build
In Settings:
1. Go to **"Build & Development Settings"**
2. **Build Command:** Leave empty (or `echo "No build needed"`)
3. **Output Directory:** `.` (current directory)
4. Click **"Save"**

### Step 3: Redeploy
1. Go to **"Deployments"**
2. Click the three dots on the latest deployment
3. Click **"Redeploy"**

✅ **Frontend is live!**

---

## YOUR LIVE URLS

Once both are deployed:

**Backend API:**
```
https://opslogistics-backend.vercel.app
```
Health check: https://opslogistics-backend.vercel.app/health

**Frontend Website:**
```
https://opslogistics-frontend.vercel.app
```

---

## TROUBLESHOOTING

### "Build failed"
1. Check `vercel.json` exists in `/backend` folder
2. Make sure `package.json` has correct `"main": "server.js"`
3. Check `server.js` has correct PORT setup

### "API not responding"
1. Verify all environment variables are added
2. Go to Settings → Environment Variables
3. Make sure `DATABASE_URL` is complete and correct
4. Redeploy after adding variables

### "Database connection error"
1. Check `DATABASE_URL` has no typos
2. Verify Neon is accessible from Vercel (it should be)
3. Check that `&channel_binding=require` is in the URL

### "Cloudinary upload not working"
1. Verify all three Cloudinary variables are added
2. Make sure API Secret is correct (copy carefully)
3. Redeploy after making changes

---

## MONITORING YOUR DEPLOYMENT

### View Logs
1. Go to **"Overview"** tab
2. Scroll to **"Recent Deployments"**
3. Click on the deployment
4. Scroll down to see **"Build Logs"** and **"Function Logs"**

### Set Up Alerts
1. Go to **"Settings"** → **"Notifications"**
2. Enable deployment notifications via email

---

## NEXT STEPS

1. ✅ Update all API URLs in frontend files
2. ✅ Deploy frontend to Vercel
3. ✅ Test all features (quote, ship, track)
4. ✅ Share your live URLs with team
5. ✅ Monitor logs for any errors

---

## QUICK REFERENCE

| Item | Value |
|---|---|
| Backend URL | https://opslogistics-backend.vercel.app |
| Frontend URL | https://opslogistics-frontend.vercel.app |
| Health Check | https://opslogistics-backend.vercel.app/health |
| Database | Neon (postgresql) |
| File Storage | Cloudinary |
| Environment | Production on Vercel |

---

## SUCCESS CHECKLIST

- [ ] Backend deployed to Vercel
- [ ] All environment variables added
- [ ] Health check returns OK
- [ ] Frontend updated with live API URL
- [ ] Frontend deployed to Vercel
- [ ] Quote form works with live API
- [ ] Track shipment works
- [ ] File uploads to Cloudinary working
- [ ] Custom domain set up (optional)
- [ ] Monitoring & alerts enabled

✅ You're ready to go live!
