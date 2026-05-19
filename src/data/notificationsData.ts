import type { AppNotification } from '../types'

const daysAgo = (n: number) =>
  new Date(Date.now() - n * 24 * 60 * 60 * 1000).toISOString()

const hoursAgo = (n: number) =>
  new Date(Date.now() - n * 60 * 60 * 1000).toISOString()

export const notificationsMock: AppNotification[] = [
  {
    id: 'n-1',
    type: 'block_expiring',
    title: '¡Tu bloque vence pronto!',
    message: 'El Bloque 2 de "Intro a Microservicios" vence en menos de 24 horas. ¡Termínalo antes de que se calce!',
    createdAt: hoursAgo(2),
    read: false,
    link: '/aprendizaje/introduccion-arquitectura-microservicios/bloque/b2',
  },
  {
    id: 'n-2',
    type: 'block_active',
    title: 'Nuevo bloque disponible',
    message: 'El Bloque 3 de "Diseño de Experiencias Digitales" ya está abierto. Tienes 14 días para completarlo.',
    createdAt: hoursAgo(18),
    read: false,
    link: '/aprendizaje/diseno-experiencias-digitales/bloque/b3',
  },
  {
    id: 'n-3',
    type: 'block_graded',
    title: 'Examen calificado',
    message: 'Obtuviste 88/100 en el Bloque 1 de "Intro a Microservicios". ¡Aprobado! Ya puedes avanzar al siguiente bloque.',
    createdAt: daysAgo(2),
    read: false,
    link: '/aprendizaje/introduccion-arquitectura-microservicios/bloque/b1/resultados',
  },
  {
    id: 'n-4',
    type: 'block_graded',
    title: 'Examen no aprobado',
    message: 'Obtuviste 52/100 en el Bloque 2 de "Diseño de Experiencias Digitales". La nota mínima es 70. Puedes reintentar el bloque.',
    createdAt: daysAgo(3),
    read: true,
    link: '/aprendizaje/diseno-experiencias-digitales/bloque/b2/reintentar',
  },
  {
    id: 'n-5',
    type: 'talent_match',
    title: 'Nuevo candidato encontrado',
    message: 'Felipe Morales cumple con tu búsqueda "Desarrolladores de Microservicios". Nota obtenida: 91/100.',
    createdAt: daysAgo(4),
    read: true,
    link: '/talent/candidato/felipe-morales-devops',
  },
  {
    id: 'n-6',
    type: 'new_enrollment',
    title: 'Nueva inscripción',
    message: 'Un nuevo estudiante se inscribió a "Intro a la Arquitectura de Microservicios". Ahora tienes 1,241 inscritos.',
    createdAt: daysAgo(5),
    read: true,
    link: '/creator/cursos/introduccion-arquitectura-microservicios/inscritos',
  },
  {
    id: 'n-7',
    type: 'course_completed',
    title: '¡Felicidades! Curso completado',
    message: 'Completaste "Python para Análisis de Datos" con una nota final de 92/100. Ya puedes descargar tu certificado.',
    createdAt: daysAgo(7),
    read: true,
    link: '/mis-certificados',
  },
  {
    id: 'n-8',
    type: 'block_active',
    title: 'Tu curso de Growth Hacking está listo',
    message: 'El Bloque 1 de "Growth Hacking para Startups" ya está disponible. ¡Empieza cuando quieras!',
    createdAt: daysAgo(10),
    read: true,
    link: '/aprendizaje/growth-hacking-startups/bloque/b1',
  },
]

export function getUnreadCount(): number {
  return notificationsMock.filter(n => !n.read).length
}

export function getNotificationMeta(type: AppNotification['type']): { icon: string; color: string } {
  switch (type) {
    case 'block_active':    return { icon: 'PlayCircle', color: 'text-[#2D4A3E] bg-[#F2EDE1]' }
    case 'block_expiring':  return { icon: 'AlertCircle', color: 'text-amber-700 bg-amber-50' }
    case 'block_graded':    return { icon: 'ClipboardList', color: 'text-blue-700 bg-blue-50' }
    case 'course_completed':return { icon: 'Award', color: 'text-[#C9A84C] bg-[#FAF7EF]' }
    case 'talent_match':    return { icon: 'UserCheck', color: 'text-purple-700 bg-purple-50' }
    case 'new_enrollment':  return { icon: 'Users', color: 'text-[#2D4A3E] bg-[#F2EDE1]' }
  }
}