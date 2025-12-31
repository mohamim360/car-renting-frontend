import { Navigate } from 'react-router-dom'
import { useAppSelector } from '../../store/hooks'

interface PublicRouteProps {
  children: React.ReactNode
  restricted?: boolean
}

export default function PublicRoute({ children, restricted = false }: PublicRouteProps) {
  const { token, user, initialized, loading } = useAppSelector((state) => state.auth)

  // Show loading spinner while checking authentication
  if (!initialized || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // If route is restricted and user is logged in, redirect based on role
  if (restricted && token && user) {
    switch (user.role) {
      case 'admin':
        return <Navigate to="/dashboard/admin" replace />
      case 'driver':
        return <Navigate to="/dashboard/driver" replace />
      case 'user':
        return <Navigate to="/dashboard" replace />
      default:
        return <Navigate to="/" replace />
    }
  }

  return <>{children}</>
}