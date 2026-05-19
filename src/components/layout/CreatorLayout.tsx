import { Link, useLocation, Navigate } from 'react-router-dom'
import { LayoutDashboard, BookOpen, Plus, ExternalLink } from 'lucide-react'
import Navbar from './Navbar'
import { useAuth } from '../../context/auth'

export default function CreatorLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation()
  const { user, isLoggedIn } = useAuth()

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />
  }
  if (user?.role === 'student') {
    return <Navigate to="/dashboard" replace />
  }

  const navItems = [
    { to: '/creator/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/creator/cursos', icon: BookOpen, label: 'Mis cursos' },
  ]

  const isActive = (to: string) => location.pathname === to || location.pathname.startsWith(to + '/')

  return (
    <div>
      <Navbar />
      <div className="pt-20 flex min-h-screen">
        <aside className="w-64 shrink-0 border-r border-[#E8E0D0] bg-[#FAF7EF] min-h-screen px-4 py-6 hidden md:block">
          <div className="text-xs font-semibold text-[#5C6355] uppercase tracking-wider mb-4">
            Panel Creador
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
              </Link>
            ))}
          </nav>

          <hr className="my-4 border-[#E8E0D0]" />

          <Link
            to="/creator/cursos/nuevo"
            className="flex items-center justify-center gap-2 w-full bg-[#C9A84C] text-[#1A1C14] py-2.5 rounded-lg font-medium hover:bg-[#B8970A] transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Crear curso
          </Link>

          <hr className="my-4 border-[#E8E0D0]" />

          <Link
            to={user?.role === 'organization' ? `/org/${user.orgSlug}` : `/instructor/${user?.instructorSlug}`}
            target="_blank"
            className="flex items-center gap-2 text-sm text-[#5C6355] hover:text-[#2D4A3E] transition-colors cursor-pointer"
          >
            <ExternalLink className="w-4 h-4" />
            Ver perfil público
          </Link>
        </aside>

        <main className="flex-1 overflow-y-auto px-6 py-8">
          {children}
        </main>
      </div>
    </div>
  )
}