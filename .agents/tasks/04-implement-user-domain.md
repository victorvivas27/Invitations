# Tarea 04 — Implementar el dominio User

## Objetivo

Implementar el dominio **User**, que será el propietario de todas las invitaciones del sistema.

Esta tarea implementa únicamente la capa de dominio y persistencia.

No implementar todavía autenticación JWT ni endpoints REST.

---

# Archivos permitidos

Puedes modificar únicamente:

```text
backend/
```

No modifiques:

- frontend/
- .github/
- docker/
- README.md
- .agents/
- docker-compose.yml

---

# Crear el dominio User

Implementa el dominio siguiendo la arquitectura definida para el proyecto.

La estructura esperada es similar a:

```text
user/
├── domain/
├── repository/
├── persistence/
└── mapper/
```

Adáptala a la arquitectura real del proyecto.

---

# Entidad User

Implementa la entidad JPA utilizando el modelo definido en:

```text
.agents/domain-model.md
```

No inventes nuevos campos.

Respeta exactamente el diseño aprobado.

---

## Requisitos

La entidad debe incluir:

- Identificador interno.
- Código público.
- Nombre.
- Apellidos.
- Email.
- Contraseña (hash solamente).
- Estado.
- Fechas de auditoría.
- Auditoría de creación y modificación.

No implementar todavía:

- Login.
- Refresh Token.
- Roles avanzados.
- OAuth.
- Google Login.

---

# Persistencia

Crear:

- Repository.
- Configuración JPA necesaria.
- Restricciones únicas.
- Índices necesarios.

No crear consultas complejas todavía.

---

# Flyway

Crear la primera migración de negocio.

Debe crear únicamente las tablas necesarias para User.

No crear tablas relacionadas con Invitation.

---

# Enumeraciones

Implementar únicamente las necesarias para User.

No agregar enumeraciones futuras que todavía no se utilicen.

---

# Validaciones

Agregar únicamente las validaciones propias del dominio.

Ejemplos:

- Email obligatorio.
- Email único.
- Código único.
- Nombre obligatorio.

No implementar validaciones del proceso de registro.

---

# Pruebas

Crear pruebas unitarias del dominio y persistencia.

Validar como mínimo:

- Creación.
- Restricciones.
- Persistencia.
- Restricción de email único.

---

# Validaciones obligatorias

Ejecutar:

```bash
./gradlew clean
./gradlew test
./gradlew check
./gradlew bootJar
```

---

# Resultado esperado

Entregar un informe con:

## Archivos creados

## Archivos modificados

## Migraciones creadas

## Enumeraciones creadas

## Restricciones implementadas

## Resultado de las pruebas

## Resultado de Gradle

## Cobertura

## Estado final de Git

No implementar todavía:

- JWT.
- Login.
- Registro.
- Controllers.
- Services.
- DTOs.
- Invitation.
- Frontend.

Detenerse al finalizar esta tarea.
