# Modelo de dominio de Invitation

## 1. Alcance y flujo considerado

Este documento define el modelo conceptual; no prescribe todavía tablas, clases JPA ni endpoints.

El flujo esperado es:

1. Una persona crea una cuenta y una invitación en borrador.
2. Define el evento, ubicación, apariencia y contenido multimedia.
3. Puede preparar una lista de invitados y configurar privacidad y RSVP.
4. Publica una versión estable y comparte un enlace público no basado en IDs internos.
5. Los invitados consultan la invitación y, si está permitido, confirman asistencia.
6. La persona propietaria actualiza, archiva o elimina lógicamente la invitación y sus datos personales asociados.

Una cuenta puede tener muchas invitaciones. Cada invitación representa un único evento; crear otra invitación permite gestionar otro evento sin introducir complejidad innecesaria en el agregado. Una futura invitación con agenda de varias actividades podría añadir `EventScheduleItem` sin cambiar la propiedad ni la publicación.

## 2. Límites y agregados

### Agregado Invitation

`Invitation` es la raíz. Controla `EventDetails`, `InvitationAppearance`, `InvitationMedia`, `Guest`, `RsvpResponse` y `PublicAccessLink`. Estos objetos no deben modificarse sin comprobar las reglas de su invitación.

### Agregado Template

`Template` y `TemplateVersion` forman un catálogo independiente. Una versión publicada es inmutable para que las invitaciones existentes no cambien cuando evoluciona una plantilla.

### Agregado Account

`Account` representa al propietario del contenido. Define propiedad y auditoría, pero no implica implementar autenticación en esta etapa.

### Agregado MediaAsset

`MediaAsset` representa metadatos de un archivo almacenado fuera de la base de datos. Puede ser reutilizable, pero su acceso siempre se autoriza mediante el propietario y la invitación que lo referencia.

## 3. Entidades y campos

Convenciones comunes:

- Todos los IDs internos son UUID y nunca se exponen públicamente.
- Los instantes son `Instant` en UTC.
- Los textos se almacenan en Unicode.
- Los límites indicados son iniciales y deben confirmarse con UX y seguridad antes de implementar.
- `createdBy` y `updatedBy` referencian `Account`; en operaciones anónimas permitidas pueden ser nulos y complementarse con el actor técnico.

### 3.1 Account

Propósito: propietario de invitaciones, plantillas privadas y archivos. La identidad de acceso se diseñará en la futura tarea de autenticación.

| Campo | Tipo | Req. | Restricciones / valor inicial |
|---|---|---:|---|
| id | UUID | sí | Interno, inmutable |
| publicCode | String | sí | Único, opaco, `ACC-` + 12 caracteres aleatorios |
| displayName | String | sí | 1–100 caracteres |
| emailNormalized | String | sí | Único, formato válido, no se usa como código público |
| status | AccountStatus | sí | `ACTIVE` inicialmente |
| locale | String | sí | BCP 47; `es-CL` inicialmente |
| zoneId | String | sí | IANA; necesaria para fechas locales |
| createdAt / updatedAt | Instant | sí | Auditoría automática |
| deletedAt | Instant | no | Borrado lógico |

Relaciones: uno a muchos con `Invitation`, `MediaAsset` y plantillas creadas por usuarios.

Eliminación: lógica. La solicitud de borrado debe iniciar anonimización o retención controlada, no romper invitaciones ni respuestas históricas de inmediato.

### 3.2 Invitation

Propósito: raíz del contenido compartible y de su ciclo de vida.

| Campo | Tipo | Req. | Restricciones / valor inicial |
|---|---|---:|---|
| id | UUID | sí | Interno, inmutable |
| publicCode | String | sí | Único, opaco, `INV-` + 12 caracteres aleatorios |
| ownerId | UUID | sí | Una única `Account` |
| title | String | sí | 1–120 caracteres |
| honoreeName | String | sí | 1–100 caracteres; dato visible según publicación |
| status | InvitationStatus | sí | `DRAFT` inicialmente |
| visibility | Visibility | sí | `PRIVATE` inicialmente |
| rsvpMode | RsvpMode | sí | `DISABLED` inicialmente |
| templateVersionId | UUID | no | Requerido al publicar si no existe diseño propio válido |
| publishedAt | Instant | no | Solo cuando está publicada |
| archivedAt | Instant | no | Solo cuando está archivada |
| expiresAt | Instant | no | Cierre opcional del acceso público |
| version | Long | sí | Bloqueo optimista, inicia en 0 |
| createdAt / updatedAt | Instant | sí | Auditoría automática |
| createdBy / updatedBy | UUID | sí | Cuenta responsable |
| deletedAt / deletedBy | Instant / UUID | no | Borrado lógico |

Relaciones: muchos a uno con `Account` y `TemplateVersion`; uno a uno con `EventDetails` e `InvitationAppearance`; uno a muchos con invitados, medios y enlaces públicos.

Eliminación: lógica, con eliminación física posterior mediante una política de retención. Publicaciones, RSVP y enlaces se deshabilitan inmediatamente al borrar.

### 3.3 EventDetails

Propósito: datos temporales y logísticos del evento, separados del ciclo editorial de la invitación.

| Campo | Tipo | Req. | Restricciones / valor inicial |
|---|---|---:|---|
| id | UUID | sí | Interno |
| invitationId | UUID | sí | Único; misma vida que `Invitation` |
| startsAt | Instant | sí | Debe ser anterior a `endsAt` si existe |
| endsAt | Instant | no | Posterior a `startsAt` |
| zoneId | String | sí | Zona IANA usada para mostrar la hora |
| venueName | String | no | Máximo 150 caracteres |
| addressLine | String | no | Máximo 250 caracteres |
| locality / region / countryCode | String | no | País ISO 3166-1 alpha-2 cuando exista |
| latitude / longitude | Decimal | no | Deben existir juntos y estar en rangos válidos |
| mapsProviderPlaceId | String | no | Identificador externo opaco |
| additionalDirections | String | no | Máximo 500 caracteres |
| createdAt / updatedAt | Instant | sí | Auditoría automática |
| createdBy / updatedBy | UUID | sí | Cuenta responsable |

Relación: uno a uno con `Invitation`, porque una invitación describe un evento principal y no tiene sentido sin ella.

Eliminación: física únicamente al purgar la invitación; durante el borrado lógico queda inaccesible con su raíz.

### 3.4 InvitationAppearance

Propósito: personalización visual y de comportamiento sin mezclar datos del evento.

| Campo | Tipo | Req. | Restricciones / valor inicial |
|---|---|---:|---|
| id | UUID | sí | Interno |
| invitationId | UUID | sí | Único |
| primaryColor / secondaryColor / backgroundColor / textColor | String | no | Color normalizado; contraste accesible |
| fontKey | String | no | Valor de catálogo permitido |
| heroEmoji | String | no | Un grapheme emoji permitido |
| musicAssetId | UUID | no | `MediaAsset` de audio autorizado |
| musicAutoplay | Boolean | sí | `false`; sujeto a restricciones del navegador |
| countdownEnabled | Boolean | sí | `false` |
| customContent | JSON document | no | Esquema versionado y tamaño limitado, nunca HTML arbitrario |
| schemaVersion | Integer | sí | `1` inicialmente |
| createdAt / updatedAt | Instant | sí | Auditoría automática |
| createdBy / updatedBy | UUID | sí | Cuenta responsable |

Relación: uno a uno con `Invitation`. Referencia opcional muchos a uno con `MediaAsset` para música.

Eliminación: física al purgar la invitación; queda inaccesible durante borrado lógico.

### 3.5 Template y TemplateVersion

Propósito: catálogo y versiones inmutables de diseños.

`Template`:

| Campo | Tipo | Req. | Restricciones / valor inicial |
|---|---|---:|---|
| id | UUID | sí | Interno |
| publicCode | String | sí | Único, `TPL-` + 12 caracteres aleatorios |
| name | String | sí | 1–100 caracteres |
| ownerId | UUID | no | Nulo para catálogo del sistema |
| visibility | TemplateVisibility | sí | `PRIVATE` para plantillas de usuario |
| status | TemplateStatus | sí | `DRAFT` inicialmente |
| createdAt / updatedAt | Instant | sí | Auditoría |
| createdBy / updatedBy | UUID | no | Nulo solo para migraciones técnicas controladas |
| deletedAt | Instant | no | Borrado lógico |

`TemplateVersion`:

| Campo | Tipo | Req. | Restricciones / valor inicial |
|---|---|---:|---|
| id | UUID | sí | Interno |
| templateId | UUID | sí | Plantilla propietaria |
| versionNumber | Integer | sí | Positivo y único por plantilla |
| schemaVersion | Integer | sí | Versión del formato |
| designDefinition | JSON document | sí | Validado contra esquema, tamaño limitado |
| previewAssetId | UUID | no | Imagen autorizada |
| publishedAt | Instant | no | Hace inmutable la versión |
| createdAt / createdBy | Instant / UUID | sí | Auditoría; no se actualiza tras publicar |

Relaciones: `Template` tiene muchas versiones; muchas invitaciones pueden basarse en una `TemplateVersion`. La invitación conserva sus personalizaciones y la referencia a una versión exacta.

Eliminación: `Template` usa borrado lógico. Una versión referenciada o publicada no se elimina ni modifica; solo puede retirarse del catálogo.

### 3.6 MediaAsset

Propósito: metadatos y ciclo de vida de imágenes o audio; el binario vive en almacenamiento de objetos.

| Campo | Tipo | Req. | Restricciones / valor inicial |
|---|---|---:|---|
| id | UUID | sí | Interno |
| publicCode | String | sí | Único, `MED-` + 12 caracteres aleatorios |
| ownerId | UUID | sí | Cuenta propietaria |
| kind | MediaKind | sí | `IMAGE` o `AUDIO` inicialmente |
| status | MediaStatus | sí | `PENDING_UPLOAD` inicialmente |
| storageKey | String | no | Único, interno; nunca URL pública permanente |
| originalFilename | String | no | Sanitizado; no se usa como ruta |
| contentType | String | sí | Lista permitida |
| sizeBytes | Long | sí | Positivo y bajo límite por tipo |
| checksum | String | no | Hash para integridad y deduplicación controlada |
| width / height | Integer | no | Obligatorios para imágenes procesadas |
| durationMillis | Long | no | Obligatorio para audio procesado |
| createdAt / updatedAt | Instant | sí | Auditoría |
| createdBy / updatedBy | UUID | sí | Cuenta responsable |
| deletedAt | Instant | no | Borrado lógico y limpieza diferida del objeto |

Relaciones: muchos a uno con `Account`; muchos a muchos conceptualmente con invitaciones mediante `InvitationMedia`.

Eliminación: lógica mientras tenga referencias; purga física del objeto solo cuando no existan referencias y termine la retención.

### 3.7 InvitationMedia

Propósito: asociación ordenada entre una invitación y sus medios, especialmente la galería.

| Campo | Tipo | Req. | Restricciones / valor inicial |
|---|---|---:|---|
| id | UUID | sí | Interno |
| invitationId / mediaAssetId | UUID | sí | Par único |
| role | MediaRole | sí | `GALLERY`, `HERO` o `BACKGROUND` |
| position | Integer | sí | No negativo; único por invitación y rol cuando aplique |
| altText | String | no | Requerido para imágenes informativas al publicar |
| caption | String | no | Máximo 250 caracteres |
| createdAt / createdBy | Instant / UUID | sí | Auditoría |

Relaciones: muchos a uno tanto con `Invitation` como con `MediaAsset`. Es una entidad de asociación porque posee orden, rol y texto accesible.

Eliminación: física al quitar la asociación; no elimina automáticamente el archivo.

### 3.8 Guest

Propósito: persona o grupo invitado, con datos mínimos y control de acceso opcional.

| Campo | Tipo | Req. | Restricciones / valor inicial |
|---|---|---:|---|
| id | UUID | sí | Interno |
| publicCode | String | sí | Único, `GST-` + 12 caracteres aleatorios |
| invitationId | UUID | sí | Invitación propietaria |
| displayName | String | sí | 1–120 caracteres |
| contactPhone | String | no | E.164; cifrado o protegido según riesgo |
| contactEmail | String | no | Normalizado; cifrado o protegido según riesgo |
| partySizeLimit | Integer | sí | `1`, entre 1 y límite configurable |
| accessTokenHash | String | no | Solo hash; para enlace privado individual |
| status | GuestStatus | sí | `INVITED` inicialmente |
| createdAt / updatedAt | Instant | sí | Auditoría |
| createdBy / updatedBy | UUID | sí | Cuenta responsable |
| deletedAt | Instant | no | Borrado lógico |

Relaciones: muchos a uno con `Invitation`; uno a muchos con `RsvpResponse` para conservar historial de cambios.

Eliminación: lógica por tratar datos personales y mantener coherencia con respuestas; posterior anonimización/purga según política.

### 3.9 RsvpResponse

Propósito: registro inmutable de una decisión de asistencia. La respuesta vigente es la última válida del invitado.

| Campo | Tipo | Req. | Restricciones / valor inicial |
|---|---|---:|---|
| id | UUID | sí | Interno |
| publicCode | String | sí | Único, `RSV-` + 12 caracteres aleatorios |
| invitationId / guestId | UUID | sí | El invitado debe pertenecer a la invitación |
| response | RsvpStatus | sí | `ATTENDING`, `NOT_ATTENDING` o `MAYBE` |
| attendeeCount | Integer | sí | 0 si no asiste; no supera `partySizeLimit` |
| guestMessage | String | no | Máximo 500 caracteres, texto plano |
| respondedAt | Instant | sí | Hora del servidor |
| supersedesId | UUID | no | Respuesta anterior del mismo invitado |
| source | RsvpSource | sí | `PUBLIC_LINK`, `OWNER` o `IMPORT` |
| createdAt | Instant | sí | Auditoría inmutable |
| createdBy | UUID | no | Nulo en respuesta anónima mediante token válido |

Relaciones: muchos a uno con `Invitation` y `Guest`; referencia opcional uno a uno a la respuesta reemplazada.

Eliminación: no se modifica ni elimina individualmente durante la vida de la invitación. Se anonimiza o purga junto con la invitación según retención y obligaciones de privacidad.

### 3.10 PublicAccessLink

Propósito: publicar, revocar y rotar accesos sin exponer IDs ni acoplar el enlace al código estable de la invitación.

| Campo | Tipo | Req. | Restricciones / valor inicial |
|---|---|---:|---|
| id | UUID | sí | Interno |
| invitationId | UUID | sí | Invitación propietaria |
| publicCode | String | sí | Token aleatorio URL-safe, alta entropía y único |
| accessMode | AccessMode | sí | `PUBLIC` o `TOKEN_PROTECTED` |
| status | AccessLinkStatus | sí | `ACTIVE` inicialmente |
| validFrom / expiresAt | Instant | no | Intervalo coherente |
| revokedAt / revokedBy | Instant / UUID | no | Auditoría de revocación |
| createdAt / createdBy | Instant / UUID | sí | Auditoría |

Relación: muchos a uno con `Invitation`; admite rotación e historial de enlaces. Los enlaces individuales de invitados se resuelven con un token distinto almacenado solo como hash en `Guest`.

Eliminación: no se elimina mientras su invitación esté retenida; se revoca y luego se purga con ella.

## 4. Relaciones resumidas

| Origen | Cardinalidad | Destino | Justificación |
|---|---|---|---|
| Account | 1:N | Invitation | Una cuenta gestiona varios eventos; cada invitación tiene un solo propietario |
| Invitation | 1:1 | EventDetails | Un evento principal por invitación y ciclo de vida compartido |
| Invitation | 1:1 | InvitationAppearance | Una configuración visual vigente por invitación |
| Template | 1:N | TemplateVersion | Versionado inmutable del diseño |
| TemplateVersion | 1:N | Invitation | Muchas invitaciones reutilizan una versión exacta |
| Invitation | 1:N | InvitationMedia | Galería y roles ordenados |
| MediaAsset | 1:N | InvitationMedia | Un archivo autorizado puede reutilizarse |
| Invitation | 1:N | Guest | Lista privada propia de la invitación |
| Guest | 1:N | RsvpResponse | Historial de cambios de RSVP |
| Invitation | 1:N | PublicAccessLink | Permite rotar y revocar enlaces |

No se propone una relación persistente para WhatsApp o redes sociales: compartir es una acción del cliente. Tampoco para descargas de imagen/PDF: son representaciones derivadas; solo se modelarán como trabajos o artefactos si aparece una necesidad real de procesamiento asíncrono o retención.

## 5. Enumeraciones y estados

- `AccountStatus`: `ACTIVE`, `SUSPENDED`, `DELETION_PENDING`, `DELETED`.
- `InvitationStatus`: `DRAFT`, `PUBLISHED`, `ARCHIVED`, `DELETED`.
- `Visibility`: `PRIVATE`, `UNLISTED`, `PUBLIC`. Privada requiere invitado/token; no listada funciona con enlace; pública puede descubrirse en el futuro.
- `RsvpMode`: `DISABLED`, `GUEST_LIST_ONLY`, `ANYONE_WITH_LINK`.
- `TemplateVisibility`: `PRIVATE`, `CATALOG`.
- `TemplateStatus`: `DRAFT`, `PUBLISHED`, `RETIRED`.
- `MediaKind`: `IMAGE`, `AUDIO`.
- `MediaStatus`: `PENDING_UPLOAD`, `PROCESSING`, `READY`, `REJECTED`, `DELETED`.
- `MediaRole`: `HERO`, `BACKGROUND`, `GALLERY`.
- `GuestStatus`: `INVITED`, `RESPONDED`, `REMOVED`.
- `RsvpStatus`: `ATTENDING`, `NOT_ATTENDING`, `MAYBE`.
- `RsvpSource`: `PUBLIC_LINK`, `OWNER`, `IMPORT`.
- `AccessMode`: `PUBLIC`, `TOKEN_PROTECTED`.
- `AccessLinkStatus`: `ACTIVE`, `REVOKED`, `EXPIRED`.

Transiciones esenciales de invitación:

- `DRAFT -> PUBLISHED` después de validar datos, diseño y acceso.
- `PUBLISHED -> DRAFT` solo mediante una operación explícita que despublique y revoque acceso, o preferiblemente `PUBLISHED -> ARCHIVED` y creación de nueva revisión según requisitos futuros.
- `PUBLISHED -> ARCHIVED`; archivar desactiva acceso y RSVP sin borrar datos.
- `DRAFT|PUBLISHED|ARCHIVED -> DELETED` mediante borrado lógico.
- `DELETED` no vuelve a publicarse; una restauración administrativa, si se admite, debe ser explícita y auditada.

## 6. Identificadores públicos

Los prefijos (`INV`, `ACC`, `TPL`, `MED`, `GST`, `RSV`) ayudan a soporte y validación de tipo, pero no conceden acceso. Los códigos se generan con aleatoriedad criptográfica, no son secuenciales y tienen índice único. La longitud concreta debe aportar al menos 72 bits de entropía.

El `publicCode` estable identifica un recurso en APIs autorizadas. Un `PublicAccessLink.publicCode` es una credencial revocable y debe tener mayor entropía. Los tokens privados de invitado nunca se almacenan en claro. Ningún ID UUID interno aparece en URLs públicas.

## 7. Auditoría

- Auditoría completa (`createdAt`, `updatedAt`, `createdBy`, `updatedBy`): `Invitation`, `EventDetails`, `InvitationAppearance`, `Template`, `MediaAsset`, `Guest`.
- Auditoría de creación inmutable: `TemplateVersion`, `InvitationMedia`, `RsvpResponse`, `PublicAccessLink`.
- Eventos sensibles adicionales: publicación, archivo, borrado, revocación de enlace y anonimización deberían emitir eventos de auditoría append-only en una futura capacidad transversal.
- Los valores previos importantes no deben depender solo de columnas `updatedAt`; RSVP y versiones de plantilla ya conservan historial explícito.

## 8. Reglas de negocio propuestas

1. Toda invitación pertenece exactamente a una cuenta activa y solo esa cuenta o un colaborador futuro autorizado puede modificarla.
2. `title`, `honoreeName`, `startsAt` y `zoneId` son obligatorios para publicar.
3. Al crear un evento, `startsAt` no puede estar en el pasado según su zona; editar eventos ya iniciados requerirá una regla separada.
4. `endsAt`, si existe, debe ser posterior a `startsAt`.
5. Publicar exige apariencia válida, contraste suficiente, plantilla publicada o diseño propio válido y al menos un enlace activo compatible con la visibilidad.
6. Una invitación borrada o archivada no acepta nuevas respuestas RSVP.
7. RSVP solo se acepta dentro de la ventana configurada, con enlace/token válido y según `rsvpMode`.
8. Un invitado pertenece a una sola invitación; una respuesta no puede cruzar invitaciones.
9. `attendeeCount` debe concordar con la respuesta y no superar `partySizeLimit`.
10. Solo la última respuesta no anulada de un invitado cuenta en los totales; el historial permanece inmutable.
11. Los teléfonos y correos de invitados nunca se muestran públicamente ni se incluyen en contenido descargable.
12. Un medio debe estar `READY`, pertenecer al propietario o estar autorizado y tener tipo compatible antes de publicarse.
13. Debe existir como máximo un medio `HERO` y uno `BACKGROUND` activos por invitación; la posición de galería es única.
14. Una `TemplateVersion` publicada no se modifica. Los cambios generan otra versión.
15. Cambiar una plantilla no sobrescribe automáticamente personalizaciones compatibles; una migración de esquema debe ser explícita.
16. Expirar o revocar un enlace impide acceso inmediatamente sin cambiar el `publicCode` estable de la invitación.
17. La cuenta regresiva usa `startsAt` y `zoneId`; no duplica una fecha en apariencia.
18. Las coordenadas se guardan como par o no se guardan; Google Maps es un adaptador, no el dueño de la ubicación.

## 9. Riesgos y mitigaciones

- **Privacidad infantil y de invitados:** aplicar minimización, cifrado de datos sensibles, autorización por objeto, retención corta y herramientas de anonimización.
- **Enumeración de enlaces:** tokens de alta entropía, rate limiting, revocación y ausencia de IDs secuenciales.
- **Cambios de plantilla que rompen publicaciones:** versiones inmutables y documentos con `schemaVersion`.
- **JSON sin control:** validar con esquema, limitar tamaño y nunca aceptar HTML/script arbitrario.
- **Archivos maliciosos o costosos:** validar MIME real, tamaño y duración; analizar, transformar y servir desde dominio aislado con URLs firmadas.
- **Fechas ambiguas:** almacenar `Instant` más `zoneId`, nunca solo hora local; definir comportamiento ante cambios de horario.
- **Concurrencia de edición y RSVP:** bloqueo optimista en el agregado y respuestas append-only con idempotencia futura.
- **Duplicación de datos:** ubicación, fecha y cuenta regresiva tienen una única fuente; asociaciones guardan solo metadatos propios.
- **Crecimiento del agregado:** cargar colecciones de invitados, respuestas y medios de forma paginada; no mapear todo con carga ansiosa.
- **Borrado en cascada peligroso:** separar borrado lógico de purga, comprobar referencias y ejecutar purgas con trabajos auditados.
- **Dependencia de proveedores:** almacenar coordenadas y dirección propias; mantener IDs de mapas y claves de almacenamiento como detalles de integración.

## 10. Recomendaciones de implementación futura

1. Implementar primero `Account`, `Invitation` y `EventDetails` con límites claros; añadir capacidades opcionales por tareas separadas.
2. Usar migraciones aditivas y restricciones de base de datos para unicidad, cardinalidad y rangos que puedan expresarse allí.
3. Tratar `Invitation` como agregado, pero evitar cascadas JPA amplias y colecciones `EAGER`.
4. Modelar colores, zona horaria, códigos públicos y coordenadas como value objects cuando se escriba Java.
5. Generar códigos públicos en el dominio con un generador inyectable y resolver colisiones mediante restricción única.
6. Definir autorización a nivel de recurso antes de exponer cualquier endpoint; conocer un código estable no autoriza acceso.
7. Introducir outbox/eventos de dominio solo cuando existan procesos reales como procesamiento multimedia, notificaciones o exportaciones.
8. Crear pruebas de transiciones de estado, privacidad, pertenencia cruzada, zonas horarias y concurrencia antes de persistencia/API.
9. Documentar retención, consentimiento y base legal antes de almacenar datos personales de menores o invitados.
10. No crear entidades para acciones derivables (compartir, cuenta regresiva, descarga) hasta que requieran estado propio.

## 11. Validación del diseño

- **Coherencia:** cada dato tiene un propietario claro y las reglas cruzadas pasan por `Invitation`.
- **Extensibilidad:** plantillas versionadas, asociaciones de medios con rol y enlaces rotables admiten las capacidades futuras sin alterar IDs internos.
- **Sin duplicidad:** evento centraliza fecha/ubicación; apariencia referencia esa fecha para cuenta regresiva; los medios se referencian, no se copian.
- **Independencia:** el núcleo `Account + Invitation + EventDetails` funciona sin galería, música, RSVP, mapas, exportaciones ni redes sociales.
- **Alcance:** este documento no crea entidades JPA, migraciones, repositorios, servicios, controladores, DTOs, endpoints, autenticación ni frontend.
