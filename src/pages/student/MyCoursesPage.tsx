import { useState } from 'react'
import { useAuth } from '../../context/auth'
import { getUserEnrollments } from '../../data/enrollments'
import { Link } from 'react-router-dom'
import { Eye, Lock } from 'lucide-react'
import CountdownTimer from '../../components/learning/CountdownTimer'
import ProgressBar from '../../components/learning/ProgressBar'
import Toast from '../../components/ui/Toast'
import type { BlockStatus } from '../../types'

export default function MyCoursesPage() {
  const { user } = useAuth()
  const enrollments = user ? getUserEnrollments(user.id) : []
  const [activeTab, setActiveTab] = useState<'in_progress' | 'completed' | 'all'>('in_progress')
  const [visibility, setVisibility] = useState<Record<string, boolean>>({
    'enroll-4': true,
  })
  const [toast, setToast] = useState({ visible: false, message: '' })

  const setVisibilityValue = (courseId: string, isPublic: boolean) => {
    if (visibility[courseId] === isPublic) return
    setVisibility(prev => ({ ...prev, [courseId]: isPublic }))
    setToast({ visible: true, message: `Curso ahora ${isPublic ? 'público' : 'privado'} en tu perfil` })
  }

  const filteredEnrollments = enrollments.filter(e => {
    if (activeTab === 'completed') return e.completed
    if (activeTab === 'in_progress') return !e.completed
    return true
  })

  const getBlockStatus = (enrollment: typeof enrollments[0]) => {
    const block = enrollment.blocks.find(b =>
      ['active', 'not_started', 'failed', 'completed'].includes(b.status)
    )
    return block
  }

  const getStatusText = (status: BlockStatus | undefined) => {
    if (!status) return ''
    switch (status) {
      case 'active':
        return 'activo'
      case 'failed':
        return 'reprobado'
      case 'completed':
        return 'completado'
      case 'not_started':
        return 'no iniciado'
      default:
        return ''
    }
  }

  const getCTA = (enrollment: typeof enrollments[0], status: BlockStatus | undefined) => {
    if (!status) return { text: 'Ver curso', to: `/aprendizaje/${enrollment.course.slug}` }
    
    switch (status) {
      case 'active':
        return { text: 'Continuar →', to: `/aprendizaje/${enrollment.course.slug}` }
      case 'failed':
        return { text: 'Reintentar', to: `/aprendizaje/${enrollment.course.slug}` }
      case 'not_started':
        return { text: 'Comenzar →', to: `/aprendizaje/${enrollment.course.slug}` }
      default:
        return { text: 'Ver curso', to: `/aprendizaje/${enrollment.course.slug}` }
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#1A1C14]">Mis cursos ({enrollments.length})</h1>
      </div>

      <div className="flex gap-2 mb-6 border-b border-[#E8E0D0]">
        {(['in_progress', 'completed', 'all'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium cursor-pointer transition-colors border-b-2 ${
              activeTab === tab
                ? 'border-[#2D4A3E] text-[#2D4A3E]'
                : 'border-transparent text-[#5C6355] hover:text-[#2D4A3E]'
            }`}
          >
            {tab === 'in_progress' && `En progreso (${enrollments.filter(e => !e.completed).length})`}
            {tab === 'completed' && `Completados (${enrollments.filter(e => e.completed).length})`}
            {tab === 'all' && `Todos (${enrollments.length})`}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filteredEnrollments.map(enrollment => {
          const currentBlock = getBlockStatus(enrollment)
          const status = currentBlock?.status
          const cta = getCTA(enrollment, status)

          return (
            <div
              key={enrollment.id}
              className="flex flex-col md:flex-row gap-4 bg-[#F2EDE1] border border-[#E8E0D0] rounded-xl p-4"
            >
              <div className="w-full md:w-32 h-20 rounded-lg overflow-hidden shrink-0 bg-[#E8E0D0]">
                <img
                  src={enrollment.course.coverImage}
                  alt={enrollment.course.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-[#1A1C14] truncate">
                  {enrollment.course.title}
                </h3>
                <p className="text-sm text-[#5C6355] mb-2">
                  {enrollment.course.organization.name}
                </p>

                {currentBlock && (
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-sm ${
                      status === 'active' ? 'text-[#2D4A3E] font-medium' :
                      status === 'failed' ? 'text-red-600 font-medium' :
                      'text-[#5C6355]'
                    }`}>
                      Bloque {currentBlock.blockId.replace('b', '')} {getStatusText(status)}
                      {status === 'active' && currentBlock.expiresAt && (
                        <span className="ml-2 inline-flex items-center">
                          <CountdownTimer expiresAt={currentBlock.expiresAt} size="sm" />
                        </span>
                      )}
                    </span>
                    {status === 'failed' && (
                      <span className="text-xs text-red-600">— necesita reintentar</span>
                    )}
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <div className="flex-1 max-w-[200px]">
                    <ProgressBar progress={enrollment.overallProgress} size="sm" />
                  </div>
                  <span className="text-sm text-[#5C6355]">{enrollment.overallProgress}%</span>
                </div>

                {enrollment.completed && (
                  <div className="mt-3 pt-3 border-t border-[#E8E0D0]">
                    <p className="text-xs text-[#5C6355] mb-2">Visibilidad en tu perfil:</p>
                    <div className="flex gap-1">
                      <button
                        onClick={() => setVisibilityValue(enrollment.id, true)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer transition-colors ${
                          visibility[enrollment.id]
                            ? 'bg-[#2D4A3E] text-white'
                            : 'bg-[#F2EDE1] text-[#5C6355] hover:bg-[#E8E0D0]'
                        }`}
                      >
                        <Eye className="w-3.5 h-3.5" />
                        Público
                      </button>
                      <button
                        onClick={() => setVisibilityValue(enrollment.id, false)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer transition-colors ${
                          !visibility[enrollment.id]
                            ? 'bg-[#2D4A3E] text-white'
                            : 'bg-[#F2EDE1] text-[#5C6355] hover:bg-[#E8E0D0]'
                        }`}
                      >
                        <Lock className="w-3.5 h-3.5" />
                        Privado
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="shrink-0 flex items-center">
                <Link
                  to={cta.to}
                  className={`px-4 py-2 rounded-lg text-sm font-medium cursor-pointer transition-colors ${
                    status === 'active'
                      ? 'bg-[#C9A84C] text-[#1A1C14] hover:bg-[#B8970A]'
                      : status === 'failed'
                      ? 'bg-red-100 text-red-700 hover:bg-red-200'
                      : 'bg-[#2D4A3E] text-white hover:bg-[#4A7C59]'
                  }`}
                >
                  {cta.text}
                </Link>
              </div>
            </div>
          )
        })}
      </div>

      {filteredEnrollments.length === 0 && (
        <div className="text-center py-12 text-[#5C6355]">
          No hay cursos en esta categoría.
        </div>
      )}

      <Toast
        visible={toast.visible}
        message={toast.message}
        onHide={() => setToast({ visible: false, message: '' })}
      />
    </div>
  )
}