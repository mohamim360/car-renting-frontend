import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import type { RootState } from '@/store/store'
import { getAllCars } from '@/store/slices/carSlice'
import { getAllUsers } from '@/store/slices/userSlice'
import { getAllRents } from '@/store/slices/rentSlice'
import { getAllBids } from '@/store/slices/bidSlice'
import { Car, Users, FileText, DollarSign, TrendingUp, Clock, CheckCircle } from 'lucide-react'

export default function AdminDashboard() {
  const dispatch = useDispatch()
  
  const { cars, loading: carsLoading } = useSelector((state: RootState) => state.car)
  const { users, loading: usersLoading } = useSelector((state: RootState) => state.user)
  const { rents, loading: rentsLoading } = useSelector((state: RootState) => state.rent)
  const { bids, loading: bidsLoading } = useSelector((state: RootState) => state.bid)

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    dispatch(getAllCars())
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    dispatch(getAllUsers())
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    dispatch(getAllRents())
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    dispatch(getAllBids())
  }, [dispatch])

  const loading = carsLoading || usersLoading || rentsLoading || bidsLoading

  // Calculate statistics
  const totalCars = cars.length
  const totalUsers = users.length
  const adminCount = users.filter(u => u.role === 'admin').length
  const driverCount = users.filter(u => u.role === 'driver').length
  const customerCount = users.filter(u => u.role === 'user').length
  
  const totalRents = rents.length
  const pendingRents = rents.filter(r => r.rentStatus === 'pending').length
  const ongoingRents = rents.filter(r => r.rentStatus === 'ongoing').length
  const completedRents = rents.filter(r => r.rentStatus === 'completed').length
  
  const totalBids = bids.length
  const pendingBids = bids.filter(b => b.bidStatus === 'pending').length
  const acceptedBids = bids.filter(b => b.bidStatus === 'accepted');
  console.log(acceptedBids);
  const totalRevenue = acceptedBids.reduce(
    (sum: number, bid: { bidAmount?: number }) => sum + (bid.bidAmount || 0),
    0
  );

  const stats = [
    {
      title: 'Total Revenue',
      value: `$${totalRevenue.toFixed(2)}`,
      icon: DollarSign,
      color: 'bg-green-50 border-green-200 text-green-700',
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600'
    },
    {
      title: 'Total Cars',
      value: totalCars,
      icon: Car,
      color: 'bg-blue-50 border-blue-200 text-blue-700',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600'
    },
    {
      title: 'Total Users',
      value: totalUsers,
      icon: Users,
      color: 'bg-purple-50 border-purple-200 text-purple-700',
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600'
    },
    {
      title: 'Total Rentals',
      value: totalRents,
      icon: FileText,
      color: 'bg-orange-50 border-orange-200 text-orange-700',
      iconBg: 'bg-orange-100',
      iconColor: 'text-orange-600'
    }
  ]

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
        <p className="text-gray-600">Overview of your car rental system</p>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className={`${stat.color} rounded-lg border p-6`}>
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.iconBg} p-3 rounded-lg`}>
                <stat.icon className={`h-6 w-6 ${stat.iconColor}`} />
              </div>
            </div>
            <p className="text-sm font-medium mb-1">{stat.title}</p>
            <p className="text-3xl font-bold">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Detailed Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Users Breakdown */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Users Breakdown</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700">Admins</span>
              <span className="text-lg font-bold text-red-700">{adminCount}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700">Drivers</span>
              <span className="text-lg font-bold text-blue-700">{driverCount}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700">Customers</span>
              <span className="text-lg font-bold text-gray-700">{customerCount}</span>
            </div>
          </div>
        </div>

        {/* Rentals Status */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Rentals Status</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-yellow-600" />
                <span className="text-sm font-medium text-gray-700">Pending</span>
              </div>
              <span className="text-lg font-bold text-yellow-700">{pendingRents}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-gray-700">Ongoing</span>
              </div>
              <span className="text-lg font-bold text-blue-700">{ongoingRents}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-gray-700">Completed</span>
              </div>
              <span className="text-lg font-bold text-green-700">{completedRents}</span>
            </div>
          </div>
        </div>

        {/* Bids Overview */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Bids Overview</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700">Total Bids</span>
              <span className="text-lg font-bold text-purple-700">{totalBids}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700">Pending</span>
              <span className="text-lg font-bold text-yellow-700">{pendingBids}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700">Accepted</span>
              <span className="text-lg font-bold text-green-700">{typeof acceptedBids === 'number' ? acceptedBids : Array.isArray(acceptedBids) ? acceptedBids.length : 0}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link
            to="/dashboard/admin/cars-management"
            className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-purple-50 hover:border-purple-300 transition-colors"
          >
            <div className="p-2 bg-blue-100 rounded-lg">
              <Car className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="font-medium text-gray-800">Manage Cars</p>
              <p className="text-sm text-gray-600">Add, edit, or remove cars</p>
            </div>
          </Link>

          <Link
            to="/dashboard/admin/users-management"
            className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-purple-50 hover:border-purple-300 transition-colors"
          >
            <div className="p-2 bg-purple-100 rounded-lg">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="font-medium text-gray-800">Manage Users</p>
              <p className="text-sm text-gray-600">Add, edit, or remove users</p>
            </div>
          </Link>

          <Link
            to="/dashboard/admin/rents-management"
            className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-purple-50 hover:border-purple-300 transition-colors"
          >
        
            <div className="p-2 bg-orange-100 rounded-lg">
              <FileText className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <p className="font-medium text-gray-800">View All Rentals</p>
              <p className="text-sm text-gray-600">{totalRents} total rentals</p>
            </div>
          
          </Link>

        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Rentals */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Rentals</h2>
          {rents.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No rentals yet</p>
          ) : (
            <div className="space-y-3">
              {rents.slice(0, 5).map((rent) => (
                <div key={rent._id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800">
                      {rent.car?.name || 'Car'}
                    </p>
                    <p className="text-xs text-gray-600">
                      {rent.user?.name || 'User'} • {rent.startingPoint} → {rent.destination}
                    </p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    rent.rentStatus === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                    rent.rentStatus === 'ongoing' ? 'bg-blue-100 text-blue-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {rent.rentStatus}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Bids */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Bids</h2>
          {bids.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No bids yet</p>
          ) : (
            <div className="space-y-3">
              {bids.slice(0, 5).map((bid) => (
                <div key={bid._id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800">
                      ${bid.bidAmount}
                    </p>
                    <p className="text-xs text-gray-600">
                      {bid.driverId?.name || 'Driver'} • {bid.driverLocation}
                    </p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    bid.bidStatus === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                    bid.bidStatus === 'accepted' ? 'bg-green-100 text-green-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {bid.bidStatus}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}