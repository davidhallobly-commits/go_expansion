import { useState, useEffect } from 'react'
import { Property } from '../types/database'
import { getProperties, deleteProperty } from '../services/database'
import PropertyForm from '../components/PropertyForm'
import AttachmentUpload from '../components/AttachmentUpload'

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  useEffect(() => {
    loadProperties()
  }, [])

  const loadProperties = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getProperties()
      setProperties(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load properties')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this property?')) return

    try {
      await deleteProperty(id)
      setProperties(properties.filter(p => p.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete property')
    }
  }

  const handleFormClose = () => {
    setShowForm(false)
    setEditingId(null)
    loadProperties()
  }

  const filteredProperties = properties.filter(property =>
    `${property.address} ${property.city} ${property.state} ${property.property_type}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-gray-900">Properties</h1>
          <p className="text-gray-600 text-sm">Manage commercial real estate listings</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Search and Create Button */}
        <div className="mb-6 flex gap-4 items-center">
          <input
            type="text"
            placeholder="Search by address, city, or type..."
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
            {showForm ? 'Cancel' : '+ New Property'}
          </button>
        </div>

        {/* Form */}
        {showForm && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              {editingId ? 'Edit Property' : 'New Property'}
            </h2>
            <PropertyForm
              propertyId={editingId || undefined}
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
            <p className="mt-4 text-gray-600">Loading properties...</p>
          </div>
        ) : filteredProperties.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-600 text-lg">No properties found</p>
            <p className="text-gray-500 text-sm mt-2">Create your first property to get started</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.map(property => (
              <div key={property.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-lg text-gray-900">{property.address}</h3>
                    <p className="text-sm text-gray-600">{property.city}, {property.state} {property.zip}</p>
                  </div>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full capitalize">
                    {property.property_type.replace('_', ' ')}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  {property.square_footage && (
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Size:</span> {property.square_footage.toLocaleString()} sqft
                    </p>
                  )}
                  {property.price_ask && (
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Asking Price:</span> ${property.price_ask.toLocaleString()}
                    </p>
                  )}
                </div>

                {property.description && (
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{property.description}</p>
                )}

                <div className="mb-4">
                  <AttachmentUpload entityType="property" entityId={property.id} />
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditingId(property.id)
                      setShowForm(true)
                    }}
                    className="flex-1 text-blue-600 hover:text-blue-700 font-medium text-sm py-2 border border-blue-200 rounded hover:bg-blue-50 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(property.id)}
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
