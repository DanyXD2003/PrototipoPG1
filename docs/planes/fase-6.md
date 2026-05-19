# Nexora — Plan de Implementación: Fase 6 — Detalles y Polish

> **Agente implementador:** leer `CLAUDE.md` y `docs/design.md` antes de empezar.
> Este documento es autocontenido — contiene todo lo necesario para implementar la Fase 6 sin preguntar.

---

## Objetivo de la fase

Completar la experiencia con las pantallas de soporte (notificaciones, configuración), mejorar páginas existentes con funcionalidades pendientes de `docs/mejoras.md`, y agregar el componente de estado vacío reutilizable que estandariza los empty states de toda la app.

**Resultado esperado:**
- 4 pantallas nuevas (notificaciones + 3 secciones de configuración)
- 5 mejoras a páginas existentes
- 2 componentes nuevos reutilizables (`EmptyState`, `SettingsTabs`)
- Bell de notificaciones en el `Navbar`

---

## Orden de implementación

```
Paso 1 → Agregar nuevos tipos en src/types/index.ts
Paso 2 → Agregar enrollment completado en src/data/enrollments.ts
Paso 3 → Crear mock data de notificaciones: src/data/notificationsData.ts
Paso 4 → Crear componente EmptyState (src/components/ui/EmptyState.tsx)
Paso 5 → Crear componente SettingsTabs (src/components/ui/SettingsTabs.tsx)
Paso 6 → Actualizar Navbar: agregar campana de notificaciones
Paso 7 → Actualizar router con rutas nuevas
Paso 8 → Implementar páginas nuevas: 6.1 → 6.2 → 6.3 → 6.4 → polish 404
Paso 9 → Mejoras a páginas existentes: MyCoursesPage → OrgCatalogPage → InstructorsCatalogPage → CourseDetailPage
```

---

## Paso 1 — Nuevos tipos en `src/types/index.ts`

Agregar al final del archivo:

```ts
export type NotificationType =
  | 'block_active'       // un bloque se activó (el creador lo abrió)
  | 'block_expiring'     // un bloque activo vence en < 24 horas
  | 'block_graded'       // el examen fue calificado
  | 'course_completed'   // el estudiante completó el curso
  | 'talent_match'       // un candidato coincide con una búsqueda guardada (org)
  | 'new_enrollment'     // un estudiante se inscribió a tu curso (creador)

export interface AppNotification {
  id: string
  type: NotificationType
  title: string
  message: string
  createdAt: string     // ISO date
  read: boolean
  link?: string         // URL a la que navegar al hacer click
}

export interface NotificationPreferences {
  // En plataforma
  platform_block_active: boolean
  platform_block_expiring: boolean
  platform_block_graded: boolean
  platform_course_completed: boolean
  platform_talent_match: boolean
  platform_new_enrollment: boolean
  // Email
  email_block_expiring: boolean
  email_course_completed: boolean
  email_talent_match: boolean
  email_newsletter: boolean
}

export interface CourseVisibility {
  courseId: string
  isPublic: boolean
}
```

---

## Paso 2 — Agregar enrollment completado en `src/data/enrollments.ts`

El tab "Completados" en `MyCoursesPage` requiere al menos un enrollment con `completed: true`. Agregar el siguiente enrollment al array `enrollments` (después del tercer elemento):

```ts
// Al inicio del archivo, junto a los otros imports de curso:
const coursePY = courses.find(c => c.slug === 'python-analisis-datos')!

// En el array enrollments:
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
```

---

## Paso 3 — Mock data de notificaciones: `src/data/notificationsData.ts`

```ts
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

// Helper: contar no leídas
export function getUnreadCount(): number {
  return notificationsMock.filter(n => !n.read).length
}

// Ícono y color por tipo de notificación (para usar en el componente)
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
```

---

## Paso 4 — `EmptyState`: `src/components/ui/EmptyState.tsx`

Componente reutilizable para estados vacíos en toda la app. Reemplaza los empty states inline que cada página tiene hardcodeado.

Props:
```ts
interface EmptyStateProps {
  icon: React.ElementType   // componente Lucide (ej: BookOpen)
  title: string
  description?: string
  actionLabel?: string
  onAction?: () => void
  actionHref?: string       // si se especifica, el botón es un <Link>
  size?: 'sm' | 'md' | 'lg'
}
```

**Diseño (size="md", el default):**
```
          [ícono 48px — color #E8E0D0]

    Aún no estás inscrito en ningún curso

  Explora nuestro catálogo y encuentra
  el curso ideal para ti.

  [  Explorar cursos  ]  ← botón dorado (si hay action)
```

- Centrado con `text-center py-12`
- Ícono: `text-[#E8E0D0]` en `size="md"`, tamaño 48px
- Título: `text-lg font-semibold text-[#1A1C14]`
- Descripción: `text-sm text-[#5C6355] max-w-sm mx-auto mt-2`
- Botón (si `actionLabel`): `<Button variant="primary">` si hay `onAction`, `<Button variant="primary" href={actionHref}>` si hay `actionHref`
- `size="sm"`: ícono 36px, py-8, textos más pequeños
- `size="lg"`: ícono 64px, py-16, título más grande

---

## Paso 5 — `SettingsTabs`: `src/components/ui/SettingsTabs.tsx`

Navegación horizontal compartida por todas las páginas de configuración.

```
Configuración
──────────────────────────────────────────────────────────
[Mi cuenta]  [Seguridad]  [Notificaciones]
```

Props: `activeTab: 'cuenta' | 'seguridad' | 'notificaciones'`

**Detalles:**
- Header: "Configuración" `text-2xl font-bold text-[#1A1C14] mb-6`
- Tabs como links de React Router (`<Link to="/configuracion/...">`)
- Tab activo: `border-b-2 border-[#2D4A3E] text-[#2D4A3E] font-medium pb-3`
- Tab inactivo: `text-[#5C6355] hover:text-[#2D4A3E] pb-3 transition-colors`
- Separador horizontal debajo de los tabs: `border-b border-[#E8E0D0]`
- `mb-8` después del componente

---

## Paso 6 — Actualizar `Navbar.tsx`

Agregar ícono de campana de notificaciones entre los links de navegación y el avatar del usuario. **Solo visible cuando el usuario está logueado.**

```
Nexora.   [Explorar] [Orgs] [Instructores]      [🔔 3] [avatar ▾]
```

**Implementación:**
```tsx
import { Bell } from 'lucide-react'
import { getUnreadCount } from '../../data/notificationsData'

// Dentro del bloque {isLoggedIn && user}:
<Link
  to="/notificaciones"
  className="relative p-2 text-[#5C6355] hover:text-[#2D4A3E] transition-colors cursor-pointer"
>
  <Bell className="w-5 h-5" />
  {getUnreadCount() > 0 && (
    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
      {getUnreadCount()}
    </span>
  )}
</Link>
```

Colocar el bell **antes** del `div` del avatar, dentro del `hidden md:flex items-center gap-3`.

En mobile: agregar el bell en el menú hamburguesa también, como link a `/notificaciones`.

---

## Paso 7 — Actualizar router: `src/router/index.tsx`

Agregar las rutas nuevas dentro del bloque `<Route element={<PublicLayout />}>`. Todas son rutas protegidas.

```tsx
// Imports:
import NotificationsPage from '../pages/notifications/NotificationsPage'
import SettingsAccountPage from '../pages/settings/SettingsAccountPage'
import SettingsSecurityPage from '../pages/settings/SettingsSecurityPage'
import SettingsNotificationsPage from '../pages/settings/SettingsNotificationsPage'

// Rutas (dentro de PublicLayout):
<Route path="/notificaciones" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />
<Route path="/configuracion" element={<ProtectedRoute><SettingsAccountPage /></ProtectedRoute>} />
<Route path="/configuracion/seguridad" element={<ProtectedRoute><SettingsSecurityPage /></ProtectedRoute>} />
<Route path="/configuracion/notificaciones" element={<ProtectedRoute><SettingsNotificationsPage /></ProtectedRoute>} />
```

> ⚠️ Agregar estas rutas **antes** de `<Route path="*" element={<NotFoundPage />} />` para que no sean capturadas por el 404.

También actualizar el dropdown del usuario en `Navbar.tsx` para agregar el link a configuración:
```tsx
// En el dropdown del usuario, antes de "Cerrar sesión":
<Link
  to="/configuracion"
  onClick={() => setUserMenuOpen(false)}
  className="flex items-center gap-3 px-4 py-3 text-[#1A1C14] hover:bg-[#F2EDE1] cursor-pointer transition-colors"
>
  <Settings className="w-4 h-4 text-[#5C6355]" />
  Configuración
</Link>
```
Importar `Settings` de lucide-react.

---

## Paso 8 — Páginas nuevas

### 6.1 Centro de Notificaciones — `/notificaciones`

**Archivo:** `src/pages/notifications/NotificationsPage.tsx`

```
Notificaciones              [✓ Marcar todas como leídas]

[Todas (8)]  [No leídas (3)]

┌──────────────────────────────────────────────────────────────┐
│  [●]  [🔔]  ¡Tu bloque vence pronto!               hace 2h  │
│             El Bloque 2 de "Intro a Microservicios"...      │
├──────────────────────────────────────────────────────────────┤
│  [●]  [▶]   Nuevo bloque disponible                hace 18h  │
│             El Bloque 3 de "Diseño de Experiencias"...      │
├──────────────────────────────────────────────────────────────┤
│       [📋]  Examen calificado                      hace 2d   │
│             Obtuviste 88/100 en el Bloque 1...              │
└──────────────────────────────────────────────────────────────┘
```

**Estado local:**
```ts
const [notifications, setNotifications] = useState<AppNotification[]>(notificationsMock)
const [filter, setFilter] = useState<'all' | 'unread'>('all')
```

**Detalles:**
- Header con título + botón "Marcar todas como leídas":
  - Al hacer click: setear `read: true` en todas las notificaciones del estado local
  - Solo visible si hay notificaciones no leídas
- Tabs: "Todas (N)" / "No leídas (N)"
- Lista de notificaciones ordenada por `createdAt` descendente
- **Fila de notificación:**
  - Punto azul `●` (`w-2 h-2 rounded-full bg-blue-500`) si `!read`, espacio vacío si leída
  - Ícono por tipo: según `getNotificationMeta(type).icon` — usar Lucide dinámicamente
    > Como Lucide no se puede hacer dinámico fácilmente, crear un objeto de mapeo:
    ```ts
    import { PlayCircle, AlertCircle, ClipboardList, Award, UserCheck, Users } from 'lucide-react'
    const NOTIFICATION_ICONS = { block_active: PlayCircle, block_expiring: AlertCircle, block_graded: ClipboardList, course_completed: Award, talent_match: UserCheck, new_enrollment: Users }
    ```
  - Ícono en círculo con el color correspondiente de `getNotificationMeta`
  - Título bold, mensaje en muted truncado a 2 líneas
  - Tiempo relativo a la derecha (usar la función `getRelativeTime` ya existente en otras páginas o crear helper)
  - Fondo: `bg-[#F2EDE1]/50` si no leída, `bg-white` si leída
  - Hover: `hover:bg-[#F2EDE1] cursor-pointer`
  - Al hacer click: marcar como leída + navegar a `notification.link` si existe
- Si no hay notificaciones: `<EmptyState icon={Bell} title="No tienes notificaciones" description="Aquí aparecerán las actualizaciones de tus cursos y actividad." />`
- Estado vacío del filtro "No leídas": `<EmptyState icon={CheckCircle} title="Todo al día" description="No tienes notificaciones sin leer." size="sm" />`

---

### 6.2 Configuración — Mi cuenta — `/configuracion`

**Archivo:** `src/pages/settings/SettingsAccountPage.tsx`

```
[SettingsTabs activeTab="cuenta"]

Mi cuenta
─────────────────────────────────────────────────────────

Correo electrónico
user@ejemplo.com    [no editable — gris]

Nombre para mostrar
[___________________]

Idioma de la plataforma
[▾ Español (Guatemala) ]

Zona horaria
[▾ America/Guatemala (UTC-6) ]

[  Guardar cambios  ]

─────────────────────────────────────────────────────────
Zona de peligro

[  Eliminar mi cuenta  ]   ← botón outline rojo
```

**Detalles:**
- `<SettingsTabs activeTab="cuenta" />` en el tope
- Email: mostrar del `user.email` del AuthContext, no editable. Renderizar como `<div>` estilizado (NO usar `<Input>`):
  ```tsx
  <div>
    <label className="block text-sm font-medium text-[#1A1C14] mb-2">Correo electrónico</label>
    <div className="w-full px-4 py-3 rounded-lg border border-[#E8E0D0] bg-[#F2EDE1] text-[#5C6355]">
      {user?.email}
    </div>
    <p className="mt-1 text-xs text-[#5C6355]">El correo no puede modificarse.</p>
  </div>
  ```
- Nombre: precargar con `user.name`, editable. Al guardar: usar `login({ ...user!, name: newName })` para actualizar en AuthContext y localStorage + toast "✓ Cambios guardados"
- Idioma: select con opciones: "Español (Guatemala)", "Español (España)", "English". Solo UI — sin funcionalidad real.
- Zona horaria: select con opciones de LATAM. Solo UI.
- "Eliminar mi cuenta": botón outline rojo que muestra un modal de confirmación:
  ```
  ¿Seguro que quieres eliminar tu cuenta?
  Esta acción no se puede deshacer.
  [Cancelar]  [Sí, eliminar]  ← rojo
  ```
  Al confirmar: llamar `logout()` + redirigir a `/` + toast "Cuenta eliminada" (en este orden).
- Precargar campos con datos del `user` del AuthContext

---

### 6.3 Seguridad — `/configuracion/seguridad`

**Archivo:** `src/pages/settings/SettingsSecurityPage.tsx`

```
[SettingsTabs activeTab="seguridad"]

Cambiar contraseña
─────────────────────────────────────────────────────────
Contraseña actual *
[_________________] [👁]

Nueva contraseña *
[_________________] [👁]
Mínimo 8 caracteres

Confirmar nueva contraseña *
[_________________] [👁]

[  Actualizar contraseña  ]

─────────────────────────────────────────────────────────
Autenticación de dos factores (2FA)

○ Desactivado

[Activar 2FA]  ← muestra modal informativo (mockup)

─────────────────────────────────────────────────────────
Sesiones activas

┌────────────────────────────────────────────────────────┐
│ 🖥 Chrome · Windows        Esta sesión   Activo ahora  │
├────────────────────────────────────────────────────────┤
│ 📱 Safari · iPhone         hace 2 días   Guatemala     │
│                            [Cerrar sesión]             │
└────────────────────────────────────────────────────────┘
```

**Detalles:**
- Usar `<Input showToggle>` para los campos de contraseña
- Validación al submit:
  - Contraseña actual: si es `"password"` → ok (mockup), si no → error "Contraseña actual incorrecta"
  - Nueva contraseña: mínimo 8 caracteres
  - Confirmación: debe coincidir con nueva
- Al éxito: 600ms loading + toast "✓ Contraseña actualizada"
- Sección 2FA: toggle decorativo (no funcional). Al hacer click en "Activar 2FA": modal informativo:
  ```
  Autenticación de dos factores
  La autenticación de dos factores agrega una capa extra de seguridad.
  Esta funcionalidad estará disponible próximamente.
  [Entendido]
  ```
- Sesiones activas: 2 sesiones hardcodeadas. "Cerrar sesión" en la segunda muestra toast "Sesión cerrada".
- Íconos de dispositivo: `Monitor` (desktop), `Smartphone` (mobile) de Lucide

---

### 6.4 Preferencias de Notificaciones — `/configuracion/notificaciones`

**Archivo:** `src/pages/settings/SettingsNotificationsPage.tsx`

```
[SettingsTabs activeTab="notificaciones"]

Preferencias de notificaciones
Controla qué notificaciones recibes y cómo.

En plataforma                           Por email
─────────────────────────────────────────────────────────

Aprendizaje
Bloque activado          [toggle ●]    [toggle ●]
Bloque próximo a vencer  [toggle ●]    [toggle ●]
Examen calificado        [toggle ●]    [toggle ○]

Reclutamiento  ← solo si role=organization
Nuevo candidato          [toggle ●]    [toggle ○]
coincide tu búsqueda

General
Newsletter y novedades   —             [toggle ○]

[  Guardar preferencias  ]
```

**Estado local:**
```ts
const [prefs, setPrefs] = useState<NotificationPreferences>({
  platform_block_active: true,
  platform_block_expiring: true,
  platform_block_graded: true,
  platform_course_completed: true,
  platform_talent_match: true,
  platform_new_enrollment: true,
  email_block_expiring: true,
  email_course_completed: true,
  email_talent_match: false,
  email_newsletter: false,
})
```

**Detalles:**
- Implementar toggle visual: `<div>` con `rounded-full` que cambia entre `bg-[#2D4A3E]` (activo) y `bg-[#E8E0D0]` (inactivo). El "thumb" es un círculo blanco que se desplaza con `translate-x`.
- Sección "Reclutamiento" solo visible si `user?.role === 'organization'`
- Guardar: 600ms loading + toast "✓ Preferencias guardadas"

**Toggle Component (inline o extraído):**
```tsx
function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      className={`w-11 h-6 rounded-full transition-colors duration-200 cursor-pointer ${
        checked ? 'bg-[#2D4A3E]' : 'bg-[#E8E0D0]'
      }`}
    >
      <span className={`block w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 mx-1 ${
        checked ? 'translate-x-5' : 'translate-x-0'
      }`} />
    </button>
  )
}
```

---

### 6.5 Polish — Página 404

**Archivo:** `src/pages/public/NotFoundPage.tsx` (ya existe — solo mejorar)

La 404 actual es funcional. Verificar que usa Lucide `FileSearch` y el botón dorado funciona. No requiere cambios si ya cumple el plan de Fase 1. Solo revisar visualmente.

---

## Paso 9 — Mejoras a páginas existentes

### 8.1 Visibilidad de cursos completados — `MyCoursesPage`

**Archivo:** `src/pages/student/MyCoursesPage.tsx`

En el tab "Completados", agregar a cada tarjeta de curso un toggle de visibilidad:

```
┌──────────────────────────────────────────────────────────────────┐
│ [portada] Python para Análisis de Datos              Completado │
│           Universidad de la Innovación               Nota: 92   │
│           ████████████████  100%                               │
│                                                                 │
│           Visibilidad en tu perfil:  [👁 Público] ↔ [🔒 Privado] │
└──────────────────────────────────────────────────────────────────┘
```

**Implementación:**
```ts
// Estado local en MyCoursesPage:
const [visibility, setVisibility] = useState<Record<string, boolean>>({
  'course-1': true,   // público por defecto
  'course-2': false,  // privado
})

const toggleVisibility = (courseId: string) => {
  setVisibility(prev => ({ ...prev, [courseId]: !prev[courseId] }))
}
```

**Toggle de visibilidad:**
- Dos botones pill como un grupo:
  ```
  [👁 Público]  [🔒 Privado]
  ```
  - El activo: `bg-[#2D4A3E] text-white`
  - El inactivo: `bg-[#F2EDE1] text-[#5C6355]`
  - Íconos: `Eye` y `Lock` de Lucide (NO emojis)
  - Al cambiar: toast "Curso ahora {público/privado} en tu perfil"
- Solo visible en el tab "Completados" — no en "En progreso"
- Los enrollments mock completados son los que vienen con `completed: true`. Si ninguno tiene `completed: true` en los datos mock, mostrar los 2 cursos hardcodeados de `MyCertificatesPage` también en el tab Completados.

---

### 8.2 Buscador en catálogo de organizaciones — `OrgCatalogPage`

**Archivo:** `src/pages/public/OrgCatalogPage.tsx`

Agregar barra de búsqueda en el header de la página que filtra organizaciones por nombre en tiempo real.

```
Organizaciones                  [🔍 Buscar organización...]

┌──────┐ ┌──────┐ ┌──────┐
│ card │ │ card │ │ card │
└──────┘ └──────┘ └──────┘
```

**Implementación:**
```ts
const [searchQuery, setSearchQuery] = useState('')

// Filtrar orgs:
const filteredOrgs = organizations.filter(org =>
  org.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
  org.industry.toLowerCase().includes(searchQuery.toLowerCase())
)
```

- Input con ícono `Search` (Lucide), igual al de otras páginas del catálogo
- Filtra por nombre e industria (case-insensitive)
- Si sin resultados: `<EmptyState icon={Search} title="Sin resultados" description={`No encontramos organizaciones para "${searchQuery}"`} />`
- El buscador va en el header, a la derecha del título (igual que en `CourseCatalogPage`)

---

### 8.3 Buscador en catálogo de instructores — `InstructorsCatalogPage`

**Archivo:** `src/pages/public/InstructorsCatalogPage.tsx`

Mismo patrón que el buscador de orgs:

```ts
const [searchQuery, setSearchQuery] = useState('')

const filteredInstructors = instructors.filter(inst =>
  inst.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
  inst.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
  inst.expertise.some(e => e.toLowerCase().includes(searchQuery.toLowerCase()))
)
```

- Filtra por nombre, título y áreas de expertise
- Si sin resultados: `<EmptyState icon={Search} title="Sin resultados" description={`No encontramos instructores para "${searchQuery}"`} />`

---

### 8.4 Punto de entrada al talento desde el curso — `CourseDetailPage`

**Archivo:** `src/pages/public/CourseDetailPage.tsx`

Agregar al final de la columna izquierda (después de "Para quién es este curso"), **solo si `user?.role === 'organization'`**:

```
┌──────────────────────────────────────────────────────┐
│  🏢 ¿Buscas candidatos que completaron este curso?   │
│                                                      │
│  Filtra directamente en el mercado de talento.       │
│                                                      │
│  [  Buscar candidatos →  ]  (botón outline verde)    │
└──────────────────────────────────────────────────────┘
```

**Implementación:**
```tsx
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/auth'
import type { TalentFilters } from '../../types'

// Dentro del componente, después del bloque "Para quién es":
const { user } = useAuth()
const navigate = useNavigate()

const handleSearchTalent = () => {
  const filters: TalentFilters = {
    courseSlug: course.slug,
    minGrade: 70,
    completedAfter: '',
    availability: 'all',
  }
  navigate('/talent/buscar', { state: { filters } })
}

// JSX (solo si user?.role === 'organization'):
{user?.role === 'organization' && (
  <section className="mt-8 p-5 bg-[#F2EDE1] border border-[#E8E0D0] rounded-xl">
    <h3 className="font-semibold text-[#1A1C14] mb-2">¿Buscas candidatos?</h3>
    <p className="text-sm text-[#5C6355] mb-4">
      Filtra directamente quiénes completaron este curso en el mercado de talento.
    </p>
    <button
      onClick={handleSearchTalent}
      className="text-sm text-[#2D4A3E] border border-[#2D4A3E] px-4 py-2 rounded-lg hover:bg-[#2D4A3E] hover:text-white transition-colors cursor-pointer"
    >
      Buscar candidatos →
    </button>
  </section>
)}
```

---

## Componentes adicionales a verificar

### Revisar y reemplazar empty states inline

Las siguientes páginas tienen empty states escritos inline. **No es obligatorio reemplazarlos todos** — solo si el implementador lo encuentra conveniente. `<EmptyState>` es para uso futuro principalmente:

- `StudentDashboardPage` — "Aún no estás inscrito"
- `TalentSearchPage` — "No encontramos candidatos"
- `SavedCandidatesPage` — "No has guardado candidatos"
- `SavedSearchesPage` — "No tienes búsquedas guardadas"
- `CourseBlocksPage` — (si el creador no tiene bloques)

**Si se reemplazan, usar `<EmptyState>` con el ícono y texto correspondiente.**

---

## Checklist de entrega

### Funcionalidad
- [ ] Campana en Navbar muestra count de no leídas (3)
- [ ] Click en notificación: marca como leída + navega al link
- [ ] "Marcar todas como leídas" actualiza todas las notificaciones
- [ ] Configuración: guardar nombre actualiza el AuthContext
- [ ] Configuración seguridad: cambio de contraseña valida "password" como contraseña actual
- [ ] 2FA muestra modal informativo al activar
- [ ] Toggles de notificaciones guardan estado local y muestran toast
- [ ] Toggle de visibilidad en MyCoursesPage cambia entre Público/Privado con toast
- [ ] Buscador de orgs filtra en tiempo real
- [ ] Buscador de instructores filtra por nombre, título y expertise
- [ ] "Buscar candidatos" en CourseDetailPage solo visible para org, navega con filtros pre-aplicados

### UI/UX
- [ ] Punto azul en notificaciones no leídas
- [ ] Empty state en `/notificaciones` si no hay ninguna
- [ ] Empty state en "No leídas" si están todas leídas
- [ ] Toggle de preferencias con animación CSS (translate-x)
- [ ] SettingsTabs muestra tab activo correctamente en las 3 páginas
- [ ] Sesiones activas muestran íconos correctos (Monitor / Smartphone)
- [ ] Toggle Público/Privado usa íconos Lucide (Eye / Lock), no emojis

### Diseño
- [ ] Paleta respetada en todos los componentes nuevos
- [ ] `EmptyState` visualmente consistente con el resto de la app
- [ ] Toggle de notificaciones verde `#2D4A3E` cuando activo
- [ ] Notificaciones no leídas con fondo `bg-[#F2EDE1]/50` diferenciado

### Código
- [ ] Sin errores de TypeScript
- [ ] `getUnreadCount()` importado desde `notificationsData.ts` — no hardcodeado en Navbar
- [ ] Rutas de configuración dentro del grupo `PublicLayout`
- [ ] `<EmptyState>` usa Lucide components como prop, no strings
- [ ] Toggle component auto-contenido (inline en SettingsNotificationsPage o extraído a `ui/Toggle.tsx`)
