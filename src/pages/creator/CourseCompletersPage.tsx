import { useState } from 'react'
import { useParams, Navigate } from 'react-router-dom'
import { Trophy, Download } from 'lucide-react'
import CourseEditNav from '../../components/creator/CourseEditNav'
import { creatorCompleters, getCreatorCourse, CREATOR_ORG_SLUG } from '../../data/creatorData'
import Button from '../../components/ui/Button'
import Toast from '../../components/ui/Toast'
import GradeBadge from '../../components/learning/GradeBadge'

function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString('es-GT', { day: '2-digit', month: 'short', year: '2-digit' })
}

export default function CourseCompletersPage() {
  const { courseSlug } = useParams<{ courseSlug: string }>()
  const { course, data } = getCreatorCourse(CREATOR_ORG_SLUG, courseSlug || '') ?? {}

  const [toast, setToast] = useState<{ visible: boolean; message: string }>({ visible: false, message: '' })

  if (!course || !data) {
    return <Navigate to="/creator/cursos" replace />
  }

  const sortedCompleters = [...creatorCompleters].sort(
    (a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
  )

  const handleExport = () => {
    setToast({ visible: true, message: 'Exportación iniciada — recibirás el archivo por email' })
  }

  return (
    <div>
      <CourseEditNav courseSlug={courseSlug || ''} activeTab="completadores" />

      <div className="px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-semibold text-[#1A1C14]">
            Estudiantes que completaron el curso ({sortedCompleters.length})
          </h1>
          <Button variant="outline" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2 inline" />
            Exportar
          </Button>
        </div>

        {sortedCompleters.length === 0 ? (
          <div className="text-center py-16">
            <Trophy className="w-16 h-16 text-[#5C6355]/30 mx-auto mb-4" />
            <h2 className="text-lg font-medium text-[#1A1C14] mb-2">Aún ningún estudiante ha completado este curso</h2>
            <p className="text-[#5C6355]">Los estudiantes que completen el curso aparecerán aquí.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm text-[#5C6355] border-b border-[#E8E0D0]">
                  <th className="pb-3 font-medium">Estudiante</th>
                  <th className="pb-3 font-medium">Iniciado</th>
                  <th className="pb-3 font-medium">Completado</th>
                  <th className="pb-3 font-medium">Nota final</th>
                  <th className="pb-3 font-medium">Tiempo</th>
                </tr>
              </thead>
              <tbody>
                {sortedCompleters.map(student => (
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
                        <span className="font-medium text-[#1A1C14]">{student.name}</span>
                      </div>
                    </td>
                    <td className="py-4 text-[#5C6355]">
                      {formatDate(student.enrolledAt)}
                    </td>
                    <td className="py-4 text-[#5C6355]">
                      {formatDate(student.completedAt)}
                    </td>
                    <td className="py-4">
                      <GradeBadge grade={student.finalGrade} />
                    </td>
                    <td className="py-4 text-[#5C6355]">
                      {student.timeInvestedDays} días
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Toast
        visible={toast.visible}
        message={toast.message}
        type="info"
        onHide={() => setToast({ visible: false, message: '' })}
      />
    </div>
  )
}