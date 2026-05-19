import type { TalentCandidate, SavedCandidate, SavedSearch, TalentFilters } from '../types'

export const talentCandidates: TalentCandidate[] = [
  {
    id: 'tc-1',
    username: 'carlos-mendoza-dev',
    name: 'Carlos Mendoza',
    avatar: 'https://i.pravatar.cc/150?u=carlos-mendoza',
    title: 'Arquitecto de Software Senior',
    bio: 'Desarrollador con 8 años de experiencia en arquitectura de sistemas distribuidos y microservicios. Apasionado por construir sistemas escalables.',
    location: 'Guatemala, GT',
    skills: ['Microservicios', 'Node.js', 'Docker', 'AWS', 'Kubernetes'],
    availability: 'open',
    linkedinUrl: '#',
    completedCourses: [
      { courseSlug: 'introduccion-arquitectura-microservicios', courseTitle: 'Introducción a la Arquitectura de Microservicios', orgName: 'TechCorp Latam', orgSlug: 'techcorp-latam', completedAt: '2026-01-10', grade: 88 },
      { courseSlug: 'python-analisis-datos', courseTitle: 'Python para Análisis de Datos', orgName: 'Universidad de la Innovación', orgSlug: 'universidad-innovacion', completedAt: '2026-02-20', grade: 92 },
    ],
  },
  {
    id: 'tc-2',
    username: 'sofia-martinez-ux',
    name: 'Sofía Martínez',
    avatar: 'https://i.pravatar.cc/150?u=sofia-martinez',
    title: 'Diseñadora UX/UI Senior',
    bio: 'Diseñadora con enfoque en experiencias centradas en el usuario. Experiencia en SaaS, e-commerce y aplicaciones móviles.',
    location: 'Ciudad de Guatemala, GT',
    skills: ['Figma', 'UX Research', 'Diseño de Sistemas', 'Prototipado', 'Accesibilidad'],
    availability: 'available',
    linkedinUrl: '#',
    completedCourses: [
      { courseSlug: 'diseno-experiencias-digitales', courseTitle: 'Diseño de Experiencias Digitales', orgName: 'Universidad de la Innovación', orgSlug: 'universidad-innovacion', completedAt: '2026-01-15', grade: 95 },
      { courseSlug: 'estrategia-liderazgo-digital', courseTitle: 'Estrategia y Liderazgo Digital', orgName: 'StartupHub Academy', orgSlug: 'startup-hub', completedAt: '2026-03-05', grade: 87 },
    ],
  },
  {
    id: 'tc-3',
    username: 'diego-lopez-backend',
    name: 'Diego López',
    avatar: 'https://i.pravatar.cc/150?u=diego-lopez',
    title: 'Desarrollador Backend',
    bio: 'Especialista en APIs REST y microservicios. Trabajo con equipos ágiles en proyectos de alta demanda.',
    location: 'Antigua Guatemala, GT',
    skills: ['Python', 'FastAPI', 'PostgreSQL', 'Redis', 'Docker'],
    availability: 'open',
    linkedinUrl: '#',
    completedCourses: [
      { courseSlug: 'introduccion-arquitectura-microservicios', courseTitle: 'Introducción a la Arquitectura de Microservicios', orgName: 'TechCorp Latam', orgSlug: 'techcorp-latam', completedAt: '2025-12-20', grade: 79 },
      { courseSlug: 'python-analisis-datos', courseTitle: 'Python para Análisis de Datos', orgName: 'Universidad de la Innovación', orgSlug: 'universidad-innovacion', completedAt: '2026-01-30', grade: 84 },
    ],
  },
  {
    id: 'tc-4',
    username: 'valentina-cruz-data',
    name: 'Valentina Cruz',
    avatar: 'https://i.pravatar.cc/150?u=valentina-cruz',
    title: 'Data Scientist',
    bio: 'Especialista en machine learning y análisis estadístico. Experiencia en proyectos de salud y finanzas.',
    location: 'Guatemala, GT',
    skills: ['Python', 'TensorFlow', 'SQL', 'Tableau', 'R'],
    availability: 'available',
    completedCourses: [
      { courseSlug: 'machine-learning-aplicado-salud', courseTitle: 'Machine Learning Aplicado en Salud', orgName: 'Salud Digital', orgSlug: 'salud-digital', completedAt: '2026-02-10', grade: 91 },
      { courseSlug: 'python-analisis-datos', courseTitle: 'Python para Análisis de Datos', orgName: 'Universidad de la Innovación', orgSlug: 'universidad-innovacion', completedAt: '2026-03-15', grade: 96 },
    ],
  },
  {
    id: 'tc-5',
    username: 'andres-torres-fullstack',
    name: 'Andrés Torres',
    avatar: 'https://i.pravatar.cc/150?u=andres-torres',
    title: 'Desarrollador Full Stack',
    bio: 'Desarrollador versátil con experiencia en React, Node.js y arquitecturas cloud. Busca proyectos desafiantes.',
    location: 'Guatemala, GT',
    skills: ['React', 'Node.js', 'TypeScript', 'AWS', 'GraphQL'],
    availability: 'open',
    completedCourses: [
      { courseSlug: 'introduccion-arquitectura-microservicios', courseTitle: 'Introducción a la Arquitectura de Microservicios', orgName: 'TechCorp Latam', orgSlug: 'techcorp-latam', completedAt: '2026-02-05', grade: 83 },
      { courseSlug: 'growth-hacking-startups', courseTitle: 'Growth Hacking para Startups', orgName: 'StartupHub Academy', orgSlug: 'startup-hub', completedAt: '2026-03-20', grade: 76 },
    ],
  },
  {
    id: 'tc-6',
    username: 'camila-vasquez-finance',
    name: 'Camila Vásquez',
    avatar: 'https://i.pravatar.cc/150?u=camila-vasquez',
    title: 'Analista Financiera',
    bio: 'Especialista en análisis financiero y gestión de inversiones. MBA con énfasis en finanzas corporativas.',
    location: 'Ciudad de Guatemala, GT',
    skills: ['Excel Avanzado', 'Power BI', 'Análisis de Riesgo', 'Modelado Financiero'],
    availability: 'not_available',
    completedCourses: [
      { courseSlug: 'finanzas-para-no-financieros', courseTitle: 'Finanzas para No Financieros', orgName: 'FinanzasPlus', orgSlug: 'finanzas-plus', completedAt: '2025-11-30', grade: 94 },
      { courseSlug: 'fundamentos-inversion', courseTitle: 'Fundamentos de Inversión', orgName: 'FinanzasPlus', orgSlug: 'finanzas-plus', completedAt: '2025-12-15', grade: 89 },
    ],
  },
  {
    id: 'tc-7',
    username: 'roberto-jimenez-marketing',
    name: 'Roberto Jiménez',
    avatar: 'https://i.pravatar.cc/150?u=roberto-jimenez',
    title: 'Growth Marketer',
    bio: 'Especialista en adquisición de usuarios y optimización de embudos. Experiencia en SaaS B2B y e-commerce.',
    location: 'Quetzaltenango, GT',
    skills: ['Google Analytics', 'Meta Ads', 'Email Marketing', 'SEO', 'A/B Testing'],
    availability: 'open',
    completedCourses: [
      { courseSlug: 'growth-hacking-startups', courseTitle: 'Growth Hacking para Startups', orgName: 'StartupHub Academy', orgSlug: 'startup-hub', completedAt: '2026-01-25', grade: 88 },
      { courseSlug: 'estrategia-liderazgo-digital', courseTitle: 'Estrategia y Liderazgo Digital', orgName: 'StartupHub Academy', orgSlug: 'startup-hub', completedAt: '2026-02-28', grade: 81 },
    ],
  },
  {
    id: 'tc-8',
    username: 'isabella-ramos-health',
    name: 'Isabella Ramos',
    avatar: 'https://i.pravatar.cc/150?u=isabella-ramos',
    title: 'Investigadora en Salud Digital',
    bio: 'Médica con posgrado en informática médica. Trabajo en la intersección de tecnología y salud.',
    location: 'Guatemala, GT',
    skills: ['HL7 FHIR', 'Python', 'Epidemiología', 'R', 'Telemedicina'],
    availability: 'available',
    completedCourses: [
      { courseSlug: 'machine-learning-aplicado-salud', courseTitle: 'Machine Learning Aplicado en Salud', orgName: 'Salud Digital', orgSlug: 'salud-digital', completedAt: '2026-03-01', grade: 97 },
    ],
  },
  {
    id: 'tc-9',
    username: 'felipe-morales-devops',
    name: 'Felipe Morales',
    avatar: 'https://i.pravatar.cc/150?u=felipe-morales',
    title: 'DevOps Engineer',
    bio: 'Especialista en CI/CD, infraestructura como código y orquestación de contenedores.',
    location: 'Guatemala, GT',
    skills: ['Kubernetes', 'Terraform', 'CI/CD', 'AWS', 'Monitoring'],
    availability: 'open',
    completedCourses: [
      { courseSlug: 'introduccion-arquitectura-microservicios', courseTitle: 'Introducción a la Arquitectura de Microservicios', orgName: 'TechCorp Latam', orgSlug: 'techcorp-latam', completedAt: '2026-01-20', grade: 91 },
      { courseSlug: 'onboarding-tecnico-techcorp', courseTitle: 'Onboarding Técnico: Stack de TechCorp', orgName: 'TechCorp Latam', orgSlug: 'techcorp-latam', completedAt: '2026-02-15', grade: 85 },
    ],
  },
  {
    id: 'tc-10',
    username: 'maria-garcia-frontend',
    name: 'María García',
    avatar: 'https://i.pravatar.cc/150?u=maria-garcia',
    title: 'Desarrolladora Frontend',
    bio: 'Desarrolladora con pasión por el aprendizaje continuo y las interfaces de usuario accesibles.',
    location: 'Guatemala, GT',
    skills: ['React', 'TypeScript', 'CSS', 'Figma', 'Testing'],
    availability: 'open',
    completedCourses: [
      { courseSlug: 'diseno-experiencias-digitales', courseTitle: 'Diseño de Experiencias Digitales', orgName: 'Universidad de la Innovación', orgSlug: 'universidad-innovacion', completedAt: '2026-02-05', grade: 88 },
    ],
  },
]

export const savedCandidatesMock: SavedCandidate[] = [
  { id: 'sc-1', candidate: talentCandidates[0], savedAt: '2026-05-15', notes: 'Excelente perfil para el equipo de arquitectura', status: 'to_contact' },
  { id: 'sc-2', candidate: talentCandidates[8], savedAt: '2026-05-14', notes: 'DevOps con experiencia en nuestro stack', status: 'in_process' },
  { id: 'sc-3', candidate: talentCandidates[2], savedAt: '2026-05-13', notes: '', status: 'to_contact' },
  { id: 'sc-4', candidate: talentCandidates[4], savedAt: '2026-05-12', notes: 'Buen candidato pero salario esperado alto', status: 'discarded' },
  { id: 'sc-5', candidate: talentCandidates[3], savedAt: '2026-05-10', notes: 'Data scientist para nuevo proyecto IA', status: 'in_process' },
]

export const savedSearchesMock: SavedSearch[] = [
  {
    id: 'ss-1',
    name: 'Desarrolladores de Microservicios',
    filters: { courseSlug: 'introduccion-arquitectura-microservicios', minGrade: 80, completedAfter: '', availability: 'all' },
    resultCount: 4,
    lastRunAt: '2026-05-18',
  },
  {
    id: 'ss-2',
    name: 'Data Scientists con Python',
    filters: { courseSlug: 'python-analisis-datos', minGrade: 70, completedAfter: '2026-01-01', availability: 'available' },
    resultCount: 2,
    lastRunAt: '2026-05-17',
  },
  {
    id: 'ss-3',
    name: 'Talento disponible (todos los cursos)',
    filters: { courseSlug: '', minGrade: 75, completedAfter: '', availability: 'available' },
    resultCount: 5,
    lastRunAt: '2026-05-16',
  },
]

export function filterCandidates(filters: TalentFilters): TalentCandidate[] {
  return talentCandidates.filter(candidate => {
    if (filters.availability !== 'all' && candidate.availability !== filters.availability) {
      return false
    }
    if (filters.courseSlug) {
      const matchingCourse = candidate.completedCourses.find(
        c => c.courseSlug === filters.courseSlug && c.grade >= filters.minGrade
      )
      if (!matchingCourse) return false
    } else {
      const hasMinGrade = candidate.completedCourses.some(c => c.grade >= filters.minGrade)
      if (!hasMinGrade) return false
    }
    if (filters.completedAfter) {
      const hasRecentCompletion = candidate.completedCourses.some(
        c => c.completedAt >= filters.completedAfter
      )
      if (!hasRecentCompletion) return false
    }
    return true
  })
}

export function getCandidateByUsername(username: string): TalentCandidate | undefined {
  return talentCandidates.find(c => c.username === username)
}