import { useParams, useNavigate, Navigate } from 'react-router-dom'
import { ArrowLeft, Heart, Mail, Globe, ExternalLink } from 'lucide-react'
import { getCandidateByUsername, savedCandidatesMock } from '../../data/talentData'
import CredentialBadge from '../../components/talent/CredentialBadge'
import Toast from '../../components/ui/Toast'
import { useState } from 'react'

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

export default function CandidateProfileRecruiterPage() {
  const { username } = useParams<{ username: string }>()
  const navigate = useNavigate()
  
  const candidate = username ? getCandidateByUsername(username) : undefined
  
  const [isSaved, setIsSaved] = useState(
    savedCandidatesMock.some(sc => sc.candidate.username === username)
  )
  const [toast, setToast] = useState({ visible: false, message: '' })

  if (!candidate) {
    return <Navigate to="/talent/buscar" replace />
  }

  const availability = getAvailabilityInfo(candidate.availability)

  const handleToggleSave = () => {
    setIsSaved(!isSaved)
    if (!isSaved) {
      setToast({ visible: true, message: 'Candidato guardado' })
    }
  }

  const handleContact = () => {
    setToast({ visible: true, message: 'Funcionalidad de contacto próximamente disponible' })
  }

  return (
    <div>
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-[#5C6355] hover:text-[#2D4A3E] transition-colors cursor-pointer mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Volver a resultados
      </button>

      <div className="bg-white border border-[#E8E0D0] rounded-2xl p-6 mb-6">
        <div className="flex items-start gap-4">
          <img
            src={candidate.avatar}
            alt={candidate.name}
            className="w-24 h-24 rounded-full object-cover"
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

        <div className="flex gap-4 mt-4">
          {candidate.linkedinUrl && (
            <a
              href={candidate.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-[#2D4A3E] hover:text-[#4A7C59] transition-colors cursor-pointer"
            >
              <Globe className="w-4 h-4" />
              LinkedIn
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
          <a
            href="#"
            className="flex items-center gap-2 text-sm text-[#2D4A3E] hover:text-[#4A7C59] transition-colors cursor-pointer"
          >
            <Mail className="w-4 h-4" />
            carlos@dev.com
          </a>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-semibold text-[#1A1C14] mb-3">Bio</h2>
        <p className="text-[#5C6355]">{candidate.bio}</p>
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-semibold text-[#1A1C14] mb-3">Habilidades</h2>
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

      <div className="mb-6">
        <h2 className="text-lg font-semibold text-[#1A1C14] mb-3">Credenciales de Nexora</h2>
        <div className="space-y-3">
          {candidate.completedCourses.map(credential => (
            <div key={credential.courseSlug}>
              <CredentialBadge credential={credential} size="md" />
              <a
                href={`/cursos/${credential.courseSlug}`}
                className="text-sm text-[#2D4A3E] hover:text-[#4A7C59] transition-colors cursor-pointer mt-2 inline-flex items-center gap-1"
              >
                Ver curso público →
              </a>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={handleToggleSave}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer ${
            isSaved
              ? 'bg-[#C9A84C] text-[#1A1C14] border border-[#C9A84C]'
              : 'border border-[#2D4A3E] text-[#2D4A3E] hover:bg-[#F2EDE1]'
          }`}
        >
          <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
          {isSaved ? 'Guardado' : 'Guardar candidato'}
        </button>
        <button
          onClick={handleContact}
          className="flex items-center gap-2 px-4 py-2 bg-[#C9A84C] text-[#1A1C14] rounded-lg font-medium hover:bg-[#B8970A] transition-colors cursor-pointer"
        >
          <Mail className="w-4 h-4" />
          Contactar
        </button>
      </div>

      <Toast
        visible={toast.visible}
        message={toast.message}
        onHide={() => setToast({ visible: false, message: '' })}
      />
    </div>
  )
}