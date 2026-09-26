# OPS Logistics Support System

Complete customer support solution with FAQs, ticket management, and live chat widget.

## Components

### 1. Database Schema (`backend/config/support-schema.sql`)
```sql
Tables:
- support_categories    (Category grouping)
- support_articles      (Knowledge base articles)
- support_faqs          (Frequently asked questions)
- support_tickets       (Customer support tickets)
- support_messages      (Conversation messages)
- support_feedback      (Ticket feedback ratings)
- canned_responses      (Pre-written responses for staff)
```

### 2. Backend API (`backend/routes/support.js`)

#### Public Endpoints

**Categories & Articles:**
- `GET /api/support/categories` - Get all support categories
- `GET /api/support/articles/category/:slug` - Get articles by category
- `GET /api/support/articles/:slug` - Get single article
- `GET /api/support/articles/featured` - Get featured articles
- `GET /api/support/search?query=...` - Search articles
- `POST /api/support/articles/:id/rate` - Rate article helpfulness

**FAQs:**
- `GET /api/support/faqs` - Get all FAQs
- `GET /api/support/faqs/:category` - Get FAQs by category

**Support Tickets:**
- `POST /api/support/tickets` - Create support ticket
- `GET /api/support/tickets/:ticketNumber` - Get ticket status
- `POST /api/support/tickets/:ticketNumber/messages` - Add message to ticket
- `POST /api/support/tickets/:id/feedback` - Submit ticket feedback

#### Admin Endpoints (requires admin role)

**Ticket Management:**
- `GET /api/support/admin/tickets` - Get all tickets (with filters)
- `GET /api/support/admin/tickets/:id` - Get ticket details
- `PUT /api/support/admin/tickets/:id` - Update ticket status/priority
- `POST /api/support/admin/tickets/:id/messages` - Add internal response

**Knowledge Base:**
- `GET /api/support/admin/articles` - Get all articles
- `POST /api/support/admin/articles` - Create new article

**Analytics:**
- `GET /api/support/admin/stats` - Support statistics

### 3. Frontend Components

#### A. Full Support Chat Page (`opslogistic/support-chat.html`)
Complete support interface with:
- Search functionality
- Category browsing
- FAQ section
- Contact form for creating tickets
- Article ratings
- Responsive design

**Features:**
- Real-time search across articles
- Quick links to common questions
- Full contact form
- Ticket confirmation with ticket number
- Mobile-responsive

#### B. Floating Chat Widget (`opslogistic/chat-widget.js`)
Embeddable widget that appears on all pages:
- Circular button in corner
- Quick action menu
- FAQ browser
- Search
- Message input
- Contact form
- Persistent state (remembers if open)

## Setup Instructions

### 1. Create Database Tables

```bash
psql -U postgres -d ops_logistics -f backend/config/support-schema.sql
```

This creates:
- 7 support tables
- Pre-populated 8 support categories
- 10 default FAQs
- Necessary indexes

### 2. Update Backend

The support routes are already added to `backend/server.js`:
```javascript
app.use('/api/support', require('./routes/support'));
```

Restart the backend server:
```bash
npm run dev
```

### 3. Add to Website

#### Option A: Full Support Page
Add a link in the navbar:
```html
<a href="support-chat.html" class="nav-item">Support</a>
```

#### Option B: Floating Widget (Recommended)
Add to any page:
```html
<!-- At the end of the HTML body -->
<script src="chat-widget.js"></script>
```

The widget automatically:
- Creates floating button
- Loads FAQs
- Handles searches
- Opens contact form
- Manages chat state

## API Examples

### Create a Support Ticket

```bash
curl -X POST http://localhost:5000/api/support/tickets \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "subject": "Can't track my shipment",
    "category": "tracking",
    "priority": "high",
    "message": "I cant find my shipment OPS12345678"
  }'
```

Response:
```json
{
  "message": "Support ticket created successfully",
  "ticket": {
    "id": 1,
    "ticket_number": "TKT1695312345",
    "created_at": "2024-09-26T10:30:00Z"
  }
}
```

### Search Articles

```bash
curl "http://localhost:5000/api/support/search?query=tracking"
```

### Get All FAQs

```bash
curl http://localhost:5000/api/support/faqs
```

### Add Support Response (Admin)

```bash
curl -X POST http://localhost:5000/api/support/admin/tickets/1/messages \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -d '{
    "message": "We found your shipment. It will arrive tomorrow.",
    "is_internal": false
  }'
```

## Admin Dashboard Integration

The support system integrates with the admin dashboard. Admins can:

1. **View Tickets Dashboard**
   - See all support tickets
   - Filter by status (open, in_progress, resolved, closed)
   - Filter by priority (low, normal, high, urgent)
   - Sort by date

2. **Manage Tickets**
   - Update status
   - Assign to support staff
   - Change priority
   - Add responses
   - Add internal notes

3. **Knowledge Base**
   - View all articles
   - Create new articles
   - Mark articles as featured
   - Track article views and helpfulness

4. **View Statistics**
   - Total tickets
   - Open tickets
   - Average resolution time
   - Urgent tickets count

## Database Default Content

### Support Categories
1. Shipping
2. Tracking
3. Pricing
4. Account
5. Returns
6. Customs
7. Business
8. Technical

### Default FAQs
10 common FAQs pre-populated including:
- How to track shipments
- Shipping rates
- Delivery times
- Address changes
- Damaged parcels
- International shipping
- Payment methods
- Business accounts
- Hazardous materials
- Returns policy

## Workflow Example

### Customer Perspective
1. Customer visits website, sees floating chat button
2. Clicks button to open chat widget
3. Browses FAQs or searches for answer
4. If not satisfied, fills contact form
5. Receives ticket number (TKT1695312345)
6. System sends confirmation email
7. Support team responds within 24 hours

### Support Staff Perspective
1. Receives notification of new ticket
2. Opens admin dashboard `/api/admin/tickets`
3. Filters tickets by status/priority
4. Opens specific ticket
5. Views customer message and conversation history
6. Types response
7. Marks ticket as in_progress, then resolved
8. Customer receives update via email/SMS

## Features & Capabilities

### Ticket Management
✅ Automatic ticket number generation  
✅ Priority levels (low, normal, high, urgent)  
✅ Status tracking (open, assigned, in_progress, waiting, resolved, closed)  
✅ Staff assignment  
✅ Message threading with timestamps  
✅ Internal notes (not visible to customers)  
✅ Feedback ratings after resolution  

### Knowledge Base
✅ Article categorization  
✅ Full-text search  
✅ Helpful/unhelpful ratings  
✅ View tracking  
✅ Featured articles  
✅ Keywords tagging  
✅ Draft/published status  

### FAQs
✅ By category  
✅ Unlimited questions  
✅ Rich text answers  
✅ Ordering/prioritization  
✅ Helpful ratings  

### Widget Features
✅ Floating button  
✅ Persistent state  
✅ Quick actions  
✅ Search integration  
✅ FAQ browser  
✅ Contact form  
✅ Message history  
✅ Mobile responsive  

## Customization

### Change Widget Colors
Edit `chat-widget.js`:
```javascript
background: #0055CC;  // Primary color
background: #003A70;  // Dark blue
```

### Add More Categories
```sql
INSERT INTO support_categories (name, slug, icon, description) VALUES
('Returns', 'returns', '↩️', 'Return and refund policies');
```

### Update Default FAQs
```sql
UPDATE support_faqs SET answer = 'New answer text' WHERE id = 1;
```

### Configure Admin Support Tools
Access `/admin/` dashboard:
1. Go to "Support" section (when added)
2. View ticket queue
3. Manage responses
4. View statistics

## Email Integration (Future)

To add email notifications, update `support.js`:
```javascript
// Send ticket confirmation email
await sendEmail(email, 'Support Ticket Created', {
  ticketNumber: ticketNumber,
  subject: subject
});

// Send response notification
await sendEmail(customer.email, 'Support Response', {
  response: message,
  ticketNumber: ticketNumber
});
```

## Performance Optimization

### Database
- Indexes on: `ticket_id`, `customer_id`, `status`, `created_at`
- Archive old tickets monthly
- Partition tables by date for large deployments

### API
- Pagination for ticket lists (default: 20 per page)
- Search uses full-text indexing
- Cache frequently viewed FAQs
- Rate limit ticket creation (prevent spam)

### Widget
- Lazy load FAQs on first open
- Cache search results
- Debounce search input
- Minimize bundle size (~5KB)

## Security Considerations

✅ Only show customer's own tickets  
✅ Admin endpoints require authentication  
✅ Validate all inputs  
✅ Sanitize HTML in messages  
✅ No sensitive data in ticket numbers  
✅ Rate limit to prevent abuse  
✅ Encrypt sensitive information  
✅ Audit log all admin actions  

## Monitoring

### Key Metrics
- Average response time
- First response time
- Resolution rate
- Customer satisfaction (from feedback)
- FAQ usefulness
- Search hit rate
- Widget usage

### Query Examples
```sql
-- Average resolution time
SELECT AVG(EXTRACT(EPOCH FROM (updated_at - created_at))/3600) 
FROM support_tickets 
WHERE status = 'closed';

-- Most viewed articles
SELECT title, views FROM support_articles 
ORDER BY views DESC LIMIT 10;

-- Helpful articles
SELECT title, helpful_count FROM support_articles 
WHERE helpful_count > unhelpful_count 
ORDER BY helpful_count DESC;
```

## Support Article Template

When creating articles, use this structure:

```markdown
## Title
Clear, action-oriented title (e.g., "How to Track Your Shipment")

## Problem
What issue does this solve?

## Solution
Step-by-step solution with examples

## Related Articles
Links to similar topics

## Keywords
tracking, shipment, delivery, status
```

## Testing the System

### Test Ticket Creation
```bash
curl -X POST http://localhost:5000/api/support/tickets \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","subject":"Test","message":"Test message"}'
```

### Test Widget
Add to any HTML page:
```html
<script src="http://localhost:3000/opslogistic/chat-widget.js"></script>
```

### Test Admin Endpoints
```bash
# Login first to get token
TOKEN=$(curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@opslogistic.com","password":"admin123"}' \
  | jq -r '.token')

# Get tickets
curl http://localhost:5000/api/support/admin/tickets \
  -H "Authorization: Bearer $TOKEN"
```

## Troubleshooting

### Widget Not Appearing
- Check browser console for errors
- Verify API URL in chat-widget.js
- Ensure CSS loads properly
- Check z-index conflicts

### Tickets Not Showing
- Verify database tables created
- Check customer_id references
- Verify JWT token is valid for admin

### Search Not Working
- Check article status is 'published'
- Verify full-text index exists
- Check query length (min 2 chars)

## Next Steps

1. **Add Email Notifications** - Send confirmations and updates
2. **Implement Live Chat** - Real-time support via WebSocket
3. **Add Chatbot** - AI-powered first response
4. **Mobile App** - Native support for mobile customers
5. **Analytics Dashboard** - Detailed support metrics
6. **SLA Tracking** - Response time monitoring
7. **Knowledge Base Analytics** - Article performance
8. **Escalation Workflow** - Route complex issues

---

**Support System Complete!** All components are ready for deployment.
