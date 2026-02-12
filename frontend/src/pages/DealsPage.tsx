import { useState, useEffect } from 'react'
import { Deal, DealStatus } from '../types/database'
import { getDeals, deleteDeal } from '../services/database'
import DealForm from '../components/DealForm'
import DealCustomersModal from '../components/DealCustomersModal'

export default function DealsPage() {
  const [deals, setDeals] = useState<Deal[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [selectedStatus, setSelectedStatus] = useState<DealStatus | 'all'>('all')
  const [modalDealId, setModalDealId] = useState<string | null>(null)
  const [modalDealAddress, setModalDealAddress] = useState('')

  useEffect(() => {
    loadDeals()
  }, [])

  const loadDeals = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getDeals()
      setDeals(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load deals')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this deal?')) return

    try {
      await deleteDeal(id)
      setDeals(deals.filter(d => d.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete deal')
    }
  }

  const handleFormClose = () => {
    setShowForm(false)
    setEditingId(null)
    loadDeals()
  }

  const filteredDeals = deals.filter(deal => {
    const matchesSearch = `${deal.property?.address || ''} ${deal.source_contact?.first_name || ''} ${deal.source_contact?.last_name || ''} ${deal.deal_value || ''}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())

    const matchesStatus = selectedStatus === 'all' || deal.deal_status === selectedStatus

    return matchesSearch && matchesStatus
  })

  const dealsByStatus = {
    prospect: filteredDeals.filter(d => d.deal_status === 'prospect'),
    negotiating: filteredDeals.filter(d => d.deal_status === 'negotiating'),
    won: filteredDeals.filter(d => d.deal_status === 'won'),
    lost: filteredDeals.filter(d => d.deal_status === 'lost'),
  }

  const calculateTotal = (status: DealStatus) => {
    return dealsByStatus[status].reduce((sum, deal) => sum + (deal.deal_value || 0), 0)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-gray-900">Deals</h1>
          <p className="text-gray-600 text-sm">Manage commercial real estate deals and pipeline</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Search and Create Button */}
        <div className="mb-6 flex gap-4 items-center flex-wrap">
          <input
            type="text"
            placeholder="Search by address, contact, or value..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 min-w-[200px] px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
          />
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as DealStatus | 'all')}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="prospect">Prospect</option>
            <option value="negotiating">Negotiating</option>
            <option value="won">Won</option>
            <option value="lost">Lost</option>
          </select>
          <button
            onClick={() => {
              setEditingId(null)
              setShowForm(!showForm)
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            {showForm ? 'Cancel' : '+ New Deal'}
          </button>
        </div>

        {/* Form */}
        {showForm && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              {editingId ? 'Edit Deal' : 'New Deal'}
            </h2>
            <DealForm
              dealId={editingId || undefined}
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
            <p className="mt-4 text-gray-600">Loading deals...</p>
          </div>
        ) : (
          <>
            {/* Pipeline Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {(['prospect', 'negotiating', 'won', 'lost'] as DealStatus[]).map(status => (
                <div key={status} className="bg-white rounded-lg shadow p-4">
                  <h3 className="text-sm font-medium text-gray-600 capitalize mb-2">{status}</h3>
                  <div className="space-y-1">
                    <p className="text-2xl font-bold text-gray-900">{dealsByStatus[status].length}</p>
                    <p className="text-sm text-gray-600">
                      ${calculateTotal(status).toLocaleString('en-US', { maximumFractionDigits: 0 })}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Pipeline View */}
            {filteredDeals.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg shadow">
                <p className="text-gray-600 text-lg">No deals found</p>
                <p className="text-gray-500 text-sm mt-2">Create your first deal to get started</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {filteredDeals.map(deal => (
                  <div key={deal.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="font-bold text-lg text-gray-900">
                          {deal.property?.address || 'Unknown Property'}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {deal.property?.city}, {deal.property?.state}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
                        deal.deal_status === 'won' ? 'bg-green-100 text-green-800' :
                        deal.deal_status === 'lost' ? 'bg-red-100 text-red-800' :
                        deal.deal_status === 'negotiating' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {deal.deal_status}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-gray-600 font-medium">Source Contact</p>
                        <p className="text-sm text-gray-900">
                          {deal.source_contact?.first_name} {deal.source_contact?.last_name}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 font-medium">Deal Value</p>
                        <p className="text-sm font-medium text-gray-900">
                          {deal.deal_value ? `$${deal.deal_value.toLocaleString()}` : 'TBD'}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 font-medium">Expected Close</p>
                        <p className="text-sm text-gray-900">
                          {deal.expected_close_date ? new Date(deal.expected_close_date).toLocaleDateString() : 'TBD'}
                        </p>
                      </div>
                    </div>

                    {deal.notes && (
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">{deal.notes}</p>
                    )}

                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setModalDealId(deal.id)
                          setModalDealAddress(deal.property?.address || 'Unknown')
                        }}
                        className="flex-1 text-purple-600 hover:text-purple-700 font-medium text-sm py-2 border border-purple-200 rounded hover:bg-purple-50 transition-colors"
                      >
                        Customers
                      </button>
                      <button
                        onClick={() => {
                          setEditingId(deal.id)
                          setShowForm(true)
                        }}
                        className="flex-1 text-blue-600 hover:text-blue-700 font-medium text-sm py-2 border border-blue-200 rounded hover:bg-blue-50 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(deal.id)}
                        className="flex-1 text-red-600 hover:text-red-700 font-medium text-sm py-2 border border-red-200 rounded hover:bg-red-50 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Deal Customers Modal */}
        <DealCustomersModal
          dealId={modalDealId || ''}
          dealAddress={modalDealAddress}
          isOpen={modalDealId !== null}
          onClose={() => {
            setModalDealId(null)
            setModalDealAddress('')
            loadDeals() // Refresh deals in case customers were added/removed
          }}
        />
      </main>
    </div>
  )
}
