# Invitation

Technical foundation for a web application to create and share children's birthday invitations. Business features are intentionally outside the current scope.

## Technology

- Java 21, Spring Boot 4.1, Gradle, JPA, Flyway, PostgreSQL, H2, Spring Security, JaCoCo and PMD.
- React, TypeScript, Vite, React Router, Vitest, Testing Library, Oxlint and pnpm.
- Docker Compose and GitHub Actions.

## Prerequisites

Java 21, Node.js 22+, pnpm 10+, Docker Desktop, and Git.

## Structure

`backend/` contains the API, `frontend/` the browser client, `.github/workflows/` the CI jobs, and `.agents/` the agent guidance and task specifications.

## Run locally

Copy `.env.example` to `.env` and adjust development-only values if needed.

Backend (requires PostgreSQL matching the environment settings):

```bash
cd backend
./gradlew bootRun
```

Frontend:

```bash
cd frontend
pnpm install
pnpm dev
```

Full stack:

```bash
docker compose up --build
```

The frontend is available at `http://localhost:5173` and the backend at `http://localhost:8080` by default.

## Validation

```bash
cd backend
./gradlew clean test
./gradlew check
./gradlew bootJar

cd ../frontend
pnpm exec tsc -b
pnpm lint
pnpm test
pnpm test:coverage
pnpm build

cd ..
docker compose config
git diff --check
```
