import { Link, useLocation, Navigate } from 'react-router-dom'
import { Search, Bookmark, Star, ArrowLeft } from 'lucide-react'
import Navbar from './Navbar'
import { useAuth } from '../../context/auth'
import { savedCandidatesMock } from '../../data/talentData'

export default function TalentLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation()
  const { user, isLoggedIn } = useAuth()

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />
  }
  if (user?.role !== 'organization') {
    return <Navigate to="/" replace />
  }

  const savedCount = savedCandidatesMock.length

  const navItems = [
    { to: '/talent/buscar', icon: Search, label: 'Buscar talento' },
    { to: '/talent/guardados', icon: Bookmark, label: 'Candidatos guardados', badge: savedCount },
    { to: '/talent/mis-busquedas', icon: Star, label: 'Búsquedas guardadas' },
  ]

  const isActive = (to: string) => location.pathname.startsWith(to)

  return (
    <div>
      <Navbar />
      <div className="pt-20 flex min-h-screen">
        <aside className="w-64 shrink-0 border-r border-[#E8E0D0] bg-[#FAF7EF] min-h-screen px-4 py-6 hidden md:block">
          <div className="text-xs font-semibold text-[#5C6355] uppercase tracking-wider mb-4">
            Reclutamiento
          </div>
          <nav className="space-y-1">
            {navItems.map(item => (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                  isActive(item.to)
                    ? 'bg-[#F2EDE1] text-[#2D4A3E] font-medium'
                    : 'text-[#5C6355] hover:bg-[#F2EDE1]/50'
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
                {item.badge && item.badge > 0 && (
                  <span className="ml-auto bg-[#C9A84C] text-[#1A1C14] text-xs font-medium px-2 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}
              </Link>
            ))}
          </nav>

          <hr className="my-4 border-[#E8E0D0]" />

          <Link
            to="/creator/dashboard"
            className="flex items-center gap-2 text-sm text-[#5C6355] hover:text-[#2D4A3E] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Panel Creador
          </Link>
        </aside>

        <main className="flex-1 overflow-y-auto px-6 py-8">
          {children}
        </main>
      </div>
    </div>
  )
}