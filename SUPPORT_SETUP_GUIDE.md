# Support System Setup - Quick Start

Follow these steps to see the support system in action.

## Step 1: Setup Database (One-time)

```bash
# Connect to PostgreSQL and create support tables
psql -U postgres -d ops_logistics -f backend/config/support-schema.sql
```

✅ This creates:
- Support database tables
- 8 pre-loaded support categories
- 10 FAQs ready to use
- Necessary indexes

## Step 2: Start Backend

```bash
cd backend
npm run dev
```

You should see: `OPS Logistics API running on port 5000`

## Step 3: View Support in Action

### Option A: See Floating Chat Widget (EASIEST)
1. Open any page: `http://localhost:3000/index.html`
2. Look in **bottom-right corner** for a blue circular button with "Help"
3. Click the button to open the chat widget
4. Try:
   - Clicking "View FAQs" to see questions
   - Clicking "Search" to search articles
   - Clicking "Contact Us" to submit a support ticket

### Option B: Full Support Page
1. Open: `http://localhost:3000/support-chat.html`
2. You'll see the complete support interface with:
   - FAQ search
   - Category browsing
   - Contact form
   - Quick links

### Option C: Direct Backend Test
Test API endpoints directly:

```bash
# Get all FAQs
curl http://localhost:5000/api/support/faqs

# Search articles
curl "http://localhost:5000/api/support/search?query=tracking"

# Create a support ticket
curl -X POST http://localhost:5000/api/support/tickets \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "subject": "Test ticket",
    "category": "shipping",
    "message": "This is a test support ticket"
  }'
```

## What You Should See

### Floating Widget (on any page)
```
┌─────────────────────────┐
│                         │
│   Page Content          │
│                         │
│                  ┌───┐  │
│                  │ ? │  │ ← Blue Help Button
│                  └───┘  │
└─────────────────────────┘
```

**Click the button:**
```
┌──────────────────────┐
│    OPS Support    × │
├──────────────────────┤
│ [View FAQs]          │
│ [Search]             │
│ [Contact Us]         │
│ [Track Shipment]     │
├──────────────────────┤
│ [Type message...] ► │
└──────────────────────┘
```

### Full Support Page (`support-chat.html`)
```
┌──────────────────────────────────┐
│   OPS LOGISTICS                  │
│   We're here to help you!        │
├────────────────┬─────────────────┤
│ Search box     │                 │
│ [All Articles] │   FAQs & Content│
│                │                 │
│ Quick Links:   │ ▼ Q: How to     │
│ • Ship package │   track?        │
│ • Track        │                 │
│ • Find parcel  │ ▼ Q: Shipping   │
│ • Change date  │   rates?        │
│ • When arrive? │                 │
│                │ ▼ Q: Delivery   │
│ [Send Message] │   times?        │
└────────────────┴─────────────────┘
```

## Files That Were Updated

### New Files Created
- ✅ `opslogistic/support-chat.html` - Full support page
- ✅ `opslogistic/chat-widget.js` - Floating widget
- ✅ `backend/routes/support.js` - API endpoints
- ✅ `backend/config/support-schema.sql` - Database tables

### Files Updated
- ✅ `backend/server.js` - Added support routes
- ✅ `opslogistic/index.html` - Added widget + Support link
- ✅ All 23+ pages - Added widget + Support link

## Access Points

### Customer Facing
| Page | Access | What's There |
|------|--------|-------------|
| Any Page | Bottom-right corner | Floating chat button |
| `support-chat.html` | Direct URL | Full support interface |
| Navbar | "Support" link | Goes to support-chat.html |

### Admin Dashboard
| Feature | URL | Access |
|---------|-----|--------|
| View Tickets | `/api/admin/tickets` | Admin login required |
| View Stats | `/api/admin/stats` | Admin login required |
| Manage Articles | `/api/admin/articles` | Admin login required |

## Test Scenarios

### Test 1: View FAQs
1. Open any page
2. Click Help button
3. Click "View FAQs"
4. See 10 pre-loaded questions
5. Click a question to expand answer

**Expected:** FAQs display and expand/collapse

### Test 2: Search Articles
1. Open any page
2. Click Help button
3. Click "Search"
4. Type "tracking"
5. See results

**Expected:** Search results appear matching query

### Test 3: Submit Support Ticket
1. Open any page
2. Click Help button
3. Click "Contact Us"
4. Fill in:
   - Name: "John Doe"
   - Email: "john@example.com"
   - Category: "Shipping"
   - Subject: "Test ticket"
   - Message: "This is a test"
5. Click "Send Message"

**Expected:** Success message with ticket number

### Test 4: Check Backend API
```bash
# Should return all FAQs
curl http://localhost:5000/api/support/faqs | jq '.'

# Should return search results
curl "http://localhost:5000/api/support/search?query=shipping" | jq '.'
```

**Expected:** JSON responses with data

## Troubleshooting

### Widget not appearing?
1. Check browser console (F12) for errors
2. Verify `chat-widget.js` exists in `opslogistic/` folder
3. Make sure page has `<script src="chat-widget.js"></script>` before closing `</body>`
4. Check if running on `localhost:3000` (or your dev server port)

### FAQs not loading?
1. Did you run the database migration? Check:
   ```bash
   psql -U postgres -d ops_logistics -c "SELECT COUNT(*) FROM support_faqs;"
   ```
   Should return 10

2. Is backend running on port 5000?
   ```bash
   curl http://localhost:5000/api/support/faqs
   ```
   Should return JSON

3. Check browser console for CORS errors

### Support link not showing in navbar?
1. Verify all pages were updated:
   ```bash
   grep -l "support-chat.html" *.html | wc -l
   ```
   Should be 24 files

2. Hard refresh your browser (Ctrl+Shift+R)

## Admin Features

### View All Support Tickets (Admin)
```bash
# Login first
TOKEN=$(curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@opslogistic.com","password":"admin123"}' \
  | jq -r '.token')

# Get all tickets
curl http://localhost:5000/api/support/admin/tickets \
  -H "Authorization: Bearer $TOKEN"
```

### Get Support Statistics
```bash
curl http://localhost:5000/api/support/admin/stats \
  -H "Authorization: Bearer $TOKEN"
```

### Add Staff Response to Ticket
```bash
curl -X POST http://localhost:5000/api/support/admin/tickets/1/messages \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "message": "We are looking into your issue",
    "is_internal": false
  }'
```

## Features Overview

### Widget Features ✅
- [x] Floating button on all pages
- [x] FAQ browser
- [x] Search functionality
- [x] Contact form
- [x] Remembers if open/closed
- [x] Mobile responsive
- [x] Quick action buttons
- [x] Professional design

### Full Page Features ✅
- [x] Category browsing
- [x] Article search
- [x] FAQ accordion
- [x] Contact form
- [x] Ticket submission
- [x] Success confirmation
- [x] Responsive design
- [x] Article ratings

### Backend Features ✅
- [x] Ticket management
- [x] FAQ & article storage
- [x] Search functionality
- [x] Admin dashboard API
- [x] Statistics tracking
- [x] Message threading
- [x] Feedback collection
- [x] Staff assignment

## Next Steps

1. **Test creating a ticket** - Use contact form
2. **Check admin dashboard** - View in `/admin/`
3. **Add more FAQs** - Edit database or create via admin
4. **Customize categories** - Match your business needs
5. **Configure email** - Add notifications (optional)

## Support System Status

✅ **Database:** Ready (10 FAQs + 8 categories)
✅ **API:** Running on port 5000
✅ **Widget:** On all 24 pages
✅ **Full Page:** Available at support-chat.html
✅ **Admin Tools:** Ready in backend API
✅ **Links:** Updated in navbar

**System is fully operational!**

---

Having issues? Check:
1. Backend running (`npm run dev`)
2. Database created (`psql -U postgres -d ops_logistics`)
3. Port 5000 accessible
4. Files in correct location
5. Browser console for errors (F12)
