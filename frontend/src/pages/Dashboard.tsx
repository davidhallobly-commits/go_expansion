import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import {
  getPipelineSummary,
  getTasksSummary,
  getWinRate,
  getDealsPerCustomer,
  getRecentActivity,
  getTasksDueThisWeek,
  getTotalPipelineValue,
  getDeals,
  getContacts,
  getTasks,
} from '../services/database'

export default function Dashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [pipelineSummary, setPipelineSummary] = useState({
    prospect: 0,
    negotiating: 0,
    won: 0,
    lost: 0,
    prospectValue: 0,
    negotiatingValue: 0,
    wonValue: 0,
  })
  const [tasksSummary, setTasksSummary] = useState({
    pending: 0,
    inProgress: 0,
    completed: 0,
    overdue: 0,
  })
  const [winRate, setWinRate] = useState(0)
  const [dealsPerCustomer, setDealsPerCustomer] = useState<any[]>([])
  const [recentActivity, setRecentActivity] = useState({ deals: [], tasks: [] })
  const [tasksDueThisWeek, setTasksDueThisWeek] = useState(0)
  const [totalPipelineValue, setTotalPipelineValue] = useState(0)
  const [totalDeals, setTotalDeals] = useState(0)
  const [totalContacts, setTotalContacts] = useState(0)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)

      const [
        pipelineData,
        tasksData,
        winRateData,
        customersData,
        activityData,
        dueDateData,
        pipelineValueData,
        dealsData,
        contactsData,
      ] = await Promise.all([
        getPipelineSummary(),
        getTasksSummary(),
        getWinRate(),
        getDealsPerCustomer(),
        getRecentActivity(),
        getTasksDueThisWeek(),
        getTotalPipelineValue(),
        getDeals(),
        getContacts(),
      ])

      setPipelineSummary(pipelineData)
      setTasksSummary(tasksData)
      setWinRate(winRateData)
      setDealsPerCustomer(customersData)
      setRecentActivity(activityData)
      setTasksDueThisWeek(dueDateData)
      setTotalPipelineValue(pipelineValueData)
      setTotalDeals(dealsData.length)
      setTotalContacts(contactsData.length)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  const totalDealsCount = pipelineSummary.prospect + pipelineSummary.negotiating + pipelineSummary.won + pipelineSummary.lost
  const activeTasks = tasksSummary.pending + tasksSummary.inProgress

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">GoExpansion CRM</h1>
            <p className="text-gray-600 text-sm">Commercial Real Estate Management</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">
                {user?.first_name} {user?.last_name}
              </p>
              <p className="text-xs text-gray-600 capitalize">{user?.role}</p>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Top Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Deals</p>
                <p className="text-3xl font-bold text-gray-900">{totalDealsCount}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <span className="text-2xl">📊</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Pipeline Value</p>
                <p className="text-3xl font-bold text-gray-900">
                  ${(totalPipelineValue / 1000).toFixed(0)}K
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <span className="text-2xl">💰</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Win Rate</p>
                <p className="text-3xl font-bold text-gray-900">{winRate}%</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <span className="text-2xl">🎯</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Active Tasks</p>
                <p className="text-3xl font-bold text-gray-900">{activeTasks}</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-lg">
                <span className="text-2xl">✓</span>
              </div>
            </div>
          </div>
        </div>

        {/* Pipeline Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Prospect</h3>
            <p className="text-2xl font-bold text-blue-600 mb-1">{pipelineSummary.prospect}</p>
            <p className="text-xs text-gray-600">
              ${(pipelineSummary.prospectValue / 1000).toFixed(1)}K
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Negotiating</h3>
            <p className="text-2xl font-bold text-yellow-600 mb-1">{pipelineSummary.negotiating}</p>
            <p className="text-xs text-gray-600">
              ${(pipelineSummary.negotiatingValue / 1000).toFixed(1)}K
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Won</h3>
            <p className="text-2xl font-bold text-green-600 mb-1">{pipelineSummary.won}</p>
            <p className="text-xs text-gray-600">
              ${(pipelineSummary.wonValue / 1000).toFixed(1)}K
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Lost</h3>
            <p className="text-2xl font-bold text-red-600 mb-1">{pipelineSummary.lost}</p>
            <p className="text-xs text-gray-600">--</p>
          </div>
        </div>

        {/* Task Summary & Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {/* Task Status */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Task Status</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Pending</span>
                <span className="text-lg font-bold text-orange-600">{tasksSummary.pending}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">In Progress</span>
                <span className="text-lg font-bold text-blue-600">{tasksSummary.inProgress}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Completed</span>
                <span className="text-lg font-bold text-green-600">{tasksSummary.completed}</span>
              </div>
              <div className="pt-3 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-red-600">Overdue</span>
                  <span className="text-lg font-bold text-red-600">{tasksSummary.overdue}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Stats</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Contacts</span>
                <span className="text-lg font-bold text-gray-900">{totalContacts}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Due This Week</span>
                <span className="text-lg font-bold text-blue-600">{tasksDueThisWeek}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Avg Deal Size</span>
                <span className="text-lg font-bold text-gray-900">
                  {totalDealsCount > 0
                    ? `$${((totalPipelineValue / totalDealsCount) / 1000).toFixed(1)}K`
                    : '--'}
                </span>
              </div>
            </div>
          </div>

          {/* Top Customers */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Top Customers</h2>
            <div className="space-y-2">
              {dealsPerCustomer.length > 0 ? (
                dealsPerCustomer.slice(0, 3).map((customer, idx) => (
                  <div key={idx} className="flex justify-between items-start text-sm">
                    <span className="text-gray-600 truncate pr-2">{customer.name}</span>
                    <span className="text-gray-900 font-medium">${(customer.totalValue / 1000).toFixed(0)}K</span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-600">No customers yet</p>
              )}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Recent Deals */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Deals</h2>
            <div className="space-y-3">
              {recentActivity.deals.length > 0 ? (
                recentActivity.deals.map((deal: any) => (
                  <div key={deal.id} className="pb-3 border-b border-gray-200 last:border-b-0">
                    <p className="text-sm font-medium text-gray-900">
                      {deal.property?.address || 'Unknown'}
                    </p>
                    <div className="flex justify-between items-end mt-1">
                      <span className={`text-xs px-2 py-1 rounded capitalize ${
                        deal.deal_status === 'won'
                          ? 'bg-green-100 text-green-800'
                          : deal.deal_status === 'lost'
                          ? 'bg-red-100 text-red-800'
                          : deal.deal_status === 'negotiating'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {deal.deal_status}
                      </span>
                      <span className="text-xs text-gray-600">
                        {deal.deal_value ? `$${(deal.deal_value / 1000).toFixed(1)}K` : '--'}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-600">No recent deals</p>
              )}
            </div>
          </div>

          {/* Recent Tasks */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Tasks</h2>
            <div className="space-y-3">
              {recentActivity.tasks.length > 0 ? (
                recentActivity.tasks.map((task: any) => (
                  <div key={task.id} className="pb-3 border-b border-gray-200 last:border-b-0">
                    <p className="text-sm font-medium text-gray-900">{task.title}</p>
                    <div className="flex justify-between items-end mt-1">
                      <span className="text-xs text-gray-600">
                        {task.assigned_to_user
                          ? `${task.assigned_to_user.first_name} ${task.assigned_to_user.last_name}`
                          : '--'}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded capitalize ${
                        task.status === 'completed'
                          ? 'bg-green-100 text-green-800'
                          : task.status === 'in_progress'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-orange-100 text-orange-800'
                      }`}>
                        {task.status === 'in_progress' ? 'In Progress' : task.status}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-600">No recent tasks</p>
              )}
            </div>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => navigate('/deals')}
              className="bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Manage Deals
            </button>
            <button
              onClick={() => navigate('/contacts')}
              className="bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              Manage Contacts
            </button>
            <button
              onClick={() => navigate('/tasks')}
              className="bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-colors font-medium"
            >
              View Tasks
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
