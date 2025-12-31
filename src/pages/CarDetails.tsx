import { useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Car, Fuel, Users, Star, Palette, ArrowLeft, Calendar, Gauge, Shield, MapPin, CreditCard } from 'lucide-react'
import type { RootState } from '@/store/store'
import { getCarById } from '@/store/slices/carSlice'

export default function CarDetails() {
  const { id } = useParams()
  const dispatch = useDispatch()
  const { currentCar, loading, error } = useSelector((state: RootState) => state.car)

  useEffect(() => {
    if (id) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      dispatch(getCarById(id))
    }
  }, [dispatch, id])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-10">
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading car details...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !currentCar) {
    return (
      <div className="container mx-auto px-4 py-10">
        <div className="max-w-md mx-auto text-center">
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 mb-6">
            <Car className="h-20 w-20 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Car not found</h2>
            <p className="text-gray-600">{error || 'The requested car does not exist.'}</p>
          </div>
          <Link
            to="/cars"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all"
          >
            <ArrowLeft className="h-5 w-5" />
            Back to Cars
          </Link>
        </div>
      </div>
    )
  }

  const fuelTypeColors: Record<string, { bg: string; text: string }> = {
    'Octane': { bg: 'bg-gradient-to-r from-red-500 to-orange-500', text: 'text-white' },
    'Hybrid': { bg: 'bg-gradient-to-r from-green-500 to-emerald-500', text: 'text-white' },
    'Electric': { bg: 'bg-gradient-to-r from-blue-500 to-cyan-500', text: 'text-white' },
    'Diesel': { bg: 'bg-gradient-to-r from-yellow-500 to-amber-500', text: 'text-gray-900' },
    'Petrol': { bg: 'bg-gradient-to-r from-orange-500 to-red-500', text: 'text-white' }
  }

  const getStatusColor = (condition: string) => {
    return condition === 'New' 
      ? 'bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-800 border border-emerald-200'
      : 'bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-800 border border-blue-200'
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header with Breadcrumb */}
        <div className="mb-8">
          <nav className="flex items-center gap-2 text-sm mb-4">
            <Link to="/" className="text-gray-500 hover:text-purple-600 transition-colors">Home</Link>
            <span className="text-gray-300">/</span>
            <Link to="/cars" className="text-gray-500 hover:text-purple-600 transition-colors">Cars</Link>
            <span className="text-gray-300">/</span>
            <span className="text-purple-600 font-medium truncate">{currentCar.name}</span>
          </nav>
          
          
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Image & Highlights */}
          <div className="lg:col-span-2">
            {/* Image Container */}
            <div className="bg-gradient-to-br from-gray-100 to-white rounded-2xl overflow-hidden shadow-xl border border-gray-200 mb-8">
              <div className="relative h-72 md:h-96 w-full">
                {currentCar.image ? (
                  <img 
                    src={currentCar.image} 
                    alt={currentCar.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50">
                    <Car className="h-32 w-32 text-purple-300 mb-4" />
                    <p className="text-gray-400 text-lg">No image available</p>
                  </div>
                )}
                {/* Condition Badge */}
                <div className="absolute top-4 left-4">
                  <span className={`px-4 py-2 font-semibold rounded-xl shadow-lg ${getStatusColor(currentCar.condition)}`}>
                    {currentCar.condition} Car
                  </span>
                </div>
              </div>
            </div>

            {/* Features Grid */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
              <h2 className="text-xl font-bold text-gray-800 mb-6 pb-4 border-b border-gray-100">
                <span className="bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
                  Key Features
                </span>
              </h2>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-purple-50 to-white p-4 rounded-xl border border-purple-100">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg">
                      <Fuel className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-sm text-gray-500">Fuel Type</span>
                  </div>
                  <p className="text-lg font-semibold text-gray-800">{currentCar.fuelType}</p>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-white p-4 rounded-xl border border-blue-100">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg">
                      <Users className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-sm text-gray-500">Capacity</span>
                  </div>
                  <p className="text-lg font-semibold text-gray-800">{currentCar.passengerCapacity} Persons</p>
                </div>

                <div className="bg-gradient-to-br from-pink-50 to-white p-4 rounded-xl border border-pink-100">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-gradient-to-r from-pink-500 to-rose-500 rounded-lg">
                      <Palette className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-sm text-gray-500">Color</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-6 h-6 rounded-full border border-gray-300"
                      style={{ backgroundColor: currentCar.color?.toLowerCase() }}
                    />
                    <p className="text-lg font-semibold text-gray-800">{currentCar.color}</p>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-emerald-50 to-white p-4 rounded-xl border border-emerald-100">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-gradient-to-r from-emerald-500 to-green-500 rounded-lg">
                      <Gauge className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-sm text-gray-500">Mileage</span>
                  </div>
                  <p className="text-lg font-semibold text-gray-800">Excellent</p>
                </div>

                <div className="bg-gradient-to-br from-amber-50 to-white p-4 rounded-xl border border-amber-100">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg">
                      <Shield className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-sm text-gray-500">Safety</span>
                  </div>
                  <p className="text-lg font-semibold text-gray-800">5-Star Rated</p>
                </div>

                <div className="bg-gradient-to-br from-indigo-50 to-white p-4 rounded-xl border border-indigo-100">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg">
                      <Calendar className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-sm text-gray-500">Year</span>
                  </div>
                  <p className="text-lg font-semibold text-gray-800">2024</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Details & Actions */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                {/* Header */}
                <div className="p-6 border-b border-gray-100">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-1">
                        {currentCar.name}
                      </h1>
                      <p className="text-gray-600 flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {currentCar.brand} • {currentCar.model}
                      </p>
                    </div>
                    {currentCar.rating && (
                      <div className="flex items-center gap-1 bg-gradient-to-r from-amber-50 to-yellow-50 px-3 py-2 rounded-xl border border-amber-200">
                        <Star className="h-5 w-5 text-amber-500 fill-current" />
                        <span className="font-bold text-amber-700">{currentCar.rating}</span>
                        <span className="text-gray-500 text-sm">/5.0</span>
                      </div>
                    )}
                  </div>

                  {/* Fuel Type Badge */}
                  <div className="mb-4">
                    <span className={`inline-flex items-center gap-2 px-4 py-2 font-semibold rounded-full ${fuelTypeColors[currentCar.fuelType]?.bg || 'bg-gradient-to-r from-gray-500 to-gray-600'} ${fuelTypeColors[currentCar.fuelType]?.text || 'text-white'} shadow-md`}>
                      <Fuel className="h-4 w-4" />
                      {currentCar.fuelType} Vehicle
                    </span>
                  </div>
                </div>

                {/* Price & Info */}
                <div className="p-6 border-b border-gray-100">
                  <div className="mb-4">
                    <p className="text-sm text-gray-500 mb-1">Daily Rate</p>
                    <div className="flex items-baseline">
                      <span className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
                        ${currentCar.price || '89'}
                      </span>
                      <span className="text-gray-500 ml-2">/ day</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Insurance included</span>
                      <span className="text-emerald-600 font-medium">✓ Covered</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Free cancellation</span>
                      <span className="text-emerald-600 font-medium">✓ Up to 24h</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="p-6">
                  <Link
                    to={`/dashboard/rent-car?carId=${currentCar._id}`}
                    className="w-full flex items-center justify-center gap-3 py-4 bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all mb-4"
                  >
                    <CreditCard className="h-5 w-5" />
                    Rent This Car Now
                  </Link>
                  
               
                </div>

                {/* Additional Info */}
                <div className="px-6 pb-6">
                  <div className="text-sm text-gray-500 space-y-2">
                    <p className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                      Free pickup & drop-off
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                      24/7 Roadside assistance
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                      No hidden charges
                    </p>
                  </div>
                </div>
              </div>

              {/* Safety Note */}
              <div className="mt-6 p-5 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-200">
                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-blue-800 mb-1">Safe & Secure Booking</p>
                    <p className="text-sm text-blue-600">
                      Your payment is protected with 256-bit encryption. Full refund available up to 24 hours before rental.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}