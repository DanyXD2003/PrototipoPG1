import { Link } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'
import { getCreatorCourse, CREATOR_ORG_SLUG } from '../../data/creatorData'

type TabType = 'bloques' | 'inscritos' | 'completadores' | 'analiticas'

interface Props {
  courseSlug: string
  activeTab: TabType
}

export default function CourseEditNav({ courseSlug, activeTab }: Props) {
  const { course, data } = getCreatorCourse(CREATOR_ORG_SLUG, courseSlug) ?? {}

  const tabs: { key: TabType; label: string; path: string }[] = [
    { key: 'bloques', label: 'Bloques', path: `/creator/cursos/${courseSlug}/bloques` },
    { key: 'inscritos', label: 'Inscritos', path: `/creator/cursos/${courseSlug}/inscritos` },
    { key: 'completadores', label: 'Completadores', path: `/creator/cursos/${courseSlug}/completadores` },
    { key: 'analiticas', label: 'Analytics', path: `/creator/cursos/${courseSlug}/analiticas` },
  ]

  return (
    <div className="bg-white border-b border-[#E8E0D0] px-6 py-4">
      <Link
        to="/creator/cursos"
        className="flex items-center gap-1 text-sm text-[#5C6355] hover:text-[#2D4A3E] transition-colors cursor-pointer mb-3"
      >
        <ChevronLeft className="w-4 h-4" />
        Mis cursos
      </Link>

      {course && data && (
        <div className="flex items-center gap-4 mb-4">
          <img
            src={course.coverImage}
            alt={course.title}
            className="w-10 h-10 rounded-lg object-cover"
          />
          <div>
            <h2 className="font-semibold text-[#1A1C14]">{course.title}</h2>
            <div className="flex items-center gap-2 text-sm text-[#5C6355]">
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                data.status === 'published' ? 'bg-green-100 text-green-700' :
                data.status === 'draft' ? 'bg-yellow-100 text-yellow-700' :
                'bg-gray-100 text-gray-600'
              }`}>
                {data.status === 'published' ? 'Publicado' : data.status === 'draft' ? 'Borrador' : 'Archivado'}
              </span>
              <span>·</span>
              <span>{data.totalEnrolled.toLocaleString()} inscritos</span>
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-6 border-b border-[#E8E0D0]">
        {tabs.map(tab => (
          <Link
            key={tab.key}
            to={tab.path}
            className={`pb-3 text-sm font-medium transition-colors cursor-pointer ${
              activeTab === tab.key
                ? 'border-b-2 border-[#2D4A3E] text-[#2D4A3E]'
                : 'text-[#5C6355] hover:text-[#2D4A3E]'
            }`}
          >
            {tab.label}
          </Link>
        ))}
      </div>
    </div>
  )
}