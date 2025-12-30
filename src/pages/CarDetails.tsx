import { useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Car, Fuel, Users, Star, Palette, ArrowLeft, Calendar } from 'lucide-react'
import type { RootState } from '@/store/store'
import { getCarById } from '@/store/slices/carSlice'

export default function CarDetails() {
  const { id } = useParams()
  const dispatch = useDispatch()
  const { currentCar, loading, error } = useSelector((state: RootState) => state.car)

  useEffect(() => {
    if (id) {
      dispatch(getCarById(id))
    }
  }, [dispatch, id])

  if (loading) {
    return (
      <div className="container mx-auto py-10">
        <div className="flex justify-center items-center min-h-[50vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      </div>
    )
  }

  if (error || !currentCar) {
    return (
      <div className="container mx-auto py-10">
        <div className="text-center">
          <Car className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Car not found</h2>
          <p className="text-gray-600 mb-6">{error || 'The requested car does not exist.'}</p>
          <Link
            to="/cars"
            className="inline-flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Cars
          </Link>
        </div>
      </div>
    )
  }

  const fuelTypeColors: Record<string, string> = {
    'Octane': 'bg-red-100 text-red-800',
    'Hybrid': 'bg-green-100 text-green-800',
    'Electric': 'bg-blue-100 text-blue-800',
    'Diesel': 'bg-yellow-100 text-yellow-800',
    'Petrol': 'bg-orange-100 text-orange-800'
  }

  return (
    <div className="container mx-auto py-10">
      <Link
        to="/cars"
        className="inline-flex items-center text-purple-600 hover:text-purple-700 mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Cars
      </Link>

      <div className="bg-white rounded-xl border border-purple-100 shadow-sm overflow-hidden">
        <div className="md:flex">
          {/* Car Image */}
          <div className="md:w-1/2">
            <div className="h-64 md:h-full bg-gray-100">
              {currentCar.image ? (
                <img 
                  src={currentCar.image} 
                  alt={currentCar.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Car className="h-24 w-24 text-gray-400" />
                </div>
              )}
            </div>
          </div>

          {/* Car Details */}
          <div className="md:w-1/2 p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">{currentCar.name}</h1>
                <p className="text-gray-600">{currentCar.brand} • {currentCar.model}</p>
              </div>
              {currentCar.rating && (
                <div className="flex items-center bg-purple-50 px-3 py-2 rounded-lg">
                  <Star className="h-4 w-4 text-purple-600 mr-1 fill-current" />
                  <span className="font-medium text-purple-700">{currentCar.rating}</span>
                </div>
              )}
            </div>

            {/* Condition Badge */}
            <div className="mb-6">
              <span className={`px-3 py-1 text-sm font-medium rounded-full ${currentCar.condition === 'New' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'}`}>
                {currentCar.condition} Car
              </span>
            </div>

            {/* Specifications */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="flex items-center p-3 bg-purple-50 rounded-lg">
                <Fuel className="h-5 w-5 text-purple-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Fuel Type</p>
                  <p className="font-medium text-gray-800">{currentCar.fuelType}</p>
                </div>
              </div>

              <div className="flex items-center p-3 bg-purple-50 rounded-lg">
                <Users className="h-5 w-5 text-purple-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Capacity</p>
                  <p className="font-medium text-gray-800">{currentCar.passengerCapacity} Persons</p>
                </div>
              </div>

              <div className="flex items-center p-3 bg-purple-50 rounded-lg">
                <Palette className="h-5 w-5 text-purple-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Color</p>
                  <p className="font-medium text-gray-800">{currentCar.color}</p>
                </div>
              </div>

              <div className="flex items-center p-3 bg-purple-50 rounded-lg">
                <Calendar className="h-5 w-5 text-purple-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <p className="font-medium text-gray-800 capitalize">{currentCar.condition.toLowerCase()}</p>
                </div>
              </div>
            </div>

            {/* Fuel Type Badge */}
            <div className="mb-8">
              <span className={`px-4 py-2 font-medium rounded-full ${fuelTypeColors[currentCar.fuelType] || 'bg-gray-100 text-gray-800'}`}>
                {currentCar.fuelType} Vehicle
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <Link
                to={`/dashboard/rent-car?carId=${currentCar._id}`}
                className="flex-1 py-3 text-center bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors"
              >
                Rent This Car
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}