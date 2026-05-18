# Nexora — Design System

> Documento maestro de decisiones de diseño. Todo lo acordado entre sesiones vive aquí.

---

## El Producto

**Nexora** es una plataforma de aprendizaje impulsada por IA que conecta directamente con el mercado laboral. Funciona como un marketplace de tres lados:

- **Empresas** crean cursos de onboarding para que sus nuevas contrataciones ya conozcan sus procesos desde el día uno.
- **Universidades** crean cursos de prestigio que otras empresas buscan activamente al momento de contratar.
- **Profesores independientes** publican sus propios cursos en la plataforma.
- **Cualquier empresa** puede buscar quién completó los cursos de otra empresa o universidad para contratar directamente desde ahí.

---

## Nombre y Tagline

| | |
|---|---|
| **Nombre** | Nexora |
| **Origen** | Nexus (conexión aprendizaje–empleo) + Ora (conocimiento, sabiduría) |
| **Taglines sugeridos** | "Learn. Certify. Get Hired." |
| | "Where skills become credentials. Credentials become careers." |
| | "The platform where every course opens a door." |

---

## Audiencia

| Segmento | Rol en la plataforma |
|---|---|
| Empresas | Crean cursos de onboarding / contratan desde la plataforma |
| Universidades | Crean cursos de prestigio para atraer empleadores |
| Profesores independientes | Publican cursos propios |

---

## Stack técnico

| Capa | Tecnología |
|---|---|
| Framework | Vite + React 19 + TypeScript |
| Estilos | Tailwind CSS v4 |
| Íconos | Lucide React |
| Package manager | pnpm |

---

## Paleta de colores

| Rol | Hex | Variable CSS | Justificación |
|---|---|---|---|
| Primary | `#2D4A3E` | `--color-primary` | Verde musgo profundo — confianza, crecimiento |
| Primary Light | `#4A7C59` | `--color-primary-light` | Verde musgo claro — hover, acentos |
| CTA / Gold | `#C9A84C` | `--color-gold` | Dorado cálido — logro, prestigio, conversión |
| CTA Hover | `#B8970A` | `--color-gold-hover` | Dorado más oscuro en hover |
| Background | `#FAF7EF` | `--color-bg` | Crema/beige cálido — calidez, premium |
| Surface | `#F2EDE1` | `--color-surface` | Beige ligeramente más oscuro — cards, secciones |
| Text | `#1A1C14` | `--color-text` | Casi negro con matiz cálido |
| Text Muted | `#5C6355` | `--color-text-muted` | Texto secundario, matiz musgo |
| Border | `#E8E0D0` | `--color-border` | Bordes beige cálido |

**Filosofía de color:** Dorado = prestigio/logro, Verde musgo = crecimiento/aprendizaje, Beige = accesibilidad/calidez. Paleta premium y única — evita los azules genéricos de SaaS.

---

## Tipografía

| Rol | Fuente | Peso |
|---|---|---|
| Heading | Plus Jakarta Sans | 600, 700 |
| Body | Plus Jakarta Sans | 400, 500 |
| Muted / Caption | Plus Jakarta Sans | 300, 400 |

**Import CSS:**
```css
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap');
```

**Escala tipográfica:**

| Token | Tamaño | Line-height | Uso |
|---|---|---|---|
| Display | 56–64px | 1.1 | Hero headline |
| H1 | 40–48px | 1.15 | Títulos de sección |
| H2 | 28–32px | 1.2 | Subtítulos |
| H3 | 20–24px | 1.3 | Títulos de card |
| Body | 16–18px | 1.6 | Texto corrido |
| Small | 14px | 1.5 | Labels, captions |

---

## Estilo visual

**Estilo:** Flat Design Minimal (con calidez orgánica por la paleta beige/musgo/dorado)

**Principios:**
- Espaciado generoso — máximo blanco/beige entre elementos
- Sin gradientes ni sombras fuertes
- Transiciones suaves: `150–200ms ease`
- Bordes redondeados: `8px` cards pequeñas, `12–16px` cards grandes
- Sin emojis como íconos — solo SVG (Lucide React)

---

## Reglas de componentes

### Botones

| Variante | Fondo | Texto | Hover |
|---|---|---|---|
| Primary (CTA) | `#C9A84C` (gold) | `#1A1C14` | `#B8970A` + `translateY(-1px)` |
| Secondary | Transparente | `#2D4A3E` | `bg-surface` |
| Outline | Transparente | `#2D4A3E` | border `#2D4A3E` fill |

- Padding: `12px 24px`
- Border-radius: `8px`
- Font-weight: `600`
- Siempre `cursor-pointer`

### Cards

- Background: `#F2EDE1` (surface)
- Border: `1px solid #E8E0D0`
- Border-radius: `12px`
- Padding: `24px`
- Hover: sombra suave + `translateY(-2px)`
- `cursor-pointer` cuando sean clickeables

### Navbar

- Floating: `top-4 left-4 right-4` (nunca pegado al borde)
- Background: `rgba(250,247,239,0.85)` + backdrop-blur
- Border: `1px solid #E8E0D0`

---

## Reglas de accesibilidad (prioridad crítica)

- Contraste mínimo **4.5:1** para texto normal
- Touch targets mínimo **44×44px**
- `cursor-pointer` en **todos** los elementos clickeables
- Focus rings visibles para navegación por teclado
- `prefers-reduced-motion` respetado
- `alt` text en todas las imágenes con significado
- Formularios con `<label>` asociado

---

## Responsive breakpoints

| Nombre | Ancho | Notas |
|---|---|---|
| Mobile | 375px | Base — diseñar aquí primero |
| Tablet | 768px | Ajuste de grid |
| Desktop | 1024px | Layout completo |
| Wide | 1440px | Max-width content |

---

## Secciones de la landing page

1. **Hero** — Headline + subtítulo + CTA principal + prueba visual
2. **Features / Beneficios** — Los 3 pilares: Empresas / Universidades / Profesores
3. **Testimonials / Social proof** — Quotes, logos, stats de confianza

---

## Anti-patrones (no hacer)

- ❌ Emojis como íconos
- ❌ Dark mode por defecto
- ❌ Gradientes de color intensos
- ❌ Animaciones excesivas (>300ms o múltiples a la vez)
- ❌ Hover con `scale` que cause layout shift
- ❌ Texto con contraste insuficiente
- ❌ Elementos clickeables sin `cursor-pointer`
- ❌ Navbar pegada a `top-0 left-0` sin espaciado
- ❌ Contenido oculto detrás de navbars fijas
