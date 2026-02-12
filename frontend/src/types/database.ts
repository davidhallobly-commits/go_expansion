// User roles
export type UserRole = 'admin' | 'sales_rep' | 'viewer'

// User
export interface User {
  id: string
  email: string
  first_name: string
  last_name: string
  role: UserRole
  created_at: string
}

// Contact (property/deal source)
export interface Contact {
  id: string
  first_name: string
  last_name: string
  email: string
  phone: string | null
  company: string | null
  address: string | null
  city: string | null
  state: string | null
  zip: string | null
  notes: string | null
  created_by: string
  created_at: string
  updated_at: string
}

// Property type
export type PropertyType = 'commercial_space' | 'office' | 'retail' | 'other'

// Property (commercial real estate)
export interface Property {
  id: string
  address: string
  city: string
  state: string
  zip: string
  property_type: PropertyType
  square_footage: number | null
  price_ask: number | null
  description: string | null
  created_by: string
  created_at: string
  updated_at: string
}

// Deal status
export type DealStatus = 'prospect' | 'negotiating' | 'won' | 'lost'

// Deal
export interface Deal {
  id: string
  property_id: string
  source_contact_id: string
  deal_value: number | null
  deal_status: DealStatus
  expected_close_date: string | null
  notes: string | null
  created_by: string
  created_at: string
  updated_at: string
  // Joined fields (when fetched with relations)
  property?: Property
  source_contact?: Contact
  created_by_user?: User
}

// Customer (client company)
export interface Customer {
  id: string
  company_name: string
  contact_person: string | null
  email: string | null
  phone: string | null
  address: string | null
  city: string | null
  state: string | null
  zip: string | null
  created_at: string
  updated_at: string
}

// Customer status for a deal
export type CustomerDealStatus = 'interested' | 'negotiating' | 'accepted' | 'rejected' | 'expired'

// Deal-Customer junction (many-to-many)
export interface DealCustomer {
  id: string
  deal_id: string
  customer_id: string
  offered_date: string
  customer_status: CustomerDealStatus
  // Joined fields
  deal?: Deal
  customer?: Customer
}

// Task status
export type TaskStatus = 'pending' | 'in_progress' | 'completed'

// Task
export interface Task {
  id: string
  title: string
  description: string | null
  assigned_to: string
  deal_id: string | null
  contact_id: string | null
  customer_id: string | null
  due_date: string | null
  status: TaskStatus
  created_by: string
  created_at: string
  updated_at: string
  // Joined fields
  assigned_to_user?: User
  deal?: Deal
  contact?: Contact
  customer?: Customer
  created_by_user?: User
}

// Attachment
export interface Attachment {
  id: string
  file_name: string
  file_path: string
  file_type: string
  size: number
  deal_id: string | null
  property_id: string | null
  uploaded_by: string
  created_at: string
  // Joined fields
  uploaded_by_user?: User
}

// Audit Log
export interface AuditLog {
  id: string
  user_id: string
  action: string
  entity_type: string
  entity_id: string
  changes: Record<string, any> | null
  created_at: string
}
