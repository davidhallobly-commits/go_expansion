import { useState, useEffect } from 'react'
import { getDealCustomers, createDealCustomer, updateDealCustomer, deleteDealCustomer, getCustomers } from '../services/database'
import type { DealCustomer, Customer, CustomerDealStatus } from '../types/database'

interface DealCustomersModalProps {
  dealId: string
  dealAddress: string
  isOpen: boolean
  onClose: () => void
}

export default function DealCustomersModal({ dealId, dealAddress, isOpen, onClose }: DealCustomersModalProps) {
  const [dealCustomers, setDealCustomers] = useState<DealCustomer[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedCustomerId, setSelectedCustomerId] = useState('')
  const [adding, setAdding] = useState(false)

  useEffect(() => {
    if (isOpen) {
      loadData()
    }
  }, [isOpen, dealId])

  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)
      const [dealsData, customersData] = await Promise.all([
        getDealCustomers(dealId),
        getCustomers(),
      ])
      setDealCustomers(dealsData)
      setCustomers(customersData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  const handleAddCustomer = async () => {
    if (!selectedCustomerId) {
      setError('Please select a customer')
      return
    }

    // Check if customer is already added
    if (dealCustomers.some(dc => dc.customer_id === selectedCustomerId)) {
      setError('This customer is already assigned to this deal')
      return
    }

    try {
      setAdding(true)
      const newDealCustomer = await createDealCustomer({
        deal_id: dealId,
        customer_id: selectedCustomerId,
        offered_date: new Date().toISOString(),
        customer_status: 'interested',
      })
      setDealCustomers([...dealCustomers, newDealCustomer])
      setSelectedCustomerId('')
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add customer')
    } finally {
      setAdding(false)
    }
  }

  const handleStatusChange = async (dealCustomerId: string, newStatus: CustomerDealStatus) => {
    try {
      await updateDealCustomer(dealCustomerId, {
        customer_status: newStatus,
      })
      setDealCustomers(
        dealCustomers.map(dc =>
          dc.id === dealCustomerId ? { ...dc, customer_status: newStatus } : dc
        )
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update status')
    }
  }

  const handleRemoveCustomer = async (dealCustomerId: string) => {
    if (!confirm('Remove this customer from the deal?')) return

    try {
      await deleteDealCustomer(dealCustomerId)
      setDealCustomers(dealCustomers.filter(dc => dc.id !== dealCustomerId))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove customer')
    }
  }

  const assignedCustomerIds = dealCustomers.map(dc => dc.customer_id)
  const availableCustomers = customers.filter(c => !assignedCustomerIds.includes(c.id))

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Manage Customers</h2>
            <p className="text-sm text-gray-600 mt-1">{dealAddress}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-gray-600">Loading...</p>
            </div>
          ) : (
            <>
              {/* Add Customer Section */}
              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Add Customer</h3>
                <div className="flex gap-2">
                  <select
                    value={selectedCustomerId}
                    onChange={(e) => setSelectedCustomerId(e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    disabled={adding || availableCustomers.length === 0}
                  >
                    <option value="">
                      {availableCustomers.length === 0
                        ? 'All customers already assigned'
                        : 'Select a customer...'}
                    </option>
                    {availableCustomers.map(customer => (
                      <option key={customer.id} value={customer.id}>
                        {customer.company_name}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={handleAddCustomer}
                    disabled={!selectedCustomerId || adding}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 font-medium"
                  >
                    {adding ? 'Adding...' : 'Add'}
                  </button>
                </div>
              </div>

              {/* Assigned Customers */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Assigned Customers ({dealCustomers.length})
                </h3>
                {dealCustomers.length === 0 ? (
                  <p className="text-gray-600 text-sm">No customers assigned yet</p>
                ) : (
                  <div className="space-y-2">
                    {dealCustomers.map(dealCustomer => (
                      <div
                        key={dealCustomer.id}
                        className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                      >
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">
                            {dealCustomer.customer?.company_name || 'Unknown'}
                          </p>
                          <p className="text-xs text-gray-600 mt-1">
                            Offered: {new Date(dealCustomer.offered_date).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          <select
                            value={dealCustomer.customer_status}
                            onChange={(e) =>
                              handleStatusChange(dealCustomer.id, e.target.value as CustomerDealStatus)
                            }
                            className="px-3 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                          >
                            <option value="interested">Interested</option>
                            <option value="negotiating">Negotiating</option>
                            <option value="accepted">Accepted</option>
                            <option value="rejected">Rejected</option>
                            <option value="expired">Expired</option>
                          </select>
                          <button
                            onClick={() => handleRemoveCustomer(dealCustomer.id)}
                            className="px-3 py-1 text-sm text-red-600 hover:text-red-700 border border-red-200 rounded hover:bg-red-50 transition-colors"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-4">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
