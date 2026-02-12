-- Enable Row Level Security on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE deal_customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- ============ USERS TABLE POLICIES ============
-- Users can only see themselves and admins can see all
CREATE POLICY "Users can view their own profile"
  ON users FOR SELECT
  USING (auth.uid() = id OR (SELECT role FROM users WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Users can update their own profile"
  ON users FOR UPDATE
  USING (auth.uid() = id);

-- Admin can insert new users
CREATE POLICY "Only admin can create users"
  ON users FOR INSERT
  WITH CHECK ((SELECT role FROM users WHERE id = auth.uid()) = 'admin');

-- Admin can delete users
CREATE POLICY "Only admin can delete users"
  ON users FOR DELETE
  USING ((SELECT role FROM users WHERE id = auth.uid()) = 'admin');

-- ============ CONTACTS TABLE POLICIES ============
-- Viewers can view all contacts, sales_reps can view all and create/edit own, admins can do everything
CREATE POLICY "Users can view contacts based on role"
  ON contacts FOR SELECT
  USING (
    (SELECT role FROM users WHERE id = auth.uid()) IN ('admin', 'sales_rep', 'viewer')
  );

CREATE POLICY "Sales reps can create contacts"
  ON contacts FOR INSERT
  WITH CHECK (
    (SELECT role FROM users WHERE id = auth.uid()) IN ('admin', 'sales_rep')
  );

CREATE POLICY "Users can update contacts they created or admins"
  ON contacts FOR UPDATE
  USING (
    created_by = auth.uid() OR (SELECT role FROM users WHERE id = auth.uid()) = 'admin'
  );

CREATE POLICY "Users can delete contacts they created or admins"
  ON contacts FOR DELETE
  USING (
    created_by = auth.uid() OR (SELECT role FROM users WHERE id = auth.uid()) = 'admin'
  );

-- ============ PROPERTIES TABLE POLICIES ============
CREATE POLICY "Users can view properties based on role"
  ON properties FOR SELECT
  USING (
    (SELECT role FROM users WHERE id = auth.uid()) IN ('admin', 'sales_rep', 'viewer')
  );

CREATE POLICY "Sales reps can create properties"
  ON properties FOR INSERT
  WITH CHECK (
    (SELECT role FROM users WHERE id = auth.uid()) IN ('admin', 'sales_rep')
  );

CREATE POLICY "Users can update properties they created or admins"
  ON properties FOR UPDATE
  USING (
    created_by = auth.uid() OR (SELECT role FROM users WHERE id = auth.uid()) = 'admin'
  );

CREATE POLICY "Users can delete properties they created or admins"
  ON properties FOR DELETE
  USING (
    created_by = auth.uid() OR (SELECT role FROM users WHERE id = auth.uid()) = 'admin'
  );

-- ============ CUSTOMERS TABLE POLICIES ============
CREATE POLICY "Users can view customers based on role"
  ON customers FOR SELECT
  USING (
    (SELECT role FROM users WHERE id = auth.uid()) IN ('admin', 'sales_rep', 'viewer')
  );

CREATE POLICY "Sales reps can create customers"
  ON customers FOR INSERT
  WITH CHECK (
    (SELECT role FROM users WHERE id = auth.uid()) IN ('admin', 'sales_rep')
  );

CREATE POLICY "Sales reps can update customers or admins"
  ON customers FOR UPDATE
  USING (
    (SELECT role FROM users WHERE id = auth.uid()) IN ('admin', 'sales_rep')
  );

CREATE POLICY "Sales reps can delete customers or admins"
  ON customers FOR DELETE
  USING (
    (SELECT role FROM users WHERE id = auth.uid()) IN ('admin', 'sales_rep')
  );

-- ============ DEALS TABLE POLICIES ============
CREATE POLICY "Users can view deals based on role"
  ON deals FOR SELECT
  USING (
    (SELECT role FROM users WHERE id = auth.uid()) IN ('admin', 'sales_rep', 'viewer')
  );

CREATE POLICY "Sales reps can create deals"
  ON deals FOR INSERT
  WITH CHECK (
    (SELECT role FROM users WHERE id = auth.uid()) IN ('admin', 'sales_rep')
  );

CREATE POLICY "Users can update deals they created or admins"
  ON deals FOR UPDATE
  USING (
    created_by = auth.uid() OR (SELECT role FROM users WHERE id = auth.uid()) = 'admin'
  );

CREATE POLICY "Users can delete deals they created or admins"
  ON deals FOR DELETE
  USING (
    created_by = auth.uid() OR (SELECT role FROM users WHERE id = auth.uid()) = 'admin'
  );

-- ============ DEAL_CUSTOMERS TABLE POLICIES ============
CREATE POLICY "Users can view deal_customers based on role"
  ON deal_customers FOR SELECT
  USING (
    (SELECT role FROM users WHERE id = auth.uid()) IN ('admin', 'sales_rep', 'viewer')
  );

CREATE POLICY "Sales reps can create deal_customers"
  ON deal_customers FOR INSERT
  WITH CHECK (
    (SELECT role FROM users WHERE id = auth.uid()) IN ('admin', 'sales_rep')
  );

CREATE POLICY "Sales reps can update deal_customers or admins"
  ON deal_customers FOR UPDATE
  USING (
    (SELECT role FROM users WHERE id = auth.uid()) IN ('admin', 'sales_rep')
  );

CREATE POLICY "Sales reps can delete deal_customers or admins"
  ON deal_customers FOR DELETE
  USING (
    (SELECT role FROM users WHERE id = auth.uid()) IN ('admin', 'sales_rep')
  );

-- ============ TASKS TABLE POLICIES ============
CREATE POLICY "Users can view tasks based on role"
  ON tasks FOR SELECT
  USING (
    (SELECT role FROM users WHERE id = auth.uid()) IN ('admin', 'sales_rep', 'viewer')
  );

CREATE POLICY "Sales reps can create tasks"
  ON tasks FOR INSERT
  WITH CHECK (
    (SELECT role FROM users WHERE id = auth.uid()) IN ('admin', 'sales_rep')
  );

CREATE POLICY "Users can update tasks they created or assigned to them"
  ON tasks FOR UPDATE
  USING (
    created_by = auth.uid() OR assigned_to = auth.uid() OR (SELECT role FROM users WHERE id = auth.uid()) = 'admin'
  );

CREATE POLICY "Users can delete tasks they created or admins"
  ON tasks FOR DELETE
  USING (
    created_by = auth.uid() OR (SELECT role FROM users WHERE id = auth.uid()) = 'admin'
  );

-- ============ ATTACHMENTS TABLE POLICIES ============
CREATE POLICY "Users can view attachments based on role"
  ON attachments FOR SELECT
  USING (
    (SELECT role FROM users WHERE id = auth.uid()) IN ('admin', 'sales_rep', 'viewer')
  );

CREATE POLICY "Sales reps can create attachments"
  ON attachments FOR INSERT
  WITH CHECK (
    (SELECT role FROM users WHERE id = auth.uid()) IN ('admin', 'sales_rep')
  );

CREATE POLICY "Users can delete attachments they uploaded or admins"
  ON attachments FOR DELETE
  USING (
    uploaded_by = auth.uid() OR (SELECT role FROM users WHERE id = auth.uid()) = 'admin'
  );

-- ============ AUDIT_LOGS TABLE POLICIES ============
CREATE POLICY "Users can view audit logs"
  ON audit_logs FOR SELECT
  USING (
    (SELECT role FROM users WHERE id = auth.uid()) IN ('admin', 'sales_rep', 'viewer')
  );

CREATE POLICY "System can insert audit logs"
  ON audit_logs FOR INSERT
  WITH CHECK (true);
