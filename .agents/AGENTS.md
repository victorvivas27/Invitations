# Invitation agent guide

Invitation is a working web application to create, publish and share digital event
invitations. Birthday parties are the primary use case, but the domain already
supports several event types (`BIRTHDAY`, `BAPTISM`, `WEDDING`, `BABY_SHOWER`,
`KIDS_PARTY`, `ANNIVERSARY`, `GRADUATION`, `OTHER`).

The product is deployed: backend on Google Cloud Run, frontend on Vercel, images
on Cloudinary, database on PostgreSQL.

## Stack

- Backend: Java 21, Spring Boot 4.1, Gradle, Spring MVC, Spring Data JPA, Bean
  Validation, Flyway, PostgreSQL (prod/dev) and H2 (tests), Spring Security with
  JWT (`spring-security-oauth2-jose`), Spring Mail (Gmail SMTP), Cloudinary SDK,
  JaCoCo (minimum 50% coverage) and PMD.
- Frontend: React 19, TypeScript 6, Vite 8, pnpm 10.15.1, React Router 7,
  CSS Modules + CSS custom properties, Vitest 4 with Testing Library and jsdom,
  ESLint + Oxlint, Prettier. No animation library: animations are plain CSS plus
  `IntersectionObserver` (`src/shared/animation/`).
- Infrastructure: Docker Compose, GitHub Actions (CI + backend deploy to Cloud
  Run via Artifact Registry, region `southamerica-west1`), Vercel for the
  frontend (including the `frontend/api/` serverless function), Cloudinary for
  image storage.

## Rules

- Implement only explicitly requested functionality; do not anticipate business features.
- Never commit credentials or real secrets. Use environment variables and documented examples.
- Prefer small, verifiable changes and preserve the domain-oriented package structure.
- Keep development, test and production configuration separate.

## Structure

- `backend/`: Spring Boot API. Packages are organised per bounded context
  (`user`, `auth`, `activation`, `invitation`, `config`, `shared`), and each one
  is layered as `domain/` → `application/` (with `port/` interfaces and
  `service/` implementations) → `infrastructure/` (adapters, persistence) →
  `web/` (controllers, request/response records).
  - Domain models are Java `record`s with validation in the compact constructor.
  - Schema changes go through Flyway (`src/main/resources/db/migration`,
    currently `V1`–`V13`); `ddl-auto` is `validate` outside the `dev` profile.
  - Profiles: `application.yml` (defaults) + `application-dev.yml`,
    `application-test.yml` (H2, Flyway disabled), `application-prod.yml`.
    Selected with `APP_PROFILE` (default `dev`).
- `frontend/`: React client.
  - `src/modules/<feature>/` with `components/`, `services/`, `styles/`,
    `types/` and an `index.ts` barrel. Current modules: `auth`, `home`,
    `invitations`, `templates`.
  - `src/shared/`: `animation/`, `components/feedback/`, `components/layout/`,
    `config/`, `styles/`, `utils/`.
  - `src/styles/`: `reset.css`, `variables.css` (design tokens: colours,
    shadows, radii, fonts, light/dark theme), `theme.css`, `globals.css`.
  - `api/invitation-meta.ts`: Vercel function that server-renders Open Graph /
    Twitter Card metadata for `/i/:slug` (see `vercel.json` rewrites).
- `.github/workflows/`: `backend.yml` and `frontend.yml` (CI), `deploy-backend.yml`
  (build + push image + deploy to Cloud Run on `main`).
- `.agents/tasks/`: task specifications, in execution order:
  1. [01-create-project-foundation.md](tasks/01-create-project-foundation.md)
  2. [02-initialize-git-baseline.md](tasks/02-initialize-git-baseline.md)
  3. [03-design-domain-model.md](tasks/03-design-domain-model.md)
  4. [04-implement-user-domain.md](tasks/04-implement-user-domain.md)
  5. [05-implement-user-registration.md](tasks/05-implement-user-registration.md)
  6. [06-implement-login-jwt.md](tasks/06-implement-login-jwt.md)
  7. [07-account-activation.md](tasks/07-account-activation.md)
  8. [08-account-activation-frontend.md](tasks/08-account-activation-frontend.md)
  9. [09-home-ux-ui.md](tasks/09-home-ux-ui.md)
  10. [10-invitation-template-gallery.md](tasks/10-invitation-template-gallery.md)
  11. [11-invitation-creation-wizard.md](tasks/11-invitation-creation-wizard.md)
  12. [12-invitation-persistence-public-page.md](tasks/12-invitation-persistence-public-page.md)
  13. [13-refactorisa.md](tasks/13-refactorisa.md)
  14. [14-fondos-por-seccion.md](tasks/14-fondos-por-seccion.md)
  15. [15-instruccion_animaciones_invitacion.md](tasks/15-instruccion_animaciones_invitacion.md)
  16. [16-instruccion_preparar_app_para_despliegue.md](tasks/16-instruccion_preparar_app_para_despliegue.md)
  17. [17-tarea-metadatos-dinamicos-invitaciones.md](tasks/17-tarea-metadatos-dinamicos-invitaciones.md)
  18. [18-texto-de-la-seccion.md](tasks/18-texto-de-la-seccion.md)
  19. [19-rediseño.md](tasks/19-rediseño.md)
  20. [20-validaciones-y-modales.md](tasks/20-validaciones-y-modales.md)
  21. [21-optimización-responsive-real-para-dispositivos-móviles.md](tasks/21-optimización-responsive-real-para-dispositivos-móviles.md)
  22. [22-migracion_cloudinary.md](tasks/22-migracion_cloudinary.md)
  23. [23-efinamiento-visual-de-la-invitación.md](tasks/23-efinamiento-visual-de-la-invitación.md)
  24. [24-instruccion_revision_mobile.md](tasks/24-instruccion_revision_mobile.md)

## HTTP API

Authenticated with a JWT bearer token issued by `POST /api/auth/login`.

- `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`
- `GET /api/auth/account-activation/validate`, `POST /api/auth/account-activation/complete`
- `POST /api/admin/users` (create pending user + activation email)
- `POST /api/invitations`, `GET /api/invitations`, `DELETE /api/invitations/{publicSlug}`
- `GET /api/invitations/{publicSlug}/guests`
- `GET /api/public/invitations/{slug}`, `/{slug}/metadata`, `/{slug}/share`
- `POST /api/public/invitations/{publicSlug}/rsvps`
- `POST /api/invitation-images`, `POST /api/invitation-images/social`

Frontend routes: `/`, `/login`, `/register`, `/activate-account`, `/templates`,
`/invitations/create`, `/my-invitations`, `/my-invitations/:slug/guests`,
`/i/:slug` and `/view/:slug`.

## Configuration

Environment variables are documented in `.env.example`. Key groups: database
(`DATABASE_URL` or `DB_HOST`/`DB_PORT`/`DB_NAME`/`DB_USER`/`DB_PASSWORD`), JWT
(`JWT_SECRET`, `JWT_ISSUER`, `JWT_EXPIRATION_SECONDS`), CORS/frontend
(`FRONTEND_URL`, `APP_CORS_ALLOWED_ORIGINS`, `VITE_API_BASE_URL`), mail
(`GMAIL_USER`, `GMAIL_APP_PASSWORD`, `EMAIL_FROM`) and Cloudinary
(`CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`,
`CLOUDINARY_UPLOAD_PRESET`). `.env`, `.env.*` and `**/recovery-codes.txt` are
git-ignored.

## Validation

- Backend: `cd backend && ./gradlew clean test check bootJar`
  (`check` runs PMD and the JaCoCo 50% coverage gate).
- Frontend: `cd frontend && pnpm install && pnpm exec tsc -b && pnpm lint && pnpm test && pnpm build`
  (`pnpm lint` runs ESLint and Oxlint; `pnpm format:check` validates Prettier).
- Infrastructure: `docker compose config`
- Repository: `git diff --check`

The repository pins `pnpm@10.15.1` via `packageManager`. If the local pnpm is a
different major version, Corepack refuses to run; use `pnpm@10.15.1` or invoke
the binaries directly (e.g. `node_modules/.bin/vitest run`).

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

El proyecto **no usa Framer Motion, GSAP ni AOS**. Las apariciones se resuelven
con CSS (`src/shared/animation/reveal.css`) y un único `IntersectionObserver`
compartido (`useRevealGroup` / `useRevealed` en `src/shared/animation/useReveal.ts`),
marcando los elementos con `data-reveal`. Las apariciones se ejecutan una sola
vez (`once: true`) para evitar reinicios al hacer scroll en móvil. No introducir
una librería de animaciones sin justificación técnica.

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

Los tokens viven en `frontend/src/styles/variables.css` (paleta, sombras, radios,
tipografías y tema claro/oscuro mediante `:root[data-theme='dark']`). Los estilos
de cada módulo se escriben como CSS Modules dentro de `styles/`.

### Restricción

No implementar diseños genéricos de panel administrativo para las páginas principales de invitaciones.

La experiencia debe sentirse como una aplicación móvil moderna para crear invitaciones infantiles, incluso cuando se utilice desde el navegador.
