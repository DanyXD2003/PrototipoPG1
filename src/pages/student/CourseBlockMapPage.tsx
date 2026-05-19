import { useParams, useNavigate, Link } from 'react-router-dom'
import { Lock } from 'lucide-react'
import { useAuth } from '../../context/auth'
import { getEnrollment } from '../../data/enrollments'
import CountdownTimer from '../../components/learning/CountdownTimer'
import ProgressBar from '../../components/learning/ProgressBar'
import GradeBadge from '../../components/learning/GradeBadge'

export default function CourseBlockMapPage() {
  const { cursoSlug } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  const enrollment = user && cursoSlug ? getEnrollment(user.id, cursoSlug) : null
  const course = enrollment?.course

  if (!course) {
    navigate(`/cursos/${cursoSlug}`)
    return null
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  const getBlockInfo = (blockId: string) => {
    return enrollment?.blocks.find(b => b.blockId === blockId)
  }

  return (
    <div className="min-h-screen bg-[#FAF7EF]">
      <div className="relative h-48 md:h-56">
        <img
          src={course.coverImage}
          alt={course.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A1C14]/80 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <Link
            to="/mis-cursos"
            className="inline-flex items-center gap-1 text-white/80 hover:text-white mb-4 cursor-pointer"
          >
            ← Volver a Mis cursos
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
            {course.title}
          </h1>
          <div className="flex items-center gap-4 text-white/80 text-sm">
            <span>{course.organization.name}</span>
            <span>·</span>
            <span>Progreso: {enrollment?.overallProgress || 0}%</span>
          </div>
          <div className="mt-3 max-w-xs">
            <ProgressBar progress={enrollment?.overallProgress || 0} size="sm" color="bg-[#C9A84C]" />
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-8">
        <h2 className="text-lg font-semibold text-[#1A1C14] mb-6">Temario del curso</h2>

        <div className="relative">
          <div className="absolute left-4 top-8 bottom-8 w-0.5 bg-[#E8E0D0]" />

          <div className="space-y-6">
            {course.blocks.map((block, index) => {
              const progress = getBlockInfo(block.id)
              const status = progress?.status
              const isActive = status === 'active'
              const isCompleted = status === 'completed'
              const isFailed = status === 'failed'
              const isLocked = status === 'locked' || (status === undefined && index > 0 && !isCompleted && !isActive)

              return (
                <div
                  key={block.id}
                  className={`relative pl-12 ${
                    isLocked ? 'opacity-60' : ''
                  }`}
                >
                  <div
                    className={`absolute left-2 w-4 h-4 rounded-full border-2 ${
                      isCompleted
                        ? 'bg-[#2D4A3E] border-[#2D4A3E]'
                        : isActive
                        ? 'bg-[#C9A84C] border-[#C9A84C]'
                        : isFailed
                        ? 'bg-red-500 border-red-500'
                        : 'bg-[#FAF7EF] border-[#E8E0D0]'
                    }`}
                    style={{ top: '6px' }}
                  />

                  <div
                    className={`bg-[#F2EDE1] border rounded-xl p-4 ${
                      isActive
                        ? 'border-[#C9A84C] shadow-md'
                        : isCompleted
                        ? 'border-[#2D4A3E]/30'
                        : 'border-[#E8E0D0]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <h3 className="font-semibold text-[#1A1C14]">
                        Bloque {index + 1}: {block.title}
                      </h3>
                      {isCompleted && progress?.grade && (
                        <GradeBadge grade={progress.grade} />
                      )}
                      {isFailed && progress?.grade && (
                        <GradeBadge grade={progress.grade} />
                      )}
                    </div>

                    {isCompleted && progress?.completedAt && (
                      <p className="text-sm text-[#5C6355] mb-3">
                        ✓ Completado · Nota: {progress.grade} · {formatDate(progress.completedAt)}
                      </p>
                    )}

                    {isActive && progress?.expiresAt && (
                      <div className="mb-3">
                        <CountdownTimer expiresAt={progress.expiresAt} size="md" />
                      </div>
                    )}

                    {isActive && (
                      <div className="mb-3">
                        <ProgressBar
                          progress={(progress?.unitsCompleted || 0) / block.unitCount * 100}
                          size="sm"
                        />
                        <p className="text-xs text-[#5C6355] mt-1">
                          {progress?.unitsCompleted || 0}/{block.unitCount} unidades completadas
                        </p>
                      </div>
                    )}

                    {isLocked && (
                      <p className="text-sm text-[#5C6355] flex items-center gap-2">
                        <Lock className="w-4 h-4" />
                        Bloqueado — completa el Bloque {index} primero
                      </p>
                    )}

                    <div className="mt-3 flex gap-2">
                      {isActive && (
                        <Link
                          to={`/aprendizaje/${course.slug}/bloque/${block.id}`}
                          className="inline-block bg-[#C9A84C] text-[#1A1C14] px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#B8970A] transition-colors cursor-pointer"
                        >
                          Continuar bloque →
                        </Link>
                      )}
                      {isCompleted && (
                        <Link
                          to={`/aprendizaje/${course.slug}/bloque/${block.id}/resultados`}
                          className="inline-block bg-[#F2EDE1] text-[#2D4A3E] border border-[#2D4A3E]/30 px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#E8E0D0] transition-colors cursor-pointer"
                        >
                          Ver resultados
                        </Link>
                      )}
                      {isFailed && (
                        <Link
                          to={`/aprendizaje/${course.slug}/bloque/${block.id}/reintentar`}
                          className="inline-block bg-red-100 text-red-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-200 transition-colors cursor-pointer"
                        >
                          Reintentar bloque
                        </Link>
                      )}
                      {status === 'not_started' && index === 0 && (
                        <Link
                          to={`/aprendizaje/${course.slug}/bloque/${block.id}`}
                          className="inline-block bg-[#2D4A3E] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#4A7C59] transition-colors cursor-pointer"
                        >
                          Iniciar bloque
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}