import { useAuth } from '../../context/auth'
import { getUserEnrollments } from '../../data/enrollments'
import { Link } from 'react-router-dom'
import { Flame, BookOpen } from 'lucide-react'
import CountdownTimer from '../../components/learning/CountdownTimer'
import ProgressBar from '../../components/learning/ProgressBar'

export default function StudentDashboardPage() {
  const { user } = useAuth()
  const enrollments = user ? getUserEnrollments(user.id) : []

  const activeBlock = enrollments
    .flatMap(e => e.blocks.filter(b => b.status === 'active'))
    .pop()

  const activeEnrollment = activeBlock
    ? enrollments.find(e => e.blocks.some(b => b.blockId === activeBlock.blockId))
    : null

  const failedBlock = enrollments
    .flatMap(e => e.blocks.filter(b => b.status === 'failed'))
    .pop()

  const failedEnrollment = failedBlock
    ? enrollments.find(e => e.blocks.some(b => b.blockId === failedBlock.blockId))
    : null

  const completedBlocks = enrollments
    .flatMap(e => e.blocks.filter(b => b.status === 'completed'))

  const totalGrade = completedBlocks.reduce((sum, b) => sum + (b.grade || 0), 0)
  const avgGrade = completedBlocks.length > 0 ? Math.round(totalGrade / completedBlocks.length) : 0

  if (enrollments.length === 0) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center py-16">
          <BookOpen className="w-16 h-16 text-[#E8E0D0] mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-[#1A1C14] mb-2">
            ¡Aún no estás inscrito en ningún curso!
          </h2>
          <p className="text-[#5C6355] mb-6">
            Explora nuestro catálogo de cursos y encuentra el ideal para ti.
          </p>
          <Link
            to="/cursos"
            className="inline-block bg-[#C9A84C] text-[#1A1C14] px-6 py-3 rounded-lg font-medium hover:bg-[#B8970A] transition-colors cursor-pointer"
          >
            Explorar cursos
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#1A1C14]">
          Hola, {user?.name.split(' ')[0]} 👋
        </h1>
        <p className="text-[#5C6355] mt-1">Continúa donde lo dejaste</p>
      </div>

      {activeBlock && activeEnrollment && activeBlock.expiresAt && (
        <div className="bg-[#2D4A3E] rounded-xl p-6 mb-8 text-white">
          <div className="flex items-center gap-2 mb-3">
            <Flame className="w-5 h-5 text-[#C9A84C]" />
            <span className="text-sm font-semibold uppercase tracking-wider text-[#C9A84C]">
              Bloque activo
            </span>
          </div>
          <h2 className="text-lg font-semibold mb-1">
            {activeEnrollment.course.title}
          </h2>
          <p className="text-white/70 text-sm mb-4">
            Bloque {activeBlock.blockId.replace('b', '')}
          </p>

          <div className="mb-4">
            <CountdownTimer expiresAt={activeBlock.expiresAt} size="lg" />
          </div>

          <div className="mb-4">
            <ProgressBar
              progress={(activeBlock.unitsCompleted / 5) * 100}
              size="md"
              color="bg-[#C9A84C]"
            />
            <p className="text-sm text-white/70 mt-1">
              {activeBlock.unitsCompleted}/5 unidades completadas
            </p>
          </div>

          <Link
            to={`/aprendizaje/${activeEnrollment.course.slug}/bloque/${activeBlock.blockId}`}
            className="inline-block bg-[#C9A84C] text-[#1A1C14] px-5 py-2.5 rounded-lg font-medium hover:bg-[#B8970A] transition-colors cursor-pointer"
          >
            Continuar bloque →
          </Link>
        </div>
      )}

      {failedBlock && failedEnrollment && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-8">
          <p className="text-red-700">
            También tienes un bloque reprobado que puedes reintentar:{' '}
            <Link
              to={`/aprendizaje/${failedEnrollment.course.slug}/bloque/${failedBlock.blockId}/reintentar`}
              className="font-medium underline cursor-pointer"
            >
              {failedEnrollment.course.title} - Bloque {failedBlock.blockId.replace('b', '')}
            </Link>
          </p>
        </div>
      )}

      <div className="mb-8">
        <h2 className="text-lg font-semibold text-[#1A1C14] mb-4">Mis cursos en progreso</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {enrollments.filter(e => !e.completed).map(enrollment => {
            const currentBlock = enrollment.blocks.find(b =>
              ['active', 'not_started', 'failed'].includes(b.status)
            ) || enrollment.blocks[0]

            return (
              <Link
                key={enrollment.id}
                to={`/aprendizaje/${enrollment.course.slug}`}
                className="block bg-[#F2EDE1] border border-[#E8E0D0] rounded-xl overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer"
              >
                <div className="aspect-video bg-[#E8E0D0]">
                  <img
                    src={enrollment.course.coverImage}
                    alt={enrollment.course.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-[#1A1C14] truncate mb-1">
                    {enrollment.course.title}
                  </h3>
                  <p className="text-sm text-[#5C6355] mb-3">
                    {enrollment.course.organization.name}
                  </p>
                  <ProgressBar progress={enrollment.overallProgress} size="sm" />
                  <p className="text-xs text-[#5C6355] mt-2">
                    {enrollment.overallProgress}% · Bloque {currentBlock?.blockId.replace('b', '')} {currentBlock?.status === 'active' ? 'activo' : ''}
                  </p>
                  <div className="mt-3 text-sm font-medium text-[#2D4A3E]">
                    Continuar →
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="bg-[#F2EDE1] border border-[#E8E0D0] rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-[#1A1C14]">{enrollments.length}</div>
          <div className="text-sm text-[#5C6355]">cursos inscritos</div>
        </div>
        <div className="bg-[#F2EDE1] border border-[#E8E0D0] rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-[#1A1C14]">{completedBlocks.length}</div>
          <div className="text-sm text-[#5C6355]">bloques completados</div>
        </div>
        <div className="bg-[#F2EDE1] border border-[#E8E0D0] rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-[#1A1C14]">{avgGrade || '-'}</div>
          <div className="text-sm text-[#5C6355]">nota promedio</div>
        </div>
      </div>
    </div>
  )
}