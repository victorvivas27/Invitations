# Tarea 01 — Crear la base del proyecto Invitation

## Objetivo

Crear desde cero la estructura inicial de una aplicación web llamada **Invitation**.

La aplicación permitirá posteriormente crear, editar, visualizar y compartir invitaciones infantiles de cumpleaños.

En esta tarea debes crear únicamente la base técnica del proyecto. No implementes todavía funcionalidades de negocio.

---

## Arquitectura requerida

El proyecto debe utilizar:

### Backend

* Java 21.
* Spring Boot.
* Gradle Wrapper.
* Arquitectura modular por dominio.
* Spring Web.
* Spring Validation.
* Spring Data JPA.
* Spring Security.
* PostgreSQL.
* H2 para pruebas.
* Flyway.
* JaCoCo.
* PMD.

### Frontend

* React.
* TypeScript.
* Vite.
* pnpm.
* React Router.
* Vitest.
* Testing Library.
* Oxlint.
* Type checking con TypeScript.

### Infraestructura

* Docker.
* Docker Compose.
* GitHub Actions.
* Variables de entorno.
* Separación entre desarrollo, pruebas y producción.

---

## Estructura general

Crea la siguiente estructura:

```text
Invitation/
├── .agents/
│   ├── AGENTS.md
│   └── tasks/
│       └── 01-create-project-foundation.md
├── backend/
├── frontend/
├── .github/
│   └── workflows/
├── docker-compose.yml
├── .env.example
├── .gitignore
├── .gitattributes
└── README.md
```

---

## Backend

Crea un proyecto Spring Boot dentro de:

```text
backend/
```

Usa un package base coherente, por ejemplo:

```text
com.invitation
```

### Dependencias iniciales

Configura las dependencias necesarias para:

* API REST.
* Validación.
* Persistencia con JPA.
* PostgreSQL.
* H2.
* Migraciones Flyway.
* Seguridad.
* Pruebas.
* Cobertura JaCoCo.
* Análisis PMD.

### Estructura inicial

Crea una estructura base como:

```text
backend/src/main/java/com/invitation/
├── InvitationApplication.java
├── config/
├── shared/
├── security/
└── invitation/
```

Por ahora, los paquetes pueden permanecer vacíos excepto por los archivos mínimos necesarios para compilar.

### Configuración

Crea perfiles para:

* Desarrollo.
* Pruebas.
* Producción.

Evita incluir credenciales reales.

Usa variables de entorno para:

* URL de base de datos.
* Usuario de base de datos.
* Contraseña.
* Secreto JWT.
* Puerto de la aplicación.

### Migraciones

Configura Flyway, pero crea únicamente una migración inicial mínima.

No crees todavía tablas de invitaciones ni usuarios.

La migración inicial puede validar que Flyway está correctamente integrado sin introducir el modelo de negocio.

---

## Frontend

Crea el frontend dentro de:

```text
frontend/
```

Usa:

* React.
* TypeScript.
* Vite.
* pnpm.

### Estructura inicial

```text
frontend/src/
├── app/
├── components/
├── features/
├── layouts/
├── pages/
├── services/
├── hooks/
├── types/
├── utils/
├── test/
├── App.tsx
└── main.tsx
```

### Página inicial

Crea únicamente una página básica que muestre:

```text
Invitation
Create and share beautiful birthday invitations
```

No implementes todavía formularios, temas, autenticación ni invitaciones.

### Scripts requeridos

Configura comandos para:

* Desarrollo.
* Build.
* Tests.
* Cobertura.
* Lint.
* Type checking.

---

## Docker Compose

Crea un archivo:

```text
docker-compose.yml
```

Debe incluir inicialmente:

* PostgreSQL.
* Backend.
* Frontend, si resulta apropiado para el entorno local.

No uses el atributo obsoleto:

```yaml
version:
```

Usa variables de entorno y valores seguros para desarrollo local.

---

## Variables de entorno

Crea:

```text
.env.example
```

Incluye únicamente nombres y valores de ejemplo.

No incluyas secretos reales.

Variables mínimas sugeridas:

```text
POSTGRES_DB
POSTGRES_USER
POSTGRES_PASSWORD
DATABASE_URL
JWT_SECRET
BACKEND_PORT
FRONTEND_PORT
VITE_API_BASE_URL
```

---

## CI/CD

Crea workflows iniciales de GitHub Actions para validar:

### Backend

```bash
./gradlew test
./gradlew check
```

### Frontend

```bash
pnpm install --frozen-lockfile
pnpm exec tsc -b
pnpm lint
pnpm test
pnpm build
```

No configures todavía despliegues automáticos.

En esta tarea, CI debe limitarse a compilación, análisis y pruebas.

---

## Quality Gates

Configura:

### Backend

* PMD.
* JaCoCo.
* Compilación.
* Tests.

Usa inicialmente un umbral de cobertura razonable que permita desarrollar la base del proyecto sin bloquearla artificialmente.

### Frontend

* Oxlint.
* TypeScript.
* Vitest.
* Build de Vite.

No agregues ESLint.

---

## Documentación

Actualiza `README.md` con:

* Descripción breve del proyecto.
* Tecnologías utilizadas.
* Requisitos previos.
* Estructura general.
* Instrucciones para ejecutar backend.
* Instrucciones para ejecutar frontend.
* Instrucciones para ejecutar Docker Compose.
* Comandos de validación.

No documentes funcionalidades que todavía no existen.

---

## Archivo `.agents/AGENTS.md`

Actualiza `.agents/AGENTS.md` para que funcione como punto de entrada para futuros agentes.

Debe incluir:

* Nombre y propósito del proyecto.
* Tecnologías principales.
* Reglas generales.
* Estructura actual.
* Comandos de validación.
* Enlace relativo a esta tarea.
* Regla de no implementar funcionalidades no solicitadas.
* Regla de no incluir secretos.
* Regla de realizar cambios pequeños y verificables.

---

## Restricciones

Durante esta tarea no implementes:

* Registro de usuarios.
* Inicio de sesión.
* JWT funcional.
* Entidad `User`.
* Entidad `Invitation`.
* CRUD de invitaciones.
* Plantillas visuales.
* Carga de imágenes.
* Enlaces públicos.
* Confirmación de asistencia.
* Envío por WhatsApp.
* Generación de imágenes.
* Generación de PDF.
* Pagos.
* Correos electrónicos.

Spring Security puede quedar configurado de forma mínima para permitir el arranque del proyecto, pero no desarrolles todavía el sistema de autenticación.

No copies código específico de otros proyectos.

No agregues módulos relacionados con tesorería, alumnos, familias, eventos escolares ni stands.

---

## Validaciones obligatorias

### Backend

Ejecuta:

```bash
cd backend
./gradlew clean test
./gradlew check
./gradlew bootJar
```

### Frontend

Ejecuta:

```bash
cd frontend
pnpm install
pnpm exec tsc -b
pnpm lint
pnpm test
pnpm build
```

### Docker

Ejecuta:

```bash
docker compose config
```

Si el entorno lo permite, inicia los servicios y confirma que backend y frontend arrancan correctamente.

### Repositorio

Ejecuta:

```bash
git diff --check
```

---

## Resultado esperado

Entrega un informe con:

### Estructura creada

Muestra el árbol principal del proyecto.

### Backend

Indica:

* Versión de Java.
* Versión de Spring Boot.
* Dependencias configuradas.
* Perfiles creados.
* Resultado de Gradle.

### Frontend

Indica:

* Versiones principales.
* Scripts configurados.
* Resultado de lint.
* Resultado de type checking.
* Resultado de tests.
* Resultado del build.

### Infraestructura

Indica:

* Servicios definidos en Docker Compose.
* Variables documentadas.
* Workflows creados.

### Archivos creados

Enumera los archivos principales.

### Validaciones

Incluye el resultado de cada comando ejecutado.

### Estado final

Confirma:

* Que el proyecto compila.
* Que los tests iniciales pasan.
* Que Docker Compose es válido.
* Que no se implementaron funcionalidades fuera del alcance.
* Que no se incluyeron secretos reales.

No continúes con autenticación ni con el módulo de invitaciones después de completar esta tarea.
