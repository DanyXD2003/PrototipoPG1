import { useParams, useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { ArrowLeft, CheckCircle, Lock } from 'lucide-react'
import { getCandidateByUsername } from '../../data/talentData'
import { useAuth } from '../../context/auth'
import CredentialBadge from '../../components/talent/CredentialBadge'

function getAvailabilityInfo(availability: string): { text: string; color: string } {
  switch (availability) {
    case 'available':
      return { text: 'Disponible', color: 'bg-green-500' }
    case 'open':
      return { text: 'Abierto a oportunidades', color: 'bg-blue-500' }
    case 'not_available':
      return { text: 'No disponible', color: 'bg-gray-400' }
    default:
      return { text: availability, color: 'bg-gray-400' }
  }
}

export default function StudentPublicProfilePage() {
  const { username } = useParams<{ username: string }>()
  const navigate = useNavigate()
  const { user, isLoggedIn } = useAuth()
  
  const candidate = username ? getCandidateByUsername(username) : undefined

  if (!candidate) {
    return (
      <div className="text-center py-12">
        <p className="text-[#1A1C14] font-medium mb-4">Perfil no encontrado</p>
        <Link to="/" className="text-[#2D4A3E] hover:text-[#4A7C59]">Volver al inicio</Link>
      </div>
    )
  }

  const availability = getAvailabilityInfo(candidate.availability)
  const showRecruiterCTA = !isLoggedIn || user?.role !== 'organization'

  return (
    <div className="max-w-3xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-[#5C6355] hover:text-[#2D4A3E] transition-colors cursor-pointer mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Volver
      </button>

      <div className="bg-white border border-[#E8E0D0] rounded-2xl p-6 mb-8">
        <div className="flex items-start gap-4">
          <img
            src={candidate.avatar}
            alt={candidate.name}
            className="w-20 h-20 rounded-full object-cover"
          />
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-[#1A1C14]">{candidate.name}</h1>
            <p className="text-[#5C6355]">{candidate.title}</p>
            <p className="text-sm text-[#5C6355]">
              {candidate.location.split(',')[0]} ·{' '}
              <span className="inline-flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${availability.color}`}></span>
                {availability.text}
              </span>
            </p>
          </div>
        </div>
        
        <p className="mt-4 text-[#5C6355]">"{candidate.bio}"</p>

        <div className="mt-4">
          <p className="text-sm font-medium text-[#5C6355] mb-2">Habilidades:</p>
          <div className="flex flex-wrap gap-2">
            {candidate.skills.map(skill => (
              <span
                key={skill}
                className="bg-[#F2EDE1] text-[#5C6355] text-sm px-3 py-1.5 rounded-lg"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-semibold text-[#1A1C14] mb-4">Credenciales de Nexora</h2>
        <div className="space-y-3">
          {candidate.completedCourses.map(credential => (
            <div key={credential.courseSlug} className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-1" />
              <CredentialBadge credential={credential} size="md" />
            </div>
          ))}
        </div>
      </div>

      <div className="bg-[#F2EDE1] border border-[#E8E0D0] rounded-xl p-4 mb-6">
        <div className="flex items-start gap-3">
          <Lock className="w-5 h-5 text-[#5C6355] shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-[#5C6355]">
              Esta información es pública. Solo se muestran los cursos que el perfil ha decidido hacer visibles.
            </p>
          </div>
        </div>
      </div>

      {showRecruiterCTA && (
        <div className="text-center py-6 border-t border-[#E8E0D0]">
          <p className="text-[#1A1C14] font-medium mb-2">¿Eres reclutador?</p>
          <p className="text-sm text-[#5C6355] mb-4">
            Si quieres contactar a este candidato, crea una cuenta de organización en Nexora.
          </p>
          <Link
            to="/registro/organizacion"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#C9A84C] text-[#1A1C14] rounded-lg font-medium hover:bg-[#B8970A] transition-colors cursor-pointer"
          >
            Registrar mi empresa →
          </Link>
        </div>
      )}
    </div>
  )
}