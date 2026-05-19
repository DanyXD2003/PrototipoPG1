import { Link, useLocation, Navigate } from 'react-router-dom'
import { LayoutDashboard, BookOpen, Award } from 'lucide-react'
import Navbar from './Navbar'
import { useAuth } from '../../context/auth'
import { getUserEnrollments } from '../../data/enrollments'
import CountdownTimer from '../learning/CountdownTimer'

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation()
  const { user, isLoggedIn } = useAuth()

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />
  }
  const enrollments = user ? getUserEnrollments(user.id) : []

  const activeBlock = enrollments
    .flatMap(e => e.blocks.filter(b => b.status === 'active'))
    .pop()

  const activeEnrollment = activeBlock
    ? enrollments.find(e => e.blocks.some(b => b.blockId === activeBlock.blockId))
    : null

  const navItems = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/mis-cursos', icon: BookOpen, label: 'Mis cursos' },
    { to: '/mis-certificados', icon: Award, label: 'Mis certificados' },
  ]

  return (
    <div>
      <Navbar />
      <div className="pt-20 flex min-h-screen">
        <aside className="w-64 shrink-0 border-r border-[#E8E0D0] bg-[#FAF7EF] min-h-screen px-4 py-6 hidden md:block">
          <div className="text-xs font-semibold text-[#5C6355] uppercase tracking-wider mb-4">
            Mi aprendizaje
          </div>
          <nav className="space-y-1">
            {navItems.map(item => {
              const isActive = location.pathname === item.to
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-[#F2EDE1] text-[#2D4A3E] font-medium'
                      : 'text-[#5C6355] hover:bg-[#F2EDE1]/50'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </Link>
              )
            })}
          </nav>

          {activeBlock && activeEnrollment && activeBlock.expiresAt && (
            <>
              <hr className="my-4 border-[#E8E0D0]" />
              <div className="text-xs font-semibold text-[#5C6355] uppercase tracking-wider mb-3">
                Activo ahora
              </div>
              <div className="bg-white rounded-lg p-3 border border-[#E8E0D0]">
                <div className="text-sm font-medium text-[#1A1C14] truncate">
                  {activeEnrollment.course.title}
                </div>
                <div className="text-xs text-[#5C6355] mt-1">
                  Bloque {activeBlock.blockId.replace('b', '')}
                </div>
                <div className="mt-2">
                  <CountdownTimer expiresAt={activeBlock.expiresAt} size="sm" />
                </div>
                <Link
                  to={`/aprendizaje/${activeEnrollment.course.slug}/bloque/${activeBlock.blockId}`}
                  className="mt-3 block text-center text-sm bg-[#C9A84C] text-[#1A1C14] py-2 rounded-lg font-medium hover:bg-[#B8970A] transition-colors cursor-pointer"
                >
                  Continuar
                </Link>
              </div>
            </>
          )}
        </aside>

        <main className="flex-1 overflow-y-auto px-6 py-8">
          {children}
        </main>
      </div>
    </div>
  )
}