import { useSearchParams } from 'react-router-dom'
import { Search, SearchX } from 'lucide-react'
import { courses } from '../../data/courses'
import SearchBar from '../../components/course/SearchBar'
import CourseCard from '../../components/course/CourseCard'

export default function CourseSearchPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const query = searchParams.get('q') || ''

  const handleSearch = (newQuery: string) => {
    setSearchParams({ q: newQuery })
  }

  const filteredCourses = query
    ? courses.filter(
        (course) =>
          course.title.toLowerCase().includes(query.toLowerCase()) ||
          course.shortDescription.toLowerCase().includes(query.toLowerCase()) ||
          course.category.toLowerCase().includes(query.toLowerCase()) ||
          course.organization.name.toLowerCase().includes(query.toLowerCase())
      )
    : []

  return (
    <div className="bg-[#FAF7EF] min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="max-w-2xl mx-auto mb-12">
          <SearchBar
            defaultValue={query}
            placeholder="Busca cursos, temas, organizaciones..."
            onSearch={handleSearch}
            size="lg"
          />
        </div>

        {!query ? (
          <div className="text-center py-16">
            <Search className="w-16 h-16 text-[#E8E0D0] mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-[#1A1C14] mb-2">
              Escribe algo para buscar
            </h3>
            <p className="text-[#5C6355]">
              Prueba con palabras clave como "Python", "marketing" o "finanzas"
            </p>
          </div>
        ) : filteredCourses.length > 0 ? (
          <>
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-[#1A1C14]">
                Resultados para: "{query}"
              </h2>
              <p className="text-[#5C6355]">{filteredCourses.length} cursos encontrados</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-16">
            <SearchX className="w-16 h-16 text-[#E8E0D0] mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-[#1A1C14] mb-2">
              No encontramos resultados para "{query}"
            </h3>
            <p className="text-[#5C6355] mb-6">
              Prueba con otras palabras o explora el catálogo completo.
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {['Python', 'Marketing', 'Diseño', 'Finanzas', 'Tecnología'].map((term) => (
                <button
                  key={term}
                  onClick={() => handleSearch(term)}
                  className="px-4 py-2 bg-[#F2EDE1] border border-[#E8E0D0] rounded-full text-sm text-[#5C6355] hover:text-[#2D4A3E] cursor-pointer transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}