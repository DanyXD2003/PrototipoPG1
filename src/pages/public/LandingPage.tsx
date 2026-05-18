import { Link } from 'react-router-dom'
import {
  BookOpen,
  Award,
  Briefcase,
  ChevronRight,
  CheckCircle,
  Building2,
  GraduationCap,
  UserCheck,
  Building2 as BuildingIcon,
  Users as UsersIcon,
  Star,
} from 'lucide-react'
import Button from '../../components/ui/Button'
import CourseCard from '../../components/course/CourseCard'
import { courses } from '../../data/courses'
import { testimonials } from '../../data/testimonials'

export default function LandingPage() {
  const featuredCourses = courses.filter(c => c.featured).slice(0, 3)

  return (
    <div className="bg-[#FAF7EF]">
      <section className="relative pt-16 pb-24 px-6">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 -right-20 w-96 h-96 bg-[#F2EDE1] rounded-full opacity-50 blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto relative">
          <div className="text-center max-w-4xl mx-auto animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#F2EDE1] border border-[#E8E0D0] rounded-full mb-8">
              <span className="text-[#C9A84C]">✦</span>
              <span className="text-sm text-[#5C6355]">Plataforma de aprendizaje con IA</span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-[#1A1C14] mb-6 leading-tight">
              Aprende. Certifícate.
              <br />
              <span className="text-[#2D4A3E]">Consigue el trabajo.</span>
            </h1>

            <p className="text-lg text-[#5C6355] max-w-2xl mx-auto mb-10 leading-relaxed">
              Conectamos el aprendizaje con el mercado laboral. Las empresas crean cursos,
              los estudiantes los completan y los empleadores contratan directamente desde la plataforma.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <Button href="/cursos" variant="primary" size="lg">
                Explorar cursos →
              </Button>
              <Button href="/org" variant="outline" size="lg">
                Para organizaciones
              </Button>
            </div>

            <div className="flex items-center justify-center gap-8 md:gap-16 pt-8 border-t border-[#E8E0D0]">
              <div className="flex items-center gap-2">
                <BuildingIcon className="w-5 h-5 text-[#C9A84C]" />
                <span className="text-2xl font-bold text-[#1A1C14]">+120</span>
                <span className="text-[#5C6355]">organizaciones</span>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-[#C9A84C]" />
                <span className="text-2xl font-bold text-[#1A1C14]">+500</span>
                <span className="text-[#5C6355]">cursos</span>
              </div>
              <div className="flex items-center gap-2">
                <UsersIcon className="w-5 h-5 text-[#C9A84C]" />
                <span className="text-2xl font-bold text-[#1A1C14]">+12k</span>
                <span className="text-[#5C6355]">estudiantes</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1A1C14] mb-4">
              Así funciona Nexora
            </h2>
            <p className="text-lg text-[#5C6355]">
              Tres pasos para conectar aprendizaje con empleo
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-1/2 left-1/4 right-1/4 h-0.5 bg-[#E8E0D0] -translate-y-1/2" />

            {[
              {
                icon: BookOpen,
                title: 'Elige tu curso',
                description: 'Explora cursos creados por empresas, universidades y profesores especializados.',
              },
              {
                icon: Award,
                title: 'Completa los bloques',
                description: 'Avanza por bloques con tiempo definido. Aprueba cada uno para desbloquear el siguiente.',
              },
              {
                icon: Briefcase,
                title: 'Conecta con empleadores',
                description: 'Tu historial de cursos completados es visible para empresas que buscan talento.',
              },
            ].map((step, index) => (
              <div key={index} className="relative text-center p-6">
                <div className="w-16 h-16 mx-auto mb-6 bg-[#C9A84C] rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold text-[#1A1C14]">{index + 1}</span>
                </div>
                <div className="w-12 h-12 mx-auto mb-4 bg-[#2D4A3E] rounded-full flex items-center justify-center">
                  <step.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-[#1A1C14] mb-2">{step.title}</h3>
                <p className="text-[#5C6355]">{step.description}</p>
                {index < 2 && (
                  <ChevronRight className="hidden md:block absolute -right-4 top-1/2 -translate-y-1/2 text-[#E8E0D0] w-8 h-8" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-[#F2EDE1]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1A1C14] mb-4">
              Diseñado para cada parte del ecosistema
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-1 p-8 bg-[#FAF7EF] rounded-2xl border border-[#E8E0D0]">
              <Building2 className="w-12 h-12 text-[#C9A84C] mb-4" />
              <h3 className="text-xl font-semibold text-[#1A1C14] mb-3">Para Empresas</h3>
              <p className="text-[#5C6355] mb-6">
                Crea cursos de onboarding personalizados. Cuando quieras contratar, busca directamente quién completó tus cursos — o los de otras empresas que admiras.
              </p>
              <ul className="space-y-3 mb-6">
                {['Cursos de onboarding listos', 'Busca talento por credenciales', 'Acceso a historial de aprendizaje'].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-[#1A1C14]">
                    <CheckCircle className="w-5 h-5 text-[#2D4A3E]" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link to="/org" className="text-[#2D4A3E] font-medium hover:underline cursor-pointer">
                Registrar mi empresa →
              </Link>
            </div>

            <div className="p-8 bg-[#FAF7EF] rounded-2xl border border-[#E8E0D0]">
              <GraduationCap className="w-12 h-12 text-[#C9A84C] mb-4" />
              <h3 className="text-xl font-semibold text-[#1A1C14] mb-3">Para Universidades</h3>
              <p className="text-[#5C6355] mb-6">
                Crea cursos de prestigio que las empresas usan como filtro de contratación.
              </p>
              <Link to="/org" className="text-[#2D4A3E] font-medium hover:underline cursor-pointer">
                Para instituciones →
              </Link>
            </div>

            <div className="p-8 bg-[#FAF7EF] rounded-2xl border border-[#E8E0D0]">
              <UserCheck className="w-12 h-12 text-[#C9A84C] mb-4" />
              <h3 className="text-xl font-semibold text-[#1A1C14] mb-3">Para Instructores</h3>
              <p className="text-[#5C6355] mb-6">
                Publica tus cursos y llega a estudiantes que buscan avanzar en sus carreras.
              </p>
              <Link to="/instructores" className="text-[#2D4A3E] font-medium hover:underline cursor-pointer">
                Empezar a enseñar →
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1A1C14] mb-4">
              Cursos populares
            </h2>
            <p className="text-lg text-[#5C6355]">
              Seleccionados por calidad y relevancia laboral
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {featuredCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>

          <div className="text-center">
            <Link
              to="/cursos"
              className="inline-flex items-center gap-2 text-[#2D4A3E] font-medium hover:underline cursor-pointer"
            >
              Ver todos los cursos →
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-[#2D4A3E]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Lo que dicen quienes ya usan Nexora
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="p-6 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-[#C9A84C] text-[#C9A84C]" />
                  ))}
                </div>
                <p className="text-white/90 mb-6 italic">"{testimonial.quote}"</p>
                <div className="flex items-center gap-4">
                  {testimonial.avatar ? (
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-[#C9A84C] flex items-center justify-center text-[#1A1C14] font-bold">
                      {testimonial.name.charAt(0)}
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-white">{testimonial.name}</p>
                    <p className="text-sm text-white/70">
                      {testimonial.role} en {testimonial.company}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-[#1A1C14] mb-4">
            ¿Listo para empezar?
          </h2>
          <p className="text-lg text-[#5C6355] mb-10">
            Únete a más de 12,000 profesionales que ya están aprendiendo.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button variant="primary" size="lg">
              Crear cuenta gratis
            </Button>
            <Button href="/cursos" variant="outline" size="lg">
              Ver cursos
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}