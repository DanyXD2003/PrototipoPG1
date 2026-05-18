import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { organizations } from '../../data/organizations'
import { courses } from '../../data/courses'
import CourseCard from '../../components/course/CourseCard'
import SearchBar from '../../components/course/SearchBar'

const levels = ['Todos', 'Principiante', 'Intermedio', 'Avanzado']

export default function OrgCoursesPage() {
  const { slug } = useParams()
  const [selectedLevel, setSelectedLevel] = useState('Todos')

  const organization = organizations.find((o) => o.slug === slug)

  if (!organization) {
    return (
      <div className="bg-[#FAF7EF] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#1A1C14] mb-4">Organización no encontrada</h1>
          <Link to="/org" className="text-[#2D4A3E] hover:underline">
            Volver al catálogo
          </Link>
        </div>
      </div>
    )
  }

  const orgCourses = courses.filter((c) => c.organization.slug === organization.slug)

  const filteredCourses =
    selectedLevel === 'Todos'
      ? orgCourses
      : orgCourses.filter((c) => c.level === selectedLevel)

  return (
    <div className="bg-[#FAF7EF] min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <Link
          to={`/org/${organization.slug}`}
          className="inline-flex items-center gap-2 text-[#5C6355] hover:text-[#2D4A3E] mb-6 cursor-pointer transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {organization.name}
        </Link>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#1A1C14]">Cursos de {organization.name}</h1>
            <p className="text-[#5C6355]">{filteredCourses.length} cursos disponibles</p>
          </div>
          <div className="w-full md:w-80">
            <SearchBar placeholder="Buscar en cursos..." />
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          {levels.map((level) => (
            <button
              key={level}
              onClick={() => setSelectedLevel(level)}
              className={`px-4 py-2 rounded-full text-sm cursor-pointer transition-colors ${
                selectedLevel === level
                  ? 'bg-[#2D4A3E] text-white'
                  : 'bg-[#F2EDE1] text-[#5C6355] hover:bg-[#E8E0D0]'
              }`}
            >
              {level}
            </button>
          ))}
        </div>

        {filteredCourses.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-[#5C6355]">No hay cursos con ese nivel</p>
          </div>
        )}
      </div>
    </div>
  )
}