# Tarea 15 -- Migración del Almacenamiento Local de Imágenes a Cloudinary

## Objetivo

La aplicación ya permite subir y mostrar imágenes, pero actualmente los
archivos se guardan en una carpeta local del backend.

El objetivo es reemplazar el almacenamiento local por Cloudinary,
manteniendo el funcionamiento actual de la aplicación y sin romper los
flujos existentes.

## Revisión previa obligatoria

Antes de modificar código, revisar:

-   Endpoint de subida de imágenes.
-   Servicio que guarda archivos.
-   Carpeta local utilizada.
-   Forma en que se genera la URL.
-   Entidad o tabla donde se almacena la ruta.
-   Eliminación y reemplazo de imágenes.
-   Flujo del frontend.
-   Vista previa.
-   Invitación publicada.

No crear un flujo paralelo. Adaptar la arquitectura existente.

------------------------------------------------------------------------

## Variables de entorno

``` env
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
CLOUDINARY_UPLOAD_PRESET=invitations_upload
```

Nunca exponer `CLOUDINARY_API_SECRET` en el frontend.

------------------------------------------------------------------------

## Arquitectura

Reemplazar:

``` text
Frontend
    ↓
Backend
    ↓
Carpeta local
    ↓
Base de datos
```

Por:

``` text
Frontend
    ↓
Backend
    ↓
Cloudinary
    ↓
Base de datos (secure_url + public_id)
```

------------------------------------------------------------------------

## Servicio de almacenamiento

Crear una abstracción:

``` java
public interface ImageStorageService {
    StoredImage upload(MultipartFile file, ImageUploadContext context);
    void delete(String publicId);
}
```

Implementación:

-   `CloudinaryImageStorageService`

No acoplar el resto del sistema directamente al SDK de Cloudinary.

------------------------------------------------------------------------

## Organización de imágenes

Guardar utilizando una estructura como:

``` text
app/invitations/{invitationId}/cover
app/invitations/{invitationId}/gallery
app/invitations/{invitationId}/decorations
```

Nunca utilizar nombres de usuario o correos como identificadores.

------------------------------------------------------------------------

## Base de datos

Guardar como mínimo:

-   image_url
-   image_public_id
-   image_format
-   image_width
-   image_height
-   image_bytes

`image_public_id` será obligatorio para eliminar o reemplazar imágenes.

------------------------------------------------------------------------

## Compatibilidad

Las imágenes antiguas deben seguir funcionando.

El sistema debe soportar:

-   URLs de Cloudinary.
-   Rutas locales existentes.

Las nuevas imágenes deben almacenarse únicamente en Cloudinary.

------------------------------------------------------------------------

## Reemplazo de imágenes

Al reemplazar una imagen:

1.  Subir la nueva imagen.
2.  Confirmar respuesta correcta.
3.  Actualizar la base de datos.
4.  Eliminar la imagen anterior utilizando su `public_id`.

Nunca eliminar primero la imagen antigua.

------------------------------------------------------------------------

## Eliminación

Cuando se elimine una imagen:

-   Eliminar en Cloudinary.
-   Actualizar la base de datos.
-   Actualizar la interfaz.

Cuando se elimine una invitación:

-   Eliminar todas las imágenes asociadas.
-   Evitar archivos huérfanos.

------------------------------------------------------------------------

## Validaciones

Mantener y reforzar:

-   JPG
-   JPEG
-   PNG
-   WEBP

Máximo:

-   5 MB por imagen.
-   1 portada.
-   10 imágenes de galería.

Validar siempre también en el backend.

------------------------------------------------------------------------

## Frontend

Mantener el flujo actual.

Agregar:

-   Vista previa.
-   Estado de carga.
-   Mensajes de error.
-   Uso de `secure_url`.
-   No depender de rutas `/uploads`.

------------------------------------------------------------------------

## Optimización

Utilizar transformaciones de Cloudinary:

-   `f_auto`
-   `q_auto`

Ejemplos:

Portada:

``` text
w_1200,h_800,c_fill,f_auto,q_auto
```

Miniatura:

``` text
w_400,h_300,c_fill,f_auto,q_auto
```

------------------------------------------------------------------------

## Limpieza

No eliminar inmediatamente el almacenamiento local.

Primero validar:

-   Nuevas cargas.
-   Reemplazos.
-   Eliminaciones.
-   Compatibilidad con imágenes existentes.

Después marcar el almacenamiento local como legado.

------------------------------------------------------------------------

## Criterios de aceptación

-   Nuevas imágenes almacenadas en Cloudinary.
-   Base de datos guarda `secure_url` y `public_id`.
-   Las imágenes antiguas siguen funcionando.
-   Reemplazo seguro de imágenes.
-   Eliminación correcta en Cloudinary.
-   Variables de entorno protegidas.
-   Sin credenciales en el frontend.
-   TypeScript, backend, pruebas y build sin errores.
