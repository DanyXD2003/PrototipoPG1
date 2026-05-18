# Nexora — Plan de Implementación: Fase 2 — Identidad y Acceso

> **Agente implementador:** leer `CLAUDE.md` y `docs/design.md` antes de empezar.
> Este documento es autocontenido — contiene todo lo necesario para implementar la Fase 2 sin preguntar.

---

## Objetivo de la fase

Construir los flujos de autenticación y configuración de perfil: login, registro por rol, onboarding y edición de datos personales. **Sin backend** — todo es simulado con un contexto de React y localStorage.

**Resultado esperado:** 8 pantallas navegables, mock de sesión persistente entre recargas, navbar actualizada cuando hay usuario logueado.

---

## Orden de implementación

```
Paso 1 → Agregar tipos de auth en src/types/index.ts
Paso 2 → Crear AuthContext (src/context/auth.tsx)
Paso 3 → Crear mock de usuarios (src/data/mockUsers.ts)
Paso 4 → Crear AuthLayout
Paso 5 → Agregar Input component reutilizable (src/components/ui/Input.tsx)
Paso 6 → Actualizar Navbar para mostrar estado de sesión
Paso 7 → Actualizar router con rutas de auth
Paso 8 → Implementar pantallas en orden: 2.2 → 2.1 → 2.3 → 2.4 → 2.5 → 2.8 → 2.6 → 2.7
```

> ⚠️ La pantalla 2.2 (selección de rol) se implementa antes que el login (2.1) porque el login tiene un link a "Registrarse" que necesita esa ruta.

---

## Paso 1 — Nuevos tipos en `src/types/index.ts`

Agregar al final del archivo (no borrar nada existente):

```ts
export type UserRole = 'student' | 'organization' | 'instructor'

export interface AuthUser {
  id: string
  name: string
  email: string
  role: UserRole
  avatar?: string
  bio?: string
  // Solo para role 'organization' o 'instructor':
  orgSlug?: string
  instructorSlug?: string
}
```

---

## Paso 2 — AuthContext: `src/context/auth.tsx`

Crear el contexto de autenticación. Este es el núcleo de toda la Fase 2.

```tsx
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import type { AuthUser } from '../types'

interface AuthContextType {
  user: AuthUser | null
  isLoggedIn: boolean
  login: (user: AuthUser) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

const STORAGE_KEY = 'nexora_user'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : null
  })

  const login = (userData: AuthUser) => {
    setUser(userData)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userData))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem(STORAGE_KEY)
  }

  return (
    <AuthContext.Provider value={{ user, isLoggedIn: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
```

### Envolver la app con AuthProvider en `src/main.tsx`

```tsx
// main.tsx — actualizar para incluir AuthProvider:
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
)
```

---

## Paso 3 — Mock de usuarios: `src/data/mockUsers.ts`

Cuentas de demostración precargadas. El login las busca por email.

```ts
import type { AuthUser } from '../types'

export const mockUsers: AuthUser[] = [
  {
    id: 'user-1',
    name: 'María García',
    email: 'estudiante@nexora.com',
    role: 'student',
    avatar: 'https://i.pravatar.cc/150?u=maria-garcia',
    bio: 'Desarrolladora frontend apasionada por el aprendizaje continuo.',
  },
  {
    id: 'user-2',
    name: 'TechCorp Latam',
    email: 'empresa@techcorp.com',
    role: 'organization',
    avatar: 'https://ui-avatars.com/api/?name=TechCorp+Latam&background=2D4A3E&color=FAF7EF&size=128',
    bio: 'Empresa líder en soluciones tecnológicas para Latinoamérica.',
    orgSlug: 'techcorp-latam',
  },
  {
    id: 'user-3',
    name: 'Carlos Mendoza',
    email: 'instructor@nexora.com',
    role: 'instructor',
    avatar: 'https://i.pravatar.cc/150?u=carlos-mendoza',
    bio: 'Arquitecto de software con 15 años de experiencia.',
    instructorSlug: 'carlos-mendoza',
  },
]

// Contraseña para todas las cuentas demo: "password"
export const DEMO_PASSWORD = 'password'
```

---

## Paso 4 — AuthLayout: `src/components/layout/AuthLayout.tsx`

Layout de dos paneles para todas las pantallas de auth.

**Diseño:**

```
Desktop (lg+):
┌───────────────────┬──────────────────────────────┐
│                   │                              │
│  PANEL IZQUIERDO  │      PANEL DERECHO           │
│  (40% — verde)    │      (60% — beige)           │
│                   │                              │
│  Logo Nexora.     │   [contenido del form]       │
│                   │                              │
│  "Aprende.        │                              │
│  Certifícate.     │                              │
│  Consigue el      │                              │
│  trabajo."        │                              │
│                   │                              │
│  Avatares de      │                              │
│  usuarios mock    │                              │
│  + stats          │                              │
│                   │                              │
└───────────────────┴──────────────────────────────┘

Mobile:
┌──────────────────────────────┐
│  Logo Nexora. (pequeño, top) │
│                              │
│  [contenido del form]        │
│                              │
└──────────────────────────────┘
```

**Panel izquierdo (oculto en mobile):**
- Fondo: `bg-[#2D4A3E]`
- Logo "Nexora." en blanco + dorado, `text-2xl font-bold`
- Tagline: "Aprende. Certifícate. Consigue el trabajo." en blanco, `text-3xl font-bold`, salto de línea en cada punto
- Subtexto: "Únete a más de 12,000 profesionales que ya están aprendiendo con Nexora." en `text-white/70`
- Sección inferior: 3 avatares circulares superpuestos (`-ml-2`) + texto "+12,000 estudiantes activos"
- Decoración: círculo grande con `border border-white/10 rounded-full` posicionado de forma absoluta (decorativo)

**Panel derecho:**
- Fondo: `bg-[#FAF7EF]`
- Centrado verticalmente y horizontalmente
- Max-width del form: `max-w-md w-full`
- Padding: `px-8 py-12`

**Header mobile (visible solo en mobile):**
- Fondo: `bg-[#FAF7EF]`
- Logo "Nexora." en verde + dorado, link a `/`
- Padding: `px-6 py-4 border-b border-[#E8E0D0]`

Usar `<Outlet />` dentro del panel derecho (o del área de form mobile) para renderizar las pantallas de auth.

---

## Paso 5 — Input component: `src/components/ui/Input.tsx`

Componente reutilizable para todos los formularios (Fase 2 y futuras).

Props: `label: string`, `type?: string`, `placeholder?: string`, `value: string`, `onChange`, `error?: string`, `required?: boolean`, `hint?: string`, `id: string`

**Diseño:**
```
label (requerido si required=true, muestra asterisco rojo)
┌──────────────────────────────────┐
│ input                            │
└──────────────────────────────────┘
mensaje de error (si error !== undefined)   ← texto rojo pequeño
```

- Fondo input: `bg-white`
- Borde normal: `border border-[#E8E0D0]`
- Borde focus: `border-[#2D4A3E] ring-1 ring-[#2D4A3E]`
- Borde error: `border-red-400 ring-1 ring-red-400`
- Border-radius: `rounded-lg`
- Padding: `px-4 py-3`
- Siempre usar `<label htmlFor={id}>` — nunca placeholder como único label (accesibilidad)
- Mensaje de error: `text-red-500 text-sm mt-1` con `role="alert"`
- Transición en borde: `transition-colors duration-200`

Variante especial para contraseña: mostrar ícono `Eye`/`EyeOff` (Lucide) para toggle. Implementar con `useState` local dentro del componente o con prop `showToggle?: boolean`.

---

## Paso 6 — Actualizar Navbar: `src/components/layout/Navbar.tsx`

La Navbar existente debe consumir `useAuth()` y cambiar su estado visual cuando hay sesión activa.

**Cambios cuando `isLoggedIn === true`:**
- Reemplazar los botones "Iniciar sesión" y "Comenzar gratis" con un **UserMenu** compacto:

```
Desktop (cuando logged in):
┌──────────────────────────────────────┐
│  Nexora.   [Cursos] [Orgs] [Instrs]  │  [avatar + nombre ▾]  │
└──────────────────────────────────────┘
                                          ↓ al hacer click
                                    ┌─────────────────┐
                                    │ Mi perfil        │ → /perfil/editar (o /org/configuracion)
                                    │ Dashboard        │ → / (placeholder)
                                    │ ─────────────    │
                                    │ Cerrar sesión    │
                                    └─────────────────┘
```

**UserMenu (dropdown):**
- Trigger: avatar circular (32px) + nombre truncado (max 15 chars) + ícono `ChevronDown` (Lucide)
- Dropdown: aparece debajo del trigger con `position: absolute`, `top-full mt-2`, sombra `shadow-lg`, borde, fondo `bg-[#FAF7EF]`, `rounded-xl`
- Ítems: `Mi perfil` (ícono `User`), `Dashboard` (ícono `LayoutDashboard`), separador `<hr>`, `Cerrar sesión` (ícono `LogOut`, texto rojo)
- "Mi perfil": si `user.role === 'organization'` → `/org/configuracion`, si no → `/perfil/editar`
- "Dashboard": link a `/` por ahora (Phase 3 cambiará esto)
- "Cerrar sesión": llama a `logout()` del AuthContext, luego navega a `/`
- Cerrar dropdown al hacer click fuera (`useEffect` con event listener en `document`)

**Mobile (cuando logged in):**
- El menú hamburguesa muestra en la parte superior el avatar + nombre del usuario
- Reemplaza los botones de auth con los mismos ítems del dropdown

**Cambios cuando `isLoggedIn === false`:**
- Sin cambios — igual que hoy

---

## Paso 7 — Actualizar router: `src/router/index.tsx`

Agregar las rutas de Fase 2. Las pantallas de auth usan `AuthLayout`, no `PublicLayout`.

```tsx
// Agregar a las rutas existentes:

// Rutas de autenticación (AuthLayout)
<Route element={<AuthLayout />}>
  <Route path="/login" element={<LoginPage />} />
  <Route path="/registro" element={<RegisterRolePage />} />
  <Route path="/registro/estudiante" element={<RegisterStudentPage />} />
  <Route path="/registro/organizacion" element={<RegisterOrgPage />} />
  <Route path="/registro/instructor" element={<RegisterInstructorPage />} />
  <Route path="/recuperar-contrasena" element={<RecoverPasswordPage />} />
</Route>

// Rutas protegidas — usan PublicLayout pero requieren sesión
// Envolver con un componente ProtectedRoute que redirija a /login si no hay sesión
<Route element={<PublicLayout />}>
  {/* ... rutas existentes de Fase 1 ... */}
  <Route path="/perfil/editar" element={<ProtectedRoute><EditProfilePage /></ProtectedRoute>} />
  <Route path="/org/configuracion" element={<ProtectedRoute><EditOrgPage /></ProtectedRoute>} />
</Route>
```

### `ProtectedRoute`: `src/components/auth/ProtectedRoute.tsx`

```tsx
import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/auth'

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isLoggedIn } = useAuth()
  if (!isLoggedIn) return <Navigate to="/login" replace />
  return <>{children}</>
}
```

---

## Paso 8 — Pantallas

Todos los archivos van en `src/pages/auth/`.

---

### 2.2 Selección de Rol — `/registro`

**Archivo:** `src/pages/auth/RegisterRolePage.tsx`

```
┌─────────────────────────────────────────────────────┐
│  ¿Cómo quieres usar Nexora?                         │
│  Elige el perfil que mejor describe tu caso         │
│                                                     │
│  ┌──────────────┐ ┌──────────────┐ ┌─────────────┐ │
│  │              │ │              │ │             │ │
│  │  [GradCap]   │ │ [Building2]  │ │ [UserCheck] │ │
│  │              │ │              │ │             │ │
│  │  Estudiante  │ │  Empresa /   │ │  Instructor │ │
│  │              │ │  Universidad │ │             │ │
│  │  Aprende y   │ │  Crea cursos │ │  Publica    │ │
│  │  certifícate │ │  y contrata  │ │  tus cursos │ │
│  │              │ │              │ │             │ │
│  │  [Comenzar]  │ │  [Comenzar]  │ │  [Comenzar] │ │
│  └──────────────┘ └──────────────┘ └─────────────┘ │
│                                                     │
│  ¿Ya tienes cuenta? [Inicia sesión]                 │
└─────────────────────────────────────────────────────┘
```

**Detalles:**
- Título: `text-2xl font-bold text-[#1A1C14]` centrado
- Subtítulo: `text-[#5C6355]` centrado
- 3 cards en grid (`grid-cols-1 md:grid-cols-3 gap-4`), cada una:
  - Fondo: `bg-white border border-[#E8E0D0] rounded-2xl p-6`
  - Hover: `border-[#2D4A3E] shadow-md` + `cursor-pointer`
  - Ícono Lucide grande (48px) en dorado `text-[#C9A84C]`
  - Título del rol en bold
  - Descripción corta en muted
  - Botón "Comenzar →" secundario (outline verde, ancho completo) al final
  - Transición de borde: `transition-all duration-200`
- Al hacer click en cualquier zona de la card → navegar a la ruta correspondiente
- Link inferior: "¿Ya tienes cuenta? Inicia sesión" → `/login`

| Card | Ícono | Título | Descripción | Ruta |
|---|---|---|---|---|
| Estudiante | `GraduationCap` | Estudiante | "Aprende con cursos de empresas y universidades. Certifícate y conecta con empleadores." | `/registro/estudiante` |
| Empresa / Universidad | `Building2` | Empresa o Universidad | "Crea cursos de onboarding o de prestigio. Contrata buscando quién los completó." | `/registro/organizacion` |
| Instructor | `UserCheck` | Instructor independiente | "Publica tus propios cursos y llega a estudiantes que buscan crecer profesionalmente." | `/registro/instructor` |

---

### 2.1 Login — `/login`

**Archivo:** `src/pages/auth/LoginPage.tsx`

```
┌──────────────────────────────────────┐
│  Bienvenido de vuelta                │
│  Ingresa a tu cuenta de Nexora       │
│                                      │
│  Correo electrónico                  │
│  [___________________________]       │
│                                      │
│  Contraseña                          │
│  [_________________] [👁]            │
│  [Recordarme]    ¿Olvidaste tu       │
│                  contraseña? →       │
│                                      │
│  [     Iniciar sesión     ]          │
│  (botón dorado, ancho completo)      │
│                                      │
│  ─────────── o ───────────           │
│                                      │
│  ¿No tienes cuenta?                  │
│  [Crear cuenta gratis]               │
│  (botón outline verde, ancho compl.) │
│                                      │
│  ┌──────────────────────────────┐    │
│  │ 💡 Cuentas demo disponibles  │    │
│  │  estudiante@nexora.com       │    │
│  │  empresa@techcorp.com        │    │
│  │  instructor@nexora.com       │    │
│  │  Contraseña: password        │    │
│  └──────────────────────────────┘    │
└──────────────────────────────────────┘
```

**Detalles:**
- Usar `<Input>` para los campos
- Estado local: `email`, `password`, `isLoading`, `error`
- Validación en submit (no en blur para login):
  - Email vacío → "El correo es requerido"
  - Password vacío → "La contraseña es requerida"
- **Lógica de mock login:**
  1. Buscar en `mockUsers` por email (case-insensitive)
  2. Si no existe → error: "No encontramos una cuenta con ese correo"
  3. Si existe pero password !== `'password'` → error: "Contraseña incorrecta"
  4. Si coincide → `login(user)` del AuthContext
  5. Redirigir: role `'student'` → `/`, role `'organization'` → `/`, role `'instructor'` → `/`
  6. (Nota: Phase 3 y 4 cambiarán estos redirects a `/dashboard` y `/creator/dashboard`)
- Loading: mostrar spinner en el botón (`animate-spin`) durante 600ms antes de redirigir
- Error general: mostrar debajo del botón con `role="alert"`, fondo `bg-red-50 border border-red-200 text-red-700 rounded-lg p-3`
- Box de cuentas demo: fondo `bg-[#F2EDE1] border border-[#E8E0D0] rounded-xl p-4 mt-6`. Ícono `Info` (Lucide) en dorado. Cada email es clickeable y llena el campo automáticamente.
- Link "¿Olvidaste tu contraseña?" → `/recuperar-contrasena`
- Link "Crear cuenta gratis" → `/registro`

---

### 2.3 Registro Estudiante — `/registro/estudiante`

**Archivo:** `src/pages/auth/RegisterStudentPage.tsx`

Formulario de 2 pasos con `StepIndicator`.

**Step 1: Datos básicos**
```
[•───○] Paso 1 de 2

Crea tu cuenta de estudiante

Nombre completo *
[_______________________________]

Correo electrónico *
[_______________________________]

Contraseña *
[___________________] [👁]
Mínimo 8 caracteres

Confirmar contraseña *
[___________________] [👁]

[    Continuar →    ]
(botón dorado)
```

**Step 2: Intereses (opcional)**
```
[●───•] Paso 2 de 2

¿Qué quieres aprender?
Elige las áreas que más te interesan (opcional)

☐ Tecnología      ☐ Negocios
☐ Diseño          ☐ Marketing
☐ Finanzas        ☐ Salud
☐ Educación       ☐ Desarrollo Personal

[← Atrás]   [  Crear mi cuenta  ]
             (botón dorado)
```

**Detalles:**
- `StepIndicator`: 2 puntos conectados por línea. Activo = círculo dorado relleno. Inactivo = círculo con borde gris.
- Validación en Step 1 al hacer click "Continuar":
  - Nombre: requerido, mínimo 2 caracteres
  - Email: requerido, formato válido (regex básico)
  - Password: requerido, mínimo 8 caracteres
  - Confirmar password: debe coincidir con password
- Step 2 es completamente opcional — botón "Crear mi cuenta" siempre habilitado
- **Al crear cuenta:**
  1. Crear `AuthUser`: `{ id: 'user-new-'+Date.now(), name, email, role: 'student', bio: '' }`
  2. Llamar `login(newUser)`
  3. Redirigir a `/`
- Debajo del formulario: "¿Ya tienes cuenta? [Iniciar sesión]" → `/login`

---

### 2.4 Registro Organización — `/registro/organizacion`

**Archivo:** `src/pages/auth/RegisterOrgPage.tsx`

Un solo paso (formulario más largo).

```
Registra tu organización en Nexora

Nombre de la organización *
[_______________________________]

Industria *
[▾ Selecciona una industria    ]

Sitio web
[https://                      ]

Correo de contacto *
[_______________________________]

Contraseña *
[___________________] [👁]

Confirmar contraseña *
[___________________] [👁]

[    Crear organización    ]
(botón dorado, ancho completo)

¿Ya tienes cuenta? [Iniciar sesión]
```

**Detalles:**
- Campo industria: `<select>` estilizado. Opciones: Tecnología, Finanzas, Salud, Educación Superior, Emprendimiento, Manufactura, Retail, Servicios, Otro
- Validaciones: nombre requerido, industria requerida, email requerido + formato, password min 8, confirmación igual
- **Al crear:**
  ```ts
  const newUser: AuthUser = {
    id: 'org-new-' + Date.now(),
    name: orgName,
    email,
    role: 'organization',
    orgSlug: orgName.toLowerCase().replace(/\s+/g, '-'),
  }
  login(newUser)
  navigate('/')
  ```

---

### 2.5 Registro Instructor — `/registro/instructor`

**Archivo:** `src/pages/auth/RegisterInstructorPage.tsx`

```
Comienza a enseñar en Nexora

Nombre completo *
[_______________________________]

Título profesional *
[ej: Especialista en Data Science]

Áreas de expertise *
[Tecnología ×] [Diseño ×]  [+ Agregar]

Bio corta
[                               ]
[  (textarea, 3 filas)          ]
Máximo 200 caracteres

Correo electrónico *
[_______________________________]

Contraseña *
[___________________] [👁]

Confirmar contraseña *
[___________________] [👁]

[    Crear perfil de instructor    ]
```

**Detalles:**
- Campo "Áreas de expertise": selector de tags. Mostrar las `CourseCategory` como pills seleccionables. Al seleccionar una, aparece como tag con `×` para quitar. Mínimo 1 requerido.
- Bio: `<textarea>` con contador de caracteres (`{n}/200`)
- **Al crear:**
  ```ts
  const newUser: AuthUser = {
    id: 'inst-new-' + Date.now(),
    name,
    email,
    role: 'instructor',
    instructorSlug: name.toLowerCase().replace(/\s+/g, '-'),
    bio,
  }
  login(newUser)
  navigate('/')
  ```

---

### 2.8 Recuperar Contraseña — `/recuperar-contrasena`

**Archivo:** `src/pages/auth/RecoverPasswordPage.tsx`

Dos estados: formulario inicial y confirmación de envío.

**Estado 1: Formulario**
```
¿Olvidaste tu contraseña?
Ingresa tu correo y te enviaremos instrucciones.

Correo electrónico *
[_______________________________]

[    Enviar instrucciones    ]

[← Volver al login]
```

**Estado 2: Confirmación (después de enviar)**
```
      [ícono MailCheck grande — dorado]

  ¡Revisa tu correo!

  Enviamos instrucciones a:
  usuario@ejemplo.com

  Si no ves el correo, revisa tu carpeta
  de spam o correo no deseado.

  [Reenviar correo]  [← Volver al login]
```

**Detalles:**
- Estado 2 se activa 600ms después de hacer submit (simular loading en botón)
- Cualquier email funciona (mockup) — no validar existencia, solo formato
- Ícono `MailCheck` (Lucide) en dorado, tamaño grande (64px)
- "Reenviar correo": vuelve al estado 1 con el email prellenado

---

### 2.6 Editar Perfil de Usuario — `/perfil/editar`

**Archivo:** `src/pages/auth/EditProfilePage.tsx`

Ruta protegida — redirige a `/login` si no hay sesión.

```
┌──────────────────────────────────────────────────────┐
│  Mi perfil                                           │
├──────────────────────────────────────────────────────┤
│                                                      │
│  ┌──────────┐   [nombre del usuario]                 │
│  │  Avatar  │   [email — no editable, gris]          │
│  │ (80px)   │   Rol: Estudiante                      │
│  │ [Cambiar]│                                        │
│  └──────────┘                                        │
│                                                      │
│  Nombre completo *                                   │
│  [_____________________________]                     │
│                                                      │
│  Bio                                                 │
│  [                             ]                     │
│  [  (textarea)                 ]                     │
│                                                      │
│  [    Guardar cambios    ]  (botón dorado)            │
│                                                      │
│  Zona de peligro                                     │
│  ─────────────────────────────────────────────────── │
│  [Cerrar sesión]  (botón outline rojo)               │
└──────────────────────────────────────────────────────┘
```

**Detalles:**
- Precargar campos con los datos del `user` del AuthContext
- Email: mostrar pero deshabilitado (`disabled`) con texto gris — no se puede cambiar en mockup
- Rol: mostrar con badge (mismo `Badge` component), no editable
- Avatar "Cambiar": solo UI decorativa (no hay upload real) — mostrar el ícono `Camera` sobre el avatar al hover, con tooltip "Cambiar foto"
- **Guardar:** actualiza el `user` en AuthContext y localStorage. Mostrar estado de éxito: "✓ Cambios guardados" (texto verde, desaparece a los 3s)
- **Cerrar sesión:** llama `logout()` + navega a `/`
- Usa `PublicLayout` (navbar con usuario logueado visible)

---

### 2.7 Configuración de Organización — `/org/configuracion`

**Archivo:** `src/pages/auth/EditOrgPage.tsx`

Solo accessible si `user.role === 'organization'`. Si un usuario de otro rol entra, redirigir a `/`.

```
┌──────────────────────────────────────────────────────┐
│  Configuración de organización                       │
├──────────────────────────────────────────────────────┤
│                                                      │
│  ┌──────────┐   [nombre de la org]                   │
│  │   Logo   │   Organización verificada  [BadgeCheck]│
│  │ (80px)   │                                        │
│  │ [Cambiar]│                                        │
│  └──────────┘                                        │
│                                                      │
│  Nombre de la organización *                         │
│  [_____________________________]                     │
│                                                      │
│  Industria *                                         │
│  [▾ Tecnología               ]                       │
│                                                      │
│  Sitio web                                           │
│  [https://                   ]                       │
│                                                      │
│  Descripción                                         │
│  [                            ]                      │
│  [  (textarea, 4 filas)       ]                      │
│                                                      │
│  [    Guardar cambios    ]                            │
│                                                      │
│  [Cerrar sesión]                                     │
└──────────────────────────────────────────────────────┘
```

**Detalles:**
- Si `user.role !== 'organization'`: `navigate('/', { replace: true })`
- Precargar con datos del `user` del AuthContext
- Guardar: actualizar AuthContext + localStorage. Estado de éxito igual que EditProfilePage.

---

## Componentes adicionales

### `src/components/ui/StepIndicator.tsx`

Props: `totalSteps: number`, `currentStep: number`

```
○──●──○   (ejemplo: paso 2 de 3)
```

- Círculo activo: `bg-[#C9A84C] text-[#1A1C14]` (dorado con número)
- Círculo completado: `bg-[#2D4A3E] text-white` con ícono `Check`
- Círculo pendiente: `border-2 border-[#E8E0D0] text-[#5C6355]` con número
- Línea conectora: `bg-[#E8E0D0]` entre pasos (activa en `bg-[#2D4A3E]` si el paso fue completado)

---

## Checklist de entrega

> **Revisado por Claude — 2026-05-18**

### Funcionalidad
- [x] Login con cuentas demo funciona y actualiza la navbar
- [x] Login con credenciales incorrectas muestra error apropiado
- [x] Logout limpia el estado y localStorage
- [x] Registro de los 3 roles crea sesión y redirige
- [x] Rutas protegidas redirigen a `/login` si no hay sesión
- [x] Recarga de página mantiene la sesión (localStorage)
- [ ] `/org/configuracion` redirige a `/` si el usuario no es org — *verificar visualmente*
- [x] Recuperar contraseña muestra pantalla de éxito

### UI/UX
- [x] AuthLayout panel izquierdo visible en desktop, oculto en mobile
- [x] Formularios tienen labels asociados con `htmlFor` (accesibilidad)
- [x] Errores de validación aparecen con `role="alert"`
- [x] Botones muestran loading (spinner) antes de redirigir
- [x] Toggle de contraseña funciona con Eye/EyeOff
- [x] Navbar muestra avatar + nombre cuando hay sesión
- [x] Dropdown del usuario cierra al hacer click fuera

### Diseño
- [x] Paleta de colores respetada en todos los forms
- [x] Input component consistente en todos los formularios
- [x] StepIndicator visible y correcto en registro de 2 pasos
- [x] Error states en rojo distinguibles del resto del diseño

### Código
- [x] Sin errores de TypeScript
- [x] AuthContext no importado directamente — siempre usar `useAuth()` hook
- [x] Ningún componente escribe en localStorage directamente — todo pasa por AuthContext
