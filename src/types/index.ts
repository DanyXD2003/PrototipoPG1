export interface Organization {
  id: string
  slug: string
  name: string
  logo: string
  industry: string
  description: string
  website: string
  courseCount: number
  studentCount: number
  rating: number
  verified: boolean
}

export interface Instructor {
  id: string
  slug: string
  name: string
  avatar: string
  title: string
  bio: string
  expertise: string[]
  courseCount: number
  studentCount: number
  rating: number
}

export interface CourseBlock {
  id: string
  title: string
  unitCount: number
  durationDays: number
}

export type CourseCategory =
  | 'Tecnología'
  | 'Negocios'
  | 'Diseño'
  | 'Marketing'
  | 'Finanzas'
  | 'Salud'
  | 'Educación'
  | 'Desarrollo Personal'

export interface Course {
  id: string
  slug: string
  title: string
  shortDescription: string
  longDescription: string
  coverImage: string
  category: CourseCategory
  level: 'Principiante' | 'Intermedio' | 'Avanzado'
  price: number
  currency: string
  duration: string
  rating: number
  reviewCount: number
  enrolledCount: number
  organization: Organization
  instructor: Instructor
  blocks: CourseBlock[]
  requirements: string[]
  targetAudience: string[]
  whatYouLearn: string[]
  createdAt: string
  featured: boolean
}

export interface Testimonial {
  id: string
  name: string
  role: string
  company: string
  avatar: string
  quote: string
  rating: number
}

export interface FilterState {
  categories: CourseCategory[]
  levels: string[]
  price: 'all' | 'free' | 'paid'
  duration: string[]
  organizations: string[]
}

export type UserRole = 'student' | 'organization' | 'instructor'

export interface AuthUser {
  id: string
  name: string
  email: string
  role: UserRole
  avatar?: string
  bio?: string
  orgSlug?: string
  instructorSlug?: string
}

export type BlockStatus =
  | 'not_started'
  | 'active'
  | 'completed'
  | 'failed'
  | 'expired'
  | 'locked'

export interface BlockProgress {
  blockId: string
  status: BlockStatus
  grade?: number
  startedAt?: string
  expiresAt?: string
  completedAt?: string
  unitsCompleted: number
}

export interface Enrollment {
  id: string
  userId: string
  course: Course
  enrolledAt: string
  blocks: BlockProgress[]
  overallProgress: number
  completed: boolean
  completedAt?: string
  finalGrade?: number
}

export interface ExamQuestion {
  id: string
  question: string
  options: string[]
  correctIndex: number
}

export type CourseStatus = 'draft' | 'published' | 'archived'

export interface CreatorCourseData {
  courseId: string
  slug: string
  status: CourseStatus
  publishedAt?: string
  totalEnrolled: number
  totalCompleted: number
  completionRate: number
}

export interface CreatorStudent {
  id: string
  name: string
  avatar: string
  email: string
  enrolledAt: string
  currentBlockTitle: string
  currentBlockId: string
  overallProgress: number
  lastAccessAt: string
  status: 'active' | 'inactive' | 'completed'
}

export interface CreatorCompleter {
  id: string
  name: string
  avatar: string
  enrolledAt: string
  completedAt: string
  finalGrade: number
  timeInvestedDays: number
}

export interface AnalyticsWeek {
  label: string
  enrolled: number
}

export interface BlockDropoffData {
  blockTitle: string
  reachedPercent: number
}

export type CandidateAvailability = 'available' | 'open' | 'not_available'

export interface CompletedCourseCredential {
  courseSlug: string
  courseTitle: string
  orgName: string
  orgSlug: string
  completedAt: string
  grade: number
}

export interface TalentCandidate {
  id: string
  username: string
  name: string
  avatar: string
  title: string
  bio: string
  location: string
  skills: string[]
  availability: CandidateAvailability
  completedCourses: CompletedCourseCredential[]
  linkedinUrl?: string
}

export interface TalentFilters {
  courseSlug: string
  minGrade: number
  completedAfter: string
  availability: 'all' | 'available' | 'open'
}

export interface SavedCandidate {
  id: string
  candidate: TalentCandidate
  savedAt: string
  notes: string
  status: 'to_contact' | 'in_process' | 'discarded'
}

export interface SavedSearch {
  id: string
  name: string
  filters: TalentFilters
  resultCount: number
  lastRunAt: string
}