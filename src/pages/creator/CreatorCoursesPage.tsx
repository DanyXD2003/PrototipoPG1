import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Plus, MoreVertical, Edit3, Users, Award, Archive, Trash2 } from 'lucide-react'
import { useAuth } from '../../context/auth'
import { getCreatorCourses, CREATOR_ORG_SLUG } from '../../data/creatorData'
import Button from '../../components/ui/Button'

type StatusFilter = 'all' | 'published' | 'draft' | 'archived'

export default function CreatorCoursesPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const orgSlug = user?.orgSlug || CREATOR_ORG_SLUG
  const creatorCourses = getCreatorCourses(orgSlug)

  const [filter, setFilter] = useState<StatusFilter>('all')
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)

  const filteredCourses = creatorCourses.filter(({ data }) => {
    if (filter === 'all') return true
    return data?.status === filter
  })

  const handleAction = (courseSlug: string, action: string) => {
    setOpenMenuId(null)
    if (action === 'edit-blocks') {
      navigate(`/creator/cursos/${courseSlug}/bloques`)
    } else if (action === 'view-enrolled') {
      navigate(`/creator/cursos/${courseSlug}/inscritos`)
    } else if (action === 'view-completers') {
      navigate(`/creator/cursos/${courseSlug}/completadores`)
    } else if (action === 'archive') {
      alert('Funcionalidad de archivo (mockup)')
    } else if (action === 'delete') {
      if (confirm('¿Estás seguro de que deseas eliminar este curso?')) {
        alert('Curso eliminado (mockup)')
      }
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full">Publicado</span>
      case 'draft':
        return <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-full">Borrador</span>
      default:
        return <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">Archivado</span>
    }
  }

  const counts = {
    all: creatorCourses.length,
    published: creatorCourses.filter(c => c.data?.status === 'published').length,
    draft: creatorCourses.filter(c => c.data?.status === 'draft').length,
    archived: creatorCourses.filter(c => c.data?.status === 'archived').length,
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[#1A1C14]">Mis cursos</h1>
        <Link to="/creator/cursos/nuevo">
          <Button variant="primary">
            <Plus className="w-4 h-4 mr-2 inline" />
            Crear curso
          </Button>
        </Link>
      </div>

      <div className="flex gap-4 mb-6 border-b border-[#E8E0D0]">
        {(['all', 'published', 'draft', 'archived'] as StatusFilter[]).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`pb-3 text-sm font-medium transition-colors cursor-pointer ${
              filter === f
                ? 'border-b-2 border-[#2D4A3E] text-[#2D4A3E]'
                : 'text-[#5C6355] hover:text-[#2D4A3E]'
            }`}
          >
            {f === 'all' ? 'Todos' : f === 'published' ? 'Publicados' : f === 'draft' ? 'Borradores' : 'Archivados'} ({counts[f]})
          </button>
        ))}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left text-sm text-[#5C6355] border-b border-[#E8E0D0]">
              <th className="pb-3 font-medium">Curso</th>
              <th className="pb-3 font-medium">Estado</th>
              <th className="pb-3 font-medium">Inscritos</th>
              <th className="pb-3 font-medium">Complet.</th>
              <th className="pb-3 font-medium">Rating</th>
              <th className="pb-3 font-medium w-12"></th>
            </tr>
          </thead>
          <tbody>
            {filteredCourses.map(({ course, data }) => (
              <tr
                key={course.id}
                className="border-b border-[#E8E0D0] hover:bg-[#F2EDE1] transition-colors"
              >
                <td className="py-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={course.coverImage}
                      alt={course.title}
                      className="w-10 h-10 rounded-lg object-cover"
                    />
                    <span className="font-medium text-[#1A1C14]">{course.title}</span>
                  </div>
                </td>
                <td className="py-4">
                  {data && getStatusBadge(data.status)}
                </td>
                <td className="py-4 text-[#5C6355]">
                  {data?.totalEnrolled.toLocaleString() || '-'}
                </td>
                <td className="py-4 text-[#5C6355]">
                  {data?.totalCompleted || '-'}
                </td>
                <td className="py-4 text-[#5C6355]">
                  ⭐ {course.rating}
                </td>
                <td className="py-4 relative">
                  <button
                    onClick={() => setOpenMenuId(openMenuId === course.slug ? null : course.slug)}
                    className="p-2 hover:bg-[#F2EDE1] rounded-lg transition-colors cursor-pointer"
                  >
                    <MoreVertical className="w-4 h-4 text-[#5C6355]" />
                  </button>

                  {openMenuId === course.slug && (
                    <div className="absolute right-0 top-full mt-1 bg-white border border-[#E8E0D0] rounded-lg shadow-lg z-10 min-w-[180px]">
                      <button
                        onClick={() => handleAction(course.slug, 'edit-blocks')}
                        className="flex items-center gap-2 w-full px-4 py-2 text-sm text-[#1A1C14] hover:bg-[#F2EDE1] cursor-pointer text-left"
                      >
                        <Edit3 className="w-4 h-4" />
                        Editar bloques
                      </button>
                      <button
                        onClick={() => handleAction(course.slug, 'view-enrolled')}
                        className="flex items-center gap-2 w-full px-4 py-2 text-sm text-[#1A1C14] hover:bg-[#F2EDE1] cursor-pointer text-left"
                      >
                        <Users className="w-4 h-4" />
                        Ver inscritos
                      </button>
                      <button
                        onClick={() => handleAction(course.slug, 'view-completers')}
                        className="flex items-center gap-2 w-full px-4 py-2 text-sm text-[#1A1C14] hover:bg-[#F2EDE1] cursor-pointer text-left"
                      >
                        <Award className="w-4 h-4" />
                        Ver completadores
                      </button>
                      <hr className="my-1 border-[#E8E0D0]" />
                      <button
                        onClick={() => handleAction(course.slug, 'archive')}
                        className="flex items-center gap-2 w-full px-4 py-2 text-sm text-[#1A1C14] hover:bg-[#F2EDE1] cursor-pointer text-left"
                      >
                        <Archive className="w-4 h-4" />
                        Archivar
                      </button>
                      <button
                        onClick={() => handleAction(course.slug, 'delete')}
                        className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 cursor-pointer text-left"
                      >
                        <Trash2 className="w-4 h-4" />
                        Eliminar
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}