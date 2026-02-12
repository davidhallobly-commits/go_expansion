import { supabase } from './supabase'
import type { Contact, Property, Deal, Customer, DealCustomer, Task, Attachment } from '../types/database'

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

export const getTasksSummary = async () => {
  const { data, error } = await supabase
    .from('tasks')
    .select('status, due_date')

  if (error) throw error

  const summary = {
    pending: 0,
    inProgress: 0,
    completed: 0,
    overdue: 0,
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  data.forEach((task) => {
    if (task.status === 'pending') summary.pending++
    else if (task.status === 'in_progress') summary.inProgress++
    else if (task.status === 'completed') summary.completed++

    // Count overdue tasks
    if (task.due_date && task.status !== 'completed') {
      const dueDate = new Date(task.due_date)
      dueDate.setHours(0, 0, 0, 0)
      if (dueDate < today) {
        summary.overdue++
      }
    }
  })

  return summary
}

export const getWinRate = async () => {
  const { data, error } = await supabase
    .from('deals')
    .select('deal_status')

  if (error) throw error

  const won = data.filter(d => d.deal_status === 'won').length
  const lost = data.filter(d => d.deal_status === 'lost').length
  const total = won + lost

  if (total === 0) return 0
  return Math.round((won / total) * 100)
}

export const getDealsPerCustomer = async () => {
  const { data, error } = await supabase
    .from('deal_customers')
    .select(`deal_id, customer_id, deal:deal_id(deal_value), customer:customer_id(company_name)`)

  if (error) throw error

  interface CustomerStats {
    [customerId: string]: { name: string; count: number; totalValue: number }
  }

  const stats: CustomerStats = {}

  data.forEach((dc: any) => {
    const customerId = dc.customer_id
    const dealValue = dc.deal?.deal_value || 0

    if (!stats[customerId]) {
      stats[customerId] = {
        name: dc.customer?.company_name || 'Unknown',
        count: 0,
        totalValue: 0,
      }
    }
    stats[customerId].count++
    stats[customerId].totalValue += dealValue
  })

  return Object.values(stats)
    .sort((a, b) => b.totalValue - a.totalValue)
    .slice(0, 5)
}

export const getRecentActivity = async () => {
  const { data: recentDeals, error: dealsError } = await supabase
    .from('deals')
    .select('id, property_id, deal_value, deal_status, updated_at, property:property_id(address, city, state)')
    .order('updated_at', { ascending: false })
    .limit(5)

  if (dealsError) throw dealsError

  const { data: recentTasks, error: tasksError } = await supabase
    .from('tasks')
    .select('id, title, status, updated_at, assigned_to_user:assigned_to(first_name, last_name)')
    .order('updated_at', { ascending: false })
    .limit(5)

  if (tasksError) throw tasksError

  return {
    deals: recentDeals || [],
    tasks: recentTasks || [],
  }
}

export const getTasksDueThisWeek = async () => {
  const today = new Date()
  const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)

  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .gte('due_date', today.toISOString().split('T')[0])
    .lte('due_date', nextWeek.toISOString().split('T')[0])
    .neq('status', 'completed')

  if (error) throw error
  return data?.length || 0
}

export const getTotalPipelineValue = async () => {
  const { data, error } = await supabase
    .from('deals')
    .select('deal_value, deal_status')
    .neq('deal_status', 'lost')

  if (error) throw error

  return data.reduce((sum, deal) => sum + (deal.deal_value || 0), 0)
}
