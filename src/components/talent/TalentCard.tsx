import { Link } from 'react-router-dom'
import { Heart } from 'lucide-react'
import type { TalentCandidate } from '../../types'
import GradeBadge from '../learning/GradeBadge'

interface TalentCardProps {
  candidate: TalentCandidate
  isSaved: boolean
  onToggleSave: (id: string) => void
  highlightCourseSlug?: string
}

function getAvailabilityLabel(availability: TalentCandidate['availability']): { text: string; color: string } {
  switch (availability) {
    case 'available':
      return { text: 'Disponible', color: 'bg-green-500' }
    case 'open':
      return { text: 'Abierto a oportunidades', color: 'bg-blue-500' }
    case 'not_available':
      return { text: 'No disponible', color: 'bg-gray-400' }
  }
}

export default function TalentCard({ candidate, isSaved, onToggleSave, highlightCourseSlug }: TalentCardProps) {
  const availability = getAvailabilityLabel(candidate.availability)
  
  const sortedCourses = [...candidate.completedCourses].sort((a, b) => {
    if (a.courseSlug === highlightCourseSlug) return -1
    if (b.courseSlug === highlightCourseSlug) return 1
    return 0
  })
  
  const displayCourses = sortedCourses.slice(0, 2)
  const extraCount = candidate.completedCourses.length - 2
  
  const displaySkills = candidate.skills.slice(0, 3)
  const extraSkills = candidate.skills.length - 3

  return (
    <div className="bg-white border border-[#E8E0D0] rounded-2xl p-5 hover:shadow-md hover:border-[#2D4A3E]/30 transition-all">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-full bg-[#2D4A3E] flex items-center justify-center shrink-0">
          <span className="text-white font-semibold text-lg">
            {candidate.name.charAt(0).toUpperCase()}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-[#1A1C14] truncate">{candidate.name}</h3>
            <button
              onClick={() => onToggleSave(candidate.id)}
              className="cursor-pointer transition-colors duration-200"
            >
              <Heart
                className={`w-5 h-5 ${isSaved ? 'fill-[#C9A84C] text-[#C9A84C]' : 'text-[#5C6355] hover:text-[#C9A84C]'}`}
              />
            </button>
          </div>
          <p className="text-sm text-[#5C6355] truncate">{candidate.title}</p>
          <p className="text-sm text-[#5C6355]">
            {candidate.location.split(',')[0]} · <span className={`inline-flex items-center gap-1.5`}>
              <span className={`w-2 h-2 rounded-full ${availability.color}`}></span>
              {availability.text}
            </span>
          </p>
        </div>
      </div>

      <div className="mt-4">
        <p className="text-xs font-medium text-[#5C6355] mb-2">Cursos completados:</p>
        <div className="space-y-2">
          {displayCourses.map((course) => (
            <div
              key={course.courseSlug}
              className={`flex items-center gap-2 ${course.courseSlug === highlightCourseSlug ? 'bg-[#F2EDE1] rounded-lg px-2 py-1 -mx-2' : ''}`}
            >
              <span className="w-2 h-2 rounded-full bg-[#C9A84C] shrink-0" />
              <span className="text-sm text-[#1A1C14] truncate max-w-[180px]">
                {course.courseTitle.length > 35 ? course.courseTitle.slice(0, 35) + '...' : course.courseTitle}
              </span>
              <GradeBadge grade={course.grade} />
            </div>
          ))}
          {extraCount > 0 && (
            <p className="text-xs text-[#5C6355]">+{extraCount} más</p>
          )}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="flex flex-wrap gap-1.5">
          {displaySkills.map(skill => (
            <span
              key={skill}
              className="bg-[#F2EDE1] text-[#5C6355] text-xs px-2 py-1 rounded-lg"
            >
              {skill}
            </span>
          ))}
          {extraSkills > 0 && (
            <span className="text-xs text-[#5C6355] px-1">+{extraSkills} más</span>
          )}
        </div>
        <Link
          to={`/talent/candidato/${candidate.username}`}
          className="text-sm text-[#2D4A3E] hover:text-[#4A7C59] transition-colors cursor-pointer"
        >
          Ver perfil →
        </Link>
      </div>
    </div>
  )
}