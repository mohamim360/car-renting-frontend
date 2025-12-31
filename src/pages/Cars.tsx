import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import type { RootState } from '@/store/store'
import { getAllCars } from '@/store/slices/carSlice'
import { Car, Star, Fuel, Users } from 'lucide-react'

export default function Cars() {
  const dispatch = useDispatch()
  const { cars, loading, error } = useSelector((state: RootState) => state.car)

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    dispatch(getAllCars())
  }, [dispatch])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-20">
          <div className="flex flex-col justify-center items-center min-h-[50vh]">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mb-4"></div>
            <p className="text-gray-600 font-medium">Loading amazing cars...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-md mx-auto text-center bg-white p-8 rounded-xl border border-red-200">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Car className="h-8 w-8 text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Oops! Something went wrong</h3>
            <p className="text-red-600 mb-4">{error}</p>
            <button 
              onClick={() => 
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
                dispatch(getAllCars())}
              className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <section className="bg-gradient-to-br from-purple-50 via-white to-purple-50 border-b border-purple-100">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-3xl">
            <div className="inline-block mb-4">
              <span className="bg-purple-100 text-purple-700 px-3 py-1.5 rounded-full text-xs font-medium">
                {cars.length} Vehicles Available
              </span>
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
              Browse Our Premium Fleet
            </h1>
            <p className="text-gray-600 mb-6">
              Discover the perfect vehicle for your journey. From luxury sedans to spacious SUVs, we have it all.
            </p>

      
          </div>
        </div>
      </section>

      {/* Cars Grid Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {cars.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Car className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No Cars Available</h3>
              <p className="text-gray-600 mb-6">Check back soon for new additions to our fleet.</p>
              <Link
                to="/"
                className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors"
              >
                Back to Home
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {cars.map((car) => (
                <div
                  key={car._id}
                  className="group bg-white rounded-xl border-2 border-gray-200 overflow-hidden hover:border-purple-300 hover:shadow-xl transition-all duration-300"
                >
                  {/* Car Image */}
                  <div className="relative h-56 bg-gray-100 overflow-hidden">
                    {car.image ? (
                      <img
                        src={car.image}
                        alt={car.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Car className="h-24 w-24 text-gray-300" />
                      </div>
                    )}

                    {/* Rating Badge */}
                    {car.rating && (
                      <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1 shadow-lg">
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        <span className="font-bold text-gray-800">{car.rating}</span>
                      </div>
                    )}

                    {/* Condition Badge */}
                    {car.condition && (
                      <div className="absolute top-4 left-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            car.condition === 'New'
                              ? 'bg-purple-600 text-white'
                              : 'bg-gray-600 text-white'
                          }`}
                        >
                          {car.condition}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Car Details */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-purple-600 transition-colors">
                      {car.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">
                      {car.brand} • {car.model}
                    </p>

                    {/* Car Specs */}
                    <div className="flex items-center gap-4 mb-6 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Fuel className="h-4 w-4 text-purple-500" />
                        <span>{car.fuelType}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4 text-purple-500" />
                        <span>{car.passengerCapacity}</span>
                      </div>
                      {car.color && (
                        <>
                          <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                          <span className="font-medium text-gray-700">{car.color}</span>
                        </>
                      )}
                    </div>

                    {/* CTA Button */}
                    <Link
                      to={`/cars/${car._id}`}
                      className="block w-full py-3 px-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-center rounded-lg transition-colors group-hover:shadow-lg"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}