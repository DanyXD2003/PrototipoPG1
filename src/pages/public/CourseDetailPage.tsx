import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ChevronRight, PlayCircle, FileText, Code2, Check } from 'lucide-react'
import { courses } from '../../data/courses'
import Badge from '../../components/ui/Badge'
import RatingStars from '../../components/ui/RatingStars'
import Button from '../../components/ui/Button'

export default function CourseDetailPage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [expandedBlocks, setExpandedBlocks] = useState<string[]>([])

  const course = courses.find((c) => c.slug === slug)

  if (!course) {
    navigate('/404', { replace: true })
    return null
  }

  const toggleBlock = (blockId: string) => {
    setExpandedBlocks((prev) =>
      prev.includes(blockId) ? prev.filter((id) => id !== blockId) : [...prev, blockId]
    )
  }

  const unitTypes = [
    { icon: PlayCircle, label: 'Video' },
    { icon: FileText, label: 'Material' },
    { icon: Code2, label: 'Ejercicio' },
  ]

  return (
    <div className="bg-[#FAF7EF] min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <nav className="flex items-center gap-2 text-sm text-[#5C6355] mb-6">
          <Link to="/" className="hover:text-[#2D4A3E] cursor-pointer">Inicio</Link>
          <span>/</span>
          <Link to="/cursos" className="hover:text-[#2D4A3E] cursor-pointer">Cursos</Link>
          <span>/</span>
          <Link to={`/cursos?category=${course.category}`} className="hover:text-[#2D4A3E] cursor-pointer">
            {course.category}
          </Link>
          <span>/</span>
          <span className="text-[#1A1C14] truncate max-w-[200px]">{course.title}</span>
        </nav>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div>
              <div className="flex gap-2 mb-4">
                <Badge label={course.category} variant="category" />
                <Badge label={course.level} variant="level" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-[#1A1C14] mb-4">
                {course.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-[#5C6355]">
                <Link
                  to={`/org/${course.organization.slug}`}
                  className="flex items-center gap-2 hover:text-[#2D4A3E] cursor-pointer"
                >
                  <img
                    src={course.organization.logo}
                    alt={course.organization.name}
                    className="w-6 h-6 rounded-full"
                  />
                  <span className="font-medium text-[#1A1C14]">{course.organization.name}</span>
                </Link>
                <RatingStars rating={course.rating} reviewCount={course.reviewCount} />
                <span>•</span>
                <span className="flex items-center gap-1">
                  {course.enrolledCount.toLocaleString()} inscritos
                </span>
                <span>•</span>
                <span>Actualizado {new Date(course.createdAt).toLocaleDateString('es-ES', { month: 'short', year: 'numeric' })}</span>
              </div>
            </div>

            <section>
              <h2 className="text-xl font-semibold text-[#1A1C14] mb-4">Descripción</h2>
              <p className="text-[#5C6355] leading-relaxed">{course.longDescription}</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[#1A1C14] mb-4">Qué aprenderás</h2>
              <div className="grid md:grid-cols-2 gap-3">
                {course.whatYouLearn.map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-[#C9A84C] shrink-0 mt-0.5" />
                    <span className="text-[#1A1C14]">{item}</span>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[#1A1C14] mb-4">Temario</h2>
              <div className="space-y-3">
                {course.blocks.map((block) => (
                  <div
                    key={block.id}
                    className="border border-[#E8E0D0] rounded-xl overflow-hidden"
                  >
                    <button
                      onClick={() => toggleBlock(block.id)}
                      className="w-full flex items-center justify-between p-4 bg-[#F2EDE1] hover:bg-[#E8E0D0] transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <ChevronRight
                          className={`w-5 h-5 text-[#5C6355] transition-transform ${
                            expandedBlocks.includes(block.id) ? 'rotate-90' : ''
                          }`}
                        />
                        <span className="font-medium text-[#1A1C14]">{block.title}</span>
                      </div>
                      <span className="text-sm text-[#5C6355]">
                        {block.unitCount} unidades • {block.durationDays} días
                      </span>
                    </button>
                    {expandedBlocks.includes(block.id) && (
                      <div className="p-4 border-t border-[#E8E0D0] bg-white">
                        <p className="text-sm text-[#5C6355] mb-4">
                          Inscríbete para ver el contenido completo
                        </p>
                        <div className="space-y-2">
                          {[...Array(block.unitCount)].map((_, i) => {
                            const unitType = unitTypes[i % 3]
                            return (
                              <div
                                key={i}
                                className="flex items-center gap-3 text-sm text-[#5C6355]"
                              >
                                <unitType.icon className="w-4 h-4" />
                                <span>Unidad {i + 1}: Tema de ejemplo</span>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <p className="text-sm text-[#5C6355] mt-4">
                * Inscríbete para ver el contenido completo de cada bloque
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[#1A1C14] mb-4">Requisitos</h2>
              <ul className="space-y-2">
                {course.requirements.map((req, index) => (
                  <li key={index} className="flex items-center gap-2 text-[#5C6355]">
                    <span className="w-1.5 h-1.5 bg-[#5C6355] rounded-full" />
                    {req}
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[#1A1C14] mb-4">Para quién es este curso</h2>
              <ul className="space-y-2">
                {course.targetAudience.map((audience, index) => (
                  <li key={index} className="flex items-center gap-2 text-[#5C6355]">
                    <span className="w-1.5 h-1.5 bg-[#5C6355] rounded-full" />
                    {audience}
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white border border-[#E8E0D0] rounded-2xl overflow-hidden">
              <img
                src={course.coverImage}
                alt={course.title}
                className="w-full aspect-video object-cover"
              />
              <div className="p-6 space-y-4">
                <div className="text-2xl font-bold text-[#1A1C14]">
                  {course.price === 0 ? (
                    <span className="text-[#2E7D32]">Gratuito</span>
                  ) : (
                    `${course.currency === 'USD' ? '$' : ''}${course.price} ${course.currency}`
                  )}
                </div>

                <Button variant="primary" size="lg" className="w-full">
                  Inscribirse ahora
                </Button>

                <div className="space-y-3 pt-4 border-t border-[#E8E0D0]">
                  {[
                    'Acceso completo a todos los bloques',
                    'Certificado al completar',
                    'Acceso de por vida',
                    'Actualizaciones gratuitas',
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm text-[#5C6355]">
                      <Check className="w-4 h-4 text-[#2D4A3E]" />
                      {feature}
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-[#E8E0D0]">
                  <Link
                    to={`/org/${course.organization.slug}`}
                    className="flex items-center gap-3 p-3 bg-[#F2EDE1] rounded-xl hover:bg-[#E8E0D0] transition-colors cursor-pointer"
                  >
                    <img
                      src={course.organization.logo}
                      alt={course.organization.name}
                      className="w-10 h-10 rounded-full"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-[#1A1C14]">{course.organization.name}</p>
                      <p className="text-sm text-[#5C6355]">{course.organization.industry}</p>
                    </div>
                    <span className="text-sm text-[#2D4A3E]">Ver perfil →</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}