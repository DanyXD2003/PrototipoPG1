import { useState } from 'react'
import { useParams, Link, Navigate } from 'react-router-dom'
import { GripVertical, Plus } from 'lucide-react'
import CourseEditNav from '../../components/creator/CourseEditNav'
import { getCreatorCourse, CREATOR_ORG_SLUG } from '../../data/creatorData'
import Button from '../../components/ui/Button'
import Toast from '../../components/ui/Toast'

export default function CourseBlocksPage() {
  const { courseSlug } = useParams<{ courseSlug: string }>()
  const orgSlug = CREATOR_ORG_SLUG
  const { course, data } = getCreatorCourse(orgSlug, courseSlug || '') ?? {}

  const [showAddModal, setShowAddModal] = useState(false)
  const [newBlockName, setNewBlockName] = useState('')
  const [toast, setToast] = useState<{ visible: boolean; message: string }>({ visible: false, message: '' })

  if (!course || !data) {
    return <Navigate to="/creator/cursos" replace />
  }

  const handleAddBlock = () => {
    if (newBlockName.trim()) {
      setToast({ visible: true, message: 'Bloque añadido — ahora configúralo' })
      setShowAddModal(false)
      setNewBlockName('')
    }
  }

  return (
    <div>
      <CourseEditNav courseSlug={courseSlug || ''} activeTab="bloques" />

      <div className="px-6 py-8 max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-semibold text-[#1A1C14]">Bloques del curso</h1>
          <Button variant="primary" onClick={() => setShowAddModal(true)}>
            <Plus className="w-4 h-4 mr-2 inline" />
            Añadir bloque
          </Button>
        </div>

        <div className="space-y-4">
          {course.blocks.map((block, index) => (
            <div
              key={block.id}
              className="bg-white border border-[#E8E0D0] rounded-xl p-4 hover:border-[#2D4A3E]/30 hover:shadow-sm transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#F2EDE1] text-[#2D4A3E] font-bold shrink-0">
                  {index + 1}
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <GripVertical className="w-4 h-4 text-[#5C6355] cursor-grab" />
                    <h3 className="font-medium text-[#1A1C14]">{block.title}</h3>
                  </div>
                  <p className="text-sm text-[#5C6355] mb-3">
                    {block.unitCount} unidades · {block.durationDays} días · Nota mínima: 70
                  </p>
                  <div className="flex gap-3">
                    <Link
                      to={`/creator/cursos/${courseSlug}/bloques/${block.id}/editar`}
                      className="text-sm text-[#2D4A3E] border border-[#2D4A3E] px-3 py-1 rounded-lg hover:bg-[#2D4A3E] hover:text-white transition-colors cursor-pointer"
                    >
                      Editar
                    </Link>
                    <Link
                      to={`/creator/cursos/${courseSlug}/bloques/${block.id}/unidades`}
                      className="text-sm text-[#2D4A3E] border border-[#2D4A3E] px-3 py-1 rounded-lg hover:bg-[#2D4A3E] hover:text-white transition-colors cursor-pointer"
                    >
                      Unidades ({block.unitCount})
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <p className="text-sm text-[#5C6355] mt-6 text-center">
          El orden de los bloques define la ruta de aprendizaje.<br />
          Los estudiantes deben completar cada bloque para avanzar.
        </p>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-[#1A1C14] mb-4">Añadir nuevo bloque</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-[#1A1C14] mb-2">Nombre del bloque</label>
              <input
                type="text"
                value={newBlockName}
                onChange={(e) => setNewBlockName(e.target.value)}
                placeholder="ej: Introducción al tema"
                autoFocus
                className="w-full px-4 py-3 rounded-lg border border-[#E8E0D0] focus:border-[#2D4A3E] focus:ring-1 focus:ring-[#2D4A3E]"
              />
            </div>
            <div className="flex gap-3 mt-4">
              <Button variant="outline" className="flex-1" onClick={() => setShowAddModal(false)}>
                Cancelar
              </Button>
              <Button variant="primary" className="flex-1" onClick={handleAddBlock}>
                Añadir
              </Button>
            </div>
          </div>
        </div>
      )}

      <Toast
        visible={toast.visible}
        message={toast.message}
        type="success"
        onHide={() => setToast({ visible: false, message: '' })}
      />
    </div>
  )
}