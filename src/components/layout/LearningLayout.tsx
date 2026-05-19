import { useState } from 'react'
import { useParams, Link, Navigate, useNavigate, Outlet } from 'react-router-dom'
import { ChevronLeft, ChevronRight, ChevronDown, ChevronUp, X, PlayCircle, CheckCircle, Lock } from 'lucide-react'
import { useAuth } from '../../context/auth'
import { getEnrollment } from '../../data/enrollments'

export default function LearningLayout({ children }: { children?: React.ReactNode }) {
  const { cursoSlug, bloqueId, unidadId } = useParams()
  const { user, isLoggedIn } = useAuth()
  const navigate = useNavigate()

  const [notesExpanded] = useState(true)
  const [expandedBlocks, setExpandedBlocks] = useState<string[]>([])

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />
  }

  const enrollment = user && cursoSlug ? getEnrollment(user.id, cursoSlug) : null
  const course = enrollment?.course

  if (!course) {
    return (
      <div className="min-h-screen bg-[#1A1C14] flex items-center justify-center">
        <div className="text-white">Cargando...</div>
      </div>
    )
  }

  const currentBlockIndex = course.blocks.findIndex(b => b.id === bloqueId)
  const currentBlock = course.blocks[currentBlockIndex]
  const blockProgress = enrollment?.blocks.find(b => b.blockId === bloqueId)

  const totalUnits = currentBlock?.unitCount || 0
  const unidadIndex = unidadId ? parseInt(unidadId) - 1 : 0

  const toggleBlock = (blockId: string) => {
    setExpandedBlocks(prev =>
      prev.includes(blockId)
        ? prev.filter(id => id !== blockId)
        : [...prev, blockId]
    )
  }

  const getBlockStatus = (blockIndex: number) => {
    const progress = enrollment?.blocks.find(b => b.blockId === `b${blockIndex + 1}`)
    if (!progress) return 'locked'
    if (blockIndex < currentBlockIndex) return 'completed'
    if (blockIndex === currentBlockIndex) {
      if (blockProgress?.status === 'active') return 'active'
      if (blockProgress?.status === 'completed') return 'completed'
      if (blockProgress?.status === 'failed') return 'failed'
      return 'not_started'
    }
    return 'locked'
  }

  const handlePrev = () => {
    if (!bloqueId || !cursoSlug) return
    if (unidadIndex > 0) {
      navigate(`/aprendizaje/${cursoSlug}/bloque/${bloqueId}/unidad/${unidadIndex}`)
    } else {
      navigate(`/aprendizaje/${cursoSlug}/bloque/${bloqueId}`)
    }
  }

  const handleNext = () => {
    if (!bloqueId || !cursoSlug) return
    if (unidadId && unidadIndex < totalUnits - 1) {
      navigate(`/aprendizaje/${cursoSlug}/bloque/${bloqueId}/unidad/${unidadIndex + 2}`)
    } else if (unidadId && unidadIndex === totalUnits - 1) {
      navigate(`/aprendizaje/${cursoSlug}/bloque/${bloqueId}/examen`)
    }
  }

  const isOnUnitPage = !!unidadId
  const isFirstUnit = unidadIndex === 0
  const isLastUnit = unidadIndex === totalUnits - 1

  return (
    <div className="min-h-screen bg-[#1A1C14] flex flex-col">
      <div className="bg-[#2D4A3E] text-white px-6 h-14 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(`/aprendizaje/${cursoSlug}`)} className="cursor-pointer hover:opacity-80">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="font-medium truncate max-w-[200px] md:max-w-none">
            {course.title}
          </span>
        </div>
        <div className="text-white/70 text-sm hidden md:block">
          Bloque {bloqueId?.replace('b', '')} · U{unidadIndex + 1}/{totalUnits}
        </div>
        <Link to={`/aprendizaje/${cursoSlug}`} className="cursor-pointer hover:opacity-80">
          <X className="w-5 h-5" />
        </Link>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <aside className="w-60 bg-[#1A1C14] border-r border-white/10 overflow-y-auto shrink-0 hidden lg:block">
          <div className="p-4">
            {course.blocks.map((block, blockIndex) => {
              const status = getBlockStatus(blockIndex)
              const isExpanded = expandedBlocks.includes(block.id) || blockIndex === currentBlockIndex

              return (
                <div key={block.id} className="mb-2">
                  <button
                    onClick={() => toggleBlock(block.id)}
                    className={`w-full flex items-center gap-2 px-2 py-1.5 rounded text-left cursor-pointer ${
                      status === 'active' ? 'text-white' : status === 'completed' ? 'text-white/70' : 'text-white/40'
                    }`}
                  >
                    {status === 'completed' && <CheckCircle className="w-4 h-4 text-[#2D4A3E]" />}
                    {status === 'active' && <PlayCircle className="w-4 h-4 text-[#C9A84C]" />}
                    {status === 'locked' && <Lock className="w-4 h-4" />}
                    {status === 'not_started' && <div className="w-4 h-4 rounded-full border border-white/30" />}
                    <span className={`text-sm truncate ${status === 'completed' ? 'opacity-70' : ''}`}>
                      Bloque {blockIndex + 1}
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 ml-auto" />
                    ) : (
                      <ChevronDown className="w-4 h-4 ml-auto" />
                    )}
                  </button>

                  {isExpanded && (
                    <div className="ml-4 mt-1 space-y-1">
                      {Array.from({ length: block.unitCount }).map((_, unitIndex) => {
                        const unitNumber = unitIndex + 1
                        const isCompleted = blockProgress && unitNumber <= (blockProgress?.unitsCompleted || 0)
                        const isActive = blockProgress && unitNumber === (blockProgress?.unitsCompleted || 0) + 1
                        const isCurrentUnit = blockIndex === currentBlockIndex && unitNumber === unidadIndex + 1

                        return (
                          <button
                            key={unitNumber}
                            onClick={() => navigate(`/aprendizaje/${cursoSlug}/bloque/${block.id}/unidad/${unitNumber}`)}
                            className={`w-full flex items-center gap-2 px-2 py-1 rounded text-left cursor-pointer text-sm ${
                              isCurrentUnit
                                ? 'bg-white/10 text-white'
                                : isCompleted
                                ? 'text-white/70'
                                : 'text-white/40'
                            }`}
                          >
                            {isCompleted && <CheckCircle className="w-3 h-3 text-[#2D4A3E]" />}
                            {!isCompleted && isActive && <PlayCircle className="w-3 h-3 text-[#C9A84C]" />}
                            {!isCompleted && !isActive && <div className="w-3 h-3 rounded-full border border-white/20" />}
                            <span className={isCompleted ? 'opacity-70' : ''}>Unidad {unitNumber}</span>
                          </button>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </aside>

        <main className="flex-1 bg-[#FAF7EF] overflow-y-auto">
          {children ? children : <Outlet context={{ course, enrollment }} />}
        </main>

        <aside className={`w-60 bg-[#1A1C14] border-l border-white/10 overflow-y-auto shrink-0 hidden lg:block transition-all ${notesExpanded ? '' : 'w-0 border-l-0'}`}>
          {notesExpanded && (
            <div className="p-4">
              <div className="text-white font-medium mb-3">Mis notas</div>
              <textarea
                className="w-full h-[calc(100vh-200px)] bg-white/5 text-white placeholder-white/30 rounded-lg p-3 text-sm resize-none"
                placeholder="Escribe tus notas aquí..."
              />
            </div>
          )}
        </aside>
      </div>

      <div className="bg-[#2D4A3E] text-white px-6 h-14 flex items-center justify-between shrink-0">
        <button
          onClick={handlePrev}
          disabled={!isOnUnitPage || isFirstUnit}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors cursor-pointer ${
            !isOnUnitPage || isFirstUnit
              ? 'text-white/30 cursor-not-allowed'
              : 'text-white hover:bg-white/10'
          }`}
        >
          <ChevronLeft className="w-4 h-4" />
          Anterior
        </button>

        {isOnUnitPage && (
          <button
            onClick={handleNext}
            className="flex items-center gap-2 px-6 py-2 bg-[#C9A84C] text-[#1A1C14] rounded-lg font-medium hover:bg-[#B8970A] transition-colors cursor-pointer"
          >
            {isLastUnit ? 'Ir al examen' : 'Siguiente'}
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  )
}