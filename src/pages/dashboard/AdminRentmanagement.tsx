// pages/dashboard/AdminRentManagement.tsx
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Car, MapPin, Clock, CheckCircle, XCircle, AlertCircle, Trash2, Edit, X, Users } from 'lucide-react'
import type { RootState } from '@/store/store'
import { getAllRents, updateRent, deleteRent } from '@/store/slices/rentSlice'

function AdminRentManagement() {
  const dispatch = useDispatch()
  const { rents, loading, error } = useSelector((state: RootState) => state.rent)
  const { user } = useSelector((state: RootState) => state.auth)

  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [editingRent, setEditingRent] = useState<any>(null)
  const [editForm, setEditForm] = useState({
    startingPoint: '',
    destination: ''
  })

  useEffect(() => {
    if (user?.role === 'admin') {
      dispatch(getAllRents())
    }
  }, [dispatch, user])

  const handleEditClick = (rent: any) => {
    setEditingRent(rent)
    setEditForm({
      startingPoint: rent.startingPoint,
      destination: rent.destination
    })
  }

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingRent) return

    if (!window.confirm('Are you sure you want to update this rental?')) {
      return
    }

    setUpdatingId(editingRent._id)
    try {
      await dispatch(updateRent({ 
        id: editingRent._id, 
        data: { 
          startingPoint: editForm.startingPoint,
          destination: editForm.destination
        } 
      }))
      dispatch(getAllRents())
      setEditingRent(null)
    } catch (error) {
      console.error('Failed to update rent:', error)
    } finally {
      setUpdatingId(null)
    }
  }

  const handleStatusUpdate = async (rentId: string, newStatus: 'ongoing' | 'completed' | 'pending') => {
    if (!window.confirm(`Change status to ${newStatus}?`)) {
      return
    }
    
    setUpdatingId(rentId)
    try {
      await dispatch(updateRent({ id: rentId, data: { rentStatus: newStatus } }))
      dispatch(getAllRents())
    } catch (error) {
      console.error('Failed to update rent:', error)
    } finally {
      setUpdatingId(null)
    }
  }

  const handleDelete = async (rentId: string) => {
    if (!window.confirm('Are you sure you want to delete this rental?')) {
      return
    }
    
    setDeletingId(rentId)
    try {
      await dispatch(deleteRent(rentId))
      dispatch(getAllRents())
    } catch (error) {
      console.error('Failed to delete rent:', error)
    } finally {
      setDeletingId(null)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'ongoing':
        return 'bg-blue-100 text-blue-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4" />
      case 'ongoing':
        return <Clock className="h-4 w-4" />
      case 'pending':
        return <AlertCircle className="h-4 w-4" />
      default:
        return <XCircle className="h-4 w-4" />
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-800 mb-2">Error loading rentals</h3>
        <p className="text-gray-600">{error}</p>
      </div>
    )
  }

  // Calculate stats
  const totalRentals = rents.length
  const pendingRentals = rents.filter(r => r.rentStatus === 'pending').length
  const ongoingRentals = rents.filter(r => r.rentStatus === 'ongoing').length
  const completedRentals = rents.filter(r => r.rentStatus === 'completed').length
  const uniqueUsers = [...new Set(rents.map(rent => 
    typeof rent.user === 'object' ? rent.user._id : rent.user
  ))].length

  return (
    <>
      {/* Edit Modal */}
      {editingRent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">Edit Rental Destination</h2>
                <button
                  onClick={() => setEditingRent(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleEditSubmit}>
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-4">Rental Information</h3>
                  <div className="space-y-3">
                    <div className="text-sm">
                      <span className="font-medium text-gray-500">User:</span>
                      <span className="ml-2 text-gray-800">
                        {typeof editingRent.user === 'object' ? editingRent.user?.email : 'User'}
                      </span>
                    </div>
                    <div className="text-sm">
                      <span className="font-medium text-gray-500">Car:</span>
                      <span className="ml-2 text-gray-800">
                        {typeof editingRent.car === 'object' ? 
                          `${editingRent.car.name} - ${editingRent.car.brand} ${editingRent.car.model}` : 
                          'Car Details'}
                      </span>
                    </div>
                    <div className="text-sm">
                      <span className="font-medium text-gray-500">Status:</span>
                      <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(editingRent.rentStatus)}`}>
                        {editingRent.rentStatus.charAt(0).toUpperCase() + editingRent.rentStatus.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-purple-500" />
                        Starting Point
                      </div>
                    </label>
                    <input
                      type="text"
                      value={editForm.startingPoint}
                      onChange={(e) => setEditForm({...editForm, startingPoint: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Enter starting location"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-green-500" />
                        Destination
                      </div>
                    </label>
                    <input
                      type="text"
                      value={editForm.destination}
                      onChange={(e) => setEditForm({...editForm, destination: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Enter destination"
                      required
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setEditingRent(null)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={updatingId === editingRent._id}
                    className="px-4 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-md transition-colors disabled:opacity-50"
                  >
                    {updatingId === editingRent._id ? 'Updating...' : 'Update Rental'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">All Rentals Management</h1>
          <p className="text-gray-600">Admin panel to manage all user rentals</p>
        </div>

        {/* Stats Cards - Like MyCars */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg border border-purple-100 shadow-sm p-6">
            <div className="flex items-center">
              <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                <Car className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Rentals</p>
                <p className="text-2xl font-bold text-gray-800">{totalRentals}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-purple-100 shadow-sm p-6">
            <div className="flex items-center">
              <div className="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center mr-4">
                <AlertCircle className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Pending Rentals</p>
                <p className="text-2xl font-bold text-gray-800">{pendingRentals}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-purple-100 shadow-sm p-6">
            <div className="flex items-center">
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Active Rentals</p>
                <p className="text-2xl font-bold text-gray-800">{ongoingRentals}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-purple-100 shadow-sm p-6">
            <div className="flex items-center">
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Completed Rentals</p>
                <p className="text-2xl font-bold text-gray-800">{completedRentals}</p>
              </div>
            </div>
          </div>
        </div>

        {rents.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <Car className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-800 mb-2">No rentals found</h3>
            <p className="text-gray-600">No rentals have been created yet.</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Car Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Route
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {rents.map((rent) => (
                    <tr key={rent._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {typeof rent.user === 'object' ? rent.user?.email : 'User'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                            <Car className="h-5 w-5 text-gray-500" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {typeof rent.car === 'object' ? (
                                <>
                                  {rent.car.name} - {rent.car.brand} {rent.car.model}
                                </>
                              ) : (
                                'Car Details Loading...'
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-4">
                          <div className="text-sm text-gray-600">
                            <div className="font-medium">From:</div>
                            <div>{rent.startingPoint}</div>
                          </div>
                          <div className="text-gray-400">→</div>
                          <div className="text-sm text-gray-600">
                            <div className="font-medium">To:</div>
                            <div>{rent.destination}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(rent.rentStatus)}`}>
                            <span className="mr-1.5">
                              {getStatusIcon(rent.rentStatus)}
                            </span>
                            {rent.rentStatus.charAt(0).toUpperCase() + rent.rentStatus.slice(1)}
                          </span>
                          
                          {/* Status Update Dropdown for Admin */}
                          <select
                            onChange={(e) => handleStatusUpdate(rent._id, e.target.value as any)}
                            disabled={updatingId === rent._id}
                            value={rent.rentStatus}
                            className="text-xs border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-purple-500"
                          >
                            <option value="pending">Pending</option>
                            <option value="ongoing">Ongoing</option>
                            <option value="completed">Completed</option>
                          </select>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEditClick(rent)}
                            className="flex items-center px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white text-xs rounded transition-colors"
                          >
                            <Edit className="h-3 w-3 mr-1" />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(rent._id)}
                            disabled={deletingId === rent._id}
                            className="flex items-center px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs rounded transition-colors disabled:opacity-50"
                          >
                            <Trash2 className="h-3 w-3 mr-1" />
                            {deletingId === rent._id ? 'Deleting...' : 'Delete'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Summary Section - Like MyCars */}
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Total Rentals: <span className="font-semibold">{totalRentals}</span>
                  <span className="mx-4">•</span>
                  Unique Users: <span className="font-semibold">{uniqueUsers}</span>
                </div>
                <div className="flex space-x-4">
                  <div className="text-sm">
                    <span className="inline-flex items-center">
                      <span className="h-3 w-3 bg-yellow-500 rounded-full mr-2"></span>
                      Pending: {pendingRentals}
                    </span>
                  </div>
                  <div className="text-sm">
                    <span className="inline-flex items-center">
                      <span className="h-3 w-3 bg-blue-500 rounded-full mr-2"></span>
                      Ongoing: {ongoingRentals}
                    </span>
                  </div>
                  <div className="text-sm">
                    <span className="inline-flex items-center">
                      <span className="h-3 w-3 bg-green-500 rounded-full mr-2"></span>
                      Completed: {completedRentals}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Additional Stats Card - Only show if there are rentals */}
        {rents.length > 0 && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg border border-purple-100 shadow-sm p-6">
              <div className="flex items-center">
                <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Users</p>
                  <p className="text-2xl font-bold text-gray-800">{uniqueUsers}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-purple-100 shadow-sm p-6">
              <div className="flex items-center">
                <div className="h-12 w-12 bg-indigo-100 rounded-lg flex items-center justify-center mr-4">
                  <Car className="h-6 w-6 text-indigo-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Active Ratio</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {totalRentals > 0 ? Math.round((ongoingRentals / totalRentals) * 100) : 0}%
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default AdminRentManagement