import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import CountdownTimer from '../../components/learning/CountdownTimer'
import { getEnrollment } from '../../data/enrollments'
import { useAuth } from '../../context/auth'
import type { ExamQuestion } from '../../types'

const mockQuestions: ExamQuestion[] = [
  {
    id: 'q1',
    question: '¿Qué significa el acrónimo REST en el contexto de APIs?',
    options: [
      'Remote Execution Service Technology',
      'Representational State Transfer',
      'Real-time Event Streaming Transport',
      'Resource Endpoint Structure Technology',
    ],
    correctIndex: 1,
  },
  {
    id: 'q2',
    question: '¿Cuál es el código de respuesta HTTP correcto para un recurso creado exitosamente?',
    options: [
      '200 OK',
      '201 Created',
      '204 No Content',
      '400 Bad Request',
    ],
    correctIndex: 1,
  },
  {
    id: 'q3',
    question: '¿Qué método HTTP se utiliza para actualizar un recurso existente de forma completa?',
    options: [
      'PUT',
      'PATCH',
      'POST',
      'UPDATE',
    ],
    correctIndex: 0,
  },
  {
    id: 'q4',
    question: 'En una arquitectura de microservicios, ¿cuál es el propósito de un API Gateway?',
    options: [
      'Almacenar datos de los servicios',
      'Actuar como punto único de entrada para los clientes',
      'Reemplazar las bases de datos de los servicios',
      'Generar documentación automática',
    ],
    correctIndex: 1,
  },
  {
    id: 'q5',
    question: '¿Qué principio de diseño sugiere que cada servicio debe tener su propia base de datos?',
    options: [
      'Monolito distribuido',
      'Database per Service',
      'Shared database',
      'Data lake centralizado',
    ],
    correctIndex: 1,
  },
]

export default function BlockExamPage() {
  const { cursoSlug, bloqueId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  const enrollment = user && cursoSlug ? getEnrollment(user.id, cursoSlug) : null
  const blockProgress = enrollment?.blocks.find(b => b.blockId === bloqueId)
  const expiresAt = blockProgress?.expiresAt ?? new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString()

  const [currentQ, setCurrentQ] = useState(0)
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [submitted] = useState(false)

  const question = mockQuestions[currentQ]
  const totalQuestions = mockQuestions.length

  const handleSelect = (optionIndex: number) => {
    if (submitted) return
    setAnswers(prev => ({ ...prev, [currentQ]: optionIndex }))
  }

  const handleNext = () => {
    if (currentQ < totalQuestions - 1) {
      setCurrentQ(prev => prev + 1)
    }
  }

  const handleFinish = () => {
    const correct = mockQuestions.reduce((count, q, idx) => {
      return count + (answers[idx] === q.correctIndex ? 1 : 0)
    }, 0)
    const grade = Math.round((correct / totalQuestions) * 100)

    navigate(`/aprendizaje/${cursoSlug}/bloque/${bloqueId}/resultados`, {
      state: { grade, totalQuestions, correctAnswers: correct },
    })
  }

  const progress = ((currentQ + 1) / totalQuestions) * 100
  const hasAnswer = answers[currentQ] !== undefined
  const isLastQuestion = currentQ === totalQuestions - 1

  return (
    <div className="min-h-screen bg-[#FAF7EF]">
      <div className="max-w-2xl mx-auto px-6 py-8">
        <div className="bg-[#F2EDE1] rounded-xl p-6 mb-8">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-lg font-semibold text-[#1A1C14]">
              Examen: Bloque {bloqueId?.replace('b', '')}
            </h1>
            <CountdownTimer expiresAt={expiresAt} size="sm" />
          </div>
          <div className="text-sm text-[#5C6355]">
            Pregunta {currentQ + 1} de {totalQuestions}
          </div>
          <div className="mt-2 h-2 bg-[#E8E0D0] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#2D4A3E] transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex gap-1 mt-3">
            {mockQuestions.map((_, idx) => (
              <div
                key={idx}
                className={`w-3 h-3 rounded-full ${
                  answers[idx] !== undefined
                    ? 'bg-[#2D4A3E]'
                    : idx === currentQ
                    ? 'bg-[#C9A84C]'
                    : 'bg-[#E8E0D0]'
                }`}
              />
            ))}
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold text-[#1A1C14] mb-6">
            {question.question}
          </h2>

          <div className="space-y-3">
            {question.options.map((option, idx) => {
              const isSelected = answers[currentQ] === idx

              return (
                <button
                  key={idx}
                  onClick={() => handleSelect(idx)}
                  disabled={submitted}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#F2EDE1] border-[#2D4A3E] text-[#2D4A3E]'
                      : 'bg-white border-[#E8E0D0] text-[#1A1C14] hover:border-[#2D4A3E]/50'
                  }`}
                >
                  <span className="font-medium mr-2">
                    {String.fromCharCode(65 + idx)}.
                  </span>
                  {option}
                </button>
              )
            })}
          </div>
        </div>

        <div className="flex justify-end">
          {!isLastQuestion ? (
            <button
              onClick={handleNext}
              disabled={!hasAnswer}
              className={`px-6 py-3 rounded-lg font-medium transition-colors cursor-pointer ${
                hasAnswer
                  ? 'bg-[#2D4A3E] text-white hover:bg-[#4A7C59]'
                  : 'bg-[#E8E0D0] text-[#5C6355] cursor-not-allowed'
              }`}
            >
              Siguiente pregunta →
            </button>
          ) : (
            <button
              onClick={handleFinish}
              disabled={!hasAnswer}
              className={`px-6 py-3 rounded-lg font-medium transition-colors cursor-pointer ${
                hasAnswer
                  ? 'bg-[#C9A84C] text-[#1A1C14] hover:bg-[#B8970A]'
                  : 'bg-[#E8E0D0] text-[#5C6355] cursor-not-allowed'
              }`}
            >
              Finalizar examen
            </button>
          )}
        </div>
      </div>
    </div>
  )
}