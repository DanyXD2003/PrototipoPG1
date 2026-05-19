## Mejoras implementadas

Este archivo registra las mejoras solicitadas durante el desarrollo y en qué fase se implementaron.

---

### ✅ Candidatos que completaron un curso — visibles desde la página del curso
> Implementado en **Fase 6** (`CourseDetailPage`)

Cuando el usuario logueado es una organización, aparece una sección al final de la página del curso con un botón "Buscar candidatos →" que navega al mercado de talento con los filtros del curso pre-aplicados (`location.state`).

---

### ✅ Panel creador: ver detalle de curso con lista de completadores
> Implementado en **Fase 4** (`CourseCompletersPage`, `CourseEnrolledPage`)

Desde el panel creador, al abrir un curso se puede navegar a las secciones de inscritos y completadores, con tabla de estudiantes, notas y progreso.

---

### ✅ Visibilidad pública/privada de cursos completados
> Implementado en **Fase 6** (`MyCoursesPage`)

En el tab "Completados" de Mis Cursos, cada curso tiene un toggle de dos botones (Público / Privado) con íconos Lucide `Eye` y `Lock`. Cambia el estado con toast de confirmación.

---

### ✅ Barra de búsqueda en catálogos de organizaciones e instructores
> Implementado en **Fase 6** (`OrgCatalogPage`, `InstructorsCatalogPage`)

Ambas páginas tienen una barra de búsqueda en el header que filtra en tiempo real. Orgs filtra por nombre e industria; instructores filtra por nombre, título y áreas de expertise. Muestra `EmptyState` si no hay resultados.

---

### ✅ Eliminar imágenes de perfil del mercado de talento
> Implementado en **Fase 5** (`TalentCard`, `SavedCandidatesPage`)

Se eliminaron los `<img>` de avatares en las tarjetas de candidatos y en la tabla de guardados. Reemplazados por un círculo verde `#2D4A3E` con la inicial del nombre en blanco.
