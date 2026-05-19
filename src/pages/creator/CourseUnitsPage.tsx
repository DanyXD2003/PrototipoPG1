import { useState } from 'react'
import { useParams, Link, Navigate } from 'react-router-dom'
import { ChevronLeft, GripVertical, PlayCircle, FileText, Code2, ClipboardList, Plus } from 'lucide-react'
import CourseEditNav from '../../components/creator/CourseEditNav'
import { getCreatorCourse, CREATOR_ORG_SLUG } from '../../data/creatorData'

type UnitType = 'video' | 'material' | 'exercise' | 'exam'

interface Unit {
  id: string
  title: string
  type: UnitType
}

export default function CourseUnitsPage() {
  const { courseSlug, bloqueId } = useParams<{ courseSlug: string; bloqueId: string }>()
  const { course } = getCreatorCourse(CREATOR_ORG_SLUG, courseSlug || '') ?? {}

  const block = course?.blocks.find(b => b.id === bloqueId)

  const [showAddMenu, setShowAddMenu] = useState(false)
  const [units, setUnits] = useState<Unit[]>(() => {
    return [
      { id: 'u1', title: 'Introducción a los Microservicios', type: 'video' },
      { id: 'u2', title: 'Lectura: El libro de los 12 factores', type: 'material' },
      { id: 'u3', title: 'Ejercicio: Descomponer un monolito', type: 'exercise' },
      { id: 'u4', title: 'Examen del bloque', type: 'exam' },
    ]
  })

  if (!course || !block) {
    return <Navigate to="/creator/cursos" replace />
  }

  const getUnitIcon = (type: UnitType) => {
    switch (type) {
      case 'video': return <PlayCircle className="w-5 h-5 text-blue-500" />
      case 'material': return <FileText className="w-5 h-5 text-green-500" />
      case 'exercise': return <Code2 className="w-5 h-5 text-purple-500" />
      case 'exam': return <ClipboardList className="w-5 h-5 text-orange-500" />
    }
  }

  const addUnit = (type: UnitType) => {
    const newUnit: Unit = {
      id: `u${Date.now()}`,
      title: 'Nueva unidad',
      type,
    }
    setUnits([...units, newUnit])
    setShowAddMenu(false)
  }

  return (
    <div>
      <CourseEditNav courseSlug={courseSlug || ''} activeTab="bloques" />

      <div className="px-6 py-8 max-w-4xl mx-auto">
        <Link
          to={`/creator/cursos/${courseSlug}/bloques`}
          className="flex items-center gap-1 text-sm text-[#5C6355] hover:text-[#2D4A3E] transition-colors cursor-pointer mb-6"
        >
          <ChevronLeft className="w-4 h-4" />
          Bloques del curso
        </Link>

        <div className="mb-6">
          <h1 className="text-xl font-semibold text-[#1A1C14]">
            Bloque {course.blocks.findIndex(b => b.id === bloqueId) + 1}: {block.title}
          </h1>
          <p className="text-[#5C6355]">{units.length} unidades</p>
        </div>

        <div className="space-y-3">
          {units.map((unit, index) => (
            <div
              key={unit.id}
              className="bg-white border border-[#E8E0D0] rounded-lg p-3 flex items-center gap-3 hover:border-[#2D4A3E]/30 transition-colors"
            >
              <GripVertical className="w-4 h-4 text-[#5C6355] cursor-grab shrink-0" />
              {getUnitIcon(unit.type)}
              <span className="flex-1 font-medium text-[#1A1C14]">{index + 1}. {unit.title}</span>
              <Link
                to={`/creator/cursos/${courseSlug}/bloques/${bloqueId}/unidades/${unit.id}`}
                className="text-sm text-[#2D4A3E] border border-[#2D4A3E] px-3 py-1 rounded-lg hover:bg-[#2D4A3E] hover:text-white transition-colors cursor-pointer"
              >
                Editar
              </Link>
            </div>
          ))}
        </div>

        <div className="mt-6 relative">
          <button
            onClick={() => setShowAddMenu(!showAddMenu)}
            className="flex items-center gap-2 bg-[#C9A84C] text-[#1A1C14] px-4 py-2 rounded-lg font-medium hover:bg-[#B8970A] transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Añadir unidad ▾
          </button>

          {showAddMenu && (
            <div className="absolute left-0 top-full mt-2 bg-white border border-[#E8E0D0] rounded-lg shadow-lg z-10 min-w-[200px]">
              <button
                onClick={() => addUnit('video')}
                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-[#1A1C14] hover:bg-[#F2EDE1] cursor-pointer text-left"
              >
                <PlayCircle className="w-4 h-4 text-blue-500" />
                Video
              </button>
              <button
                onClick={() => addUnit('material')}
                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-[#1A1C14] hover:bg-[#F2EDE1] cursor-pointer text-left"
              >
                <FileText className="w-4 h-4 text-green-500" />
                Material
              </button>
              <button
                onClick={() => addUnit('exercise')}
                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-[#1A1C14] hover:bg-[#F2EDE1] cursor-pointer text-left"
              >
                <Code2 className="w-4 h-4 text-purple-500" />
                Ejercicio
              </button>
              <button
                onClick={() => addUnit('exam')}
                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-[#1A1C14] hover:bg-[#F2EDE1] cursor-pointer text-left"
              >
                <ClipboardList className="w-4 h-4 text-orange-500" />
                Examen
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}