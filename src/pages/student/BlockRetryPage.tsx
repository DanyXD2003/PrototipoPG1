import { useParams, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/auth'
import { getEnrollment } from '../../data/enrollments'
import { RefreshCcw } from 'lucide-react'

export default function BlockRetryPage() {
  const { cursoSlug, bloqueId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  const enrollment = user && cursoSlug ? getEnrollment(user.id, cursoSlug) : null
  const blockProgress = enrollment?.blocks.find(b => b.blockId === bloqueId)
  const blockIndex = enrollment?.course.blocks.findIndex(b => b.id === bloqueId)
  const block = enrollment?.course.blocks[blockIndex || 0]

  const originalTime = block?.durationDays || 14
  const retryTime = Math.ceil(originalTime / 2)
  const previousGrade = blockProgress?.grade || 0

  const handleRetry = () => {
    navigate(`/aprendizaje/${cursoSlug}/bloque/${bloqueId}`)
  }

  const handleCancel = () => {
    navigate(-1)
  }

  if (!enrollment || !block) {
    return (
      <div className="min-h-screen bg-[#FAF7EF] flex items-center justify-center">
        <p className="text-[#5C6355]">Cargando...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FAF7EF] flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[#C9A84C]/10 flex items-center justify-center">
          <RefreshCcw className="w-8 h-8 text-[#C9A84C]" />
        </div>

        <h1 className="text-2xl font-bold text-[#1A1C14] mb-4">
          ¿Reintentar el bloque?
        </h1>

        <p className="text-[#5C6355] mb-6">
          Entendemos que ya avanzaste parte del contenido, por lo que el tiempo de reintento será menor.
        </p>

        <div className="flex gap-4 mb-6">
          <div className="flex-1 bg-[#F2EDE1] border border-[#E8E0D0] rounded-xl p-4">
            <div className="text-sm text-[#5C6355] mb-1">Tiempo original</div>
            <div className="text-2xl font-bold text-[#1A1C14]">{originalTime} días</div>
          </div>
          <div className="flex-1 bg-[#C9A84C]/10 border border-[#C9A84C]/30 rounded-xl p-4">
            <div className="text-sm text-[#5C6355] mb-1">Tiempo de reintento</div>
            <div className="text-2xl font-bold text-[#C9A84C]">{retryTime} días</div>
          </div>
        </div>

        <p className="text-[#5C6355] mb-2">
          Empezarás desde la primera unidad del bloque.
        </p>
        <p className="text-[#5C6355] mb-8">
          Tu nota anterior: {previousGrade}/100
        </p>

        <div className="space-y-3">
          <button
            onClick={handleRetry}
            className="w-full bg-[#C9A84C] text-[#1A1C14] py-3 rounded-lg font-medium hover:bg-[#B8970A] transition-colors cursor-pointer"
          >
            Sí, reintentar
          </button>
          <button
            onClick={handleCancel}
            className="w-full bg-white text-[#2D4A3E] border border-[#2D4A3E]/30 py-3 rounded-lg font-medium hover:bg-[#F2EDE1] transition-colors cursor-pointer"
          >
            Cancelar
          </button>
        </div>

        <Link
          to={`/aprendizaje/${cursoSlug}`}
          className="block mt-4 text-[#5C6355] hover:text-[#2D4A3E] cursor-pointer"
        >
          ← Volver al temario del curso
        </Link>
      </div>
    </div>
  )
}