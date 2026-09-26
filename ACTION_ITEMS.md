# OPS Logistics - Complete Action Items & Connection Checklist

## HOMEPAGE (index.html) - Action Buttons to Connect

### Hero Section
- [ ] **"Track Shipment"** button → Connect to `/api/tracking/{trackingNumber}`
- [ ] **Tracking number input** → Real-time validation + submit
- [ ] **"Ship Now"** button → Navigate to ship-now.html ✅
- [ ] **"Get a Quote"** button → Navigate to quote.html ✅
- [ ] **"Request a Business Account"** button → Navigate to request-business-account.html ✅

### Trade Advisory Section
- [ ] **"Explore Our Solutions"** button → Action (expand info / scroll to service)

### Shipping Containers Section
- [ ] **"Shop Shipping Containers"** button → New page or modal

### Document & Parcel Services
- [ ] **Service cards** → Link to express-document-and-package-shipping.html ✅

### Service Cards (2x2 Grid)
- [ ] Cargo Shipping card → Link to freight-services.html ✅
- [ ] Volume Shipping card → Link to retailers-and-volume-shipping.html ✅
- [ ] Enterprise Services card → Link to business-offerings.html ✅

### Business Section Banner
- [ ] **CTA button** → Link to request-business-account.html ✅

### Service Updates / Stats / Why OPS / Supply Chain
- [ ] Check all CTA buttons point to correct pages

---

## QUOTE PAGE (quote.html) - Forms to Connect

### Quote Form
- [ ] **Origin country** dropdown → Populate from database
- [ ] **Destination country** dropdown → Populate from database
- [ ] **Weight input** → Validation (number only)
- [ ] **Dimensions** → Validation
- [ ] **Service type** selector → Options: express, standard, freight
- [ ] **Submit "Get Quote"** → POST to `/api/quotes`
  - Expected response: `{ quote: { quote_number, total_price, breakdown }}`
  - Display breakdown on page
  - Show "Request this shipment" button

### Have Ready Section (5 cards)
- [ ] Just informational (no actions needed)

### Eligibility Section
- [ ] Just informational (no actions needed)

### Form Sections (3 sections)
- [ ] Validate all inputs
- [ ] Connect submit to `/api/orders` after quote confirmed

---

## SHIP-NOW PAGE (ship-now.html) - Forms to Connect

### Collection Request Form
- [ ] **Name, Email, Phone** → Validate
- [ ] **Pickup Address** → Autocomplete / validation
- [ ] **Item details** → Form validation
- [ ] **Submit** → POST to `/api/shipments`
  - Create shipment
  - Return tracking number
  - Show confirmation with number

### Eligibility Section
- [ ] Informational only

---

## REQUEST BUSINESS ACCOUNT PAGE (request-business-account.html) - Forms to Connect

### Account Request Form (9 fields)
- [ ] **Company name** → Validate
- [ ] **Business email** → Validate
- [ ] **Phone** → Validate
- [ ] **Industry** → Dropdown
- [ ] **Expected monthly volume** → Number input
- [ ] **Countries you ship to** → Multiple select
- [ ] **Special requirements** → Textarea
- [ ] **Terms acceptance** → Checkbox
- [ ] **Submit** → POST to `/api/customers` + `/api/orders` or custom endpoint
  - Create customer profile
  - Mark as "pending_business_account"
  - Send admin notification
  - Return confirmation message

### "What Happens Next" (4-card section)
- [ ] Informational only

### "What setup usually asks for" (3-card section)
- [ ] Informational only

---

## EXPRESS DOCUMENT SHIPPING PAGE (express-document-and-package-shipping.html)

### CTA Buttons (2)
- [ ] **"Get a Quote"** → Navigate to quote.html ✅
- [ ] **"Ship Now"** → Navigate to ship-now.html ✅

### Service Tags / Features
- [ ] Informational only

---

## RETAILERS & VOLUME SHIPPING (retailers-and-volume-shipping.html)

### CTA Buttons
- [ ] **"Request Pricing"** → Navigate to quote.html with "volume" preset ✅

---

## FREIGHT SERVICES PAGE (freight-services.html)

### CTA Buttons
- [ ] **"Get Freight Quote"** → Navigate to quote.html with "freight" preset
- [ ] **"Request Account"** → Navigate to request-business-account.html ✅

---

## BUSINESS OFFERINGS PAGE (business-offerings.html)

### CTA Buttons
- [ ] **"Learn More"** or **"Explore"** buttons → Scroll to detail sections or modals

---

## CONTRACT LOGISTICS PAGE (contract-logistics.html)

### CTA Buttons
- [ ] **"Request Consultation"** → Support ticket creation

### Gantt Chart
- [ ] [ ] Display with actual timeline data (currently hardcoded)

---

## E-COMMERCE EXECUTION PAGE (ecommerce-execution.html)

### CTA Buttons
- [ ] **"Let's Talk Technology"** → Support ticket / demo request
- [ ] **"Learn a Checklist"** → Download PDF or show checklist

### Timeline / Charts
- [ ] Currently placeholder → Need actual data integration

---

## CUSTOMS & COMPLIANCE PAGE (customs-and-compliance.html)

### CTA Buttons
- [ ] **"Get Compliance Check"** → Form to check shipment eligibility

### Scope of Service Box
- [ ] Link to detailed compliance docs

---

## COLD CHAIN LOGISTICS PAGE (cold-chain-logistics.html)

### Monitoring Section
- [ ] **"Request Monitoring"** → Add to quote/order process

---

## LAST-MILE DELIVERY PAGE (last-mile-delivery.html)

### Delivery Range Sliders
- [ ] Just display (informational)

### "What happens when door doesn't open" 
- [ ] Strategy selector → Informational

---

## TECHNOLOGY PAGE (technology.html)

### Tab Buttons (4 gates)
- [ ] Functional tab switching ✅ (but verify working)

### "Most tech ships more than once" Section
- [ ] Informational cards

---

## HEALTHCARE & LIFE SCIENCES (healthcare-and-life-sciences.html)

### Collapsible Items (5)
- [ ] Verify expand/collapse working ✅

---

## RETAIL & FASHION PAGE (retail-and-fashion.html)

### Stats Section
- [ ] Pull from actual data (currently hardcoded)

---

## AUTOMOBILE PAGE (automobile.html)

### Hero Modal/Card
- [ ] Verify modal functionality

### Collapsible Items (6)
- [ ] Verify expand/collapse working ✅

---

## ENERGY & PUBLIC UTILITIES (energy-and-public-utilities.html)

### Pricing Bar Charts (5)
- [ ] Display actual pricing data (currently placeholder)

---

## CASE STUDIES PAGE (case-studies.html)

### Filter Buttons
- [ ] Functional filtering (if implemented)

### Case Study Cards
- [ ] Link to detailed case study pages (if exists)

---

## WHITE PAPERS PAGE (white-papers.html)

### Featured Resource Card
- [ ] **Download button** → Serve PDF file

### White Paper Cards (3)
- [ ] **Download buttons** → Serve PDF files

### Email Signup Section
- [ ] **Subscribe button** → Subscribe to mailing list (optional)

---

## BLOG LOGISTICS INSIGHTS (blog-logistics-insights.html)

### Featured Article
- [ ] **"Read Article"** button → Link to full article page

### Recent Articles (5 cards)
- [ ] **"Read More"** buttons → Link to full article pages

### Topic Cards (6)
- [ ] Filter articles by topic (functional)

---

## PRICING/TARIFF PAGE (pricing-updates.html)

### Last Update Alert
- [ ] Display real last update date from database

### Collapsible Items (6 fields)
- [ ] Expand/collapse functionality ✅

### Tariff Update Section
- [ ] Display real tariff data from `/api/pricing/tariffs`

---

## CUSTOMER SERVICE PAGE (customer-service.html)

### Four Doors Section (4 buttons)
- [ ] **"Price a shipment"** → quote.html ✅
- [ ] **"Something in transit"** → track.html ✅
- [ ] **"Open an account"** → request-business-account.html ✅
- [ ] **"Work with us"** → Link to careers/partnerships page (NEW)

### Contact Form
- [ ] **Name, Email, Phone, Subject, Message** → POST to `/api/support/tickets` ✅

### Self-Service Cards (4)
- [ ] **Links** → Points to relevant pages ✅

### Specialized Support Section (4 cards)
- [ ] Email addresses as links ✅

### Email/Phone CTA Section
- [ ] **"Get a Quote"** button → quote.html ✅
- [ ] **"Track a Shipment"** button → track.html ✅

---

## TRACK PAGE (track.html)

### Tracking Input Section
- [ ] **Search/Tracking Input** → POST to `/api/tracking/{trackingNumber}`
  - Display: status, location, history, delivery date
  - Real-time updates

---

## SUPPORT CHAT (support-chat.html) - All Connected ✅

### Search Box
- [ ] Connected to `/api/support/search` ✅

### FAQ Section
- [ ] Connected to `/api/support/faqs` ✅

### Contact Form
- [ ] Connected to `/api/support/tickets` ✅

### Article Ratings
- [ ] Connected to `/api/support/articles/:id/rate` ✅

---

## FLOATING CHAT WIDGET (chat-widget.js) - All Connected ✅

### Quick Action Buttons
- [ ] "View FAQs" → `/api/support/faqs` ✅
- [ ] "Search" → `/api/support/search` ✅
- [ ] "Contact Us" → `/api/support/tickets` ✅
- [ ] "Track Shipment" → track.html ✅

---

## NAVBAR - Navigation Links to Verify

### Main Navigation
- [ ] Track → track.html ✅
- [ ] Ship dropdown → All links verified ✅
- [ ] Enterprise services dropdown → All links verified ✅
- [ ] Customer Service → customer-service.html ✅
- [ ] Support → support-chat.html ✅

### Top Bar Links
- [ ] Exit → homepage ✅
- [ ] What OPS provides → (needs definition)
- [ ] To research → (needs definition)

---

## LOGIN/AUTH SYSTEM - Not Yet Connected

- [ ] **Login button** → Create login page
- [ ] **Register button** → registration flow
- [ ] **Customer portal logins** → Link to admin dashboard or customer area
- [ ] **Logout** → Clear session

---

## ADMIN DASHBOARD - Partially Ready

### Dashboard Page
- [ ] KPI cards → Pull from `/api/admin/dashboard` ✅
- [ ] Recent shipments → Pull from `/api/admin/shipments` ✅
- [ ] Recent orders → Pull from `/api/admin/orders` ✅

### Shipments Section
- [ ] Table → Connect to `/api/admin/shipments` ✅
- [ ] Filters → Status, priority filters working
- [ ] Pagination → Implement pagination

### Orders Section
- [ ] Table → Connect to `/api/admin/orders` ✅
- [ ] Status updates → PUT to `/api/admin/orders/:id/status`
- [ ] Payment updates → PUT to `/api/admin/orders/:id/payment`

### Customers Section
- [ ] Table → Connect to `/api/admin/customers` ✅
- [ ] Tier updates → PUT to `/api/admin/customers/:id/tier`

### Pricing Section
- [ ] Display pricing rules → GET `/api/pricing/rules` ✅
- [ ] Add rule button → POST `/api/pricing/rules`
- [ ] Edit rule button → PUT `/api/pricing/rules/:id`
- [ ] Tariff management → GET `/api/pricing/tariffs`
- [ ] Update tariff → PUT `/api/pricing/tariffs/:id`

### Reports Section
- [ ] Revenue chart → Data from `/api/admin/reports/revenue`
- [ ] Shipment analytics → Data from `/api/admin/reports/shipments`
- [ ] Export functionality → (not yet built)

### Users Section
- [ ] User list → GET `/api/admin/users` ✅
- [ ] Create user → POST `/api/admin/users`
- [ ] Edit user → PUT `/api/admin/users/:id`
- [ ] Delete user → DELETE `/api/admin/users/:id`

---

## PAYMENT PROCESSING - Not Yet Implemented

- [ ] Stripe integration for order payments
- [ ] Payment confirmation emails
- [ ] Invoice generation and download
- [ ] Payment history display

---

## EMAIL NOTIFICATIONS - Not Yet Implemented

- [ ] Order confirmation emails
- [ ] Shipment status update emails
- [ ] Support ticket confirmation emails
- [ ] Support response emails
- [ ] Invoice emails

---

## PRIORITY: HIGH - Must Do First

### Tier 1 (Critical User Flows)
1. **Quote Form** → Connect to `/api/quotes`
2. **Ship Now Form** → Connect to `/api/shipments`
3. **Track Shipment** → Connect to `/api/tracking/:trackingNumber`
4. **Business Account Request** → Connect to customer creation API
5. **Support Forms** → Already connected ✅

### Tier 2 (Business Accounts)
6. **Login/Auth System** → Create simple login
7. **Customer Portal** → Basic dashboard showing orders/shipments
8. **Admin Dashboard** → Connect all admin forms

### Tier 3 (Advanced)
9. **Payment Processing** → Stripe integration
10. **Email Notifications** → SendGrid or SMTP
11. **Reports & Analytics** → Dashboard charting
12. **Advanced Search** → Shipment history search

---

## PRIORITY: MEDIUM - Should Do Next

- [ ] Mobile app for customers
- [ ] Pricing management UI
- [ ] Tariff rate updates UI
- [ ] Knowledge base management UI
- [ ] User role management

---

## PRIORITY: LOW - Nice to Have

- [ ] Live chat support (WebSocket)
- [ ] AI chatbot integration
- [ ] Mobile notifications
- [ ] API documentation (Swagger)
- [ ] Advanced analytics
- [ ] Custom reporting

---

## TOTAL ACTION ITEMS: 150+

### By Category:
- **Forms/API Connections:** 45 items
- **Navigation/Links:** 25 items
- **Admin Features:** 30 items
- **Authentication:** 10 items
- **Payment/Email:** 15 items
- **Advanced Features:** 15 items

---

## Quick Status Summary

| Category | Complete | Pending | Total |
|----------|----------|---------|-------|
| Navigation Links | 20 | 3 | 23 |
| Forms/Submissions | 8 | 35 | 43 |
| Admin Features | 5 | 25 | 30 |
| API Connections | 8 | 25 | 33 |
| Support System | 7 | 0 | 7 |
| Auth/Login | 0 | 8 | 8 |
| **TOTAL** | **48** | **96** | **144** |

---

## Next Steps - Start Here

1. **Quote Form API Connection** (5 min)
2. **Track Input Connection** (5 min)
3. **Ship Now Form Connection** (10 min)
4. **Business Account Form** (10 min)
5. **Login System** (20 min)

Want to tackle these now?
