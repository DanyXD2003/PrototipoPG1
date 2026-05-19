import { useState } from 'react'
import { CheckCircle, XCircle, BookOpen } from 'lucide-react'
import { adminCourses } from '../../data/adminData'
import type { AdminCourse, CourseAdminStatus } from '../../types'

function getRelativeTime(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diffTime = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return 'hoy'
  if (diffDays === 1) return 'hace 1 día'
  if (diffDays < 7) return `hace ${diffDays} días`
  return `hace ${Math.floor(diffDays / 7)} semanas`
}

function formatPrice(price: number | null): string {
  if (price === null) return 'Gratuito'
  return `Q ${price}`
}

function EmptyState({ icon: Icon, title }: { icon: typeof CheckCircle; title: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <Icon className="w-8 h-8 text-[#5C6355] mb-2" />
      <p className="text-sm text-[#5C6355]">{title}</p>
    </div>
  )
}

const tabs: { key: CourseAdminStatus; label: string }[] = [
  { key: 'pending', label: 'Pendientes' },
  { key: 'approved', label: 'Aprobados' },
  { key: 'rejected', label: 'Rechazados' },
]

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<AdminCourse[]>(adminCourses)
  const [activeTab, setActiveTab] = useState<CourseAdminStatus>('pending')
  const [rejectModal, setRejectModal] = useState<string | null>(null)
  const [rejectReason, setRejectReason] = useState('')

  const filteredCourses = courses.filter(c => c.status === activeTab)

  const handleApprove = (id: string) => {
    setCourses(prev => prev.map(c => c.id === id ? { ...c, status: 'approved' } : c))
  }

  const handleReject = (id: string) => {
    setCourses(prev => prev.map(c => c.id === id ? { ...c, status: 'rejected', rejectionReason: rejectReason } : c))
    setRejectModal(null)
    setRejectReason('')
  }

  const getCounts = () => ({
    pending: courses.filter(c => c.status === 'pending').length,
    approved: courses.filter(c => c.status === 'approved').length,
    rejected: courses.filter(c => c.status === 'rejected').length,
  })

  const counts = getCounts()

  return (
    <div className="max-w-6xl">
      <h1 className="text-2xl font-bold text-[#1A1C14] mb-6">Moderación de cursos</h1>

      <div className="flex gap-2 mb-6 border-b border-[#E8E0D0]">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors cursor-pointer ${
              activeTab === tab.key
                ? 'border-[#2D4A3E] text-[#2D4A3E]'
                : 'border-transparent text-[#5C6355] hover:text-[#1A1C14]'
            }`}
          >
            {tab.label} ({counts[tab.key]})
          </button>
        ))}
      </div>

      {filteredCourses.length === 0 ? (
        <EmptyState
          icon={activeTab === 'pending' ? CheckCircle : activeTab === 'approved' ? BookOpen : XCircle}
          title={
            activeTab === 'pending' ? 'No hay cursos pendientes'
            : activeTab === 'approved' ? 'No hay cursos aprobados aún'
            : 'No hay cursos rechazados'
          }
        />
      ) : (
        <div className="space-y-4">
          {filteredCourses.map(course => (
            <div
              key={course.id}
              className="bg-white border border-[#E8E0D0] rounded-xl p-5"
            >
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-[#1A1C14] mb-1">{course.title}</h3>
                  <p className="text-sm text-[#5C6355]">
                    {course.orgName} · {course.category} · {course.blockCount} bloques · {formatPrice(course.price)}
                  </p>
                  <p className="text-xs text-[#5C6355] mt-1">Enviado {getRelativeTime(course.submittedAt)}</p>

                  {course.status === 'rejected' && course.rejectionReason && (
                    <div className="mt-3 p-3 bg-red-50 border border-red-100 rounded-lg">
                      <p className="text-xs text-red-700 font-medium">Motivo:</p>
                      <p className="text-xs text-red-600 mt-1">{course.rejectionReason}</p>
                    </div>
                  )}

                  {course.status === 'approved' && (
                    <span className="inline-flex items-center gap-1 mt-2 px-2 py-1 rounded-md text-xs font-medium bg-green-100 text-green-700">
                      <CheckCircle className="w-3 h-3" />
                      Aprobado
                    </span>
                  )}
                </div>

                {course.status === 'pending' && (
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => setRejectModal(course.id)}
                      className="px-4 py-2 text-sm text-red-600 border border-red-200 rounded-lg hover:bg-red-50 cursor-pointer"
                    >
                      Rechazar
                    </button>
                    <button
                      onClick={() => handleApprove(course.id)}
                      className="px-4 py-2 text-sm text-white bg-[#2D4A3E] rounded-lg hover:bg-[#2D4A3E]/90 cursor-pointer"
                    >
                      Aprobar
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {rejectModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-semibold text-[#1A1C14] mb-2">Motivo del rechazo *</h3>
            <p className="text-sm text-[#5C6355] mb-4">Por favor describe por qué el curso no cumple los estándares.</p>
            <textarea
              value={rejectReason}
              onChange={e => setRejectReason(e.target.value)}
              className="w-full border border-[#E8E0D0] rounded-lg p-3 text-sm mb-4 focus:outline-none focus:border-[#2D4A3E]"
              rows={4}
              placeholder="Describe el motivo..."
            />
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => { setRejectModal(null); setRejectReason('') }}
                className="px-4 py-2 text-sm text-[#5C6355] hover:bg-[#F2EDE1] rounded-lg cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleReject(rejectModal)}
                className="px-4 py-2 text-sm text-white bg-red-600 hover:bg-red-700 rounded-lg cursor-pointer"
              >
                Confirmar rechazo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}