-- Seed sample data for testing
-- Note: This assumes you've already created your Supabase auth users

-- Insert sample customers (clients)
INSERT INTO customers (company_name, contact_person, email, phone, city, state) VALUES
  ('bürgermeister', 'Hans Mueller', 'hans@burgermeister.com', '+49-30-123456', 'Berlin', 'BE'),
  ('newsoul', 'Sarah Johnson', 'sarah@newsoul.com', '+1-415-789-0123', 'San Francisco', 'CA'),
  ('lap coffee', 'Marco Rossi', 'marco@lapcoffee.com', '+39-06-123456', 'Rome', 'IT'),
  ('beat81', 'Alex Chen', 'alex@beat81.com', '+886-2-123456', 'Taipei', 'TW');

-- Insert sample properties
INSERT INTO properties (address, city, state, zip, property_type, square_footage, price_ask, description, created_by) VALUES
  ('123 Market Street', 'San Francisco', 'CA', '94105', 'commercial_space', 5000, 15000.00, 'Prime commercial space in downtown', '00000000-0000-0000-0000-000000000001'),
  ('456 Berlin Plaza', 'Berlin', 'DE', '10115', 'office', 8000, 12000.00, 'Modern office building in Mitte district', '00000000-0000-0000-0000-000000000001'),
  ('789 Retail Avenue', 'Rome', 'IT', '00100', 'retail', 3500, 8000.00, 'Retail space in city center', '00000000-0000-0000-0000-000000000001'),
  ('321 Business Park', 'Taipei', 'TW', '10001', 'commercial_space', 10000, 18000.00, 'Large commercial complex', '00000000-0000-0000-0000-000000000001');

-- Insert sample contacts (property sources)
INSERT INTO contacts (first_name, last_name, email, phone, company, city, state, created_by) VALUES
  ('John', 'Smith', 'john.smith@realestate.com', '+1-415-555-0001', 'Smith Realty Group', 'San Francisco', 'CA', '00000000-0000-0000-0000-000000000001'),
  ('Giselle', 'Mueller', 'giselle@berlincommer.de', '+49-30-555-0001', 'Berlin Commercial Properties', 'Berlin', 'DE', '00000000-0000-0000-0000-000000000001'),
  ('Antonio', 'Ferrari', 'antonio.ferrari@romeprop.it', '+39-06-555-0001', 'Ferrari Properties', 'Rome', 'IT', '00000000-0000-0000-0000-000000000001'),
  ('Wei', 'Chang', 'wei.chang@taipeireal.com.tw', '+886-2-555-0001', 'Taipei Real Estate', 'Taipei', 'TW', '00000000-0000-0000-0000-000000000001');

-- Note: Insert sample deals would require valid UUIDs from the properties and contacts
-- The above seed data creates the basic structure for customers, properties, and contacts
-- You can add deals and deal_customers records through the application UI
