# Tarea 05 — Implementar el registro de usuarios

## Objetivo

Implementar el flujo completo de registro de usuarios en el backend de **Invitation**.

Esta tarea debe permitir crear una cuenta mediante una API REST, almacenar la contraseña de forma segura y devolver una respuesta sin datos sensibles.

No implementar todavía inicio de sesión, JWT, refresh tokens ni frontend.

---

## Análisis previo

Antes de modificar código:

1. Lee `.agents/domain-model.md`.
2. Revisa el dominio `User` implementado.
3. Revisa las restricciones de la tabla `users`.
4. Revisa la configuración actual de Spring Security.
5. Mantén la arquitectura y las convenciones existentes.

No cambies el modelo de usuario salvo que exista un error demostrado que impida implementar el registro.

---

## Alcance permitido

Puedes modificar únicamente:

```text
backend/
```

No modifiques:

* `frontend/`
* `.agents/`
* `.github/`
* `docker-compose.yml`
* `README.md`
* Archivos de infraestructura no relacionados.
* Cambios ajenos ya existentes en Git.

---

## Flujo requerido

Implementa el siguiente flujo:

```text
Solicitud HTTP
    ↓
Controller
    ↓
DTO de entrada
    ↓
Caso de uso o servicio de aplicación
    ↓
Validación
    ↓
Hash de contraseña
    ↓
Creación del usuario
    ↓
Persistencia
    ↓
DTO de respuesta
```

Evita colocar reglas de negocio directamente en el controller.

---

## Endpoint

Implementa:

```http
POST /api/auth/register
```

### Solicitud

El cuerpo debe incluir como mínimo:

```json
{
  "firstName": "Ana",
  "lastName": "Pérez",
  "email": "ana@example.com",
  "password": "SecurePass123!"
}
```

Adapta los nombres exactamente al modelo actual del proyecto.

---

## Respuesta exitosa

Utiliza un código HTTP apropiado para creación.

La respuesta debe incluir únicamente información pública, por ejemplo:

```json
{
  "code": "ACC-XXXXXXXXXXXX",
  "firstName": "Ana",
  "lastName": "Pérez",
  "email": "ana@example.com",
  "status": "ACTIVE",
  "createdAt": "..."
}
```

No devolver:

* Hash de contraseña.
* Identificador UUID interno.
* Información de auditoría interna innecesaria.
* Datos técnicos de persistencia.

---

## Contraseña

Utiliza un algoritmo seguro soportado por Spring Security.

Requisitos:

* Nunca guardar contraseñas en texto plano.
* No crear algoritmos propios.
* Centralizar el uso de `PasswordEncoder`.
* No registrar la contraseña en logs.
* No devolver el hash en respuestas.
* No incluir contraseñas en mensajes de error.

---

## Normalización

El email debe:

* Eliminar espacios externos.
* Convertirse a minúsculas.
* Validarse antes de persistir.
* Compararse de manera consistente para evitar duplicados por mayúsculas.

Ejemplo:

```text
Ana@Example.com
ana@example.com
```

Ambos deben considerarse el mismo email.

---

## Validaciones

Valida como mínimo:

### Nombre

* Obligatorio.
* No puede contener únicamente espacios.
* Longitud razonable.

### Apellidos

* Obligatorios si así lo define el modelo aprobado.
* No pueden contener únicamente espacios.

### Email

* Obligatorio.
* Formato válido.
* Único.

### Contraseña

Define una política inicial sencilla y clara:

* Mínimo 8 caracteres.
* Al menos una letra.
* Al menos un número.

No agregues requisitos excesivos que dificulten innecesariamente el registro.

---

## Usuario duplicado

Cuando el email ya exista:

* No crear otro usuario.
* Devolver un código HTTP apropiado para conflicto.
* Entregar un error claro y estable.
* No exponer información interna de base de datos.

---

## Código público

Utiliza el mecanismo definido en el dominio para generar códigos como:

```text
ACC-XXXXXXXXXXXX
```

El código debe ser:

* Único.
* No secuencial.
* No basado directamente en el UUID interno.
* Generado en el backend.

---

## Estado inicial

Utiliza el estado inicial definido en el modelo aprobado.

No agregues nuevos estados en esta tarea.

Si el modelo define `ACTIVE` como estado inicial, úsalo sin implementar todavía verificación por correo.

---

## Arquitectura

Crea o adapta las capas necesarias:

```text
user/
├── application/
│   ├── port/
│   └── service/
├── domain/
├── infrastructure/
└── web/
```

La estructura exacta debe respetar la arquitectura real del proyecto.

Debes separar:

* Entrada HTTP.
* Caso de uso.
* Dominio.
* Persistencia.
* Mapeo.
* Respuestas.

---

## Manejo de errores

Implementa un manejo consistente para:

* Solicitud inválida.
* Email duplicado.
* Error inesperado.

Las respuestas de error deben contener una estructura estable, por ejemplo:

```json
{
  "status": 400,
  "error": "Validation failed",
  "message": "The request contains invalid fields",
  "path": "/api/auth/register",
  "timestamp": "..."
}
```

No expongas:

* Stack traces.
* Nombres de tablas.
* Consultas SQL.
* Clases internas.
* Detalles del proveedor de base de datos.

---

## Seguridad

Actualiza la configuración mínima de Spring Security para permitir públicamente:

```text
POST /api/auth/register
```

El resto de endpoints debe conservar el comportamiento actual.

No implementes todavía:

* Filtro JWT.
* Tokens.
* Login.
* Logout.
* Refresh token.
* Roles.
* Recuperación de contraseña.
* Verificación de email.
* OAuth.

---

## Pruebas obligatorias

Crea pruebas para validar como mínimo:

### Servicio o caso de uso

* Registro exitoso.
* Normalización del email.
* Hash de contraseña.
* Estado inicial.
* Email duplicado.
* Contraseña inválida.

### Controller

* Respuesta exitosa.
* Solicitud inválida.
* Email inválido.
* Contraseña inválida.
* Email duplicado.
* Ausencia del hash y UUID interno en la respuesta.

### Persistencia

Reutiliza las pruebas existentes y agrega únicamente las necesarias.

---

## Validaciones técnicas

Ejecuta desde `backend/`:

```bash
./gradlew clean
./gradlew test
./gradlew check
./gradlew bootJar
```

Ejecuta también desde la raíz:

```bash
git diff --check
```

Si el entorno lo permite, prueba manualmente el endpoint con una base H2 o PostgreSQL controlada.

---

## Resultado esperado

Entrega un informe con:

### Archivos creados

### Archivos modificados

### Endpoint implementado

### Validaciones implementadas

### Política de contraseña

### Estrategia de hash utilizada

### Manejo de email duplicado

### Pruebas ejecutadas

### Resultado de Gradle

### Cobertura

### Resultado de `git diff --check`

### Estado final de Git

Confirma expresamente que:

* No se devuelve el hash de contraseña.
* No se expone el UUID interno.
* No se implementó login.
* No se implementó JWT.
* No se modificó el frontend.
* No se alteraron cambios ajenos.

Detente después de completar el registro de usuarios.

