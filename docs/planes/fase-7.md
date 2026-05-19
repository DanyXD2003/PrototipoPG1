# Nexora — Plan de Implementación: Fase 7 — Panel de Administración

> **Agente implementador:** leer `CLAUDE.md` y `docs/design.md` antes de empezar.
> Este documento es autocontenido — contiene todo lo necesario para implementar la Fase 7 sin preguntar.

---

## Objetivo de la fase

Crear el panel de superadministrador de Nexora: métricas globales de la plataforma, gestión de usuarios y organizaciones, moderación de cursos, y reportes visuales. Es la fase final del mockup.

**Resultado esperado:**
- 1 layout nuevo: `AdminLayout` con sidebar oscuro
- 1 componente de ruta: `AdminRoute`
- 1 usuario admin en los mocks
- 5 páginas nuevas bajo `/admin/*`
- Mock data de administración en `src/data/adminData.ts`

---

## Orden de implementación

```
Paso 1 → Agregar tipos admin en src/types/index.ts
Paso 2 → Agregar usuario admin en src/data/mockUsers.ts
Paso 3 → Crear mock data: src/data/adminData.ts
Paso 4 → Crear AdminRoute: src/components/auth/AdminRoute.tsx
Paso 5 → Crear AdminLayout: src/components/layout/AdminLayout.tsx
Paso 6 → Actualizar Navbar para rol admin
Paso 7 → Actualizar router con rutas /admin/*
Paso 8 → Implementar páginas: 7.1 → 7.2 → 7.3 → 7.4 → 7.5
```

---

## Paso 1 — Nuevos tipos en `src/types/index.ts`

Agregar al final del archivo:

```ts
export type AdminUserStatus = 'active' | 'suspended'

export interface AdminUser {
  id: string
  name: string
  email: string
  role: UserRole | 'admin'
  status: AdminUserStatus
  registeredAt: string  // ISO date
  lastLoginAt: string   // ISO date
  coursesEnrolled?: number  // solo para students
}

export type OrgAdminStatus = 'verified' | 'pending' | 'suspended'

export interface AdminOrg {
  id: string
  name: string
  slug: string
  industry: string
  courseCount: number
  studentCount: number
  status: OrgAdminStatus
  registeredAt: string
  contactEmail: string
}

export type CourseAdminStatus = 'pending' | 'approved' | 'rejected'

export interface AdminCourse {
  id: string
  slug: string
  title: string
  orgName: string
  orgSlug: string
  category: string
  submittedAt: string
  status: CourseAdminStatus
  rejectionReason?: string
  blockCount: number
  price: number | null   // null = gratuito
}

export interface WeeklyGrowth {
  week: string       // ej: "Sem 1", "Sem 2"
  users: number
  enrollments: number
}

export interface ActivityItem {
  id: string
  type: 'user_registered' | 'course_published' | 'org_joined' | 'course_completed'
  text: string
  time: string       // ISO date
}
```

También **agregar `'admin'` al tipo `UserRole`** (línea existente en el archivo):
```ts
// Cambiar:
export type UserRole = 'student' | 'organization' | 'instructor'
// Por:
export type UserRole = 'student' | 'organization' | 'instructor' | 'admin'
```

---

## Paso 2 — Agregar usuario admin en `src/data/mockUsers.ts`

Agregar al array `mockUsers`:

```ts
{
  id: 'user-admin',
  name: 'Admin Nexora',
  email: 'admin@nexora.com',
  role: 'admin',
  bio: 'Administrador de la plataforma Nexora.',
},
```

> Las credenciales de demo quedan: `admin@nexora.com` / `password`

---

## Paso 3 — Mock data: `src/data/adminData.ts`

```ts
import type {
  AdminUser, AdminOrg, AdminCourse, WeeklyGrowth, ActivityItem
} from '../types'

// ─── Helpers ────────────────────────────────────────────────────────────────
const daysAgo = (n: number) =>
  new Date(Date.now() - n * 24 * 60 * 60 * 1000).toISOString()

// ─── Estadísticas globales ───────────────────────────────────────────────────
export const platformStats = {
  totalUsers: 12_847,
  newUsersThisWeek: 234,
  totalOrganizations: 38,
  totalCourses: 156,
  activeCourses: 142,
  totalEnrollments: 48_291,
  newEnrollmentsThisWeek: 1_203,
  completionRate: 67,         // porcentaje
  pendingCourses: 3,
}

// ─── Usuarios (tabla de gestión) ─────────────────────────────────────────────
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

// ─── Organizaciones (gestión + verificación) ─────────────────────────────────
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

// ─── Cursos pendientes de moderación ─────────────────────────────────────────
export const adminCourses: AdminCourse[] = [
  // Pendientes
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
  // Aprobados
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
  // Rechazados
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

// ─── Crecimiento semanal (para reportes) ─────────────────────────────────────
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

// ─── Actividad reciente (feed del dashboard) ──────────────────────────────────
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

// ─── Top cursos (para reportes) ───────────────────────────────────────────────
export const topCourses = [
  { title: 'Python para Análisis de Datos', org: 'UVG', enrollments: 8_420, completionRate: 71 },
  { title: 'Intro a la Arquitectura de Microservicios', org: 'TechCorp Latam', enrollments: 6_241, completionRate: 58 },
  { title: 'Diseño de Experiencias Digitales', org: 'Instituto Liderazgo GT', enrollments: 5_103, completionRate: 64 },
  { title: 'Machine Learning Aplicado a la Salud', org: 'UVG', enrollments: 4_872, completionRate: 55 },
  { title: 'Growth Hacking para Startups', org: 'Carlos Mendoza', enrollments: 3_994, completionRate: 79 },
]

// ─── Helpers ─────────────────────────────────────────────────────────────────
export function getAdminCoursesByStatus(status: AdminCourse['status']): AdminCourse[] {
  return adminCourses.filter(c => c.status === status)
}
```

---

## Paso 4 — `AdminRoute`: `src/components/auth/AdminRoute.tsx`

```tsx
import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/auth'

export default function AdminRoute({ children }: { children: React.ReactNode }) {
  const { isLoggedIn, user } = useAuth()
  if (!isLoggedIn || user?.role !== 'admin') return <Navigate to="/" replace />
  return <>{children}</>
}
```

---

## Paso 5 — `AdminLayout`: `src/components/layout/AdminLayout.tsx`

Layout con sidebar **oscuro** (`bg-[#1A1C14]`) para diferenciar visualmente el panel admin del resto de la app.

```
┌──────────────────────────────────────────────────────────────────┐
│  [Navbar flotante — igual que siempre]                           │
├──────────┬───────────────────────────────────────────────────────┤
│ NEXORA   │                                                       │
│ Admin    │         Contenido de la página                        │
│ ──────── │                                                       │
│ Dashboard│                                                       │
│ Usuarios │                                                       │
│ Orgs     │                                                       │
│ Cursos   │                                                       │
│ Reportes │                                                       │
└──────────┴───────────────────────────────────────────────────────┘
```

```tsx
import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, Users, Building2, BookOpen, BarChart3 } from 'lucide-react'
import Navbar from './Navbar'
import AdminRoute from '../auth/AdminRoute'

const navItems = [
  { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/usuarios', icon: Users, label: 'Usuarios' },
  { to: '/admin/organizaciones', icon: Building2, label: 'Organizaciones' },
  { to: '/admin/cursos', icon: BookOpen, label: 'Cursos' },
  { to: '/admin/reportes', icon: BarChart3, label: 'Reportes' },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation()
  const isActive = (to: string) =>
    location.pathname === to || location.pathname.startsWith(to + '/')

  return (
    <AdminRoute>
      <div>
        <Navbar />
        <div className="pt-20 flex min-h-screen">
          <aside className="w-64 shrink-0 bg-[#1A1C14] min-h-screen px-4 py-6 hidden md:block">
            <div className="text-xs font-semibold text-[#5C6355] uppercase tracking-wider mb-1 px-3">
              Nexora
            </div>
            <div className="text-xs font-semibold text-[#5C6355] uppercase tracking-wider mb-4 px-3">
              Administración
            </div>
            <nav className="space-y-1">
              {navItems.map(item => (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors cursor-pointer ${
                    isActive(item.to)
                      ? 'bg-[#2D4A3E] text-white font-medium'
                      : 'text-[#5C6355] hover:text-white hover:bg-[#2D4A3E]/40'
                  }`}
                >
                  <item.icon className="w-4 h-4 shrink-0" />
                  {item.label}
                </Link>
              ))}
            </nav>
          </aside>
          <main className="flex-1 bg-[#FAF7EF] min-h-screen p-6">
            {children}
          </main>
        </div>
      </div>
    </AdminRoute>
  )
}
```

---

## Paso 6 — Actualizar `Navbar.tsx`

Dos cambios menores:

**1. Dashboard link para admin:**
```tsx
// Cambiar la línea:
to={user.role === 'student' ? '/dashboard' : '/creator/dashboard'}
// Por:
to={
  user.role === 'student' ? '/dashboard'
  : user.role === 'admin' ? '/admin/dashboard'
  : '/creator/dashboard'
}
```
Actualizar en los dos lugares donde aparece (desktop dropdown y mobile menu).

**2. Ocultar el link "Mi perfil" para admin** (el admin no tiene perfil público):
```tsx
// En el dropdown del usuario, el Link "Mi perfil":
{user.role !== 'admin' && (
  <Link to={user.role === 'organization' ? '/org/configuracion' : '/perfil/editar'} ...>
    Mi perfil
  </Link>
)}
```
Hacer el mismo ajuste en el menú mobile.

---

## Paso 7 — Actualizar router: `src/router/index.tsx`

Agregar imports y rutas:

```tsx
// Imports:
import AdminLayout from '../components/layout/AdminLayout'
import AdminDashboardPage from '../pages/admin/AdminDashboardPage'
import AdminUsersPage from '../pages/admin/AdminUsersPage'
import AdminOrgsPage from '../pages/admin/AdminOrgsPage'
import AdminCoursesPage from '../pages/admin/AdminCoursesPage'
import AdminReportsPage from '../pages/admin/AdminReportsPage'

// Rutas (fuera de PublicLayout, al mismo nivel que las rutas creator/talent):
<Route path="/admin/dashboard" element={<AdminLayout><AdminDashboardPage /></AdminLayout>} />
<Route path="/admin/usuarios" element={<AdminLayout><AdminUsersPage /></AdminLayout>} />
<Route path="/admin/organizaciones" element={<AdminLayout><AdminOrgsPage /></AdminLayout>} />
<Route path="/admin/cursos" element={<AdminLayout><AdminCoursesPage /></AdminLayout>} />
<Route path="/admin/reportes" element={<AdminLayout><AdminReportsPage /></AdminLayout>} />
```

> ⚠️ El `AdminRoute` ya está integrado dentro del `AdminLayout`. No necesita `ProtectedRoute` adicional.

---

## Paso 8 — Páginas nuevas

---

### 7.1 Dashboard Admin — `/admin/dashboard`

**Archivo:** `src/pages/admin/AdminDashboardPage.tsx`

```
Admin Dashboard
──────────────────────────────────────────────────────────

┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│  12,847      │ │   38         │ │   156        │ │   67%        │
│  Usuarios    │ │  Orgs        │ │  Cursos      │ │  Completación│
│  +234 semana │ │  verificadas │ │  142 activos │ │  global      │
└──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘

Actividad reciente                     Accesos rápidos
──────────────────────────────         ──────────────────────
● Laura Velásquez se registró...       [Revisar 3 cursos pendientes →]
● TechCorp Latam envió curso...        [2 orgs pendientes de verificar →]
● Agencia Digital se unió...
● 47 estudiantes completaron...
  [ver más]
```

**Estado local:**
```ts
// No necesita estado — todo es de solo lectura
```

**Stat cards:**
- Usuarios: ícono `Users`, color `bg-blue-50 text-blue-700`, valor de `platformStats.totalUsers`
- Organizaciones: ícono `Building2`, color `bg-[#F2EDE1] text-[#2D4A3E]`, valor `platformStats.totalOrganizations`
- Cursos activos: ícono `BookOpen`, color `bg-purple-50 text-purple-700`, valor `platformStats.activeCourses`
- Completación: ícono `TrendingUp`, color `bg-green-50 text-green-700`, valor `platformStats.completionRate + '%'`

Cada stat card:
```
bg-white border border-[#E8E0D0] rounded-xl p-5
└── ícono (40px, en círculo de color)
└── número (2xl font-bold text-[#1A1C14])
└── etiqueta (text-sm text-[#5C6355])
└── subtítulo (text-xs text-[#5C6355]) — ej: "+234 esta semana"
```

**Actividad reciente:**
- Mostrar los 5 primeros de `recentActivity`
- Cada item: punto de color según tipo + texto + tiempo relativo
  - `user_registered` → punto azul
  - `course_published` → punto `#C9A84C`
  - `org_joined` → punto `#2D4A3E`
  - `course_completed` → punto verde
- Función `getRelativeTime()` igual que en `NotificationsPage`

**Accesos rápidos** (columna derecha, solo desktop):
- `<Link to="/admin/cursos">` — "Revisar 3 cursos pendientes" (solo si `platformStats.pendingCourses > 0`)
- `<Link to="/admin/organizaciones">` — "2 orgs pendientes de verificar" (si las hay)
- Estilos: `bg-[#F2EDE1] border border-[#E8E0D0] rounded-xl p-4 flex items-center justify-between`

---

### 7.2 Gestión de Usuarios — `/admin/usuarios`

**Archivo:** `src/pages/admin/AdminUsersPage.tsx`

```
Usuarios (10)          [🔍 Buscar usuario...]   [Filtro de rol ▾]

┌─────────────────────────────────────────────────────────────────┐
│  Nombre           │ Rol        │ Estado    │ Registrado │ Acc   │
├─────────────────────────────────────────────────────────────────┤
│  María García     │ Estudiante │ ● Activo  │ hace 4m    │  [⋮]  │
│  Carlos Mendoza   │ Instructor │ ● Activo  │ hace 6m    │  [⋮]  │
│  TechCorp Latam   │ Org        │ ● Activo  │ hace 1a    │  [⋮]  │
│  José Ramírez     │ Estudiante │ ○ Suspendido│ hace 3m  │  [⋮]  │
└─────────────────────────────────────────────────────────────────┘
```

**Estado local:**
```ts
const [users, setUsers] = useState<AdminUser[]>(adminUsers)
const [searchQuery, setSearchQuery] = useState('')
const [roleFilter, setRoleFilter] = useState<'all' | UserRole | 'admin'>('all')
const [openMenuId, setOpenMenuId] = useState<string | null>(null)
const [confirmModal, setConfirmModal] = useState<{ userId: string; action: 'suspend' | 'reactivate' } | null>(null)
```

**Filtrado:**
```ts
const filtered = users.filter(u => {
  const matchesSearch =
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  const matchesRole = roleFilter === 'all' || u.role === roleFilter
  return matchesSearch && matchesRole
})
```

**Detalles de la tabla:**
- Badge de rol: `Estudiante` (bg-blue-100 text-blue-700) / `Instructor` (bg-purple-100 text-purple-700) / `Organización` (bg-[#F2EDE1] text-[#2D4A3E]) / `Admin` (bg-[#1A1C14] text-white)
- Badge de estado: `● Activo` (text-green-600) / `○ Suspendido` (text-red-600)
- Columna "Registrado": fecha relativa (usar `getRelativeTime()`)
- Menú `⋮` (MoreVertical de Lucide) por fila — dropdown con opciones:
  - "Suspender" (si activo) → abre modal de confirmación
  - "Reactivar" (si suspendido) → abre modal de confirmación
  - "Ver perfil" → solo para students → `navigate('/perfil/' + username)` (no tenemos username en AdminUser, así que simplemente mostrar un toast "Perfil no disponible en demo")

**Modal de confirmación:**
```
¿Suspender a [nombre]?
Esta acción impedirá que el usuario inicie sesión.
[Cancelar] [Confirmar suspensión] ← rojo
```
Para reactivar:
```
¿Reactivar a [nombre]?
El usuario podrá volver a iniciar sesión.
[Cancelar] [Confirmar] ← verde (#2D4A3E)
```

Al confirmar: `setUsers(prev => prev.map(u => u.id === userId ? { ...u, status: newStatus } : u))` + toast.

**Filtro de rol** (select):
```tsx
<select value={roleFilter} onChange={...}>
  <option value="all">Todos los roles</option>
  <option value="student">Estudiante</option>
  <option value="organization">Organización</option>
  <option value="instructor">Instructor</option>
  <option value="admin">Admin</option>
</select>
```

---

### 7.3 Gestión de Organizaciones — `/admin/organizaciones`

**Archivo:** `src/pages/admin/AdminOrgsPage.tsx`

```
Organizaciones (6)       [🔍 Buscar...]   [Todas ▾]

┌──────────────────────────────────────────────────────────────────┐
│  TechCorp Latam     │ Tecnología  │ ✓ Verificada  │ 4c │ 3.2k │ [⋮]│
│  Universidad del    │ Educación   │ ✓ Verificada  │ 7c │ 5.1k │ [⋮]│
│  Finanzas GT Corp   │ Finanzas    │ ○ Suspendida  │ 2c │  890 │ [⋮]│
│  Agencia Digital    │ Marketing   │ ⏳ Pendiente  │ 0c │    0 │ [⋮]│
│  Salud Tech GT      │ Salud       │ ⏳ Pendiente  │ 0c │    0 │ [⋮]│
└──────────────────────────────────────────────────────────────────┘
```

**Estado local:**
```ts
const [orgs, setOrgs] = useState<AdminOrg[]>(adminOrgs)
const [searchQuery, setSearchQuery] = useState('')
const [statusFilter, setStatusFilter] = useState<'all' | OrgAdminStatus>('all')
const [openMenuId, setOpenMenuId] = useState<string | null>(null)
const [verifyModal, setVerifyModal] = useState<string | null>(null)   // orgId a verificar
const [rejectModal, setRejectModal] = useState<string | null>(null)   // orgId a rechazar
const [suspendModal, setSuspendModal] = useState<string | null>(null) // orgId a suspender
```

**Badges de estado:**
- `Verificada`: `bg-green-100 text-green-700` + `CheckCircle` ícono
- `Pendiente`: `bg-amber-100 text-amber-700` + `Clock` ícono
- `Suspendida`: `bg-red-100 text-red-700` + `XCircle` ícono

**Menú `⋮` por fila:**
- Si `pending`: "Verificar" + "Rechazar"
- Si `verified`: "Suspender"
- Si `suspended`: "Reactivar"

**Modal de verificar:**
```
¿Verificar a [nombre]?
La organización podrá publicar cursos y aparecerá con el badge de verificada.
[Cancelar]  [Verificar] ← bg-[#2D4A3E]
```
Al confirmar: `setOrgs(prev => prev.map(o => o.id === id ? { ...o, status: 'verified' } : o))` + toast "Organización verificada".

**Modal de rechazar/suspender:**
```
Motivo (opcional)
[_____________________________________________]
[Cancelar]  [Rechazar / Suspender] ← rojo
```
Al confirmar: cambiar status + toast.

---

### 7.4 Moderación de Cursos — `/admin/cursos`

**Archivo:** `src/pages/admin/AdminCoursesPage.tsx`

```
Moderación de cursos

[Pendientes (3)]  [Aprobados (2)]  [Rechazados (1)]

┌──────────────────────────────────────────────────────────────────────┐
│  Diseño UI/UX Avanzado con Figma                                     │
│  Agencia Digital Creativa · Diseño · 4 bloques · Q 299              │
│  Enviado hace 2 días                                                  │
│                         [Rechazar]  [Aprobar]                        │
├──────────────────────────────────────────────────────────────────────┤
│  IA Aplicada en el Sector Salud                                      │
│  Salud Tech Guatemala · Tecnología · 5 bloques · Q 450              │
│  Enviado hace 4 días                                                  │
│                         [Rechazar]  [Aprobar]                        │
└──────────────────────────────────────────────────────────────────────┘
```

**Estado local:**
```ts
const [courses, setCourses] = useState<AdminCourse[]>(adminCourses)
const [activeTab, setActiveTab] = useState<CourseAdminStatus>('pending')
const [rejectModal, setRejectModal] = useState<string | null>(null) // courseId
const [rejectReason, setRejectReason] = useState('')
```

**Detalles de las cards (tab Pendientes):**
- Título bold `text-[#1A1C14]`
- Org · Categoría · X bloques · precio (Q X o "Gratuito")
- Fecha de envío relativa
- Dos botones alineados a la derecha:
  - "Rechazar" → abre modal con textarea para motivo
  - "Aprobar" → confirma directamente (sin modal — acción positiva)

**Modal de rechazo:**
```
Motivo del rechazo *
[________________________________________________]
[________________________________________________]
Por favor describe por qué el curso no cumple los estándares.

[Cancelar]  [Confirmar rechazo] ← rojo
```
Al aprobar: `setCourses(prev => prev.map(c => c.id === id ? { ...c, status: 'approved' } : c))` + toast "Curso aprobado".
Al rechazar: status → `'rejected'`, guardar `rejectReason` + toast "Curso rechazado".

**Tab Aprobados:**
- Tarjeta más simple (sin botones de acción) — solo info + badge verde "Aprobado"

**Tab Rechazados:**
- Info + badge rojo "Rechazado" + motivo del rechazo en un cuadro gris claro:
```
Motivo: "[rejectionReason]"
```

**Estado vacío de cada tab:**
```tsx
<EmptyState icon={CheckCircle} title="No hay cursos pendientes" size="sm" />
<EmptyState icon={BookOpen} title="No hay cursos aprobados aún" size="sm" />
<EmptyState icon={XCircle} title="No hay cursos rechazados" size="sm" />
```

---

### 7.5 Reportes Globales — `/admin/reportes`

**Archivo:** `src/pages/admin/AdminReportsPage.tsx`

```
Reportes globales

Crecimiento semanal                            Top 5 cursos más populares
──────────────────────────────────             ──────────────────────────────────────
  Usuarios    Inscripciones                    Python para Análisis...  8,420  71%
  ████ ████   ████ ████ ████ ████             Intro Microservicios...  6,241  58%
  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓           Diseño Exp Digitales... 5,103  64%
  Sem1 Sem2 Sem3 Sem4 Sem5 Sem6 Sem7 Sem8     Machine Learning...      4,872  55%
                                              Growth Hacking...         3,994  79%

Resumen de plataforma
─────────────────────────────────────────────────────────
Total inscritos: 48,291   ·   Tasa de completación: 67%
Cursos activos: 142       ·   Nuevos inscritos esta semana: 1,203
```

**Gráfico de barras — Crecimiento semanal:**

Usar el mismo enfoque CSS que `CourseAnalyticsPage` — barras proporcionales con `style={{ height: '...' }}`:

```tsx
const maxUsers = Math.max(...weeklyGrowth.map(w => w.users))
const maxEnrollments = Math.max(...weeklyGrowth.map(w => w.enrollments))

// Dos grupos de barras por semana — users en verde, enrollments en dorado
// Altura máxima: h-32 (128px)
// Altura de cada barra: (valor / max) * 100 + '%'

{weeklyGrowth.map(week => (
  <div key={week.week} className="flex flex-col items-center gap-1">
    <div className="flex items-end gap-1 h-32">
      {/* Barra usuarios */}
      <div
        className="w-4 bg-[#2D4A3E] rounded-t"
        style={{ height: `${(week.users / maxUsers) * 100}%` }}
        title={`${week.users} usuarios`}
      />
      {/* Barra inscripciones */}
      <div
        className="w-4 bg-[#C9A84C] rounded-t"
        style={{ height: `${(week.enrollments / maxEnrollments) * 100}%` }}
        title={`${week.enrollments} inscritos`}
      />
    </div>
    <span className="text-xs text-[#5C6355]">{week.week}</span>
  </div>
))}

// Leyenda:
// ■ Usuarios nuevos (verde)   ■ Inscripciones (dorado)
```

**Top 5 cursos:**

Tabla simple con barra de popularidad:
```tsx
{topCourses.map((course, index) => (
  <div key={course.title} className="flex items-center gap-4 py-3 border-b border-[#E8E0D0]">
    <span className="text-sm font-bold text-[#5C6355] w-4">{index + 1}</span>
    <div className="flex-1">
      <p className="text-sm font-medium text-[#1A1C14] truncate">{course.title}</p>
      <p className="text-xs text-[#5C6355]">{course.org}</p>
    </div>
    <span className="text-sm text-[#5C6355]">{course.enrollments.toLocaleString()}</span>
    {/* Barra de completación */}
    <div className="w-24">
      <div className="flex items-center gap-1">
        <div className="flex-1 h-1.5 bg-[#E8E0D0] rounded-full">
          <div
            className="h-1.5 bg-[#2D4A3E] rounded-full"
            style={{ width: `${course.completionRate}%` }}
          />
        </div>
        <span className="text-xs text-[#5C6355] w-8">{course.completionRate}%</span>
      </div>
    </div>
  </div>
))}
```

**Resumen de plataforma:**

Card simple con stats en grid 2x2:
```
bg-white border border-[#E8E0D0] rounded-xl p-6 mt-6
grid grid-cols-2 md:grid-cols-4 gap-6
```
Cada stat: número grande + etiqueta muted.

---

## Checklist de entrega

### Funcionalidad
- [ ] Login con `admin@nexora.com` / `password` redirige a `/admin/dashboard`
- [ ] Usuario no-admin que intenta entrar a `/admin/*` es redirigido a `/`
- [ ] Suspender usuario cambia badge de "Activo" a "Suspendido" con toast
- [ ] Reactivar usuario cambia badge de "Suspendido" a "Activo" con toast
- [ ] Verificar organización cambia status de "Pendiente" a "Verificada" con toast
- [ ] Rechazar organización cambia status con toast
- [ ] Aprobar curso cambia tab de "Pendientes" a "Aprobados"
- [ ] Rechazar curso muestra modal con textarea + guarda motivo en "Rechazados"
- [ ] Buscadores de usuarios y orgs filtran en tiempo real
- [ ] Filtros de rol (usuarios) y estado (orgs) funcionan

### UI/UX
- [ ] Sidebar oscuro (`bg-[#1A1C14]`) diferenciado del resto de la app
- [ ] Link activo en sidebar: `bg-[#2D4A3E] text-white`
- [ ] Stat cards del dashboard con íconos en círculos de color
- [ ] Actividad reciente con puntos de color según tipo
- [ ] Gráfico de barras con dos series (verde + dorado)
- [ ] Barras del top 5 muestran % de completación
- [ ] "Mi perfil" oculto en el dropdown del Navbar para rol admin

### Diseño
- [ ] Paleta respetada — no se introduce ningún color fuera de `docs/design.md`
- [ ] Tablas con `border-b border-[#E8E0D0]` en cada fila, hover `hover:bg-[#F2EDE1]`
- [ ] Modales con overlay `bg-black/50`, card `bg-white rounded-xl p-6 max-w-sm`
- [ ] Badges de rol y estado con colores semánticos

### Código
- [ ] Sin errores de TypeScript
- [ ] `AdminRoute` protege el layout — no puede accederse sin rol `admin`
- [ ] `UserRole` actualizado para incluir `'admin'`
- [ ] `adminData.ts` exporta todo lo que usan las páginas
- [ ] Navbar actualizado para rol admin (dashboard link + ocultar "Mi perfil")
- [ ] Router con las 5 rutas `/admin/*` independientes (sin PublicLayout)
