import { supabase } from './supabase'
import { Contact, Property, Deal, Customer, DealCustomer, Task, Attachment } from '../types/database'

// ============ CONTACTS ============

export const getContacts = async () => {
  const { data, error } = await supabase
    .from('contacts')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data as Contact[]
}

export const getContact = async (id: string) => {
  const { data, error } = await supabase
    .from('contacts')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data as Contact
}

export const createContact = async (contact: Omit<Contact, 'id' | 'created_at' | 'updated_at'>) => {
  const { data, error } = await supabase
    .from('contacts')
    .insert(contact)
    .select()
    .single()

  if (error) throw error
  return data as Contact
}

export const updateContact = async (id: string, updates: Partial<Contact>) => {
  const { data, error } = await supabase
    .from('contacts')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data as Contact
}

export const deleteContact = async (id: string) => {
  const { error } = await supabase
    .from('contacts')
    .delete()
    .eq('id', id)

  if (error) throw error
}

// ============ PROPERTIES ============

export const getProperties = async () => {
  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data as Property[]
}

export const getProperty = async (id: string) => {
  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data as Property
}

export const createProperty = async (property: Omit<Property, 'id' | 'created_at' | 'updated_at'>) => {
  const { data, error } = await supabase
    .from('properties')
    .insert(property)
    .select()
    .single()

  if (error) throw error
  return data as Property
}

export const updateProperty = async (id: string, updates: Partial<Property>) => {
  const { data, error } = await supabase
    .from('properties')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data as Property
}

export const deleteProperty = async (id: string) => {
  const { error } = await supabase
    .from('properties')
    .delete()
    .eq('id', id)

  if (error) throw error
}

// ============ CUSTOMERS ============

export const getCustomers = async () => {
  const { data, error } = await supabase
    .from('customers')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data as Customer[]
}

export const getCustomer = async (id: string) => {
  const { data, error } = await supabase
    .from('customers')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data as Customer
}

export const createCustomer = async (customer: Omit<Customer, 'id' | 'created_at' | 'updated_at'>) => {
  const { data, error } = await supabase
    .from('customers')
    .insert(customer)
    .select()
    .single()

  if (error) throw error
  return data as Customer
}

export const updateCustomer = async (id: string, updates: Partial<Customer>) => {
  const { data, error } = await supabase
    .from('customers')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data as Customer
}

export const deleteCustomer = async (id: string) => {
  const { error } = await supabase
    .from('customers')
    .delete()
    .eq('id', id)

  if (error) throw error
}

// ============ DEALS ============

export const getDeals = async () => {
  const { data, error } = await supabase
    .from('deals')
    .select(`
      *,
      property:property_id(*),
      source_contact:source_contact_id(*)
    `)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data as Deal[]
}

export const getDeal = async (id: string) => {
  const { data, error } = await supabase
    .from('deals')
    .select(`
      *,
      property:property_id(*),
      source_contact:source_contact_id(*)
    `)
    .eq('id', id)
    .single()

  if (error) throw error
  return data as Deal
}

export const createDeal = async (deal: Omit<Deal, 'id' | 'created_at' | 'updated_at' | 'property' | 'source_contact' | 'created_by_user'>) => {
  const { data, error } = await supabase
    .from('deals')
    .insert(deal)
    .select(`
      *,
      property:property_id(*),
      source_contact:source_contact_id(*)
    `)
    .single()

  if (error) throw error
  return data as Deal
}

export const updateDeal = async (id: string, updates: Partial<Deal>) => {
  const { data, error } = await supabase
    .from('deals')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select(`
      *,
      property:property_id(*),
      source_contact:source_contact_id(*)
    `)
    .single()

  if (error) throw error
  return data as Deal
}

export const deleteDeal = async (id: string) => {
  const { error } = await supabase
    .from('deals')
    .delete()
    .eq('id', id)

  if (error) throw error
}

// ============ DEAL-CUSTOMERS ============

export const getDealCustomers = async (dealId?: string) => {
  let query = supabase
    .from('deal_customers')
    .select(`
      *,
      deal:deal_id(*),
      customer:customer_id(*)
    `)

  if (dealId) {
    query = query.eq('deal_id', dealId)
  }

  const { data, error } = await query.order('offered_date', { ascending: false })

  if (error) throw error
  return data as DealCustomer[]
}

export const createDealCustomer = async (dealCustomer: Omit<DealCustomer, 'id' | 'deal' | 'customer'>) => {
  const { data, error } = await supabase
    .from('deal_customers')
    .insert(dealCustomer)
    .select(`
      *,
      deal:deal_id(*),
      customer:customer_id(*)
    `)
    .single()

  if (error) throw error
  return data as DealCustomer
}

export const updateDealCustomer = async (id: string, updates: Partial<DealCustomer>) => {
  const { data, error } = await supabase
    .from('deal_customers')
    .update(updates)
    .eq('id', id)
    .select(`
      *,
      deal:deal_id(*),
      customer:customer_id(*)
    `)
    .single()

  if (error) throw error
  return data as DealCustomer
}

export const deleteDealCustomer = async (id: string) => {
  const { error } = await supabase
    .from('deal_customers')
    .delete()
    .eq('id', id)

  if (error) throw error
}

// ============ TASKS ============

export const getTasks = async () => {
  const { data, error } = await supabase
    .from('tasks')
    .select(`
      *,
      assigned_to_user:assigned_to(*),
      deal:deal_id(*),
      contact:contact_id(*),
      customer:customer_id(*),
      created_by_user:created_by(*)
    `)
    .order('due_date', { ascending: true })

  if (error) throw error
  return data as Task[]
}

export const getTask = async (id: string) => {
  const { data, error } = await supabase
    .from('tasks')
    .select(`
      *,
      assigned_to_user:assigned_to(*),
      deal:deal_id(*),
      contact:contact_id(*),
      customer:customer_id(*),
      created_by_user:created_by(*)
    `)
    .eq('id', id)
    .single()

  if (error) throw error
  return data as Task
}

export const createTask = async (task: Omit<Task, 'id' | 'created_at' | 'updated_at' | 'assigned_to_user' | 'deal' | 'contact' | 'customer' | 'created_by_user'>) => {
  const { data, error } = await supabase
    .from('tasks')
    .insert(task)
    .select(`
      *,
      assigned_to_user:assigned_to(*),
      deal:deal_id(*),
      contact:contact_id(*),
      customer:customer_id(*),
      created_by_user:created_by(*)
    `)
    .single()

  if (error) throw error
  return data as Task
}

export const updateTask = async (id: string, updates: Partial<Task>) => {
  const { data, error } = await supabase
    .from('tasks')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select(`
      *,
      assigned_to_user:assigned_to(*),
      deal:deal_id(*),
      contact:contact_id(*),
      customer:customer_id(*),
      created_by_user:created_by(*)
    `)
    .single()

  if (error) throw error
  return data as Task
}

export const deleteTask = async (id: string) => {
  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', id)

  if (error) throw error
}

// ============ ATTACHMENTS ============

export const getAttachments = async (dealId?: string, propertyId?: string) => {
  let query = supabase
    .from('attachments')
    .select(`
      *,
      uploaded_by_user:uploaded_by(*)
    `)

  if (dealId) {
    query = query.eq('deal_id', dealId)
  }
  if (propertyId) {
    query = query.eq('property_id', propertyId)
  }

  const { data, error } = await query.order('created_at', { ascending: false })

  if (error) throw error
  return data as Attachment[]
}

export const deleteAttachment = async (id: string) => {
  const { error } = await supabase
    .from('attachments')
    .delete()
    .eq('id', id)

  if (error) throw error
}

// ============ ANALYTICS ============

export const getPipelineSummary = async () => {
  const { data, error } = await supabase
    .from('deals')
    .select('deal_status, deal_value')

  if (error) throw error

  const summary = {
    prospect: 0,
    negotiating: 0,
    won: 0,
    lost: 0,
    prospectValue: 0,
    negotiatingValue: 0,
    wonValue: 0,
  }

  data.forEach((deal) => {
    if (deal.deal_status === 'prospect') {
      summary.prospect++
      summary.prospectValue += deal.deal_value || 0
    } else if (deal.deal_status === 'negotiating') {
      summary.negotiating++
      summary.negotiatingValue += deal.deal_value || 0
    } else if (deal.deal_status === 'won') {
      summary.won++
      summary.wonValue += deal.deal_value || 0
    } else if (deal.deal_status === 'lost') {
      summary.lost++
    }
  })

  return summary
}
