import { useState, useEffect } from 'react'
import { Task, TaskStatus, User } from '../types/database'
import { getTasks, deleteTask, getContacts, getProperties, getCustomers } from '../services/database'
import { supabase } from '../services/supabase'
import TaskForm from '../components/TaskForm'

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [selectedStatus, setSelectedStatus] = useState<TaskStatus | 'all'>('all')
  const [selectedAssignee, setSelectedAssignee] = useState<string | 'all'>('all')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Get tasks
      const tasksData = await getTasks()
      setTasks(tasksData)

      // Get users for assignee dropdown
      const { data: usersData, error: usersError } = await supabase
        .from('users')
        .select('*')
        .order('first_name')

      if (usersError) throw usersError
      setUsers(usersData || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load tasks')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this task?')) return

    try {
      await deleteTask(id)
      setTasks(tasks.filter(t => t.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete task')
    }
  }

  const handleFormClose = () => {
    setShowForm(false)
    setEditingId(null)
    loadData()
  }

  const getRelatedEntityName = (task: Task) => {
    if (task.deal_id && task.deal) {
      return `Deal: ${task.deal.property?.address || 'Unknown'}`
    }
    if (task.contact_id && task.contact) {
      return `Contact: ${task.contact.first_name} ${task.contact.last_name}`
    }
    if (task.customer_id && task.customer) {
      return `Customer: ${task.customer.company_name}`
    }
    return '-'
  }

  const isOverdue = (task: Task) => {
    if (!task.due_date || task.status === 'completed') return false
    return new Date(task.due_date) < new Date()
  }

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = `${task.title} ${task.description || ''}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())

    const matchesStatus = selectedStatus === 'all' || task.status === selectedStatus
    const matchesAssignee = selectedAssignee === 'all' || task.assigned_to === selectedAssignee

    return matchesSearch && matchesStatus && matchesAssignee
  })

  const overdueTasks = filteredTasks.filter(isOverdue)
  const activeTasks = filteredTasks.filter(t => t.status !== 'completed')
  const completedTasks = filteredTasks.filter(t => t.status === 'completed')

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-gray-900">Tasks</h1>
          <p className="text-gray-600 text-sm">Manage follow-up tasks and team assignments</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-600 font-medium mb-1">Total Tasks</p>
            <p className="text-3xl font-bold text-gray-900">{filteredTasks.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-600 font-medium mb-1">Active Tasks</p>
            <p className="text-3xl font-bold text-blue-600">{activeTasks.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-600 font-medium mb-1">Overdue</p>
            <p className="text-3xl font-bold text-red-600">{overdueTasks.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-600 font-medium mb-1">Completed</p>
            <p className="text-3xl font-bold text-green-600">{completedTasks.length}</p>
          </div>
        </div>

        {/* Filters and Create Button */}
        <div className="mb-6 flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="Search by title or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
          />
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as TaskStatus | 'all')}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
          <select
            value={selectedAssignee}
            onChange={(e) => setSelectedAssignee(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
          >
            <option value="all">All Assignees</option>
            {users.map(user => (
              <option key={user.id} value={user.id}>
                {user.first_name} {user.last_name}
              </option>
            ))}
          </select>
          <button
            onClick={() => {
              setEditingId(null)
              setShowForm(!showForm)
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium whitespace-nowrap"
          >
            {showForm ? 'Cancel' : '+ New Task'}
          </button>
        </div>

        {/* Form */}
        {showForm && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              {editingId ? 'Edit Task' : 'New Task'}
            </h2>
            <TaskForm
              taskId={editingId || undefined}
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
            <p className="mt-4 text-gray-600">Loading tasks...</p>
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-600 text-lg">No tasks found</p>
            <p className="text-gray-500 text-sm mt-2">Create your first task to get started</p>
          </div>
        ) : (
          <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Assigned To</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Due Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Linked To</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredTasks.map(task => {
                  const overdue = isOverdue(task)
                  return (
                    <tr
                      key={task.id}
                      className={overdue && task.status !== 'completed' ? 'bg-red-50 hover:bg-red-100' : 'hover:bg-gray-50'}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {task.title}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {task.assigned_to_user
                          ? `${task.assigned_to_user.first_name} ${task.assigned_to_user.last_name}`
                          : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          task.status === 'completed'
                            ? 'bg-green-100 text-green-800'
                            : overdue
                            ? 'bg-red-100 text-red-800'
                            : task.status === 'in_progress'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-orange-100 text-orange-800'
                        }`}>
                          {task.status === 'in_progress' ? 'In Progress' : task.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {task.due_date ? (
                          <div>
                            <p>{new Date(task.due_date).toLocaleDateString()}</p>
                            {overdue && task.status !== 'completed' && (
                              <p className="text-red-600 text-xs font-medium">OVERDUE</p>
                            )}
                          </div>
                        ) : (
                          '-'
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {getRelatedEntityName(task)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                        <button
                          onClick={() => {
                            setEditingId(task.id)
                            setShowForm(true)
                          }}
                          className="text-blue-600 hover:text-blue-700 font-medium"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(task.id)}
                          className="text-red-600 hover:text-red-700 font-medium"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  )
}
