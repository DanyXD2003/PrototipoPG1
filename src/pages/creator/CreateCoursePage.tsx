import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircle, ChevronLeft } from 'lucide-react'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import StepIndicator from '../../components/ui/StepIndicator'
import Toast from '../../components/ui/Toast'

type Step = 1 | 2 | 3

interface FormData {
  title: string
  shortDescription: string
  longDescription: string
  category: string
  level: string
  coverImage: string
  requirements: string[]
  targetAudience: string[]
  priceType: 'free' | 'paid'
  price: string
}

const CATEGORIES = [
  'Tecnología',
  'Negocios',
  'Diseño',
  'Marketing',
  'Finanzas',
  'Salud',
  'Educación',
  'Desarrollo Personal',
]

const LEVELS = ['Principiante', 'Intermedio', 'Avanzado']

export default function CreateCoursePage() {
  const navigate = useNavigate()
  const [step, setStep] = useState<Step>(1)
  const [showSuccess, setShowSuccess] = useState(false)
  const [toast, setToast] = useState<{ visible: boolean; message: string }>({ visible: false, message: '' })

  const [formData, setFormData] = useState<FormData>({
    title: '',
    shortDescription: '',
    longDescription: '',
    category: '',
    level: '',
    coverImage: '',
    requirements: [],
    targetAudience: [],
    priceType: 'free',
    price: '',
  })

  const [reqInput, setReqInput] = useState('')
  const [audienceInput, setAudienceInput] = useState('')

  const updateField = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const addRequirement = () => {
    if (reqInput.trim()) {
      setFormData(prev => ({ ...prev, requirements: [...prev.requirements, reqInput.trim()] }))
      setReqInput('')
    }
  }

  const removeRequirement = (index: number) => {
    setFormData(prev => ({ ...prev, requirements: prev.requirements.filter((_, i) => i !== index) }))
  }

  const addAudience = () => {
    if (audienceInput.trim()) {
      setFormData(prev => ({ ...prev, targetAudience: [...prev.targetAudience, audienceInput.trim()] }))
      setAudienceInput('')
    }
  }

  const removeAudience = (index: number) => {
    setFormData(prev => ({ ...prev, targetAudience: prev.targetAudience.filter((_, i) => i !== index) }))
  }

  const handleSubmit = () => {
    setTimeout(() => {
      setShowSuccess(true)
    }, 800)
  }

  if (showSuccess) {
    return (
      <div className="max-w-md mx-auto text-center py-16">
        <CheckCircle className="w-16 h-16 text-[#C9A84C] mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-[#1A1C14] mb-2">¡Curso creado exitosamente!</h2>
        <p className="text-[#5C6355] mb-8">
          "{formData.title}" ya está listo.<br />
          Ahora añade los bloques y unidades<br />
          para que los estudiantes puedan aprender.
        </p>
        <div className="flex gap-4 justify-center">
          <Button variant="primary" onClick={() => navigate('/creator/cursos/introduccion-arquitectura-microservicios/bloques')}>
            Añadir bloques →
          </Button>
          <Button variant="outline" onClick={() => navigate('/creator/cursos')}>
            Ver mis cursos
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <StepIndicator currentStep={step} totalSteps={3} />

      {step === 1 && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-[#1A1C14]">Información del curso</h2>

          <Input
            id="course-title"
            label="Título del curso *"
            value={formData.title}
            onChange={(e) => updateField('title', e.target.value)}
            placeholder="ej: Introducción a la Arquitectura de Microservicios"
            required
          />

          <div>
            <Input
              id="course-short-desc"
              label="Descripción corta *"
              value={formData.shortDescription}
              onChange={(e) => updateField('shortDescription', e.target.value.slice(0, 150))}
              placeholder="Una descripción breve de tu curso..."
              required
            />
            <p className="text-xs text-[#5C6355] mt-1">{formData.shortDescription.length}/150 caracteres</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#1A1C14] mb-2">
              Descripción completa *
            </label>
            <textarea
              value={formData.longDescription}
              onChange={(e) => updateField('longDescription', e.target.value)}
              placeholder="Describe detalladamente qué aprenderán los estudiantes..."
              rows={5}
              className="w-full px-4 py-3 rounded-lg border border-[#E8E0D0] focus:border-[#2D4A3E] focus:ring-1 focus:ring-[#2D4A3E] transition-colors bg-white resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#1A1C14] mb-2">Categoría *</label>
              <select
                value={formData.category}
                onChange={(e) => updateField('category', e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-[#E8E0D0] focus:border-[#2D4A3E] focus:ring-1 focus:ring-[#2D4A3E] bg-white"
              >
                <option value="">Selecciona...</option>
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1A1C14] mb-2">Nivel *</label>
              <select
                value={formData.level}
                onChange={(e) => updateField('level', e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-[#E8E0D0] focus:border-[#2D4A3E] focus:ring-1 focus:ring-[#2D4A3E] bg-white"
              >
                <option value="">Selecciona...</option>
                {LEVELS.map(lvl => (
                  <option key={lvl} value={lvl}>{lvl}</option>
                ))}
              </select>
            </div>
          </div>

          <Input
            id="course-cover"
            label="URL de portada"
            value={formData.coverImage}
            onChange={(e) => updateField('coverImage', e.target.value)}
            placeholder="https://picsum.photos/..."
          />

          {formData.coverImage && (
            <div className="mt-2">
              <p className="text-sm text-[#5C6355] mb-2">Vista previa:</p>
              <img
                src={formData.coverImage}
                alt="Preview"
                className="w-full max-w-sm rounded-lg object-cover"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
              />
            </div>
          )}

          <div className="flex justify-end">
            <Button
              variant="primary"
              onClick={() => setStep(2)}
              disabled={!formData.title || !formData.shortDescription || !formData.longDescription || !formData.category || !formData.level}
            >
              Continuar →
            </Button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-[#1A1C14]">¿A quién va dirigido?</h2>

          <div>
            <label className="block text-sm font-medium text-[#1A1C14] mb-2">Requisitos previos</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={reqInput}
                onChange={(e) => setReqInput(e.target.value)}
                placeholder="Agregar requisito..."
                className="flex-1 px-4 py-2 rounded-lg border border-[#E8E0D0] focus:border-[#2D4A3E] focus:ring-1 focus:ring-[#2D4A3E]"
              />
              <Button variant="outline" size="sm" onClick={addRequirement}>Añadir</Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.requirements.map((req, i) => (
                <span key={i} className="inline-flex items-center gap-1 px-3 py-1 bg-[#F2EDE1] text-[#1A1C14] rounded-full text-sm">
                  {req}
                  <button onClick={() => removeRequirement(i)} className="hover:text-red-500 cursor-pointer">×</button>
                </span>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#1A1C14] mb-2">A quién está dirigido</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={audienceInput}
                onChange={(e) => setAudienceInput(e.target.value)}
                placeholder="Agregar audiencia..."
                className="flex-1 px-4 py-2 rounded-lg border border-[#E8E0D0] focus:border-[#2D4A3E] focus:ring-1 focus:ring-[#2D4A3E]"
              />
              <Button variant="outline" size="sm" onClick={addAudience}>Añadir</Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.targetAudience.map((aud, i) => (
                <span key={i} className="inline-flex items-center gap-1 px-3 py-1 bg-[#F2EDE1] text-[#1A1C14] rounded-full text-sm">
                  {aud}
                  <button onClick={() => removeAudience(i)} className="hover:text-red-500 cursor-pointer">×</button>
                </span>
              ))}
            </div>
          </div>

          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setStep(1)}>
              <ChevronLeft className="w-4 h-4 mr-1 inline" />
              Atrás
            </Button>
            <Button variant="primary" onClick={() => setStep(3)}>
              Continuar →
            </Button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-[#1A1C14]">Precio y publicación</h2>

          <div className="space-y-4">
            <label className="flex items-start gap-3 p-4 border border-[#E8E0D0] rounded-lg cursor-pointer hover:bg-[#F2EDE1]/50">
              <input
                type="radio"
                name="priceType"
                checked={formData.priceType === 'free'}
                onChange={() => setFormData(prev => ({ ...prev, priceType: 'free' }))}
                className="mt-1"
              />
              <div>
                <div className="font-medium text-[#1A1C14]">Gratuito</div>
                <div className="text-sm text-[#5C6355]">Los estudiantes pueden inscribirse sin costo</div>
              </div>
            </label>

            <label className={`flex items-start gap-3 p-4 border rounded-lg cursor-pointer ${formData.priceType === 'paid' ? 'border-[#2D4A3E] bg-[#F2EDE1]/50' : 'border-[#E8E0D0] hover:bg-[#F2EDE1]/50'}`}>
              <input
                type="radio"
                name="priceType"
                checked={formData.priceType === 'paid'}
                onChange={() => setFormData(prev => ({ ...prev, priceType: 'paid' }))}
                className="mt-1"
              />
              <div className="flex-1">
                <div className="font-medium text-[#1A1C14]">De pago</div>
                <div className="text-sm text-[#5C6355] mb-2">Define el precio en Quetzales</div>
                {formData.priceType === 'paid' && (
                  <div className="flex items-center gap-2">
                    <span className="text-[#5C6355]">Q</span>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => updateField('price', e.target.value)}
                      placeholder="0"
                      min={1}
                      className="w-32 px-4 py-2 rounded-lg border border-[#E8E0D0] focus:border-[#2D4A3E] focus:ring-1 focus:ring-[#2D4A3E]"
                    />
                  </div>
                )}
              </div>
            </label>
          </div>

          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setStep(2)}>
              <ChevronLeft className="w-4 h-4 mr-1 inline" />
              Atrás
            </Button>
            <Button
              variant="primary"
              onClick={handleSubmit}
              disabled={formData.priceType === 'paid' && !formData.price}
            >
              Publicar curso
            </Button>
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