import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { getDeal, createDeal, updateDeal, getProperties, getContacts } from '../services/database'
import type { Deal, Property, Contact, DealStatus } from '../types/database'

interface DealFormProps {
  dealId?: string
  onClose: () => void
}

export default function DealForm({ dealId, onClose }: DealFormProps) {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [properties, setProperties] = useState<Property[]>([])
  const [contacts, setContacts] = useState<Contact[]>([])
  const [formData, setFormData] = useState({
    property_id: '',
    source_contact_id: '',
    deal_value: '',
    deal_status: 'prospect' as DealStatus,
    expected_close_date: '',
    notes: '',
  })

  useEffect(() => {
    loadSelectionData()
    if (dealId) {
      loadDeal()
    }
  }, [dealId])

  const loadSelectionData = async () => {
    try {
      const [propData, contactData] = await Promise.all([
        getProperties(),
        getContacts(),
      ])
      setProperties(propData)
      setContacts(contactData)
    } catch (err) {
      setError('Failed to load properties and contacts')
    }
  }

  const loadDeal = async () => {
    if (!dealId) return

    try {
      setLoading(true)
      const deal = await getDeal(dealId)
      setFormData({
        property_id: deal.property_id,
        source_contact_id: deal.source_contact_id,
        deal_value: deal.deal_value?.toString() || '',
        deal_status: deal.deal_status,
        expected_close_date: deal.expected_close_date || '',
        notes: deal.notes || '',
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load deal')
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

    if (!formData.property_id || !formData.source_contact_id) {
      setError('Property and source contact are required')
      return
    }

    try {
      setLoading(true)

      const data = {
        property_id: formData.property_id,
        source_contact_id: formData.source_contact_id,
        deal_value: formData.deal_value ? parseFloat(formData.deal_value) : null,
        deal_status: formData.deal_status,
        expected_close_date: formData.expected_close_date || null,
        notes: formData.notes.trim() || null,
      }

      if (dealId) {
        await updateDeal(dealId, {
          ...data,
          updated_at: new Date().toISOString(),
        } as Partial<Deal>)
      } else {
        await createDeal({
          ...data,
          created_by: user.id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        } as Omit<Deal, 'id' | 'property' | 'source_contact' | 'created_by_user'>)
      }

      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save deal')
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

  if (loading && dealId) {
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
          <label className="block text-sm font-medium text-gray-700 mb-1">Property *</label>
          <select
            name="property_id"
            value={formData.property_id}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            required
            disabled={loading}
          >
            <option value="">Select a property...</option>
            {properties.map(prop => (
              <option key={prop.id} value={prop.id}>
                {prop.address} - {prop.city}, {prop.state}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Source Contact *</label>
          <select
            name="source_contact_id"
            value={formData.source_contact_id}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            required
            disabled={loading}
          >
            <option value="">Select a contact...</option>
            {contacts.map(contact => (
              <option key={contact.id} value={contact.id}>
                {contact.first_name} {contact.last_name} {contact.company ? `(${contact.company})` : ''}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Deal Status *</label>
          <select
            name="deal_status"
            value={formData.deal_status}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            disabled={loading}
          >
            <option value="prospect">Prospect</option>
            <option value="negotiating">Negotiating</option>
            <option value="won">Won</option>
            <option value="lost">Lost</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Deal Value</label>
          <input
            type="number"
            name="deal_value"
            value={formData.deal_value}
            onChange={handleChange}
            step="0.01"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Expected Close Date</label>
          <input
            type="date"
            name="expected_close_date"
            value={formData.expected_close_date}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            disabled={loading}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
          disabled={loading}
        />
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
          {loading ? 'Saving...' : 'Save Deal'}
        </button>
      </div>
    </form>
  )
}
