import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/auth'

export default function TalentRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoggedIn } = useAuth()
  if (!isLoggedIn) return <Navigate to="/login" replace />
  if (user?.role !== 'organization') return <Navigate to="/" replace />
  return <>{children}</>
}