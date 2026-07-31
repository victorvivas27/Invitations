# Invitation agent guide

Invitation is the technical foundation for a web application that will create and share children's birthday invitations.

## Stack

- Backend: Java 21, Spring Boot, Gradle, JPA, Flyway, PostgreSQL/H2, Security, JaCoCo and PMD.
- Frontend: React, TypeScript, Vite, pnpm, React Router, Vitest, Testing Library and Oxlint.
- Infrastructure: Docker Compose and GitHub Actions.

## Rules

- Implement only explicitly requested functionality; do not anticipate business features.
- Never commit credentials or real secrets. Use environment variables and documented examples.
- Prefer small, verifiable changes and preserve the domain-oriented package structure.
- Keep development, test and production configuration separate.

## Structure

- `backend/`: Spring Boot API.
- `frontend/`: React client.
- `.github/workflows/`: CI validation.
- `.agents/tasks/`: task specifications, in execution order:
  1. [01-create-project-foundation.md](tasks/01-create-project-foundation.md)
  2. [02-initialize-git-baseline.md](tasks/02-initialize-git-baseline.md)

## Validation

- Backend: `cd backend && ./gradlew clean test check bootJar`
- Frontend: `cd frontend && pnpm install && pnpm exec tsc -b && pnpm lint && pnpm test && pnpm build`
- Infrastructure: `docker compose config`
- Repository: `git diff --check`

## Reglas generales de diseño y experiencia de usuario

Todo desarrollo visual del proyecto debe seguir un enfoque **mobile-first**.

### Mobile-first

* Diseñar primero para pantallas móviles.
* La primera referencia debe ser un teléfono con un ancho aproximado de `375px`.
* Después de validar la versión móvil, adaptar el diseño para tablet y escritorio.
* No crear primero la versión de escritorio para después reducirla.
* Evitar anchos fijos que provoquen desplazamiento horizontal.
* Botones, campos y controles deben ser cómodos para interacción táctil.
* Las acciones principales deben ser fácilmente accesibles con una mano.
* Los formularios deben mostrar pocos campos por sección y evitar pantallas saturadas.

### Estilo visual

La interfaz debe utilizar un estilo **iOS-inspired** o **Apple-style UI**, adaptado a una plataforma infantil de invitaciones.

Debe incluir:

* Diseño limpio y moderno.
* Bordes redondeados.
* Tarjetas con profundidad sutil.
* Sombras suaves.
* Espaciado amplio.
* Tipografía clara y legible.
* Colores alegres sin saturar la pantalla.
* Fondos suaves.
* Transparencias y desenfoques moderados cuando aporten claridad.
* Jerarquía visual evidente.
* Iconos simples y consistentes.

El resultado debe sentirse infantil y amigable, pero no desordenado ni excesivamente caricaturesco.

### Animaciones

Las animaciones deben inspirarse en la experiencia de iOS:

* Transiciones fluidas.
* Movimientos naturales.
* Animaciones con efecto `spring`.
* Apariciones y desapariciones suaves.
* Respuesta visual inmediata al tocar botones.
* Cambios progresivos entre pasos de formularios.
* Microinteracciones al seleccionar plantillas, colores o imágenes.
* Animaciones suaves en modales, menús y paneles.
* Vista previa de la invitación actualizada de manera fluida.

Las animaciones deben ayudar al usuario a comprender la interfaz. No deben utilizarse únicamente como decoración.

### Rendimiento y accesibilidad

* Respetar `prefers-reduced-motion`.
* Evitar animaciones largas o repetitivas.
* Evitar movimientos que bloqueen la interacción.
* Mantener una duración habitual entre `150ms` y `400ms`.
* Usar animaciones más largas solo en cambios importantes de pantalla.
* Garantizar contraste suficiente entre texto y fondo.
* Mantener un tamaño táctil mínimo aproximado de `44px`.
* No depender únicamente del color para comunicar estados.
* Validar el diseño en móvil, tablet y escritorio.

### Consistencia

Antes de crear un componente visual nuevo:

1. Revisar si ya existe un componente reutilizable.
2. Mantener los mismos radios, sombras, espaciados y transiciones.
3. Evitar estilos aislados que no coincidan con el sistema visual.
4. Centralizar colores, tamaños, bordes y animaciones mediante variables o tokens de diseño.
5. No introducir una librería visual nueva sin una justificación técnica.

### Restricción

No implementar diseños genéricos de panel administrativo para las páginas principales de invitaciones.

La experiencia debe sentirse como una aplicación móvil moderna para crear invitaciones infantiles, incluso cuando se utilice desde el navegador.
