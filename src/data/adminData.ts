import type {
  AdminUser, AdminOrg, AdminCourse, WeeklyGrowth, ActivityItem
} from '../types'

const daysAgo = (n: number) =>
  new Date(Date.now() - n * 24 * 60 * 60 * 1000).toISOString()

export const platformStats = {
  totalUsers: 12_847,
  newUsersThisWeek: 234,
  totalOrganizations: 38,
  totalCourses: 156,
  activeCourses: 142,
  totalEnrollments: 48_291,
  newEnrollmentsThisWeek: 1_203,
  completionRate: 67,
  pendingCourses: 3,
}

export const adminUsers: AdminUser[] = [
  {
    id: 'u-1', name: 'María García', email: 'mariag@gmail.com',
    role: 'student', status: 'active',
    registeredAt: daysAgo(120), lastLoginAt: daysAgo(1), coursesEnrolled: 4,
  },
  {
    id: 'u-2', name: 'Carlos Mendoza', email: 'cmendoza@email.com',
    role: 'instructor', status: 'active',
    registeredAt: daysAgo(200), lastLoginAt: daysAgo(3),
  },
  {
    id: 'u-3', name: 'TechCorp Latam', email: 'contacto@techcorp.gt',
    role: 'organization', status: 'active',
    registeredAt: daysAgo(365), lastLoginAt: daysAgo(0),
  },
  {
    id: 'u-4', name: 'Andrea López', email: 'alopez@hotmail.com',
    role: 'student', status: 'active',
    registeredAt: daysAgo(60), lastLoginAt: daysAgo(2), coursesEnrolled: 2,
  },
  {
    id: 'u-5', name: 'José Ramírez', email: 'jramirez@gmail.com',
    role: 'student', status: 'suspended',
    registeredAt: daysAgo(90), lastLoginAt: daysAgo(15), coursesEnrolled: 1,
  },
  {
    id: 'u-6', name: 'Universidad del Valle', email: 'uvg@uvg.edu.gt',
    role: 'organization', status: 'active',
    registeredAt: daysAgo(180), lastLoginAt: daysAgo(5),
  },
  {
    id: 'u-7', name: 'Sofía Torres', email: 'storres@gmail.com',
    role: 'instructor', status: 'active',
    registeredAt: daysAgo(45), lastLoginAt: daysAgo(1),
  },
  {
    id: 'u-8', name: 'Diego Castillo', email: 'dcastillo@outlook.com',
    role: 'student', status: 'active',
    registeredAt: daysAgo(30), lastLoginAt: daysAgo(0), coursesEnrolled: 3,
  },
  {
    id: 'u-9', name: 'Finanzas GT Corp', email: 'admin@finanzasgt.com',
    role: 'organization', status: 'suspended',
    registeredAt: daysAgo(270), lastLoginAt: daysAgo(45),
  },
  {
    id: 'u-10', name: 'Laura Velásquez', email: 'lvelasquez@gmail.com',
    role: 'student', status: 'active',
    registeredAt: daysAgo(10), lastLoginAt: daysAgo(1), coursesEnrolled: 1,
  },
]

export const adminOrgs: AdminOrg[] = [
  {
    id: 'ao-1', name: 'TechCorp Latam', slug: 'techcorp-latam',
    industry: 'Tecnología', courseCount: 4, studentCount: 3200,
    status: 'verified', registeredAt: daysAgo(365), contactEmail: 'contacto@techcorp.gt',
  },
  {
    id: 'ao-2', name: 'Universidad del Valle de Guatemala', slug: 'uvg',
    industry: 'Educación Superior', courseCount: 7, studentCount: 5100,
    status: 'verified', registeredAt: daysAgo(300), contactEmail: 'uvg@uvg.edu.gt',
  },
  {
    id: 'ao-3', name: 'Finanzas GT Corp', slug: 'finanzas-gt',
    industry: 'Finanzas', courseCount: 2, studentCount: 890,
    status: 'suspended', registeredAt: daysAgo(270), contactEmail: 'admin@finanzasgt.com',
  },
  {
    id: 'ao-4', name: 'Agencia Digital Creativa', slug: 'agencia-digital',
    industry: 'Marketing', courseCount: 0, studentCount: 0,
    status: 'pending', registeredAt: daysAgo(3), contactEmail: 'hola@agenciadigital.gt',
  },
  {
    id: 'ao-5', name: 'Salud Tech Guatemala', slug: 'salud-tech-gt',
    industry: 'Salud y Tecnología', courseCount: 0, studentCount: 0,
    status: 'pending', registeredAt: daysAgo(7), contactEmail: 'info@saludtechgt.com',
  },
  {
    id: 'ao-6', name: 'Instituto Liderazgo GT', slug: 'liderazgo-gt',
    industry: 'Liderazgo y Negocios', courseCount: 3, studentCount: 1200,
    status: 'verified', registeredAt: daysAgo(150), contactEmail: 'info@liderazgogt.com',
  },
]

export const adminCourses: AdminCourse[] = [
  {
    id: 'ac-1', slug: 'diseno-ui-ux-avanzado',
    title: 'Diseño UI/UX Avanzado con Figma',
    orgName: 'Agencia Digital Creativa', orgSlug: 'agencia-digital',
    category: 'Diseño', submittedAt: daysAgo(2),
    status: 'pending', blockCount: 4, price: 299,
  },
  {
    id: 'ac-2', slug: 'inteligencia-artificial-salud',
    title: 'IA Aplicada en el Sector Salud',
    orgName: 'Salud Tech Guatemala', orgSlug: 'salud-tech-gt',
    category: 'Tecnología', submittedAt: daysAgo(4),
    status: 'pending', blockCount: 5, price: 450,
  },
  {
    id: 'ac-3', slug: 'liderazgo-equipos-remotos',
    title: 'Liderazgo de Equipos Remotos',
    orgName: 'Instituto Liderazgo GT', orgSlug: 'liderazgo-gt',
    category: 'Liderazgo', submittedAt: daysAgo(1),
    status: 'pending', blockCount: 3, price: null,
  },
  {
    id: 'ac-4', slug: 'python-analisis-datos',
    title: 'Python para Análisis de Datos',
    orgName: 'Universidad del Valle de Guatemala', orgSlug: 'uvg',
    category: 'Tecnología', submittedAt: daysAgo(30),
    status: 'approved', blockCount: 3, price: 350,
  },
  {
    id: 'ac-5', slug: 'introduccion-arquitectura-microservicios',
    title: 'Introducción a la Arquitectura de Microservicios',
    orgName: 'TechCorp Latam', orgSlug: 'techcorp-latam',
    category: 'Tecnología', submittedAt: daysAgo(60),
    status: 'approved', blockCount: 4, price: 299,
  },
  {
    id: 'ac-6', slug: 'marketing-dudoso',
    title: 'Gana Dinero Fácil con Marketing Digital',
    orgName: 'Agencia Digital Creativa', orgSlug: 'agencia-digital',
    category: 'Marketing', submittedAt: daysAgo(10),
    status: 'rejected',
    rejectionReason: 'El título y descripción no cumplen los estándares de calidad de Nexora. El contenido no tiene respaldo técnico verificable.',
    blockCount: 2, price: 99,
  },
]

export const weeklyGrowth: WeeklyGrowth[] = [
  { week: 'Sem 1', users: 142, enrollments: 612 },
  { week: 'Sem 2', users: 198, enrollments: 834 },
  { week: 'Sem 3', users: 176, enrollments: 921 },
  { week: 'Sem 4', users: 221, enrollments: 1_043 },
  { week: 'Sem 5', users: 189, enrollments: 987 },
  { week: 'Sem 6', users: 256, enrollments: 1_189 },
  { week: 'Sem 7', users: 234, enrollments: 1_087 },
  { week: 'Sem 8', users: 312, enrollments: 1_203 },
]

export const recentActivity: ActivityItem[] = [
  { id: 'a-1', type: 'user_registered', text: 'Laura Velásquez se registró como estudiante', time: daysAgo(0) },
  { id: 'a-2', type: 'course_published', text: 'TechCorp Latam envió "Onboarding Técnico v2" a revisión', time: daysAgo(0) },
  { id: 'a-3', type: 'org_joined', text: 'Agencia Digital Creativa se unió a la plataforma', time: daysAgo(1) },
  { id: 'a-4', type: 'course_completed', text: '47 estudiantes completaron "Python para Análisis de Datos" esta semana', time: daysAgo(1) },
  { id: 'a-5', type: 'user_registered', text: 'Diego Castillo se registró como estudiante', time: daysAgo(2) },
  { id: 'a-6', type: 'org_joined', text: 'Salud Tech Guatemala se unió a la plataforma', time: daysAgo(3) },
  { id: 'a-7', type: 'course_published', text: 'Universidad del Valle publicó un nuevo curso de IA', time: daysAgo(4) },
  { id: 'a-8', type: 'course_completed', text: '128 estudiantes completaron cursos esta semana', time: daysAgo(5) },
]

export const topCourses = [
  { title: 'Python para Análisis de Datos', org: 'UVG', enrollments: 8_420, completionRate: 71 },
  { title: 'Intro a la Arquitectura de Microservicios', org: 'TechCorp Latam', enrollments: 6_241, completionRate: 58 },
  { title: 'Diseño de Experiencias Digitales', org: 'Instituto Liderazgo GT', enrollments: 5_103, completionRate: 64 },
  { title: 'Machine Learning Aplicado a la Salud', org: 'UVG', enrollments: 4_872, completionRate: 55 },
  { title: 'Growth Hacking para Startups', org: 'Carlos Mendoza', enrollments: 3_994, completionRate: 79 },
]

export function getAdminCoursesByStatus(status: AdminCourse['status']): AdminCourse[] {
  return adminCourses.filter(c => c.status === status)
}