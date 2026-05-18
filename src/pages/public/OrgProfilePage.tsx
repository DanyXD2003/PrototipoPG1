import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { BadgeCheck } from 'lucide-react'
import { organizations } from '../../data/organizations'
import { courses } from '../../data/courses'
import CourseCard from '../../components/course/CourseCard'

export default function OrgProfilePage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<'about' | 'courses'>('about')

  const organization = organizations.find((o) => o.slug === slug)

  if (!organization) {
    navigate('/404', { replace: true })
    return null
  }

  const orgCourses = courses.filter((c) => c.organization.slug === organization.slug)

  return (
    <div className="bg-[#FAF7EF] min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-white border border-[#E8E0D0] rounded-2xl p-8 mb-8">
          <div className="flex flex-col md:flex-row gap-6">
            <img
              src={organization.logo}
              alt={organization.name}
              className="w-20 h-20 rounded-xl"
            />
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold text-[#1A1C14]">{organization.name}</h1>
                {organization.verified && (
                  <BadgeCheck className="w-6 h-6 text-[#2D4A3E]" />
                )}
              </div>
              <p className="text-[#5C6355] mb-4">{organization.industry}</p>
              <a
                href={organization.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#2D4A3E] hover:underline text-sm cursor-pointer"
              >
                {organization.website.replace('https://', '')}
              </a>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 mt-6 pt-6 border-t border-[#E8E0D0]">
            <div className="text-center">
              <p className="text-2xl font-bold text-[#1A1C14]">{organization.courseCount}</p>
              <p className="text-sm text-[#5C6355]">cursos</p>
            </div>
            <div className="w-px h-10 bg-[#E8E0D0]" />
            <div className="text-center">
              <p className="text-2xl font-bold text-[#1A1C14]">{organization.studentCount.toLocaleString()}</p>
              <p className="text-sm text-[#5C6355]">estudiantes</p>
            </div>
            <div className="w-px h-10 bg-[#E8E0D0]" />
            <div className="text-center">
              <p className="text-2xl font-bold text-[#C9A84C]">{organization.rating.toFixed(1)}</p>
              <p className="text-sm text-[#5C6355]">rating</p>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex gap-4 border-b border-[#E8E0D0]">
            <button
              onClick={() => setActiveTab('about')}
              className={`px-4 py-3 font-medium cursor-pointer transition-colors ${
                activeTab === 'about'
                  ? 'text-[#2D4A3E] border-b-2 border-[#2D4A3E]'
                  : 'text-[#5C6355] hover:text-[#2D4A3E]'
              }`}
            >
              Sobre nosotros
            </button>
            <button
              onClick={() => setActiveTab('courses')}
              className={`px-4 py-3 font-medium cursor-pointer transition-colors ${
                activeTab === 'courses'
                  ? 'text-[#2D4A3E] border-b-2 border-[#2D4A3E]'
                  : 'text-[#5C6355] hover:text-[#2D4A3E]'
              }`}
            >
              Cursos ({organization.courseCount})
            </button>
          </div>
        </div>

        {activeTab === 'about' && (
          <div className="space-y-8">
            <div className="bg-white border border-[#E8E0D0] rounded-2xl p-6">
              <h2 className="text-xl font-semibold text-[#1A1C14] mb-4">Descripción</h2>
              <p className="text-[#5C6355] leading-relaxed">{organization.description}</p>
            </div>

            <div className="bg-white border border-[#E8E0D0] rounded-2xl p-6">
              <h2 className="text-xl font-semibold text-[#1A1C14] mb-4">Equipo</h2>
              <div className="flex gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="text-center">
                    <div className="w-16 h-16 rounded-full bg-[#F2EDE1] mx-auto mb-2" />
                    <p className="text-sm text-[#5C6355]">Equipo</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'courses' && (
          <div className="space-y-6">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {orgCourses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
            {orgCourses.length > 3 && (
              <div className="text-center">
                <Link
                  to={`/org/${organization.slug}/cursos`}
                  className="inline-flex items-center gap-2 text-[#2D4A3E] font-medium hover:underline cursor-pointer"
                >
                  Ver todos los cursos →
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}