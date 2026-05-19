import { Link } from 'react-router-dom'
import { BookPlus } from 'lucide-react'
import { useAuth } from '../../context/auth'
import { getCreatorCourses, CREATOR_ORG_SLUG } from '../../data/creatorData'
import Button from '../../components/ui/Button'

export default function CreatorDashboardPage() {
  const { user } = useAuth()
  const orgSlug = user?.orgSlug || CREATOR_ORG_SLUG
  const creatorCourses = getCreatorCourses(orgSlug)

  const totalEnrolled = creatorCourses.reduce((sum, c) => sum + (c.data?.totalEnrolled || 0), 0)
  const avgCompletion = creatorCourses.length > 0
    ? Math.round(creatorCourses.reduce((sum, c) => sum + (c.data?.completionRate || 0), 0) / creatorCourses.length)
    : 0

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

  if (creatorCourses.length === 0) {
    return (
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-[#1A1C14]">
          Hola, {user?.name || 'Creador'} 👋
        </h1>
        <p className="text-[#5C6355] mt-1 mb-8">Panel de creación de contenido</p>

        <div className="text-center py-16">
          <BookPlus className="w-16 h-16 text-[#5C6355]/30 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-[#1A1C14] mb-2">Aún no has creado ningún curso</h2>
          <p className="text-[#5C6355] mb-6">Comienza a crear tu primer curso para llegar a miles de estudiantes.</p>
          <Link to="/creator/cursos/nuevo">
            <Button variant="primary">Crear mi primer curso</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-[#1A1C14]">
        Hola, {user?.name || 'Creador'} 👋
      </h1>
      <p className="text-[#5C6355] mt-1 mb-8">Panel de creación de contenido</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white border border-[#E8E0D0] rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-[#1A1C14]">{creatorCourses.length}</div>
          <div className="text-sm text-[#5C6355]">Cursos activos</div>
        </div>
        <div className="bg-white border border-[#E8E0D0] rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-[#1A1C14]">{totalEnrolled.toLocaleString()}</div>
          <div className="text-sm text-[#5C6355]">Inscritos totales</div>
        </div>
        <div className="bg-white border border-[#E8E0D0] rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-[#1A1C14]">{avgCompletion}%</div>
          <div className="text-sm text-[#5C6355]">Completación</div>
        </div>
        <div className="bg-white border border-[#E8E0D0] rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-[#1A1C14]">12</div>
          <div className="text-sm text-[#5C6355]">Este mes completaron</div>
        </div>
      </div>

      <h2 className="text-lg font-semibold text-[#1A1C14] mb-4">Mis cursos</h2>

      <div className="space-y-4">
        {creatorCourses.map(({ course, data }) => (
          <div key={course.id} className="bg-white border border-[#E8E0D0] rounded-xl p-4 flex gap-4 hover:border-[#2D4A3E]/30 hover:shadow-sm transition-all cursor-pointer">
            <img
              src={course.coverImage}
              alt={course.title}
              className="w-16 h-16 rounded-lg object-cover shrink-0"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-1">
                <h3 className="font-medium text-[#1A1C14] truncate">{course.title}</h3>
                {data && getStatusBadge(data.status)}
              </div>
              <p className="text-sm text-[#5C6355] mb-3">
                {data?.totalEnrolled.toLocaleString()} inscritos · {data?.totalCompleted} completados · ⭐ {course.rating}
              </p>
              <div className="flex gap-3">
                <Link
                  to={`/creator/cursos/${course.slug}/inscritos`}
                  className="text-sm text-[#2D4A3E] hover:underline cursor-pointer"
                >
                  Ver inscritos
                </Link>
                <Link
                  to={`/creator/cursos/${course.slug}/bloques`}
                  className="text-sm text-[#2D4A3E] hover:underline cursor-pointer"
                >
                  Editar bloques
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-8">
        <Link to="/creator/cursos/nuevo">
          <Button variant="primary">Crear nuevo curso</Button>
        </Link>
      </div>
    </div>
  )
}