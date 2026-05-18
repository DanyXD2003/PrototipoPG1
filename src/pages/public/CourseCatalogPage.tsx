import { useState } from 'react'
import { X, SlidersHorizontal, SearchX } from 'lucide-react'
import type { FilterState } from '../../types'
import { courses } from '../../data/courses'
import SearchBar from '../../components/course/SearchBar'
import CourseCard from '../../components/course/CourseCard'
import FilterSidebar from '../../components/course/FilterSidebar'

const emptyFilters: FilterState = {
  categories: [],
  levels: [],
  price: 'all',
  duration: [],
  organizations: [],
}

function filterCourses(filters: FilterState) {
  return courses.filter((course) => {
    if (filters.categories.length > 0 && !filters.categories.includes(course.category)) {
      return false
    }
    if (filters.levels.length > 0 && !filters.levels.includes(course.level)) {
      return false
    }
    if (filters.price === 'free' && course.price !== 0) return false
    if (filters.price === 'paid' && course.price === 0) return false
    if (filters.duration.length > 0) {
      const courseWeeks = parseInt(course.duration) || 0
      const matchDuration = filters.duration.some((d) => {
        if (d === 'Menos de 4 semanas') return courseWeeks < 4
        if (d === '4-8 semanas') return courseWeeks >= 4 && courseWeeks <= 8
        if (d === 'Más de 8 semanas') return courseWeeks > 8
        return false
      })
      if (!matchDuration) return false
    }
    if (filters.organizations.length > 0 && !filters.organizations.includes(course.organization.slug)) {
      return false
    }
    return true
  }).sort((a, b) => {
    if (a.featured && !b.featured) return -1
    if (!a.featured && b.featured) return 1
    return b.rating - a.rating
  })
}

export default function CourseCatalogPage() {
  const [filters, setFilters] = useState<FilterState>(emptyFilters)
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  const filteredCourses = filterCourses(filters)

  const activeFilterCount =
    filters.categories.length +
    filters.levels.length +
    (filters.price !== 'all' ? 1 : 0) +
    filters.duration.length +
    filters.organizations.length

  const clearFilter = (filterType: keyof FilterState) => {
    setFilters({ ...filters, [filterType]: filterType === 'price' ? 'all' : [] })
  }

  const activeFiltersList: Array<{ type: keyof FilterState; value: string }> = []

  filters.categories.forEach(cat => activeFiltersList.push({ type: 'categories', value: cat }))
  filters.levels.forEach(level => activeFiltersList.push({ type: 'levels', value: level }))
  if (filters.price !== 'all') activeFiltersList.push({ type: 'price', value: filters.price })
  filters.duration.forEach(dur => activeFiltersList.push({ type: 'duration', value: dur }))
  filters.organizations.forEach(org => activeFiltersList.push({ type: 'organizations', value: org }))

  return (
    <div className="bg-[#FAF7EF] min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#1A1C14]">Explorar cursos</h1>
            <p className="text-[#5C6355]">{courses.length} cursos disponibles</p>
          </div>
          <div className="w-full md:w-80">
            <SearchBar placeholder="Buscar en el catálogo..." />
          </div>
        </div>

        {activeFiltersList.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {activeFiltersList.map((filter, index) => (
              <button
                key={`${filter.type}-${filter.value}-${index}`}
                onClick={() => clearFilter(filter.type)}
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#F2EDE1] border border-[#E8E0D0] rounded-full text-sm cursor-pointer hover:bg-[#E8E0D0] transition-colors"
              >
                {filter.type === 'price' ? (filter.value === 'free' ? 'Gratuitos' : 'De pago') : filter.value}
                <X className="w-4 h-4" />
              </button>
            ))}
          </div>
        )}

        <div className="flex gap-8">
          <FilterSidebar
            filters={filters}
            onChange={setFilters}
            isOpen={mobileFiltersOpen}
            onClose={() => setMobileFiltersOpen(false)}
          />

          <div className="flex-1">
            <div className="lg:hidden mb-4">
              <button
                onClick={() => setMobileFiltersOpen(true)}
                className="flex items-center gap-2 px-4 py-2 border border-[#E8E0D0] rounded-lg text-[#2D4A3E] cursor-pointer hover:bg-[#F2EDE1] transition-colors"
              >
                <SlidersHorizontal className="w-5 h-5" />
                Filtros
                {activeFilterCount > 0 && (
                  <span className="bg-[#C9A84C] text-[#1A1C14] px-2 py-0.5 rounded-full text-xs">
                    {activeFilterCount}
                  </span>
                )}
              </button>
            </div>

            {filteredCourses.length > 0 ? (
              <>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCourses.map((course) => (
                    <CourseCard key={course.id} course={course} />
                  ))}
                </div>
                <div className="text-center mt-12">
                  <button className="px-6 py-3 border border-[#E8E0D0] rounded-lg text-[#5C6355] cursor-pointer hover:bg-[#F2EDE1] transition-colors">
                    Cargar más
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center py-16">
                <SearchX className="w-16 h-16 text-[#E8E0D0] mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-[#1A1C14] mb-2">
                  No encontramos cursos con esos filtros
                </h3>
                <p className="text-[#5C6355] mb-6">
                  Intenta ajustar los filtros para encontrar lo que buscas.
                </p>
                <button
                  onClick={() => setFilters(emptyFilters)}
                  className="text-[#2D4A3E] font-medium hover:underline cursor-pointer"
                >
                  Limpiar filtros
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}