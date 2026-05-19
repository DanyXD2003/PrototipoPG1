import { weeklyGrowth, topCourses, platformStats } from '../../data/adminData'

export default function AdminReportsPage() {
  const maxUsers = Math.max(...weeklyGrowth.map(w => w.users))
  const maxEnrollments = Math.max(...weeklyGrowth.map(w => w.enrollments))

  return (
    <div className="max-w-6xl">
      <h1 className="text-2xl font-bold text-[#1A1C14] mb-6">Reportes globales</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white border border-[#E8E0D0] rounded-xl p-6">
          <h2 className="text-lg font-semibold text-[#1A1C14] mb-4">Crecimiento semanal</h2>
          <div className="flex items-end justify-between gap-2 h-40">
            {weeklyGrowth.map(week => (
              <div key={week.week} className="flex flex-col items-center gap-1 flex-1">
                <div className="flex items-end gap-1 h-32 w-full justify-center">
                  <div
                    className="w-4 bg-[#2D4A3E] rounded-t"
                    style={{ height: `${(week.users / maxUsers) * 100}%` }}
                    title={`${week.users} usuarios`}
                  />
                  <div
                    className="w-4 bg-[#C9A84C] rounded-t"
                    style={{ height: `${(week.enrollments / maxEnrollments) * 100}%` }}
                    title={`${week.enrollments} inscritos`}
                  />
                </div>
                <span className="text-xs text-[#5C6355]">{week.week}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-4 mt-4 justify-center">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-[#2D4A3E] rounded-sm" />
              <span className="text-xs text-[#5C6355]">Usuarios nuevos</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-[#C9A84C] rounded-sm" />
              <span className="text-xs text-[#5C6355]">Inscripciones</span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-[#E8E0D0] rounded-xl p-6">
          <h2 className="text-lg font-semibold text-[#1A1C14] mb-4">Top 5 cursos más populares</h2>
          <div className="space-y-3">
            {topCourses.map((course, index) => (
              <div key={course.title} className="flex items-center gap-4 py-2 border-b border-[#E8E0D0] last:border-0">
                <span className="text-sm font-bold text-[#5C6355] w-4">{index + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#1A1C14] truncate">{course.title}</p>
                  <p className="text-xs text-[#5C6355]">{course.org}</p>
                </div>
                <span className="text-sm text-[#5C6355] shrink-0">{course.enrollments.toLocaleString()}</span>
                <div className="w-24 shrink-0">
                  <div className="flex items-center gap-1">
                    <div className="flex-1 h-1.5 bg-[#E8E0D0] rounded-full">
                      <div
                        className="h-1.5 bg-[#2D4A3E] rounded-full"
                        style={{ width: `${course.completionRate}%` }}
                      />
                    </div>
                    <span className="text-xs text-[#5C6355] w-8">{course.completionRate}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white border border-[#E8E0D0] rounded-xl p-6">
        <h2 className="text-lg font-semibold text-[#1A1C14] mb-4">Resumen de plataforma</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <p className="text-2xl font-bold text-[#1A1C14]">{platformStats.totalEnrollments.toLocaleString()}</p>
            <p className="text-sm text-[#5C6355]">Total inscritos</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-[#1A1C14]">{platformStats.completionRate}%</p>
            <p className="text-sm text-[#5C6355]">Tasa de completación</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-[#1A1C14]">{platformStats.activeCourses}</p>
            <p className="text-sm text-[#5C6355]">Cursos activos</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-[#1A1C14]">+{platformStats.newEnrollmentsThisWeek.toLocaleString()}</p>
            <p className="text-sm text-[#5C6355]">Nuevos inscritos esta semana</p>
          </div>
        </div>
      </div>
    </div>
  )
}