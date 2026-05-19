import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/auth'

export default function CreatorRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoggedIn } = useAuth()
  if (!isLoggedIn) return <Navigate to="/login" replace />
  if (user?.role === 'student') return <Navigate to="/dashboard" replace />
  return <>{children}</>
}