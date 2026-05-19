import { Link } from 'react-router-dom'
import { Users, Building2, BookOpen, TrendingUp, ArrowRight } from 'lucide-react'
import { platformStats, recentActivity, adminOrgs } from '../../data/adminData'

function getRelativeTime(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diffTime = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return 'hoy'
  if (diffDays === 1) return 'hace 1 día'
  if (diffDays < 7) return `hace ${diffDays} días`
  if (diffDays < 30) return `hace ${Math.floor(diffDays / 7)} semanas`
  return `hace ${Math.floor(diffDays / 30)} meses`
}

const activityColors: Record<string, string> = {
  user_registered: 'bg-blue-500',
  course_published: 'bg-[#C9A84C]',
  org_joined: 'bg-[#2D4A3E]',
  course_completed: 'bg-green-500',
}

export default function AdminDashboardPage() {
  const pendingOrgs = adminOrgs.filter(o => o.status === 'pending').length

  return (
    <div className="max-w-6xl">
      <h1 className="text-2xl font-bold text-[#1A1C14] mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white border border-[#E8E0D0] rounded-xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-700" />
            </div>
          </div>
          <p className="text-2xl font-bold text-[#1A1C14]">{platformStats.totalUsers.toLocaleString()}</p>
          <p className="text-sm text-[#5C6355]">Usuarios</p>
          <p className="text-xs text-[#5C6355]">+{platformStats.newUsersThisWeek} esta semana</p>
        </div>

        <div className="bg-white border border-[#E8E0D0] rounded-xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-[#F2EDE1] flex items-center justify-center">
              <Building2 className="w-5 h-5 text-[#2D4A3E]" />
            </div>
          </div>
          <p className="text-2xl font-bold text-[#1A1C14]">{platformStats.totalOrganizations}</p>
          <p className="text-sm text-[#5C6355]">Organizaciones</p>
          <p className="text-xs text-[#5C6355]">verificadas</p>
        </div>

        <div className="bg-white border border-[#E8E0D0] rounded-xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-purple-700" />
            </div>
          </div>
          <p className="text-2xl font-bold text-[#1A1C14]">{platformStats.activeCourses}</p>
          <p className="text-sm text-[#5C6355]">Cursos activos</p>
          <p className="text-xs text-[#5C6355]">de {platformStats.totalCourses} totales</p>
        </div>

        <div className="bg-white border border-[#E8E0D0] rounded-xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-green-700" />
            </div>
          </div>
          <p className="text-2xl font-bold text-[#1A1C14]">{platformStats.completionRate}%</p>
          <p className="text-sm text-[#5C6355]">Completación</p>
          <p className="text-xs text-[#5C6355]">global</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h2 className="text-lg font-semibold text-[#1A1C14] mb-4">Actividad reciente</h2>
          <div className="bg-white border border-[#E8E0D0] rounded-xl p-4 space-y-4">
            {recentActivity.slice(0, 5).map(item => (
              <div key={item.id} className="flex items-start gap-3">
                <span className={`w-2 h-2 rounded-full mt-2 shrink-0 ${activityColors[item.type]}`} />
                <div>
                  <p className="text-sm text-[#1A1C14]">{item.text}</p>
                  <p className="text-xs text-[#5C6355]">{getRelativeTime(item.time)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="hidden lg:block">
          <h2 className="text-lg font-semibold text-[#1A1C14] mb-4">Accesos rápidos</h2>
          <div className="space-y-3">
            {platformStats.pendingCourses > 0 && (
              <Link
                to="/admin/cursos"
                className="bg-[#F2EDE1] border border-[#E8E0D0] rounded-xl p-4 flex items-center justify-between hover:bg-[#E8E0D0] transition-colors cursor-pointer"
              >
                <span className="text-sm text-[#1A1C14]">Revisar {platformStats.pendingCourses} cursos pendientes</span>
                <ArrowRight className="w-4 h-4 text-[#5C6355]" />
              </Link>
            )}
            {pendingOrgs > 0 && (
              <Link
                to="/admin/organizaciones"
                className="bg-[#F2EDE1] border border-[#E8E0D0] rounded-xl p-4 flex items-center justify-between hover:bg-[#E8E0D0] transition-colors cursor-pointer"
              >
                <span className="text-sm text-[#1A1C14]">{pendingOrgs} organizaciones pendientes de verificar</span>
                <ArrowRight className="w-4 h-4 text-[#5C6355]" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}