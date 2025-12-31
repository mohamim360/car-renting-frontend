import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import type { RootState } from '@/store/store'
import { getAllBids } from '@/store/slices/bidSlice'
import { Clock, CheckCircle, XCircle, DollarSign, MapPin, Car } from 'lucide-react'

export default function DriverMyBids() {
  const dispatch = useDispatch()
  const { user } = useSelector((state: RootState) => state.auth)
  const { bids, loading } = useSelector((state: RootState) => state.bid)

  useEffect(() => {
    dispatch(getAllBids())
  }, [dispatch])

  // Filter bids for current driver
  const myBids = bids.filter((bid: any) => bid.driverId?._id === user?._id)

  // Group bids by status
  const pendingBids = myBids.filter((bid: any) => bid.bidStatus === 'pending')
  const acceptedBids = myBids.filter((bid: any) => bid.bidStatus === 'accepted')
  const rejectedBids = myBids.filter((bid: any) => bid.bidStatus === 'rejected')

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'accepted':
        return {
          color: 'bg-green-50 border-green-200',
          textColor: 'text-green-700',
          icon: CheckCircle,
          iconColor: 'text-green-600',
          label: 'Accepted'
        }
      case 'rejected':
        return {
          color: 'bg-red-50 border-red-200',
          textColor: 'text-red-700',
          icon: XCircle,
          iconColor: 'text-red-600',
          label: 'Rejected'
        }
      default:
        return {
          color: 'bg-yellow-50 border-yellow-200',
          textColor: 'text-yellow-700',
          icon: Clock,
          iconColor: 'text-yellow-600',
          label: 'Pending'
        }
    }
  }

  const renderBidCard = (bid: any) => {
    const statusConfig = getStatusConfig(bid.bidStatus)
    const StatusIcon = statusConfig.icon

    return (
      <div key={bid._id} className={`${statusConfig.color} rounded-lg border p-6`}>
        {/* Status Badge */}
        <div className="flex items-center justify-between mb-4">
          <div className={`flex items-center gap-2 px-3 py-1 ${statusConfig.color} rounded-full`}>
            <StatusIcon className={`h-4 w-4 ${statusConfig.iconColor}`} />
            <span className={`text-sm font-medium ${statusConfig.textColor}`}>
              {statusConfig.label}
            </span>
          </div>
          <span className={`text-lg font-bold ${statusConfig.textColor}`}>
            ${bid.bidAmount}
          </span>
        </div>

        {/* Car Info */}
        <div className="mb-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-white rounded-lg">
              <Car className={`h-5 w-5 ${statusConfig.iconColor}`} />
            </div>
            <div>
              <p className="font-semibold text-gray-800">
                {bid.rentId?.car?.name || 'N/A'}
              </p>
              <p className="text-sm text-gray-600">
                {bid.rentId?.car?.brand} {bid.rentId?.car?.model}
              </p>
            </div>
          </div>
        </div>

        {/* Route Info */}
        <div className="space-y-2 mb-4">
          <div className="flex items-start gap-2">
            <MapPin className="h-4 w-4 text-green-600 mt-0.5" />
            <div>
              <p className="text-xs text-gray-600">From</p>
              <p className="text-sm font-medium text-gray-800">
                {bid.rentId?.startingPoint || 'N/A'}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <MapPin className="h-4 w-4 text-red-600 mt-0.5" />
            <div>
              <p className="text-xs text-gray-600">To</p>
              <p className="text-sm font-medium text-gray-800">
                {bid.rentId?.destination || 'N/A'}
              </p>
            </div>
          </div>
        </div>

        {/* Your Location */}
        <div className="p-3 bg-white rounded-lg">
          <p className="text-xs text-gray-600 mb-1">Your Location</p>
          <p className="text-sm font-medium text-gray-800">{bid.driverLocation}</p>
        </div>

        {/* Customer Info */}
        <div className="mt-3 p-3 bg-white rounded-lg">
          <p className="text-xs text-gray-600 mb-1">Customer</p>
          <p className="text-sm font-medium text-gray-800">
            {bid.rentId?.user?.name || 'N/A'}
          </p>
        </div>
      </div>
    )
  }

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
        <h1 className="text-2xl font-bold text-gray-800">My Bids</h1>
        <p className="text-gray-600">Track all your bid submissions and their status</p>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-700">{pendingBids.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Accepted</p>
              <p className="text-2xl font-bold text-green-700">{acceptedBids.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-red-100 rounded-lg">
              <XCircle className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Rejected</p>
              <p className="text-2xl font-bold text-red-700">{rejectedBids.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* All Bids */}
      {myBids.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-purple-100">
          <DollarSign className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-800 mb-2">No Bids Yet</h3>
          <p className="text-gray-600">Start bidding on available jobs to see them here</p>
        </div>
      ) : (
        <div>
          {/* Pending Bids */}
          {pendingBids.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Pending Bids ({pendingBids.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pendingBids.map(renderBidCard)}
              </div>
            </div>
          )}

          {/* Accepted Bids */}
          {acceptedBids.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Accepted Bids ({acceptedBids.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {acceptedBids.map(renderBidCard)}
              </div>
            </div>
          )}

          {/* Rejected Bids */}
          {rejectedBids.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Rejected Bids ({rejectedBids.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rejectedBids.map(renderBidCard)}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}