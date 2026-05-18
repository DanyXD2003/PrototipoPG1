# Nexora — Guía para agentes de IA

> Este archivo es leído automáticamente por Claude Code y otros agentes al iniciar una sesión.
> La carpeta `docs/` es la memoria del proyecto. **Siempre consultarla antes de implementar.**

---

## El proyecto

**Nexora** es una plataforma de aprendizaje impulsada por IA que conecta directamente con el mercado laboral. Es un mockup frontend — sin backend, solo React + datos mock.

Funciona como un marketplace de tres lados:
- **Empresas** crean cursos de onboarding y contratan buscando quién los completó.
- **Universidades** crean cursos de prestigio que otras empresas usan como filtro de contratación.
- **Profesores independientes** publican sus propios cursos.

Diferenciador clave: cursos divididos en **bloques con ventana de tiempo activa** — el creador define cuánto tiempo tiene el estudiante por bloque; si no aprueba, repite con tiempo reducido.

---

## Documentación del proyecto (leer antes de implementar)

| Archivo | Contenido | Cuándo leerlo |
|---|---|---|
| `docs/design.md` | Sistema de diseño completo: paleta, tipografía, componentes, reglas de UI | **Siempre** — antes de escribir cualquier componente |
| `docs/planes/roadmap.md` | 7 fases, 51 pantallas, rutas, estructura de archivos, convenciones de código | **Siempre** — antes de implementar cualquier pantalla |
| `docs/planes/fase-*.md` | Plan detallado de cada fase (se crean antes de implementar esa fase) | Cuando vayas a implementar una fase específica |
| `docs/design-system/learning-platform/MASTER.md` | Design system generado por el skill ui-ux-pro-max | Como referencia técnica adicional de diseño |

---

## Stack técnico

| Capa | Tecnología | Versión |
|---|---|---|
| Framework | Vite + React + TypeScript | React 19, Vite 8 |
| Estilos | Tailwind CSS v4 | 4.3.0 |
| Íconos | Lucide React | 1.16.0 |
| Routing | React Router DOM | 7.15.1 |
| Package manager | pnpm | 10.33.0 |

---

## Cómo usar el skill UI/UX Pro Max

Este repositorio tiene instalado el skill `ui-ux-pro-max` en `.claude/skills/ui-ux-pro-max/`. Es un motor de diseño con base de datos de 67 estilos, 161 paletas, 57 tipografías y guías de UX.

### Cuándo usarlo

Antes de implementar cualquier componente o pantalla nueva, especialmente si:
- No está descrita en `docs/design.md`
- Necesitas más opciones de estilo o tipografía
- Quieres verificar buenas prácticas de UX para un patrón específico

### Flujo de uso

**1. Generar o consultar el Design System:**
```bash
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "descripción del componente o pantalla" --design-system -p "Nexora"
```

**2. Búsqueda por dominio específico:**
```bash
# Estilos visuales
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "minimal flat saas" --domain style

# Buenas prácticas UX
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "animation loading states" --domain ux

# Estructura de landing
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "hero cta social proof" --domain landing

# Tipografías
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "professional modern saas" --domain typography
```

**3. Guidelines del stack React:**
```bash
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "hooks performance state" --stack react
```

### Regla de oro del skill

- Cuanto más específico el query, mejor el resultado.
- `"B2B SaaS dashboard analytics profesional"` > `"dashboard"`
- El Design System de Nexora ya está definido en `docs/design.md` — úsalo como base y el skill como complemento.

---

## Paleta de colores (usar siempre las variables CSS)

```css
--color-primary        #2D4A3E   /* verde musgo profundo — fondo de botones secundarios */
--color-primary-light  #4A7C59   /* verde musgo claro — hover */
--color-gold           #C9A84C   /* dorado cálido — CTA principal */
--color-gold-hover     #B8970A   /* dorado oscuro — hover del CTA */
--color-bg             #FAF7EF   /* crema/beige cálido — fondo de página */
--color-surface        #F2EDE1   /* beige más oscuro — fondo de cards */
--color-text           #1A1C14   /* casi negro cálido — texto principal */
--color-text-muted     #5C6355   /* texto secundario */
--color-border         #E8E0D0   /* bordes */
```

---

## Reglas de implementación (no negociables)

- **Íconos:** solo Lucide React — nunca emojis como íconos.
- **`cursor-pointer`** en todos los elementos clickeables sin excepción.
- **Transiciones:** mínimo `transition-colors duration-200` en hovers.
- **Navbar:** siempre flotante con `fixed top-4 left-4 right-4`, nunca pegada a `top-0`.
- **Fuente:** Plus Jakarta Sans para toda la tipografía (ya importada en `index.css`).
- **Responsive:** diseñar para 375px primero, luego 768px, 1024px, 1440px.
- **Contraste:** mínimo 4.5:1 para texto — nunca usar `--color-text-muted` en texto importante.
- **Botones CTA:** fondo `--color-gold`, texto `--color-text` (oscuro).
- **Botones secundarios:** fondo `--color-primary`, texto blanco.
- **Datos mock:** en `src/data/` como arrays TypeScript — datos realistas, nunca "Lorem ipsum".
- **Sin backend:** todo es estático/mock. Nada de llamadas a APIs reales.

---

## Estructura de archivos esperada

```
src/
├── components/
│   ├── ui/              # Primitivos reutilizables: Button, Card, Badge, Input
│   ├── layout/          # PublicLayout, StudentLayout, CreatorLayout, etc.
│   └── [feature]/       # Componentes por feature
├── pages/
│   ├── public/          # Fase 1 — vitrina
│   ├── auth/            # Fase 2 — autenticación
│   ├── student/         # Fase 3 — aprendizaje
│   ├── creator/         # Fase 4 — panel creador
│   ├── talent/          # Fase 5 — reclutamiento
│   └── admin/           # Fase 7 — administración
├── data/                # Mock data .ts
├── types/               # Interfaces TypeScript
└── router/              # Configuración React Router
```

---

## Workflow del equipo

- **Claude** → arquitectura, diseño, planes, decisiones de UX, documentación.
- **Agente implementador (Minimax)** → implementa los planes descritos en `docs/planes/`.
- Los planes en `docs/planes/fase-*.md` son el contrato entre ambos agentes — deben seguirse al pie de la letra.
- Si algo no está claro en el plan, preguntar antes de inventar.
