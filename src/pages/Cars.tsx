import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import type { RootState } from '@/store/store'
import { getAllCars } from '@/store/slices/carSlice'


export default function Cars() {
  const dispatch = useDispatch()
  const { cars, loading, error } = useSelector((state: RootState) => state.car)

  useEffect(() => {
    dispatch(getAllCars())
  }, [dispatch])

  if (loading) {
    return (
      <div className="container mx-auto py-10">
        <div className="flex justify-center items-center min-h-[50vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto py-10">
        <div className="text-center text-red-600">
          <p>Error: {error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Available Cars</h1>
      </div>

      {cars.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600">No cars available.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cars.map((car) => (
            <div 
              key={car._id} 
              className="bg-white rounded-lg border border-gray-200 overflow-hidden"
            >
              <div className="h-48 bg-gray-100">
                {car.image ? (
                  <img 
                    src={car.image} 
                    alt={car.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200">
                    <div className="text-gray-400">No Image</div>
                  </div>
                )}
              </div>

              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-1">{car.name}</h3>
                <p className="text-gray-600 text-sm mb-3">{car.brand} • {car.model}</p>
                
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-gray-500">{car.fuelType}</span>
                  <span className="text-sm text-gray-500">{car.passengerCapacity} seats</span>
                </div>

                <Link
                  to={`/cars/${car._id}`}
                  className="block w-full py-2 text-center bg-purple-600 hover:bg-purple-700 text-white rounded"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}