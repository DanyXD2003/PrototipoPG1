import type { Enrollment } from '../types'
import { courses } from './courses'

const courseMS = courses.find(c => c.slug === 'introduccion-arquitectura-microservicios')!
const courseDX = courses.find(c => c.slug === 'diseno-experiencias-digitales')!
const courseGH = courses.find(c => c.slug === 'growth-hacking-startups')!
const coursePY = courses.find(c => c.slug === 'python-analisis-datos')!

const daysFromNow = (n: number) =>
  new Date(Date.now() + n * 24 * 60 * 60 * 1000).toISOString()

const daysAgo = (n: number) =>
  new Date(Date.now() - n * 24 * 60 * 60 * 1000).toISOString()

export const enrollments: Enrollment[] = [
  {
    id: 'enroll-1',
    userId: 'user-1',
    course: courseMS,
    enrolledAt: daysAgo(30),
    overallProgress: 25,
    completed: false,
    blocks: [
      {
        blockId: 'b1',
        status: 'completed',
        grade: 88,
        startedAt: daysAgo(28),
        expiresAt: daysAgo(14),
        completedAt: daysAgo(20),
        unitsCompleted: 4,
      },
      {
        blockId: 'b2',
        status: 'active',
        startedAt: daysAgo(6),
        expiresAt: daysFromNow(8),
        unitsCompleted: 2,
      },
      {
        blockId: 'b3',
        status: 'locked',
        unitsCompleted: 0,
      },
      {
        blockId: 'b4',
        status: 'locked',
        unitsCompleted: 0,
      },
    ],
  },
  {
    id: 'enroll-2',
    userId: 'user-1',
    course: courseDX,
    enrolledAt: daysAgo(45),
    overallProgress: 33,
    completed: false,
    blocks: [
      {
        blockId: 'b1',
        status: 'completed',
        grade: 92,
        startedAt: daysAgo(43),
        expiresAt: daysAgo(29),
        completedAt: daysAgo(35),
        unitsCompleted: 4,
      },
      {
        blockId: 'b2',
        status: 'failed',
        grade: 52,
        startedAt: daysAgo(20),
        expiresAt: daysFromNow(2),
        completedAt: daysAgo(1),
        unitsCompleted: 3,
      },
      {
        blockId: 'b3',
        status: 'locked',
        unitsCompleted: 0,
      },
    ],
  },
  {
    id: 'enroll-3',
    userId: 'user-1',
    course: courseGH,
    enrolledAt: daysAgo(3),
    overallProgress: 0,
    completed: false,
    blocks: [
      {
        blockId: 'b1',
        status: 'not_started',
        unitsCompleted: 0,
      },
      {
        blockId: 'b2',
        status: 'locked',
        unitsCompleted: 0,
      },
      {
        blockId: 'b3',
        status: 'locked',
        unitsCompleted: 0,
      },
    ],
  },
  {
    id: 'enroll-4',
    userId: 'user-1',
    course: coursePY,
    enrolledAt: daysAgo(90),
    overallProgress: 100,
    completed: true,
    blocks: [
      {
        blockId: 'b1',
        status: 'completed',
        grade: 92,
        startedAt: daysAgo(88),
        expiresAt: daysAgo(74),
        completedAt: daysAgo(80),
        unitsCompleted: 4,
      },
      {
        blockId: 'b2',
        status: 'completed',
        grade: 89,
        startedAt: daysAgo(70),
        expiresAt: daysAgo(56),
        completedAt: daysAgo(62),
        unitsCompleted: 4,
      },
      {
        blockId: 'b3',
        status: 'completed',
        grade: 95,
        startedAt: daysAgo(50),
        expiresAt: daysAgo(36),
        completedAt: daysAgo(40),
        unitsCompleted: 3,
      },
    ],
  },
]

export function getUserEnrollments(userId: string): Enrollment[] {
  return enrollments.filter(e => e.userId === userId)
}

export function getEnrollment(userId: string, courseSlug: string): Enrollment | undefined {
  return enrollments.find(e => e.userId === userId && e.course.slug === courseSlug)
}