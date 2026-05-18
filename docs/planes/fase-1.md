# Nexora — Plan de Implementación: Fase 1 — Vitrina Pública

> **Agente implementador:** leer `CLAUDE.md` y `docs/design.md` antes de empezar.
> Este documento es autocontenido — contiene todo lo necesario para implementar la Fase 1 sin preguntar.

---

## Objetivo de la fase

Construir todo lo que un visitante sin cuenta puede ver: la landing page, el catálogo de cursos, búsqueda, página de un curso individual, y perfiles de organizaciones e instructores.

**Resultado esperado:** 7 pantallas navegables entre sí, con datos mock realistas, responsive en mobile/tablet/desktop.

---

## Orden de implementación

Seguir este orden estrictamente — cada paso depende del anterior.

```
Paso 1 → Configurar React Router
Paso 2 → Crear mock data
Paso 3 → Crear componentes de layout (PublicLayout, Navbar, Footer)
Paso 4 → Crear componentes UI reutilizables
Paso 5 → Implementar pantallas en orden: 1.1 → 1.2 → 1.3 → 1.4 → 1.5 → 1.6 → 1.7
```

---

## Paso 1 — Configurar React Router

### `src/main.tsx`
Envolver la app con `BrowserRouter`.

```tsx
import { BrowserRouter } from 'react-router-dom'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
)
```

### `src/router/index.tsx`
Definir todas las rutas de la Fase 1. Usar `Routes` y `Route` de react-router-dom v7.

```
/                          → LandingPage
/cursos                    → CourseCatalogPage
/cursos/buscar             → CourseSearchPage   (query param: ?q=)
/cursos/:slug              → CourseDetailPage
/org/:slug                 → OrgProfilePage
/org/:slug/cursos          → OrgCoursesPage
/instructor/:slug          → InstructorProfilePage
*                          → NotFoundPage (página 404 simple)
```

> ⚠️ **Orden crítico de rutas:** `/cursos/buscar` debe declararse **antes** que `/cursos/:slug` en el árbol de rutas. Si se invierte, React Router interpretará "buscar" como un slug y renderizará `CourseDetailPage` con un curso inexistente.

Estructura anidada recomendada:
```tsx
<Route element={<PublicLayout />}>
  <Route path="/" element={<LandingPage />} />
  <Route path="/cursos" element={<CourseCatalogPage />} />
  <Route path="/cursos/buscar" element={<CourseSearchPage />} />  {/* antes que :slug */}
  <Route path="/cursos/:slug" element={<CourseDetailPage />} />
  <Route path="/org/:slug" element={<OrgProfilePage />} />
  <Route path="/org/:slug/cursos" element={<OrgCoursesPage />} />
  <Route path="/instructor/:slug" element={<InstructorProfilePage />} />
  <Route path="*" element={<NotFoundPage />} />
</Route>
```

### `src/App.tsx`
Importar el router y renderizarlo. Eliminar todo el contenido de la plantilla Vite.

---

## Paso 2 — Mock Data

Crear los siguientes archivos en `src/data/`. Usar datos **realistas y coherentes con Nexora** — nada de "Lorem ipsum".

### `src/types/index.ts`

Definir todas las interfaces antes de crear la data:

```ts
export interface Organization {
  id: string
  slug: string
  name: string
  logo: string          // URL de logo (usar https://ui-avatars.com/api/?name=NombreOrg&background=2D4A3E&color=FAF7EF&size=128)
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
  avatar: string        // URL avatar (usar https://i.pravatar.cc/150?u=slug)
  title: string         // ej: "Experto en Data Science"
  bio: string
  expertise: string[]   // áreas de expertise
  courseCount: number
  studentCount: number
  rating: number
}

export interface CourseBlock {
  id: string
  title: string
  unitCount: number
  durationDays: number  // ventana de tiempo del bloque en días
}

export interface Course {
  id: string
  slug: string
  title: string
  shortDescription: string
  longDescription: string
  coverImage: string    // usar https://picsum.photos/seed/{slug}/800/450
  category: CourseCategory
  level: 'Principiante' | 'Intermedio' | 'Avanzado'
  price: number         // 0 = gratuito
  currency: string      // 'USD'
  duration: string      // ej: "6 semanas"
  rating: number        // 0-5
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

export type CourseCategory =
  | 'Tecnología'
  | 'Negocios'
  | 'Diseño'
  | 'Marketing'
  | 'Finanzas'
  | 'Salud'
  | 'Educación'
  | 'Desarrollo Personal'

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
  levels: Array<'Principiante' | 'Intermedio' | 'Avanzado'>
  price: 'all' | 'free' | 'paid'
  duration: Array<'short' | 'medium' | 'long'>   // short <4s, medium 4-8s, long >8s
  organizations: string[]                          // slugs de org
}

export const EMPTY_FILTERS: FilterState = {
  categories: [],
  levels: [],
  price: 'all',
  duration: [],
  organizations: [],
}
```

### `src/data/organizations.ts`

Crear **5 organizaciones** con estos datos (completar los campos vacíos con datos coherentes):

| slug | name | industry |
|---|---|---|
| `techcorp-latam` | TechCorp Latam | Tecnología |
| `universidad-innovacion` | Universidad de la Innovación | Educación Superior |
| `finanzas-plus` | FinanzasPlus | Finanzas |
| `salud-digital` | Salud Digital | Salud |
| `startup-hub` | StartupHub Academy | Emprendimiento |

### `src/data/instructors.ts`

Crear **5 instructores**:

| slug | name | title |
|---|---|---|
| `carlos-mendoza` | Carlos Mendoza | Arquitecto de Software Senior |
| `maria-torres` | María Torres | Especialista en UX/UI |
| `juan-rodriguez` | Juan Rodríguez | Experto en Finanzas Corporativas |
| `ana-silva` | Ana Silva | Doctora en Ciencias de Datos |
| `pedro-garcia` | Pedro García | Growth Hacker & Marketing Digital |

### `src/data/courses.ts`

Crear **9 cursos** distribuidos entre categorías. Al menos 2 por organización grande. Ejemplos temáticos:

1. "Introducción a la Arquitectura de Microservicios" — TechCorp Latam — Tecnología — $49
2. "Onboarding Técnico: Stack de TechCorp" — TechCorp Latam — Tecnología — gratis
3. "Finanzas para No Financieros" — FinanzasPlus — Finanzas — $39
4. "Machine Learning Aplicado en Salud" — Salud Digital — Salud — $59
5. "Diseño de Experiencias Digitales" — Universidad de la Innovación — Diseño — gratis
6. "Growth Hacking para Startups" — StartupHub Academy — Marketing — $29
7. "Fundamentos de Inversión" — FinanzasPlus — Finanzas — gratis
8. "Python para Análisis de Datos" — Universidad de la Innovación — Tecnología — $49
9. "Estrategia y Liderazgo Digital" — StartupHub Academy — Negocios — $39

Cada curso debe tener:
- 3-5 bloques en el array `blocks` con nombres descriptivos y `durationDays` entre 7 y 21
- 3-4 items en `requirements`, `targetAudience`, `whatYouLearn`
- `featured: true` en los primeros 3

### `src/data/testimonials.ts`

Crear **4 testimonios** — dos de estudiantes que consiguieron empleo, dos de empresas que contratan a través de Nexora. Quotes deben mencionar el valor de la plataforma de forma natural.

---

## Paso 3 — Layouts

### `src/components/layout/Navbar.tsx`

**Diseño:**
- Posición: `fixed top-4 left-4 right-4 z-50`
- Fondo: `bg-[#FAF7EF]/85 backdrop-blur-md`
- Borde: `border border-[#E8E0D0] rounded-2xl`
- Sombra: `shadow-sm`
- Padding interno: `px-6 py-3`
- Max-width interno: `max-w-7xl mx-auto`

**Contenido (de izquierda a derecha):**
1. Logo: texto "Nexora" en `font-bold text-xl text-[#2D4A3E]` con un punto dorado después (`text-[#C9A84C]`)
2. Links de navegación (centro, ocultos en mobile): "Explorar cursos" → `/cursos`, "Organizaciones" → `/org` (placeholder), "Instructores" → placeholder
3. Acciones (derecha): botón "Iniciar sesión" outline verde + botón "Comenzar gratis" dorado (gold). En mobile: solo el botón dorado + hamburger icon (Lucide `Menu`)

**Comportamiento:**
- En scroll hacia abajo: aumentar ligeramente la opacidad del fondo (`bg-[#FAF7EF]/95`)
- Link activo: subrayado o color `--color-primary`
- Usar `useLocation()` de react-router-dom para detectar ruta activa
- **Menú mobile:** al hacer click en el ícono `Menu`, mostrar un panel dropdown debajo de la navbar (mismo fondo + borde) con los links de navegación apilados verticalmente. Ícono cambia a `X` cuando está abierto. Click fuera cierra el menú.
- **Link "Organizaciones"** del navbar apunta a `/cursos` por ahora (no hay listado de orgs en Fase 1). No crear una ruta `/org` sin pantalla.

### `src/components/layout/Footer.tsx`

**Diseño:**
- Fondo: `bg-[#2D4A3E]` (verde musgo)
- Texto: blanco/cream
- Padding: `py-16 px-6`
- Max-width: `max-w-7xl mx-auto`

**Contenido (4 columnas en desktop, 2 en tablet, 1 en mobile):**
1. **Col 1:** Logo Nexora blanco + descripción corta (2 líneas) + íconos de redes sociales (LinkedIn, Twitter — Lucide)
2. **Col 2:** "Plataforma" — links: Explorar cursos, Para organizaciones, Para instructores, Precios
3. **Col 3:** "Recursos" — links: Centro de ayuda, Blog, Documentación, API
4. **Col 4:** "Empresa" — links: Sobre nosotros, Trabaja con nosotros, Privacidad, Términos

Todos los links son `href="#"` (placeholder — es mockup).

**Bottom bar:** línea separadora + "© 2026 Nexora. Todos los derechos reservados." a la izquierda, y selector de idioma (mockup) a la derecha.

### `src/components/layout/PublicLayout.tsx`

Wrapper simple:
```tsx
<div>
  <Navbar />
  <main className="pt-20">   {/* compensar navbar fixed */}
    <Outlet />
  </main>
  <Footer />
</div>
```

Usar `<Outlet />` de react-router-dom para renderizar la página hija.

---

## Paso 4 — Componentes UI reutilizables

Crear en `src/components/ui/` y `src/components/course/`.

### `src/components/ui/Badge.tsx`

Props: `label: string`, `variant: 'level' | 'category' | 'price' | 'featured'`

- `level` Principiante → fondo verde claro, texto verde oscuro
- `level` Intermedio → fondo amarillo claro, texto amarillo oscuro
- `level` Avanzado → fondo rojo claro, texto rojo oscuro
- `category` → fondo beige surface, texto muted
- `price` gratis → fondo verde/gold claro, texto verde
- `featured` → fondo dorado, texto oscuro

### `src/components/ui/RatingStars.tsx`

Props: `rating: number`, `reviewCount?: number`, `size?: 'sm' | 'md'`

Mostrar estrellas llenas/medias/vacías con color dorado `#C9A84C`. Si `reviewCount`, mostrar `(N reseñas)` en muted.

### `src/components/ui/Button.tsx`

Props: `variant: 'primary' | 'secondary' | 'outline' | 'ghost'`, `size: 'sm' | 'md' | 'lg'`, `children`, `onClick?`, `href?`, `className?`

- `primary` → fondo `#C9A84C`, texto `#1A1C14`, hover `#B8970A`
- `secondary` → fondo `#2D4A3E`, texto blanco, hover `#4A7C59`
- `outline` → borde `#2D4A3E`, texto `#2D4A3E`, hover fondo `#F2EDE1`
- `ghost` → sin fondo ni borde, texto muted, hover fondo surface

Si tiene `href`, renderizar como `<Link>` de react-router-dom. Siempre `cursor-pointer`. Transición `duration-200`.

### `src/components/course/CourseCard.tsx`

Props: `course: Course`, `variant?: 'default' | 'compact'`

**Layout `default` (usado en grids):**
```
┌────────────────────────────┐
│   Imagen portada 16:9      │
│   [badge nivel] [featured] │
├────────────────────────────┤
│ Logo org  Nombre org       │
│                            │
│ Título del curso (2 líneas │
│ máximo, truncar)           │
│                            │
│ Descripción (2 líneas max) │
│                            │
│ ⭐ 4.8 (234) · 6 semanas   │
│ 👥 1,240 inscritos         │
│                            │
│ $49 USD   [Ver curso →]    │
└────────────────────────────┘
```

- Fondo: `bg-[#F2EDE1]`
- Borde: `border border-[#E8E0D0]`
- Border-radius: `rounded-2xl`
- Hover: `shadow-md translateY(-2px)` + cursor-pointer
- Al hacer click: navegar a `/cursos/:slug`
- Precio 0: mostrar "Gratuito" en verde en vez de precio

**Íconos a usar (Lucide):** `Star` para rating, `Users` para inscritos, `Clock` para duración.

### `src/components/course/FilterSidebar.tsx`

Props: `filters: FilterState`, `onChange: (filters: FilterState) => void`

Secciones con título y opciones:
1. **Categoría** — checkboxes con todas las `CourseCategory`
2. **Nivel** — checkboxes: Principiante, Intermedio, Avanzado
3. **Precio** — radio: Todos / Gratuitos / De pago
4. **Duración** — checkboxes: Menos de 4 semanas / 4-8 semanas / Más de 8 semanas
5. **Organización** — checkboxes con las orgs disponibles

Botón "Limpiar filtros" al final en texto muted.

En mobile: oculto por defecto, abre como drawer/panel desde la izquierda. Botón "Filtros" con ícono `SlidersHorizontal` (Lucide) para abrirlo.

### `src/components/course/SearchBar.tsx`

Props: `defaultValue?: string`, `placeholder?: string`, `onSearch: (query: string) => void`, `size?: 'sm' | 'lg'`

- Input con ícono `Search` (Lucide) a la izquierda
- Botón "Buscar" o al presionar Enter navegar a `/cursos/buscar?q={query}`
- Size `lg`: usado en hero y en la página de búsqueda (más grande, padding generoso)
- Size `sm`: usado en navbar móvil si aplica

---

## Paso 5 — Pantallas

### 1.1 Landing Page — `/`

**Archivo:** `src/pages/public/LandingPage.tsx`

#### Sección 1: Hero

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│   (badge pequeño) ✦ Plataforma de aprendizaje con IA    │
│                                                         │
│   Aprende. Certifícate.                                 │
│   Consigue el trabajo.                                  │
│                                                         │
│   Conectamos el aprendizaje con el mercado laboral.     │
│   Las empresas crean cursos, los estudiantes los        │
│   completan y los empleadores contratan directamente    │
│   desde la plataforma.                                  │
│                                                         │
│   [Explorar cursos →]   [Para organizaciones]           │
│    (botón dorado)          (botón outline verde)        │
│                                                         │
│   ─────────────────────────────────────────────────     │
│   🏢 +120 organizaciones  📚 +500 cursos  👥 +12k       │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Detalles:**
- Fondo del hero: `bg-[#FAF7EF]` (mismo que la página, se diferencia con el contenido)
- Agregar un elemento decorativo sutil: un rectángulo redondeado grande con `bg-[#F2EDE1]` rotado ligeramente en el fondo, o una cuadrícula de puntos muy tenue — elegir lo más simple
- Badge superior: pill pequeña con fondo `bg-[#F2EDE1]` borde `border-[#E8E0D0]`, texto "✦ Plataforma de aprendizaje con IA" — el ✦ en dorado, el texto en muted
- Headline: `text-5xl md:text-6xl lg:text-7xl font-bold text-[#1A1C14]` con salto de línea intencional
- "Consigue el trabajo" → en `text-[#2D4A3E]` para diferenciar
- Subtítulo: `text-lg text-[#5C6355]` máximo 65 caracteres por línea
- Stats: separados por línea vertical, ícono Lucide pequeño en dorado + número en bold + label en muted. Íconos: `Building2`, `BookOpen`, `Users`
- Animación de entrada: fade-in suave (`opacity-0` → `opacity-100`, `translateY(10px)` → `translateY(0)`) con `transition-all duration-700`. Respetar `prefers-reduced-motion`

#### Sección 2: Cómo funciona

Título centrado: "Así funciona Nexora"
Subtítulo: "Tres pasos para conectar aprendizaje con empleo"

3 cards en fila (1 col mobile, 3 desktop):

| # | Ícono (Lucide) | Título | Descripción |
|---|---|---|---|
| 1 | `BookOpen` | Elige tu curso | Explora cursos creados por empresas, universidades y profesores especializados. |
| 2 | `Award` | Completa los bloques | Avanza por bloques con tiempo definido. Aprueba cada uno para desbloquear el siguiente. |
| 3 | `Briefcase` | Conecta con empleadores | Tu historial de cursos completados es visible para empresas que buscan talento. |

Cada card: número del paso en círculo dorado, ícono grande verde, título, descripción.
Flecha conectora entre cards (visible en desktop, oculta en mobile): `ChevronRight` (Lucide).

#### Sección 3: Para quién es

Fondo: `bg-[#F2EDE1]` (superficie)
Título centrado: "Diseñado para cada parte del ecosistema"

3 cards grandes (col-span diferente en desktop para crear asimetría):

**Card Empresas** (más grande, 2 cols):
- Ícono `Building2` en dorado grande
- Título: "Para Empresas"
- Descripción: "Crea cursos de onboarding personalizados. Cuando quieras contratar, busca directamente quién completó tus cursos — o los de otras empresas que admiras."
- Features (bullets con `CheckCircle` verde): "Cursos de onboarding listos", "Busca talento por credenciales", "Acceso a historial de aprendizaje"
- Link: "Registrar mi empresa →" en verde

**Card Universidades** (1 col):
- Ícono `GraduationCap` en dorado
- Título: "Para Universidades"
- Descripción: "Crea cursos de prestigio que las empresas usan como filtro de contratación."
- Link: "Para instituciones →"

**Card Instructores** (1 col):
- Ícono `UserCheck` en dorado
- Título: "Para Instructores"
- Descripción: "Publica tus cursos y llega a estudiantes que buscan avanzar en sus carreras."
- Link: "Empezar a enseñar →"

#### Sección 4: Cursos destacados

Título: "Cursos populares"
Subtítulo: "Seleccionados por calidad y relevancia laboral"

Mostrar los 3 primeros cursos con `featured: true` de la data usando `<CourseCard />`.

Link al final: "Ver todos los cursos →" → `/cursos`

#### Sección 5: Testimonials

Fondo: `bg-[#2D4A3E]` (verde oscuro — contraste con el resto de la página)
Texto: blanco/cream

Título: "Lo que dicen quienes ya usan Nexora" (en blanco)

4 cards de testimonios en grid (2x2 desktop, 1 col mobile):
- Fondo card: `bg-white/10 backdrop-blur-sm border border-white/20`
- Quote con comillas grandes en dorado
- Foto circular (`rounded-full`), nombre en bold blanco, rol + empresa en `text-white/70`
- Rating en estrellas doradas

#### Sección 6: CTA final

Centrado, padding generoso.
Título grande: "¿Listo para empezar?"
Subtítulo: "Únete a más de 12,000 profesionales que ya están aprendiendo."
2 botones: "Crear cuenta gratis" (dorado) + "Ver cursos" (outline blanco)

---

### 1.2 Catálogo de Cursos — `/cursos`

**Archivo:** `src/pages/public/CourseCatalogPage.tsx`

**Layout:**
```
┌──────────────────────────────────────────────────────┐
│  Explorar cursos                          [🔍 buscar] │
│  523 cursos disponibles                              │
├──────────────┬───────────────────────────────────────┤
│              │  [filtro activo x] [filtro activo x]  │
│  FILTROS     │  ┌────┐ ┌────┐ ┌────┐                │
│  (280px)     │  │    │ │    │ │    │                │
│              │  └────┘ └────┘ └────┘                │
│  Categoría   │  ┌────┐ ┌────┐ ┌────┐                │
│  □ Tecnología│  │    │ │    │ │    │                │
│  □ Negocios  │  └────┘ └────┘ └────┘                │
│  ...         │                                       │
│              │  [Cargar más]                         │
└──────────────┴───────────────────────────────────────┘
```

**Detalles:**
- Header de página: título "Explorar cursos" + count de resultados en muted + `<SearchBar size="sm">` a la derecha
- Chips de filtros activos debajo del header (si hay filtros): pill con el filtro + `X` para quitar
- Grid de cursos: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6`
- Mostrar todos los cursos de la data (`courses.ts`) filtrados según `FilterSidebar`
- Orden por defecto: destacados primero, luego por rating
- Botón "Cargar más" centrado (mockup — simplemente no hace nada o muestra un mensaje)
- Estado vacío (si filtros no dan resultados): ilustración con ícono grande `SearchX` (Lucide) + "No encontramos cursos con esos filtros" + botón "Limpiar filtros"

**Comportamiento de filtros:**
- Usar `useState` para `FilterState` local
- Filtrar el array de cursos en el render (no llamada a API)
- Los filtros activos se muestran como chips removibles

---

### 1.3 Búsqueda de Cursos — `/cursos/buscar`

**Archivo:** `src/pages/public/CourseSearchPage.tsx`

**Layout:**
```
┌─────────────────────────────────────────────┐
│  [🔍  Busca cursos, temas, organizaciones  ]│
│                                             │
│  Resultados para: "python"   (3 cursos)     │
│                                             │
│  ┌────┐  ┌────┐  ┌────┐                    │
│  │    │  │    │  │    │                    │
│  └────┘  └────┘  └────┘                    │
└─────────────────────────────────────────────┘
```

**Detalles:**
- `SearchBar size="lg"` en la parte superior, activa con el valor del query param `?q=`
- Al cambiar y buscar: actualizar el query param en la URL con `useNavigate` + `useSearchParams`
- Filtrar cursos cuyo título, descripción, categoría u organización contenga el query (case-insensitive)
- Texto de resultados: `Resultados para: "{query}"` + count
- Misma `<CourseCard>` y grid que el catálogo
- Si query vacío: mostrar "Escribe algo para buscar" con ícono `Search`
- Si sin resultados: ícono `SearchX` + "No encontramos resultados para '{query}'" + sugerencia de términos

---

### 1.4 Página de Curso — `/cursos/:slug`

**Archivo:** `src/pages/public/CourseDetailPage.tsx`

**Layout 2 columnas (invertir en mobile: sidebar va abajo):**

```
┌──────────────────────────────────────────────────────────┐
│  Tecnología › Arquitectura                   breadcrumb  │
│                                                          │
│  Introducción a la Arquitectura de Microservicios        │
│  Por TechCorp Latam   ⭐ 4.8 (234 reseñas)              │
│  👥 1,240 inscritos  ·  Actualizado Nov 2024             │
├──────────────────────────────┬───────────────────────────┤
│                              │  ┌─────────────────────┐  │
│  Descripción                 │  │  Imagen del curso   │  │
│  ─────────────────           │  ├─────────────────────┤  │
│  Lorem...                    │  │  $49 USD            │  │
│                              │  │  [Inscribirse ahora]│  │
│  Qué aprenderás              │  │  ─────────────────  │  │
│  ─────────────────           │  │  ✓ Acceso completo  │  │
│  ✓ Item 1                    │  │  ✓ Certificado      │  │
│  ✓ Item 2                    │  │  ✓ Acceso de por    │  │
│                              │  │    vida             │  │
│  Temario (bloques)           │  ├─────────────────────┤  │
│  ─────────────────           │  │ 🏢 TechCorp Latam   │  │
│  ▶ Bloque 1 (expandible)     │  │ Logo + nombre +     │  │
│  ▶ Bloque 2                  │  │ link al perfil      │  │
│  ▶ Bloque 3                  │  └─────────────────────┘  │
│                              │   (sticky en desktop)     │
│  Requisitos                  │                           │
│  ─────────────────           │                           │
│  • Req 1                     │                           │
│                              │                           │
│  Para quién es esto          │                           │
│  ─────────────────           │                           │
│  • Audiencia 1               │                           │
└──────────────────────────────┴───────────────────────────┘
```

**Detalles:**
- Leer el `slug` con `useParams()`
- Buscar el curso en `courses.ts` por `slug`. Si no existe: redirigir a `/404`
- **Breadcrumb:** `Inicio › {category} › {title truncado}` — links en muted, hover verde, separador `/`
- **Header del curso:** título grande, organización con logo pequeño, rating + reviews, inscritos + fecha de actualización
- **Sección "Qué aprenderás":** grid 2 cols de bullets con ícono `Check` en dorado
- **Temario (Acordeón de bloques):** cada bloque tiene:
  - Header clickeable: `▶` (chevron rota al abrir) + nombre del bloque + "X unidades · Y días de tiempo activo"
  - Contenido expandido (mock): lista de unidades con ícono `PlayCircle` para video, `FileText` para material, `Code2` para ejercicio — los nombres son placeholders pero coherentes con el tema del bloque
  - El acordeón no revela el contenido real (es vista pública)
  - Nota al pie del acordeón: "Inscríbete para ver el contenido completo"
- **Sidebar CTA (sticky en desktop, normal flow en mobile):**
  - Precio o "Gratuito"
  - Botón grande "Inscribirse ahora" (dorado, width full)
  - Lista de 3-4 features con ícono `Check`: "Acceso completo a todos los bloques", "Certificado al completar", etc.
  - Tarjeta de la organización: logo, nombre, industria, count de cursos, link `Ver perfil →`

---

### 1.5 Perfil de Organización — `/org/:slug`

**Archivo:** `src/pages/public/OrgProfilePage.tsx`

```
┌──────────────────────────────────────────────────────┐
│  ┌──────┐                                            │
│  │ Logo │  TechCorp Latam    ✓ Verificada            │
│  └──────┘  Tecnología · techcorp.com                 │
│                                                      │
│  "Descripción de la organización..."                 │
│                                                      │
│  📚 8 cursos  ·  👥 2,400 estudiantes  ·  ⭐ 4.9    │
├──────────────────────────────────────────────────────┤
│  [Sobre nosotros]  [Cursos (8)]                      │
├──────────────────────────────────────────────────────┤
│                                                      │
│  Cursos de TechCorp Latam                            │
│  ┌────┐  ┌────┐  ┌────┐                             │
│  │    │  │    │  │    │                             │
│  └────┘  └────┘  └────┘                             │
└──────────────────────────────────────────────────────┘
```

**Detalles:**
- Header: logo grande (80px), nombre, badge "Verificada" con ícono `BadgeCheck` (Lucide) en verde si `verified: true`, industria + website como link externo
- Stats en row con separadores verticales
- **Tabs** (implementar con `useState` para tab activo):
  - **"Sobre nosotros":** descripción larga (mockear 2-3 párrafos), áreas de enfoque, equipo (placeholder de 3-4 avatares)
  - **"Cursos (N)":** grid de `<CourseCard>` filtradas por org + link "Ver todos" → `/org/:slug/cursos`
- En la tab de cursos, mostrar máximo 3 cursos y botón "Ver todos los cursos"

---

### 1.6 Cursos de la Organización — `/org/:slug/cursos`

**Archivo:** `src/pages/public/OrgCoursesPage.tsx`

**Layout:**
```
┌─────────────────────────────────────────────┐
│  ← TechCorp Latam                           │
│                                             │
│  Cursos de TechCorp Latam        [🔍 buscar]│
│  8 cursos disponibles                       │
│                                             │
│  [Todos] [Principiante] [Intermedio] [Avzd] │
│                                             │
│  ┌────┐  ┌────┐  ┌────┐                    │
│  │    │  │    │  │    │                    │
└─────────────────────────────────────────────┘
```

**Detalles:**
- Link de regreso al perfil de la org
- Filtro de nivel simplificado (tabs/pills, no sidebar completa)
- Filtro por categoría (pills)
- Grid de `<CourseCard>` filtrada por org desde `courses.ts`
- Si la org no tiene cursos (no debería pasar con la data mock): estado vacío

---

### 1.7 Perfil de Instructor — `/instructor/:slug`

**Archivo:** `src/pages/public/InstructorProfilePage.tsx`

```
┌──────────────────────────────────────────────────────┐
│  ┌──────────┐                                        │
│  │  Avatar  │  Carlos Mendoza                        │
│  │ (120px)  │  Arquitecto de Software Senior         │
│  └──────────┘  📚 3 cursos  ·  👥 3,600 estudiantes │
│                ⭐ 4.9 · [LinkedIn] [Twitter]          │
│                                                      │
│  "Bio del instructor..."                             │
│                                                      │
│  Áreas de expertise:                                 │
│  [Microservicios] [Node.js] [AWS] [Docker]           │
├──────────────────────────────────────────────────────┤
│  [Cursos (3)]  [Sobre mí]                            │
├──────────────────────────────────────────────────────┤
│  ┌────┐  ┌────┐  ┌────┐                             │
└──────────────────────────────────────────────────────┘
```

**Detalles:**
- Avatar circular grande (120px), nombre, título profesional
- Stats + links sociales (íconos Lucide `Linkedin`, `Twitter`)
- Bio (texto completo)
- Áreas de expertise como pills/tags con fondo surface y borde
- **Tabs:**
  - **"Cursos (N)":** grid de cursos del instructor con `<CourseCard>`
  - **"Sobre mí":** bio extendida (mockear), logros, certificaciones (placeholder)

---

## Componentes adicionales necesarios

### `src/pages/public/NotFoundPage.tsx`

Pantalla 404 simple:
- Fondo `bg-[#FAF7EF]`
- Número "404" muy grande en `text-[#E8E0D0]` (beige border — decorativo)
- Encima: ícono `FileSearch` (Lucide) en dorado grande
- Título: "Página no encontrada"
- Subtítulo: "La página que buscas no existe o fue movida."
- Botón: "Volver al inicio" → `/` (dorado)

---

## Checklist de entrega

> **Revisado por Claude — 2026-05-18**
> Bonus entregado por Minimax: `OrgCatalogPage` (`/org`) e `InstructorsCatalogPage` (`/instructores`) — no estaban en el plan pero mejoran la UX.

### Funcionalidad
- [x] Todas las rutas navegan correctamente sin errores 404
- [x] Los links entre páginas funcionan (org → perfil org, instructor → perfil instructor, etc.)
- [x] Los filtros del catálogo filtran correctamente la data
- [x] La búsqueda filtra correctamente con el query param
- [x] Los acordeones del temario abren y cierran
- [x] Los tabs en perfiles cambian el contenido
- [x] Slugs inválidos redirigen a `/404` (corregido por Claude)

### UI/UX
- [x] Navbar flotante visible en todas las páginas públicas
- [x] Footer presente en todas las páginas públicas
- [x] No hay emojis usados como íconos (solo Lucide)
- [x] `cursor-pointer` en todos los elementos clickeables
- [x] Hover states con transición `duration-200` en cards, botones y links
- [ ] Responsive verificado en 375px, 768px, 1024px, 1440px — *(verificar visualmente en browser)*
- [ ] No hay scroll horizontal en ningún breakpoint — *(verificar visualmente)*

### Diseño
- [x] Paleta de colores respetada (ver `docs/design.md`)
- [x] Fuente Plus Jakarta Sans cargando correctamente
- [x] Botones CTA en dorado `#C9A84C` con texto oscuro
- [x] Contraste de texto suficiente
- [x] Espaciado consistente

### Código
- [x] Sin errores de TypeScript
- [x] Datos mock en `src/data/` como arrays TypeScript tipados
- [x] No hay datos hardcodeados dentro de los componentes
- [x] Componentes reutilizables usados consistentemente

### Pendiente confirmar
- [x] **Moneda de los cursos**: confirmado — usar Quetzales (`Q`). Correcto.
