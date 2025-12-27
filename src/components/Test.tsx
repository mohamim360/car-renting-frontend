import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { getAllCars } from '@/store/slices/carSlice'
import { getAllUsers } from '@/store/slices/userSlice'
import { Button } from '@/components/ui/button'

export function Test() {
  const dispatch = useAppDispatch()
  
  const { cars, loading: carsLoading, error: carsError } = useAppSelector((state) => state.car)
  const { users, loading: usersLoading, error: usersError } = useAppSelector((state) => state.user)

  useEffect(() => {
    dispatch(getAllCars())
    dispatch(getAllUsers())
  }, [dispatch])

  return (
    <div className="p-8 space-y-8">
     
      
      {/* Cars Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Cars</h2>
          <Button onClick={() => dispatch(getAllCars())}>
            Refresh Cars
          </Button>
        </div>
        
        {carsLoading && <p>Loading cars...</p>}
        {carsError && <p className="text-red-500">Error: {carsError}</p>}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {cars.map((car) => (
            <div key={car._id} className="border rounded-lg p-4">
              <h3 className="font-bold">{car.name}</h3>
              <p className="text-sm text-gray-600">{car.brand} {car.model}</p>
              <p className="text-sm">Fuel: {car.fuelType}</p>
              <p className="text-sm">Capacity: {car.passengerCapacity}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Users Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Users</h2>
          <Button onClick={() => dispatch(getAllUsers())}
            >
            Refresh Users
          </Button>
        </div>
        
        {usersLoading && <p>Loading users...</p>}
        {usersError && <p className="text-red-500">Error: {usersError}</p>}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {users.map((user) => (
            <div key={user._id} className="border rounded-lg p-4">
              <h3 className="font-bold">{user.name}</h3>
              <p className="text-sm text-gray-600">{user.email}</p>
              <p className="text-sm">Role: {user.role}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

