import { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAppSelector } from '../../store/hooks'

interface ProtectedRouteProps {
  children: ReactNode
  allowedRoles?: string[]
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { token, user } = useAppSelector((state) => state.auth)
  const location = useLocation()

  // If no token, redirect to login
  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // If roles are specified, check if user has required role
  if (allowedRoles && allowedRoles.length > 0) {
    if (!user || !user.role || !allowedRoles.includes(user.role)) {
      // Redirect to home if user doesn't have required role
      return <Navigate to="/" replace />
    }
  }

  return <>{children}</>
}

