import { useState, useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import { Heart, UserX } from 'lucide-react'
import { courses } from '../../data/courses'
import { filterCandidates, savedCandidatesMock } from '../../data/talentData'
import type { TalentFilters } from '../../types'
import TalentCard from '../../components/talent/TalentCard'
import Toast from '../../components/ui/Toast'

const defaultFilters: TalentFilters = {
  courseSlug: '',
  minGrade: 70,
  completedAfter: '',
  availability: 'all',
}

export default function TalentSearchPage() {
  const location = useLocation()
  const initialFilters: TalentFilters = location.state?.filters ?? defaultFilters

  const [filters, setFilters] = useState<TalentFilters>(initialFilters)
  const [savedCandidateIds, setSavedCandidateIds] = useState<Set<string>>(
    new Set(savedCandidatesMock.map(sc => sc.candidate.id))
  )
  const [showSaveSearchModal, setShowSaveSearchModal] = useState(false)
  const [searchName, setSearchName] = useState('')
  const [toast, setToast] = useState({ visible: false, message: '' })
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  const filteredCandidates = useMemo(() => filterCandidates(filters), [filters])

  const activeFilterCount = useMemo(() => {
    let count = 0
    if (filters.courseSlug) count++
    if (filters.minGrade !== 70) count++
    if (filters.completedAfter) count++
    if (filters.availability !== 'all') count++
    return count
  }, [filters])

  const handleToggleSave = (id: string) => {
    setSavedCandidateIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const handleClearFilters = () => {
    setFilters(defaultFilters)
  }

  const handleSaveSearch = () => {
    if (searchName.trim()) {
      setToast({ visible: true, message: 'Búsqueda guardada' })
      setShowSaveSearchModal(false)
      setSearchName('')
    }
  }

  const getDateOptions = () => {
    const ms = Date.now()
    return [
      { label: 'Cualquier fecha', value: '' },
      { label: 'Último mes', value: new Date(ms - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] },
      { label: 'Últimos 3 meses', value: new Date(ms - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] },
      { label: 'Último año', value: new Date(ms - 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] },
    ]
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#1A1C14]">Buscar talento</h1>
        <p className="text-[#5C6355]">Encuentra candidatos que completaron cursos específicos</p>
      </div>

      <div className="flex gap-6">
        {/* Filtros - Sidebar */}
        <aside className="w-64 shrink-0 space-y-6 hidden md:block">
          <div>
            <label className="block text-sm font-medium text-[#1A1C14] mb-2">
              Curso completado
            </label>
            <select
              value={filters.courseSlug}
              onChange={e => setFilters(f => ({ ...f, courseSlug: e.target.value }))}
              className="w-full border border-[#E8E0D0] rounded-lg px-3 py-2 text-sm bg-white text-[#1A1C14]"
            >
              <option value="">Todos los cursos</option>
              {courses.map(course => (
                <option key={course.id} value={course.slug}>
                  {course.title.length > 40 ? course.title.slice(0, 40) + '...' : course.title} · {course.organization.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#1A1C14] mb-2">
              Nota mínima: {filters.minGrade} / 100
            </label>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={filters.minGrade}
              onChange={e => setFilters(f => ({ ...f, minGrade: Number(e.target.value) }))}
              className="w-full accent-[#C9A84C]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#1A1C14] mb-2">
              Completado desde
            </label>
            <select
              value={filters.completedAfter}
              onChange={e => setFilters(f => ({ ...f, completedAfter: e.target.value }))}
              className="w-full border border-[#E8E0D0] rounded-lg px-3 py-2 text-sm bg-white text-[#1A1C14]"
            >
              {getDateOptions().map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#1A1C14] mb-2">
              Disponibilidad
            </label>
            <div className="space-y-2">
              {[
                { label: 'Todos', value: 'all' },
                { label: 'Disponibles', value: 'available' },
                { label: 'Abiertos a oportunidades', value: 'open' },
              ].map(opt => (
                <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="availability"
                    value={opt.value}
                    checked={filters.availability === opt.value}
                    onChange={e => setFilters(f => ({ ...f, availability: e.target.value as TalentFilters['availability'] }))}
                    className="accent-[#C9A84C]"
                  />
                  <span className="text-sm text-[#1A1C14]">{opt.label}</span>
                </label>
              ))}
            </div>
          </div>

          <button
            onClick={handleClearFilters}
            className="w-full text-sm text-[#5C6355] hover:text-[#2D4A3E] transition-colors cursor-pointer"
          >
            Limpiar filtros
          </button>
        </aside>

        {/* Resultados */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-4">
            <p className="text-lg font-medium text-[#1A1C14]">
              {filteredCandidates.length} candidatos encontrados
            </p>
            <button
              onClick={() => setShowSaveSearchModal(true)}
              className="flex items-center gap-2 text-sm text-[#2D4A3E] border border-[#2D4A3E] px-3 py-1.5 rounded-lg hover:bg-[#F2EDE1] transition-colors cursor-pointer"
            >
              <Heart className="w-4 h-4" />
              Guardar búsqueda
            </button>
          </div>

          {filteredCandidates.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filteredCandidates.map(candidate => (
                <TalentCard
                  key={candidate.id}
                  candidate={candidate}
                  isSaved={savedCandidateIds.has(candidate.id)}
                  onToggleSave={handleToggleSave}
                  highlightCourseSlug={filters.courseSlug}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <UserX className="w-12 h-12 mx-auto text-[#5C6355] mb-4" />
              <p className="text-[#1A1C14] font-medium mb-2">No encontramos candidatos con estos filtros</p>
              <p className="text-sm text-[#5C6355] mb-4">Intenta ajustar la nota mínima o el curso</p>
              <button
                onClick={handleClearFilters}
                className="text-sm text-[#2D4A3E] hover:text-[#4A7C59] transition-colors cursor-pointer"
              >
                Limpiar filtros
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile filters toggle */}
      <button
        onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
        className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#2D4A3E] text-white px-4 py-2 rounded-lg shadow-lg cursor-pointer"
      >
        Filtros ({activeFilterCount} activos)
      </button>

      {/* Modal guardar búsqueda */}
      {showSaveSearchModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-[#1A1C14] mb-4">Guardar búsqueda</h3>
            <input
              type="text"
              value={searchName}
              onChange={e => setSearchName(e.target.value)}
              placeholder={`Búsqueda del ${new Date().toLocaleDateString('es-GT')}`}
              className="w-full border border-[#E8E0D0] rounded-lg px-3 py-2 text-sm mb-4"
              autoFocus
            />
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowSaveSearchModal(false)}
                className="px-4 py-2 text-sm text-[#5C6355] hover:text-[#2D4A3E] transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveSearch}
                className="px-4 py-2 text-sm bg-[#C9A84C] text-[#1A1C14] rounded-lg font-medium hover:bg-[#B8970A] transition-colors cursor-pointer"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}

      <Toast
        visible={toast.visible}
        message={toast.message}
        onHide={() => setToast({ visible: false, message: '' })}
      />
    </div>
  )
}