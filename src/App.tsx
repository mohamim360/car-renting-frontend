import { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import CommonLayout from './layouts/CommonLayout'
import DashboardLayout from './layouts/DashboardLayout'
import ProtectedRoute from './components/routes/ProtectedRoute'
import PublicRoute from './components/routes/PublicRoute'
import { useDispatch } from 'react-redux'
import { initializeAuth } from './store/slices/authSlice'

// Public Pages
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Cars from './pages/Cars'
import CarDetails from './pages/CarDetails'
import NotFound from './pages/NotFound'

// Dashboard Pages
import UserDashboard from './pages/dashboard/UserDashboard'
import RentCar from './pages/dashboard/RentCar'
import AdminDashboard from './pages/dashboard/AdminDashboard'
import CarsManagement from './pages/dashboard/CarsManagement'
import UsersManagement from './pages/dashboard/UsersManagement'
import DriverDashboard from './pages/dashboard/DriverDashboard'

function App() {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(initializeAuth())
  }, [dispatch])

  return (
    <Routes>
      {/* Public Routes with Common Layout */}
      <Route
        path="/"
        element={
          <CommonLayout>
            <Home />
          </CommonLayout>
        }
      />
      <Route
        path="/login"
        element={
          <PublicRoute restricted>
            <CommonLayout>
              <Login />
            </CommonLayout>
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute restricted>
            <CommonLayout>
              <Register />
            </CommonLayout>
          </PublicRoute>
        }
      />
      <Route
        path="/cars"
        element={
          <CommonLayout>
            <Cars />
          </CommonLayout>
        }
      />
      <Route
        path="/cars/:id"
        element={
          <CommonLayout>
            <CarDetails />
          </CommonLayout>
        }
      />

      {/* Protected Dashboard Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRoles={['user', 'admin', 'driver']}>
            <DashboardLayout>
              <UserDashboard />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* User Dashboard Routes */}
      <Route
        path="/dashboard/rent-car"
        element={
          <ProtectedRoute allowedRoles={['user']}>
            <DashboardLayout>
              <RentCar />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* Admin Dashboard Routes */}
      <Route
        path="/dashboard/admin"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <DashboardLayout>
              <AdminDashboard />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/admin/cars-management"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <DashboardLayout>
              <CarsManagement />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/admin/users-management"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <DashboardLayout>
              <UsersManagement />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* Driver Dashboard Routes */}
      <Route
        path="/dashboard/driver"
        element={
          <ProtectedRoute allowedRoles={['driver']}>
            <DashboardLayout>
              <DriverDashboard />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* 404 Not Found */}
      <Route
        path="*"
        element={
          <CommonLayout>
            <NotFound />
          </CommonLayout>
        }
      />
    </Routes>
  )
}

export default App

