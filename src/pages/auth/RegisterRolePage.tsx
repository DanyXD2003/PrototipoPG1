import { useNavigate } from 'react-router-dom'
import { GraduationCap, Building2, UserCheck } from 'lucide-react'

export default function RegisterRolePage() {
  const navigate = useNavigate()

  const roles = [
    {
      icon: GraduationCap,
      title: 'Estudiante',
      description: 'Aprende con cursos de empresas y universidades. Certifícate y conecta con empleadores.',
      route: '/registro/estudiante',
    },
    {
      icon: Building2,
      title: 'Empresa o Universidad',
      description: 'Crea cursos de onboarding o de prestigio. Contrata buscando quién los completó.',
      route: '/registro/organizacion',
    },
    {
      icon: UserCheck,
      title: 'Instructor independiente',
      description: 'Publica tus propios cursos y llega a estudiantes que buscan crecer profesionalmente.',
      route: '/registro/instructor',
    },
  ]

  return (
    <div className="text-center">
      <h2 className="text-2xl font-bold text-[#1A1C14]">¿Cómo quieres usar Nexora?</h2>
      <p className="text-[#5C6355] mt-2 mb-8">Elige el perfil que mejor describe tu caso</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {roles.map((role) => {
          const Icon = role.icon
          return (
            <div
              key={role.route}
              onClick={() => navigate(role.route)}
              className="bg-white border border-[#E8E0D0] rounded-2xl p-6 cursor-pointer hover:border-[#2D4A3E] hover:shadow-md transition-all duration-200"
            >
              <Icon className="w-12 h-12 text-[#C9A84C] mx-auto mb-4" />
              <h3 className="font-semibold text-[#1A1C14] mb-2">{role.title}</h3>
              <p className="text-sm text-[#5C6355] mb-4">{role.description}</p>
              <span className="text-sm text-[#2D4A3E] font-medium">
                Comenzar →
              </span>
            </div>
          )
        })}
      </div>

      <p className="mt-8 text-[#5C6355]">
        ¿Ya tienes cuenta?{' '}
        <button
          onClick={() => navigate('/login')}
          className="text-[#2D4A3E] font-medium hover:underline cursor-pointer"
        >
          Inicia sesión
        </button>
      </p>
    </div>
  )
}