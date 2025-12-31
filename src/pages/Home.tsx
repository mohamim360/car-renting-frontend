import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import type { RootState } from '@/store/store'
import { getAllCars } from '@/store/slices/carSlice'
import { Car, Star, Fuel, Users, ArrowRight, CheckCircle, Shield, Zap } from 'lucide-react'

export default function Home() {
  const dispatch = useDispatch()
  const { cars, loading } = useSelector((state: RootState) => state.car)

  useEffect(() => {
     // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    dispatch(getAllCars())
  }, [dispatch])

  // Get top rated cars (rating >= 4.5)
  const topRatedCars = cars
    .filter(car => typeof car.rating === 'number' && car.rating >= 4.5)
    .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
    .slice(0, 6)

  // Get unique brands with counts
  const brandCounts = cars.reduce((acc, car) => {
    acc[car.brand] = (acc[car.brand] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const topBrands = Object.entries(brandCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([brand, count]) => ({ brand, count }))

  return (
    <div className="min-h-screen">
      {/* Hero Section - Compact */}
      <section className="bg-gradient-to-br from-purple-50 via-white to-purple-50">
        <div className="container mx-auto px-4 py-12 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Left Content */}
            <div className="space-y-4">
              <div className="inline-block">
                <span className="bg-purple-100 text-purple-700 px-3 py-1.5 rounded-full text-xs font-medium">
                  Premium Car Rental Service
                </span>
              </div>
              
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
                Find Your Perfect
                <span className="block text-purple-600">Ride Today</span>
              </h1>
              
              <p className="text-base text-gray-600 leading-relaxed">
                Choose from our wide selection of premium vehicles with competitive prices and exceptional service.
              </p>

              {/* Features */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-purple-100 rounded-lg">
                    <CheckCircle className="h-4 w-4 text-purple-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">Best Prices</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-purple-100 rounded-lg">
                    <Shield className="h-4 w-4 text-purple-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">Fully Insured</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-purple-100 rounded-lg">
                    <Zap className="h-4 w-4 text-purple-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">Instant Booking</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-purple-100 rounded-lg">
                    <Star className="h-4 w-4 text-purple-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">5-Star Service</span>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-3">
                <Link
                  to="/cars"
                  className="group inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-all duration-300 shadow-sm hover:shadow-md"
                >
                  Browse Cars
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-white border-2 border-purple-200 text-purple-600 font-semibold rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-all duration-300"
                >
                  Get Started
                </Link>
              </div>

              {/* Stats */}
              <div className="flex gap-6 pt-4 border-t border-purple-100">
                <div>
                  <p className="text-2xl font-bold text-gray-900">{cars.length}+</p>
                  <p className="text-gray-600 text-xs">Cars Available</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">50+</p>
                  <p className="text-gray-600 text-xs">Happy Customers</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">4.8</p>
                  <p className="text-gray-600 text-xs">Average Rating</p>
                </div>
              </div>
            </div>

            {/* Right Content - Car Image */}
            <div className="relative hidden lg:block">
              <div className="relative bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl p-6 shadow-lg">
                {/* Car Image */}
                <div className="relative z-10">
                  <img
                    src="https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800"
                    alt="Luxury Car"
                    className="w-full rounded-lg"
                  />
                </div>
              </div>

           
            </div>
          </div>
        </div>
      </section>

      {/* Top Brands Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Top Brands We Offer
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Choose from the world's most trusted automotive brands
            </p>
          </div>

          {topBrands.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Loading brands...</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-6">
              {topBrands.map(({ brand, count }) => (
                <div
                  key={brand}
                  className="group bg-white p-8 rounded-xl border-2 border-gray-200 hover:border-purple-300 hover:shadow-lg transition-all duration-300 cursor-pointer"
                >
                  <div className="text-center">
                    {/* Brand Logo Placeholder */}
                    <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                      <span className="text-2xl font-bold text-purple-600">
                        {brand.charAt(0)}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-purple-600 transition-colors">
                      {brand}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {count} {count === 1 ? 'Car' : 'Cars'} Available
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* View All Brands Link */}
          <div className="text-center mt-12">
            <Link
              to="/cars"
              className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 font-semibold"
            >
              View All Brands
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Top Rated Cars Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Top Rated Vehicles
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover our most popular and highly-rated cars chosen by customers
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>
          ) : topRatedCars.length === 0 ? (
            <div className="text-center py-12">
              <Car className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No cars available yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {topRatedCars.map((car) => (
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
                    <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1 shadow-lg">
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                      <span className="font-bold text-gray-800">{car.rating}</span>
                    </div>

                    {/* Condition Badge */}
                    <div className="absolute top-4 left-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        car.condition === 'New' 
                          ? 'bg-purple-600 text-white' 
                          : 'bg-gray-600 text-white'
                      }`}>
                        {car.condition}
                      </span>
                    </div>
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
                      <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                      <span className="font-medium text-gray-700">{car.color}</span>
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

          {/* View All Cars Link */}
          <div className="text-center mt-12">
            <Link
              to="/cars"
              className="inline-flex items-center gap-2 px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors shadow-lg hover:shadow-xl"
            >
              View All Cars
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Us
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Experience the best car rental service with these amazing benefits
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-gradient-to-br from-purple-50 to-white p-8 rounded-xl border border-purple-100 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-6">
                <CheckCircle className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Best Prices Guaranteed</h3>
              <p className="text-gray-600">
                Competitive rates with no hidden fees. Get the best value for your money with transparent pricing.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-gradient-to-br from-purple-50 to-white p-8 rounded-xl border border-purple-100 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-6">
                <Shield className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Fully Insured</h3>
              <p className="text-gray-600">
                All our vehicles are fully insured with comprehensive coverage for your peace of mind.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-gradient-to-br from-purple-50 to-white p-8 rounded-xl border border-purple-100 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-6">
                <Zap className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Instant Booking</h3>
              <p className="text-gray-600">
                Book your car in seconds with our easy-to-use platform. Instant confirmation guaranteed.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-purple-600 to-purple-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            Ready to Hit the Road?
          </h2>
          <p className="text-lg text-purple-100 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers and start your journey today
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="px-8 py-3 bg-white text-purple-700 font-semibold rounded-lg hover:bg-purple-50 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Sign Up Now
            </Link>
            <Link
              to="/cars"
              className="px-8 py-3 bg-purple-500 border-2 border-white/20 font-semibold rounded-lg hover:bg-purple-400 transition-all duration-300"
            >
              Browse Cars
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}