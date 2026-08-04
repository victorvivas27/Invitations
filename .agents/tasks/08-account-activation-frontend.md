# Tarea 08 — Verificación y finalización del frontend de activación de cuenta

**Guardar en:** `docs/tasks/task-08-account-activation-frontend.md`

---

# Objetivo

Revisar, completar y validar visualmente el frontend del flujo de activación de cuenta implementado en la Tarea 07.

Actualmente el backend dispone de los endpoints necesarios para validar un token de activación y establecer la contraseña inicial, pero el flujo debe comprobarse completamente desde la interfaz local.

Esta tarea debe enfocarse únicamente en el frontend y en la validación local del flujo.

No realizar configuraciones de producción.

No implementar roles.

No modificar el registro público existente.

No crear ningún commit.

---

# Contexto actual

El backend ya dispone de los siguientes endpoints:

```http
GET /api/auth/account-activation/validate?token={TOKEN}
```

```http
POST /api/auth/account-activation/complete
```

El endpoint de validación permite comprobar si el token:

* existe;
* está vigente;
* no fue utilizado;
* puede utilizarse para activar la cuenta.

El endpoint de finalización permite:

* establecer la contraseña inicial;
* activar al usuario;
* invalidar el token;
* permitir posteriormente el login.

También existe el endpoint administrativo:

```http
POST /api/admin/users
```

Este endpoint crea usuarios con estado:

```text
PENDING_ACTIVATION
```

y envía un correo con un enlace como:

```text
http://localhost:5173/activate-account?token={TOKEN}
```

---

# Alcance

La tarea debe revisar e implementar, si fuera necesario:

* ruta pública `/activate-account`;
* lectura del token desde la URL;
* validación automática del token;
* estados visuales;
* formulario de contraseña;
* validaciones del formulario;
* envío al backend;
* mensajes de éxito y error;
* redirección al login;
* integración con los estilos actuales;
* pruebas automáticas;
* prueba manual completa en local.

---

# Restricciones

No realizar:

* configuraciones de producción;
* cambios en Nginx;
* configuración HTTPS;
* integración con SMTP real;
* roles de administrador;
* cambios en `/api/auth/register`;
* cambios en el flujo de login salvo que exista un error directamente relacionado;
* refresh tokens;
* recuperación de contraseña;
* commits.

---

# Ruta pública

Crear o verificar la siguiente ruta:

```text
/activate-account
```

Ejemplo:

```text
http://localhost:5173/activate-account?token=abc123
```

La ruta debe ser pública.

No debe requerir JWT.

No debe redirigir automáticamente al login por no estar autenticado.

No debe estar dentro de un componente de rutas privadas.

Ejemplo esperado con React Router:

```tsx
<Route
  path="/activate-account"
  element={<ActivateAccountPage />}
/>
```

La ruta debe declararse dentro del conjunto de rutas públicas.

---

# Página de activación

Crear o verificar un componente equivalente a:

```text
ActivateAccountPage
```

Ubicación sugerida:

```text
src/pages/auth/ActivateAccountPage.tsx
```

Adaptar la ubicación a la arquitectura actual del frontend.

No crear una estructura paralela si el proyecto ya tiene convenciones definidas.

---

# Lectura del token

La página debe leer el token desde la query string.

Ejemplo:

```tsx
const [searchParams] = useSearchParams();
const token = searchParams.get("token");
```

El token no debe:

* guardarse en localStorage;
* guardarse en sessionStorage;
* registrarse en consola;
* enviarse a sistemas de analítica;
* mostrarse completo en pantalla;
* incluirse en mensajes de error.

Si no existe el parámetro `token`, la pantalla debe mostrar un error controlado.

Mensaje sugerido:

```text
El enlace de activación no es válido.
```

---

# Validación automática del token

Al cargar la página, debe ejecutarse:

```http
GET /api/auth/account-activation/validate?token={TOKEN}
```

El token debe codificarse correctamente.

Ejemplo:

```ts
const encodedToken = encodeURIComponent(token);
```

Solicitud esperada:

```ts
await api.get(
  `/api/auth/account-activation/validate?token=${encodeURIComponent(token)}`
);
```

No concatenar parámetros sin codificación.

---

# Estados de la pantalla

La página debe manejar claramente los siguientes estados:

```text
VALIDATING
VALID
INVALID
EXPIRED
USED
SUCCESS
ERROR
```

No es obligatorio utilizar exactamente estos nombres internamente, pero el comportamiento debe ser equivalente.

---

# Estado de validación

Mientras se consulta el backend, mostrar:

```text
Validando enlace de activación...
```

La pantalla debe incluir un indicador de carga consistente con el diseño actual.

Durante la validación:

* no mostrar el formulario;
* no habilitar acciones;
* no asumir que el token es válido.

---

# Token válido

Si el backend confirma que el token es válido, mostrar el formulario para establecer la contraseña.

Contenido sugerido:

```text
Crea tu contraseña

Tu cuenta fue creada correctamente. Establece una contraseña para completar la activación.
```

Campos:

```text
Nueva contraseña
Confirmar contraseña
```

Botón:

```text
Activar cuenta
```

---

# Token inválido

Si el backend responde que el token no existe o es inválido, mostrar:

```text
El enlace de activación no es válido.
```

También puede incluirse:

```text
Verifica que hayas abierto el enlace completo recibido por correo.
```

No mostrar:

* detalles internos;
* excepciones;
* códigos SQL;
* stack traces;
* contenido del token;
* identificadores internos.

---

# Token vencido

Si el backend responde:

```http
410 Gone
```

y el error indica expiración, mostrar:

```text
El enlace de activación ha vencido.
```

Mensaje complementario sugerido:

```text
Solicita a un administrador que genere una nueva invitación.
```

No mostrar el formulario.

---

# Token utilizado

Si el backend responde:

```http
410 Gone
```

y el token ya fue utilizado, mostrar:

```text
Este enlace de activación ya fue utilizado.
```

Puede ofrecerse un botón:

```text
Ir al inicio de sesión
```

La pantalla no debe permitir reutilizar el token.

---

# Error inesperado

Si ocurre:

* error de red;
* backend no disponible;
* timeout;
* respuesta inesperada;
* error interno;

mostrar:

```text
No fue posible validar el enlace en este momento.
```

Puede incluirse un botón:

```text
Reintentar
```

El botón debe repetir la validación usando el mismo token en memoria.

No guardar el token en almacenamiento persistente.

---

# Formulario de contraseña

Cuando el token sea válido, mostrar un formulario con:

```text
Nueva contraseña
Confirmar contraseña
```

Los campos deben utilizar:

```html
type="password"
```

Añadir `autocomplete` adecuado:

```html
autocomplete="new-password"
```

Ejemplo:

```tsx
<input
  type="password"
  autoComplete="new-password"
/>
```

---

# Validaciones del formulario

Validar antes de enviar:

* contraseña obligatoria;
* confirmación obligatoria;
* coincidencia entre ambas;
* longitud mínima;
* política de contraseña ya definida en el proyecto.

No inventar una política distinta si ya existe una validación compartida.

Reutilizar:

* esquema Zod existente;
* validadores compartidos;
* constantes actuales;
* mensajes ya utilizados por el registro.

Si no existe una política compartida, implementar una validación consistente con el backend.

Mensaje para contraseñas diferentes:

```text
Las contraseñas no coinciden.
```

Mensaje para contraseña vacía:

```text
La contraseña es obligatoria.
```

---

# Envío de activación

Al enviar el formulario, ejecutar:

```http
POST /api/auth/account-activation/complete
```

Body:

```json
{
  "token": "TOKEN_RECIBIDO",
  "password": "NUEVA_CONTRASEÑA"
}
```

Ejemplo:

```ts
await api.post("/api/auth/account-activation/complete", {
  token,
  password,
});
```

No enviar:

* confirmación de contraseña;
* email;
* UUID;
* código público;
* hash;
* estado del usuario.

La confirmación de contraseña solo se utiliza en el frontend.

---

# Estado de envío

Mientras se completa la activación:

* deshabilitar campos;
* deshabilitar el botón;
* impedir envíos duplicados;
* mostrar indicador de progreso.

Texto sugerido:

```text
Activando cuenta...
```

El botón no debe poder presionarse varias veces.

---

# Activación exitosa

Si el backend responde correctamente, mostrar:

```text
Cuenta activada correctamente.
```

Mensaje complementario:

```text
Ya puedes iniciar sesión con tu correo y la contraseña que acabas de crear.
```

Mostrar botón:

```text
Ir al inicio de sesión
```

Redirigir a:

```text
/login
```

La redirección puede ser inmediata o después de un breve estado visual.

Preferir que el usuario vea primero la confirmación.

No iniciar sesión automáticamente.

No solicitar un JWT automáticamente.

No guardar credenciales.

---

# Error al completar la activación

Manejar por separado:

* token vencido;
* token utilizado;
* token inválido;
* contraseña inválida;
* error inesperado.

Si el backend rechaza la contraseña, mostrar el mensaje de validación correspondiente.

Si el token deja de ser válido mientras el formulario está abierto, reemplazar el formulario por el estado correspondiente.

Ejemplo:

```text
Este enlace ya no puede utilizarse.
```

---

# Servicio de API

Crear o verificar funciones equivalentes a:

```ts
validateAccountActivation(token: string)
```

```ts
completeAccountActivation(
  token: string,
  password: string
)
```

Ubicación sugerida:

```text
src/services/auth/accountActivation.ts
```

o dentro del servicio de autenticación existente.

No duplicar clientes HTTP.

Reutilizar la instancia configurada actual:

```text
api
httpClient
axiosInstance
```

No agregar un segundo cliente Axios innecesario.

---

# Ejemplo de servicio

Adaptar este ejemplo a la arquitectura real:

```ts
import { api } from "@/lib/api";

export async function validateAccountActivation(
  token: string
): Promise<void> {
  await api.get("/api/auth/account-activation/validate", {
    params: {
      token,
    },
  });
}

export async function completeAccountActivation(
  token: string,
  password: string
): Promise<void> {
  await api.post("/api/auth/account-activation/complete", {
    token,
    password,
  });
}
```

Preferir la opción `params` del cliente HTTP para evitar errores de codificación manual.

---

# Tipos

Crear tipos únicamente si aportan claridad.

Ejemplo:

```ts
export type ActivationViewState =
  | "validating"
  | "valid"
  | "invalid"
  | "expired"
  | "used"
  | "success"
  | "error";
```

Evitar:

* `any`;
* tipos duplicados;
* interfaces innecesarias;
* modelos que expongan estructuras internas del backend.

---

# Manejo de errores HTTP

Centralizar la interpretación de errores cuando sea posible.

Ejemplo conceptual:

```ts
if (status === 404) {
  setState("invalid");
}

if (status === 410) {
  setState("expired");
}
```

Si el backend diferencia token expirado y utilizado mediante un código estable, utilizar dicho código.

Ejemplo:

```json
{
  "code": "ACTIVATION_TOKEN_EXPIRED",
  "message": "Activation token expired"
}
```

```json
{
  "code": "ACTIVATION_TOKEN_USED",
  "message": "Activation token already used"
}
```

No depender solamente de textos humanos que puedan cambiar.

Si el backend no incluye códigos estables, documentar la limitación y utilizar el comportamiento actualmente disponible sin modificar innecesariamente el contrato.

---

# Diseño visual

La página debe respetar el diseño actual de la aplicación.

Reutilizar:

* tipografía;
* colores;
* botones;
* inputs;
* tarjetas;
* espaciado;
* componentes de formulario;
* alertas;
* loaders;
* layout de autenticación.

No crear una pantalla visualmente aislada.

La pantalla debe incluir, cuando corresponda:

* logo o nombre del sistema;
* título;
* descripción;
* formulario;
* mensajes;
* botón principal;
* enlace al login.

Nombre del sistema:

```text
Treasury System
```

---

# Accesibilidad

La pantalla debe cumplir como mínimo:

* etiquetas asociadas a inputs;
* mensajes de error legibles;
* navegación por teclado;
* foco visible;
* botón deshabilitado durante envío;
* `aria-live` para mensajes dinámicos cuando corresponda;
* contraste suficiente;
* textos claros.

Ejemplo:

```tsx
<div role="alert" aria-live="polite">
  {errorMessage}
</div>
```

El formulario debe poder utilizarse sin mouse.

---

# Responsive

La pantalla debe funcionar correctamente en:

* escritorio;
* tablet;
* móvil.

Evitar:

* anchos fijos excesivos;
* contenido cortado;
* botones fuera de pantalla;
* texto desbordado;
* scroll horizontal.

El formulario debe tener un ancho máximo razonable.

Ejemplo:

```css
max-width: 420px;
width: 100%;
```

Adaptar al sistema de estilos actual.

---

# Seguridad del frontend

No registrar en consola:

```ts
console.log(token);
```

No registrar:

* token;
* contraseña;
* payload completo;
* enlace completo;
* respuesta sensible.

No almacenar token ni contraseña en:

```text
localStorage
sessionStorage
cookies
IndexedDB
```

El token debe existir únicamente:

* en la URL;
* en memoria durante el flujo;
* en la solicitud al backend.

Después de activarse la cuenta, debe dejar de utilizarse.

---

# Configuración local

Usar:

```env
VITE_API_URL=http://localhost:8080
```

o la variable equivalente existente en el proyecto.

Usar en backend:

```env
FRONTEND_URL=http://localhost:5173
```

No agregar valores de producción.

No utilizar dominios reales.

No configurar HTTPS local salvo que ya exista.

---

# Correo local

El flujo puede probarse usando Mailpit.

Configuración sugerida:

```env
MAIL_HOST=localhost
MAIL_PORT=1025
MAIL_USERNAME=
MAIL_PASSWORD=
```

Mailpit puede ejecutarse con:

```bash
docker run -d \
  --name mailpit \
  -p 1025:1025 \
  -p 8025:8025 \
  axllent/mailpit
```

Interfaz local:

```text
http://localhost:8025
```

El correo debe contener un enlace similar a:

```text
http://localhost:5173/activate-account?token=TOKEN
```

---

# Flujo manual completo

## Paso 1 — Levantar infraestructura

Levantar:

* base de datos;
* backend;
* frontend;
* Mailpit.

Verificar:

```text
Backend: http://localhost:8080
Frontend: http://localhost:5173
Mailpit: http://localhost:8025
```

---

## Paso 2 — Iniciar sesión

Iniciar sesión con un usuario activo.

Obtener un JWT válido.

---

## Paso 3 — Crear usuario pendiente

Ejecutar:

```http
POST /api/admin/users
Authorization: Bearer {JWT}
Content-Type: application/json
```

Ejemplo:

```json
{
  "name": "María Pérez",
  "email": "maria@example.com"
}
```

Respuesta esperada:

```http
201 Created
```

Estado esperado:

```text
PENDING_ACTIVATION
```

---

## Paso 4 — Revisar correo

Abrir:

```text
http://localhost:8025
```

Buscar el correo enviado al usuario.

Confirmar que el enlace comience con:

```text
http://localhost:5173/activate-account
```

Confirmar que el enlace no contenga:

* UUID;
* hash;
* contraseña;
* email;
* código interno;
* datos sensibles.

---

## Paso 5 — Abrir enlace

Abrir el enlace completo desde el correo.

Resultado esperado:

* carga la aplicación;
* aparece la página de activación;
* se valida el token;
* aparece el formulario;
* no se solicita login;
* no se muestra una pantalla en blanco;
* no aparece un error 404.

---

## Paso 6 — Validar errores del formulario

Probar:

* contraseña vacía;
* confirmación vacía;
* contraseñas diferentes;
* contraseña que incumple la política.

La pantalla debe mostrar mensajes claros.

No debe enviarse la solicitud mientras el formulario sea inválido.

---

## Paso 7 — Activar cuenta

Ingresar una contraseña válida.

Enviar el formulario.

Resultado esperado:

```text
Cuenta activada correctamente.
```

El usuario debe pasar a:

```text
ACTIVE
```

El token debe quedar utilizado.

---

## Paso 8 — Login

Ir a:

```text
/login
```

Iniciar sesión con:

* email del usuario;
* contraseña recién creada.

Resultado esperado:

* login correcto;
* JWT generado;
* acceso a la aplicación.

---

## Paso 9 — Reutilización

Volver a abrir el mismo enlace.

Resultado esperado:

```text
Este enlace de activación ya fue utilizado.
```

No debe mostrarse el formulario.

No debe permitirse cambiar nuevamente la contraseña.

---

## Paso 10 — Token inválido

Abrir:

```text
http://localhost:5173/activate-account?token=invalid-token
```

Resultado esperado:

```text
El enlace de activación no es válido.
```

La aplicación no debe romperse.

---

## Paso 11 — Token ausente

Abrir:

```text
http://localhost:5173/activate-account
```

Resultado esperado:

```text
El enlace de activación no es válido.
```

No debe ejecutarse una solicitud con token nulo.

---

# Pruebas automáticas

Agregar o completar pruebas de frontend.

Utilizar las herramientas ya existentes:

* Vitest;
* React Testing Library;
* MSW, si ya está configurado;
* mocks existentes.

No introducir otra librería de pruebas si no es necesaria.

---

# Casos mínimos de prueba

## Render inicial

Verificar que:

* muestra estado de validación;
* lee el token;
* llama al endpoint de validación.

---

## Token válido

Verificar que:

* muestra formulario;
* muestra ambos campos;
* muestra botón de activación.

---

## Token ausente

Verificar que:

* muestra error;
* no llama al endpoint;
* no muestra formulario.

---

## Token inválido

Verificar que:

* maneja `404`;
* muestra mensaje correcto;
* no muestra formulario.

---

## Token vencido

Verificar que:

* maneja `410`;
* muestra mensaje de vencimiento;
* no permite continuar.

---

## Token utilizado

Verificar que:

* muestra mensaje de uso previo;
* ofrece acceso al login;
* no muestra formulario.

---

## Contraseñas diferentes

Verificar que:

* muestra mensaje;
* no llama al endpoint de finalización.

---

## Activación correcta

Verificar que:

* envía token y contraseña;
* no envía confirmación;
* muestra éxito;
* permite ir al login.

---

## Error al activar

Verificar que:

* muestra mensaje controlado;
* restaura el botón;
* permite reintentar cuando corresponda.

---

## Envío duplicado

Verificar que:

* el botón se deshabilita;
* no se ejecutan múltiples solicitudes.

---

# Integración con el login

La pantalla de activación debe redirigir a:

```text
/login
```

No modificar el login salvo que sea necesario para recibir una notificación opcional.

Opcionalmente puede enviarse un estado de navegación:

```ts
navigate("/login", {
  state: {
    accountActivated: true,
  },
});
```

El login podría mostrar:

```text
Tu cuenta fue activada. Ya puedes iniciar sesión.
```

Solo implementar esto si encaja con la arquitectura actual.

No utilizar parámetros que incluyan token o contraseña.

---

# Archivos esperados

Los nombres exactos pueden variar según la arquitectura.

Ejemplo:

```text
src/pages/auth/ActivateAccountPage.tsx
src/services/auth/accountActivation.ts
src/routes/AppRoutes.tsx
src/pages/auth/ActivateAccountPage.test.tsx
```

También podrían modificarse:

```text
src/components/auth/AuthLayout.tsx
src/components/ui/Alert.tsx
src/lib/api.ts
src/types/auth.ts
```

No crear archivos duplicados si ya existen componentes equivalentes.

---

# Criterios de aceptación

La tarea se considera completada cuando:

* existe la ruta pública `/activate-account`;
* puede abrirse directamente en local;
* no requiere autenticación;
* lee correctamente el token;
* valida automáticamente el token;
* muestra estado de carga;
* maneja token inválido;
* maneja token vencido;
* maneja token utilizado;
* muestra formulario solo para tokens válidos;
* valida las contraseñas;
* completa la activación;
* bloquea envíos duplicados;
* muestra confirmación;
* permite ir al login;
* el usuario activado puede iniciar sesión;
* el token no puede reutilizarse;
* no se registran datos sensibles;
* el diseño es consistente;
* funciona en móvil y escritorio;
* las pruebas pasan;
* el build funciona;
* no se creó ningún commit.

---

# Validaciones técnicas

Ejecutar desde el frontend los comandos definidos en el proyecto.

Como mínimo:

```bash
npm run typecheck
```

```bash
npm run lint
```

```bash
npm run test
```

```bash
npm run build
```

Si el proyecto utiliza otros comandos, ejecutar los equivalentes.

También ejecutar:

```bash
git diff --check
```

---

# Validación manual obligatoria

La tarea no puede considerarse completada únicamente porque:

* compile;
* pase TypeScript;
* pase lint;
* pasen pruebas unitarias;
* exista el archivo de la página.

Debe realizarse una validación visual manual en el navegador.

Probar como mínimo:

```text
http://localhost:5173/activate-account
```

```text
http://localhost:5173/activate-account?token=invalid-token
```

```text
http://localhost:5173/activate-account?token={TOKEN_REAL}
```

Confirmar visualmente:

* página cargada;
* estilos aplicados;
* formulario visible;
* errores visibles;
* loader visible;
* botón funcionando;
* navegación al login;
* ausencia de pantalla en blanco;
* ausencia de errores en consola;
* ausencia de solicitudes incorrectas.

---

# Reporte final esperado

Al finalizar, reportar:

## Implementación

* archivos creados;
* archivos modificados;
* ruta implementada;
* componentes utilizados;
* servicio API utilizado;
* validaciones agregadas;
* estados visuales implementados.

## Pruebas

* cantidad de pruebas;
* pruebas exitosas;
* pruebas fallidas;
* comandos ejecutados;
* resultado del build.

## Validación manual

Confirmar explícitamente:

* la pantalla fue abierta en el navegador;
* el formulario fue visualizado;
* se utilizó un token real;
* la cuenta fue activada;
* el login posterior funcionó;
* el token reutilizado fue rechazado;
* el token inválido mostró un error controlado;
* no hubo errores en consola.

## Seguridad

Confirmar:

* no se registra el token;
* no se registra la contraseña;
* no se almacena el token;
* no se almacena la contraseña;
* no se envía la confirmación al backend;
* no se exponen datos internos;
* no se modificó el registro público;
* no se implementaron roles;
* no se realizó configuración de producción.

## Git

Confirmar:

```text
No se creó ningún commit.
```

