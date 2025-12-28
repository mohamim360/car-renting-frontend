import { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAppSelector } from '../../store/hooks'

interface PublicRouteProps {
  children: ReactNode
  restricted?: boolean // If true, redirect to home if user is logged in
}

export default function PublicRoute({ children, restricted = false }: PublicRouteProps) {
  const { token } = useAppSelector((state) => state.auth)

  // If route is restricted and user is logged in, redirect to home
  if (restricted && token) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}

