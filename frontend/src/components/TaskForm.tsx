import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { getTask, createTask, updateTask, getDeals, getContacts, getCustomers } from '../services/database'
import { supabase } from '../services/supabase'
import type { Task, User, Deal, Contact, Customer, TaskStatus } from '../types/database'

interface TaskFormProps {
  taskId?: string
  onClose: () => void
}

export default function TaskForm({ taskId, onClose }: TaskFormProps) {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [users, setUsers] = useState<User[]>([])
  const [deals, setDeals] = useState<Deal[]>([])
  const [contacts, setContacts] = useState<Contact[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assigned_to: '',
    entity_type: 'deal' as 'deal' | 'contact' | 'customer' | 'none',
    deal_id: '',
    contact_id: '',
    customer_id: '',
    due_date: '',
    status: 'pending' as TaskStatus,
  })

  useEffect(() => {
    loadSelectionData()
    if (taskId) {
      loadTask()
    }
  }, [taskId])

  const loadSelectionData = async () => {
    try {
      const [usersData, dealsData, contactsData, customersData] = await Promise.all([
        (async () => {
          const { data, error } = await supabase.from('users').select('*').order('first_name')
          if (error) throw error
          return data || []
        })(),
        getDeals(),
        getContacts(),
        getCustomers(),
      ])

      setUsers(usersData as User[])
      setDeals(dealsData)
      setContacts(contactsData)
      setCustomers(customersData)
    } catch (err) {
      setError('Failed to load selection options')
    }
  }

  const loadTask = async () => {
    if (!taskId) return

    try {
      setLoading(true)
      const task = await getTask(taskId)
      setFormData({
        title: task.title,
        description: task.description || '',
        assigned_to: task.assigned_to,
        entity_type: task.deal_id ? 'deal' : task.contact_id ? 'contact' : task.customer_id ? 'customer' : 'none',
        deal_id: task.deal_id || '',
        contact_id: task.contact_id || '',
        customer_id: task.customer_id || '',
        due_date: task.due_date || '',
        status: task.status,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load task')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!user) {
      setError('You must be logged in')
      return
    }

    if (!formData.title.trim() || !formData.assigned_to) {
      setError('Title and assignee are required')
      return
    }

    try {
      setLoading(true)

      const data = {
        title: formData.title.trim(),
        description: formData.description.trim() || null,
        assigned_to: formData.assigned_to,
        deal_id: formData.entity_type === 'deal' ? formData.deal_id || null : null,
        contact_id: formData.entity_type === 'contact' ? formData.contact_id || null : null,
        customer_id: formData.entity_type === 'customer' ? formData.customer_id || null : null,
        due_date: formData.due_date || null,
        status: formData.status,
      }

      if (taskId) {
        await updateTask(taskId, {
          ...data,
          updated_at: new Date().toISOString(),
        } as Partial<Task>)
      } else {
        await createTask({
          ...data,
          created_by: user.id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        } as Omit<Task, 'id' | 'assigned_to_user' | 'deal' | 'contact' | 'customer' | 'created_by_user'>)
      }

      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save task')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  if (loading && taskId) {
    return <div className="text-center py-4">Loading...</div>
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            required
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Assign To *</label>
          <select
            name="assigned_to"
            value={formData.assigned_to}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            required
            disabled={loading}
          >
            <option value="">Select a user...</option>
            {users.map(u => (
              <option key={u.id} value={u.id}>
                {u.first_name} {u.last_name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status *</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            disabled={loading}
          >
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
          <input
            type="date"
            name="due_date"
            value={formData.due_date}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            disabled={loading}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
          disabled={loading}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">Link to Entity (Optional)</label>
        <div className="space-y-3">
          <div className="flex items-center space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="entity_type"
                value="none"
                checked={formData.entity_type === 'none'}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600"
                disabled={loading}
              />
              <span className="ml-2 text-sm text-gray-700">No Link</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="entity_type"
                value="deal"
                checked={formData.entity_type === 'deal'}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600"
                disabled={loading}
              />
              <span className="ml-2 text-sm text-gray-700">Deal</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="entity_type"
                value="contact"
                checked={formData.entity_type === 'contact'}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600"
                disabled={loading}
              />
              <span className="ml-2 text-sm text-gray-700">Contact</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="entity_type"
                value="customer"
                checked={formData.entity_type === 'customer'}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600"
                disabled={loading}
              />
              <span className="ml-2 text-sm text-gray-700">Customer</span>
            </label>
          </div>

          {formData.entity_type === 'deal' && (
            <select
              name="deal_id"
              value={formData.deal_id}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              disabled={loading}
            >
              <option value="">Select a deal...</option>
              {deals.map(deal => (
                <option key={deal.id} value={deal.id}>
                  {deal.property?.address || 'Unknown'} - {deal.property?.city}, {deal.property?.state}
                </option>
              ))}
            </select>
          )}

          {formData.entity_type === 'contact' && (
            <select
              name="contact_id"
              value={formData.contact_id}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              disabled={loading}
            >
              <option value="">Select a contact...</option>
              {contacts.map(contact => (
                <option key={contact.id} value={contact.id}>
                  {contact.first_name} {contact.last_name} {contact.company ? `(${contact.company})` : ''}
                </option>
              ))}
            </select>
          )}

          {formData.entity_type === 'customer' && (
            <select
              name="customer_id"
              value={formData.customer_id}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              disabled={loading}
            >
              <option value="">Select a customer...</option>
              {customers.map(customer => (
                <option key={customer.id} value={customer.id}>
                  {customer.company_name}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-4 pt-4">
        <button
          type="button"
          onClick={onClose}
          className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          disabled={loading}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:bg-gray-400"
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Save Task'}
        </button>
      </div>
    </form>
  )
}
