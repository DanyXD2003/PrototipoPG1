import { useParams, Navigate } from 'react-router-dom'
import CourseEditNav from '../../components/creator/CourseEditNav'
import { enrollmentByWeek, blockDropoff, creatorCompleters, getCreatorCourse, CREATOR_ORG_SLUG } from '../../data/creatorData'

export default function CourseAnalyticsPage() {
  const { courseSlug } = useParams<{ courseSlug: string }>()
  const { course, data } = getCreatorCourse(CREATOR_ORG_SLUG, courseSlug || '') ?? {}

  if (!course || !data) {
    return <Navigate to="/creator/cursos" replace />
  }

  const maxEnrolled = Math.max(...enrollmentByWeek.map(w => w.enrolled))
  const totalEnrolled = data.totalEnrolled
  const totalCompleted = data.totalCompleted
  const completionRate = data.completionRate

  const avgGrade = Math.round(creatorCompleters.reduce((sum, c) => sum + c.finalGrade, 0) / creatorCompleters.length)
  const avgTime = Math.round(creatorCompleters.reduce((sum, c) => sum + c.timeInvestedDays, 0) / creatorCompleters.length)

  const gradeDistribution = [
    { range: '90-100', count: 5, color: 'bg-green-600' },
    { range: '80-89', count: 4, color: 'bg-green-500' },
    { range: '70-79', count: 3, color: 'bg-green-400' },
    { range: '60-69', count: 2, color: 'bg-yellow-500' },
    { range: '0-59', count: 2, color: 'bg-red-400' },
  ]
  const maxGradeCount = Math.max(...gradeDistribution.map(g => g.count))

  return (
    <div>
      <CourseEditNav courseSlug={courseSlug || ''} activeTab="analiticas" />

      <div className="px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white border border-[#E8E0D0] rounded-xl p-6">
            <h3 className="text-sm font-medium text-[#5C6355] mb-4">Inscritos por semana (últimas 8 semanas)</h3>
            <div className="h-40 flex items-end justify-between gap-2">
              {enrollmentByWeek.map((week, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full flex justify-center">
                    <div
                      className="w-full max-w-8 bg-[#2D4A3E] rounded-t transition-all hover:bg-[#C9A84C]"
                      style={{ height: `${(week.enrolled / maxEnrolled) * 100}%`, minHeight: '4px' }}
                      title={`${week.enrolled} inscritos`}
                    />
                  </div>
                  <span className="text-xs text-[#5C6355]">{week.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-[#E8E0D0] rounded-xl p-6">
            <h3 className="text-sm font-medium text-[#5C6355] mb-4">¿Hasta qué bloque llegan los estudiantes?</h3>
            <div className="space-y-4">
              {blockDropoff.map((block, i) => (
                <div key={i}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-[#1A1C14]">{block.blockTitle}</span>
                    <span className="text-[#5C6355]">{block.reachedPercent}%</span>
                  </div>
                  <div className="h-3 bg-[#E8E0D0] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#2D4A3E] rounded-full transition-all"
                      style={{ width: `${block.reachedPercent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-[#E8E0D0] rounded-xl p-6">
            <h3 className="text-sm font-medium text-[#5C6355] mb-4">Distribución de notas finales</h3>
            <div className="space-y-3">
              {gradeDistribution.map((g, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-sm text-[#5C6355] w-12">{g.range}</span>
                  <div className="flex-1 h-4 bg-[#E8E0D0] rounded-full overflow-hidden">
                    <div
                      className={`h-full ${g.color} rounded-full transition-all`}
                      style={{ width: `${(g.count / maxGradeCount) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm text-[#5C6355] w-8">{g.count}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-[#E8E0D0] rounded-xl p-6">
            <h3 className="text-sm font-medium text-[#5C6355] mb-6">Resumen de rendimiento</h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-[#1A1C14]">{totalEnrolled.toLocaleString()}</div>
                <div className="text-xs text-[#5C6355]">Total<br />inscritos</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-[#1A1C14]">{totalCompleted}</div>
                <div className="text-xs text-[#5C6355]">Complet.</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-[#1A1C14]">{completionRate}%</div>
                <div className="text-xs text-[#5C6355]">Tasa de<br />completación</div>
              </div>
            </div>
            <hr className="my-4 border-[#E8E0D0]" />
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-[#1A1C14]">{avgGrade}</div>
                <div className="text-xs text-[#5C6355]">Nota prom.<br />completadores</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-[#1A1C14]">{avgTime} días</div>
                <div className="text-xs text-[#5C6355]">Tiempo prom.<br />para completar</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}