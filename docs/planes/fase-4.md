# Nexora — Plan de Implementación: Fase 4 — Panel Creador

> **Agente implementador:** leer `CLAUDE.md` y `docs/design.md` antes de empezar.
> Este documento es autocontenido — contiene todo lo necesario para implementar la Fase 4 sin preguntar.

---

## Objetivo de la fase

Construir el panel de control para organizaciones e instructores: dashboard con métricas, gestión de cursos, editor de bloques y unidades, y las vistas de inscritos, completadores y analytics. Es la cara del producto para quienes crean contenido en Nexora.

**Resultado esperado:** 10 pantallas navegables, protegidas para roles `organization` e `instructor`, con datos mock realistas. El flujo de edición de cursos es UI-only — los formularios se ven funcionales pero el guardado solo muestra estados de éxito (sin persistencia real).

---

## Orden de implementación

```
Paso 1 → Agregar nuevos tipos en src/types/index.ts
Paso 2 → Crear mock data: src/data/creatorData.ts
Paso 3 → Crear CreatorLayout
Paso 4 → Crear CreatorRoute (control de acceso)
Paso 5 → Crear componente CourseEditNav (sub-navegación del editor)
Paso 6 → Actualizar router con rutas de Fase 4
Paso 7 → Actualizar redirects post-login para org/instructor → /creator/dashboard
Paso 8 → Implementar pantallas en orden: 4.1 → 4.2 → 4.3 → 4.4 → 4.5 → 4.6 → 4.7 → 4.8 → 4.9 → 4.10
```

---

## Paso 1 — Nuevos tipos en `src/types/index.ts`

Agregar al final del archivo (no borrar nada existente):

```ts
export type CourseStatus = 'draft' | 'published' | 'archived'

export interface CreatorCourseData {
  courseId: string
  slug: string
  status: CourseStatus
  publishedAt?: string
  totalEnrolled: number
  totalCompleted: number
  completionRate: number    // porcentaje 0-100
}

export interface CreatorStudent {
  id: string
  name: string
  avatar: string
  email: string
  enrolledAt: string
  currentBlockTitle: string
  currentBlockId: string
  overallProgress: number   // 0-100
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
  label: string             // "Sem 1", "Sem 2", etc.
  enrolled: number
}

export interface BlockDropoffData {
  blockTitle: string
  reachedPercent: number    // % de inscritos que llegaron a este bloque
}
```

---

## Paso 2 — Mock data: `src/data/creatorData.ts`

```ts
import type { CreatorCourseData, CreatorStudent, CreatorCompleter, AnalyticsWeek, BlockDropoffData } from '../types'
import { courses } from './courses'

// Cursos creados por la org demo (TechCorp Latam, orgSlug: 'techcorp-latam')
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

// Helper: obtener los cursos completos (Course) del creador
export function getCreatorCourses(orgSlug: string) {
  return courses
    .filter(c => c.organization.slug === orgSlug)
    .map(course => {
      const data = creatorCoursesData.find(d => d.slug === course.slug)
      return { course, data: data ?? null }
    })
}

// Helper: obtener curso + datos por slug
export function getCreatorCourse(orgSlug: string, courseSlug: string) {
  const course = courses.find(c => c.slug === courseSlug && c.organization.slug === orgSlug)
  const data = creatorCoursesData.find(d => d.slug === courseSlug) ?? null
  return course ? { course, data } : null
}

// Mock de estudiantes inscritos (compartido entre los dos cursos del demo)
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

// Mock completadores
export const creatorCompleters: CreatorCompleter[] = [
  { id: 'cp-1', name: 'Sofía Martínez', avatar: 'https://i.pravatar.cc/40?u=sofia-martinez', enrolledAt: '2025-11-15', completedAt: '2026-01-10', finalGrade: 91, timeInvestedDays: 56 },
  { id: 'cp-2', name: 'Roberto Jiménez', avatar: 'https://i.pravatar.cc/40?u=roberto-jimenez', enrolledAt: '2025-09-20', completedAt: '2025-12-05', finalGrade: 84, timeInvestedDays: 76 },
  { id: 'cp-3', name: 'Camila Vásquez', avatar: 'https://i.pravatar.cc/40?u=camila-vasquez', enrolledAt: '2025-09-25', completedAt: '2025-12-20', finalGrade: 79, timeInvestedDays: 86 },
  { id: 'cp-4', name: 'Felipe Morales', avatar: 'https://i.pravatar.cc/40?u=felipe-morales', enrolledAt: '2025-10-01', completedAt: '2026-01-15', finalGrade: 95, timeInvestedDays: 106 },
  { id: 'cp-5', name: 'Isabella Ramos', avatar: 'https://i.pravatar.cc/40?u=isabella-ramos', enrolledAt: '2025-10-10', completedAt: '2026-02-01', finalGrade: 88, timeInvestedDays: 114 },
]

// Mock analytics — inscritos por semana (últimas 8 semanas)
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

// Mock analytics — abandono por bloque
export const blockDropoff: BlockDropoffData[] = [
  { blockTitle: 'Bloque 1: Fundamentos', reachedPercent: 100 },
  { blockTitle: 'Bloque 2: Diseño de APIs', reachedPercent: 74 },
  { blockTitle: 'Bloque 3: Comunicación', reachedPercent: 42 },
  { blockTitle: 'Bloque 4: Despliegue', reachedPercent: 18 },
]
```

---

## Paso 3 — CreatorLayout: `src/components/layout/CreatorLayout.tsx`

Layout para el panel del creador: renderiza su propia `<Navbar />` (igual que `StudentLayout`), sidebar izquierdo con navegación del creador, y área de contenido principal. **No usar dentro de `PublicLayout`** — va como ruta independiente.

```
┌──────────────────────────────────────────────────────────────┐
│  [Navbar flotante — igual que siempre]                       │
├─────────────────┬────────────────────────────────────────────┤
│                 │                                            │
│  SIDEBAR        │  CONTENIDO PRINCIPAL                       │
│  (256px)        │  (flex-1)                                  │
│                 │                                            │
│  Panel Creador  │                                            │
│                 │                                            │
│  [Dashboard]    │                                            │
│  [Mis cursos]   │                                            │
│                 │                                            │
│  ───────────    │                                            │
│  [+ Crear       │                                            │
│    curso]       │                                            │
│                 │                                            │
│  ───────────    │                                            │
│  [Ver perfil    │                                            │
│   público ↗]    │                                            │
└─────────────────┴────────────────────────────────────────────┘
```

**Detalles:**
- Estructura idéntica a `StudentLayout`: `<Navbar />` + `pt-20` + flex row (sidebar + main)
- Sidebar: `w-64 shrink-0 border-r border-[#E8E0D0] bg-[#FAF7EF] min-h-screen px-4 py-6 hidden md:block`
- Header del sidebar: "Panel Creador" en `text-xs font-semibold text-[#5C6355] uppercase tracking-wider mb-4`
- Links de navegación con ícono + label, misma lógica de link activo que `StudentLayout`:
  - `LayoutDashboard` → `/creator/dashboard` → "Dashboard"
  - `BookOpen` → `/creator/cursos` → "Mis cursos"
- Botón "Crear curso" debajo de los nav links:
  - Separador `<hr>` + botón con ícono `Plus` → `/creator/cursos/nuevo`
  - Fondo `bg-[#C9A84C] text-[#1A1C14]`, ancho completo, `rounded-lg`, hover `bg-[#B8970A]`
- Link "Ver perfil público":
  - Separador `<hr>` + link con ícono `ExternalLink` → `/org/:orgSlug` (si role es organization) o `/instructor/:slug` (si instructor)
  - Texto `text-[#5C6355]`, pequeño, hover verde
- Redirige a `/login` si no está logueado
- Redirige a `/dashboard` si `user.role === 'student'`
- `children` se renderiza en el `<main>`

---

## Paso 4 — CreatorRoute: `src/components/auth/CreatorRoute.tsx`

```tsx
import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/auth'

export default function CreatorRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoggedIn } = useAuth()
  if (!isLoggedIn) return <Navigate to="/login" replace />
  if (user?.role === 'student') return <Navigate to="/dashboard" replace />
  return <>{children}</>
}
```

> Nota: `CreatorLayout` ya hace estos mismos checks internamente (como `StudentLayout`). Usar `CreatorRoute` como wrapper explícito en el router es redundante pero mantiene consistencia con el patrón del proyecto y hace más legible el router.

---

## Paso 5 — CourseEditNav: `src/components/creator/CourseEditNav.tsx`

Sub-navegación persistente en todas las páginas de edición de un curso específico (`/creator/cursos/:id/*`).

```
← Mis cursos
──────────────────────────────────────────────────────────────
[thumbnail]  Introducción a la Arquitectura de Microservicios
             Publicado  ·  1,240 inscritos
──────────────────────────────────────────────────────────────
[Bloques] [Inscritos] [Completadores] [Analytics]
```

Props: `courseSlug: string`, `activeTab: 'bloques' | 'inscritos' | 'completadores' | 'analiticas'`

**Detalles:**
- Link "← Mis cursos" → `/creator/cursos` (texto pequeño muted, con `ChevronLeft`)
- Card de info del curso: thumbnail (40×40px `rounded-lg`), título, badge de status, count de inscritos
- Tabs de navegación: 4 opciones, el tab activo con subrayado verde `border-b-2 border-[#2D4A3E] text-[#2D4A3E]`
- Rutas de cada tab:
  - Bloques → `/creator/cursos/:id/bloques`
  - Inscritos → `/creator/cursos/:id/inscritos`
  - Completadores → `/creator/cursos/:id/completadores`
  - Analytics → `/creator/cursos/:id/analiticas`
- Mostrar en todas las páginas 4.4 → 4.10 (no en 4.3 que es crear nuevo)
- Fondo: `bg-white border-b border-[#E8E0D0] px-6 py-4`

---

## Paso 6 — Actualizar router: `src/router/index.tsx`

Agregar imports y rutas. **Todas las rutas del creador son independientes (no anidadas en `PublicLayout`).**

```tsx
// Importar:
import CreatorLayout from '../components/layout/CreatorLayout'
import CreatorRoute from '../components/auth/CreatorRoute'
import CreatorDashboardPage from '../pages/creator/CreatorDashboardPage'
import CreatorCoursesPage from '../pages/creator/CreatorCoursesPage'
import CreateCoursePage from '../pages/creator/CreateCoursePage'
import CourseBlocksPage from '../pages/creator/CourseBlocksPage'
import EditBlockPage from '../pages/creator/EditBlockPage'
import CourseUnitsPage from '../pages/creator/CourseUnitsPage'
import EditUnitPage from '../pages/creator/EditUnitPage'
import CourseEnrolledPage from '../pages/creator/CourseEnrolledPage'
import CourseCompletersPage from '../pages/creator/CourseCompletersPage'
import CourseAnalyticsPage from '../pages/creator/CourseAnalyticsPage'

// Rutas del creador — CreatorLayout gestiona su propio Navbar
<Route path="/creator/dashboard" element={<CreatorRoute><CreatorLayout><CreatorDashboardPage /></CreatorLayout></CreatorRoute>} />
<Route path="/creator/cursos" element={<CreatorRoute><CreatorLayout><CreatorCoursesPage /></CreatorLayout></CreatorRoute>} />
<Route path="/creator/cursos/nuevo" element={<CreatorRoute><CreatorLayout><CreateCoursePage /></CreatorLayout></CreatorRoute>} />
<Route path="/creator/cursos/:courseSlug/bloques" element={<CreatorRoute><CreatorLayout><CourseBlocksPage /></CreatorLayout></CreatorRoute>} />
<Route path="/creator/cursos/:courseSlug/bloques/:bloqueId/editar" element={<CreatorRoute><CreatorLayout><EditBlockPage /></CreatorLayout></CreatorRoute>} />
<Route path="/creator/cursos/:courseSlug/bloques/:bloqueId/unidades" element={<CreatorRoute><CreatorLayout><CourseUnitsPage /></CreatorLayout></CreatorRoute>} />
<Route path="/creator/cursos/:courseSlug/bloques/:bloqueId/unidades/:unidadId" element={<CreatorRoute><CreatorLayout><EditUnitPage /></CreatorLayout></CreatorRoute>} />
<Route path="/creator/cursos/:courseSlug/inscritos" element={<CreatorRoute><CreatorLayout><CourseEnrolledPage /></CreatorLayout></CreatorRoute>} />
<Route path="/creator/cursos/:courseSlug/completadores" element={<CreatorRoute><CreatorLayout><CourseCompletersPage /></CreatorLayout></CreatorRoute>} />
<Route path="/creator/cursos/:courseSlug/analiticas" element={<CreatorRoute><CreatorLayout><CourseAnalyticsPage /></CreatorLayout></CreatorRoute>} />
```

> ⚠️ Agregar las rutas del creador **antes** de `<Route path="*">` para que no sean capturadas por el 404.
> ⚠️ `/creator/cursos/nuevo` debe declararse **antes** que `/creator/cursos/:courseSlug/bloques` para evitar que "nuevo" sea interpretado como un courseSlug.

---

## Paso 7 — Actualizar redirects post-login

En `src/pages/auth/LoginPage.tsx`, cambiar la lógica de redirección:

```tsx
// Antes (para todos):
navigate('/dashboard')

// Ahora (según rol):
if (foundUser.role === 'student') {
  navigate('/dashboard')
} else {
  navigate('/creator/dashboard')
}
```

En `src/pages/auth/RegisterOrgPage.tsx` y `RegisterInstructorPage.tsx`:
```tsx
navigate('/creator/dashboard')  // en vez de navigate('/')
```

También en `src/components/layout/Navbar.tsx`, el link "Dashboard" del dropdown del usuario:
```tsx
// Cambiar el link hardcodeado a /dashboard por uno dinámico:
to={user.role === 'student' ? '/dashboard' : '/creator/dashboard'}
```

---

## Paso 8 — Pantallas

Todos los archivos van en `src/pages/creator/`.

---

### 4.1 Dashboard del Creador — `/creator/dashboard`

**Archivo:** `src/pages/creator/CreatorDashboardPage.tsx`

```
Hola, TechCorp Latam 👋
Panel de creación de contenido

┌──────────┬────────────┬───────────┬────────────┐
│   2      │  1,482     │   11%     │    12      │
│ Cursos   │ Inscritos  │Completac. │ Este mes   │
│ activos  │ totales    │           │completaron │
└──────────┴────────────┴───────────┴────────────┘

Mis cursos

┌──────────────────────────────────────────────────────────────┐
│ [img]  Intro a la Arquitectura de Microservicios  [Publicado]│
│        1,240 inscritos · 88 completados · ⭐ 4.8            │
│        [Ver inscritos]  [Editar bloques]                     │
├──────────────────────────────────────────────────────────────┤
│ [img]  Onboarding Técnico: Stack de TechCorp      [Publicado]│
│        242 inscritos · 48 completados · ⭐ 4.6              │
│        [Ver inscritos]  [Editar bloques]                     │
└──────────────────────────────────────────────────────────────┘

[+ Crear nuevo curso]  (botón dorado, centrado)
```

**Detalles:**
- Obtener org/instructor desde `user` del AuthContext (`user.orgSlug` o `user.instructorSlug`)
- Filtrar cursos con `getCreatorCourses(user.orgSlug)` para org, o por instructor para instructores
- Métricas: sumar `totalEnrolled` y `totalCompleted` de todos los cursos; calcular tasa de completación media
- "Este mes completaron": hardcodear 12 (mockup)
- Cada curso en tarjeta horizontal:
  - Thumbnail `60×60px rounded-lg`, título, badge de status (`CourseStatus` → colores: `published` → verde, `draft` → amarillo, `archived` → gris)
  - Inscritos + completados + rating
  - Botón "Ver inscritos" → `/creator/cursos/:slug/inscritos`
  - Botón "Editar bloques" → `/creator/cursos/:slug/bloques`
- Si no hay cursos: empty state con ícono `BookPlus` + "Aún no has creado ningún curso" + botón dorado "Crear mi primer curso"

---

### 4.2 Lista de Cursos — `/creator/cursos`

**Archivo:** `src/pages/creator/CreatorCoursesPage.tsx`

```
Mis cursos                                  [+ Crear curso]

[Todos (2)]  [Publicados (2)]  [Borradores (0)]  [Archivados (0)]

┌──────────────────────────────────────────────────────────────────────┐
│ Curso               │ Estado    │ Inscritos │ Complet. │ Rating │ ⋮  │
├──────────────────────────────────────────────────────────────────────┤
│ [img] Intro Micro.. │ Publicado │ 1,240     │ 88       │ ⭐4.8  │ ⋮  │
├──────────────────────────────────────────────────────────────────────┤
│ [img] Onboarding..  │ Publicado │ 242       │ 48       │ ⭐4.6  │ ⋮  │
└──────────────────────────────────────────────────────────────────────┘
```

**Detalles:**
- Header con título + botón "Crear curso" dorado → `/creator/cursos/nuevo`
- Tabs de filtro por status con `useState`
- Tabla responsive (`overflow-x-auto` wrapper):
  - Columnas: thumbnail+título, status badge, inscritos, completadores, rating, menú de acciones
  - Fila hover: `hover:bg-[#F2EDE1]`
- **Menú de acciones** (botón `⋮` con `MoreVertical` de Lucide):
  - Dropdown al hacer click: "Editar bloques", "Ver inscritos", "Ver completadores", "Archivar" (mockup), "Eliminar" (mockup con confirmación)
  - Click fuera cierra el dropdown
- En mobile: tabla colapsada a cards (1 card por curso)
- Status badge colors:
  - `published` → `bg-green-100 text-green-700` "Publicado"
  - `draft` → `bg-yellow-100 text-yellow-700` "Borrador"
  - `archived` → `bg-gray-100 text-gray-600` "Archivado"

---

### 4.3 Crear Nuevo Curso — `/creator/cursos/nuevo`

**Archivo:** `src/pages/creator/CreateCoursePage.tsx`

Formulario multi-paso con `StepIndicator` de 3 pasos.

**Step 1: Información básica**
```
[●──○──○] Paso 1 de 3

Información del curso

Título del curso *
[_______________________________________________]

Descripción corta *                     (max 150 chars)
[_______________________________________________]
[                                               ]

Descripción completa *
[                                               ]
[  (textarea, 5 filas)                          ]

Categoría *              Nivel *
[▾ Tecnología      ]    [▾ Intermedio      ]

URL de portada
[https://picsum.photos/...]

[  Vista previa  ]   [  Continuar →  ]
```

**Step 2: Audiencia**
```
[●──●──○] Paso 2 de 3

¿A quién va dirigido?

Requisitos previos
[Agregar requisito...]  [Añadir]
  [Python básico ×]  [Git ×]

A quién está dirigido
[Agregar audiencia...]  [Añadir]
  [Desarrolladores backend ×]

[← Atrás]   [  Continuar →  ]
```

**Step 3: Precio y publicación**
```
[●──●──●] Paso 3 de 3

Precio del curso

○  Gratuito
   Los estudiantes pueden inscribirse sin costo

●  De pago
   Define el precio en Quetzales

   Precio (Q) *
   [_________]

[← Atrás]   [  Publicar curso  ]
```

**Estado de éxito (después de enviar):**
```
      [CheckCircle grande — dorado]

  ¡Curso creado exitosamente!

  "Introducción a..." ya está listo.
  Ahora añade los bloques y unidades
  para que los estudiantes puedan aprender.

  [  Añadir bloques →  ]  (dorado)
  [  Ver mis cursos    ]  (outline verde)
```

**Detalles:**
- Usar `<Input>` y `<StepIndicator>` existentes
- Tags de requisitos y audiencia: input + botón "Añadir" que agrega pills removibles con `×`. Estado local: `string[]`.
- La URL de portada tiene un botón "Vista previa" que muestra la imagen debajo si la URL es válida
- El botón "Publicar curso" (en mockup) hace setTimeout(800ms) y luego muestra el estado de éxito en la misma página (sin navegar)
- El link "Añadir bloques →" navega a `/creator/cursos/introduccion-arquitectura-microservicios/bloques` (usar el slug del primer curso del creador como mockup). Agregar un comentario: `// TODO: en producción usar el id del curso recién creado`

---

### 4.4 Editor de Bloques — `/creator/cursos/:courseSlug/bloques`

**Archivo:** `src/pages/creator/CourseBlocksPage.tsx`

Muestra `<CourseEditNav courseSlug={courseSlug} activeTab="bloques" />` en la parte superior.

```
[CourseEditNav]

Bloques del curso                    [+ Añadir bloque]

┌────────────────────────────────────────────────────────┐
│ ⠿  1  Fundamentos de Arquitectura Distribuida          │
│        4 unidades · 14 días · Nota mínima: 70          │
│        [Editar]  [Unidades (4)]                        │
├────────────────────────────────────────────────────────┤
│ ⠿  2  Diseño de APIs y Contratos                       │
│        5 unidades · 14 días · Nota mínima: 70          │
│        [Editar]  [Unidades (5)]                        │
├────────────────────────────────────────────────────────┤
│ ⠿  3  Comunicación entre Servicios                     │
│        4 unidades · 14 días · Nota mínima: 70          │
│        [Editar]  [Unidades (4)]                        │
├────────────────────────────────────────────────────────┤
│ ⠿  4  Despliegue y Orquestación                        │
│        3 unidades · 14 días · Nota mínima: 70          │
│        [Editar]  [Unidades (3)]                        │
└────────────────────────────────────────────────────────┘

  El orden de los bloques define la ruta de aprendizaje.
  Los estudiantes deben completar cada bloque para avanzar.
```

**Detalles:**
- Leer el curso con `getCreatorCourse(user.orgSlug, courseSlug)`
- Si el curso no existe o no pertenece al creador: redirigir a `/creator/cursos`
- Ícono `⠿` (GripVertical de Lucide) como drag handle visual — sin funcionalidad de drag real
- Número del bloque en círculo `bg-[#F2EDE1] text-[#2D4A3E] font-bold` (32px)
- Cada bloque: fondo `bg-white border border-[#E8E0D0] rounded-xl p-4`
- Hover: `hover:border-[#2D4A3E]/30 hover:shadow-sm`
- Botón "Editar" (outline verde pequeño) → `/creator/cursos/:slug/bloques/:bloqueId/editar`
- Botón "Unidades (N)" (outline verde pequeño) → `/creator/cursos/:slug/bloques/:bloqueId/unidades`
- Botón "+ Añadir bloque" (dorado) en el header — muestra un modal simple con input para nombre del bloque. Al "confirmar" (mockup): agrega el bloque visualmente al final de la lista con los campos vacíos y un toast "Bloque añadido — ahora configúralo"
- Texto informativo al pie de la lista en muted

---

### 4.5 Configuración de Bloque — `/creator/cursos/:courseSlug/bloques/:bloqueId/editar`

**Archivo:** `src/pages/creator/EditBlockPage.tsx`

Formulario pre-llenado con los datos del bloque.

```
← Bloques del curso

Editar bloque

Nombre del bloque *
[Fundamentos de Arquitectura Distribuida    ]

Descripción
[                                           ]
[  (textarea, 3 filas)                      ]

Tiempo disponible para el estudiante *
[  14  ] días
Tiempo que tendrá el estudiante para completar este bloque
desde que lo inicia.

Nota mínima de aprobación *
[  70  ] / 100
Los estudiantes deben obtener esta nota o más para avanzar.

Modo de apertura *
●  Automático
   El bloque se abre cuando el estudiante completa el anterior.

○  Manual
   El creador abre manualmente el bloque para cada estudiante.

[    Guardar cambios    ]  (botón dorado)
```

**Detalles:**
- Link "← Bloques del curso" → `/creator/cursos/:slug/bloques`
- Precargar con datos del bloque (buscar por `bloqueId` en `course.blocks`)
- Todos los `<Input>` del proyecto reutilizados para consistencia
- Duración y nota: tipo `number`, `min=1` / `min=0 max=100`
- Modo de apertura: radio buttons — usar `<label>` con `<input type="radio">`
- Guardar: setTimeout(600ms) + mensaje de éxito inline: `✓ Cambios guardados` en verde que desaparece a los 3s
- Sin navegación al guardar — el usuario permanece en el form

---

### 4.6 Editor de Unidades — `/creator/cursos/:courseSlug/bloques/:bloqueId/unidades`

**Archivo:** `src/pages/creator/CourseUnitsPage.tsx`

```
← Bloques del curso

Bloque 1: Fundamentos de Arquitectura Distribuida
4 unidades

┌────────────────────────────────────────────────────────┐
│ ⠿  [▶]  1. Introducción a los Microservicios   [Editar]│
├────────────────────────────────────────────────────────┤
│ ⠿  [📄]  2. Lectura: El libro de los 12 factores [Edit]│
├────────────────────────────────────────────────────────┤
│ ⠿  [⌨]  3. Ejercicio: Descomponer un monolito   [Edit]│
├────────────────────────────────────────────────────────┤
│ ⠿  [📋]  4. Examen del bloque                  [Edit] │
└────────────────────────────────────────────────────────┘

[+ Añadir unidad ▾]
  ┌─────────────┐
  │ ▶ Video     │
  │ 📄 Material │
  │ ⌨ Ejercicio │
  │ 📋 Examen   │
  └─────────────┘
```

**Detalles:**
- Link "← Bloques del curso" → `/creator/cursos/:slug/bloques`
- Breadcrumb del bloque al tope
- Generar N unidades mock con nombres descriptivos según el tema del bloque (misma lógica que en el plan de Fase 3)
- Tipos de ícono por unidad: `PlayCircle` (video), `FileText` (material), `Code2` (ejercicio), `ClipboardList` (examen)
- Botón "Editar" → `/creator/cursos/:slug/bloques/:bloqueId/unidades/:unidadIndex`
- "Añadir unidad" es un botón con dropdown (similar al de bloques). Al seleccionar tipo: agrega una nueva fila al final con ese tipo y el nombre "Nueva unidad" editable
- Cada fila: fondo `bg-white border border-[#E8E0D0] rounded-lg p-3`

---

### 4.7 Editor de Unidad — `/creator/cursos/:courseSlug/bloques/:bloqueId/unidades/:unidadId`

**Archivo:** `src/pages/creator/EditUnitPage.tsx`

4 variantes según el tipo de unidad. Determinar el tipo por el índice de la unidad (`unidadId` % 3 para video/material/ejercicio, o si es la última unidad del bloque → examen).

**Variant Video:**
```
← Unidades del bloque

Editar unidad de video

Título *
[Introducción a los Microservicios           ]

URL del video (YouTube / Vimeo) *
[https://youtube.com/watch?v=...             ]
[Vista previa del video — placeholder visual ]

Descripción
[  (textarea)  ]

Duración estimada
[  12  ] minutos

[  Guardar  ]
```

**Variant Material:**
```
Título *
[Lectura: El libro de los 12 factores       ]

Descripción *
[  (textarea, explica qué es este material) ]

Archivo adjunto (mockup)
[  📎 Subir archivo  ]  ← input file visual, sin upload real
Formatos: PDF, DOCX, PPTX. Máx 50MB.

URL externa (opcional)
[https://12factor.net                       ]

[  Guardar  ]
```

**Variant Ejercicio:**
```
Título *
[Ejercicio: Descomponer un monolito         ]

Enunciado *
[                                           ]
[  (textarea, 4 filas)                      ]

Tipo de respuesta
●  Texto libre
○  Código

Lenguaje (si es código):
[▾ JavaScript  ]

[  Guardar  ]
```

**Variant Examen:**
```
Título del examen *
[Examen del Bloque 1                        ]

Banco de preguntas

┌──────────────────────────────────────────────┐
│ Pregunta 1                          [🗑 Elim.]│
│ [¿Qué es un microservicio?          ]        │
│                                              │
│ Opción A (correcta ✓): [texto opción A  ]    │
│ Opción B:              [texto opción B  ]    │
│ Opción C:              [texto opción C  ]    │
│ Opción D:              [texto opción D  ]    │
│                                              │
│ [Marcar A como correcta]                     │
└──────────────────────────────────────────────┘

[+ Añadir pregunta]

[  Guardar examen  ]
```

**Detalles generales:**
- Link "← Unidades del bloque" → `/creator/cursos/:slug/bloques/:bloqueId/unidades`
- Usar `<Input>` existente para todos los campos de texto
- Preview de video: si la URL de YouTube es válida (`youtube.com/watch` o `youtu.be`), mostrar un placeholder de thumbnail `https://img.youtube.com/vi/{videoId}/mqdefault.jpg`
- Input de archivo (mockup): `<input type="file" className="hidden" />` + botón custom que activa el click. Al seleccionar archivo: mostrar nombre del archivo seleccionado. No hacer upload real.
- Examen: preguntas en estado local (`useState<Question[]>`). Cada pregunta tiene `text`, `options: string[]`, `correctIndex: number`. Al hacer click en "Marcar X como correcta" → resalta esa opción con borde verde.
- Guardar: setTimeout(600ms) + "✓ Cambios guardados" en verde, sin navegar.

---

### 4.8 Inscritos del Curso — `/creator/cursos/:courseSlug/inscritos`

**Archivo:** `src/pages/creator/CourseEnrolledPage.tsx`

Muestra `<CourseEditNav>` en la parte superior.

```
[CourseEditNav activeTab="inscritos"]

Estudiantes inscritos (8)                  [🔍 Buscar estudiante...]

┌──────────────────────────────────────────────────────────────────────┐
│ Estudiante          │ Inscrito   │ Bloque actual          │ Prog │ Est│
├──────────────────────────────────────────────────────────────────────┤
│ [av] María García   │ 01 nov 25  │ Bloque 2: Diseño APIs  │ 25%  │ ●  │
│      maria@ej.com   │            │                        │      │    │
├──────────────────────────────────────────────────────────────────────┤
│ [av] Carlos Ruiz    │ 05 nov 25  │ Bloque 3: Comunic.     │ 50%  │ ●  │
├──────────────────────────────────────────────────────────────────────┤
│ [av] Ana Rodríguez  │ 10 nov 25  │ Bloque 1: Fundamentos  │ 10%  │ ◐  │  ← inactivo
└──────────────────────────────────────────────────────────────────────┘
```

**Detalles:**
- `overflow-x-auto` wrapper para la tabla
- Buscador: filtra `creatorStudents` por nombre o email con `useState` de query + filter en render
- Columnas: avatar(32px)+nombre+email, fecha inscripción, bloque actual, barra de progreso mini + %, indicador de estado
- Estado badge: `active` → punto verde `●`, `inactive` → punto gris `◐`, `completed` → checkmark verde
- Progreso: `<ProgressBar progress={...} size="sm" />` en 80px de ancho
- Fila hover: `hover:bg-[#F2EDE1]`
- Último acceso mostrado en formato relativo: "hace 2 días" (calcular desde `lastAccessAt`)
- Mobile: tabla → cards apiladas con la misma info

---

### 4.9 Completadores del Curso — `/creator/cursos/:courseSlug/completadores`

**Archivo:** `src/pages/creator/CourseCompletersPage.tsx`

Muestra `<CourseEditNav>` en la parte superior.

```
[CourseEditNav activeTab="completadores"]

Estudiantes que completaron el curso (5)       [↓ Exportar (mockup)]

┌───────────────────────────────────────────────────────────────────┐
│ Estudiante       │ Iniciado   │ Completado  │ Nota final │ Tiempo │
├───────────────────────────────────────────────────────────────────┤
│ [av] Sofía M.    │ 15 nov 25  │ 10 ene 26   │  91 ✓      │ 56 días│
├───────────────────────────────────────────────────────────────────┤
│ [av] Roberto J.  │ 20 sep 25  │ 05 dic 25   │  84 ✓      │ 76 días│
├───────────────────────────────────────────────────────────────────┤
│ [av] Camila V.   │ 25 sep 25  │ 20 dic 25   │  79 ✓      │ 86 días│
└───────────────────────────────────────────────────────────────────┘
```

**Detalles:**
- `overflow-x-auto` wrapper
- Botón "Exportar" (ghost outline): muestra un toast/snackbar "Exportación iniciada — recibirás el archivo por email" (mockup). Toast aparece 2s y desaparece.
- Nota final con badge verde (`<GradeBadge>` existente) si >= 70
- Tabla ordenada por fecha de completación (más reciente primero)
- Si no hay completadores: empty state con ícono `Trophy` + "Aún ningún estudiante ha completado este curso"

---

### 4.10 Analytics del Curso — `/creator/cursos/:courseSlug/analiticas`

**Archivo:** `src/pages/creator/CourseAnalyticsPage.tsx`

Muestra `<CourseEditNav>` en la parte superior.

**4 widgets en grid 2×2 (1 col en mobile):**

**Widget 1 — Inscritos por semana (gráfica de barras verticales CSS):**
```
Inscritos por semana (últimas 8 semanas)

     110
      │
  94  │                                 ██
  81  │              ██                 ██
  72  │              ██     ██          ██ ██
  62  │ ██    ██     ██     ██          ██ ██
  45  │ ██ ██ ██  ██ ██  ██ ██  ██      ██ ██
  38  │ ██ ██ ██  ██ ██  ██ ██  ██   ██ ██ ██
      └──────────────────────────────────────
       S1  S2  S3  S4  S5  S6  S7  S8
```

**Widget 2 — Abandono por bloque (barras horizontales CSS):**
```
¿Hasta qué bloque llegan los estudiantes?

Bloque 1  ████████████████████████████████  100%
Bloque 2  ███████████████████████           74%
Bloque 3  █████████████                     42%
Bloque 4  █████                             18%
```

**Widget 3 — Distribución de notas:**
```
Distribución de notas finales

90-100 ████████████████  5 estudiantes
80-89  ████████████      4 estudiantes
70-79  ████████          3 estudiantes
60-69  ████              2 estudiantes
0-59   ████              2 estudiantes
```

**Widget 4 — Resumen de KPIs:**
```
Resumen de rendimiento

  1,240         88           7%
Total         Complet.    Tasa de
inscritos                 completación

  87           14 sem
Nota prom.   Tiempo prom.
completadores  para completar
```

**Detalles de implementación de gráficas:**
- Usar solo `div` con `height` y `width` calculados con JavaScript para las barras — NO importar ninguna librería de gráficas
- Barras verticales: `div` con `height: ${(value/max)*100}%` dentro de un `div` con `height: 160px` y `flex items-end`
- Barras horizontales: `div` con `width: ${percent}%` dentro de `div` con `w-full`
- Color de barras: `bg-[#2D4A3E]` por defecto, `bg-[#C9A84C]` para valores destacados
- Tooltip al hover: mostrar el valor exacto con `title` attribute o con un `<div>` absolutamente posicionado
- Los datos vienen de `enrollmentByWeek` y `blockDropoff` de `creatorData.ts`

---

## Componentes adicionales

### Toast/Snackbar: `src/components/ui/Toast.tsx`

Componente simple de notificación temporal para las acciones "Exportar" y otras acciones de creador.

Props: `message: string`, `type?: 'success' | 'info'`, `visible: boolean`, `onHide: () => void`

- Posición: `fixed bottom-6 left-1/2 -translate-x-1/2 z-50`
- Fondo: `bg-[#1A1C14] text-white px-5 py-3 rounded-xl shadow-xl`
- Animación: fade in + slide up. Desaparece automáticamente con `setTimeout` dentro del componente.
- Ícono `CheckCircle` si `type='success'`, `Info` si `type='info'`

---

## Checklist de entrega

> **Revisado por Claude — 2026-05-18**
> 4 fixes: ProgressBar duplicada → import del componente existente, ✓ como texto → Lucide Check, GradeBadge duplicada → import del componente existente, "avgTime sem" → "avgTime días".

### Funcionalidad
- [x] Login como org/instructor redirige a `/creator/dashboard`
- [x] Login como estudiante sigue redirigiendo a `/dashboard`
- [x] Navbar "Dashboard" link cambia según rol del usuario
- [x] `/creator/*` redirige a `/login` si no hay sesión
- [x] `/creator/*` redirige a `/dashboard` si el usuario es estudiante
- [x] Dashboard muestra los cursos del creador (filtrado por orgSlug)
- [x] Tabla de cursos filtra correctamente por status
- [x] Formulario de crear curso avanza entre 3 pasos y muestra éxito
- [x] Editor de bloques muestra los bloques del curso real desde `courses.ts`
- [x] Buscador de inscritos filtra en tiempo real
- [x] Botón "Exportar" en completadores muestra toast
- [x] Analytics muestra gráficas proporcionales a los datos mock

### UI/UX
- [x] `CourseEditNav` visible y con tab correcto activo en pantallas 4.4–4.10
- [x] Tablas con `overflow-x-auto` para no romper en mobile
- [x] Menú de acciones (⋮) cierra al hacer click fuera (usa openMenuId en estado local)
- [x] Gráficas de analytics proporcionales (CSS calculado en base a maxEnrolled)
- [x] Toast de exportación visible y desaparece solo
- [x] Drag handle (GripVertical) visible en listas de bloques y unidades

### Diseño
- [x] Paleta respetada en todos los componentes nuevos
- [x] Status badges con colores correctos (verde/amarillo/gris)
- [x] No hay emojis como íconos — corregido ✓ → Lucide Check en CourseEnrolledPage
- [x] `cursor-pointer` en todos los elementos interactivos

### Código
- [x] Sin errores de TypeScript
- [x] `getCreatorCourses` y `getCreatorCourse` usados correctamente
- [x] Rutas del creador declaradas antes de la ruta `*` (404)
- [x] `/creator/cursos/nuevo` declarada antes de `/creator/cursos/:courseSlug/*`
- [x] Ninguna ruta de creator anidada dentro de `PublicLayout`
- [x] Componentes reutilizables usados (ProgressBar y GradeBadge importados, no redefinidos)
