import { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAppSelector } from '../../store/hooks'

interface ProtectedRouteProps {
  children: ReactNode
  allowedRoles?: string[]
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { token, user, initialized, loading } = useAppSelector((state) => state.auth)
  const location = useLocation()

  // Show loading spinner while checking authentication
  if (!initialized || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Checking authentication...</p>
        </div>
      </div>
    )
  }

  // If no token, redirect to login
  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // If roles are specified, check if user has required role
  if (allowedRoles && allowedRoles.length > 0) {
    if (!user || !user.role || !allowedRoles.includes(user.role)) {
      // Redirect to appropriate dashboard based on role
      if (user?.role === 'admin') {
        return <Navigate to="/dashboard/admin" replace />
      } else if (user?.role === 'driver') {
        return <Navigate to="/dashboard/driver" replace />
      }
      return <Navigate to="/dashboard" replace />
    }
  }

  return <>{children}</>
}