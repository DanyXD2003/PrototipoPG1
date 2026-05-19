# Nexora — Plan de Implementación: Fase 5 — Conexión Laboral

> **Agente implementador:** leer `CLAUDE.md` y `docs/design.md` antes de empezar.
> Este documento es autocontenido — contiene todo lo necesario para implementar la Fase 5 sin preguntar.

---

## Objetivo de la fase

Construir el diferenciador estratégico de Nexora: las herramientas que permiten a las organizaciones buscar y contratar talento filtrando por cursos completados. Incluye el buscador de talento, el perfil del candidato desde perspectiva del reclutador, el pipeline de candidatos guardados, las búsquedas guardadas y el perfil público del estudiante.

**Resultado esperado:** 5 pantallas navegables. Las rutas `/talent/*` son exclusivas para el rol `organization`. El perfil público `/perfil/:username` es accesible para todos.

---

## Orden de implementación

```
Paso 1 → Agregar nuevos tipos en src/types/index.ts
Paso 2 → Crear mock data: src/data/talentData.ts
Paso 3 → Crear TalentLayout
Paso 4 → Crear TalentRoute (control de acceso para org)
Paso 5 → Crear componentes reutilizables: TalentCard, CredentialBadge
Paso 6 → Actualizar CreatorLayout sidebar con link a talento
Paso 7 → Actualizar router con rutas de Fase 5
Paso 8 → Implementar pantallas: 5.1 → 5.2 → 5.3 → 5.4 → 5.5
```

---

## Paso 1 — Nuevos tipos en `src/types/index.ts`

Agregar al final del archivo:

```ts
export type CandidateAvailability = 'available' | 'open' | 'not_available'

export interface CompletedCourseCredential {
  courseSlug: string
  courseTitle: string
  orgName: string
  orgSlug: string
  completedAt: string        // ISO date
  grade: number              // 0-100
}

export interface TalentCandidate {
  id: string
  username: string           // URL slug: "carlos-mendoza-dev"
  name: string
  avatar: string
  title: string              // "Desarrollador Backend Senior"
  bio: string
  location: string           // "Guatemala, GT"
  skills: string[]           // ["Node.js", "Docker", "AWS"]
  availability: CandidateAvailability
  completedCourses: CompletedCourseCredential[]
  linkedinUrl?: string
}

export interface TalentFilters {
  courseSlug: string         // '' = todos los cursos
  minGrade: number           // 0-100
  completedAfter: string     // '' = cualquier fecha, o 'YYYY-MM-DD'
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
```

---

## Paso 2 — Mock data: `src/data/talentData.ts`

```ts
import type { TalentCandidate, SavedCandidate, SavedSearch } from '../types'

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

// Pre-guardados para la org demo (TechCorp Latam)
export const savedCandidatesMock: SavedCandidate[] = [
  { id: 'sc-1', candidate: talentCandidates[0], savedAt: '2026-05-15', notes: 'Excelente perfil para el equipo de arquitectura', status: 'to_contact' },
  { id: 'sc-2', candidate: talentCandidates[8], savedAt: '2026-05-14', notes: 'DevOps con experiencia en nuestro stack', status: 'in_process' },
  { id: 'sc-3', candidate: talentCandidates[2], savedAt: '2026-05-13', notes: '', status: 'to_contact' },
  { id: 'sc-4', candidate: talentCandidates[4], savedAt: '2026-05-12', notes: 'Buen candidato pero salario esperado alto', status: 'discarded' },
  { id: 'sc-5', candidate: talentCandidates[3], savedAt: '2026-05-10', notes: 'Data scientist para nuevo proyecto IA', status: 'in_process' },
]

// Búsquedas guardadas para la org demo
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

// Helper: filtrar candidatos según TalentFilters
export function filterCandidates(filters: import('../types').TalentFilters): TalentCandidate[] {
  return talentCandidates.filter(candidate => {
    // Filtro de disponibilidad
    if (filters.availability !== 'all' && candidate.availability !== filters.availability) {
      return false
    }
    // Si hay filtro de curso específico
    if (filters.courseSlug) {
      const matchingCourse = candidate.completedCourses.find(
        c => c.courseSlug === filters.courseSlug && c.grade >= filters.minGrade
      )
      if (!matchingCourse) return false
    } else {
      // Sin filtro de curso: al menos un curso con nota >= minGrade
      const hasMinGrade = candidate.completedCourses.some(c => c.grade >= filters.minGrade)
      if (!hasMinGrade) return false
    }
    // Filtro de fecha de completación
    if (filters.completedAfter) {
      const hasRecentCompletion = candidate.completedCourses.some(
        c => c.completedAt >= filters.completedAfter
      )
      if (!hasRecentCompletion) return false
    }
    return true
  })
}

// Helper: buscar candidato por username
export function getCandidateByUsername(username: string): TalentCandidate | undefined {
  return talentCandidates.find(c => c.username === username)
}
```

---

## Paso 3 — TalentLayout: `src/components/layout/TalentLayout.tsx`

Sigue el mismo patrón de `CreatorLayout` y `StudentLayout`: renderiza su propio `<Navbar />`, sidebar izquierdo, y área de contenido. **No se anida dentro de `PublicLayout`.**

```
┌──────────────────────────────────────────────────────────────┐
│  [Navbar flotante]                                           │
├─────────────────┬────────────────────────────────────────────┤
│                 │                                            │
│  SIDEBAR        │  CONTENIDO                                 │
│  (256px)        │                                            │
│                 │                                            │
│  Reclutamiento  │                                            │
│                 │                                            │
│  [🔍 Buscar     │                                            │
│    talento]     │                                            │
│  [♥ Candidatos  │                                            │
│    guardados]   │                                            │
│  [⭐ Búsquedas  │                                            │
│    guardadas]   │                                            │
│                 │                                            │
│  ───────────    │                                            │
│  [← Panel       │                                            │
│    Creador]     │                                            │
└─────────────────┴────────────────────────────────────────────┘
```

**Detalles:**
- Estructura idéntica a `CreatorLayout` y `StudentLayout`
- Sidebar links con íconos:
  - `Search` → `/talent/buscar` → "Buscar talento"
  - `Bookmark` → `/talent/guardados` → "Candidatos guardados" + badge con count si hay guardados
  - `Star` → `/talent/mis-busquedas` → "Búsquedas guardadas"
- Link inferior: `ArrowLeft` → `/creator/dashboard` → "Panel Creador" (para volver al panel de creación)
- `isActive` basado en `location.pathname.startsWith(to)`
- Redirige a `/login` si no logueado, a `/` si `user.role !== 'organization'`
- `children` renderizado en `<main className="flex-1 overflow-y-auto px-6 py-8">`

---

## Paso 4 — TalentRoute: `src/components/auth/TalentRoute.tsx`

```tsx
import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/auth'

export default function TalentRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoggedIn } = useAuth()
  if (!isLoggedIn) return <Navigate to="/login" replace />
  if (user?.role !== 'organization') return <Navigate to="/" replace />
  return <>{children}</>
}
```

> Nota: Solo el rol `organization` puede acceder. Si en el futuro se quiere dar acceso a instructores, cambiar la condición a `user?.role === 'student'`.

---

## Paso 5 — Componentes reutilizables

### `src/components/talent/TalentCard.tsx`

Props: `candidate: TalentCandidate`, `isSaved: boolean`, `onToggleSave: (id: string) => void`, `highlightCourseSlug?: string`

```
┌───────────────────────────────────────────────────────────┐
│ [avatar 48px]  Carlos Mendoza          [♥ corazón toggle] │
│                Arquitecto de Software Senior               │
│                Guatemala · 🟢 Disponible (open)            │
│                                                           │
│ Cursos completados:                                       │
│  ┌─────────────────────────────────────────────────────┐  │
│  │ [org logo 20px] Intro Microservicios · 88 ✓         │  │ ← resaltado si highlightCourseSlug coincide
│  │ [org logo 20px] Python para Datos · 92 ✓            │  │
│  └─────────────────────────────────────────────────────┘  │
│                                                           │
│ [Microservicios] [Node.js] [AWS]     [Ver perfil →]       │
└───────────────────────────────────────────────────────────┘
```

**Detalles:**
- Fondo: `bg-white border border-[#E8E0D0] rounded-2xl p-5`
- Hover: `hover:shadow-md hover:border-[#2D4A3E]/30 transition-all`
- **Botón guardar:** ícono `Heart` de Lucide. Si `isSaved`: `fill-[#C9A84C] text-[#C9A84C]`. Si no: `text-[#5C6355] hover:text-[#C9A84C]`. Transición `duration-200`.
- **Indicador de disponibilidad:**
  - `available` → punto `bg-green-500` + "Disponible"
  - `open` → punto `bg-blue-500` + "Abierto a oportunidades"
  - `not_available` → punto `bg-gray-400` + "No disponible"
- **Cursos completados:** máximo 2 visibles, con logo org (24px), título truncado (max 35 chars), nota con `<GradeBadge>`. Si `highlightCourseSlug` coincide con un curso, ese curso se muestra primero y con fondo `bg-[#F2EDE1]`.
- **Skills:** pills con fondo `bg-[#F2EDE1] text-[#5C6355]`, máximo 3 visibles + "+N más" si hay más
- **"Ver perfil →":** link a `/perfil/:username`, texto verde, `cursor-pointer`

### `src/components/talent/CredentialBadge.tsx`

Props: `credential: CompletedCourseCredential`, `size?: 'sm' | 'md'`

```
┌───────────────────────────────────────────────────────┐
│ [GradBadge]  Intro a Microservicios                   │
│              TechCorp Latam · ene 2026                │
└───────────────────────────────────────────────────────┘
```

- Fondo: `bg-[#F2EDE1] border border-[#E8E0D0] rounded-xl`
- `size="sm"`: padding reducido, texto pequeño
- `size="md"`: padding estándar
- Usa `<GradeBadge>` del componente existente en `src/components/learning/GradeBadge.tsx`
- Fecha formateada como "ene 2026" (mes abreviado + año)

---

## Paso 6 — Actualizar CreatorLayout

En `src/components/layout/CreatorLayout.tsx`, agregar un link al módulo de reclutamiento en el sidebar (solo visible si `user.role === 'organization'`):

```tsx
// Agregar después del separador del botón "Crear curso",
// solo si user?.role === 'organization':
{user?.role === 'organization' && (
  <>
    <hr className="my-4 border-[#E8E0D0]" />
    <Link
      to="/talent/buscar"
      className="flex items-center gap-2 text-sm text-[#5C6355] hover:text-[#2D4A3E] transition-colors cursor-pointer"
    >
      <Search className="w-4 h-4" />
      Buscar talento
    </Link>
  </>
)}
```

Importar `Search` de lucide-react si no está ya importado.

---

## Paso 7 — Actualizar router: `src/router/index.tsx`

Importar y agregar rutas. Las rutas de talento van **antes** de la ruta `*` (404).

```tsx
// Imports nuevos:
import TalentLayout from '../components/layout/TalentLayout'
import TalentRoute from '../components/auth/TalentRoute'
import TalentSearchPage from '../pages/talent/TalentSearchPage'
import CandidateProfileRecruiterPage from '../pages/talent/CandidateProfileRecruiterPage'
import SavedCandidatesPage from '../pages/talent/SavedCandidatesPage'
import SavedSearchesPage from '../pages/talent/SavedSearchesPage'
import StudentPublicProfilePage from '../pages/public/StudentPublicProfilePage'

// Rutas talent — TalentLayout (solo org)
<Route path="/talent/buscar" element={<TalentRoute><TalentLayout><TalentSearchPage /></TalentLayout></TalentRoute>} />
<Route path="/talent/candidato/:username" element={<TalentRoute><TalentLayout><CandidateProfileRecruiterPage /></TalentLayout></TalentRoute>} />
<Route path="/talent/guardados" element={<TalentRoute><TalentLayout><SavedCandidatesPage /></TalentLayout></TalentRoute>} />
<Route path="/talent/mis-busquedas" element={<TalentRoute><TalentLayout><SavedSearchesPage /></TalentLayout></TalentRoute>} />

// Perfil público del estudiante — dentro del grupo PublicLayout (accesible a todos)
// Agregar dentro de <Route element={<PublicLayout />}>:
<Route path="/perfil/:username" element={<StudentPublicProfilePage />} />
```

> ⚠️ `/perfil/:username` va dentro del bloque `<Route element={<PublicLayout />}>`. La ruta `/perfil/editar` ya existe ahí — no hay conflicto porque "editar" es más específico que `:username`. React Router v6 prioriza segmentos estáticos sobre dinámicos.

---

## Paso 8 — Pantallas

Archivos de talento en `src/pages/talent/`. El perfil público en `src/pages/public/`.

---

### 5.1 Buscador de Talento — `/talent/buscar`

**Archivo:** `src/pages/talent/TalentSearchPage.tsx`

```
Buscar talento
Encuentra candidatos que completaron cursos específicos

┌──────────────────┬──────────────────────────────────────────────┐
│  FILTROS         │  10 candidatos encontrados      [Guardar ♥] │
│  (256px)         │                                              │
│  Curso completado│  ┌────────────────┐  ┌────────────────┐     │
│  [▾ Todos los    │  │  TalentCard    │  │  TalentCard    │     │
│    cursos    ]   │  └────────────────┘  └────────────────┘     │
│                  │  ┌────────────────┐  ┌────────────────┐     │
│  Nota mínima     │  │  TalentCard    │  │  TalentCard    │     │
│  70 / 100        │  └────────────────┘  └────────────────┘     │
│  ─────────────   │  ...                                         │
│  [slider 0-100]  │                                              │
│                  │  (estado vacío si no hay resultados)         │
│  Completado desde│                                              │
│  [▾ Cualquier    │                                              │
│    fecha     ]   │                                              │
│                  │                                              │
│  Disponibilidad  │                                              │
│  ● Todos         │                                              │
│  ○ Disponibles   │                                              │
│  ○ Abiertos      │                                              │
│                  │                                              │
│  [Limpiar filtros│                                              │
│   ]              │                                              │
└──────────────────┴──────────────────────────────────────────────┘
```

**Estado local:**
```ts
const [filters, setFilters] = useState<TalentFilters>({
  courseSlug: '',
  minGrade: 70,
  completedAfter: '',
  availability: 'all',
})
const [savedCandidateIds, setSavedCandidateIds] = useState<Set<string>>(new Set(['tc-1']))
const [showSaveSearchModal, setShowSaveSearchModal] = useState(false)
```

**Panel de filtros (izquierda, 256px, `hidden md:block`):**

1. **Curso completado** — `<select>` estilizado con `<option value="">Todos los cursos</option>` + una opción por cada curso de `courses.ts`. Mostrar: `"{titulo corto} · {org}"`. Ancho completo, borde `border-[#E8E0D0] rounded-lg`.

2. **Nota mínima** — Input tipo `range` (slider HTML nativo):
   - `min=0 max=100 step=5`
   - Mostrar valor actual encima: `"{minGrade} / 100"`
   - Estilizar el slider con CSS: `accent-color: #C9A84C`

3. **Completado desde** — `<select>` con opciones:
   - "Cualquier fecha"
   - "Último mes" (calcular fecha = 30 días atrás)
   - "Últimos 3 meses"
   - "Último año"
   - Al seleccionar: setear `completedAfter` con la fecha correspondiente calculada con `new Date()`

4. **Disponibilidad** — Radio buttons:
   - Todos / Disponibles (`available`) / Abiertos a oportunidades (`open`)

5. Botón "Limpiar filtros" (ghost, texto muted) — resetea a valores por defecto

**Área de resultados (derecha):**
- Header: `"{N} candidatos encontrados"` + botón "Guardar búsqueda ♥" (outline verde, lado derecho)
- Grid: `grid-cols-1 lg:grid-cols-2 gap-4`
- Cada resultado: `<TalentCard candidate={c} isSaved={savedCandidateIds.has(c.id)} onToggleSave={toggleSave} highlightCourseSlug={filters.courseSlug} />`
- Filtrar usando `filterCandidates(filters)` (helper del talentData)
- Los filtros se aplican **instantáneamente** al cambiar cualquier valor — sin botón de búsqueda
- **Estado vacío:** ícono `UserX` (Lucide) grande + "No encontramos candidatos con estos filtros" + "Intenta ajustar la nota mínima o el curso" + botón "Limpiar filtros"

**Modal "Guardar búsqueda":**
- Aparece al hacer click en "Guardar búsqueda ♥"
- Campo: nombre de la búsqueda (pre-llenado con algo como "Búsqueda del {fecha}")
- Botones: Cancelar / Guardar (dorado)
- Al guardar: toast "Búsqueda guardada" + cierra modal
- No necesita persistencia real (mockup)

**Mobile:** filtros colapsables — botón "Filtros (N activos)" que abre un drawer

---

### 5.2 Perfil del Candidato (Vista Reclutador) — `/talent/candidato/:username`

**Archivo:** `src/pages/talent/CandidateProfileRecruiterPage.tsx`

```
[← Volver a resultados]

┌──────────────────────────────────────────────────────────────┐
│ [avatar 96px]  Carlos Mendoza                                │
│                Arquitecto de Software Senior                 │
│                Guatemala · 🟢 Abierto a oportunidades         │
│                                                              │
│ [LinkedIn ↗]  carlos@dev.com                                 │
└──────────────────────────────────────────────────────────────┘

Bio
───────────────────────────────────────────────────────────────
Desarrollador con 8 años de experiencia en arquitectura de
sistemas distribuidos y microservicios...

Habilidades
───────────────────────────────────────────────────────────────
[Microservicios] [Node.js] [Docker] [AWS] [Kubernetes]

Credenciales de Nexora
───────────────────────────────────────────────────────────────
┌───────────────────────────────────────────────────────────┐
│ [CredentialBadge size="md"]                               │
│ Intro a la Arquitectura de Microservicios                 │
│ TechCorp Latam · Completado: 10 ene 2026 · 88/100 ✓      │
│ [Ver curso público →]                                     │
├───────────────────────────────────────────────────────────┤
│ [CredentialBadge size="md"]                               │
│ Python para Análisis de Datos                             │
│ Univ. de la Innovación · 20 feb 2026 · 92/100 ✓           │
│ [Ver curso público →]                                     │
└───────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│  [♥ Guardar candidato]    [✉ Contactar (mockup)]         │
│  (outline verde)           (botón dorado)                │
└──────────────────────────────────────────────────────────┘
```

**Detalles:**
- Leer `:username` con `useParams()`, buscar con `getCandidateByUsername(username)`
- Si no existe → redirigir a `/talent/buscar`
- Link "← Volver a resultados" → `navigate(-1)` (historial del navegador)
- Fondo del header: `bg-white border border-[#E8E0D0] rounded-2xl p-6`
- Disponibilidad con indicador de color (mismo que `TalentCard`)
- LinkedIn link: si `candidate.linkedinUrl` existe → mostrar `Linkedin` icon (Lucide) + "LinkedIn" como link externo
- Email con ícono `Mail` (Lucide) + `mailto:` link (mockup — simplemente `href="#"`)
- Skills: pills iguales que en `TalentCard`
- Cada credencial con `<CredentialBadge size="md" />` + link "Ver curso público →" → `/cursos/:courseSlug`
- Botón "Guardar candidato": estado local `isSaved`. Si guardado → `Heart fill`, texto "Guardado", outline dorado. Si no → `Heart`, texto "Guardar candidato", outline verde.
- Botón "Contactar": dorado, al hacer click → toast `"Funcionalidad de contacto próximamente disponible"`

---

### 5.3 Candidatos Guardados — `/talent/guardados`

**Archivo:** `src/pages/talent/SavedCandidatesPage.tsx`

```
Candidatos guardados (5)

[Todos (5)] [Por contactar (2)] [En proceso (2)] [Descartados (1)]

┌──────────────────────────────────────────────────────────────────┐
│ Candidato         │ Guardado   │ Cursos       │ Estado       │ ⋮ │
├──────────────────────────────────────────────────────────────────┤
│[av] Carlos M.     │ 15 may 26  │ 2 completados│ Por contactar│ ⋮ │
│     Arq. Software │            │              │              │   │
├──────────────────────────────────────────────────────────────────┤
│[av] Felipe M.     │ 14 may 26  │ 2 completados│ En proceso   │ ⋮ │
│     DevOps Eng.   │            │              │              │   │
├──────────────────────────────────────────────────────────────────┤
│[av] Diego L.      │ 13 may 26  │ 2 completados│ Por contactar│ ⋮ │
└──────────────────────────────────────────────────────────────────┘
```

**Estado local:**
```ts
const [candidates, setCandidates] = useState<SavedCandidate[]>(savedCandidatesMock)
const [statusFilter, setStatusFilter] = useState<'all' | SavedCandidate['status']>('all')
const [openMenuId, setOpenMenuId] = useState<string | null>(null)
```

**Detalles:**
- Tabs de filtro por status:
  - "Todos (N)" / "Por contactar (N)" / "En proceso (N)" / "Descartados (N)"
  - Calcular counts en tiempo real
- Tabla con `overflow-x-auto`:
  - Avatar (32px) + nombre + título
  - Fecha guardado formateada
  - Número de cursos completados del candidato
  - Badge de estado (pill con colores):
    - `to_contact` → azul claro "Por contactar"
    - `in_process` → amarillo "En proceso"
    - `discarded` → gris "Descartado"
  - Menú `⋮` (`MoreVertical`): "Ver perfil", "Cambiar estado →" (submenu con 3 opciones), "Eliminar de guardados"
- Al hacer click en nombre → navegar a `/talent/candidato/:username`
- Si lista vacía: ícono `Bookmark` + "Aún no has guardado candidatos" + botón "Buscar talento"

---

### 5.4 Búsquedas Guardadas — `/talent/mis-busquedas`

**Archivo:** `src/pages/talent/SavedSearchesPage.tsx`

```
Búsquedas guardadas (3)                           [+ Nueva búsqueda]

┌──────────────────────────────────────────────────────────────────┐
│ Desarrolladores de Microservicios            4 resultados        │
│ Curso: Intro a Microservicios · Nota mín: 80 · Disponibilidad: Todos │
│ Última ejecución: 18 may 2026                                   │
│ [Re-ejecutar →]  [🗑 Eliminar]                                  │
├──────────────────────────────────────────────────────────────────┤
│ Data Scientists con Python                   2 resultados        │
│ Curso: Python para Datos · Nota mín: 70 · Completado desde: ene 2026 │
│ Última ejecución: 17 may 2026                                   │
│ [Re-ejecutar →]  [🗑 Eliminar]                                  │
├──────────────────────────────────────────────────────────────────┤
│ Talento disponible (todos los cursos)        5 resultados        │
│ Todos los cursos · Nota mín: 75 · Solo disponibles              │
│ Última ejecución: 16 may 2026                                   │
│ [Re-ejecutar →]  [🗑 Eliminar]                                  │
└──────────────────────────────────────────────────────────────────┘
```

**Estado local:**
```ts
const [searches, setSearches] = useState<SavedSearch[]>(savedSearchesMock)
```

**Detalles:**
- Botón "Nueva búsqueda" (dorado) → navega a `/talent/buscar`
- Cada búsqueda en tarjeta: `bg-white border border-[#E8E0D0] rounded-xl p-4`
- Nombre en bold + count de resultados (muted, a la derecha)
- Descripción de filtros en formato texto legible:
  - `Curso: {courseTitle}` o `Todos los cursos`
  - `Nota mínima: {minGrade}`
  - `Completado desde: {fecha}` (si aplica)
  - `Solo {disponibles/abiertos}` (si aplica)
- Fecha última ejecución en muted pequeño
- Botón "Re-ejecutar →" (outline verde): navega a `/talent/buscar` pasando los filtros via `state` en navigate:
  ```ts
  navigate('/talent/buscar', { state: { filters: search.filters } })
  ```
  > La página `TalentSearchPage` debe leer `location.state?.filters` al inicializar su estado.
- Botón `Trash2` (Lucide) para eliminar: pide confirmación con un pequeño modal inline (no `confirm()` nativo). Al confirmar, elimina del array local.
- Si lista vacía: ícono `Search` + "No tienes búsquedas guardadas" + botón "Buscar talento"

---

### 5.5 Perfil Público del Estudiante — `/perfil/:username`

**Archivo:** `src/pages/public/StudentPublicProfilePage.tsx`
**Layout:** `PublicLayout` (accesible a todos, con Navbar y Footer)

```
[← Volver]

┌──────────────────────────────────────────────────────────────┐
│ [avatar 100px]  María García                                 │
│                 Desarrolladora Frontend                      │
│                 Guatemala · 🟢 Abierta a oportunidades        │
│                                                              │
│ "Desarrolladora con pasión por el aprendizaje continuo..."   │
│                                                              │
│ Habilidades: [React] [TypeScript] [CSS] [Figma] [Testing]   │
└──────────────────────────────────────────────────────────────┘

Credenciales de Nexora
───────────────────────────────────────────────────────────────
┌────────────────────────────────────────────────────────────┐
│ ✓  Diseño de Experiencias Digitales                        │
│    Universidad de la Innovación · feb 2026 · 88/100 ✓      │
└────────────────────────────────────────────────────────────┘

─────────────────────────────────────────────────────────────
🔒 Esta información es pública. Solo se muestran los cursos
   que el perfil ha decidido hacer visibles.
─────────────────────────────────────────────────────────────

¿Eres reclutador?
Si quieres contactar a este candidato, crea una cuenta
de organización en Nexora.  [Registrar mi empresa →]
```

**Detalles:**
- Leer `:username` con `useParams()`, buscar con `getCandidateByUsername(username)` en `talentData.ts`
- Si no existe: redirigir a `/404`
- `navigate(-1)` para el botón "← Volver"
- Cabecera del perfil: fondo `bg-white border border-[#E8E0D0] rounded-2xl p-6 mb-8`
- Disponibilidad con indicador de color (mismo que `TalentCard`)
- Credenciales: lista de `<CredentialBadge size="md" />` con icono `CheckCircle` verde a la izquierda
- Nota de privacidad: en `bg-[#F2EDE1] border border-[#E8E0D0] rounded-xl p-4`, con ícono `Lock` (Lucide) en muted
- Sección "¿Eres reclutador?": solo visible si `!isLoggedIn || user?.role !== 'organization'`. Link → `/registro/organizacion`

---

## Actualización: `TalentSearchPage` lee state al inicializar

En `TalentSearchPage.tsx`, al inicializar el estado de filtros, leer `location.state` para soportar la re-ejecución de búsquedas guardadas:

```tsx
import { useLocation } from 'react-router-dom'

const location = useLocation()
const initialFilters: TalentFilters = location.state?.filters ?? {
  courseSlug: '',
  minGrade: 70,
  completedAfter: '',
  availability: 'all',
}

const [filters, setFilters] = useState<TalentFilters>(initialFilters)
```

---

## Checklist de entrega

### Funcionalidad
- [ ] `/talent/*` solo accesible para role `organization`; redirige a `/` para otros roles
- [ ] Los filtros del buscador aplican instantáneamente sin botón de submit
- [ ] Toggle de guardar candidato (corazón) funciona en TalentCard y en perfil del candidato
- [ ] "Re-ejecutar búsqueda" navega a `/talent/buscar` con los filtros pre-aplicados
- [ ] Eliminar búsqueda guardada actualiza la lista sin recargar
- [ ] `/perfil/:username` accesible sin login (PublicLayout, no TalentLayout)
- [ ] `/perfil/:username` redirige a 404 si el username no existe
- [ ] `CandidateProfileRecruiterPage` redirige a `/talent/buscar` si el username no existe
- [ ] "Contactar" en perfil del candidato muestra toast

### UI/UX
- [ ] TalentCard muestra el curso filtrado resaltado (si hay filtro de curso activo)
- [ ] Indicadores de disponibilidad con colores correctos (verde/azul/gris)
- [ ] Slider de nota mínima actualiza el valor visible en tiempo real
- [ ] Estado vacío en búsqueda con ícono y sugerencia
- [ ] Badge count de candidatos guardados en sidebar de TalentLayout
- [ ] Filtros en mobile colapsables

### Diseño
- [ ] Paleta respetada en todos los componentes nuevos
- [ ] No hay emojis como íconos (solo Lucide)
- [ ] `cursor-pointer` en todos los elementos clickeables
- [ ] Tablas con `overflow-x-auto` (SavedCandidatesPage)

### Código
- [ ] Sin errores de TypeScript
- [ ] `filterCandidates` helper usado en TalentSearchPage (no lógica duplicada)
- [ ] `getCandidateByUsername` usado en CandidateProfileRecruiterPage y StudentPublicProfilePage
- [ ] `TalentRoute` y `TalentLayout` no anidados dentro de `PublicLayout`
- [ ] `/perfil/:username` dentro del grupo `PublicLayout` (no de TalentLayout)
- [ ] `/perfil/:username` declarado antes de la ruta `*` (404) en el router
