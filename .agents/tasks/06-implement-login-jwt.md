# Tarea 06 — Implementar login y autenticación JWT

## Objetivo

Implementar el inicio de sesión de usuarios y la emisión de un token JWT para proteger los endpoints privados del backend de **Invitation**.

Esta tarea debe incluir:

* Login con email y contraseña.
* Validación de credenciales.
* Generación de JWT.
* Filtro de autenticación.
* Protección de endpoints.
* Endpoint para consultar al usuario autenticado.

No implementar todavía refresh tokens, recuperación de contraseña, verificación por correo ni frontend.

---

## Análisis previo

Antes de modificar código:

1. Revisa el dominio `User`.
2. Revisa el flujo de registro existente.
3. Revisa la configuración actual de Spring Security.
4. Reutiliza el `PasswordEncoder` ya configurado.
5. Mantén la arquitectura por puertos y adaptadores existente.
6. Conserva la normalización actual del email.

No dupliques componentes que ya existan.

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
* Archivos ajenos no relacionados.
* Cambios previos que ya existan en Git.

---

# Endpoint de login

Implementa:

```http
POST /api/auth/login
```

## Solicitud

```json
{
  "email": "ana@example.com",
  "password": "SecurePass123!"
}
```

## Respuesta exitosa

```json
{
  "token": "jwt-token",
  "tokenType": "Bearer",
  "expiresIn": 3600,
  "user": {
    "code": "ACC-XXXXXXXXXXXX",
    "firstName": "Ana",
    "lastName": "Pérez",
    "email": "ana@example.com",
    "status": "ACTIVE"
  }
}
```

No devolver:

* Hash de contraseña.
* UUID interno.
* Secreto JWT.
* Información interna de persistencia.

---

# Validación de credenciales

El flujo debe:

1. Normalizar el email.
2. Buscar el usuario.
3. Verificar que exista.
4. Verificar que esté habilitado.
5. Comparar la contraseña mediante BCrypt.
6. Generar el token si las credenciales son correctas.

Para credenciales inválidas, devuelve un mensaje genérico.

No reveles si falló:

* El email.
* La contraseña.
* El estado del usuario.

Ejemplo:

```text
Invalid email or password
```

---

# Configuración JWT

Configura JWT utilizando variables de entorno.

Variables sugeridas:

```text
JWT_SECRET
JWT_EXPIRATION_SECONDS
JWT_ISSUER
```

Requisitos:

* No incluir secretos reales en el repositorio.
* El secreto debe tener una longitud segura.
* No utilizar un valor de producción como fallback.
* Configurar valores seguros para desarrollo y pruebas.
* Validar la configuración al iniciar la aplicación.

---

# Contenido del token

El JWT debe incluir únicamente la información necesaria.

Incluye como mínimo:

* Código público del usuario como sujeto.
* Email normalizado.
* Estado o autoridad necesaria.
* Fecha de emisión.
* Fecha de expiración.
* Issuer.

No incluyas:

* Contraseña.
* Hash.
* UUID interno.
* Datos personales innecesarios.
* Secretos.
* Información de base de datos.

---

# Seguridad

Configura Spring Security para permitir públicamente:

```text
POST /api/auth/register
POST /api/auth/login
```

Protege el resto de endpoints por defecto.

La aplicación debe trabajar sin sesiones HTTP:

```text
STATELESS
```

Deshabilita o configura correctamente CSRF para una API stateless.

---

# Filtro JWT

Implementa un filtro que:

1. Lea el encabezado `Authorization`.
2. Verifique el prefijo `Bearer`.
3. Extraiga el token.
4. Valide firma y expiración.
5. Identifique al usuario.
6. Cree el contexto de seguridad.
7. Continúe la cadena de filtros.

El filtro no debe:

* Registrar el token completo.
* Lanzar stack traces al cliente.
* Consultar innecesariamente varias veces la base de datos.
* Autenticar tokens vencidos o inválidos.

---

# Usuario autenticado

Implementa:

```http
GET /api/auth/me
```

Debe requerir JWT válido.

## Respuesta

```json
{
  "code": "ACC-XXXXXXXXXXXX",
  "firstName": "Ana",
  "lastName": "Pérez",
  "email": "ana@example.com",
  "status": "ACTIVE"
}
```

No devolver UUID interno ni hash.

---

# Estados de usuario

Respeta los estados ya definidos en `UserStatus`.

Un usuario que no esté habilitado no debe poder iniciar sesión.

No agregues nuevos estados salvo que exista un error probado en el modelo actual.

---

# Manejo de errores

Implementa respuestas consistentes para:

## Credenciales inválidas

```http
401 Unauthorized
```

## Token ausente

```http
401 Unauthorized
```

## Token inválido

```http
401 Unauthorized
```

## Token vencido

```http
401 Unauthorized
```

## Usuario sin permiso

```http
403 Forbidden
```

No expongas:

* Detalles criptográficos.
* Stack traces.
* Clases internas.
* Consultas SQL.
* Contenido del token.

---

# Arquitectura

Mantén separación entre:

```text
auth/
├── application/
├── domain/
├── infrastructure/
└── web/
```

Adapta esta estructura al proyecto existente.

Crea puertos para:

* Generación de tokens.
* Validación de tokens.
* Autenticación de credenciales.

Evita acoplar el caso de uso directamente a una librería JWT concreta.

---

# Dependencias

Agrega únicamente la dependencia JWT necesaria.

Antes de elegirla:

* Verifica compatibilidad con Java 21.
* Verifica compatibilidad con Spring Boot 4.1.0.
* Evita dependencias deprecadas.
* Fija una versión explícita si corresponde.

No agregues múltiples librerías JWT.

---

# Pruebas obligatorias

## Login

Valida:

* Login exitoso.
* Normalización del email.
* Contraseña incorrecta.
* Usuario inexistente.
* Usuario no habilitado.
* Ausencia de hash y UUID en la respuesta.

## JWT

Valida:

* Token válido.
* Firma inválida.
* Token vencido.
* Token malformado.
* Claims esperados.
* Expiración configurada.
* Issuer correcto.

## Seguridad

Valida:

* Registro continúa siendo público.
* Login es público.
* `/api/auth/me` requiere autenticación.
* `/api/auth/me` responde correctamente con token válido.
* Token inválido devuelve `401`.
* Endpoint privado sin token devuelve `401`.

## Filtro

Valida:

* Encabezado ausente.
* Prefijo incorrecto.
* Bearer válido.
* Token vencido.
* Token inválido.

---

# Validaciones técnicas

Desde `backend/` ejecuta:

```bash
./gradlew clean
./gradlew test
./gradlew check
./gradlew bootJar
```

Desde la raíz ejecuta:

```bash
git diff --check
```

Si el entorno permite levantar el backend, realiza una prueba manual:

```text
1. Registrar usuario.
2. Iniciar sesión.
3. Copiar token.
4. Consultar /api/auth/me.
5. Repetir sin token.
6. Repetir con token inválido.
```

La imposibilidad de realizar la prueba manual no debe ocultar fallos automatizados.

---

# Resultado esperado

Entrega un informe con:

## Archivos creados

## Archivos modificados

## Dependencia JWT elegida

## Variables de entorno agregadas

## Claims incluidos

## Duración del token

## Endpoints implementados

## Configuración de Spring Security

## Casos de error cubiertos

## Pruebas ejecutadas

## Resultado de Gradle

## Cobertura

## Resultado de `git diff --check`

## Estado final de Git

Confirma expresamente que:

* El JWT no contiene el UUID interno.
* El JWT no contiene datos sensibles.
* Los tokens no aparecen completos en logs.
* No se implementaron refresh tokens.
* No se implementó recuperación de contraseña.
* No se modificó el frontend.
* No se alteraron cambios ajenos.

Detente después de completar login, JWT y `/api/auth/me`.

