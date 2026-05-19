import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ChevronLeft, CheckCircle } from 'lucide-react'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import { getCreatorCourse, CREATOR_ORG_SLUG } from '../../data/creatorData'

export default function EditBlockPage() {
  const { courseSlug, bloqueId } = useParams<{ courseSlug: string; bloqueId: string }>()
  const { course } = getCreatorCourse(CREATOR_ORG_SLUG, courseSlug || '') ?? {}

  const block = course?.blocks.find(b => b.id === bloqueId)

  const [title, setTitle] = useState(block?.title || '')
  const [description, setDescription] = useState('')
  const [duration, setDuration] = useState(String(block?.durationDays || 14))
  const [minGrade, setMinGrade] = useState(String(70))
  const [mode, setMode] = useState<'auto' | 'manual'>('auto')
  const [showSuccess, setShowSuccess] = useState(false)

  const handleSave = () => {
    setTimeout(() => {
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)
    }, 600)
  }

  if (!course || !block) {
    return (
      <div className="p-8 text-center">
        <p className="text-[#5C6355]">Bloque no encontrado</p>
        <Link to="/creator/cursos" className="text-[#2D4A3E] hover:underline">
          Volver a mis cursos
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-8">
      <Link
        to={`/creator/cursos/${courseSlug}/bloques`}
        className="flex items-center gap-1 text-sm text-[#5C6355] hover:text-[#2D4A3E] transition-colors cursor-pointer mb-6"
      >
        <ChevronLeft className="w-4 h-4" />
        Bloques del curso
      </Link>

      <h1 className="text-2xl font-bold text-[#1A1C14] mb-6">Editar bloque</h1>

      <div className="space-y-6">
        <Input
          id="block-title"
          label="Nombre del bloque *"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <div>
          <label className="block text-sm font-medium text-[#1A1C14] mb-2">Descripción</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe este bloque..."
            rows={3}
            className="w-full px-4 py-3 rounded-lg border border-[#E8E0D0] focus:border-[#2D4A3E] focus:ring-1 focus:ring-[#2D4A3E] transition-colors bg-white resize-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#1A1C14] mb-2">
              Tiempo disponible para el estudiante *
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                min={1}
                className="w-20 px-3 py-2 rounded-lg border border-[#E8E0D0] focus:border-[#2D4A3E] focus:ring-1 focus:ring-[#2D4A3E]"
              />
              <span className="text-[#5C6355]">días</span>
            </div>
            <p className="text-xs text-[#5C6355] mt-1">
              Tiempo que tendrá el estudiante para completar este bloque<br />
              desde que lo inicia.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#1A1C14] mb-2">
              Nota mínima de aprobación *
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={minGrade}
                onChange={(e) => setMinGrade(e.target.value)}
                min={0}
                max={100}
                className="w-20 px-3 py-2 rounded-lg border border-[#E8E0D0] focus:border-[#2D4A3E] focus:ring-1 focus:ring-[#2D4A3E]"
              />
              <span className="text-[#5C6355]">/ 100</span>
            </div>
            <p className="text-xs text-[#5C6355] mt-1">
              Los estudiantes deben obtener esta nota o más para avanzar.
            </p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#1A1C14] mb-3">
            Modo de apertura *
          </label>
          <div className="space-y-3">
            <label className={`flex items-start gap-3 p-4 border rounded-lg cursor-pointer ${mode === 'auto' ? 'border-[#2D4A3E] bg-[#F2EDE1]/50' : 'border-[#E8E0D0] hover:bg-[#F2EDE1]/50'}`}>
              <input
                type="radio"
                name="mode"
                checked={mode === 'auto'}
                onChange={() => setMode('auto')}
                className="mt-1"
              />
              <div>
                <div className="font-medium text-[#1A1C14]">Automático</div>
                <div className="text-sm text-[#5C6355]">El bloque se abre cuando el estudiante completa el anterior.</div>
              </div>
            </label>

            <label className={`flex items-start gap-3 p-4 border rounded-lg cursor-pointer ${mode === 'manual' ? 'border-[#2D4A3E] bg-[#F2EDE1]/50' : 'border-[#E8E0D0] hover:bg-[#F2EDE1]/50'}`}>
              <input
                type="radio"
                name="mode"
                checked={mode === 'manual'}
                onChange={() => setMode('manual')}
                className="mt-1"
              />
              <div>
                <div className="font-medium text-[#1A1C14]">Manual</div>
                <div className="text-sm text-[#5C6355]">El creador abre manualmente el bloque para cada estudiante.</div>
              </div>
            </label>
          </div>
        </div>

        {showSuccess && (
          <div className="flex items-center gap-2 text-green-700 bg-green-50 px-4 py-2 rounded-lg">
            <CheckCircle className="w-4 h-4" />
            <span>Cambios guardados</span>
          </div>
        )}

        <Button variant="primary" onClick={handleSave}>
          Guardar cambios
        </Button>
      </div>
    </div>
  )
}