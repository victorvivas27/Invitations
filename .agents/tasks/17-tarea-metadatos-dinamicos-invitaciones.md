# Tarea: Metadatos dinámicos para compartir invitaciones

## Objetivo

Implementar metadatos dinámicos para las invitaciones públicas, de manera que al compartir una URL en WhatsApp, Facebook, Telegram, LinkedIn u otras plataformas aparezcan:

- Imagen personalizada.
- Título personalizado.
- Descripción personalizada.
- URL pública de la invitación.

Ejemplo de URL:

```text
https://invitations-inky-seven.vercel.app/i/cumple-de-theo-b4i1mfkq
```

Actualmente el frontend está desarrollado con React + Vite y desplegado en Vercel.

No utilizar únicamente `react-helmet`, manipulación del `<head>` desde React ni JavaScript ejecutado en el navegador, porque los rastreadores sociales necesitan recibir los metadatos directamente en el HTML inicial.

---

## Arquitectura actual

```text
Frontend:
React + Vite
Vercel

Backend:
Spring Boot
Cloud Run

Base de datos:
PostgreSQL / Neon
```

La invitación pública se obtiene mediante un `slug`.

Ejemplo:

```text
cumple-de-theo-b4i1mfkq
```

---

## Resultado esperado

Cuando un rastreador solicite:

```text
GET /i/:slug
```

debe recibir HTML generado dinámicamente con etiquetas similares a:

```html
<title>Cumpleaños de Theo</title>

<meta
  name="description"
  content="Te invitamos a compartir un día lleno de alegría y diversión."
/>

<meta property="og:type" content="website" />
<meta property="og:title" content="Cumpleaños de Theo" />
<meta
  property="og:description"
  content="Te invitamos a compartir un día lleno de alegría y diversión."
/>
<meta
  property="og:image"
  content="https://dominio-publico.com/imagenes/theo.jpg"
/>
<meta
  property="og:url"
  content="https://invitations-inky-seven.vercel.app/i/cumple-de-theo-b4i1mfkq"
/>
<meta property="og:site_name" content="Mi Invitación" />

<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="Cumpleaños de Theo" />
<meta
  name="twitter:description"
  content="Te invitamos a compartir un día lleno de alegría y diversión."
/>
<meta
  name="twitter:image"
  content="https://dominio-publico.com/imagenes/theo.jpg"
/>
```

Los metadatos deben estar presentes en el HTML entregado por el servidor.

---

## Estrategia recomendada

Mantener React + Vite y agregar una Vercel Function encargada de generar el HTML dinámico para las invitaciones públicas.

No migrar todo el frontend a Next.js en esta tarea.

La solución debe conservar la URL pública actual:

```text
/i/:slug
```

---

## Datos de metadatos

Cada invitación debe tener los siguientes campos:

```text
shareTitle
shareDescription
shareImageUrl
```

Ejemplo:

```json
{
  "slug": "cumple-de-theo-b4i1mfkq",
  "shareTitle": "Cumpleaños de Theo",
  "shareDescription": "Te invitamos a compartir un mundo lleno de alegría y diversión.",
  "shareImageUrl": "https://storage.example.com/invitations/theo-cover.jpg"
}
```

Si actualmente existen campos equivalentes, reutilizarlos y no duplicar información innecesariamente.

---

## Backend

Crear o reutilizar un endpoint público que permita obtener los datos necesarios usando el `slug`.

Ejemplo:

```http
GET /api/public/invitations/{slug}/metadata
```

Respuesta esperada:

```json
{
  "slug": "cumple-de-theo-b4i1mfkq",
  "shareTitle": "Cumpleaños de Theo",
  "shareDescription": "Te invitamos a compartir un mundo lleno de alegría y diversión.",
  "shareImageUrl": "https://storage.example.com/invitations/theo-cover.jpg",
  "publicUrl": "https://invitations-inky-seven.vercel.app/i/cumple-de-theo-b4i1mfkq"
}
```

El endpoint debe:

- Ser público.
- No requerir autenticación.
- Buscar la invitación por `slug`.
- Devolver `404` cuando la invitación no exista.
- No exponer datos privados.
- Sanitizar o escapar los textos.
- Devolver solamente información necesaria para compartir.

---

## Modelo de datos

Agregar los campos necesarios a la entidad de invitación si todavía no existen:

```text
share_title
share_description
share_image_url
```

Crear la migración correspondiente con Flyway.

Ejemplo:

```text
Vx__add_invitation_share_metadata.sql
```

Consideraciones:

- `share_title`: obligatorio o con fallback.
- `share_description`: obligatorio o con fallback.
- `share_image_url`: URL pública HTTPS.
- No guardar imágenes como Base64 en PostgreSQL.
- No utilizar URLs temporales que expiren.

---

## Formulario de creación y edición

Agregar una sección llamada:

```text
Vista previa al compartir
```

Campos:

```text
Título para compartir
Descripción para compartir
Imagen para compartir
```

Validaciones recomendadas:

```text
Título:
Máximo 70 caracteres.

Descripción:
Máximo 160 caracteres.

Imagen:
JPG, JPEG, PNG o WebP.
```

La interfaz debe mostrar una vista previa similar a una tarjeta de WhatsApp:

```text
[ Imagen ]

Cumpleaños de Theo

Te invitamos a compartir un mundo lleno de alegría y diversión.

invitations-inky-seven.vercel.app
```

---

## Imagen para compartir

La imagen debe:

- Tener una URL pública HTTPS.
- Ser accesible sin autenticación.
- No utilizar `localhost`.
- No utilizar una URL temporal.
- No depender de cookies.
- Preferiblemente tener proporción social.

Tamaño recomendado:

```text
1200 × 630 px
```

Agregar también:

```html
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
```

Si la imagen subida no tiene esa proporción, mostrar una advertencia o generar una versión adaptada.

---

## Vercel Function

Crear una función serverless dentro del proyecto frontend.

Estructura sugerida:

```text
frontend/
├── api/
│   └── invitation-meta.ts
├── src/
├── vercel.json
└── package.json
```

La función debe:

1. Recibir el `slug`.
2. Consultar el endpoint público del backend.
3. Escapar los valores antes de insertarlos en HTML.
4. Construir un documento HTML completo.
5. Incluir Open Graph y Twitter Card.
6. Incluir un fallback cuando falte algún dato.
7. Permitir que el usuario acceda posteriormente a la invitación React.

---

## Comportamiento para usuarios y rastreadores

La solución debe distinguir entre:

- Rastreadores sociales.
- Navegadores normales.

Para rastreadores como:

```text
facebookexternalhit
Facebot
WhatsApp
Twitterbot
LinkedInBot
TelegramBot
Discordbot
Slackbot
```

devolver directamente el HTML con los metadatos.

Para navegadores normales, se puede:

- Devolver el mismo HTML y cargar la aplicación React.
- O redirigir internamente hacia la SPA después de exponer los metadatos.

Evitar bucles de redirección.

La URL visible debe mantenerse como:

```text
/i/:slug
```

---

## Configuración de Vercel

Actualizar `frontend/vercel.json`.

La ruta pública de invitaciones debe ejecutarse mediante la función dinámica antes de aplicar el fallback general de la SPA.

Ejemplo conceptual:

```json
{
  "rewrites": [
    {
      "source": "/i/:slug",
      "destination": "/api/invitation-meta?slug=:slug"
    },
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

El agente debe validar la sintaxis real soportada por Vercel y evitar que el rewrite general hacia `index.html` capture `/i/:slug` antes que la función.

---

## Variables de entorno en Vercel

Agregar una variable de entorno para consultar el backend:

```text
BACKEND_URL
```

Valor de producción:

```text
https://invitation-backend-10255163119.southamerica-west1.run.app
```

No incluir `/` al final.

Uso esperado:

```text
${BACKEND_URL}/api/public/invitations/{slug}/metadata
```

No exponer secretos en variables prefijadas con `VITE_`.

`BACKEND_URL` debe utilizarse únicamente desde la Vercel Function.

---

## Valores por defecto

Si faltan datos personalizados, usar fallbacks seguros.

Ejemplo:

```text
Título:
Estás invitado

Descripción:
Acompáñanos a celebrar un momento muy especial.

Imagen:
Imagen predeterminada de Mi Invitación
```

Nunca generar etiquetas con valores `undefined`, `null` o vacíos.

---

## Escape y seguridad

Antes de insertar valores en HTML, escapar como mínimo:

```text
&
<
>
"
'
```

No insertar directamente contenido de la base de datos en el HTML.

Validar también que `shareImageUrl` utilice:

```text
https://
```

No permitir esquemas como:

```text
javascript:
data:
file:
```

---

## Caché

Configurar caché moderada para reducir consultas al backend, sin impedir que los cambios se actualicen.

Ejemplo:

```http
Cache-Control: public, s-maxage=300, stale-while-revalidate=600
```

Los cambios de título, descripción o imagen deberían reflejarse en un tiempo razonable.

---

## Pruebas obligatorias

Verificar manualmente el HTML recibido:

```bash
curl -A "facebookexternalhit/1.1" \
  https://invitations-inky-seven.vercel.app/i/cumple-de-theo-b4i1mfkq
```

La respuesta debe contener:

```text
og:title
og:description
og:image
og:url
twitter:card
twitter:title
twitter:description
twitter:image
```

También probar:

```bash
curl -A "WhatsApp/2.0" \
  https://invitations-inky-seven.vercel.app/i/cumple-de-theo-b4i1mfkq
```

Verificar que:

- La respuesta sea `200`.
- El `Content-Type` sea `text/html`.
- Los metadatos correspondan a la invitación.
- La imagen sea accesible públicamente.
- Abrir la URL normalmente siga mostrando la invitación React.

---

## Casos de error

### Invitación inexistente

Responder con:

```text
404
```

y HTML con título apropiado:

```html
<title>Invitación no encontrada</title>
```

### Backend no disponible

Responder con HTML de fallback y registrar el error.

No exponer trazas internas ni detalles técnicos al usuario.

### Imagen no disponible

Usar una imagen predeterminada pública.

---

## Criterios de aceptación

La tarea se considera terminada cuando:

- Cada invitación puede guardar título, descripción e imagen para compartir.
- La ruta `/i/:slug` devuelve metadatos dinámicos en el HTML inicial.
- WhatsApp detecta el título, la descripción y la imagen.
- Facebook y otras plataformas detectan las etiquetas Open Graph.
- La URL compartida continúa siendo la URL de Vercel.
- El usuario puede abrir normalmente la invitación desde esa misma URL.
- Las rutas normales de React siguen funcionando.
- No se rompe el fallback SPA de Vercel.
- No se utiliza solamente `react-helmet`.
- No se exponen datos privados.
- La implementación incluye pruebas.
- TypeScript, lint, tests y build finalizan correctamente.

---

## Entregables

El agente debe entregar:

1. Migración de base de datos.
2. Cambios en la entidad y DTOs.
3. Endpoint público de metadatos.
4. Campos de creación y edición.
5. Vista previa de tarjeta social.
6. Vercel Function.
7. Configuración de `vercel.json`.
8. Fallbacks de metadatos.
9. Pruebas de backend.
10. Pruebas de frontend o función serverless.
11. Resultado de TypeScript, lint, tests y build.
12. Ejemplo real probado con una invitación existente.

---

## Restricciones

- No migrar todo el frontend a Next.js.
- No eliminar React Router.
- No cambiar la URL pública `/i/:slug`.
- No usar únicamente JavaScript del navegador para insertar metadatos.
- No utilizar imágenes Base64.
- No utilizar URLs privadas o temporales.
- No modificar el flujo actual de visualización de invitaciones más de lo necesario.
