# Tarea 02 — Inicializar Git y validar la base del proyecto

## Objetivo

Inicializar el repositorio Git del proyecto **Invitation**, revisar que la estructura base esté limpia y crear el primer commit estable.

En esta tarea no implementes nuevas funcionalidades.

---

## Tareas

### 1. Inicializar Git

Desde la raíz del proyecto ejecuta:

```bash
git init
```

Configura la rama principal como:

```bash
git branch -M main
```

---

### 2. Revisar archivos ignorados

Verifica que `.gitignore` excluya correctamente:

```text
.env
.env.*
!.env.example

backend/.gradle/
backend/build/
backend/out/

frontend/node_modules/
frontend/dist/
frontend/coverage/

.idea/
.vscode/
*.iml

.DS_Store
Thumbs.db
```

No ignores:

```text
.env.example
pnpm-lock.yaml
gradle-wrapper.jar
gradle-wrapper.properties
```

---

### 3. Revisar archivos sensibles

Comprueba que no existan:

* Contraseñas reales.
* Tokens.
* Secretos JWT reales.
* URLs privadas.
* Credenciales de bases de datos reales.
* Archivos `.env` preparados para ser versionados.

Los valores de `.env.example` deben ser únicamente ejemplos seguros.

---

### 4. Validar la estructura actual

Confirma que existan:

```text
.agents/
.github/workflows/
backend/
frontend/
docker-compose.yml
.env.example
.gitattributes
.gitignore
README.md
```

Comprueba también que:

* Gradle Wrapper esté versionado.
* `pnpm-lock.yaml` exista.
* Los Dockerfiles estén presentes.
* Los workflows apunten a rutas y comandos reales.
* Los enlaces de `README.md` y `.agents/AGENTS.md` sean válidos.

---

## Validaciones obligatorias

### Backend

```bash
cd backend
./gradlew clean check bootJar
cd ..
```

### Frontend

```bash
cd frontend
pnpm install --frozen-lockfile
pnpm exec tsc -b
pnpm lint
pnpm test
pnpm build
cd ..
```

### Docker Compose

```bash
docker compose config
```

### Git

```bash
git status
git diff --check
```

---

## Primer commit

Después de aprobar todas las validaciones:

```bash
git add .
git status
git commit -m "chore: initialize Invitation project foundation"
```

No realices el commit si aparecen:

* Archivos sensibles.
* Directorios de build.
* `node_modules`.
* Archivos `.env`.
* Errores de validación.

---

## Actualización de `.agents`

Crea la referencia a esta tarea en:

```text
.agents/AGENTS.md
```

El orden inicial debe quedar:

```text
01-create-project-foundation.md
02-initialize-git-baseline.md
```

Guarda esta instrucción como:

```text
.agents/tasks/02-initialize-git-baseline.md
```

---

## Restricciones

No implementes:

* Usuarios.
* Autenticación.
* JWT funcional.
* Entidades de negocio.
* Invitaciones.
* Formularios.
* Plantillas.
* APIs nuevas.
* Migraciones de negocio.
* Cambios visuales adicionales.

No actualices dependencias salvo que una validación no pueda ejecutarse por una configuración incorrecta.

---

## Resultado esperado

Entrega un informe con:

* Rama principal creada.
* Archivos ignorados.
* Archivos incluidos en el commit.
* Resultado de las validaciones del backend.
* Resultado de las validaciones del frontend.
* Resultado de Docker Compose.
* Resultado de `git diff --check`.
* Hash y mensaje del primer commit.
* Confirmación de que no se versionaron secretos ni archivos generados.
* Estado final de `git status`.

No continúes con autenticación ni con el módulo de invitaciones después de completar esta tarea.
