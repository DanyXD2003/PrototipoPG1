import { X, SlidersHorizontal } from 'lucide-react'
import type { FilterState, CourseCategory } from '../../types'
import { organizations } from '../../data/organizations'

interface FilterSidebarProps {
  filters: FilterState
  onChange: (filters: FilterState) => void
  isOpen?: boolean
  onClose?: () => void
}

const categories: CourseCategory[] = [
  'Tecnología',
  'Negocios',
  'Diseño',
  'Marketing',
  'Finanzas',
  'Salud',
  'Educación',
  'Desarrollo Personal',
]

const levels = ['Principiante', 'Intermedio', 'Avanzado']

const durations = [
  'Menos de 4 semanas',
  '4-8 semanas',
  'Más de 8 semanas',
]

export default function FilterSidebar({ filters, onChange, isOpen = true, onClose }: FilterSidebarProps) {
  const handleCategoryChange = (category: CourseCategory) => {
    const newCategories = filters.categories.includes(category)
      ? filters.categories.filter(c => c !== category)
      : [...filters.categories, category]
    onChange({ ...filters, categories: newCategories })
  }

  const handleLevelChange = (level: string) => {
    const newLevels = filters.levels.includes(level)
      ? filters.levels.filter(l => l !== level)
      : [...filters.levels, level]
    onChange({ ...filters, levels: newLevels })
  }

  const handlePriceChange = (price: 'all' | 'free' | 'paid') => {
    onChange({ ...filters, price })
  }

  const handleDurationChange = (duration: string) => {
    const newDurations = filters.duration.includes(duration)
      ? filters.duration.filter(d => d !== duration)
      : [...filters.duration, duration]
    onChange({ ...filters, duration: newDurations })
  }

  const handleOrgChange = (orgSlug: string) => {
    const newOrgs = filters.organizations.includes(orgSlug)
      ? filters.organizations.filter(o => o !== orgSlug)
      : [...filters.organizations, orgSlug]
    onChange({ ...filters, organizations: newOrgs })
  }

  const clearFilters = () => {
    onChange({
      categories: [],
      levels: [],
      price: 'all',
      duration: [],
      organizations: [],
    })
  }

  const hasActiveFilters =
    filters.categories.length > 0 ||
    filters.levels.length > 0 ||
    filters.price !== 'all' ||
    filters.duration.length > 0 ||
    filters.organizations.length > 0

  const sidebarContent = (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-[#1A1C14]">Filtros</h3>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-sm text-[#5C6355] hover:text-[#2D4A3E] transition-colors cursor-pointer"
          >
            Limpiar filtros
          </button>
        )}
      </div>

      <div>
        <h4 className="text-sm font-medium text-[#1A1C14] mb-3">Categoría</h4>
        <div className="space-y-2">
          {categories.map((category) => (
            <label key={category} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.categories.includes(category)}
                onChange={() => handleCategoryChange(category)}
                className="w-4 h-4 rounded border-[#E8E0D0] text-[#2D4A3E] focus:ring-[#2D4A3E]"
              />
              <span className="text-sm text-[#5C6355]">{category}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-sm font-medium text-[#1A1C14] mb-3">Nivel</h4>
        <div className="space-y-2">
          {levels.map((level) => (
            <label key={level} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.levels.includes(level)}
                onChange={() => handleLevelChange(level)}
                className="w-4 h-4 rounded border-[#E8E0D0] text-[#2D4A3E] focus:ring-[#2D4A3E]"
              />
              <span className="text-sm text-[#5C6355]">{level}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-sm font-medium text-[#1A1C14] mb-3">Precio</h4>
        <div className="space-y-2">
          {[
            { value: 'all', label: 'Todos' },
            { value: 'free', label: 'Gratuitos' },
            { value: 'paid', label: 'De pago' },
          ].map((option) => (
            <label key={option.value} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="price"
                value={option.value}
                checked={filters.price === option.value}
                onChange={() => handlePriceChange(option.value as 'all' | 'free' | 'paid')}
                className="w-4 h-4 border-[#E8E0D0] text-[#2D4A3E] focus:ring-[#2D4A3E]"
              />
              <span className="text-sm text-[#5C6355]">{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-sm font-medium text-[#1A1C14] mb-3">Duración</h4>
        <div className="space-y-2">
          {durations.map((duration) => (
            <label key={duration} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.duration.includes(duration)}
                onChange={() => handleDurationChange(duration)}
                className="w-4 h-4 rounded border-[#E8E0D0] text-[#2D4A3E] focus:ring-[#2D4A3E]"
              />
              <span className="text-sm text-[#5C6355]">{duration}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-sm font-medium text-[#1A1C14] mb-3">Organización</h4>
        <div className="space-y-2">
          {organizations.map((org) => (
            <label key={org.slug} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.organizations.includes(org.slug)}
                onChange={() => handleOrgChange(org.slug)}
                className="w-4 h-4 rounded border-[#E8E0D0] text-[#2D4A3E] focus:ring-[#2D4A3E]"
              />
              <span className="text-sm text-[#5C6355]">{org.name}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  )

  return (
    <>
      <aside className="hidden lg:block w-72 shrink-0">{sidebarContent}</aside>

      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={onClose} />
          <div className="absolute left-0 top-0 bottom-0 w-80 bg-[#FAF7EF] p-6 overflow-y-auto animate-slide-in">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-[#1A1C14] flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5" />
                Filtros
              </h3>
              <button
                onClick={onClose}
                className="p-1 cursor-pointer"
              >
                <X className="w-5 h-5 text-[#5C6355]" />
              </button>
            </div>
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  )
}