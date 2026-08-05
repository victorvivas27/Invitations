# Tarea: mejorar validaciones, mensajes de feedback y sistema general de modales

La aplicación actualmente no informa correctamente al usuario cuando ocurre un error, falta información o una acción se completa. Se debe implementar un sistema consistente de validaciones y feedback visual en toda la aplicación.

## 1. Validaciones en formularios de login y registro

Revisar los formularios de inicio de sesión y registro.

Cada campo debe mostrar su mensaje de validación directamente debajo del input correspondiente.

Ejemplos:

* “El correo electrónico es obligatorio”.
* “Ingresa un correo electrónico válido”.
* “La contraseña es obligatoria”.
* “La contraseña debe tener al menos 8 caracteres”.
* “Las contraseñas no coinciden”.
* “Este correo electrónico ya está registrado”.

Cuando un campo tenga error:

* Mostrar el borde del input en rojo.
* Mostrar el mensaje debajo del campo.
* Mantener el valor ingresado.
* Eliminar el error cuando el usuario corrija el valor.
* Llevar el foco al primer campo inválido al enviar el formulario.

No utilizar solamente un mensaje general en la parte superior del formulario cuando el error pertenece a un campo específico.

## 2. Validaciones en el wizard de creación de invitaciones

Todos los campos obligatorios deben estar claramente identificados.

Agregar un asterisco visible en la etiqueta:

`Nombre del homenajeado *`

También se puede agregar una pequeña leyenda:

`* Campos obligatorios`

Cuando el usuario presione “Siguiente”, validar todos los campos del paso actual.

Si falta algún campo obligatorio:

* No avanzar al siguiente paso.
* Mostrar el error debajo del campo correspondiente.
* Marcar el input visualmente.
* Llevar el foco al primer campo inválido.
* Desplazar la pantalla hacia ese campo cuando sea necesario.

Ejemplos de validaciones:

* Nombre del evento obligatorio.
* Nombre del homenajeado obligatorio.
* Fecha obligatoria.
* Hora obligatoria.
* Dirección o lugar obligatorio.
* Mensaje obligatorio cuando la plantilla lo requiera.
* Fecha válida y no anterior a la fecha permitida.
* Límites de caracteres para nombres, títulos y mensajes.
* Validación del formato de URL, teléfono o correo cuando corresponda.

La validación debe ejecutarse nuevamente cuando el usuario cambie un dato que afecta otro campo.

## 3. Unificar validaciones entre frontend y backend

Revisar todas las restricciones existentes en el backend y reflejarlas también en el frontend.

Por ejemplo:

* Campos obligatorios.
* Longitud mínima y máxima.
* Formatos permitidos.
* Valores únicos.
* Estados válidos.
* Fechas permitidas.
* Tamaños y tipos de archivos.
* Límites de cantidad.
* Reglas de negocio.

El frontend debe prevenir datos inválidos antes de enviarlos, pero el backend debe seguir siendo la fuente final de validación.

No eliminar ni reemplazar las validaciones del backend.

Cuando el backend devuelva un error, el frontend debe interpretar correctamente la respuesta y mostrarla al usuario.

## 4. Manejo de errores provenientes del backend

Crear un manejador centralizado de errores de API.

Debe poder procesar errores como:

```json
{
  "message": "Validation failed",
  "errors": {
    "email": "Este correo electrónico ya está registrado",
    "password": "La contraseña debe tener al menos 8 caracteres"
  }
}
```

También debe soportar respuestas alternativas como:

```json
{
  "code": "INVITATION_NOT_FOUND",
  "message": "La invitación no existe"
}
```

Comportamiento esperado:

* Los errores asociados a campos deben aparecer debajo del input correspondiente.
* Los errores generales deben mostrarse mediante una notificación o modal de error.
* No mostrar mensajes técnicos, códigos internos, trazas ni respuestas sin procesar.
* Si el servidor no responde, mostrar un mensaje comprensible.
* Si la sesión expiró, informar al usuario y redirigirlo correctamente.
* Si ocurre un error inesperado, mostrar un mensaje general y permitir volver a intentar.

Ejemplos:

* “No pudimos guardar los cambios. Inténtalo nuevamente”.
* “No fue posible conectarse con el servidor”.
* “Tu sesión expiró. Inicia sesión nuevamente”.
* “La invitación no existe o fue eliminada”.

## 5. Reemplazar los alertas nativos del navegador

Eliminar el uso de:

```ts
alert()
confirm()
prompt()
```

No utilizar más los cuadros nativos del navegador, ya que no coinciden con el diseño de la aplicación.

Crear un sistema de modales reutilizable para toda la aplicación.

## 6. Crear un componente general de modal

Crear un componente base reutilizable, por ejemplo:

```tsx
<AppModal />
```

Debe aceptar propiedades como:

```ts
type ModalVariant = "confirm" | "success" | "error" | "warning" | "info";

interface AppModalProps {
  open: boolean;
  variant: ModalVariant;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
  dismissible?: boolean;
  onConfirm?: () => void;
  onCancel?: () => void;
  onClose?: () => void;
}
```

El componente debe servir para:

* Confirmaciones.
* Eliminaciones.
* Acciones exitosas.
* Advertencias.
* Errores.
* Información general.

No crear un modal diferente y duplicado para cada pantalla.

## 7. Diseño y animación del modal

El modal debe tener una apariencia moderna, discreta y consistente con la aplicación.

Animación de apertura:

* Debe entrar suavemente desde la parte superior.
* Puede tener un pequeño rebote al llegar a su posición.
* El rebote debe ser sutil, no exagerado.
* La duración recomendada es entre 250 y 400 milisegundos.
* El fondo debe aparecer con una transición de opacidad.

Animación de cierre:

* Desplazamiento ligero hacia arriba.
* Reducción suave de opacidad.
* Sin movimientos bruscos.

Ejemplo conceptual de animación:

```css
@keyframes modal-enter {
  0% {
    opacity: 0;
    transform: translateY(-40px) scale(0.98);
  }

  70% {
    opacity: 1;
    transform: translateY(6px) scale(1);
  }

  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
```

Respetar la configuración:

```css
@media (prefers-reduced-motion: reduce)
```

Cuando el usuario prefiera movimiento reducido, desactivar el rebote y utilizar solamente una transición corta de opacidad.

## 8. Modal de confirmación y eliminación

Para eliminar una invitación, cuenta, imagen u otro recurso, mostrar un modal personalizado.

Ejemplo:

**Título:**
Eliminar invitación

**Descripción:**
Esta acción eliminará permanentemente la invitación “Cumpleaños de Theo”. Esta acción no se puede deshacer.

**Botones:**

* Cancelar.
* Eliminar.

El botón destructivo debe:

* Tener estilo visual de peligro.
* Mostrar estado de carga mientras se ejecuta la operación.
* Deshabilitarse para evitar envíos duplicados.
* No cerrar el modal hasta conocer el resultado de la operación.

Si la eliminación es exitosa:

* Cerrar el modal de confirmación.
* Actualizar inmediatamente la interfaz.
* Mostrar feedback de éxito.

Si falla:

* Mantener el recurso visible.
* Mostrar el error recibido desde el backend.
* Permitir intentar nuevamente.

## 9. Modal de éxito

Crear una variante de éxito para operaciones importantes.

Ejemplos:

* Invitación creada.
* Invitación publicada.
* Cambios guardados.
* Cuenta registrada.
* Imagen eliminada.
* Contraseña actualizada.

Ejemplo:

**Título:**
Invitación creada correctamente

**Descripción:**
Tu invitación fue guardada y ya puedes continuar con la publicación.

**Botón:**
Continuar

Para acciones pequeñas y frecuentes, como guardar automáticamente un campo, utilizar una notificación breve en lugar de abrir un modal que interrumpa al usuario.

## 10. Modal de error

Crear una variante de error para fallos importantes que requieren la atención del usuario.

Ejemplo:

**Título:**
No pudimos guardar la invitación

**Descripción:**
Ocurrió un problema al guardar los datos. Revisa tu conexión e inténtalo nuevamente.

**Botones:**

* Cerrar.
* Reintentar.

Cuando el backend proporcione un mensaje seguro y comprensible, utilizarlo. Si el mensaje es técnico, transformarlo en un mensaje apropiado para el usuario.

## 11. Sistema de notificaciones breves

Además de los modales, crear un sistema de notificaciones tipo toast para acciones que no requieren bloquear la pantalla.

Ejemplos:

* “Cambios guardados”.
* “Enlace copiado”.
* “Imagen subida correctamente”.
* “No se pudo copiar el enlace”.
* “La conexión fue restablecida”.

Las notificaciones deben:

* Desaparecer automáticamente.
* Permitir cierre manual.
* No cubrir botones importantes.
* Ser accesibles para lectores de pantalla.
* Diferenciar éxito, error, advertencia e información.

No utilizar un modal para cada acción pequeña.

## 12. Accesibilidad de los modales

El sistema de modales debe cumplir como mínimo con lo siguiente:

* Usar `role="dialog"`.
* Usar `aria-modal="true"`.
* Asociar el título mediante `aria-labelledby`.
* Asociar la descripción mediante `aria-describedby`.
* Mover el foco al modal cuando se abre.
* Mantener el foco dentro del modal.
* Restaurar el foco al elemento que abrió el modal cuando se cierre.
* Permitir cerrar con `Escape` cuando la acción lo permita.
* Bloquear el scroll del fondo.
* No permitir interacción con el contenido detrás del modal.
* Permitir navegación completa mediante teclado.

Las confirmaciones destructivas importantes no deben cerrarse accidentalmente al hacer clic fuera del modal.

## 13. Estado de carga en formularios y acciones

Todos los botones que ejecutan solicitudes deben mostrar claramente que la acción está en progreso.

Ejemplos:

* “Iniciando sesión…”
* “Creando cuenta…”
* “Guardando…”
* “Eliminando…”
* “Publicando…”

Mientras una solicitud esté activa:

* Deshabilitar el botón principal.
* Evitar envíos duplicados.
* Mantener el contenido del formulario.
* Mostrar un indicador de carga discreto.
* No dejar la interfaz sin respuesta visual.

## 14. Evitar pérdida de información

Cuando una operación falle:

* No limpiar los campos.
* No reiniciar el wizard.
* No perder imágenes ya seleccionadas cuando sea técnicamente posible.
* No cambiar de página automáticamente.
* Mantener al usuario en el paso donde ocurrió el error.

Si existe información sin guardar y el usuario intenta salir, mostrar una confirmación personalizada antes de abandonar la pantalla.

## 15. Arquitectura recomendada

Centralizar estos elementos para evitar lógica duplicada:

```text
components/
  feedback/
    AppModal.tsx
    ConfirmModal.tsx
    ToastProvider.tsx
    ToastViewport.tsx
    FieldError.tsx
    FormAlert.tsx

hooks/
  useModal.ts
  useToast.ts
  useApiError.ts

utils/
  apiErrorMapper.ts
  validationMessages.ts
```

También se puede utilizar un contexto global o provider para abrir confirmaciones desde cualquier pantalla.

Ejemplo de uso esperado:

```ts
const confirmed = await confirm({
  title: "Eliminar invitación",
  description: "Esta acción no se puede deshacer.",
  confirmLabel: "Eliminar",
  cancelLabel: "Cancelar",
  variant: "danger",
});
```

## 16. Criterios de aceptación

La tarea se considera terminada cuando:

1. Ningún flujo principal utiliza `alert`, `confirm` o `prompt`.
2. Login y registro muestran errores debajo de cada campo.
3. El wizard no permite avanzar cuando faltan datos obligatorios.
4. Los campos requeridos están claramente identificados.
5. El foco se mueve al primer campo con error.
6. Las validaciones del backend se reflejan correctamente en el frontend.
7. Los mensajes del backend se muestran de forma comprensible.
8. Existe un modal general reutilizable.
9. Existe una variante de confirmación, éxito, error y advertencia.
10. El modal de eliminación utiliza el nuevo componente.
11. El modal entra desde arriba con un rebote sutil.
12. Los botones muestran estados de carga.
13. No se permiten solicitudes duplicadas.
14. Los errores no eliminan la información ingresada.
15. Los modales funcionan correctamente con teclado.
16. El foco se restaura después de cerrar el modal.
17. El diseño funciona correctamente en móvil y escritorio.
18. TypeScript, lint, pruebas y build terminan sin errores.

Antes de finalizar, revisar todos los formularios y acciones importantes de la aplicación para aplicar el mismo patrón visual y funcional. El objetivo es que el usuario siempre entienda qué ocurrió, qué campo debe corregir y cuál será el resultado de cada acción.

