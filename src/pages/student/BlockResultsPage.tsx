import { useLocation, useParams, Link } from 'react-router-dom'
import { CheckCircle, XCircle } from 'lucide-react'

interface ResultsState {
  grade: number
  totalQuestions: number
  correctAnswers: number
}

export default function BlockResultsPage() {
  const location = useLocation()
  const { cursoSlug, bloqueId } = useParams()

  const state = location.state as ResultsState | undefined
  const grade = state?.grade ?? 75
  const totalQuestions = state?.totalQuestions ?? 5
  const correctAnswers = state?.correctAnswers ?? 4
  const passingGrade = 70

  const isPassing = grade >= passingGrade

  return (
    <div className="min-h-screen bg-[#FAF7EF] flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        <div className={`text-center mb-8 ${isPassing ? '' : ''}`}>
          {isPassing ? (
            <div className="w-20 h-20 mx-auto mb-6 flex items-center justify-center">
              <CheckCircle className="w-20 h-20 text-[#2D4A3E]" />
            </div>
          ) : (
            <div className="w-20 h-20 mx-auto mb-6 flex items-center justify-center">
              <XCircle className="w-20 h-20 text-red-500" />
            </div>
          )}

          <div className={`text-6xl font-bold mb-2 ${isPassing ? 'text-[#2D4A3E]' : 'text-red-600'}`}>
            {grade}
            <span className="text-2xl">/100</span>
          </div>

          <div className={`text-lg font-semibold mb-4 ${isPassing ? 'text-[#2D4A3E]' : 'text-red-600'}`}>
            {isPassing ? 'APROBADO' : 'REPROBADO'}
          </div>

          <div className="text-[#5C6355]">
            ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          </div>

          <p className="text-[#5C6355] mt-4">
            Nota mínima de aprobación: {passingGrade} puntos
          </p>
          <p className="text-[#5C6355]">
            Respondiste correctamente {correctAnswers} de {totalQuestions} preguntas
          </p>

          <div className="text-[#5C6355]">
            ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          </div>
        </div>

        {isPassing ? (
          <div className="space-y-3">
            <Link
              to={`/aprendizaje/${cursoSlug}`}
              className="block w-full bg-[#C9A84C] text-[#1A1C14] text-center py-3 rounded-lg font-medium hover:bg-[#B8970A] transition-colors cursor-pointer"
            >
              Continuar al siguiente bloque →
            </Link>
            <Link
              to={`/aprendizaje/${cursoSlug}`}
              className="block w-full bg-white text-[#2D4A3E] border border-[#2D4A3E]/30 text-center py-3 rounded-lg font-medium hover:bg-[#F2EDE1] transition-colors cursor-pointer"
            >
              Ver temario del curso
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            <Link
              to={`/aprendizaje/${cursoSlug}/bloque/${bloqueId}/reintentar`}
              className="block w-full bg-red-100 text-red-700 text-center py-3 rounded-lg font-medium hover:bg-red-200 transition-colors cursor-pointer"
            >
              Reintentar bloque
            </Link>
            <Link
              to={`/aprendizaje/${cursoSlug}`}
              className="block w-full bg-white text-[#2D4A3E] border border-[#2D4A3E]/30 text-center py-3 rounded-lg font-medium hover:bg-[#F2EDE1] transition-colors cursor-pointer"
            >
              Ver temario del curso
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}