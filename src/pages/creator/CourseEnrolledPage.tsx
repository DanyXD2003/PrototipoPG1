import { useState } from 'react'
import { useParams, Navigate } from 'react-router-dom'
import { Search, Check } from 'lucide-react'
import CourseEditNav from '../../components/creator/CourseEditNav'
import { creatorStudents, getCreatorCourse, CREATOR_ORG_SLUG } from '../../data/creatorData'
import ProgressBar from '../../components/learning/ProgressBar'

function getRelativeTime(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diffTime = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return 'hoy'
  if (diffDays === 1) return 'hace 1 día'
  if (diffDays < 7) return `hace ${diffDays} días`
  if (diffDays < 30) return `hace ${Math.floor(diffDays / 7)} semanas`
  return `hace ${Math.floor(diffDays / 30)} meses`
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString('es-GT', { day: '2-digit', month: 'short', year: '2-digit' })
}


export default function CourseEnrolledPage() {
  const { courseSlug } = useParams<{ courseSlug: string }>()
  const { course, data } = getCreatorCourse(CREATOR_ORG_SLUG, courseSlug || '') ?? {}

  const [searchQuery, setSearchQuery] = useState('')

  if (!course || !data) {
    return <Navigate to="/creator/cursos" replace />
  }

  const filteredStudents = creatorStudents.filter(
    s => s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
         s.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getStatusIndicator = (status: string) => {
    switch (status) {
      case 'active':
        return <span className="w-2 h-2 rounded-full bg-green-500" title="Activo" />
      case 'inactive':
        return <span className="w-2 h-2 rounded-full bg-gray-400" title="Inactivo" />
      case 'completed':
        return <Check className="w-4 h-4 text-green-500" title="Completado" />
      default:
        return null
    }
  }

  return (
    <div>
      <CourseEditNav courseSlug={courseSlug || ''} activeTab="inscritos" />

      <div className="px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-semibold text-[#1A1C14]">
            Estudiantes inscritos ({filteredStudents.length})
          </h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5C6355]" />
            <input
              type="text"
              placeholder="Buscar estudiante..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-[#E8E0D0] rounded-lg focus:border-[#2D4A3E] focus:ring-1 focus:ring-[#2D4A3E] bg-white"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-[#5C6355] border-b border-[#E8E0D0]">
                <th className="pb-3 font-medium">Estudiante</th>
                <th className="pb-3 font-medium">Inscrito</th>
                <th className="pb-3 font-medium">Bloque actual</th>
                <th className="pb-3 font-medium">Progreso</th>
                <th className="pb-3 font-medium">Estado</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map(student => (
                <tr
                  key={student.id}
                  className="border-b border-[#E8E0D0] hover:bg-[#F2EDE1] transition-colors"
                >
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={student.avatar}
                        alt={student.name}
                        className="w-8 h-8 rounded-full"
                      />
                      <div>
                        <div className="font-medium text-[#1A1C14]">{student.name}</div>
                        <div className="text-sm text-[#5C6355]">{student.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 text-[#5C6355]">
                    {formatDate(student.enrolledAt)}
                  </td>
                  <td className="py-4 text-[#5C6355]">
                    <div className="max-w-[200px] truncate">
                      {student.currentBlockTitle}
                    </div>
                    <div className="text-xs text-[#5C6355]/70">
                      Último acceso: {getRelativeTime(student.lastAccessAt)}
                    </div>
                  </td>
                  <td className="py-4">
                    <div className="flex items-center gap-2 w-28">
                      <ProgressBar progress={student.overallProgress} size="sm" />
                    </div>
                  </td>
                  <td className="py-4">
                    {getStatusIndicator(student.status)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}