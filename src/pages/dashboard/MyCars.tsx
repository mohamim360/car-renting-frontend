import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Car, MapPin, Clock, CheckCircle, XCircle, AlertCircle, Trash2 } from 'lucide-react'
import type { RootState } from '@/store/store'
import { getAllRents, deleteRent } from '@/store/slices/rentSlice'

function MyCars() {
  const dispatch = useDispatch()
  const { rents, loading, error } = useSelector((state: RootState) => state.rent)
  const { user } = useSelector((state: RootState) => state.auth)

  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      dispatch(getAllRents())
    }
  }, [dispatch, user])

  const handleDelete = async (rentId: string) => {
    if (!window.confirm('Are you sure you want to delete this rental? This action cannot be undone.')) {
      return
    }
    
    setDeletingId(rentId)
    try {
      await dispatch(deleteRent(rentId))
      // Refresh the list
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

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">My Rentals</h1>
        <p className="text-gray-600">View all your car rental history and current rentals</p>
      </div>

      {rents.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <Car className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-800 mb-2">No rentals found</h3>
          <p className="text-gray-600">You haven't rented any cars yet.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
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
                          {typeof rent.car === 'object' && (
                            <div className="text-sm text-gray-500">
                              {rent.car.color} • {rent.car.fuelType}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <MapPin className="h-4 w-4 text-purple-500 mr-2" />
                          <div>
                            <div className="font-medium">From</div>
                            <div>{rent.startingPoint}</div>
                          </div>
                        </div>
                        <div className="text-gray-400">→</div>
                        <div className="flex items-center text-sm text-gray-600">
                          <MapPin className="h-4 w-4 text-green-500 mr-2" />
                          <div>
                            <div className="font-medium">To</div>
                            <div>{rent.destination}</div>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(rent.rentStatus)}`}>
                          <span className="mr-1.5">
                            {getStatusIcon(rent.rentStatus)}
                          </span>
                          {rent.rentStatus.charAt(0).toUpperCase() + rent.rentStatus.slice(1)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleDelete(rent._id)}
                        disabled={deletingId === rent._id}
                        className="flex items-center px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs rounded disabled:opacity-50"
                      >
                        <Trash2 className="h-3 w-3 mr-1" />
                        {deletingId === rent._id ? 'Deleting...' : 'Delete'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Summary */}
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Total Rentals: <span className="font-semibold">{rents.length}</span>
              </div>
              <div className="flex space-x-4">
                <div className="text-sm">
                  <span className="inline-flex items-center">
                    <span className="h-3 w-3 bg-yellow-500 rounded-full mr-2"></span>
                    Pending: {rents.filter(r => r.rentStatus === 'pending').length}
                  </span>
                </div>
                <div className="text-sm">
                  <span className="inline-flex items-center">
                    <span className="h-3 w-3 bg-blue-500 rounded-full mr-2"></span>
                    Ongoing: {rents.filter(r => r.rentStatus === 'ongoing').length}
                  </span>
                </div>
                <div className="text-sm">
                  <span className="inline-flex items-center">
                    <span className="h-3 w-3 bg-green-500 rounded-full mr-2"></span>
                    Completed: {rents.filter(r => r.rentStatus === 'completed').length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      {rents.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                <Clock className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Active Rentals</p>
                <p className="text-2xl font-bold text-gray-800">
                  {rents.filter(r => r.rentStatus === 'ongoing').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center mr-4">
                <AlertCircle className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Pending Rentals</p>
                <p className="text-2xl font-bold text-gray-800">
                  {rents.filter(r => r.rentStatus === 'pending').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Completed Rentals</p>
                <p className="text-2xl font-bold text-gray-800">
                  {rents.filter(r => r.rentStatus === 'completed').length}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MyCars