# Tarea 07 — Activación de cuenta y creación de contraseña

**Guardar en:** `docs/tasks/task-07-account-activation.md`

---

# Objetivo

Implementar el flujo completo de activación de cuenta para usuarios creados por un administrador.

Cuando un administrador crea un nuevo usuario, el sistema debe enviar automáticamente un correo electrónico con un enlace seguro que permita establecer la contraseña inicial.

El usuario no debe poder iniciar sesión hasta haber establecido su contraseña.

La implementación debe seguir una arquitectura limpia (Clean Architecture), mantener la separación por capas existente y respetar todas las prácticas de seguridad ya implementadas en el proyecto.

---

# Alcance

## Backend

Implementar:

- generación de tokens de activación criptográficamente seguros;
- almacenamiento únicamente del hash del token;
- expiración configurable;
- invalidación automática después del primer uso;
- un único token activo por usuario;
- envío del correo de activación;
- endpoints para validar y completar la activación.

No modificar el frontend existente, salvo las nuevas pantallas necesarias.

---

# Requisitos funcionales

## 1. Creación del usuario

Después del registro realizado por un administrador:

- crear un token aleatorio;
- almacenar únicamente su hash;
- asociarlo al usuario;
- definir fecha de expiración;
- enviar automáticamente un correo con el enlace.

El usuario recién creado:

- no posee contraseña utilizable;
- no puede autenticarse;
- no puede generar JWT.

---

## 2. Enlace enviado

El enlace deberá tener el formato:

```text
https://frontend/activate-account?token=<TOKEN>
```

Nunca:

- localhost
- IP del servidor
- host recibido en la petición
- URL construida manualmente

La URL deberá obtenerse desde:

```properties
app.frontend-url=${FRONTEND_URL}
```

Ejemplo producción:

```env
FRONTEND_URL=https://tesoreria.midominio.com
```

---

## 3. Validar token

Implementar:

```
GET /api/auth/account-activation/validate
```

Query:

```
?token=xxxxx
```

Respuestas:

### 200

```json
{
  "valid": true
}
```

### 400

Token mal formado.

### 404

Token inexistente.

### 410

Token expirado.

### 410

Token ya utilizado.

No revelar información del usuario.

---

## 4. Completar activación

Implementar:

```
POST /api/auth/account-activation/complete
```

Body:

```json
{
  "token":"xxxxx",
  "password":"NuevaPassword123"
}
```

Proceso:

- validar token;
- validar expiración;
- validar que no fue utilizado;
- validar política de contraseña;
- generar BCrypt;
- guardar contraseña;
- activar usuario;
- invalidar token;
- eliminar tokens anteriores;
- confirmar transacción.

Respuesta:

```
204 No Content
```

No devolver JWT.

No iniciar sesión automáticamente.

---

# Seguridad

El token:

- debe generarse mediante SecureRandom;
- ser URL-safe;
- no contener información del usuario;
- no ser JWT;
- no ser UUID.

Utilizar por ejemplo:

```java
Base64.getUrlEncoder()
      .withoutPadding()
```

---

## Persistencia

Nunca almacenar el token plano.

Almacenar únicamente:

```
SHA-256(token)
```

Comparar siempre hashes.

---

## Expiración

Variable:

```properties
ACCOUNT_ACTIVATION_EXPIRATION_SECONDS=86400
```

Valor por defecto:

24 horas.

---

## Invalidación

Cuando se genere un nuevo token:

- eliminar el anterior;
- dejar uno solo activo.

Cuando el usuario termine el proceso:

- eliminar el token;
- impedir reutilización.

---

# Correo electrónico

El correo debe contener:

- nombre del usuario;
- explicación;
- enlace;
- tiempo de expiración;
- aviso de ignorar el mensaje.

Nunca incluir:

- UUID;
- hash;
- contraseña;
- datos internos.

Nunca registrar el enlace completo en logs.

---

# Endpoints públicos

Agregar a Spring Security:

```
POST /api/auth/register

POST /api/auth/login

GET /api/auth/account-activation/validate

POST /api/auth/account-activation/complete
```

Todo lo demás continúa autenticado.

---

# Frontend

Crear pantalla:

```
/activate-account
```

Flujo:

1.

Leer:

```
token
```

desde:

```
query string
```

Ejemplo:

```
/activate-account?token=xxxxx
```

---

2.

Consultar:

```
GET /api/auth/account-activation/validate
```

---

3.

Si el token es válido:

mostrar formulario.

Campos:

- contraseña
- confirmar contraseña

---

4.

Enviar:

```
POST /api/auth/account-activation/complete
```

---

5.

Mostrar éxito.

---

6.

Redirigir:

```
/login
```

---

# Producción

Verificar:

## FRONTEND_URL

Debe ser:

```env
https://tesoreria.midominio.com
```

Nunca:

```
localhost
```

---

## HTTPS

El enlace debe usar:

```
https
```

---

## CORS

Permitir:

```
https://tesoreria.midominio.com
```

---

## Rutas SPA

Si se utiliza React/Vue/Angular configurar Nginx:

```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

Sin esto:

```
https://dominio.com/activate-account?token=...
```

producirá:

```
404
```

aunque funcione desde localhost.

---

## Proxy

Verificar:

```nginx
proxy_set_header Host $host;
proxy_set_header X-Forwarded-Proto $scheme;
```

Spring:

```properties
server.forward-headers-strategy=framework
```

---

# Arquitectura

Mantener la arquitectura existente.

Crear únicamente las capas necesarias.

Ejemplo:

```
application/

domain/

infrastructure/

web/
```

Agregar:

- caso de uso
- puertos
- adaptadores
- DTOs
- controlador
- servicio de correo
- repositorio del token

No romper la arquitectura actual.

---

# Manejo de errores

Mantener el formato uniforme existente.

No devolver:

- stacktrace
- SQL
- nombres internos
- excepciones

---

# Logs

Nunca registrar:

- token
- hash
- contraseña
- enlace completo

Registrar únicamente eventos.

Ejemplo:

```
Activation email sent to user ACC-XXXXXXXX
```

---

# Pruebas

Implementar pruebas para:

## Token

- generación
- hash
- expiración
- reutilización
- token inválido
- token inexistente
- token expirado

---

## Endpoint validate

- válido
- inválido
- expirado
- utilizado

---

## Endpoint complete

- éxito
- contraseña inválida
- token inválido
- token reutilizado
- token expirado

---

## Integración

Flujo completo:

Administrador

↓

Crear usuario

↓

Generar token

↓

Enviar correo

↓

Abrir enlace

↓

Validar token

↓

Crear contraseña

↓

Activar usuario

↓

Login

↓

JWT

↓

GET /api/auth/me

---

## Seguridad

Verificar que:

- el token no aparece en logs;
- el hash no coincide con el token;
- no existen múltiples tokens activos;
- el token se invalida correctamente.

---

# Variables de entorno

```env
FRONTEND_URL=https://tesoreria.midominio.com

ACCOUNT_ACTIVATION_EXPIRATION_SECONDS=86400
```

---

# Validaciones finales

Ejecutar:

```bash
./gradlew clean
```

```bash
./gradlew test
```

```bash
./gradlew check
```

```bash
./gradlew bootJar
```

```bash
git diff --check
```

---

# Reporte esperado

Indicar:

- archivos creados;
- archivos modificados;
- endpoints implementados;
- variables nuevas;
- cantidad de pruebas;
- pruebas exitosas;
- cobertura de instrucciones;
- cobertura de ramas;
- validaciones ejecutadas.

Confirmar explícitamente:

- no se creó ningún commit;
- no se modificó la arquitectura existente;
- no se introdujeron dependencias innecesarias;
- no se registran tokens ni contraseñas en logs;
- la URL enviada por correo utiliza exclusivamente `FRONTEND_URL`;
- el flujo funciona tanto en localhost como en producción.
