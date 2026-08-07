# Tarea 26 — Reparar y completar la edición de invitaciones + editor profesional de fondos

## Objetivo

Reparar y dejar completamente funcional la edición de una invitación existente para un usuario autenticado, incluyendo edición de datos, reemplazo/eliminación de imágenes y un editor visual profesional para los fondos de las secciones.

La prioridad es **recuperar primero el flujo estable de edición completa** y después implementar el editor visual de fondos sin romper creación, publicación, invitados, subida de imágenes ni la vista pública.

---

## Contexto del proyecto

Stack actual:

- Backend: Java 21, Spring Boot, JPA, Flyway, Security.
- Frontend: React, TypeScript, Vite, pnpm.
- Las invitaciones se crean, publican y comparten mediante URL.
- El usuario autenticado dispone de `/my-invitations`.
- La edición debe reutilizar el wizard existente, no crear un segundo wizard.
- Las imágenes se suben mediante `/api/invitation-images`.
- El almacenamiento actual usa Cloudinary.
- `sectionBackgrounds` ya se persiste como JSON.
- Existe configuración CORS y `PUT` debe permanecer permitido.

Antes de modificar código, leer completamente:

1. `.agents/AGENTS.md`
2. Las tareas recientes relacionadas con invitaciones, imágenes y edición.
3. Los archivos involucrados indicados en esta tarea.

No implementar funcionalidades fuera de este alcance.

---

# Fase 1 — Auditar y reparar el estado actual

Antes de escribir código:

1. Ejecutar:
   - `git status`
   - `git diff --check`
2. Revisar cambios sin confirmar relacionados con:
   - edición de invitaciones;
   - imágenes;
   - fondos personalizados;
   - `SectionBackground`;
   - `SectionBackgroundEditor`;
   - `InvitationPreview`;
   - `InvitationWizard`;
   - `CreateInvitationPage`;
   - servicios de invitaciones.
3. Identificar qué partes quedaron rotas o incompletas.
4. No eliminar código válido de otras funcionalidades.
5. No hacer `reset --hard`.
6. Reparar con cambios pequeños y verificables.

---

# Fase 2 — Edición completa de invitaciones existentes

## Backend

Confirmar que exista y funcione:

### Obtener invitación propia

```http
GET /api/invitations/{publicSlug}
```

Debe:

- requerir autenticación;
- buscar al usuario autenticado;
- comprobar que la invitación pertenece al usuario;
- devolver todos los datos necesarios para rellenar el wizard;
- incluir `id` real de la invitación;
- devolver 404 si no existe;
- devolver 403 si pertenece a otro usuario.

### Actualizar invitación propia

```http
PUT /api/invitations/{publicSlug}
```

Debe:

- requerir autenticación;
- comprobar propiedad;
- conservar:
  - `id`;
  - `publicSlug`;
  - `ownerId`;
  - `createdAt`;
  - estado actual;
- actualizar `updatedAt`;
- validar plantilla;
- validar fecha;
- persistir cambios sin crear otra invitación;
- mantener la misma URL pública.

No duplicar lógica de propiedad. Reutilizar el mecanismo existente tipo `OwnedInvitationFinder` si ya está implementado.

### CORS

Confirmar que la configuración real permita:

```java
GET
POST
PUT
DELETE
OPTIONS
```

No agregar una segunda configuración CORS si ya existe una.

---

# Fase 3 — Frontend de edición

Ruta:

```text
/my-invitations/:slug/edit
```

En `MyInvitationsPage` debe existir una acción visible:

```text
Editar
```

La edición debe:

1. cargar la invitación con `GET /api/invitations/{slug}`;
2. mostrar estado de carga;
3. manejar 401, 403, 404 y errores de red;
4. transformar correctamente la respuesta a `InvitationDraft`;
5. reutilizar `InvitationWizard`;
6. reutilizar `InvitationPreview`;
7. usar el `invitationId` real de la invitación existente;
8. guardar mediante `PUT`;
9. volver a `/my-invitations` al guardar correctamente;
10. mantener la misma URL pública.

La creación debe continuar funcionando sin regresiones.

---

# Fase 4 — Imágenes en modo edición

Este punto es crítico.

Durante edición, toda imagen nueva debe asociarse al `id` REAL de la invitación que se está editando.

No usar un `draftInvitationId` temporal para imágenes de una invitación existente.

Revisar todas las llamadas a:

```ts
uploadInvitationImage(...)
uploadSocialImage(...)
```

Incluyendo:

- portada;
- galería;
- imagen social;
- imágenes decorativas de fondos de sección.

La firma debe mantener explícitamente el `invitationId`.

Ejemplo conceptual:

```ts
uploadInvitationImage(file, invitationId, 'COVER')
uploadInvitationImage(file, invitationId, 'GALLERY')
uploadInvitationImage(file, invitationId, 'DECORATION')
uploadSocialImage(file, invitationId)
```

No debe existir ninguna llamada antigua donde `'COVER'`, `'GALLERY'` o `'DECORATION'` ocupe accidentalmente el lugar de `invitationId`.

---

# Fase 5 — Quitar y reemplazar imágenes

En modo edición el usuario debe poder:

- quitar portada;
- subir nueva portada;
- quitar imágenes de galería;
- agregar nuevas imágenes;
- sustituir una imagen de fondo;
- quitar una imagen de fondo;
- cambiar la imagen social.

Cuando se elimina una imagen de Cloudinary que ya no será utilizada:

- usar el endpoint existente;
- no eliminar archivos compartidos o imágenes temáticas locales;
- no romper la invitación si la eliminación remota falla;
- mostrar feedback adecuado.

No dejar referencias rotas en el draft.

---

# Fase 6 — Editor profesional de fondos de sección

## Objetivo UX

El usuario debe poder encuadrar una imagen de fondo de forma visual, similar a Canva/Instagram:

- agarrar la imagen;
- arrastrarla horizontal y verticalmente;
- hacer zoom;
- ver el resultado de forma inmediata;
- restablecer el encuadre.

No obligar al usuario a trabajar principalmente con sliders X/Y.

Los controles numéricos pueden existir como apoyo, pero la interacción principal debe ser directa sobre la imagen.

---

## Modelo de datos

Usar un modelo coherente y único.

No mantener simultáneamente múltiples sistemas incompatibles como:

```text
imagePosition
imagePositionX/Y
offsetX/Y
```

Elegir un solo modelo.

Preferencia recomendada para un editor libre:

```ts
imageOffsetX: number
imageOffsetY: number
imageZoom: number
```

Donde:

- `imageOffsetX` = desplazamiento horizontal;
- `imageOffsetY` = desplazamiento vertical;
- `imageZoom` = escala;
- valores por defecto:
  - X = 0;
  - Y = 0;
  - zoom = 1.

Si ya existe otro modelo parcialmente implementado, migrarlo limpiamente y mantener compatibilidad con invitaciones antiguas usando valores por defecto.

`sectionBackgrounds` debe seguir siendo serializable y persistible como JSON.

---

# Fase 7 — Renderizado profesional del fondo

No depender únicamente de `background-position` para la experiencia de edición.

Para fondos personalizados tipo imagen, usar una capa independiente dentro de la sección.

Estructura conceptual:

```html
<section>
  <div class="section-background-media">
    <img />
  </div>

  <div class="section-background-glass"></div>

  <div class="section-background-content">
    ...
  </div>
</section>
```

La imagen debe:

- ocupar el área completa;
- usar `object-fit: cover` por defecto;
- admitir `contain` si se conserva esa opción;
- aplicar movimiento mediante `translate(...)`;
- aplicar zoom mediante `scale(...)`;
- no mover el texto;
- respetar bordes redondeados;
- no desbordar la sección.

Ejemplo conceptual:

```css
transform:
  translate(var(--image-x), var(--image-y))
  scale(var(--image-zoom));
```

No estirar la imagen con `100% 100%`.

---

# Fase 8 — Editor visual tipo Canva

Crear un componente reutilizable, por ejemplo:

```text
ImagePositionEditor.tsx
```

Debe recibir:

```ts
imageUrl
offsetX
offsetY
zoom
onChange
```

o una estructura equivalente.

Debe soportar:

### Mouse

- `pointerdown`;
- `pointermove`;
- `pointerup`;
- `pointercancel`;
- `setPointerCapture`.

### Touch

Usar Pointer Events para que funcione también con dedo.

Aplicar:

```css
touch-action: none;
```

solo dentro del área del editor.

### Arrastre

El movimiento debe sentirse 1:1:

- mover 30 px con el puntero debe desplazar visualmente la imagen aproximadamente 30 px;
- no convertir el movimiento arbitrariamente a porcentajes que hagan que el arrastre se sienta extraño.

### Zoom

Permitir:

- slider de zoom;
- botones `−` / `+`;
- opcionalmente rueda del mouse en escritorio.

Rango sugerido:

```text
1.0 — 3.0
```

El zoom no debe mover ni escalar el texto.

### Reset

Botón:

```text
Restablecer
```

Debe regresar a:

```text
offsetX = 0
offsetY = 0
zoom = 1
```

### Accesibilidad

- botones con `aria-label`;
- controles táctiles >= 44 px cuando aplique;
- respetar `prefers-reduced-motion`;
- no bloquear scroll fuera del editor.

---

# Fase 9 — “Vidrio” entre imagen y texto

Agregar al editor de cada fondo una opción de capa de legibilidad tipo glass.

Debe ser independiente del overlay oscuro existente.

Opciones mínimas:

```text
Vidrio sobre el fondo: Sí / No
Intensidad del desenfoque
Opacidad
Color base
```

Modelo sugerido:

```ts
glassEnabled: boolean
glassBlur: number
glassOpacity: number
glassColor: string
```

Valores por defecto razonables:

```text
glassEnabled = false
glassBlur = 10
glassOpacity = 0.18
glassColor = #ffffff
```

Renderizado conceptual:

```css
background: rgba(...);
backdrop-filter: blur(...);
-webkit-backdrop-filter: blur(...);
```

La capa debe estar:

```text
imagen
↓
overlay opcional
↓
glass opcional
↓
texto/contenido
```

El vidrio no debe desenfocar el texto.

Debe funcionar tanto en preview como en la invitación pública.

---

# Fase 10 — Armonía imagen + texto

La edición de fondo debe permitir encontrar una composición visual usable sin exigir conocimientos de diseño.

Mantener:

- color del texto;
- texto sólido/degradado;
- contorno;
- grosor;
- sombra;
- intensidad de sombra;
- overlay;
- glass.

No ocultar el texto mientras se encuadra la imagen.

Idealmente el editor visual debe mostrar una zona de referencia de contenido para que el usuario evite colocar caras u objetos importantes debajo del texto.

No implementar análisis automático con IA en esta tarea.

---

# Fase 11 — Preview en tiempo real

`InvitationPreview` debe seguir siendo una vista del resultado final.

El editor modifica `InvitationDraft`.

La preview consume `InvitationDraft`.

Evitar que `InvitationPreview` se convierta en dueña del estado de edición.

Flujo deseado:

```text
SectionBackgroundEditor
        ↓
actualiza draft
        ↓
InvitationPreview
        ↓
PublicInvitationRenderer
```

La misma lógica visual debe utilizarse en:

- preview;
- invitación pública.

No crear dos implementaciones distintas del renderizado del fondo.

---

# Fase 12 — Compatibilidad con invitaciones existentes

Las invitaciones ya guardadas pueden no contener los nuevos campos.

Nunca asumir que existen.

Normalizar al cargar:

```text
offsetX -> 0
offsetY -> 0
zoom -> 1
glassEnabled -> false
glassBlur -> valor por defecto
glassOpacity -> valor por defecto
glassColor -> valor por defecto
```

No romper invitaciones antiguas.

---

# Fase 13 — Restricciones

No:

- crear un segundo wizard;
- introducir una librería visual nueva sin necesidad;
- modificar URLs públicas existentes;
- romper RSVP;
- romper invitados;
- romper creación;
- romper eliminación;
- cambiar Cloudinary innecesariamente;
- crear migración SQL si `sectionBackgrounds` sigue siendo JSON;
- introducir Canvas HTML5 si CSS + `<img>` + Pointer Events resuelven la tarea;
- implementar IA de detección facial;
- implementar crop destructivo de imágenes;
- guardar una nueva imagen solo por cambiar su posición.

El encuadre debe guardar metadatos, no crear nuevos archivos en Cloudinary.

---

# Archivos que deben revisarse

Backend, solo si hace falta reparar la edición:

```text
backend/src/main/java/com/invitation/invitation/web/InvitationController.java
backend/src/main/java/com/invitation/invitation/web/UpdateInvitationRequest.java
backend/src/main/java/com/invitation/invitation/application/UpdateInvitationService.java
backend/src/main/java/com/invitation/invitation/application/OwnedInvitationFinder.java
backend/src/main/java/com/invitation/invitation/domain/Invitation.java
backend/src/main/java/com/invitation/activation/infrastructure/ActivationConfig.java
```

Frontend:

```text
frontend/src/App.tsx
frontend/src/modules/invitations/MyInvitationsPage.tsx
frontend/src/modules/invitations/CreateInvitationPage.tsx
frontend/src/modules/invitations/services/invitations.ts
frontend/src/modules/invitations/types/invitation.ts
frontend/src/modules/invitations/types/invitationDraft.ts
frontend/src/modules/invitations/components/InvitationWizard.tsx
frontend/src/modules/invitations/components/InvitationPreview.tsx
frontend/src/modules/invitations/components/PublicInvitationRenderer.tsx
frontend/src/modules/invitations/components/SectionBackground.tsx
frontend/src/modules/invitations/components/SectionBackgroundEditor.tsx
frontend/src/modules/invitations/styles/PublicInvitation.module.css
frontend/src/modules/invitations/styles/InvitationWizard.module.css
```

Si existe un `ImagePositionEditor` roto o experimental, decidir si repararlo o reemplazarlo. No mantener dos implementaciones.

---

# Validación obligatoria

## Backend

```bash
cd backend
./gradlew clean test check bootJar
```

## Frontend

```bash
cd frontend
pnpm install
pnpm exec tsc -b
pnpm lint
pnpm test
pnpm build
```

## Repositorio

```bash
git diff --check
```

No declarar la tarea terminada si alguno falla.

---

# Pruebas manuales obligatorias

Probar como usuario autenticado:

1. Crear una invitación nueva.
2. Abrir `Mis invitaciones`.
3. Entrar a `Editar`.
4. Confirmar que todos los datos existentes aparecen.
5. Cambiar texto.
6. Guardar.
7. Abrir URL pública y verificar el cambio.
8. Volver a editar.
9. Cambiar portada.
10. Quitar portada.
11. Agregar portada nuevamente.
12. Quitar una imagen de galería.
13. Agregar una imagen nueva.
14. Cambiar un fondo de sección.
15. Arrastrar ese fondo horizontalmente.
16. Arrastrarlo verticalmente.
17. Hacer zoom.
18. Restablecer.
19. Activar glass.
20. Cambiar blur/opacidad.
21. Guardar.
22. Recargar la página de edición.
23. Confirmar que encuadre y glass persistieron.
24. Abrir la URL pública.
25. Confirmar que se ve igual que en preview.
26. Editar una invitación antigua que no tenga los nuevos campos.
27. Confirmar que usa defaults y no falla.
28. Confirmar que RSVP e invitados siguen funcionando.

---

# Criterios de aceptación

La tarea está completa únicamente cuando:

- el usuario puede editar una invitación existente completa;
- el wizard se carga con los datos reales;
- `PUT` persiste los cambios;
- la URL pública no cambia;
- las nuevas imágenes usan el `invitationId` real;
- se pueden quitar y reemplazar imágenes;
- los fondos pueden arrastrarse directamente;
- el zoom funciona de forma natural;
- el texto no se mueve al encuadrar;
- existe opción de glass entre imagen y contenido;
- overlay y glass funcionan de forma independiente;
- preview y publicación muestran el mismo resultado;
- los cambios persisten después de recargar;
- invitaciones antiguas siguen funcionando;
- creación sigue funcionando;
- eliminación sigue funcionando;
- RSVP sigue funcionando;
- TypeScript compila;
- tests pasan;
- build pasa;
- backend pasa `test check bootJar`;
- `git diff --check` pasa.

---

# Estrategia para minimizar cambios y costo

1. Primero reparar lo existente.
2. Compilar.
3. Después implementar el modelo de encuadre.
4. Compilar.
5. Después crear el editor visual aislado.
6. Probarlo aislado.
7. Integrarlo en `SectionBackgroundEditor`.
8. Después agregar glass.
9. Finalmente probar persistencia y vista pública.

No hacer una reescritura general del proyecto.

No refactorizar código no relacionado.

Antes de modificar cada archivo, confirmar que realmente es necesario.

Al finalizar entregar un resumen corto con:

- archivos modificados;
- funcionalidades reparadas;
- funcionalidades nuevas;
- pruebas ejecutadas;
- resultado de cada validación;
- cualquier deuda técnica que quede.
