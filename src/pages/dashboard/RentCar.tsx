import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { MapPin, Car } from 'lucide-react'
import type { RootState } from '@/store/store'
import { getAllCars } from '@/store/slices/carSlice'
import { createRent } from '@/store/slices/rentSlice'

interface RentFormData {
  car: string
  startingPoint: string
  destination: string
}

export default function RentCar() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  
  const { loading: rentLoading, error: rentError } = useSelector((state: RootState) => state.rent)
  const { cars, loading: carsLoading } = useSelector((state: RootState) => state.car)
  
  const [selectedCar, setSelectedCar] = useState<string>('')
  const { user, initialized } = useSelector((state: RootState) => state.auth)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<RentFormData>()

  useEffect(() => {
    dispatch(getAllCars())
  }, [dispatch])

  useEffect(() => {
    const carId = searchParams.get('carId')
    if (carId) {
      setValue('car', carId)
      setSelectedCar(carId)
    }
  }, [searchParams, setValue])

  const onSubmit = async (data: RentFormData) => {
    if (!initialized || !user) {
      navigate('/login')
      return
    }
  
    const result = await dispatch(
      createRent({
        car: data.car,
        startingPoint: data.startingPoint,
        destination: data.destination,
        rentStatus: 'pending',
      }) as any
    )
  
    if (createRent.fulfilled.match(result)) {
      navigate('/dashboard')
    }
  }
  

  if (carsLoading) {
    return (
      <div className="container mx-auto py-10">
        <div className="flex justify-center items-center min-h-[50vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Rent a Car</h1>
          <p className="text-gray-600">Fill in the details to rent a car</p>
        </div>

        {rentError && (
          <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 text-red-600">
            {rentError}
          </div>
        )}

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Car Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Car
              </label>
              <select
                {...register('car', { required: 'Please select a car' })}
                value={selectedCar}
                onChange={(e) => {
                  setSelectedCar(e.target.value)
                  setValue('car', e.target.value)
                }}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none"
              >
                <option value="">Choose a car</option>
                {cars.map((car) => (
                  <option key={car._id} value={car._id}>
                    {car.name} - {car.brand} {car.model}
                  </option>
                ))}
              </select>
              {errors.car && (
                <p className="mt-2 text-sm text-red-600">{errors.car.message}</p>
              )}
            </div>

            {/* Starting Point */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-purple-500" />
                  Starting Point
                </div>
              </label>
              <input
                type="text"
                {...register('startingPoint', { 
                  required: 'Starting point is required',
                  minLength: {
                    value: 3,
                    message: 'Starting point must be at least 3 characters'
                  }
                })}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none"
                placeholder="Enter starting location"
              />
              {errors.startingPoint && (
                <p className="mt-2 text-sm text-red-600">{errors.startingPoint.message}</p>
              )}
            </div>

            {/* Destination */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-purple-500" />
                  Destination
                </div>
              </label>
              <input
                type="text"
                {...register('destination', { 
                  required: 'Destination is required',
                  minLength: {
                    value: 3,
                    message: 'Destination must be at least 3 characters'
                  }
                })}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none"
                placeholder="Enter destination"
              />
              {errors.destination && (
                <p className="mt-2 text-sm text-red-600">{errors.destination.message}</p>
              )}
            </div>

            {/* Selected Car Preview */}
            {selectedCar && (
              <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
                <div className="flex items-center gap-3 mb-2">
                  <Car className="h-5 w-5 text-purple-600" />
                  <h3 className="font-medium text-gray-800">Selected Car</h3>
                </div>
                {cars.find(car => car._id === selectedCar) && (
                  <div className="text-sm text-gray-600">
                    <p>
                      {cars.find(car => car._id === selectedCar)?.name} - 
                      {cars.find(car => car._id === selectedCar)?.brand} 
                      {cars.find(car => car._id === selectedCar)?.model}
                    </p>
                    <p className="text-gray-500 mt-1">
                      {cars.find(car => car._id === selectedCar)?.fuelType} • 
                      {cars.find(car => car._id === selectedCar)?.passengerCapacity} seats
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={rentLoading}
              className="w-full py-3 px-4 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {rentLoading ? 'Processing...' : 'Rent Car'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}