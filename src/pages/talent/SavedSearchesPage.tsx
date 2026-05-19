import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, Trash2 } from 'lucide-react'
import { savedSearchesMock } from '../../data/talentData'
import { courses } from '../../data/courses'
import type { SavedSearch } from '../../types'

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  const day = date.getDate()
  const month = date.toLocaleString('es-GT', { month: 'short' })
  const year = date.getFullYear()
  return `${day} ${month} ${year}`
}

function getCourseTitle(slug: string): string {
  const course = courses.find((c) => c.slug === slug)
  return course?.title || slug
}

export default function SavedSearchesPage() {
  const navigate = useNavigate()
  const [searches, setSearches] = useState<SavedSearch[]>(savedSearchesMock)
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)

  const handleRerun = (search: SavedSearch) => {
    navigate('/talent/buscar', { state: { filters: search.filters } })
  }

  const handleDelete = (id: string) => {
    setSearches(prev => prev.filter(s => s.id !== id))
    setDeleteConfirmId(null)
  }

  if (searches.length === 0) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-[#1A1C14] mb-6">Búsquedas guardadas</h1>
        <div className="text-center py-12">
          <Search className="w-12 h-12 mx-auto text-[#5C6355] mb-4" />
          <p className="text-[#1A1C14] font-medium mb-2">No tienes búsquedas guardadas</p>
          <Link
            to="/talent/buscar"
            className="text-sm text-[#2D4A3E] hover:text-[#4A7C59] transition-colors cursor-pointer"
          >
            Buscar talento
          </Link>
        </div>
      </div>
    )
  }

  const getFilterDescription = (search: SavedSearch) => {
    const parts: string[] = []
    
    if (search.filters.courseSlug) {
      parts.push(`Curso: ${getCourseTitle(search.filters.courseSlug)}`)
    } else {
      parts.push('Todos los cursos')
    }
    
    parts.push(`Nota mín: ${search.filters.minGrade}`)
    
    if (search.filters.completedAfter) {
      const date = new Date(search.filters.completedAfter)
      const month = date.toLocaleString('es-GT', { month: 'short', year: 'numeric' })
      parts.push(`Completado desde: ${month}`)
    }
    
    if (search.filters.availability === 'available') {
      parts.push('Solo disponibles')
    } else if (search.filters.availability === 'open') {
      parts.push('Solo abiertos')
    }
    
    return parts.join(' · ')
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[#1A1C14]">Búsquedas guardadas ({searches.length})</h1>
        <Link
          to="/talent/buscar"
          className="flex items-center gap-2 px-4 py-2 bg-[#C9A84C] text-[#1A1C14] rounded-lg font-medium hover:bg-[#B8970A] transition-colors cursor-pointer"
        >
          Nueva búsqueda
        </Link>
      </div>

      <div className="space-y-4">
        {searches.map(search => (
          <div
            key={search.id}
            className="bg-white border border-[#E8E0D0] rounded-xl p-4"
          >
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-semibold text-[#1A1C14]">{search.name}</h3>
              <span className="text-sm text-[#5C6355]">{search.resultCount} resultados</span>
            </div>
            
            <p className="text-sm text-[#5C6355] mb-2">
              {getFilterDescription(search)}
            </p>
            
            <p className="text-xs text-[#5C6355] mb-4">
              Última ejecución: {formatDate(search.lastRunAt)}
            </p>
            
            <div className="flex gap-3">
              <button
                onClick={() => handleRerun(search)}
                className="flex items-center gap-2 text-sm text-[#2D4A3E] border border-[#2D4A3E] px-3 py-1.5 rounded-lg hover:bg-[#F2EDE1] transition-colors cursor-pointer"
              >
                Re-ejecutar →
              </button>
              <button
                onClick={() => setDeleteConfirmId(search.id)}
                className="flex items-center gap-2 text-sm text-[#5C6355] hover:text-red-600 transition-colors cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                Eliminar
              </button>
            </div>

            {deleteConfirmId === search.id && (
              <div className="mt-4 p-3 bg-[#F2EDE1] rounded-lg">
                <p className="text-sm text-[#1A1C14] mb-3">
                  ¿Estás seguro de que quieres eliminar esta búsqueda?
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setDeleteConfirmId(null)}
                    className="px-3 py-1.5 text-sm text-[#5C6355] hover:text-[#2D4A3E] cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={() => handleDelete(search.id)}
                    className="px-3 py-1.5 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 cursor-pointer"
                  >
                    Confirmar
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}