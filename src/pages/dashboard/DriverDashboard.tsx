/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import type { RootState } from '@/store/store'
import { getAllRents } from '@/store/slices/rentSlice'
import { getAllBids } from '@/store/slices/bidSlice'
import { DollarSign, Car, Clock, CheckCircle, TrendingUp } from 'lucide-react'

export default function DriverDashboard() {
  const dispatch = useDispatch()
  const { user } = useSelector((state: RootState) => state.auth)
  const { rents, loading: rentsLoading } = useSelector((state: RootState) => state.rent)
  const { bids, loading: bidsLoading } = useSelector((state: RootState) => state.bid)

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    dispatch(getAllRents())
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    dispatch(getAllBids())
  }, [dispatch])

  // Filter data for current driver
  const myBids = bids.filter((bid: any) => bid.driverId?._id === user?._id)
  const acceptedBids = myBids.filter((bid: any) => bid.bidStatus === 'accepted')
  const pendingBids = myBids.filter((bid: any) => bid.bidStatus === 'pending')
  
  // Calculate earnings
  const totalEarnings = acceptedBids.reduce((sum: number, bid: any) => sum + (bid.bidAmount || 0), 0)

  // Available rents (pending rents that driver hasn't bid on yet)
  const availableRents = rents.filter((rent: any) => 
    rent.rentStatus === 'pending' && 
    !myBids.some((bid: any) => bid.rentId?._id === rent._id)
  )

  const stats = [
    {
      title: 'Total Earnings',
      value: `$${totalEarnings.toFixed(2)}`,
      icon: DollarSign,
      color: 'bg-green-50 text-green-600',
      iconBg: 'bg-green-100'
    },
    {
      title: 'Active Jobs',
      value: acceptedBids.length,
      icon: Car,
      color: 'bg-blue-50 text-blue-600',
      iconBg: 'bg-blue-100'
    },
    {
      title: 'Pending Bids',
      value: pendingBids.length,
      icon: Clock,
      color: 'bg-yellow-50 text-yellow-600',
      iconBg: 'bg-yellow-100'
    },
    {
      title: 'Available Jobs',
      value: availableRents.length,
      icon: TrendingUp,
      color: 'bg-purple-50 text-purple-600',
      iconBg: 'bg-purple-100'
    }
  ]

  if (rentsLoading || bidsLoading) {
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
        <h1 className="text-2xl font-bold text-gray-800">Driver Dashboard</h1>
        <p className="text-gray-600">Welcome back, {user?.name}!</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className={`${stat.color} rounded-lg p-6 border border-purple-100`}>
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.iconBg} p-3 rounded-lg`}>
                <stat.icon className="h-6 w-6" />
              </div>
            </div>
            <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
            <p className="text-2xl font-bold">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Jobs */}
        <div className="bg-white rounded-lg border border-purple-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Active Jobs</h2>
            <CheckCircle className="h-5 w-5 text-green-600" />
          </div>
          
          {acceptedBids.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No active jobs</p>
          ) : (
            <div className="space-y-3">
              {acceptedBids.slice(0, 5).map((bid: any) => (
                <div key={bid._id} className="p-4 bg-green-50 rounded-lg border border-green-100">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-medium text-gray-800">
                        {bid.rentId?.car?.name || 'N/A'}
                      </p>
                      <p className="text-sm text-gray-600">
                        From: {bid.rentId?.startingPoint}
                      </p>
                      <p className="text-sm text-gray-600">
                        To: {bid.rentId?.destination}
                      </p>
                    </div>
                    <span className="text-sm font-semibold text-green-700">
                      ${bid.bidAmount}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pending Bids */}
        <div className="bg-white rounded-lg border border-purple-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Pending Bids</h2>
            <Clock className="h-5 w-5 text-yellow-600" />
          </div>
          
          {pendingBids.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No pending bids</p>
          ) : (
            <div className="space-y-3">
              {pendingBids.slice(0, 5).map((bid: any) => (
                <div key={bid._id} className="p-4 bg-yellow-50 rounded-lg border border-yellow-100">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-medium text-gray-800">
                        {bid.rentId?.car?.name || 'N/A'}
                      </p>
                      <p className="text-sm text-gray-600">
                        From: {bid.rentId?.startingPoint}
                      </p>
                      <p className="text-sm text-gray-600">
                        To: {bid.rentId?.destination}
                      </p>
                    </div>
                    <span className="text-sm font-semibold text-yellow-700">
                      ${bid.bidAmount}
                    </span>
                  </div>
                  <span className="text-xs text-yellow-600 font-medium">
                    Awaiting Response
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