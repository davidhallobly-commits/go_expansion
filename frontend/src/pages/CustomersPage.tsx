import { useState, useEffect } from 'react'
import type { Customer } from '../types/database'
import { getCustomers, deleteCustomer } from '../services/database'
import CustomerForm from '../components/CustomerForm'

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  useEffect(() => {
    loadCustomers()
  }, [])

  const loadCustomers = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getCustomers()
      setCustomers(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load customers')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this customer?')) return

    try {
      await deleteCustomer(id)
      setCustomers(customers.filter(c => c.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete customer')
    }
  }

  const handleFormClose = () => {
    setShowForm(false)
    setEditingId(null)
    loadCustomers()
  }

  const filteredCustomers = customers.filter(customer =>
    `${customer.company_name} ${customer.contact_person || ''} ${customer.email || ''}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
          <p className="text-gray-600 text-sm">Manage client companies and relationships</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Search and Create Button */}
        <div className="mb-6 flex gap-4 items-center">
          <input
            type="text"
            placeholder="Search by company name, contact, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
          />
          <button
            onClick={() => {
              setEditingId(null)
              setShowForm(!showForm)
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            {showForm ? 'Cancel' : '+ New Customer'}
          </button>
        </div>

        {/* Form */}
        {showForm && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              {editingId ? 'Edit Customer' : 'New Customer'}
            </h2>
            <CustomerForm
              customerId={editingId || undefined}
              onClose={handleFormClose}
            />
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading customers...</p>
          </div>
        ) : filteredCustomers.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-600 text-lg">No customers found</p>
            <p className="text-gray-500 text-sm mt-2">Create your first customer to get started</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCustomers.map(customer => (
              <div key={customer.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6">
                <h3 className="font-bold text-lg text-gray-900 mb-2">{customer.company_name}</h3>

                <div className="space-y-2 mb-4 text-sm text-gray-600">
                  {customer.contact_person && (
                    <p><span className="font-medium">Contact:</span> {customer.contact_person}</p>
                  )}
                  {customer.email && (
                    <p><span className="font-medium">Email:</span> {customer.email}</p>
                  )}
                  {customer.phone && (
                    <p><span className="font-medium">Phone:</span> {customer.phone}</p>
                  )}
                  {customer.city && customer.state && (
                    <p><span className="font-medium">Location:</span> {customer.city}, {customer.state}</p>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditingId(customer.id)
                      setShowForm(true)
                    }}
                    className="flex-1 text-blue-600 hover:text-blue-700 font-medium text-sm py-2 border border-blue-200 rounded hover:bg-blue-50 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(customer.id)}
                    className="flex-1 text-red-600 hover:text-red-700 font-medium text-sm py-2 border border-red-200 rounded hover:bg-red-50 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
