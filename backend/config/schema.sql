-- Users & Customers
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  role VARCHAR(50) DEFAULT 'customer', -- customer, admin, support
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS customers (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL,
  business_name VARCHAR(255),
  phone VARCHAR(20),
  industry VARCHAR(100),
  volume_tier VARCHAR(50) DEFAULT 'standard', -- startup, standard, premium, enterprise
  total_shipments INT DEFAULT 0,
  total_spending DECIMAL(12, 2) DEFAULT 0,
  account_manager INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS addresses (
  id SERIAL PRIMARY KEY,
  customer_id INT NOT NULL,
  street VARCHAR(255) NOT NULL,
  city VARCHAR(100) NOT NULL,
  state VARCHAR(100),
  postal_code VARCHAR(20),
  country VARCHAR(100) NOT NULL,
  address_type VARCHAR(50), -- billing, shipping, warehouse
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customers(id)
);

-- Shipments
CREATE TABLE IF NOT EXISTS shipments (
  id SERIAL PRIMARY KEY,
  tracking_number VARCHAR(100) UNIQUE NOT NULL,
  customer_id INT NOT NULL,
  origin_address_id INT,
  destination_address_id INT,
  shipment_type VARCHAR(50), -- document, parcel, freight, container
  service_type VARCHAR(50), -- express, standard, freight
  weight DECIMAL(10, 2),
  dimensions VARCHAR(100), -- length x width x height
  contents TEXT,
  status VARCHAR(50) DEFAULT 'pending', -- pending, booked, picked_up, in_transit, out_for_delivery, delivered, failed
  priority VARCHAR(50) DEFAULT 'standard',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  pickup_date TIMESTAMP,
  delivery_date TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customers(id),
  FOREIGN KEY (origin_address_id) REFERENCES addresses(id),
  FOREIGN KEY (destination_address_id) REFERENCES addresses(id)
);

CREATE TABLE IF NOT EXISTS shipment_items (
  id SERIAL PRIMARY KEY,
  shipment_id INT NOT NULL,
  description VARCHAR(255),
  quantity INT,
  weight DECIMAL(10, 2),
  value DECIMAL(10, 2),
  hs_code VARCHAR(50),
  FOREIGN KEY (shipment_id) REFERENCES shipments(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS shipment_tracking (
  id SERIAL PRIMARY KEY,
  shipment_id INT NOT NULL,
  status VARCHAR(50),
  location VARCHAR(255),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(10, 8),
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  notes TEXT,
  FOREIGN KEY (shipment_id) REFERENCES shipments(id) ON DELETE CASCADE
);

-- Orders
CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  order_number VARCHAR(100) UNIQUE NOT NULL,
  customer_id INT NOT NULL,
  shipment_id INT,
  total_amount DECIMAL(12, 2),
  tax_amount DECIMAL(10, 2),
  discount_amount DECIMAL(10, 2),
  payment_status VARCHAR(50) DEFAULT 'pending', -- pending, paid, failed, refunded
  order_status VARCHAR(50) DEFAULT 'processing',
  payment_method VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  paid_at TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customers(id),
  FOREIGN KEY (shipment_id) REFERENCES shipments(id)
);

-- Quotes
CREATE TABLE IF NOT EXISTS quotes (
  id SERIAL PRIMARY KEY,
  quote_number VARCHAR(100) UNIQUE NOT NULL,
  customer_id INT,
  origin_country VARCHAR(100),
  destination_country VARCHAR(100),
  weight DECIMAL(10, 2),
  dimensions VARCHAR(100),
  service_type VARCHAR(50),
  shipment_type VARCHAR(50),
  base_price DECIMAL(10, 2),
  tariff_cost DECIMAL(10, 2),
  tax DECIMAL(10, 2),
  total_price DECIMAL(12, 2),
  valid_until TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customers(id)
);

-- Pricing & Tariffs
CREATE TABLE IF NOT EXISTS pricing_rules (
  id SERIAL PRIMARY KEY,
  origin_country VARCHAR(100),
  destination_country VARCHAR(100),
  service_type VARCHAR(50),
  weight_min DECIMAL(10, 2),
  weight_max DECIMAL(10, 2),
  price_per_kg DECIMAL(10, 2),
  price_per_shipment DECIMAL(10, 2),
  surcharge DECIMAL(10, 2),
  effective_from TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  effective_to TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS tariff_rates (
  id SERIAL PRIMARY KEY,
  country_code VARCHAR(5),
  hs_code VARCHAR(50),
  duty_percentage DECIMAL(5, 2),
  tax_percentage DECIMAL(5, 2),
  restrictions TEXT,
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS volume_discounts (
  id SERIAL PRIMARY KEY,
  customer_id INT,
  shipment_count_min INT,
  shipment_count_max INT,
  discount_percentage DECIMAL(5, 2),
  effective_from TIMESTAMP,
  effective_to TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customers(id)
);

-- Inventory
CREATE TABLE IF NOT EXISTS containers (
  id SERIAL PRIMARY KEY,
  container_number VARCHAR(100) UNIQUE NOT NULL,
  container_type VARCHAR(50), -- 20ft, 40ft, pallet
  capacity_weight DECIMAL(10, 2),
  current_weight DECIMAL(10, 2) DEFAULT 0,
  location VARCHAR(255),
  status VARCHAR(50) DEFAULT 'available', -- available, in_transit, full, maintenance
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS warehouse_zones (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  type VARCHAR(50), -- goods_in, sort, hold, ship, pick, pack, dispatch
  capacity INT,
  current_load INT DEFAULT 0,
  manager_id INT
);

CREATE TABLE IF NOT EXISTS cargo_storage (
  id SERIAL PRIMARY KEY,
  shipment_id INT,
  zone_id INT,
  container_id INT,
  storage_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expected_departure TIMESTAMP,
  status VARCHAR(50) DEFAULT 'stored',
  FOREIGN KEY (shipment_id) REFERENCES shipments(id),
  FOREIGN KEY (zone_id) REFERENCES warehouse_zones(id),
  FOREIGN KEY (container_id) REFERENCES containers(id)
);

-- Cold Chain
CREATE TABLE IF NOT EXISTS cold_chain_shipments (
  id SERIAL PRIMARY KEY,
  shipment_id INT,
  temperature_min DECIMAL(5, 2),
  temperature_max DECIMAL(5, 2),
  equipment_type VARCHAR(50), -- active, passive
  monitoring_enabled BOOLEAN DEFAULT true,
  FOREIGN KEY (shipment_id) REFERENCES shipments(id)
);

CREATE TABLE IF NOT EXISTS temperature_readings (
  id SERIAL PRIMARY KEY,
  cold_chain_id INT,
  temperature DECIMAL(5, 2),
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(50) DEFAULT 'normal', -- normal, warning, critical
  FOREIGN KEY (cold_chain_id) REFERENCES cold_chain_shipments(id)
);

-- Fleet
CREATE TABLE IF NOT EXISTS vehicles (
  id SERIAL PRIMARY KEY,
  plate_number VARCHAR(50) UNIQUE NOT NULL,
  vehicle_type VARCHAR(50), -- truck, van, bike
  capacity_weight DECIMAL(10, 2),
  capacity_volume DECIMAL(10, 2),
  driver_id INT,
  status VARCHAR(50) DEFAULT 'available',
  current_location VARCHAR(255),
  gps_latitude DECIMAL(10, 8),
  gps_longitude DECIMAL(10, 8),
  last_location_update TIMESTAMP
);

CREATE TABLE IF NOT EXISTS delivery_routes (
  id SERIAL PRIMARY KEY,
  vehicle_id INT,
  origin VARCHAR(255),
  destination VARCHAR(255),
  distance_km DECIMAL(8, 2),
  estimated_time_minutes INT,
  status VARCHAR(50) DEFAULT 'planned', -- planned, in_progress, completed
  created_at TIMESTAMP,
  started_at TIMESTAMP,
  completed_at TIMESTAMP,
  FOREIGN KEY (vehicle_id) REFERENCES vehicles(id)
);

CREATE TABLE IF NOT EXISTS delivery_stops (
  id SERIAL PRIMARY KEY,
  route_id INT,
  shipment_id INT,
  stop_sequence INT,
  address VARCHAR(500),
  status VARCHAR(50) DEFAULT 'pending', -- pending, in_transit, delivered, failed
  attempted_at TIMESTAMP,
  delivered_at TIMESTAMP,
  proof_of_delivery TEXT,
  FOREIGN KEY (route_id) REFERENCES delivery_routes(id),
  FOREIGN KEY (shipment_id) REFERENCES shipments(id)
);

-- Compliance & Customs
CREATE TABLE IF NOT EXISTS customs_documents (
  id SERIAL PRIMARY KEY,
  shipment_id INT,
  document_type VARCHAR(50), -- commercial_invoice, packing_list, certificate_of_origin
  document_number VARCHAR(100),
  status VARCHAR(50) DEFAULT 'pending',
  hs_codes TEXT,
  total_value DECIMAL(12, 2),
  generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  submitted_at TIMESTAMP,
  approved_at TIMESTAMP,
  FOREIGN KEY (shipment_id) REFERENCES shipments(id)
);

CREATE TABLE IF NOT EXISTS compliance_checks (
  id SERIAL PRIMARY KEY,
  shipment_id INT,
  destination_country VARCHAR(100),
  restrictions TEXT,
  requires_inspection BOOLEAN DEFAULT false,
  requires_license BOOLEAN DEFAULT false,
  status VARCHAR(50) DEFAULT 'pending',
  checked_at TIMESTAMP,
  FOREIGN KEY (shipment_id) REFERENCES shipments(id)
);

-- Finance & Billing
CREATE TABLE IF NOT EXISTS invoices (
  id SERIAL PRIMARY KEY,
  invoice_number VARCHAR(100) UNIQUE NOT NULL,
  customer_id INT,
  total_amount DECIMAL(12, 2),
  tax_amount DECIMAL(10, 2),
  due_date TIMESTAMP,
  issue_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  paid_date TIMESTAMP,
  status VARCHAR(50) DEFAULT 'issued', -- issued, sent, paid, overdue, cancelled
  FOREIGN KEY (customer_id) REFERENCES customers(id)
);

CREATE TABLE IF NOT EXISTS invoice_items (
  id SERIAL PRIMARY KEY,
  invoice_id INT,
  shipment_id INT,
  order_id INT,
  description VARCHAR(255),
  quantity INT,
  unit_price DECIMAL(10, 2),
  total_price DECIMAL(12, 2),
  FOREIGN KEY (invoice_id) REFERENCES invoices(id),
  FOREIGN KEY (shipment_id) REFERENCES shipments(id),
  FOREIGN KEY (order_id) REFERENCES orders(id)
);

CREATE TABLE IF NOT EXISTS payments (
  id SERIAL PRIMARY KEY,
  invoice_id INT,
  amount DECIMAL(12, 2),
  payment_method VARCHAR(50), -- card, bank_transfer, paypal
  transaction_id VARCHAR(255),
  status VARCHAR(50) DEFAULT 'pending',
  paid_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (invoice_id) REFERENCES invoices(id)
);

-- Notifications
CREATE TABLE IF NOT EXISTS notifications (
  id SERIAL PRIMARY KEY,
  user_id INT,
  shipment_id INT,
  type VARCHAR(50), -- email, sms, push
  subject VARCHAR(255),
  message TEXT,
  status VARCHAR(50) DEFAULT 'pending',
  sent_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (shipment_id) REFERENCES shipments(id)
);

-- Indexes for performance
CREATE INDEX idx_shipments_customer ON shipments(customer_id);
CREATE INDEX idx_shipments_status ON shipments(status);
CREATE INDEX idx_shipments_tracking_number ON shipments(tracking_number);
CREATE INDEX idx_tracking_shipment ON shipment_tracking(shipment_id);
CREATE INDEX idx_orders_customer ON orders(customer_id);
CREATE INDEX idx_orders_status ON orders(payment_status);
CREATE INDEX idx_customers_user ON customers(user_id);
CREATE INDEX idx_delivery_stops_route ON delivery_stops(route_id);
CREATE INDEX idx_temperature_readings_cold_chain ON temperature_readings(cold_chain_id);
