# Nexora — Plan de Implementación: Fase 3 — Experiencia de Aprendizaje

> **Agente implementador:** leer `CLAUDE.md` y `docs/design.md` antes de empezar.
> Este documento es autocontenido — contiene todo lo necesario para implementar la Fase 3 sin preguntar.

---

## Objetivo de la fase

Construir el corazón del producto: el flujo completo de aprendizaje de un estudiante. Incluye el dashboard, el sistema de bloques con ventana de tiempo activa, el player de unidades, el examen por bloque y los resultados. Es la pantalla más compleja y diferenciadora de Nexora.

**Resultado esperado:** 10 pantallas navegables, completamente protegidas por auth, con datos mock que cubren todos los estados posibles del sistema de bloques (activo, bloqueado, completado, reprobado, tiempo agotado).

---

## Orden de implementación

```
Paso 1 → Agregar nuevos tipos al archivo src/types/index.ts
Paso 2 → Crear mock de inscripciones: src/data/enrollments.ts
Paso 3 → Crear StudentLayout y LearningLayout
Paso 4 → Actualizar router con rutas de Fase 3
Paso 5 → Actualizar redirects post-login/registro a /dashboard
Paso 6 → Actualizar link "Dashboard" del Navbar a /dashboard
Paso 7 → Crear componentes reutilizables de la fase
Paso 8 → Implementar pantallas en orden: 3.1 → 3.2 → 3.3 → 3.4 → 3.5 → 3.6 → 3.7 → 3.8 → 3.9 → 3.10
```

---

## Paso 1 — Nuevos tipos en `src/types/index.ts`

Agregar al final (no borrar nada existente):

```ts
export type BlockStatus =
  | 'not_started'   // inscrito pero bloque no iniciado
  | 'active'        // bloque abierto con timer corriendo
  | 'completed'     // aprobado con nota satisfactoria
  | 'failed'        // no aprobado, tiempo no agotado aún
  | 'expired'       // el tiempo se agotó (calificado con lo que había)
  | 'locked'        // bloqueado hasta completar el anterior

export interface BlockProgress {
  blockId: string
  status: BlockStatus
  grade?: number           // 0-100 cuando está calificado
  startedAt?: string       // ISO — cuándo se activó el bloque
  expiresAt?: string       // ISO — cuándo vence la ventana de tiempo
  completedAt?: string     // ISO — cuándo fue calificado
  unitsCompleted: number   // cuántas unidades completadas
}

export interface Enrollment {
  id: string
  userId: string           // debe coincidir con AuthUser.id del demo student
  course: Course
  enrolledAt: string
  blocks: BlockProgress[]
  overallProgress: number  // 0-100 (% de bloques completados)
  completed: boolean
  completedAt?: string
  finalGrade?: number
}

export interface ExamQuestion {
  id: string
  question: string
  options: string[]        // siempre 4 opciones
  correctIndex: number     // 0-3
}
```

---

## Paso 2 — Mock de inscripciones: `src/data/enrollments.ts`

El demo student (`id: 'user-1'`) está inscrito en **3 cursos** con diferentes estados para cubrir todos los casos de UI.

```ts
import type { Enrollment } from '../types'
import { courses } from './courses'

// Importar los cursos específicos
const courseMS = courses.find(c => c.slug === 'introduccion-arquitectura-microservicios')!
const courseDX = courses.find(c => c.slug === 'diseno-experiencias-digitales')!
const courseGH = courses.find(c => c.slug === 'growth-hacking-startups')!

// Fecha helper: N días desde ahora
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
        expiresAt: daysFromNow(8),   // expira en 8 días — activo con timer
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
        status: 'failed',         // reprobado — puede reintentar
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
        status: 'not_started',  // recién inscrito, primer bloque listo para iniciar
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
]

// Helper: obtener inscripciones de un usuario
export function getUserEnrollments(userId: string): Enrollment[] {
  return enrollments.filter(e => e.userId === userId)
}

// Helper: obtener inscripción específica por curso y usuario
export function getEnrollment(userId: string, courseSlug: string): Enrollment | undefined {
  return enrollments.find(e => e.userId === userId && e.course.slug === courseSlug)
}
```

> ⚠️ Nota: Los slugs de cursos en el `courseGH` deben coincidir con el slug real en `courses.ts`. Verificar antes de implementar. Si el slug es diferente, ajustar el import.

---

## Paso 3 — Layouts

### `src/components/layout/StudentLayout.tsx`

Layout para el área de aprendizaje del estudiante: sidebar de navegación a la izquierda + contenido principal a la derecha. La Navbar pública sigue visible arriba.

```
┌──────────────────────────────────────────────────────────────┐
│  [Navbar flotante — igual que siempre]                       │
├─────────────────┬────────────────────────────────────────────┤
│                 │                                            │
│  SIDEBAR        │  CONTENIDO PRINCIPAL                       │
│  (256px fijo)   │  (flex-1, overflow-y-auto)                 │
│                 │                                            │
│  Mi aprendizaje │                                            │
│                 │                                            │
│  [Dashboard]    │                                            │
│  [Mis cursos]   │                                            │
│  [Certifs.]     │                                            │
│                 │                                            │
│  ───────────    │                                            │
│  Activo ahora   │                                            │
│  Curso activo   │                                            │
│  ⏱ 8d 0h       │                                            │
│  [Continuar]    │                                            │
│                 │                                            │
└─────────────────┴────────────────────────────────────────────┘
```

**Detalles:**
- El layout empieza con `pt-20` para compensar la navbar flotante
- Sidebar: `w-64 shrink-0 border-r border-[#E8E0D0] bg-[#FAF7EF] min-h-screen px-4 py-6`
- Encabezado del sidebar: "Mi aprendizaje" en `text-xs font-semibold text-[#5C6355] uppercase tracking-wider mb-4`
- Links de navegación con ícono Lucide + label:
  - `LayoutDashboard` → `/dashboard` → "Dashboard"
  - `BookOpen` → `/mis-cursos` → "Mis cursos"
  - `Award` → `/mis-certificados` → "Mis certificados"
- Link activo: fondo `bg-[#F2EDE1]`, texto `text-[#2D4A3E] font-medium`, border-radius `rounded-lg`
- **Widget "Activo ahora"** (visible si hay un bloque `active` en las inscripciones del usuario):
  - Separador `<hr>` + label "Activo ahora" en muted
  - Nombre del curso truncado (1 línea)
  - Nombre del bloque en muted pequeño
  - `<CountdownTimer expiresAt={...} size="sm" />` — versión compacta del timer
  - Botón "Continuar" → `/aprendizaje/:slug/bloque/:bloqueId`
- **Mobile**: sidebar oculto, mostrar bottom tab bar con los mismos 3 ítems + ícono de menú. O simplemente usar el mismo menú hamburguesa de la navbar existente. Opción más simple: en mobile mostrar solo los tab links horizontales debajo de la navbar. **Elegir la opción más simple.**
- Usar `<Outlet />` para renderizar el contenido de la página hija

### `src/components/layout/LearningLayout.tsx`

Layout de pantalla casi completa para el player de unidades. **No usa la Navbar flotante** — tiene su propia barra superior compacta.

```
┌─────────────────────────────────────────────────────────────────┐
│  ← Nombre del curso     [Progreso: Bloque 2 · U2/5]   [X]     │ ← top bar (56px fijo)
├─────────────────┬───────────────────────────┬───────────────────┤
│                 │                           │                   │
│ PANEL IZQUIERDO │  CONTENIDO CENTRAL        │  PANEL NOTAS      │
│ (240px)         │  (flex-1)                 │  (240px)          │
│                 │                           │  [colapsable]     │
│ Bloque 1 ✓     │                           │                   │
│   Unidad 1 ✓   │  Video / Material /        │  Mis notas        │
│   Unidad 2 ✓   │  Ejercicio                │  [textarea]       │
│   Unidad 3 ✓   │                           │                   │
│ Bloque 2 ●     │                           │                   │
│   Unidad 1 ✓   │                           │                   │
│   Unidad 2 ●   │                           │                   │
│   Unidad 3     │                           │                   │
│   Unidad 4     │                           │                   │
│ Bloque 3 🔒    │                           │                   │
│                 │                           │                   │
├─────────────────┴───────────────────────────┴───────────────────┤
│  [← Anterior]                                  [Siguiente →]   │ ← bottom bar (56px)
└─────────────────────────────────────────────────────────────────┘
```

**Detalles:**
- Fondo: `bg-[#1A1C14]` (oscuro — contexto de "modo estudio")
- Top bar: `bg-[#2D4A3E] text-white px-6 h-14 flex items-center justify-between`
  - Izquierda: `ChevronLeft` + nombre del curso (link a `/aprendizaje/:slug`)
  - Centro: "Bloque X · Unidad Y/N" en muted
  - Derecha: ícono `X` que va a `/aprendizaje/:slug`
- Panel izquierdo: `w-60 bg-[#1A1C14] border-r border-white/10 overflow-y-auto`
  - Lista de bloques como accordions. Solo el bloque activo está expandido por defecto.
  - Bloque completado: `CheckCircle` verde + nombre + opacidad al 70%
  - Bloque activo: nombre en blanco, expandido
  - Bloque bloqueado: `Lock` gris + nombre + opacidad al 40%
  - Unidades: `PlayCircle` / `FileText` / `Code2` + nombre + estado (✓ completada, ● activa, vacío)
  - Unidad activa: fondo `bg-white/10 rounded-lg`
- Panel central: `flex-1 bg-[#FAF7EF]` (vuelve a beige para el contenido)
- Panel notas: `w-60 bg-[#1A1C14] border-l border-white/10`
  - Header "Mis notas" en blanco
  - `<textarea>` con fondo `bg-white/5 text-white placeholder-white/30`
  - Botón toggle para colapsar/expandir el panel notas
- Bottom bar: `bg-[#2D4A3E] text-white px-6 h-14 flex items-center justify-between`
  - Botón "← Anterior" (ghost blanco) — deshabilitado en primera unidad
  - Botón "Siguiente →" (dorado) — en la última unidad del bloque cambia a "Ir al examen"
- En mobile: ocultar paneles lateral izquierdo y notas. Top bar simplificado. Bottom nav con tabs.
- Este layout **NO usa `<Outlet />`** de la misma forma — recibe las props del contexto de URL. Usar `<Outlet context={...}>` de React Router para pasar datos al hijo.

---

## Paso 4 — Actualizar router: `src/router/index.tsx`

Agregar las rutas de Fase 3 a las existentes:

```tsx
// Rutas del estudiante — protegidas, usan StudentLayout
<Route path="/dashboard" element={<ProtectedRoute><StudentDashboardPage /></ProtectedRoute>} />
<Route path="/mis-cursos" element={<ProtectedRoute><MyCoursesPage /></ProtectedRoute>} />
<Route path="/mis-certificados" element={<ProtectedRoute><MyCertificatesPage /></ProtectedRoute>} />

// Rutas de aprendizaje — protegidas, usan LearningLayout (layout propio, no anidado en PublicLayout)
// Deben ir FUERA del bloque <Route element={<PublicLayout />}>
<Route path="/aprendizaje/:cursoSlug" element={<ProtectedRoute><CourseBlockMapPage /></ProtectedRoute>} />
<Route path="/aprendizaje/:cursoSlug/bloque/:bloqueId" element={<ProtectedRoute><BlockViewPage /></ProtectedRoute>} />
<Route path="/aprendizaje/:cursoSlug/bloque/:bloqueId/unidad/:unidadId" element={<ProtectedRoute><UnitPlayerPage /></ProtectedRoute>} />
<Route path="/aprendizaje/:cursoSlug/bloque/:bloqueId/examen" element={<ProtectedRoute><BlockExamPage /></ProtectedRoute>} />
<Route path="/aprendizaje/:cursoSlug/bloque/:bloqueId/resultados" element={<ProtectedRoute><BlockResultsPage /></ProtectedRoute>} />
<Route path="/aprendizaje/:cursoSlug/bloque/:bloqueId/reintentar" element={<ProtectedRoute><BlockRetryPage /></ProtectedRoute>} />
<Route path="/aprendizaje/:cursoSlug/bloque/:bloqueId/bloqueado" element={<ProtectedRoute><BlockLockedPage /></ProtectedRoute>} />
```

> ⚠️ Las rutas de `/aprendizaje/*` deben estar **fuera** de `<Route element={<PublicLayout />}>` porque usan `LearningLayout`, que tiene su propio top bar. Si se anidan dentro de PublicLayout, aparecerá la navbar flotante encima del LearningLayout.

> ⚠️ Las rutas `/dashboard`, `/mis-cursos` y `/mis-certificados` sí van dentro del bloque de `PublicLayout`, porque usan `StudentLayout` que depende de que la Navbar pública esté presente.

---

## Paso 5 — Actualizar redirects post-login

En `src/pages/auth/LoginPage.tsx`, cambiar:
```tsx
navigate('/')  →  navigate('/dashboard')
```

En `src/pages/auth/RegisterStudentPage.tsx`:
```tsx
navigate('/')  →  navigate('/dashboard')
```

En `src/pages/auth/RegisterOrgPage.tsx` y `RegisterInstructorPage.tsx`:
```tsx
navigate('/')  →  navigate('/')   // dejar igual — org/instructor no tienen dashboard aún (Fase 4)
```

---

## Paso 6 — Actualizar Navbar

En `src/components/layout/Navbar.tsx`, el link "Dashboard" del dropdown del usuario apunta a `/`. Cambiar a `/dashboard`:

```tsx
// Buscar en el dropdown del usuario:
<Link to="/">   →   <Link to="/dashboard">

// Buscar en el menú mobile:
<Link to="/">   →   <Link to="/dashboard">
```

---

## Paso 7 — Componentes reutilizables

### `src/components/learning/CountdownTimer.tsx`

El componente más importante de la Fase 3 — comunica visualmente la presión del tiempo.

Props: `expiresAt: string`, `size?: 'sm' | 'md' | 'lg'`

**Lógica:**
- Calcular diferencia entre `new Date(expiresAt)` y `new Date()` en milisegundos
- Derivar: días, horas, minutos
- Actualizar cada minuto con `setInterval` en `useEffect` (limpiar en cleanup)
- Si expiresAt ya pasó: mostrar "Tiempo agotado" en rojo

**Estados visuales:**

| Tiempo restante | Color de texto | Color de fondo | Ícono |
|---|---|---|---|
| > 3 días | `text-[#2D4A3E]` | `bg-[#F2EDE1]` | `Clock` verde |
| 1-3 días | `text-amber-700` | `bg-amber-50` | `Clock` naranja |
| < 24 horas | `text-red-700` | `bg-red-50` | `AlertCircle` rojo |
| Agotado | `text-red-700` | `bg-red-50` | `AlertCircle` | "Tiempo agotado" |

**Formato de visualización:**
- `size="lg"`: mostrar en 3 bloques grandes — `8d` · `4h` · `32m` con labels debajo
- `size="md"`: una línea — "8 días, 4 horas restantes"
- `size="sm"`: compacto — `⏱ 8d 4h` (para el sidebar)

### `src/components/learning/BlockStatusIcon.tsx`

Props: `status: BlockStatus`, `size?: number`

| Status | Ícono Lucide | Color |
|---|---|---|
| `not_started` | `Circle` | `text-[#E8E0D0]` |
| `active` | `PlayCircle` | `text-[#C9A84C]` (dorado) |
| `completed` | `CheckCircle` | `text-[#2D4A3E]` (verde) |
| `failed` | `XCircle` | `text-red-500` |
| `expired` | `Clock` | `text-[#5C6355]` |
| `locked` | `Lock` | `text-[#E8E0D0]` |

### `src/components/learning/GradeBadge.tsx`

Props: `grade: number`, `passingGrade?: number` (default 70)

- `grade >= passingGrade` → fondo verde claro, texto verde, "Aprobado"
- `grade < passingGrade` → fondo rojo claro, texto rojo, "Reprobado"
- Siempre mostrar el número: "88 · Aprobado"

### `src/components/learning/ProgressBar.tsx`

Props: `progress: number` (0-100), `size?: 'sm' | 'md'`, `color?: string`

- Barra ancha con fondo `bg-[#E8E0D0]`, fill `bg-[#2D4A3E]`
- `size="sm"`: `h-1.5`, `size="md"`: `h-2.5`
- Mostrar porcentaje al lado si `size="md"`

---

## Paso 8 — Pantallas

Todos los archivos van en `src/pages/student/`.

---

### 3.1 Dashboard del Estudiante — `/dashboard`

**Archivo:** `src/pages/student/StudentDashboardPage.tsx`
**Layout:** `StudentLayout`

```
┌─────────────────────────────────────────────────────────┐
│  Hola, María 👋                                         │
│  Continúa donde lo dejaste                              │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │  🔥 BLOQUE ACTIVO                               │   │
│  │  Intro a Microservicios · Bloque 2              │   │
│  │  Diseño de APIs y Contratos                     │   │
│  │                                                 │   │
│  │     8d          0h          32m                 │   │
│  │   días        horas       minutos               │   │
│  │                                                 │   │
│  │  ████████░░░░░░░░  2/5 unidades completadas     │   │
│  │                                                 │   │
│  │  [    Continuar bloque →    ]                   │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  Mis cursos en progreso                                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐              │
│  │  Curso 1 │  │  Curso 2 │  │  Curso 3 │              │
│  │  25%     │  │  33%     │  │  0%      │              │
│  └──────────┘  └──────────┘  └──────────┘              │
│                                                         │
│  ┌────────────┬────────────┬────────────┐               │
│  │  3 cursos  │  2 bloques │  90 prom.  │               │
│  │ inscritos  │ completados│  nota      │               │
│  └────────────┴────────────┴────────────┘               │
└─────────────────────────────────────────────────────────┘
```

**Detalles:**
- Obtener inscripciones con `getUserEnrollments(user.id)`
- **Widget de bloque activo** (mostrar solo si existe un bloque con `status: 'active'`):
  - Fondo: `bg-[#2D4A3E]` con texto blanco (destaca en la página)
  - Label "BLOQUE ACTIVO" con ícono `Flame` en dorado
  - Nombre del curso + nombre del bloque
  - `<CountdownTimer expiresAt={...} size="lg" />` en blanco (ajustar colores para fondo oscuro)
  - `<ProgressBar progress={...} />` con porcentaje de unidades
  - Botón "Continuar bloque →" en dorado → `/aprendizaje/:slug/bloque/:bloqueId`
  - Si hay un bloque `failed`, mostrar secundariamente: "También tienes un bloque reprobado que puedes reintentar" con link
- **Grid de cursos en progreso:** `<CourseProgressCard>` (ver abajo) para cada inscripción no completada
- **Stats row:** 3 cajas con número grande + label. Calcular desde las inscripciones:
  - Cursos inscritos: `enrollments.length`
  - Bloques completados: suma de blocks con status `completed`
  - Nota promedio: media de todos los `grade` de bloques completados
- Si no hay inscripciones: empty state con ícono `BookOpen` grande + "¡Aún no estás inscrito en ningún curso!" + botón "Explorar cursos" → `/cursos`

**Componente interno `CourseProgressCard`:**
```
┌────────────────────────────────────────────┐
│ [imagen portada — 16:9]                    │
│ Título del curso (1 línea)                 │
│ TechCorp Latam                             │
│ ████░░░░░░░  25%  · Bloque 2 activo        │
│ [Continuar →]                              │
└────────────────────────────────────────────┘
```
- Al hacer click: navegar a `/aprendizaje/:slug`
- Mostrar el bloque actual activo o el siguiente a iniciar

---

### 3.2 Mis Cursos — `/mis-cursos`

**Archivo:** `src/pages/student/MyCoursesPage.tsx`
**Layout:** `StudentLayout`

```
Mis cursos (3)

[En progreso (3)]  [Completados (0)]  [Todos (3)]

┌────────────────────────────────────────────────────────┐
│  [portada]  Intro a Microservicios               25%  │
│             TechCorp Latam                            │
│             Bloque 2 activo · ⏱ 8d 0h               │
│             ████████░░░░░░  [Continuar →]             │
├────────────────────────────────────────────────────────┤
│  [portada]  Diseño de Experiencias Digitales     33%  │
│             Universidad de la Innovación              │
│             Bloque 2 reprobado — necesita reintentar  │
│             ████████████░░  [Ver curso]               │
├────────────────────────────────────────────────────────┤
│  [portada]  Growth Hacking para Startups          0%  │
│             StartupHub Academy                        │
│             Bloque 1 no iniciado                      │
│             ░░░░░░░░░░░░░░  [Comenzar →]              │
└────────────────────────────────────────────────────────┘
```

**Detalles:**
- Tabs implementados con `useState`
- Cada fila es una tarjeta horizontal: portada (80×60px) + info + CTA
- Estado del bloque actual mostrado con texto descriptivo y color según status:
  - `active` → texto verde "Bloque N activo" + timer compacto
  - `failed` → texto rojo "Bloque N reprobado — necesita reintentar"
  - `not_started` → texto muted "Bloque N no iniciado"
  - `completed` (todo) → "Completado" con badge
- CTA dinámico según estado: "Continuar →" / "Reintentar" / "Comenzar →" / "Ver curso"
- Todos los CTAs navegan a `/aprendizaje/:slug`

---

### 3.3 Vista de Bloques del Curso — `/aprendizaje/:cursoSlug`

**Archivo:** `src/pages/student/CourseBlockMapPage.tsx`
**Layout:** ninguno de los anteriores — usa su propio layout limpio con la Navbar flotante y sin footer

```
[← Volver a Mis cursos]

┌────────────────────────────────────────────────────────────┐
│ [portada del curso — banner 100% ancho, altura 200px]      │
│ overlay oscuro                                              │
│ Intro a Microservicios                                      │
│ TechCorp Latam  ·  Progreso: 25%  [████████░░░░░░░░]       │
└────────────────────────────────────────────────────────────┘

Temario del curso

│  ●  Bloque 1: Fundamentos de Arquitectura Distribuida
│     ✓ Completado · Nota: 88 · 14 nov 2025
│     [Ver resultados]
│
│  ●  Bloque 2: Diseño de APIs y Contratos          ← ACTIVO
│     ⏱ 8 días, 0 horas restantes
│     Progreso: 2/5 unidades completadas
│     ████████░░░░░░░░░░░░
│     [Continuar bloque →]   (botón dorado, destacado)
│
│  ○  Bloque 3: Comunicación entre Servicios
│     🔒 Bloqueado — completa el Bloque 2 primero
│
│  ○  Bloque 4: Despliegue y Orquestación
│     🔒 Bloqueado
```

**Detalles:**
- Leer `cursoSlug` con `useParams()`
- Obtener enrollment con `getEnrollment(user.id, cursoSlug)`. Si no existe: redirigir a `/cursos/:cursoSlug` (vista pública del curso)
- **Banner del curso:** imagen del curso como background, overlay `bg-gradient-to-t from-[#1A1C14]/80`, título y org en blanco, barra de progreso general del curso
- **Timeline de bloques** — lista vertical con línea conectora entre bloques:
  - Cada bloque: círculo de estado + contenido
  - El conector: línea vertical `w-0.5 bg-[#E8E0D0]` que conecta los círculos
  - Bloque completado: fondo card `bg-[#F2EDE1]`, border verde `border-[#2D4A3E]/30`
  - Bloque activo: fondo card `bg-white`, borde dorado `border-[#C9A84C]`, sombra `shadow-md` — destacado visualmente
  - Bloque bloqueado: fondo `bg-[#F2EDE1]/50`, opacidad al 60%
- **Bloque activo:** mostrar `<CountdownTimer size="md" />` + `<ProgressBar />` + botón "Continuar bloque →" dorado prominente
- **Bloque completado:** nota con `<GradeBadge />` + fecha de completación + link "Ver resultados" (mockup, va a resultados del bloque)
- **Bloque reprobado:** nota roja + botón "Reintentar bloque" → `/aprendizaje/:slug/bloque/:bloqueId/reintentar`
- **Bloque not_started (si es el siguiente disponible):** botón "Iniciar bloque" verde → va a `/aprendizaje/:slug/bloque/:bloqueId` y el bloque se "activa" (en mockup, simplemente navega)
- **Bloque bloqueado:** texto muted, ícono `Lock`, sin botón

---

### 3.4 Vista de Bloque (Unidades) — `/aprendizaje/:cursoSlug/bloque/:bloqueId`

**Archivo:** `src/pages/student/BlockViewPage.tsx`
**Layout:** Usa la Navbar + propio diseño (sin footer, sin sidebar del StudentLayout)

```
[← Volver al curso]

Bloque 2: Diseño de APIs y Contratos
─────────────────────────────────────────────────────────
Tiempo restante:  8d · 0h · 32m          Progreso: 2/5
[══════════════════════════════════════░░░░░░░░░░]

Unidades del bloque:

  ✓  1. Introducción a REST y GraphQL         [▶ Video · 12min]
  ✓  2. Diseño de contratos con OpenAPI       [📄 Material]
  ●  3. Práctica: tu primera API              [⌨ Ejercicio]     ← en progreso
     4. Versionado y deprecación              [▶ Video · 8min]
     5. Herramientas de testing de APIs       [▶ Video · 15min]

─────────────────────────────────────────────────────────

[ Examen final del bloque ]    ← habilitado siempre en mockup (botón verde)
```

**Detalles:**
- Header: nombre del bloque, `<CountdownTimer size="lg" />`, barra de progreso de unidades
- Lista de unidades (mock — generarlas desde `block.unitCount`):
  - Generar N unidades con nombres descriptivos según el tema del bloque
  - Tipos en ciclo: `video`, `material`, `ejercicio` (según índice % 3)
  - Estado: las primeras `block.unitsCompleted` aparecen como completadas (✓ verde)
  - La siguiente es "en progreso" (● dorado)
  - Las demás son pendientes
  - Al hacer click en una unidad → `/aprendizaje/:slug/bloque/:bloqueId/unidad/:unidadIndex`
- Ícono por tipo: `PlayCircle` (video), `FileText` (material), `Code2` (ejercicio)
- Duración mockup: videos 8-20min, materiales sin duración, ejercicios sin duración
- Unidades completadas: opacidad 70%, ícono `CheckCircle` verde
- Unidad en progreso: borde izquierdo dorado `border-l-4 border-[#C9A84C]`, fondo `bg-[#FAF7EF]`
- Botón "Examen final del bloque" secundario verde al final — siempre habilitado en mockup
- Si bloque está `expired` o `completed`: mostrar banner informativo en la parte superior

---

### 3.5 Player de Unidad — `/aprendizaje/:cursoSlug/bloque/:bloqueId/unidad/:unidadId`

**Archivo:** `src/pages/student/UnitPlayerPage.tsx`
**Layout:** `LearningLayout` (pantalla completa con top bar y bottom bar)

El contenido central varía según el tipo de unidad. Usar `unidadId` como índice para determinar el tipo.

**Contenido central para Video:**
```
┌─────────────────────────────────────────────────────┐
│                                                     │
│                  ▶                                  │
│        [Video placeholder — fondo oscuro]           │
│        "Intro a REST y GraphQL — 12 min"            │
│        [barra de progreso del video — mockup]       │
│        ⏮  ▶  ⏭  🔊 ───────── 4:32 / 12:00          │
│                                                     │
└─────────────────────────────────────────────────────┘
```
- Fondo: `bg-[#1A1C14]`
- Ícono `PlayCircle` enorme centrado (clickeable — toggle play/pause en estado local)
- Título de la unidad debajo
- Barra de progreso del video (decorativa, useState para posición)
- Controles de mockup: play/pause, anterior, siguiente, volumen, tiempo

**Contenido central para Material:**
```
┌─────────────────────────────────────────────────────┐
│  📄  Diseño de contratos con OpenAPI                │
│                                                     │
│  Contenido del material...                          │
│  (texto mock de 3-4 párrafos relacionados al tema)  │
│                                                     │
│  Recursos adjuntos:                                 │
│  [📎 openapi-spec.yaml]  [📎 ejemplos.zip]          │
└─────────────────────────────────────────────────────┘
```
- Fondo: `bg-white`, padding generoso
- Texto mock coherente con el tema del bloque (2-3 párrafos)
- 2 archivos adjuntos mock (no descargables — solo UI)

**Contenido central para Ejercicio:**
```
┌─────────────────────────────────────────────────────┐
│  ⌨  Práctica: Tu primera API                        │
│                                                     │
│  Enunciado del ejercicio:                           │
│  Crea un endpoint GET /usuarios que retorne...      │
│                                                     │
│  Tu solución:                                       │
│  ┌───────────────────────────────────────────────┐ │
│  │  // Escribe tu código aquí                    │ │
│  │  app.get('/usuarios', (req, res) => {         │ │
│  │    ...                                        │ │
│  │  })                                           │ │
│  └───────────────────────────────────────────────┘ │
│                                                     │
│  [  Enviar solución  ]                              │
└─────────────────────────────────────────────────────┘
```
- Editor de código mockup: `<textarea>` con fuente monoespaciada, fondo `bg-[#1E1E1E]`, texto verde claro
- Enunciado coherente con el tema
- Botón "Enviar solución" (dorado) que muestra un mensaje de éxito: "✓ Solución enviada — continúa con la siguiente unidad"

**Bottom bar dinámica:**
- "← Anterior": deshabilitado en unidad 1
- "Siguiente →": en la última unidad del bloque, el botón dice "Ir al examen final" y navega a `/examen`

---

### 3.6 Examen Final del Bloque — `/aprendizaje/:cursoSlug/bloque/:bloqueId/examen`

**Archivo:** `src/pages/student/BlockExamPage.tsx`
**Layout:** Limpio — solo navbar + contenido centrado sin distracciones. No usar LearningLayout.

```
┌─────────────────────────────────────────────────────────┐
│  Examen: Bloque 2 · Diseño de APIs y Contratos         │
│  ⏱ 8d 0h restantes                                     │
│                                                         │
│  Pregunta 3 de 5  ●●●○○                                 │
│  ══════════════════════════════════░░░░░░░░░░░░ 60%     │
│                                                         │
│  ¿Cuál es el código de respuesta HTTP correcto          │
│  para un recurso creado exitosamente?                   │
│                                                         │
│  ○  A) 200 OK                                           │
│  ○  B) 201 Created                          ← correcto  │
│  ○  C) 204 No Content                                   │
│  ○  D) 400 Bad Request                                  │
│                                                         │
│  [  Siguiente pregunta →  ]                             │
└─────────────────────────────────────────────────────────┘
```

**5 preguntas mock** — generarlas estáticamente dentro del componente. Usar preguntas coherentes con el tema del curso (APIs para el caso de Microservicios). Ejemplo para el bloque de Diseño de APIs:

```ts
const mockQuestions: ExamQuestion[] = [
  {
    id: 'q1',
    question: '¿Qué significa el acrónimo REST en el contexto de APIs?',
    options: [
      'Remote Execution Service Technology',
      'Representational State Transfer',
      'Real-time Event Streaming Transport',
      'Resource Endpoint Structure Technology',
    ],
    correctIndex: 1,
  },
  // ... 4 preguntas más del mismo tema
]
```

**Estado del examen:**
```ts
const [currentQ, setCurrentQ] = useState(0)
const [answers, setAnswers] = useState<Record<number, number>>({})
const [submitted, setSubmitted] = useState(false)
```

**Detalles:**
- Indicador de progreso: puntos (●●●○○) + barra de porcentaje
- Opción seleccionada: fondo `bg-[#F2EDE1] border-[#2D4A3E]`, texto verde
- Botón "Siguiente pregunta": deshabilitado si no hay respuesta seleccionada para esta pregunta
- En la última pregunta: botón cambia a "Finalizar examen"
- Al finalizar: calcular nota (respuestas correctas / total × 100), navegar a `/resultados` pasando la nota via `state`:
  ```ts
  navigate(`/aprendizaje/${cursoSlug}/bloque/${bloqueId}/resultados`, {
    state: { grade: calculatedGrade, totalQuestions: 5, correctAnswers: n }
  })
  ```
- Sin back button — no se puede retroceder a preguntas anteriores (mockup)
- `prefers-reduced-motion`: no hay animaciones entre preguntas, solo cambio directo

---

### 3.7 Resultados del Bloque — `/aprendizaje/:cursoSlug/bloque/:bloqueId/resultados`

**Archivo:** `src/pages/student/BlockResultsPage.tsx`
**Layout:** Centrado, sin distracciones

```
(Si aprobado — nota >= 70):
┌─────────────────────────────────────────────────────────┐
│                                                         │
│              ✓                                          │
│  (CheckCircle grande en verde — 80px)                   │
│                                                         │
│           88 / 100                                      │
│           APROBADO                                      │
│                                                         │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━                  │
│  Nota mínima de aprobación: 70 puntos                   │
│  Respondiste correctamente 4 de 5 preguntas             │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━                  │
│                                                         │
│  [ Continuar al siguiente bloque → ]  (botón dorado)    │
│  [       Ver temario del curso      ]  (outline verde)  │
│                                                         │
└─────────────────────────────────────────────────────────┘

(Si reprobado — nota < 70):
│  (XCircle rojo — 80px)
│  52 / 100
│  REPROBADO
│  Nota mínima: 70 puntos
│
│  [ Reintentar bloque ]  →  /reintentar
│  [ Ver temario ]
```

**Detalles:**
- Leer `grade`, `totalQuestions`, `correctAnswers` desde `useLocation().state`
- Si no hay state (acceso directo a la URL): mostrar nota mock de 75
- `grade >= 70`: ícono `CheckCircle` `text-[#2D4A3E]`, texto "APROBADO" en verde, fondo tarjeta `bg-[#2D4A3E]/5 border-[#2D4A3E]/20`
- `grade < 70`: ícono `XCircle` `text-red-500`, texto "REPROBADO" en rojo, fondo `bg-red-50 border-red-200`
- Número de nota: `text-6xl font-bold`, color según aprobado/reprobado

---

### 3.8 Confirmación de Reintentar — `/aprendizaje/:cursoSlug/bloque/:bloqueId/reintentar`

**Archivo:** `src/pages/student/BlockRetryPage.tsx`
**Layout:** Centrado

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│  (ícono RefreshCcw en dorado — 48px)                    │
│                                                         │
│  ¿Reintentar el bloque?                                 │
│                                                         │
│  Entendemos que ya avanzaste parte del contenido,       │
│  por lo que el tiempo de reintento será menor.          │
│                                                         │
│  ┌─────────────────┬─────────────────────────────────┐ │
│  │  Tiempo original │  Tiempo de reintento            │ │
│  │  14 días         │  7 días                         │ │
│  └─────────────────┴─────────────────────────────────┘ │
│                                                         │
│  Empezarás desde la primera unidad del bloque.          │
│  Tu nota anterior: 52/100                               │
│                                                         │
│  [  Sí, reintentar  ]  (dorado)                         │
│  [  Cancelar        ]  (outline verde) → vuelve atrás   │
└─────────────────────────────────────────────────────────┘
```

**Detalles:**
- Calcular tiempo de reintento: `Math.ceil(block.durationDays / 2)` días
- Obtener la nota anterior del enrollment
- Botón "Sí, reintentar": navega a `/aprendizaje/:slug/bloque/:bloqueId` (en producción actualizaría el estado)
- Botón "Cancelar": navega atrás con `navigate(-1)`

---

### 3.9 Bloque Bloqueado — `/aprendizaje/:cursoSlug/bloque/:bloqueId/bloqueado`

**Archivo:** `src/pages/student/BlockLockedPage.tsx`
**Layout:** Centrado, con Navbar

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│  (ícono Lock en muted — 64px)                           │
│                                                         │
│  Este bloque está bloqueado                             │
│                                                         │
│  Para acceder a "Bloque 3: Comunicación entre           │
│  Servicios" debes completar primero:                    │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │  Bloque 2: Diseño de APIs y Contratos           │   │
│  │  Estado: Activo · ⏱ 8d restantes               │   │
│  │  [Continuar bloque →]                           │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  [← Volver al temario del curso]                        │
└─────────────────────────────────────────────────────────┘
```

**Detalles:**
- Determinar cuál bloque previo necesita completarse (el inmediatamente anterior en la lista)
- Mostrar info de ese bloque con su estado actual y CTA
- Link "Volver al temario" → `/aprendizaje/:slug`

---

### 3.10 Mis Certificados — `/mis-certificados`

**Archivo:** `src/pages/student/MyCertificatesPage.tsx`
**Layout:** `StudentLayout`

```
Mis certificados (2)

┌──────────────────────┐  ┌──────────────────────┐
│ [fondo verde/dorado] │  │ [fondo verde/dorado]  │
│ Nexora.              │  │ Nexora.               │
│                      │  │                       │
│ Certificado de       │  │ Certificado de        │
│ finalización         │  │ finalización          │
│                      │  │                       │
│ Intro a              │  │ Python para           │
│ Microservicios       │  │ Análisis de Datos     │
│                      │  │                       │
│ TechCorp Latam       │  │ Univ. Innovación      │
│ Nota final: 88       │  │ Nota final: 92        │
│ 14 enero 2025        │  │ 20 febrero 2025       │
│                      │  │                       │
│ [Ver certificado]    │  │ [Ver certificado]     │
└──────────────────────┘  └──────────────────────┘
```

**Detalles:**
- Filtrar enrollments donde `completed === true`. En la data mock no hay ninguno completado, así que para que esta pantalla no esté vacía: **mostrar 2 certificados mock hardcodeados** en el componente (datos ficticios pero coherentes)
- Cards de certificados con diseño premium:
  - Fondo: degradado de `from-[#2D4A3E] to-[#1A3A2E]`
  - Borde dorado: `border border-[#C9A84C]/50`
  - Logo "Nexora." en blanco
  - Texto "Certificado de finalización" en `text-[#C9A84C]`
  - Nombre del curso en blanco, bold, grande
  - Org + nota + fecha en `text-white/70`
- Botón "Ver certificado": abre un modal con el certificado a pantalla casi completa
- **Modal del certificado:**
  ```
  ┌─────────────────────────────────────────────────────┐
  │  [X cerrar]                              [⬇ Descargar (mockup)]  │
  │                                                     │
  │  ┌───────────────────────────────────────────────┐  │
  │  │         Nexora.                               │  │
  │  │                                               │  │
  │  │    CERTIFICADO DE FINALIZACIÓN                │  │
  │  │                                               │  │
  │  │    Otorgado a:                                │  │
  │  │    María García                               │  │
  │  │                                               │  │
  │  │    Por completar satisfactoriamente:          │  │
  │  │    Introducción a la Arquitectura             │  │
  │  │    de Microservicios                          │  │
  │  │                                               │  │
  │  │    Nota final: 88/100                         │  │
  │  │    Enero 2025 — TechCorp Latam               │  │
  │  │                                               │  │
  │  │    [sello/firma decorativa]                   │  │
  │  └───────────────────────────────────────────────┘  │
  └─────────────────────────────────────────────────────┘
  ```
- Botón "Descargar" (mockup — solo UI, no descarga real)
- Si no hay certificados reales: mostrar solo los 2 mock hardcodeados (siempre)

---

## Checklist de entrega

### Funcionalidad
- [ ] Login de estudiante redirige a `/dashboard`
- [ ] Logout redirige a `/` y borra sesión
- [ ] Dashboard muestra widget del bloque activo correctamente
- [ ] Navegación StudentLayout: links activos, sidebar con curso activo
- [ ] CourseBlockMapPage muestra todos los estados de bloques correctamente
- [ ] BlockViewPage genera las unidades correctas desde el mock
- [ ] UnitPlayer muestra contenido diferente según tipo (video/material/ejercicio)
- [ ] Examen avanza pregunta por pregunta, calcula nota y navega a resultados
- [ ] ResultsPage lee grade desde location.state
- [ ] RetryPage muestra tiempo reducido correctamente
- [ ] Rutas protegidas redirigen a `/login` si no hay sesión
- [ ] Rutas de `/aprendizaje/*` NO muestran la Navbar flotante (usan LearningLayout)

### UI/UX
- [ ] CountdownTimer se actualiza cada minuto, muestra urgencia < 24h
- [ ] StudentLayout sidebar visible en desktop, simplificado en mobile
- [ ] LearningLayout panel izquierdo muestra estructura del curso
- [ ] GradeBadge verde/rojo según si aprobó
- [ ] ProgressBar correctamente proporcional
- [ ] Bloques bloqueados con opacidad reducida y sin botones de acción
- [ ] Bloque activo visualmente destacado (borde dorado, sombra)

### Diseño
- [ ] Paleta respetada en todos los componentes nuevos
- [ ] LearningLayout usa fondo oscuro `#1A1C14` correctamente
- [ ] Certificados con diseño premium (gradiente verde/oro)
- [ ] No hay emojis como íconos (solo Lucide)

### Código
- [ ] Sin errores de TypeScript
- [ ] `enrollments.ts` usa los slugs correctos de `courses.ts`
- [ ] `getUserEnrollments` y `getEnrollment` helpers usados correctamente
- [ ] `location.state` en BlockResultsPage tiene fallback si es undefined
