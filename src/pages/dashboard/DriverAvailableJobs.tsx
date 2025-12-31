import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import type { RootState } from '@/store/store'
import { getAllRents } from '@/store/slices/rentSlice'
import { getAllBids, createBid } from '@/store/slices/bidSlice'
import { MapPin, Car, DollarSign, Clock } from 'lucide-react'

export default function DriverAvailableJobs() {
  const dispatch = useDispatch()
  const { user } = useSelector((state: RootState) => state.auth)
  const { rents, loading: rentsLoading } = useSelector((state: RootState) => state.rent)
  const { bids, loading: bidsLoading } = useSelector((state: RootState) => state.bid)

  const [selectedRent, setSelectedRent] = useState<any>(null)
  const [bidAmount, setBidAmount] = useState('')
  const [driverLocation, setDriverLocation] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    dispatch(getAllRents())
    dispatch(getAllBids())
  }, [dispatch])

  // Filter available jobs (pending rents that driver hasn't bid on)
  const myBids = bids.filter((bid: any) => bid.driverId?._id === user?._id)
  const availableRents = rents.filter((rent: any) => 
    rent.rentStatus === 'pending' && 
    !myBids.some((bid: any) => bid.rentId?._id === rent._id || bid.rentId === rent._id)
  )

  const handleBidSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedRent || !bidAmount || !driverLocation) {
      return
    }

    setIsSubmitting(true)
    
    try {
      const result = await dispatch(createBid({
        rentId: selectedRent._id,
        driverId: user?._id,
        bidAmount: parseFloat(bidAmount),
        driverLocation,
        bidStatus: 'pending'
      }) as any)

      if (createBid.fulfilled.match(result)) {
        setSuccessMessage('Bid submitted successfully!')
        setSelectedRent(null)
        setBidAmount('')
        setDriverLocation('')
        
        // Refresh data
        dispatch(getAllRents())
        dispatch(getAllBids())
        
        setTimeout(() => setSuccessMessage(''), 3000)
      }
    } catch (error) {
      console.error('Error submitting bid:', error)
    } finally {
      setIsSubmitting(false)
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
        <h1 className="text-2xl font-bold text-gray-800">Available Jobs</h1>
        <p className="text-gray-600">Browse and bid on available rental requests</p>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
          {successMessage}
        </div>
      )}

      {/* Jobs Grid */}
      {availableRents.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-purple-100">
          <Car className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-800 mb-2">No Available Jobs</h3>
          <p className="text-gray-600">Check back later for new rental requests</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {availableRents.map((rent: any) => (
            <div key={rent._id} className="bg-white rounded-lg border border-purple-100 p-6 hover:shadow-lg transition-shadow">
              {/* Car Info */}
              <div className="mb-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Car className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      {rent.car?.name || 'N/A'}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {rent.car?.brand} {rent.car?.model}
                    </p>
                  </div>
                </div>
                
                {rent.car?.image && (
                  <img 
                    src={rent.car.image} 
                    alt={rent.car.name}
                    className="w-full h-40 object-cover rounded-lg mb-3"
                  />
                )}
              </div>

              {/* Route Info */}
              <div className="space-y-2 mb-4">
                <div className="flex items-start gap-2">
                  <MapPin className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500">Starting Point</p>
                    <p className="text-sm font-medium text-gray-800">{rent.startingPoint}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <MapPin className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500">Destination</p>
                    <p className="text-sm font-medium text-gray-800">{rent.destination}</p>
                  </div>
                </div>
              </div>

              {/* Customer Info */}
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">Customer</p>
                <p className="text-sm font-medium text-gray-800">{rent.user?.name || 'N/A'}</p>
              </div>

              {/* Action Button */}
              <button
                onClick={() => setSelectedRent(rent)}
                className="w-full py-2 px-4 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors"
              >
                Place Bid
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Bid Modal */}
      {selectedRent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Place Your Bid</h2>
            
            <div className="mb-4 p-4 bg-purple-50 rounded-lg">
              <p className="font-medium text-gray-800 mb-2">{selectedRent.car?.name}</p>
              <p className="text-sm text-gray-600">
                {selectedRent.startingPoint} → {selectedRent.destination}
              </p>
            </div>

            <form onSubmit={handleBidSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-purple-600" />
                    Bid Amount ($)
                  </div>
                </label>
                <input
                  type="number"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  min="1"
                  step="0.01"
                  required
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none"
                  placeholder="Enter your bid amount"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-purple-600" />
                    Your Current Location
                  </div>
                </label>
                <input
                  type="text"
                  value={driverLocation}
                  onChange={(e) => setDriverLocation(e.target.value)}
                  required
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none"
                  placeholder="Enter your location"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedRent(null)
                    setBidAmount('')
                    setDriverLocation('')
                  }}
                  className="flex-1 py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-2 px-4 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Bid'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}