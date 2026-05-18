import { Link } from 'react-router-dom'
import { Star } from 'lucide-react'
import { instructors } from '../../data/instructors'

export default function InstructorsCatalogPage() {
  return (
    <div className="bg-[#FAF7EF] min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#1A1C14] mb-2">Instructores</h1>
          <p className="text-[#5C6355]">
            Aprende de expertos reconocidos en sus respectivas industrias
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {instructors.map((instructor) => (
            <Link
              key={instructor.id}
              to={`/instructor/${instructor.slug}`}
              className="block p-6 bg-[#F2EDE1] border border-[#E8E0D0] rounded-2xl hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
            >
              <div className="flex items-center gap-4 mb-4">
                {instructor.avatar ? (
                  <img
                    src={instructor.avatar}
                    alt={instructor.name}
                    className="w-16 h-16 rounded-full"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-[#2D4A3E] flex items-center justify-center text-white text-xl font-bold">
                    {instructor.name.charAt(0)}
                  </div>
                )}
                <div>
                  <h3 className="font-semibold text-[#1A1C14]">{instructor.name}</h3>
                  <p className="text-sm text-[#5C6355]">{instructor.title}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {instructor.expertise.slice(0, 3).map((skill) => (
                  <span
                    key={skill}
                    className="px-2 py-1 bg-white border border-[#E8E0D0] rounded-full text-xs text-[#5C6355]"
                  >
                    {skill}
                  </span>
                ))}
                {instructor.expertise.length > 3 && (
                  <span className="px-2 py-1 bg-white border border-[#E8E0D0] rounded-full text-xs text-[#5C6355]">
                    +{instructor.expertise.length - 3}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-4 text-sm text-[#5C6355]">
                <span>{instructor.courseCount} cursos</span>
                <span>•</span>
                <span>{instructor.studentCount.toLocaleString()} estudiantes</span>
                <span>•</span>
                <span className="flex items-center gap-1 text-[#C9A84C] font-medium">
                  <Star className="w-4 h-4 fill-current" />
                  {instructor.rating.toFixed(1)}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}