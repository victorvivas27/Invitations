# Tarea 12 — Persistencia de invitaciones y URL pública compartible

**Guardar en:** `docs/tasks/task-12-invitation-persistence-public-page.md`

---

# Objetivo

Implementar la persistencia completa de invitaciones y generar una URL pública única para cada invitación creada.

La aplicación no debe generar archivos PDF ni imágenes estáticas.

Cada invitación debe guardarse en el backend y publicarse como una página web accesible mediante una URL compartible.

Ejemplo:

```text
http://localhost:5173/i/cumpleanos-de-sofia-a8k3m2
```

La página pública debe renderizar dinámicamente:

* la plantilla seleccionada;
* nombre del evento;
* persona homenajeada;
* edad opcional;
* fecha;
* hora;
* lugar;
* dirección;
* mensaje.

Esta tarea debe conectar el Wizard implementado en la Tarea 11 con el backend.

No implementar todavía:

* carga real de imágenes;
* galería de fotografías;
* mapas;
* música;
* confirmación de asistencia;
* edición posterior;
* eliminación;
* panel de invitaciones;
* producción;
* commits.

---

# Resultado esperado

El flujo completo debe ser:

```text
Home
↓
Galería de plantillas
↓
Seleccionar plantilla
↓
Completar Wizard
↓
Guardar invitación
↓
Backend genera identificador y slug público
↓
Frontend muestra confirmación
↓
Abrir página pública
↓
Compartir URL
```

---

# Conceptos de dominio

## Plantilla

Una plantilla representa el diseño visual reutilizable.

Ejemplo:

```text
birthday-urban
```

Define aspectos como:

* colores;
* tipografía;
* distribución;
* formas decorativas;
* apariencia de la página pública.

La plantilla no contiene información personal del evento.

---

## Invitación

Una invitación representa una instancia concreta creada por un usuario.

Ejemplo:

```text
Cumpleaños de Sofía
```

Debe incluir:

* plantilla;
* contenido del evento;
* propietario;
* estado;
* slug público;
* fechas de creación y modificación.

---

## Página pública

La página pública es una vista web dinámica.

Ejemplo:

```text
/i/cumpleanos-de-sofia-a8k3m2
```

No requiere autenticación para visualizarse cuando la invitación está publicada.

No debe exponer:

* UUID interno;
* propietario;
* email;
* JWT;
* hash;
* datos internos.

---

# Alcance técnico

Implementar:

## Backend

* entidad de invitación;
* migración de base de datos;
* repositorio;
* caso de uso de creación;
* generación de slug público;
* endpoint autenticado para crear invitaciones;
* endpoint público para consultar una invitación publicada;
* validaciones;
* manejo de errores;
* pruebas;
* seguridad.

## Frontend

* conexión del Wizard con el backend;
* estado real de guardado;
* pantalla de éxito;
* visualización y copia de URL;
* página pública dinámica;
* manejo de slug inexistente;
* manejo de invitación no publicada;
* pruebas;
* validación visual local.

---

# Estado de la invitación

Crear un estado de dominio equivalente a:

```text
DRAFT
PUBLISHED
```

En esta tarea, al finalizar el Wizard, la invitación puede crearse directamente como:

```text
PUBLISHED
```

Esto simplifica el primer flujo funcional.

No implementar todavía publicación manual ni borradores editables.

Sin embargo, mantener el estado en el modelo para permitir esa evolución posteriormente.

---

# Propietario

Cada invitación debe pertenecer al usuario autenticado que la crea.

El propietario debe obtenerse exclusivamente desde el JWT o el contexto de seguridad.

No aceptar desde el frontend:

```text
ownerId
userId
email
publicCode del propietario
```

El cliente no debe poder decidir quién es el propietario.

---

# Persistencia

Crear una tabla equivalente a:

```text
invitations
```

Migración sugerida:

```text
V4__create_invitations.sql
```

Adaptar el número a las migraciones existentes.

---

# Campos mínimos de persistencia

La entidad debe incluir al menos:

```text
id
public_slug
owner_id
template_id
event_type
event_name
honoree_name
honoree_age
event_date
event_time
venue_name
address
message
status
created_at
updated_at
```

---

# Identificador interno

El identificador interno puede continuar utilizando la estrategia actual del proyecto.

No debe enviarse a la página pública.

No debe incluirse en la URL compartible.

---

# Slug público

Crear un identificador público legible y difícil de adivinar.

Ejemplo:

```text
cumpleanos-de-sofia-a8k3m2
```

Debe estar compuesto por:

```text
slug normalizado del nombre + sufijo aleatorio
```

Ejemplo conceptual:

```text
cumpleanos-de-sofia
+
a8k3m2
```

Resultado:

```text
cumpleanos-de-sofia-a8k3m2
```

---

# Requisitos del slug

El slug debe:

* ser único;
* estar en minúsculas;
* ser URL-safe;
* eliminar tildes;
* reemplazar espacios por guiones;
* eliminar caracteres especiales;
* evitar guiones duplicados;
* no exponer UUID;
* incluir entropía aleatoria;
* tener una longitud máxima razonable.

Ejemplo:

```text
Cumpleaños de Sofía
```

Debe convertirse en una base similar a:

```text
cumpleanos-de-sofia
```

Luego agregar un sufijo aleatorio.

---

# Generación segura del sufijo

Utilizar:

```text
SecureRandom
```

No utilizar:

```text
Math.random
```

No utilizar un contador secuencial.

El sufijo puede usar:

```text
letras minúsculas y números
```

Longitud sugerida:

```text
6 a 10 caracteres
```

Debe existir una restricción única en base de datos.

Ante una colisión excepcional, regenerar el slug con un límite seguro de intentos.

---

# Restricciones de base de datos

Agregar como mínimo:

```text
UNIQUE(public_slug)
NOT NULL(public_slug)
NOT NULL(owner_id)
NOT NULL(template_id)
NOT NULL(event_type)
NOT NULL(event_name)
NOT NULL(honoree_name)
NOT NULL(event_date)
NOT NULL(event_time)
NOT NULL(venue_name)
NOT NULL(address)
NOT NULL(message)
NOT NULL(status)
NOT NULL(created_at)
NOT NULL(updated_at)
```

`honoree_age` debe aceptar `NULL`.

Adaptar restricciones de longitud al dominio y a las validaciones existentes.

---

# Relación con usuario

La invitación debe relacionarse con el usuario existente.

Ejemplo conceptual:

```text
invitations.owner_id → users.id
```

Definir la estrategia de eliminación de forma segura.

No eliminar invitaciones automáticamente si se elimina un usuario salvo que el dominio ya tenga esa política explícita.

Preferir una restricción que proteja la integridad.

---

# Contrato de creación

Implementar:

```http
POST /api/invitations
```

Debe requerir:

```http
Authorization: Bearer {JWT}
```

---

# Payload de creación

```json
{
  "templateId": "birthday-urban",
  "eventType": "BIRTHDAY",
  "eventName": "Cumpleaños de Sofía",
  "honoreeName": "Sofía",
  "honoreeAge": 5,
  "eventDate": "2026-08-22",
  "eventTime": "17:00",
  "venueName": "Salón Central",
  "address": "Avenida Principal 123",
  "message": "Te esperamos para celebrar juntos."
}
```

No aceptar:

* `id`;
* `publicSlug`;
* `ownerId`;
* `status`;
* `createdAt`;
* `updatedAt`;
* URL completa;
* JWT dentro del body.

---

# Respuesta de creación

Responder:

```http
201 Created
```

Ejemplo:

```json
{
  "publicSlug": "cumpleanos-de-sofia-a8k3m2",
  "publicUrl": "/i/cumpleanos-de-sofia-a8k3m2",
  "status": "PUBLISHED",
  "eventName": "Cumpleaños de Sofía"
}
```

Preferir devolver una ruta relativa:

```text
/i/{slug}
```

El frontend debe construir la URL completa usando:

```text
window.location.origin
```

No generar la URL pública del frontend desde cabeceras manipulables recibidas por el backend.

No incluir dominio de producción en esta tarea.

---

# Cabecera Location

La respuesta puede incluir:

```http
Location: /api/public/invitations/cumpleanos-de-sofia-a8k3m2
```

No es obligatorio si el proyecto no sigue esta convención, pero es recomendable.

---

# Endpoint público

Implementar:

```http
GET /api/public/invitations/{slug}
```

Debe ser público.

No debe requerir JWT.

---

# Respuesta pública

Ejemplo:

```json
{
  "publicSlug": "cumpleanos-de-sofia-a8k3m2",
  "templateId": "birthday-urban",
  "eventType": "BIRTHDAY",
  "eventName": "Cumpleaños de Sofía",
  "honoreeName": "Sofía",
  "honoreeAge": 5,
  "eventDate": "2026-08-22",
  "eventTime": "17:00",
  "venueName": "Salón Central",
  "address": "Avenida Principal 123",
  "message": "Te esperamos para celebrar juntos."
}
```

No devolver:

* identificador interno;
* propietario;
* email;
* código público del usuario;
* fechas internas si no son necesarias;
* estado técnico;
* datos de auditoría.

---

# Invitación inexistente

Si el slug no existe, responder:

```http
404 Not Found
```

Con el formato estable de errores del proyecto.

Ejemplo conceptual:

```json
{
  "code": "INVITATION_NOT_FOUND",
  "message": "Invitation not found"
}
```

---

# Invitación no publicada

Si una invitación existe pero no está publicada, el endpoint público debe responder:

```http
404 Not Found
```

No utilizar `403`, porque eso permitiría confirmar que el recurso existe.

Aunque en esta tarea se creen directamente como publicadas, implementar la consulta teniendo en cuenta el estado.

---

# Validaciones del backend

Validar:

* plantilla obligatoria;
* plantilla reconocida;
* tipo de evento obligatorio;
* nombre del evento obligatorio;
* persona homenajeada obligatoria;
* edad opcional;
* edad dentro de un rango razonable;
* fecha obligatoria;
* hora obligatoria;
* lugar obligatorio;
* dirección obligatoria;
* mensaje obligatorio;
* límites de longitud;
* espacios en blanco;
* valores desconocidos.

---

# Plantillas reconocidas

El backend no debe aceptar cualquier cadena arbitraria como plantilla.

Definir una lista permitida equivalente a las plantillas disponibles en frontend.

Opciones válidas:

* enum;
* catálogo de dominio;
* validador centralizado.

No duplicar la lista en múltiples clases.

Las plantillas marcadas como:

```text
Próximamente
```

no deben poder utilizarse para crear invitaciones.

---

# Normalización

Normalizar:

* textos con `trim`;
* campos vacíos después de recortar;
* template ID en el formato definido;
* tipo de evento según enum.

No convertir automáticamente el contenido visible del usuario a minúsculas.

La normalización del slug sí debe utilizar minúsculas.

---

# Fecha del evento

Permitir fechas actuales o futuras según la política de producto.

Para esta primera versión, rechazar fechas anteriores al día actual.

La comparación debe utilizar una abstracción de reloj:

```text
Clock
```

para que las pruebas sean deterministas.

No utilizar directamente:

```java
LocalDate.now()
```

dentro del caso de uso si el proyecto ya sigue prácticas testeables.

---

# Hora

Utilizar un tipo apropiado:

```text
LocalTime
```

No guardar la hora como texto arbitrario.

---

# Edad

La edad debe ser opcional.

Rango sugerido:

```text
0 a 150
```

No requerir edad para eventos como matrimonios o aniversarios.

---

# Longitudes sugeridas

Adaptar si ya existen convenciones:

```text
templateId: 80
eventType: 40
eventName: 120
honoreeName: 100
venueName: 150
address: 250
message: 1000
publicSlug: 180
```

La base de datos, DTOs y validaciones deben estar alineados.

---

# Arquitectura

Mantener la arquitectura existente.

Crear componentes equivalentes a:

```text
CreateInvitationUseCase
GetPublicInvitationUseCase
InvitationRepository
PublicSlugGenerator
InvitationTemplateCatalog
```

Adaptar nombres y paquetes al proyecto.

No colocar lógica de negocio dentro del Controller.

---

# Transacción

La creación de la invitación debe ejecutarse dentro de una transacción.

La operación debe:

1. validar datos;
2. identificar al propietario autenticado;
3. validar la plantilla;
4. generar el slug;
5. persistir;
6. responder con la información pública.

---

# Seguridad de Spring

Configurar como público únicamente:

```text
GET /api/public/invitations/**
```

Mantener autenticado:

```text
POST /api/invitations
```

El resto debe conservar la política de seguridad actual.

---

# Autenticación

El endpoint de creación debe obtener al usuario desde el principal autenticado.

Si el usuario del token ya no existe, responder:

```http
401 Unauthorized
```

o aplicar el comportamiento establecido actualmente en el proyecto.

No crear usuarios automáticamente.

---

# Frontend — Finalización del Wizard

Reemplazar el botón deshabilitado:

```text
Finalizar próximamente
```

por:

```text
Crear invitación
```

Debe estar habilitado únicamente cuando:

* todos los pasos sean válidos;
* exista una plantilla válida;
* no haya una solicitud en progreso.

---

# Estado de envío

Mientras se crea la invitación:

* deshabilitar navegación;
* deshabilitar botón final;
* impedir envíos duplicados;
* mostrar progreso.

Texto:

```text
Creando invitación...
```

No permitir regresar a pasos anteriores mientras la solicitud está confirmándose, salvo que se implemente cancelación real.

---

# Servicio frontend

Crear o completar:

```text
frontend/src/services/invitations.ts
```

Tipos sugeridos:

```ts
export type CreateInvitationInput = {
  templateId: string;
  eventType: string;
  eventName: string;
  honoreeName: string;
  honoreeAge?: number;
  eventDate: string;
  eventTime: string;
  venueName: string;
  address: string;
  message: string;
};

export type CreatedInvitation = {
  publicSlug: string;
  publicUrl: string;
  status: "PUBLISHED";
  eventName: string;
};
```

No utilizar `any`.

---

# Creación desde el frontend

Ejemplo conceptual:

```ts
const result = await createInvitation(draft);
```

El cliente HTTP existente debe incluir el JWT.

No construir manualmente un segundo cliente.

No incluir el token dentro del body.

---

# Estado de éxito

Después de crear la invitación, mostrar una pantalla clara.

Título:

```text
Tu invitación está lista
```

Mensaje:

```text
Ya puedes abrirla y compartirla con tus invitados.
```

Mostrar la URL completa:

```text
http://localhost:5173/i/cumpleanos-de-sofia-a8k3m2
```

Construirla mediante:

```ts
const shareUrl = new URL(
  result.publicUrl,
  window.location.origin
).toString();
```

No hardcodear:

```text
localhost
```

---

# Acciones de éxito

Mostrar:

```text
Ver invitación
```

```text
Copiar enlace
```

```text
Volver a plantillas
```

---

# Ver invitación

Debe abrir:

```text
/i/{slug}
```

Preferir navegación en la misma pestaña.

No abrir automáticamente una nueva ventana sin acción del usuario.

---

# Copiar enlace

Utilizar:

```ts
navigator.clipboard.writeText(shareUrl);
```

Manejar errores cuando Clipboard API no esté disponible.

Confirmación:

```text
Enlace copiado
```

La confirmación debe ser accesible mediante:

```text
aria-live
```

No registrar la URL en consola.

La URL es pública, pero no es necesario escribirla en logs.

---

# Error de creación

Manejar:

## 400 Bad Request

Mostrar errores de validación sin perder los datos del Wizard.

## 401 Unauthorized

* limpiar sesión;
* redirigir a `/login`.

## 403 Forbidden

Mostrar:

```text
No tienes permiso para crear invitaciones.
```

## Plantilla inválida

Mostrar:

```text
La plantilla seleccionada ya no está disponible.
```

Ofrecer:

```text
Volver a plantillas
```

## Error de red

Mostrar:

```text
No fue posible conectar con el servidor.
```

Permitir reintentar sin perder el contenido.

## Error inesperado

Mostrar:

```text
No fue posible crear la invitación.
```

No mostrar detalles internos.

---

# Página pública frontend

Crear la ruta:

```text
/i/:slug
```

Ejemplo:

```text
/i/cumpleanos-de-sofia-a8k3m2
```

Debe ser pública.

No debe requerir JWT.

No debe redirigir al login.

---

# Componente público

Crear:

```text
PublicInvitationPage
```

Ubicación sugerida:

```text
frontend/src/pages/PublicInvitationPage.tsx
```

---

# Carga pública

Al abrir la página, consultar:

```http
GET /api/public/invitations/{slug}
```

Codificar correctamente el slug.

No enviar JWT de forma obligatoria.

Si el cliente HTTP agrega JWT automáticamente cuando existe, verificar que el endpoint también funcione sin sesión.

---

# Estados de la página pública

Manejar:

```text
LOADING
READY
NOT_FOUND
NETWORK_ERROR
UNEXPECTED_ERROR
```

---

# Estado de carga

Mostrar una vista de carga coherente con la plantilla o un skeleton.

Texto accesible:

```text
Cargando invitación...
```

---

# Invitación encontrada

Renderizar una página web completa.

No mostrar el Wizard.

No mostrar campos editables.

No mostrar controles administrativos.

---

# Contenido público

Mostrar:

* nombre del evento;
* persona homenajeada;
* edad, cuando exista;
* fecha;
* hora;
* lugar;
* dirección;
* mensaje;
* diseño correspondiente a la plantilla.

---

# Formato de fecha

Utilizar:

```ts
Intl.DateTimeFormat
```

Ejemplo:

```text
Sábado 22 de agosto de 2026
```

No agregar una dependencia únicamente para formatear fechas.

---

# Formato de hora

Mostrar una hora comprensible.

Ejemplo:

```text
17:00
```

o:

```text
5:00 p. m.
```

Mantener coherencia con el locale elegido.

---

# Diseño según plantilla

La página pública debe respetar la plantilla seleccionada.

No es necesario crear doce páginas completamente independientes.

Crear un sistema centralizado equivalente a:

```ts
const templateRenderers = {
  "birthday-urban": BirthdayUrbanInvitation,
  "birthday-colorful": BirthdayColorfulInvitation,
};
```

o un componente configurable por variantes.

Evitar un `switch` gigante dentro de la página principal.

---

# Alcance visual inicial

Para esta tarea, implementar correctamente al menos las plantillas marcadas como disponibles.

Si todas las plantillas actuales están disponibles, todas deben renderizar una variante reconocible.

Puede reutilizarse una estructura común con:

* colores;
* tipografía;
* decoración;
* distribución;
* badges;
* fondos.

No duplicar toda la lógica para cada plantilla.

---

# Plantilla desconocida en datos públicos

Si el backend devuelve un `templateId` que el frontend no reconoce:

* no romper la página;
* utilizar una variante visual fallback;
* registrar únicamente un error técnico no sensible si las reglas del proyecto permiten logs;
* mostrar el contenido de forma legible.

Preferir no registrar datos completos de la invitación.

---

# Página no encontrada

Si el backend responde `404`, mostrar:

```text
Esta invitación no está disponible.
```

Texto complementario:

```text
El enlace puede ser incorrecto o la invitación ya no está publicada.
```

Acción:

```text
Ir al inicio
```

No distinguir públicamente entre:

* slug inexistente;
* invitación borrada;
* invitación en borrador.

---

# Error de red público

Mostrar:

```text
No pudimos cargar la invitación.
```

Acción:

```text
Reintentar
```

No redirigir al login.

---

# Metadatos del documento

Actualizar:

```text
document.title
```

Ejemplo:

```text
Cumpleaños de Sofía | Mi Invitación
```

Restaurar o actualizar el título correctamente al navegar.

No implementar todavía Open Graph dinámico desde servidor.

Puede documentarse como mejora futura.

---

# Responsive de la página pública

Validar:

```text
320px
375px
768px
1024px
1440px
```

La página pública debe priorizar móvil porque la mayoría de invitados abrirán el enlace desde el teléfono.

Debe:

* cargar en una columna en móvil;
* tener texto legible;
* evitar scroll horizontal;
* mostrar botones grandes;
* mantener decoraciones contenidas;
* respetar áreas seguras;
* evitar elementos fijos que cubran contenido.

---

# Accesibilidad

Cumplir:

* un único `h1`;
* estructura semántica;
* contraste suficiente;
* contenido en orden lógico;
* fecha y lugar legibles;
* navegación por teclado;
* mensajes de error accesibles;
* foco visible;
* movimiento reducido;
* decoraciones ignoradas por lectores de pantalla.

---

# Seguridad pública

No incluir en la respuesta ni en la página:

* propietario;
* email del creador;
* código público del usuario;
* UUID;
* JWT;
* hash;
* auditoría;
* información interna.

El slug debe ser el único identificador público.

No considerar el slug como un secreto.

La privacidad no debe depender únicamente de que el slug sea difícil de adivinar.

---

# Pruebas del backend

Agregar al menos:

## Creación exitosa

* usuario autenticado;
* plantilla válida;
* persistencia correcta;
* estado publicado;
* propietario correcto;
* respuesta `201`.

## Sin autenticación

* responde `401`.

## Propietario desde JWT

* ignora cualquier intento de enviar propietario;
* utiliza el usuario autenticado.

## Slug

* normaliza tildes;
* elimina caracteres especiales;
* utiliza minúsculas;
* agrega sufijo;
* es URL-safe;
* evita colisiones.

## Plantilla inválida

* responde `400`.

## Plantilla próxima

* responde `400`.

## Fecha pasada

* responde `400`.

## Edad inválida

* responde `400`.

## Campos vacíos

* responde `400`.

## Consulta pública

* invitación publicada responde `200`;
* invitación inexistente responde `404`;
* invitación no publicada responde `404`;
* no devuelve propietario;
* no devuelve ID interno.

## Seguridad

* GET público sin JWT;
* POST protegido;
* resto de rutas conserva seguridad.

---

# Pruebas del frontend

Agregar al menos:

## Finalización del Wizard

* botón final habilitado con datos válidos;
* envía el modelo correcto;
* impide doble envío;
* muestra estado de carga.

## Éxito

* muestra URL;
* permite ver invitación;
* permite copiar enlace;
* muestra confirmación de copia.

## Error de validación

* conserva los datos;
* permite corregir.

## Sesión vencida

* limpia sesión;
* redirige a login.

## Error de red

* conserva el borrador en memoria;
* permite reintentar.

## Página pública

* obtiene datos por slug;
* muestra contenido;
* aplica variante de plantilla;
* formatea fecha;
* maneja edad opcional.

## Slug inexistente

* muestra estado no disponible;
* no rompe la aplicación.

## Error de red público

* muestra reintento;
* no redirige al login.

## Accesibilidad

* un único `h1`;
* botones con nombre;
* mensajes anunciables;
* URL copiable;
* página navegable.

---

# Validación manual local

Levantar:

```text
Base de datos
Backend
Frontend
```

No es necesario Mailpit para esta tarea.

---

# Flujo manual obligatorio

## Paso 1

Abrir:

```text
http://localhost:5173/templates
```

## Paso 2

Seleccionar una plantilla disponible.

## Paso 3

Completar los seis pasos del Wizard.

## Paso 4

Presionar:

```text
Crear invitación
```

## Paso 5

Confirmar que aparece:

```text
Tu invitación está lista
```

## Paso 6

Copiar el enlace.

## Paso 7

Abrir el enlace en una pestaña nueva o ventana privada.

## Paso 8

Confirmar que la invitación abre sin login.

## Paso 9

Confirmar que los datos coinciden con el Wizard.

## Paso 10

Actualizar la página pública y confirmar que los datos persisten.

## Paso 11

Reiniciar el backend y confirmar que la invitación continúa disponible.

## Paso 12

Probar un slug inexistente.

---

# Archivos esperados

Los nombres pueden adaptarse a la arquitectura real.

## Backend

```text
backend/src/main/resources/db/migration/V4__create_invitations.sql
backend/src/main/java/.../domain/invitation/Invitation.java
backend/src/main/java/.../domain/invitation/InvitationStatus.java
backend/src/main/java/.../application/invitation/CreateInvitationUseCase.java
backend/src/main/java/.../application/invitation/GetPublicInvitationUseCase.java
backend/src/main/java/.../application/invitation/PublicSlugGenerator.java
backend/src/main/java/.../application/invitation/InvitationTemplateCatalog.java
backend/src/main/java/.../infrastructure/persistence/...
backend/src/main/java/.../web/InvitationController.java
backend/src/main/java/.../web/PublicInvitationController.java
```

## Frontend

```text
frontend/src/services/invitations.ts
frontend/src/pages/PublicInvitationPage.tsx
frontend/src/pages/PublicInvitationPage.test.tsx
frontend/src/components/invitations/PublicInvitationRenderer.tsx
frontend/src/components/invitations/templates/...
frontend/src/components/invitations/InvitationCreationSuccess.tsx
frontend/src/components/invitations/InvitationWizard.tsx
frontend/src/pages/CreateInvitationPage.tsx
frontend/src/types/invitation.ts
```

No crear archivos duplicados si ya existen equivalentes.

---

# Criterios de aceptación

La tarea se considera completada cuando:

* el Wizard crea una invitación real;
* la invitación se guarda en base de datos;
* pertenece al usuario autenticado;
* se genera un slug único;
* el slug no contiene UUID;
* se devuelve una URL pública;
* existe `/i/:slug`;
* la página pública funciona sin autenticación;
* los datos persisten al refrescar;
* los datos persisten al reiniciar;
* el diseño depende de la plantilla;
* el slug inexistente se maneja correctamente;
* no se exponen datos internos;
* el frontend permite copiar el enlace;
* se bloquean envíos duplicados;
* las validaciones funcionan;
* las pruebas pasan;
* backend y frontend compilan;
* no se implementan imágenes todavía;
* no se implementa RSVP;
* no se implementa edición;
* no se configura producción;
* no se crea ningún commit.

---

# Validaciones técnicas

## Backend

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

## Frontend

Ejecutar:

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

## Git

Ejecutar:

```bash
git diff --check
```

---

# Reporte final esperado

## Backend

Reportar:

* migración creada;
* entidad;
* estado;
* repositorio;
* casos de uso;
* endpoints;
* validaciones;
* estrategia de slug;
* seguridad;
* cantidad de pruebas;
* cobertura;
* comandos ejecutados.

## Frontend

Reportar:

* servicio implementado;
* conexión del Wizard;
* estado de carga;
* pantalla de éxito;
* copia de URL;
* página pública;
* variantes visuales;
* estados de error;
* pruebas;
* build.

## Validación manual

Confirmar únicamente lo realmente probado:

* invitación creada;
* datos persistidos;
* URL generada;
* URL copiada;
* página abierta sin login;
* actualización de página;
* reinicio del backend;
* slug inválido;
* revisión móvil;
* ausencia de errores en consola.

## Seguridad

Confirmar:

* el propietario proviene del JWT;
* no se acepta propietario desde el cliente;
* no se expone ID interno;
* no se expone email;
* no se expone JWT;
* el endpoint público no requiere autenticación;
* el endpoint de creación sí requiere autenticación;
* no se generan PDFs;
* no se crean archivos estáticos por invitación.

## Restricciones

Confirmar:

```text
No se implementó carga de imágenes.
No se implementó galería.
No se implementaron mapas.
No se implementó música.
No se implementó RSVP.
No se implementó edición.
No se realizó configuración de producción.
No se creó ningún commit.
```
• Tarea 12 implementada en backend y frontend.

  ### Backend

  - Migración V4__create_invitations.sql.
  - Entidad de invitación con estados DRAFT y PUBLISHED.
  - Relación protegida con el usuario propietario.
  - Propietario obtenido exclusivamente desde el principal JWT.
  - Validaciones de campos, longitud, edad, fecha y plantilla.
  - Catálogo centralizado de plantillas disponibles.
  - Slug normalizado con sufijo de 8 caracteres generado mediante SecureRandom.
  - Detección y reintento ante colisiones.
  - Endpoints:
      - POST /api/invitations, autenticado.
      - GET /api/public/invitations/{slug}, público.

  - La respuesta pública no contiene ID interno, propietario, email, estado ni auditoría.
  - Invitaciones inexistentes o no publicadas responden 404.

  Archivos destacados:

  - backend/src/main/resources/db/migration/V4__create_invitations.sql
  - backend/src/main/java/com/invitation/invitation/domain/Invitation.java
  - backend/src/main/java/com/invitation/invitation/application/CreateInvitationService.java
  - backend/src/main/java/com/invitation/invitation/infrastructure/SecurePublicSlugGenerator.java
  - backend/src/main/java/com/invitation/invitation/web/InvitationController.java

  ### Frontend

  - Wizard conectado al backend.
  - Token enviado solamente mediante Authorization: Bearer.
  - Estado Creando invitación... y bloqueo de envíos duplicados.
  - Manejo de errores de validación, permisos, sesión y red.
  - Pantalla de éxito con URL construida desde window.location.origin.
  - Acciones para abrir, copiar y volver a plantillas.
  - Ruta pública /i/:slug.
  - Página pública responsive con variantes visuales por plantilla.
  - Formato localizado de fecha.
  - Edad opcional correctamente manejada.
  - Estados loading, not found, red y reintento.
  - Actualización de document.title.

  Archivos destacados:

  - frontend/src/services/invitations.ts
  - frontend/src/components/invitations/InvitationCreationSuccess.tsx
  - frontend/src/pages/PublicInvitationPage.tsx
  - frontend/src/components/invitations/PublicInvitationRenderer.tsx
  - docs/tasks/task-12-invitation-persistence-public-page.md

  ### Validaciones

  - Backend: 41 pruebas exitosas, 0 fallidas.
  - Cobertura backend: 81,81 %.
  - Gradle clean, test, check y bootJar: correctos.
  - PMD y JaCoCo: correctos.
  - Frontend: 29 pruebas exitosas, 0 fallidas.
  - TypeScript, lint y build frontend: correctos.
  - git diff --check: correcto; solo avisos LF/CRLF existentes.

  No ejecuté el flujo manual con PostgreSQL y navegador, por lo que no afirmo haber comprobado visualmente reinicio del backend, portapapeles real o ventanas privadas.

  No se implementó carga de imágenes.
  No se implementó galería fotográfica.
  No se implementaron mapas, música ni RSVP.
  No se implementó edición ni eliminación.
  No se generaron PDFs ni archivos estáticos.
  No se realizó configuración de producción.
  No se creó ningún commit.

   1. Portada
      - Foto o ilustración principal.
      - “Estás invitado”.
      - Nombre del cumpleaños.
      - Edad actual o mensaje destacado.

  2. Introducción
      - Una frase especial.
      - Ejemplo: “Queremos compartir contigo un día lleno de alegría”.

  3. Fecha y hora
      - Día completo.
      - Hora en formato de 24 horas.
      - Cuenta regresiva para el evento.

  4. Lugar
      - Nombre del lugar.
      - Dirección.
      - Botón para abrir Google Maps.

  5. Galería
      - Varias fotos del cumpleañero.
      - Una frase debajo de cada foto o una frase general.

  6. Confirmar asistencia
      - Nombre del invitado.
      - Cantidad de asistentes.
      - Opciones: “Sí, asistiré” o “No podré asistir”.
      - Mensaje opcional para el anfitrión.
  7. Despedida
      - Una frase como: “Tu presencia hará este día todavía más especial”.
      - Foto final.
      - “Te esperamos”.
  suaves. Así se siente como ir abriendo capítulos de la invitación, no como leer una ficha básica.

  También tendremos que unificar la miniatura de la plantilla, la vista previa y la invitación final para que siempre muestren exactamente el
  mismo diseño
