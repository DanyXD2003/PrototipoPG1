import type { AuthUser } from '../types'

export const mockUsers: AuthUser[] = [
  {
    id: 'user-1',
    name: 'María García',
    email: 'estudiante@nexora.com',
    role: 'student',
    bio: 'Desarrolladora frontend apasionada por el aprendizaje continuo.',
  },
  {
    id: 'user-2',
    name: 'TechCorp Latam',
    email: 'empresa@techcorp.com',
    role: 'organization',
    bio: 'Empresa líder en soluciones tecnológicas para Latinoamérica.',
    orgSlug: 'techcorp-latam',
  },
  {
    id: 'user-3',
    name: 'Carlos Mendoza',
    email: 'instructor@nexora.com',
    role: 'instructor',
    bio: 'Arquitecto de software con 15 años de experiencia.',
    instructorSlug: 'carlos-mendoza',
  },
]

export const DEMO_PASSWORD = 'password'