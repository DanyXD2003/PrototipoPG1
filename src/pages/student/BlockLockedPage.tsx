import { useParams, Link } from 'react-router-dom'
import { useAuth } from '../../context/auth'
import { getEnrollment } from '../../data/enrollments'
import { Lock } from 'lucide-react'
import CountdownTimer from '../../components/learning/CountdownTimer'

export default function BlockLockedPage() {
  const { cursoSlug, bloqueId } = useParams()
  const { user } = useAuth()

  const enrollment = user && cursoSlug ? getEnrollment(user.id, cursoSlug) : null
  const course = enrollment?.course

  if (!course || !bloqueId) {
    return null
  }

  const currentBlockIndex = course.blocks.findIndex(b => b.id === bloqueId)
  const prevBlockIndex = currentBlockIndex - 1
  const prevBlock = course.blocks[prevBlockIndex]
  const prevBlockProgress = enrollment?.blocks.find(b => b.blockId === prevBlock?.id)

  const getStatusLabel = () => {
    if (!prevBlockProgress) return 'bloqueado'
    return prevBlockProgress.status
  }

  return (
    <div className="min-h-screen bg-[#FAF7EF] flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#E8E0D0] flex items-center justify-center">
          <Lock className="w-10 h-10 text-[#5C6355]" />
        </div>

        <h1 className="text-2xl font-bold text-[#1A1C14] mb-4">
          Este bloque está bloqueado
        </h1>

        <p className="text-[#5C6355] mb-6">
          Para acceder a "{course.blocks[currentBlockIndex].title}" debes completar primero:
        </p>

        <div className="bg-[#F2EDE1] border border-[#E8E0D0] rounded-xl p-4 mb-6 text-left">
          <h3 className="font-semibold text-[#1A1C14] mb-2">
            Bloque {prevBlockIndex + 1}: {prevBlock?.title}
          </h3>
          <p className="text-sm text-[#5C6355] mb-3">
            Estado: {getStatusLabel()}
            {prevBlockProgress?.status === 'active' && prevBlockProgress?.expiresAt && (
              <span className="ml-2">
                · <CountdownTimer expiresAt={prevBlockProgress.expiresAt} size="sm" />
              </span>
            )}
          </p>
          {prevBlockProgress?.status === 'active' && (
            <Link
              to={`/aprendizaje/${cursoSlug}/bloque/${prevBlock?.id}`}
              className="inline-block bg-[#C9A84C] text-[#1A1C14] px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#B8970A] transition-colors cursor-pointer"
            >
              Continuar bloque →
            </Link>
          )}
        </div>

        <Link
          to={`/aprendizaje/${cursoSlug}`}
          className="text-[#5C6355] hover:text-[#2D4A3E] cursor-pointer"
        >
          ← Volver al temario del curso
        </Link>
      </div>
    </div>
  )
}