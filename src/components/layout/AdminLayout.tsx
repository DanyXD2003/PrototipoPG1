import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, Users, Building2, BookOpen, BarChart3 } from 'lucide-react'
import Navbar from './Navbar'
import AdminRoute from '../auth/AdminRoute'

const navItems = [
  { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/usuarios', icon: Users, label: 'Usuarios' },
  { to: '/admin/organizaciones', icon: Building2, label: 'Organizaciones' },
  { to: '/admin/cursos', icon: BookOpen, label: 'Cursos' },
  { to: '/admin/reportes', icon: BarChart3, label: 'Reportes' },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation()
  const isActive = (to: string) =>
    location.pathname === to || location.pathname.startsWith(to + '/')

  return (
    <AdminRoute>
      <div>
        <Navbar />
        <div className="pt-20 flex min-h-screen">
          <aside className="w-64 shrink-0 bg-[#1A1C14] min-h-screen px-4 py-6 hidden md:block">
            <div className="text-xs font-semibold text-[#5C6355] uppercase tracking-wider mb-1 px-3">
              Nexora
            </div>
            <div className="text-xs font-semibold text-[#5C6355] uppercase tracking-wider mb-4 px-3">
              Administración
            </div>
            <nav className="space-y-1">
              {navItems.map(item => (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors cursor-pointer ${
                    isActive(item.to)
                      ? 'bg-[#2D4A3E] text-white font-medium'
                      : 'text-[#5C6355] hover:text-white hover:bg-[#2D4A3E]/40'
                  }`}
                >
                  <item.icon className="w-4 h-4 shrink-0" />
                  {item.label}
                </Link>
              ))}
            </nav>
          </aside>
          <main className="flex-1 bg-[#FAF7EF] min-h-screen p-6">
            {children}
          </main>
        </div>
      </div>
    </AdminRoute>
  )
}