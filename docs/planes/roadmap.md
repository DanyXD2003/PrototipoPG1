# Nexora — Roadmap General del Mockup

> **Metodología de trabajo:**
> Claude (cerebro) → diseña, planifica, toma decisiones de arquitectura y UX.
> Minimax / agente implementador → ejecuta el plan descrito aquí.
> Este archivo es la fuente de verdad. Todo cambio relevante se refleja acá.

---

## Contexto del sistema

Nexora es una plataforma de aprendizaje impulsada por IA que conecta directamente con el mercado laboral. Funciona como un marketplace de tres lados:

- **Empresas** crean cursos de onboarding; al contratar buscan quién ya hizo sus cursos.
- **Universidades** crean cursos de prestigio que otras empresas usan como filtro de contratación.
- **Profesores independientes** publican cursos propios en la plataforma.
- **Cualquier empresa** puede buscar quién completó el curso de otra organización para contratar directamente.

El diferenciador clave: los **cursos por bloques con ventana de tiempo activa** — el creador define cuánto tiempo tiene el estudiante por bloque; si no aprueba, repite con menos tiempo.

---

## Roles del sistema

| Rol | Descripción |
|---|---|
| **Visitante** | Navega sin cuenta — descubre cursos, organizaciones, instructores |
| **Estudiante** | Se inscribe, avanza por bloques, acumula credenciales |
| **Creador** | Empresa / Universidad / Profesor que publica y gestiona cursos |
| **Reclutador** | Empresa que busca talento filtrando por cursos completados |
| **Admin** | Superadministrador de la plataforma (fase futura) |

> En el mockup, un mismo usuario puede tener múltiples roles (ej: empresa que crea cursos y también recluta).

---

## Arquitectura de layouts

Antes de las fases, el sistema necesita estos layouts compartidos. **Deben crearse en la Fase 1** y reutilizarse en todas las fases siguientes.

| Layout | Ruta base | Descripción |
|---|---|---|
| `PublicLayout` | `/` | Navbar flotante + footer. Para páginas de vitrina. |
| `AuthLayout` | `/login`, `/registro` | Centrado, minimal, sin navbar completa. |
| `StudentLayout` | `/dashboard`, `/aprendizaje`, etc. | Sidebar izquierdo + área de contenido principal. |
| `LearningLayout` | `/aprendizaje/:curso/bloque/:id/unidad/:id` | Pantalla casi completa para el player — mínimo chrome. |
| `CreatorLayout` | `/creator/*` | Sidebar de herramientas de creación + área principal. |
| `TalentLayout` | `/talent/*` | Layout de reclutamiento — sidebar de filtros + resultados. |

---

## Stack técnico confirmado

| Capa | Tecnología | Versión |
|---|---|---|
| Framework | Vite + React + TypeScript | React 19, Vite 8 |
| Estilos | Tailwind CSS v4 | 4.3.0 |
| Íconos | Lucide React | 1.16.0 |
| Routing | React Router DOM | 7.15.1 |
| Package manager | pnpm | 10.33.0 |

---

## Fases del roadmap

---

### Fase 1 — Vitrina Pública

> **Objetivo:** Todo lo que un visitante sin cuenta puede ver y explorar. Es la "cara" del producto y la primera impresión.
> **Prerequisito:** Crear los layouts compartidos (especialmente `PublicLayout`).

| # | Nombre | Ruta | Descripción |
|---|---|---|---|
| 1.1 | Landing page | `/` | Hero con headline + CTA principal, sección de Features (3 pilares: empresas / universidades / profesores), sección de Testimonials/Social proof. |
| 1.2 | Catálogo de cursos | `/cursos` | Grid de cursos con filtros laterales (categoría, nivel, duración, organización). Cada card muestra: portada, título, organización, rating, número de inscritos, precio/gratuito. |
| 1.3 | Resultados de búsqueda | `/cursos/buscar?q=` | Igual al catálogo pero orientado a búsqueda — barra de búsqueda prominente, filtros, estado vacío si no hay resultados. |
| 1.4 | Página de curso (pública) | `/cursos/:slug` | Vista completa del curso antes de inscribirse: portada, descripción, temario (bloques colapsables sin revelar contenido), instructor/org, requisitos, a quién va dirigido, botón CTA de inscripción. |
| 1.5 | Perfil de organización | `/org/:slug` | Logo, nombre, descripción, industria, número de cursos y estudiantes. Lista de cursos publicados. |
| 1.6 | Cursos de una organización | `/org/:slug/cursos` | Todos los cursos de esa org con filtros. |
| 1.7 | Perfil de instructor | `/instructor/:slug` | Foto, bio, áreas de expertise, cursos publicados, estadísticas (estudiantes, valoración). |

**Componentes clave a crear en esta fase:**
- `Navbar` (flotante, con glassmorphism suave)
- `Footer`
- `CourseCard` (reutilizable en catálogo, org, búsqueda)
- `HeroSection`
- `SearchBar`
- `FilterSidebar`
- `CourseStructureAccordion` (temario en página de curso)
- `OrgCard` / `InstructorCard`

---

### Fase 2 — Identidad y Acceso

> **Objetivo:** Flujos de autenticación y configuración inicial de perfiles. Simple y sin fricción.

| # | Nombre | Ruta | Descripción |
|---|---|---|---|
| 2.1 | Login | `/login` | Email + contraseña. Link a registro. Link a recuperar contraseña. |
| 2.2 | Registro (selección de rol) | `/registro` | Pantalla inicial: elegir entre Estudiante / Organización / Profesor. Cada opción con ícono, título y descripción corta. |
| 2.3 | Registro estudiante | `/registro/estudiante` | Formulario: nombre, email, contraseña. Paso 2 opcional: intereses (categorías de cursos). |
| 2.4 | Registro organización | `/registro/organizacion` | Formulario: nombre de org, industria, sitio web, email de contacto, logo. |
| 2.5 | Registro instructor | `/registro/instructor` | Formulario: nombre, bio, áreas de expertise, foto de perfil. |
| 2.6 | Editar perfil de usuario | `/perfil/editar` | Edición de datos personales, foto, bio, redes. |
| 2.7 | Editar perfil de organización | `/org/configuracion` | Logo, descripción, industria, equipo, redes sociales. |
| 2.8 | Recuperar contraseña | `/recuperar-contrasena` | Input de email + pantalla de confirmación de envío. |

**Componentes clave:**
- `AuthCard` (wrapper centrado para forms de auth)
- `RoleSelector` (tarjetas de selección de rol)
- `StepIndicator` (para onboarding multi-paso)
- `AvatarUpload` / `LogoUpload`

---

### Fase 3 — Experiencia de Aprendizaje (Estudiante)

> **Objetivo:** El corazón del producto. El flujo completo de un estudiante desde que entra a su dashboard hasta que completa un bloque.
> **Especial atención:** El sistema de bloques con ventana de tiempo es el diferenciador de Nexora — debe comunicarse visualmente de forma clara.

| # | Nombre | Ruta | Descripción |
|---|---|---|---|
| 3.1 | Dashboard del estudiante | `/dashboard` | Cursos en progreso (con % de avance y bloque activo), cursos completados recientes, actividad reciente. Bloque activo con countdown visible si hay uno en curso. |
| 3.2 | Mis cursos | `/mis-cursos` | Lista completa de cursos inscritos, con estado: En progreso / Completado / No iniciado. Filtros por estado. |
| 3.3 | Vista del curso (mapa de bloques) | `/aprendizaje/:cursoSlug` | Roadmap visual del curso: lista de bloques con estado de cada uno (bloqueado / activo / completado / reprobado). Si hay un bloque activo, muestra countdown y % de progreso del bloque. |
| 3.4 | Vista de bloque (unidades) | `/aprendizaje/:cursoSlug/bloque/:bloqueId` | Header con nombre del bloque, countdown de tiempo restante, barra de progreso. Lista de unidades con estado (pendiente / en progreso / completada). |
| 3.5 | Player de unidad | `/aprendizaje/:cursoSlug/bloque/:bloqueId/unidad/:unidadId` | Layout fullscreen (`LearningLayout`). Panel izquierdo: lista de contenido de la unidad (video, materiales, ejercicios). Área central: contenido activo. Panel derecho: notas del estudiante. |
| 3.6 | Examen final de bloque | `/aprendizaje/:cursoSlug/bloque/:bloqueId/examen` | Pantalla limpia de examen: pregunta actual, indicador de progreso (pregunta 3 de 10), opciones de respuesta. Sin distracciones. |
| 3.7 | Resultados del bloque | `/aprendizaje/:cursoSlug/bloque/:bloqueId/resultados` | Muestra: nota obtenida, estado (Aprobado ✓ / Reprobado / Tiempo agotado), desglose de respuestas. CTA: continuar al siguiente bloque (si aprobó) o reintentar (si reprobó). |
| 3.8 | Confirmación de reintentar bloque | `/aprendizaje/:cursoSlug/bloque/:bloqueId/reintentar` | Explica que el reintento tendrá un tiempo reducido (porque ya avanzó parte del contenido). Muestra: tiempo original, tiempo del reintento. Botón de confirmar. |
| 3.9 | Bloque bloqueado | `/aprendizaje/:cursoSlug/bloque/:bloqueId/bloqueado` | Pantalla informativa: "Este bloque aún no está disponible". Muestra qué bloque previo se debe completar primero. |
| 3.10 | Mis certificados | `/mis-certificados` | Grid de certificados obtenidos. Cada certificado: nombre del curso, organización, fecha, nota final. Botón de descargar/compartir (mockup). |

**Componentes clave:**
- `BlockRoadmap` (mapa visual de bloques del curso)
- `BlockStatusBadge` (activo / bloqueado / completado / reprobado)
- `CountdownTimer` (tiempo restante del bloque — visual prominent)
- `UnitPlayer` (wrapper del player de video + tabs de contenido)
- `ExamQuestion` (pregunta con opciones múltiples)
- `ResultsCard` (nota + estado + siguiente acción)
- `CertificateCard`

---

### Fase 4 — Panel Creador

> **Objetivo:** Herramientas para que organizaciones, universidades e instructores creen y gestionen sus cursos, y visualicen el desempeño de sus estudiantes.

| # | Nombre | Ruta | Descripción |
|---|---|---|---|
| 4.1 | Dashboard del creador | `/creator/dashboard` | Métricas clave: cursos activos, total de inscritos, tasa de completación, completadores este mes. Lista de cursos recientes con actividad. |
| 4.2 | Lista de cursos creados | `/creator/cursos` | Tabla/grid de cursos propios. Estado: Borrador / Publicado / Archivado. Acciones rápidas: editar, ver inscritos, archivar. |
| 4.3 | Crear nuevo curso | `/creator/cursos/nuevo` | Formulario multi-paso: (1) Metadata básica — título, descripción corta, descripción larga, categoría, nivel, portada. (2) Público objetivo y requisitos. (3) Precio (gratuito / de pago). |
| 4.4 | Editor de bloques | `/creator/cursos/:id/bloques` | Vista tipo kanban o lista vertical. Cada bloque tiene: nombre, tiempo asignado, número de unidades. Acciones: reordenar, editar, eliminar, agregar nuevo bloque. |
| 4.5 | Configuración de bloque | `/creator/cursos/:id/bloques/:bloqueId/editar` | Formulario: nombre del bloque, descripción, duración disponible (en días/semanas), nota mínima de aprobación, modo de apertura (manual por el creador / automático al completar bloque anterior). |
| 4.6 | Editor de unidades | `/creator/cursos/:id/bloques/:bloqueId/unidades` | Lista de unidades del bloque. Cada unidad puede ser: Video / Material / Ejercicio / Examen. Reordenable. |
| 4.7 | Editor de unidad | `/creator/cursos/:id/bloques/:bloqueId/unidades/:unidadId` | Formulario según tipo: Video (título, upload/URL), Material (archivo adjunto, descripción), Ejercicio (enunciado, tipo: abierto/código), Examen (banco de preguntas con opciones múltiples, respuesta correcta, peso de cada pregunta). |
| 4.8 | Inscritos de un curso | `/creator/cursos/:id/inscritos` | Tabla: estudiante, fecha de inscripción, bloque actual, % progreso general, último acceso. Buscable y filtrable. |
| 4.9 | Completadores de un curso | `/creator/cursos/:id/completadores` | Tabla: estudiante, fecha de inicio, fecha de finalización, nota final, tiempo total invertido. Exportable (mockup). |
| 4.10 | Analytics del curso | `/creator/cursos/:id/analiticas` | Gráficas: inscritos por semana, tasa de abandono por bloque, distribución de notas, tiempo promedio por bloque. |

**Componentes clave:**
- `CourseStatusBadge` (borrador / publicado / archivado)
- `BlockEditor` (item de bloque editable con drag handle)
- `UnitTypeSelector` (video / material / ejercicio / examen)
- `ExamBuilder` (constructor de preguntas con opciones)
- `EnrolledTable` (tabla de estudiantes inscritos)
- `CompletorsTable` (tabla de completadores)
- `AnalyticsChart` (recharts o similar — decidir en esa fase)

---

### Fase 5 — Conexión Laboral (Reclutamiento)

> **Objetivo:** El diferenciador estratégico de Nexora. Empresas buscan talento filtrando por cursos completados — de su propia organización o de otras.

| # | Nombre | Ruta | Descripción |
|---|---|---|---|
| 5.1 | Buscador de talento | `/talent/buscar` | Filtros: curso completado (selector de curso/org), nota mínima, fecha de completación, habilidades adicionales del perfil. Resultados en cards. |
| 5.2 | Perfil de candidato (vista reclutador) | `/talent/candidato/:id` | Vista del perfil público del estudiante desde los ojos de la empresa. Muestra: cursos completados + notas, skills, disponibilidad, botón de "Guardar candidato" / "Contactar". |
| 5.3 | Candidatos guardados | `/talent/guardados` | Pipeline simple: lista de candidatos guardados por el reclutador, con notas internas y estado (por contactar / en proceso / descartado). |
| 5.4 | Búsquedas guardadas | `/talent/mis-busquedas` | Búsquedas guardadas con nombre, filtros aplicados, cantidad de resultados. Botón de re-ejecutar búsqueda. |
| 5.5 | Perfil público del estudiante | `/perfil/:username` | Vista pública del perfil — credenciales y cursos completados visibles para reclutadores. El estudiante puede controlar qué se muestra. |

**Componentes clave:**
- `TalentCard` (card de candidato en resultados)
- `TalentFilters` (sidebar de filtros de búsqueda de talento)
- `CandidatePipeline` (vista kanban simple de candidatos guardados)
- `CredentialBadge` (insignia de curso completado con nota)

---

### Fase 6 — Detalles y Polish

> **Objetivo:** Completar la experiencia con las pantallas de soporte, estados vacíos y configuración.

| # | Nombre | Ruta | Descripción |
|---|---|---|---|
| 6.1 | Centro de notificaciones | `/notificaciones` | Lista de notificaciones: bloque activado, bloque próximo a vencer, curso completado, candidato encontrado, etc. Marcar como leído. |
| 6.2 | Configuración de cuenta | `/configuracion` | Tabs: Perfil / Seguridad / Notificaciones / Plan. |
| 6.3 | Seguridad | `/configuracion/seguridad` | Cambio de contraseña, sesiones activas, 2FA (mockup). |
| 6.4 | Preferencias de notificaciones | `/configuracion/notificaciones` | Toggles por tipo de notificación: email, en plataforma. |
| 6.5 | Página 404 | `*` | Diseño amigable con mensaje y botón de volver al inicio. |
| 6.6 | Estados vacíos | — | No es una ruta, sino un componente reutilizable para cada sección cuando no hay datos. Ilustración + mensaje + CTA contextual. |

---

### Fase 7 — Panel de Administración (Plataforma)

> **Objetivo:** Herramientas para el superadmin de Nexora — moderación, métricas globales, gestión de usuarios y organizaciones.
> **Nota:** Esta fase es la más alejada del usuario final y puede dejarse para el final del mockup o simplificarse.

| # | Nombre | Ruta | Descripción |
|---|---|---|---|
| 7.1 | Dashboard admin | `/admin/dashboard` | Métricas globales: usuarios totales, cursos activos, inscritos esta semana, ingresos (mockup). |
| 7.2 | Gestión de usuarios | `/admin/usuarios` | Tabla de todos los usuarios. Filtros por rol, estado. Acciones: suspender, cambiar rol, ver perfil. |
| 7.3 | Gestión de organizaciones | `/admin/organizaciones` | Tabla de orgs. Estado: verificada / pendiente / suspendida. Acción de verificar/rechazar. |
| 7.4 | Moderación de cursos | `/admin/cursos` | Cursos pendientes de revisión. Vista de detalle para aprobar/rechazar con motivo. |
| 7.5 | Reportes globales | `/admin/reportes` | Gráficas de actividad de la plataforma: crecimiento de usuarios, cursos más populares, tasa de completación global. |

---

## Resumen de pantallas por fase

| Fase | Pantallas | Estado |
|---|---|---|
| 1 — Vitrina pública | 7 | ✅ Completo |
| 2 — Identidad y acceso | 8 | ✅ Completo |
| 3 — Experiencia de aprendizaje | 10 | ✅ Completo |
| 4 — Panel creador | 10 | ✅ Completo |
| 5 — Conexión laboral | 5 | ✅ Completo |
| 6 — Detalles y polish | 6 | ✅ Completo |
| 7 — Panel admin | 5 | ✅ Completo |
| **Total** | **51** | ✅ **Mockup completo** |

---

## Convenciones para el agente implementador

> Estas reglas aplican a **toda** la implementación. El agente debe respetarlas siempre.

### Estructura de archivos

```
src/
├── components/          # Componentes reutilizables
│   ├── ui/              # Primitivos: Button, Card, Badge, Input, Modal
│   ├── layout/          # PublicLayout, StudentLayout, CreatorLayout, etc.
│   └── [feature]/       # Componentes por feature: course/, learning/, creator/
├── pages/               # Una carpeta por fase
│   ├── public/          # Fase 1
│   ├── auth/            # Fase 2
│   ├── student/         # Fase 3
│   ├── creator/         # Fase 4
│   ├── talent/          # Fase 5
│   └── admin/           # Fase 7
├── data/                # Mock data en .ts — sin backend
├── types/               # Interfaces TypeScript
└── router/              # Configuración de React Router
```

### Datos mock

- Todos los datos viven en `src/data/` como arrays de objetos TypeScript.
- Usar datos realistas (no "Lorem ipsum") — nombres reales, descripciones coherentes con Nexora.
- Mínimo 6–8 items por colección (cursos, estudiantes, orgs) para que los listados se vean bien.

### Paleta de colores (usar siempre las variables CSS)

```
--color-primary       #2D4A3E   verde musgo profundo
--color-primary-light #4A7C59   verde musgo claro
--color-gold          #C9A84C   dorado cálido (CTA principal)
--color-gold-hover    #B8970A   dorado oscuro (hover del CTA)
--color-bg            #FAF7EF   crema/beige cálido (fondo)
--color-surface       #F2EDE1   beige más oscuro (cards)
--color-text          #1A1C14   casi negro cálido
--color-text-muted    #5C6355   texto secundario
--color-border        #E8E0D0   bordes beige
```

### Reglas de implementación

- **Sin emojis como íconos** — usar siempre Lucide React.
- **`cursor-pointer`** en todos los elementos clickeables.
- **Transiciones:** `transition-colors duration-200` como mínimo en hover.
- **Responsive obligatorio:** 375px (mobile), 768px (tablet), 1024px (desktop).
- **Navbar flotante:** `fixed top-4 left-4 right-4` — nunca `top-0 left-0`.
- **Contraste mínimo 4.5:1** para texto sobre fondo.
- **Plus Jakarta Sans** para toda la tipografía.
- Los botones CTA siempre en dorado (`--color-gold`), texto oscuro (`--color-text`).
- Los botones de acción secundaria en `--color-primary` (verde), texto blanco.
