import type { CreatorCourseData, CreatorStudent, CreatorCompleter, AnalyticsWeek, BlockDropoffData } from '../types'
import { courses } from './courses'

export const CREATOR_ORG_SLUG = 'techcorp-latam'
export const CREATOR_INSTRUCTOR_SLUG = 'carlos-mendoza'

export const creatorCoursesData: CreatorCourseData[] = [
  {
    courseId: 'course-1',
    slug: 'introduccion-arquitectura-microservicios',
    status: 'published',
    publishedAt: '2025-09-01',
    totalEnrolled: 1240,
    totalCompleted: 88,
    completionRate: 7,
  },
  {
    courseId: 'course-2',
    slug: 'onboarding-tecnico-techcorp',
    status: 'published',
    publishedAt: '2025-10-15',
    totalEnrolled: 242,
    totalCompleted: 48,
    completionRate: 20,
  },
]

export function getCreatorCourses(orgSlug: string) {
  return courses
    .filter(c => c.organization.slug === orgSlug)
    .map(course => {
      const data = creatorCoursesData.find(d => d.slug === course.slug)
      return { course, data: data ?? null }
    })
}

export function getCreatorCourse(orgSlug: string, courseSlug: string) {
  const course = courses.find(c => c.slug === courseSlug && c.organization.slug === orgSlug)
  const data = creatorCoursesData.find(d => d.slug === courseSlug) ?? null
  return course ? { course, data } : null
}

export const creatorStudents: CreatorStudent[] = [
  {
    id: 'st-1',
    name: 'María García',
    avatar: 'https://i.pravatar.cc/40?u=maria-garcia',
    email: 'maria@ejemplo.com',
    enrolledAt: '2025-11-01',
    currentBlockTitle: 'Diseño de APIs y Contratos',
    currentBlockId: 'b2',
    overallProgress: 25,
    lastAccessAt: '2026-05-17',
    status: 'active',
  },
  {
    id: 'st-2',
    name: 'Carlos Ruiz',
    avatar: 'https://i.pravatar.cc/40?u=carlos-ruiz',
    email: 'carlos@empresa.com',
    enrolledAt: '2025-11-05',
    currentBlockTitle: 'Comunicación entre Servicios',
    currentBlockId: 'b3',
    overallProgress: 50,
    lastAccessAt: '2026-05-16',
    status: 'active',
  },
  {
    id: 'st-3',
    name: 'Ana Rodríguez',
    avatar: 'https://i.pravatar.cc/40?u=ana-rodriguez',
    email: 'ana@startup.io',
    enrolledAt: '2025-11-10',
    currentBlockTitle: 'Fundamentos de Arquitectura Distribuida',
    currentBlockId: 'b1',
    overallProgress: 10,
    lastAccessAt: '2026-04-20',
    status: 'inactive',
  },
  {
    id: 'st-4',
    name: 'Luis Fernández',
    avatar: 'https://i.pravatar.cc/40?u=luis-fernandez',
    email: 'luis@tech.gt',
    enrolledAt: '2025-11-12',
    currentBlockTitle: 'Despliegue y Orquestación',
    currentBlockId: 'b4',
    overallProgress: 75,
    lastAccessAt: '2026-05-18',
    status: 'active',
  },
  {
    id: 'st-5',
    name: 'Sofía Martínez',
    avatar: 'https://i.pravatar.cc/40?u=sofia-martinez',
    email: 'sofia@devs.com',
    enrolledAt: '2025-11-15',
    currentBlockTitle: 'Completado',
    currentBlockId: 'b4',
    overallProgress: 100,
    lastAccessAt: '2026-01-10',
    status: 'completed',
  },
  {
    id: 'st-6',
    name: 'Diego López',
    avatar: 'https://i.pravatar.cc/40?u=diego-lopez',
    email: 'diego@corp.com',
    enrolledAt: '2025-12-01',
    currentBlockTitle: 'Diseño de APIs y Contratos',
    currentBlockId: 'b2',
    overallProgress: 30,
    lastAccessAt: '2026-05-15',
    status: 'active',
  },
  {
    id: 'st-7',
    name: 'Valentina Cruz',
    avatar: 'https://i.pravatar.cc/40?u=valentina-cruz',
    email: 'valentina@uni.edu',
    enrolledAt: '2025-12-05',
    currentBlockTitle: 'Fundamentos de Arquitectura Distribuida',
    currentBlockId: 'b1',
    overallProgress: 5,
    lastAccessAt: '2026-03-01',
    status: 'inactive',
  },
  {
    id: 'st-8',
    name: 'Andrés Torres',
    avatar: 'https://i.pravatar.cc/40?u=andres-torres',
    email: 'andres@devco.gt',
    enrolledAt: '2025-12-10',
    currentBlockTitle: 'Comunicación entre Servicios',
    currentBlockId: 'b3',
    overallProgress: 60,
    lastAccessAt: '2026-05-14',
    status: 'active',
  },
]

export const creatorCompleters: CreatorCompleter[] = [
  { id: 'cp-1', name: 'Sofía Martínez', avatar: 'https://i.pravatar.cc/40?u=sofia-martinez', enrolledAt: '2025-11-15', completedAt: '2026-01-10', finalGrade: 91, timeInvestedDays: 56 },
  { id: 'cp-2', name: 'Roberto Jiménez', avatar: 'https://i.pravatar.cc/40?u=roberto-jimenez', enrolledAt: '2025-09-20', completedAt: '2025-12-05', finalGrade: 84, timeInvestedDays: 76 },
  { id: 'cp-3', name: 'Camila Vásquez', avatar: 'https://i.pravatar.cc/40?u=camila-vasquez', enrolledAt: '2025-09-25', completedAt: '2025-12-20', finalGrade: 79, timeInvestedDays: 86 },
  { id: 'cp-4', name: 'Felipe Morales', avatar: 'https://i.pravatar.cc/40?u=felipe-morales', enrolledAt: '2025-10-01', completedAt: '2026-01-15', finalGrade: 95, timeInvestedDays: 106 },
  { id: 'cp-5', name: 'Isabella Ramos', avatar: 'https://i.pravatar.cc/40?u=isabella-ramos', enrolledAt: '2025-10-10', completedAt: '2026-02-01', finalGrade: 88, timeInvestedDays: 114 },
]

export const enrollmentByWeek: AnalyticsWeek[] = [
  { label: 'Sem 1', enrolled: 45 },
  { label: 'Sem 2', enrolled: 62 },
  { label: 'Sem 3', enrolled: 38 },
  { label: 'Sem 4', enrolled: 81 },
  { label: 'Sem 5', enrolled: 55 },
  { label: 'Sem 6', enrolled: 94 },
  { label: 'Sem 7', enrolled: 72 },
  { label: 'Sem 8', enrolled: 110 },
]

export const blockDropoff: BlockDropoffData[] = [
  { blockTitle: 'Bloque 1: Fundamentos', reachedPercent: 100 },
  { blockTitle: 'Bloque 2: Diseño de APIs', reachedPercent: 74 },
  { blockTitle: 'Bloque 3: Comunicación', reachedPercent: 42 },
  { blockTitle: 'Bloque 4: Despliegue', reachedPercent: 18 },
]