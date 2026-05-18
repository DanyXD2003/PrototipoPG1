import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Star, Award, BookOpen, Calendar, Globe, Mail } from 'lucide-react'
import { instructors } from '../../data/instructors'
import { courses } from '../../data/courses'
import CourseCard from '../../components/course/CourseCard'

export default function InstructorProfilePage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<'courses' | 'about'>('courses')

  const instructor = instructors.find((i) => i.slug === slug)

  if (!instructor) {
    navigate('/404', { replace: true })
    return null
  }

  const instructorCourses = courses.filter((c) => c.instructor.slug === instructor.slug)

  return (
    <div className="bg-[#FAF7EF] min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-white border border-[#E8E0D0] rounded-2xl p-8 mb-8">
          <div className="flex flex-col md:flex-row gap-6">
            {instructor.avatar ? (
              <img
                src={instructor.avatar}
                alt={instructor.name}
                className="w-28 h-28 rounded-full"
              />
            ) : (
              <div className="w-28 h-28 rounded-full bg-[#2D4A3E] flex items-center justify-center text-white text-3xl font-bold">
                {instructor.name.charAt(0)}
              </div>
            )}
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-[#1A1C14] mb-1">{instructor.name}</h1>
              <p className="text-[#5C6355] mb-4">{instructor.title}</p>

              <div className="flex flex-wrap items-center gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-[#5C6355]" />
                  <span className="text-sm text-[#5C6355]">{instructor.courseCount} cursos</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-[#5C6355]">
                    {instructor.studentCount.toLocaleString()} estudiantes
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-[#C9A84C] fill-current" />
                  <span className="text-sm font-medium text-[#1A1C14]">{instructor.rating.toFixed(1)}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <a
                  href="#"
                  className="p-2 rounded-full bg-[#F2EDE1] hover:bg-[#E8E0D0] transition-colors cursor-pointer"
                >
                  <Globe className="w-5 h-5 text-[#5C6355]" />
                </a>
                <a
                  href="#"
                  className="p-2 rounded-full bg-[#F2EDE1] hover:bg-[#E8E0D0] transition-colors cursor-pointer"
                >
                  <Mail className="w-5 h-5 text-[#5C6355]" />
                </a>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-[#E8E0D0]">
            <p className="text-[#5C6355] leading-relaxed">{instructor.bio}</p>
          </div>

          <div className="mt-6">
            <h3 className="text-sm font-medium text-[#1A1C14] mb-3">Áreas de expertise</h3>
            <div className="flex flex-wrap gap-2">
              {instructor.expertise.map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1.5 bg-[#F2EDE1] border border-[#E8E0D0] rounded-full text-sm text-[#5C6355]"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex gap-4 border-b border-[#E8E0D0]">
            <button
              onClick={() => setActiveTab('courses')}
              className={`px-4 py-3 font-medium cursor-pointer transition-colors ${
                activeTab === 'courses'
                  ? 'text-[#2D4A3E] border-b-2 border-[#2D4A3E]'
                  : 'text-[#5C6355] hover:text-[#2D4A3E]'
              }`}
            >
              Cursos ({instructor.courseCount})
            </button>
            <button
              onClick={() => setActiveTab('about')}
              className={`px-4 py-3 font-medium cursor-pointer transition-colors ${
                activeTab === 'about'
                  ? 'text-[#2D4A3E] border-b-2 border-[#2D4A3E]'
                  : 'text-[#5C6355] hover:text-[#2D4A3E]'
              }`}
            >
              Sobre mí
            </button>
          </div>
        </div>

        {activeTab === 'courses' && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {instructorCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        )}

        {activeTab === 'about' && (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white border border-[#E8E0D0] rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Award className="w-6 h-6 text-[#C9A84C]" />
                <h3 className="text-lg font-semibold text-[#1A1C14]">Logros</h3>
              </div>
              <ul className="space-y-3 text-[#5C6355]">
                <li>• +15 años de experiencia en la industria</li>
                <li>• Más de {instructor.studentCount.toLocaleString()} estudiantes formados</li>
                <li>• Instructor rating de {instructor.rating.toFixed(1)} ★</li>
              </ul>
            </div>

            <div className="bg-white border border-[#E8E0D0] rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Calendar className="w-6 h-6 text-[#C9A84C]" />
                <h3 className="text-lg font-semibold text-[#1A1C14]">Formación</h3>
              </div>
              <ul className="space-y-3 text-[#5C6355]">
                <li>• Especialización en {instructor.expertise[0]}</li>
                <li>• Formación continua en metodologías de enseñanza</li>
                <li>• Certificaciones profesionales</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}