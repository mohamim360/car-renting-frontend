/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import type { RootState } from '@/store/store'
import { getAllRents } from '@/store/slices/rentSlice'
import { getAllBids, updateBid } from '@/store/slices/bidSlice'
import { Car, MapPin, Clock, CheckCircle, User, DollarSign, XCircle } from 'lucide-react'

export default function UserMyBids() {
  const dispatch = useDispatch()
  const { user } = useSelector((state: RootState) => state.auth)
  const { rents, loading: rentsLoading } = useSelector((state: RootState) => state.rent)
  const { bids, loading: bidsLoading } = useSelector((state: RootState) => state.bid)

  const [selectedRent, setSelectedRent] = useState<any>(null)
  const [showBidsModal, setShowBidsModal] = useState(false)

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    dispatch(getAllRents())
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    dispatch(getAllBids())
  }, [dispatch])

  // Filter rents for current user
  const myRents = rents.filter((rent: any) => rent.user?._id === user?._id)

  // Get bids for a specific rent
  const getBidsForRent = (rentId: string) => {
    return bids.filter((bid: any) => 
      (bid.rentId?._id === rentId || bid.rentId === rentId)
    )
  }

  const handleAcceptBid = async (bidId: string) => {
    const result = await dispatch(updateBid({
      id: bidId,
      data: { bidStatus: 'accepted' }
    }) as any)

    if (updateBid.fulfilled.match(result)) {
      // Refresh data
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
      dispatch(getAllRents())
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
      dispatch(getAllBids())
      setShowBidsModal(false)
      setSelectedRent(null)
    }
  }

  const handleRejectBid = async (bidId: string) => {
    const result = await dispatch(updateBid({
      id: bidId,
      data: { bidStatus: 'rejected' }
    }) as any)

    if (updateBid.fulfilled.match(result)) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
      dispatch(getAllBids())
    }
  }

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'pending':
        return {
          color: 'bg-yellow-50 border-yellow-200',
          textColor: 'text-yellow-700',
          icon: Clock,
          iconColor: 'text-yellow-600',
          label: 'Pending'
        }
      case 'ongoing':
        return {
          color: 'bg-blue-50 border-blue-200',
          textColor: 'text-blue-700',
          icon: Car,
          iconColor: 'text-blue-600',
          label: 'Ongoing'
        }
      case 'completed':
        return {
          color: 'bg-green-50 border-green-200',
          textColor: 'text-green-700',
          icon: CheckCircle,
          iconColor: 'text-green-600',
          label: 'Completed'
        }
      default:
        return {
          color: 'bg-gray-50 border-gray-200',
          textColor: 'text-gray-700',
          icon: Clock,
          iconColor: 'text-gray-600',
          label: 'Unknown'
        }
    }
  }

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
        <h1 className="text-2xl font-bold text-gray-800">My Rentals</h1>
        <p className="text-gray-600">Manage your rental requests and view driver bids</p>
      </div>

      {/* Rentals Grid */}
      {myRents.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-purple-100">
          <Car className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-800 mb-2">No Rentals Yet</h3>
          <p className="text-gray-600">Start by renting a car to see your requests here</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myRents.map((rent: any) => {
            const statusConfig = getStatusConfig(rent.rentStatus)
            const StatusIcon = statusConfig.icon
            const rentBids = getBidsForRent(rent._id)
            const pendingBids = rentBids.filter((bid: any) => bid.bidStatus === 'pending')

            return (
              <div key={rent._id} className={`${statusConfig.color} rounded-lg border p-6`}>
                {/* Status Badge */}
                <div className="flex items-center justify-between mb-4">
                  <div className={`flex items-center gap-2 px-3 py-1 rounded-full`}>
                    <StatusIcon className={`h-4 w-4 ${statusConfig.iconColor}`} />
                    <span className={`text-sm font-medium ${statusConfig.textColor}`}>
                      {statusConfig.label}
                    </span>
                  </div>
                  {pendingBids.length > 0 && (
                    <span className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded-full font-medium">
                      {pendingBids.length} {pendingBids.length === 1 ? 'Bid' : 'Bids'}
                    </span>
                  )}
                </div>

                {/* Car Info */}
                <div className="mb-4">
                  {rent.car?.image && (
                    <img 
                      src={rent.car.image} 
                      alt={rent.car.name}
                      className="w-full h-40 object-cover rounded-lg mb-3"
                    />
                  )}
                  <h3 className="font-semibold text-gray-800">
                    {rent.car?.name || 'N/A'}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {rent.car?.brand} {rent.car?.model}
                  </p>
                </div>

                {/* Route Info */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-green-600 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-600">From</p>
                      <p className="text-sm font-medium text-gray-800">{rent.startingPoint}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-red-600 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-600">To</p>
                      <p className="text-sm font-medium text-gray-800">{rent.destination}</p>
                    </div>
                  </div>
                </div>

                {/* Driver Info (if assigned) */}
                {rent.driver && (
                  <div className="mb-4 p-3 bg-white rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Driver Assigned</p>
                    <p className="text-sm font-medium text-gray-800">{rent.driver.name}</p>
                    {rent.driver.rating > 0 && (
                      <p className="text-xs text-gray-600">★ {rent.driver.rating}</p>
                    )}
                  </div>
                )}

                {/* View Bids Button */}
                {rent.rentStatus === 'pending' && rentBids.length > 0 && (
                  <button
                    onClick={() => {
                      setSelectedRent(rent)
                      setShowBidsModal(true)
                    }}
                    className="w-full py-2 px-4 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors"
                  >
                    View {rentBids.length} {rentBids.length === 1 ? 'Bid' : 'Bids'}
                  </button>
                )}

                {rent.rentStatus === 'pending' && rentBids.length === 0 && (
                  <div className="text-center py-2 text-sm text-gray-500">
                    Waiting for driver bids...
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Bids Modal */}
      {showBidsModal && selectedRent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">Driver Bids</h2>
              <button
                onClick={() => {
                  setShowBidsModal(false)
                  setSelectedRent(null)
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            {/* Selected Rent Info */}
            <div className="mb-6 p-4 bg-purple-50 rounded-lg">
              <p className="font-medium text-gray-800 mb-2">{selectedRent.car?.name}</p>
              <p className="text-sm text-gray-600">
                {selectedRent.startingPoint} → {selectedRent.destination}
              </p>
            </div>

            {/* Bids List */}
            <div className="space-y-4">
              {getBidsForRent(selectedRent._id).map((bid: any) => (
                <div 
                  key={bid._id} 
                  className={`p-4 rounded-lg border ${
                    bid.bidStatus === 'accepted' 
                      ? 'bg-green-50 border-green-200' 
                      : bid.bidStatus === 'rejected'
                      ? 'bg-red-50 border-red-200'
                      : 'bg-white border-gray-200'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <User className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">
                          {bid.driverId?.name || 'Driver'}
                        </p>
                        {bid.driverId?.rating > 0 && (
                          <p className="text-sm text-gray-600">★ {bid.driverId.rating}</p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-lg font-bold text-purple-700">
                        <DollarSign className="h-5 w-5" />
                        {bid.bidAmount}
                      </div>
                    </div>
                  </div>

                  <div className="mb-3">
                    <p className="text-xs text-gray-600 mb-1">Driver Location</p>
                    <p className="text-sm text-gray-800">{bid.driverLocation}</p>
                  </div>

                  {/* Status Badge */}
                  <div className="mb-3">
                    {bid.bidStatus === 'accepted' && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                        <CheckCircle className="h-4 w-4" />
                        Accepted
                      </span>
                    )}
                    {bid.bidStatus === 'rejected' && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
                        <XCircle className="h-4 w-4" />
                        Rejected
                      </span>
                    )}
                    {bid.bidStatus === 'pending' && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium">
                        <Clock className="h-4 w-4" />
                        Pending
                      </span>
                    )}
                  </div>

                  {/* Action Buttons */}
                  {bid.bidStatus === 'pending' && (
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleAcceptBid(bid._id)}
                        className="flex-1 py-2 px-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleRejectBid(bid._id)}
                        className="flex-1 py-2 px-4 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}