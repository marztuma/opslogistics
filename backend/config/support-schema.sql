-- Support Chat Tables

CREATE TABLE IF NOT EXISTS support_categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE,
  icon VARCHAR(50),
  description TEXT,
  order_index INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS support_articles (
  id SERIAL PRIMARY KEY,
  category_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE,
  content TEXT,
  keywords VARCHAR(500),
  helpful_count INT DEFAULT 0,
  unhelpful_count INT DEFAULT 0,
  views INT DEFAULT 0,
  featured BOOLEAN DEFAULT false,
  status VARCHAR(50) DEFAULT 'published', -- published, draft, archived
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES support_categories(id)
);

CREATE TABLE IF NOT EXISTS support_faqs (
  id SERIAL PRIMARY KEY,
  question VARCHAR(255) NOT NULL,
  answer TEXT NOT NULL,
  category VARCHAR(100),
  order_index INT DEFAULT 0,
  helpful_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS support_tickets (
  id SERIAL PRIMARY KEY,
  ticket_number VARCHAR(50) UNIQUE NOT NULL,
  customer_id INT,
  email VARCHAR(255),
  name VARCHAR(255),
  phone VARCHAR(20),
  subject VARCHAR(255) NOT NULL,
  category VARCHAR(100),
  priority VARCHAR(50) DEFAULT 'normal', -- low, normal, high, urgent
  status VARCHAR(50) DEFAULT 'open', -- open, assigned, in_progress, waiting, resolved, closed
  message TEXT NOT NULL,
  assigned_to INT,
  resolution TEXT,
  resolution_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customers(id),
  FOREIGN KEY (assigned_to) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS support_messages (
  id SERIAL PRIMARY KEY,
  ticket_id INT NOT NULL,
  user_id INT,
  sender_type VARCHAR(50), -- customer, support, system
  sender_name VARCHAR(255),
  message TEXT NOT NULL,
  attachment_url VARCHAR(500),
  is_internal BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (ticket_id) REFERENCES support_tickets(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS support_feedback (
  id SERIAL PRIMARY KEY,
  ticket_id INT NOT NULL,
  rating INT, -- 1-5 stars
  feedback TEXT,
  would_recommend BOOLEAN,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (ticket_id) REFERENCES support_tickets(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS canned_responses (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  category VARCHAR(100),
  created_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Insert default support categories
INSERT INTO support_categories (name, slug, icon, description, order_index) VALUES
('Shipping', 'shipping', '📦', 'Questions about shipping services', 1),
('Tracking', 'tracking', '📍', 'Track your shipments', 2),
('Pricing', 'pricing', '💰', 'Pricing and quotes', 3),
('Account', 'account', '👤', 'Account and profile management', 4),
('Returns', 'returns', '↩️', 'Return and refund policies', 5),
('Customs', 'customs', '📋', 'Customs and compliance', 6),
('Business', 'business', '💼', 'Business accounts and partnerships', 7),
('Technical', 'technical', '⚙️', 'Technical support', 8);

-- Insert default FAQs
INSERT INTO support_faqs (question, answer, category, order_index) VALUES
('How do I track my shipment?', 'You can track your shipment using your tracking number at https://opslogistic.com/track or enter it on the tracking page.', 'tracking', 1),
('What are your shipping rates?', 'Shipping rates vary based on weight, destination, and service type. Get a free quote at https://opslogistic.com/quote', 'pricing', 1),
('How long does shipping take?', 'Express shipping typically takes 1-3 business days, standard shipping 5-7 business days. See your quote for specific timelines.', 'shipping', 1),
('Can I change my delivery address?', 'You can change your delivery address if your shipment hasnt been picked up yet. Contact support immediately with your tracking number.', 'shipping', 2),
('What if my parcel arrives damaged?', 'Contact our support team with photos and your tracking number. We will investigate and provide a replacement or refund.', 'returns', 1),
('Do you ship internationally?', 'Yes, we ship to over 220 countries and territories. Check rates and availability in our quote tool.', 'shipping', 3),
('What payment methods do you accept?', 'We accept credit cards, bank transfers, and PayPal. All payments are secure and encrypted.', 'account', 1),
('How do I request a business account?', 'Visit https://opslogistic.com/request-business-account to apply. Youll need to provide your business details and expected monthly volume.', 'business', 1),
('Can you handle hazardous materials?', 'Yes, we handle restricted materials. Contact us for special handling requirements and compliance documentation.', 'customs', 1),
('What is your return policy?', 'We offer returns within 30 days of delivery for shipping services. Business accounts may have different terms.', 'returns', 2);

-- Create indexes
CREATE INDEX idx_support_articles_category ON support_articles(category_id);
CREATE INDEX idx_support_articles_slug ON support_articles(slug);
CREATE INDEX idx_support_tickets_customer ON support_tickets(customer_id);
CREATE INDEX idx_support_tickets_status ON support_tickets(status);
CREATE INDEX idx_support_tickets_number ON support_tickets(ticket_number);
CREATE INDEX idx_support_messages_ticket ON support_messages(ticket_id);
CREATE INDEX idx_support_feedback_ticket ON support_feedback(ticket_id);
