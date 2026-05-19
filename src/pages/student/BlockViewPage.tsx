import { useParams, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/auth'
import { getEnrollment } from '../../data/enrollments'
import { PlayCircle, FileText, Code2, CheckCircle } from 'lucide-react'
import CountdownTimer from '../../components/learning/CountdownTimer'
import ProgressBar from '../../components/learning/ProgressBar'

export default function BlockViewPage() {
  const { cursoSlug, bloqueId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  const enrollment = user && cursoSlug ? getEnrollment(user.id, cursoSlug) : null
  const course = enrollment?.course

  if (!course) {
    navigate(`/cursos/${cursoSlug}`)
    return null
  }

  const blockIndex = course.blocks.findIndex(b => b.id === bloqueId)
  const block = course.blocks[blockIndex]
  const blockProgress = enrollment?.blocks.find(b => b.blockId === bloqueId)

  if (!block) {
    navigate(`/aprendizaje/${cursoSlug}`)
    return null
  }

  const unitTypes = ['video', 'material', 'ejercicio'] as const
  const unitDurations = [
    '12 min', '8 min', '15 min', '10 min', '18 min'
  ]

  const getUnitTypeIcon = (type: string) => {
    switch (type) {
      case 'video':
        return PlayCircle
      case 'material':
        return FileText
      case 'ejercicio':
        return Code2
      default:
        return FileText
    }
  }

  const getUnitTypeLabel = (type: string) => {
    switch (type) {
      case 'video':
        return 'Video'
      case 'material':
        return 'Material'
      case 'ejercicio':
        return 'Ejercicio'
      default:
        return ''
    }
  }

  const isExpired = blockProgress?.status === 'expired'
  const isCompleted = blockProgress?.status === 'completed'

  return (
    <div className="min-h-screen bg-[#FAF7EF]">
      {(isExpired || isCompleted) && (
        <div className={`px-6 py-3 ${isExpired ? 'bg-red-50' : 'bg-green-50'}`}>
          <p className={`text-center text-sm ${isExpired ? 'text-red-700' : 'text-green-700'}`}>
            {isExpired
              ? 'El tiempo de este bloque se ha agotado. Puedes reintentar el bloque.'
              : 'Este bloque ya ha sido completado.'}
          </p>
        </div>
      )}

      <div className="max-w-3xl mx-auto px-6 py-8">
        <Link
          to={`/aprendizaje/${cursoSlug}`}
          className="inline-flex items-center gap-1 text-[#5C6355] hover:text-[#2D4A3E] mb-6 cursor-pointer"
        >
          ← Volver al curso
        </Link>

        <h1 className="text-2xl font-bold text-[#1A1C14] mb-2">
          Bloque {blockIndex + 1}: {block.title}
        </h1>

        <div className="border-b border-[#E8E0D0] pb-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
            <div>
              <span className="text-sm text-[#5C6355]">Tiempo restante: </span>
              {blockProgress?.expiresAt ? (
                <CountdownTimer expiresAt={blockProgress.expiresAt} size="md" />
              ) : (
                <span className="text-[#5C6355]">Sin límite</span>
              )}
            </div>
            <div className="flex-1">
              <div className="text-sm text-[#5C6355] mb-1">
                Progreso: {blockProgress?.unitsCompleted || 0}/{block.unitCount}
              </div>
              <ProgressBar
                progress={((blockProgress?.unitsCompleted || 0) / block.unitCount) * 100}
                size="md"
              />
            </div>
          </div>
        </div>

        <h2 className="text-lg font-semibold text-[#1A1C14] mb-4">Unidades del bloque:</h2>

        <div className="space-y-3">
          {Array.from({ length: block.unitCount }).map((_, unitIndex) => {
            const unitNumber = unitIndex + 1
            const type = unitTypes[unitIndex % 3]
            const isCompleted = blockProgress && unitNumber <= (blockProgress?.unitsCompleted || 0)
            const isInProgress = blockProgress && unitNumber === (blockProgress?.unitsCompleted || 0) + 1
            const Icon = getUnitTypeIcon(type)

            return (
              <Link
                key={unitNumber}
                to={`/aprendizaje/${cursoSlug}/bloque/${bloqueId}/unidad/${unitNumber}`}
                className={`block border rounded-xl p-4 transition-all cursor-pointer ${
                  isInProgress
                    ? 'border-l-4 border-l-[#C9A84C] bg-[#FAF7EF] border-[#E8E0D0]'
                    : isCompleted
                    ? 'border-[#E8E0D0] bg-[#F2EDE1] opacity-70 hover:opacity-100'
                    : 'border-[#E8E0D0] bg-white hover:bg-[#F2EDE1]'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="shrink-0">
                    {isCompleted ? (
                      <CheckCircle className="w-6 h-6 text-[#2D4A3E]" />
                    ) : isInProgress ? (
                      <div className="w-6 h-6 rounded-full bg-[#C9A84C] flex items-center justify-center">
                        <PlayCircle className="w-4 h-4 text-white" />
                      </div>
                    ) : (
                      <div className="w-6 h-6 rounded-full border-2 border-[#E8E0D0]" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[#5C6355]">{unitNumber}.</span>
                      <span className="font-medium text-[#1A1C14]">
                        {type === 'video'
                          ? `Unidad ${unitNumber}: Contenido en video`
                          : type === 'material'
                          ? `Unidad ${unitNumber}: Material de lectura`
                          : `Unidad ${unitNumber}: Ejercicio práctico`}
                      </span>
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-2 text-sm text-[#5C6355]">
                    <Icon className="w-4 h-4" />
                    <span>{getUnitTypeLabel(type)}</span>
                    {type === 'video' && (
                      <span className="ml-1">{unitDurations[unitIndex]}</span>
                    )}
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        <div className="mt-8 pt-6 border-t border-[#E8E0D0]">
          <Link
            to={`/aprendizaje/${cursoSlug}/bloque/${bloqueId}/examen`}
            className="inline-block bg-[#2D4A3E] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#4A7C59] transition-colors cursor-pointer"
          >
            Examen final del bloque
          </Link>
        </div>
      </div>
    </div>
  )
}