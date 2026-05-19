import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/auth'

export default function AdminRoute({ children }: { children: React.ReactNode }) {
  const { isLoggedIn, user } = useAuth()
  if (!isLoggedIn || user?.role !== 'admin') return <Navigate to="/" replace />
  return <>{children}</>
}