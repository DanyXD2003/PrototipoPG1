import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ChevronLeft, Upload, Trash2 } from 'lucide-react'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import Toast from '../../components/ui/Toast'
import { getCreatorCourse, CREATOR_ORG_SLUG } from '../../data/creatorData'

interface Question {
  id: string
  text: string
  options: string[]
  correctIndex: number
}

type UnitType = 'video' | 'material' | 'exercise' | 'exam'

export default function EditUnitPage() {
  const { courseSlug, bloqueId, unidadId } = useParams<{ courseSlug: string; bloqueId: string; unidadId: string }>()
  const { course } = getCreatorCourse(CREATOR_ORG_SLUG, courseSlug || '') ?? {}

  const block = course?.blocks.find(b => b.id === bloqueId)
  const unitIndex = parseInt(unidadId?.replace('u', '') || '1') - 1

  const unitTypes: UnitType[] = ['video', 'material', 'exercise', 'exam']
  const unitType: UnitType = unitIndex === (block?.unitCount ?? 0) - 1 ? 'exam' : unitTypes[unitIndex % 3]

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [toast, setToast] = useState<{ visible: boolean; message: string }>({ visible: false, message: '' })

  const [videoUrl, setVideoUrl] = useState('')
  const [duration, setDuration] = useState('')

  const [externalUrl, setExternalUrl] = useState('')
  const [selectedFile, setSelectedFile] = useState<string | null>(null)

  const [responseType, setResponseType] = useState<'text' | 'code'>('text')
  const [language, setLanguage] = useState('JavaScript')

  const [questions, setQuestions] = useState<Question[]>([
    { id: 'q1', text: '', options: ['', '', '', ''], correctIndex: 0 }
  ])

  useEffect(() => {
    if (unitType === 'video') {
      setTitle('Introducción a los Microservicios')
      setDescription('En esta unidad aprenderás los conceptos fundamentales de la arquitectura de microservicios.')
      setDuration('12')
    } else if (unitType === 'material') {
      setTitle('Lectura: El libro de los 12 factores')
      setDescription('El documento "The Twelve-Factor App" es una metodología para construir aplicaciones SaaS.')
    } else if (unitType === 'exercise') {
      setTitle('Ejercicio: Descomponer un monolito')
      setDescription('Imagina que tienes una aplicación monolítica de comercio electrónico. Tu tarea es identificar cómo descomponerla en microservicios.')
    } else if (unitType === 'exam') {
      setTitle('Examen del Bloque 1')
    }
  }, [unitType])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file.name)
    }
  }

  const handleAddQuestion = () => {
    setQuestions([...questions, { id: `q${Date.now()}`, text: '', options: ['', '', '', ''], correctIndex: 0 }])
  }

  const handleQuestionChange = (index: number, field: keyof Question, value: string | number) => {
    const updated = [...questions]
    if (field === 'text' || field === 'correctIndex') {
      updated[index][field] = value as never
    }
    setQuestions(updated)
  }

  const handleOptionChange = (qIndex: number, oIndex: number, value: string) => {
    const updated = [...questions]
    updated[qIndex].options[oIndex] = value
    setQuestions(updated)
  }

  const handleDeleteQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index))
  }

  const handleSave = () => {
    setToast({ visible: true, message: 'Cambios guardados' })
    setTimeout(() => setToast({ visible: false, message: '' }), 2000)
  }

  const getYouTubeThumbnail = (url: string) => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/)
    return match ? `https://img.youtube.com/vi/${match[1]}/mqdefault.jpg` : null
  }

  const thumbnail = videoUrl ? getYouTubeThumbnail(videoUrl) : null

  return (
    <div className="max-w-2xl mx-auto px-6 py-8">
      <Link
        to={`/creator/cursos/${courseSlug}/bloques/${bloqueId}/unidades`}
        className="flex items-center gap-1 text-sm text-[#5C6355] hover:text-[#2D4A3E] transition-colors cursor-pointer mb-6"
      >
        <ChevronLeft className="w-4 h-4" />
        Unidades del bloque
      </Link>

      <h1 className="text-2xl font-bold text-[#1A1C14] mb-6">
        {unitType === 'video' && 'Editar unidad de video'}
        {unitType === 'material' && 'Editar material'}
        {unitType === 'exercise' && 'Editar ejercicio'}
        {unitType === 'exam' && 'Editar examen'}
      </h1>

      {unitType === 'video' && (
        <div className="space-y-6">
          <Input
            id="unit-title"
            label="Título *"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <Input
            id="video-url"
            label="URL del video (YouTube / Vimeo) *"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            placeholder="https://youtube.com/watch?v=..."
            required
          />

          {thumbnail && (
            <div>
              <p className="text-sm text-[#5C6355] mb-2">Vista previa del video</p>
              <img src={thumbnail} alt="Video thumbnail" className="w-full max-w-md rounded-lg" />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-[#1A1C14] mb-2">Descripción</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 rounded-lg border border-[#E8E0D0] focus:border-[#2D4A3E] focus:ring-1 focus:ring-[#2D4A3E] transition-colors bg-white resize-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-[#1A1C14]">Duración estimada</label>
            <input
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              min={1}
              className="w-20 px-3 py-2 rounded-lg border border-[#E8E0D0] focus:border-[#2D4A3E] focus:ring-1 focus:ring-[#2D4A3E]"
            />
            <span className="text-[#5C6355]">minutos</span>
          </div>

          <Button variant="primary" onClick={handleSave}>Guardar</Button>
        </div>
      )}

      {unitType === 'material' && (
        <div className="space-y-6">
          <Input
            id="material-title"
            label="Título *"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <div>
            <label className="block text-sm font-medium text-[#1A1C14] mb-2">Descripción *</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Explica qué es este material..."
              className="w-full px-4 py-3 rounded-lg border border-[#E8E0D0] focus:border-[#2D4A3E] focus:ring-1 focus:ring-[#2D4A3E] transition-colors bg-white resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#1A1C14] mb-2">Archivo adjunto (mockup)</label>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 px-4 py-2 border border-[#E8E0D0] rounded-lg hover:bg-[#F2EDE1] cursor-pointer">
                <Upload className="w-4 h-4 text-[#5C6355]" />
                <span className="text-sm text-[#5C6355]">Subir archivo</span>
                <input type="file" className="hidden" onChange={handleFileChange} accept=".pdf,.docx,.pptx" />
              </label>
              {selectedFile && <span className="text-sm text-[#1A1C14]">{selectedFile}</span>}
            </div>
            <p className="text-xs text-[#5C6355] mt-1">Formatos: PDF, DOCX, PPTX. Máx 50MB.</p>
          </div>

          <Input
            id="external-url"
            label="URL externa (opcional)"
            value={externalUrl}
            onChange={(e) => setExternalUrl(e.target.value)}
            placeholder="https://..."
          />

          <Button variant="primary" onClick={handleSave}>Guardar</Button>
        </div>
      )}

      {unitType === 'exercise' && (
        <div className="space-y-6">
          <Input
            id="exercise-title"
            label="Título *"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <div>
            <label className="block text-sm font-medium text-[#1A1C14] mb-2">Enunciado *</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              placeholder="Describe el ejercicio..."
              className="w-full px-4 py-3 rounded-lg border border-[#E8E0D0] focus:border-[#2D4A3E] focus:ring-1 focus:ring-[#2D4A3E] transition-colors bg-white resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#1A1C14] mb-3">Tipo de respuesta</label>
            <div className="flex gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  checked={responseType === 'text'}
                  onChange={() => setResponseType('text')}
                />
                <span className="text-[#1A1C14]">Texto libre</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  checked={responseType === 'code'}
                  onChange={() => setResponseType('code')}
                />
                <span className="text-[#1A1C14]">Código</span>
              </label>
            </div>
          </div>

          {responseType === 'code' && (
            <div>
              <label className="block text-sm font-medium text-[#1A1C14] mb-2">Lenguaje</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-[#E8E0D0] focus:border-[#2D4A3E] focus:ring-1 focus:ring-[#2D4A3E] bg-white"
              >
                <option>JavaScript</option>
                <option>Python</option>
                <option>Java</option>
                <option>TypeScript</option>
                <option>Go</option>
              </select>
            </div>
          )}

          <Button variant="primary" onClick={handleSave}>Guardar</Button>
        </div>
      )}

      {unitType === 'exam' && (
        <div className="space-y-6">
          <Input
            id="exam-title"
            label="Título del examen *"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <div>
            <label className="block text-sm font-medium text-[#1A1C14] mb-4">Banco de preguntas</label>
            <div className="space-y-4">
              {questions.map((q, qIdx) => (
                <div key={q.id} className="bg-[#FAF7EF] border border-[#E8E0D0] rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-medium text-[#1A1C14]">Pregunta {qIdx + 1}</span>
                    {questions.length > 1 && (
                      <button
                        onClick={() => handleDeleteQuestion(qIdx)}
                        className="text-red-500 hover:text-red-700 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <input
                    type="text"
                    value={q.text}
                    onChange={(e) => handleQuestionChange(qIdx, 'text', e.target.value)}
                    placeholder="¿Qué es un microservicio?"
                    className="w-full px-3 py-2 mb-3 rounded border border-[#E8E0D0] focus:border-[#2D4A3E]"
                  />
                  <div className="space-y-2">
                    {q.options.map((opt, oIdx) => (
                      <div key={oIdx} className="flex items-center gap-2">
                        <input
                          type="radio"
                          name={`correct-${q.id}`}
                          checked={q.correctIndex === oIdx}
                          onChange={() => handleQuestionChange(qIdx, 'correctIndex', oIdx)}
                          className="cursor-pointer"
                        />
                        <input
                          type="text"
                          value={opt}
                          onChange={(e) => handleOptionChange(qIdx, oIdx, e.target.value)}
                          placeholder={`Opción ${String.fromCharCode(65 + oIdx)}`}
                          className={`flex-1 px-3 py-1 rounded border ${q.correctIndex === oIdx ? 'border-green-500 bg-green-50' : 'border-[#E8E0D0]'}`}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={handleAddQuestion}
              className="mt-4 text-[#2D4A3E] hover:underline cursor-pointer"
            >
              + Añadir pregunta
            </button>
          </div>

          <Button variant="primary" onClick={handleSave}>Guardar examen</Button>
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