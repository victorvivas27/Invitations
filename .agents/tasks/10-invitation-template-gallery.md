
# Tarea 10 — Galería visual de plantillas de invitaciones

**Guardar en:** `docs/tasks/task-10-invitation-template-gallery.md`

---

# Objetivo

Diseñar e implementar una galería pública de plantillas para invitaciones digitales.

La galería será el siguiente paso después del Home implementado en la Tarea 09.

Cuando el usuario seleccione:

```text
Crear mi invitación
```

debe acceder a una pantalla donde pueda explorar diferentes estilos y tipos de invitaciones antes de comenzar la personalización.

Esta tarea debe enfocarse en:

* exploración visual;
* categorías;
* filtros;
* búsqueda;
* selección de plantilla;
* vista previa;
* UX/UI;
* responsive;
* accesibilidad.

No implementar todavía el editor completo.

No implementar persistencia en backend.

No crear endpoints.

No implementar pagos.

No crear ningún commit.

---

# Flujo esperado

```text
Home
↓
Crear mi invitación
↓
Galería de plantillas
↓
Explorar o filtrar
↓
Ver plantilla
↓
Seleccionar plantilla
↓
Pantalla inicial de creación
```

La pantalla inicial de creación completa se implementará en una tarea posterior.

---

# Ruta principal

Crear una ruta pública:

```text
/templates
```

Ejemplo local:

```text
http://localhost:5173/templates
```

Esta ruta debe abrirse sin autenticación.

No debe redirigir al login.

---

# Navegación desde el Home

Actualizar los botones principales de la Tarea 09:

```text
Crear mi invitación
```

```text
Comenzar ahora
```

para navegar a:

```text
/templates
```

El enlace de navegación:

```text
Plantillas
```

también debe dirigir a esa ruta.

No deben quedar botones sin función.

No utilizar anclas temporales para estas acciones después de implementar la galería.

---

# Identidad visual

La galería debe utilizar la paleta corregida:

```text
Rojo
Azul profundo
Negro
Blanco
Grises neutros
```

Debe sentirse:

* visual;
* dinámica;
* moderna;
* creativa;
* neutral;
* apropiada para distintos eventos.

No copiar personajes, símbolos ni elementos protegidos de Spider-Man.

---

# Encabezado

Reutilizar el mismo encabezado público del Home.

Debe incluir:

* marca;
* Inicio;
* Plantillas;
* Cómo funciona, cuando corresponda;
* acción principal;
* menú móvil.

En la galería, el enlace:

```text
Plantillas
```

debe mostrarse como activo.

No duplicar el Header.

---

# Encabezado de la página

Mostrar:

```text
Encuentra el diseño ideal para tu celebración
```

Descripción sugerida:

```text
Explora diferentes estilos y elige una plantilla para comenzar a crear tu invitación.
```

Puede incluir una pequeña etiqueta:

```text
Plantillas para cada momento
```

No presentar la galería como una tienda si todavía no existen pagos.

---

# Datos locales

Como todavía no existe backend para plantillas, crear una fuente de datos local.

Ubicación sugerida:

```text
frontend/src/data/invitationTemplates.ts
```

No escribir todas las plantillas directamente dentro del componente de página.

---

# Modelo de plantilla

Crear un tipo equivalente a:

```ts
export type InvitationTemplateCategory =
  | "birthday"
  | "baptism"
  | "wedding"
  | "baby-shower"
  | "kids-party"
  | "anniversary"
  | "graduation"
  | "other";

export type InvitationTemplateStyle =
  | "modern"
  | "elegant"
  | "colorful"
  | "minimal"
  | "classic"
  | "playful";

export type InvitationTemplate = {
  id: string;
  name: string;
  description: string;
  category: InvitationTemplateCategory;
  style: InvitationTemplateStyle;
  previewVariant: string;
  isFeatured?: boolean;
  isAvailable: boolean;
};
```

Adaptar los nombres al idioma y convenciones actuales del proyecto.

No utilizar `any`.

---

# Plantillas mínimas

Crear al menos doce plantillas locales.

Distribución sugerida:

```text
2 cumpleaños
2 bautismos
2 matrimonios
1 baby shower
2 fiestas infantiles
1 aniversario
1 graduación
1 evento personalizado
```

Cada plantilla debe tener:

* identificador único;
* nombre;
* categoría;
* estilo;
* descripción breve;
* apariencia visual;
* estado disponible o próximo.

---

# Ejemplos de plantillas

## Cumpleaños urbano

```text
Categoría: Cumpleaños
Estilo: Moderno
Paleta: rojo, azul y blanco
```

## Cumpleaños colorido

```text
Categoría: Cumpleaños
Estilo: Colorido
Paleta: azul, rojo y amarillo
```

## Bautismo cielo

```text
Categoría: Bautismo
Estilo: Minimalista
Paleta: azul claro, blanco y gris
```

## Bautismo clásico

```text
Categoría: Bautismo
Estilo: Clásico
Paleta: azul profundo, blanco y dorado suave
```

## Boda elegante

```text
Categoría: Matrimonio
Estilo: Elegante
Paleta: negro, blanco y rojo oscuro
```

## Boda minimalista

```text
Categoría: Matrimonio
Estilo: Minimalista
Paleta: blanco, azul profundo y gris
```

## Baby shower moderno

```text
Categoría: Baby shower
Estilo: Moderno
Paleta: azul suave, rojo suave y blanco
```

## Fiesta infantil héroes

```text
Categoría: Fiesta infantil
Estilo: Dinámico
Paleta: rojo, azul y amarillo
```

No utilizar personajes reconocibles.

## Fiesta infantil aventura

```text
Categoría: Fiesta infantil
Estilo: Colorido
Paleta: azul, verde y rojo
```

## Aniversario nocturno

```text
Categoría: Aniversario
Estilo: Elegante
Paleta: negro, rojo oscuro y blanco
```

## Graduación moderna

```text
Categoría: Graduación
Estilo: Moderno
Paleta: azul profundo, blanco y rojo
```

## Diseño desde cero

```text
Categoría: Otro
Estilo: Personalizable
Paleta: neutra
```

---

# Imágenes y previews

No es obligatorio utilizar imágenes fotográficas.

Las vistas previas pueden construirse con:

* CSS;
* gradientes;
* formas geométricas;
* tipografía;
* bloques de color;
* ilustraciones propias;
* placeholders.

No descargar imágenes con derechos inciertos.

No utilizar imágenes de personas reales sin autorización.

No copiar plantillas comerciales existentes.

---

# Componente TemplateCard

Crear un componente reutilizable:

```text
TemplateCard
```

Ubicación sugerida:

```text
frontend/src/components/templates/TemplateCard.tsx
```

Debe mostrar:

* vista previa;
* nombre;
* categoría;
* estilo;
* descripción;
* estado;
* acción para ver;
* acción para utilizar.

---

# Estructura de tarjeta

Ejemplo:

```text
[Vista previa]

Cumpleaños urbano

Cumpleaños · Moderno

Una invitación dinámica con formas intensas y tipografía destacada.

[Vista previa] [Usar plantilla]
```

Las acciones deben ser botones o enlaces reales.

No convertir toda la tarjeta en un elemento ambiguo si contiene varias acciones.

---

# Estado disponible

Las plantillas disponibles deben mostrar:

```text
Disponible
```

El botón debe decir:

```text
Usar plantilla
```

---

# Estado próximo

Las plantillas no disponibles deben mostrar:

```text
Próximamente
```

El botón debe estar deshabilitado.

No permitir navegar hacia una plantilla no disponible.

No presentar elementos futuros como funcionales.

---

# Plantillas destacadas

Algunas plantillas pueden tener:

```text
Destacada
```

o:

```text
Popular
```

Estas etiquetas deben ser únicamente visuales.

No afirmar que son las más utilizadas si no existen datos reales.

Preferir:

```text
Recomendada
```

si se trata de una selección editorial.

---

# Categorías

Crear un filtro por categorías.

Opciones mínimas:

```text
Todas
Cumpleaños
Bautismos
Matrimonios
Baby shower
Fiestas infantiles
Aniversarios
Graduaciones
Otros
```

En móvil puede utilizarse:

* scroll horizontal controlado;
* selector;
* menú desplegable;
* botones compactos.

No permitir que los filtros generen scroll horizontal de toda la página.

---

# Filtro activo

El filtro seleccionado debe:

* ser visualmente claro;
* incluir contraste;
* usar `aria-pressed` cuando corresponda;
* poder seleccionarse con teclado.

Ejemplo:

```tsx
<button
  type="button"
  aria-pressed={selectedCategory === category}
>
```

---

# Filtro por estilo

Agregar un segundo filtro opcional:

```text
Todos los estilos
Moderno
Elegante
Colorido
Minimalista
Clásico
Divertido
```

En móvil puede representarse mediante un `<select>` accesible.

No recargar la página al cambiar filtros.

---

# Búsqueda

Agregar un campo de búsqueda.

Etiqueta:

```text
Buscar plantillas
```

Placeholder:

```text
Ej. cumpleaños, elegante o infantil
```

La búsqueda debe considerar:

* nombre;
* descripción;
* categoría;
* estilo.

Debe ignorar diferencias básicas de mayúsculas y minúsculas.

No es obligatorio implementar búsqueda tolerante a errores ortográficos.

---

# Contador de resultados

Mostrar un texto como:

```text
12 plantillas
```

o:

```text
4 resultados
```

Debe actualizarse al filtrar.

Utilizar pluralización correcta.

---

# Estado sin resultados

Si ningún elemento coincide, mostrar:

```text
No encontramos plantillas con esos filtros.
```

Texto secundario:

```text
Prueba con otra categoría o elimina la búsqueda.
```

Acción:

```text
Limpiar filtros
```

No mostrar una página vacía.

---

# Orden de plantillas

Ordenar inicialmente:

1. destacadas;
2. disponibles;
3. próximas.

No ordenar aleatoriamente.

El orden debe ser estable para evitar cambios inesperados.

---

# Vista previa ampliada

Al seleccionar:

```text
Vista previa
```

abrir una experiencia ampliada.

Puede implementarse mediante:

* modal;
* drawer;
* ruta dedicada.

Para esta tarea se recomienda un modal accesible.

---

# Modal de vista previa

El modal debe incluir:

* nombre de plantilla;
* vista previa grande;
* categoría;
* estilo;
* descripción;
* botón para utilizar;
* botón para cerrar.

Debe:

* cerrar con Escape;
* devolver el foco al elemento anterior;
* bloquear el scroll del fondo;
* tener `role="dialog"`;
* incluir título accesible;
* cerrar mediante botón visible.

No cerrar obligatoriamente al hacer clic dentro del contenido.

---

# Contenido de la vista previa

La vista previa puede mostrar un ejemplo como:

```text
Cumpleaños de Alex

Sábado 22 de agosto
17:00 horas

Salón Central

Te esperamos para celebrar
```

No utilizar información personal real.

Debe quedar claro que se trata de una demostración.

---

# Selección de plantilla

Al presionar:

```text
Usar plantilla
```

navegar a:

```text
/invitations/create?template={templateId}
```

Ejemplo:

```text
/invitations/create?template=birthday-urban
```

El identificador debe codificarse correctamente.

No incluir datos personales en la URL.

---

# Ruta inicial de creación

Crear una ruta temporal:

```text
/invitations/create
```

Esta ruta no debe implementar todavía el editor completo.

Debe leer:

```text
template
```

desde la query string.

---

# Pantalla temporal de creación

Mostrar:

```text
Plantilla seleccionada
```

Mostrar el nombre de la plantilla elegida.

Texto sugerido:

```text
Has elegido “Cumpleaños urbano”. En la siguiente etapa podrás personalizar todos los detalles de tu invitación.
```

Acciones:

```text
Cambiar plantilla
```

```text
Continuar próximamente
```

El botón futuro debe aparecer deshabilitado o claramente marcado como próximo.

No crear formularios incompletos.

---

# Plantilla inexistente

Si el identificador no corresponde a una plantilla:

```text
No encontramos la plantilla seleccionada.
```

Acción:

```text
Volver a plantillas
```

La aplicación no debe romperse.

---

# Diseño de la galería

En escritorio:

```text
Encabezado
Búsqueda y filtros
Cuadrícula de tres o cuatro columnas
```

En tablet:

```text
Dos columnas
```

En móvil:

```text
Una columna
```

Las tarjetas deben mantener una altura visual coherente.

No forzar textos con alturas fijas que causen cortes.

---

# Responsive

Validar:

```text
320px
375px
768px
1024px
1280px
1440px
```

Confirmar:

* filtros utilizables;
* búsqueda visible;
* tarjetas legibles;
* modal contenido;
* botones accesibles;
* sin scroll horizontal;
* sin texto cortado;
* previews proporcionadas.

---

# Accesibilidad

Cumplir como mínimo:

* un único `h1`;
* tarjetas con estructura semántica;
* botones con nombres claros;
* filtros navegables con teclado;
* búsqueda con etiqueta;
* modal accesible;
* foco visible;
* contraste suficiente;
* textos alternativos cuando existan imágenes;
* estados vacíos anunciables;
* etiquetas no dependientes solo del color.

---

# Animaciones

Permitir únicamente:

* hover suave;
* apertura del modal;
* aparición ligera de tarjetas;
* cambios de filtro discretos.

Respetar:

```css
prefers-reduced-motion
```

No animar toda la cuadrícula de forma repetitiva.

---

# Rendimiento

No cargar imágenes pesadas.

Si se utilizan assets:

* optimizarlos;
* usar dimensiones adecuadas;
* evitar imágenes enormes;
* utilizar lazy loading cuando corresponda.

Ejemplo:

```html
loading="lazy"
```

No agregar una librería pesada de galería.

---

# Seguridad

No incluir:

* secretos;
* claves API;
* información personal;
* correos reales;
* tokens;
* credenciales;
* datos privados.

Los identificadores de plantillas deben ser públicos y no sensibles.

---

# Archivos esperados

Adaptar a la arquitectura existente.

```text
frontend/src/pages/TemplatesPage.tsx
frontend/src/pages/TemplatesPage.test.tsx
frontend/src/pages/CreateInvitationPage.tsx
frontend/src/pages/CreateInvitationPage.test.tsx
frontend/src/components/templates/TemplateCard.tsx
frontend/src/components/templates/TemplatePreviewDialog.tsx
frontend/src/components/templates/TemplateFilters.tsx
frontend/src/data/invitationTemplates.ts
frontend/src/types/invitationTemplate.ts
```

También puede ser necesario modificar:

```text
frontend/src/App.tsx
frontend/src/routes/AppRoutes.tsx
frontend/src/components/layout/PublicHeader.tsx
frontend/src/pages/HomePage.tsx
frontend/src/styles.css
```

No crear archivos duplicados si existen equivalentes.

---

# Pruebas automáticas

Utilizar las herramientas actuales.

Preferir:

* Vitest;
* React Testing Library;
* mocks existentes.

No agregar otro framework.

---

# Casos mínimos de prueba

## Render inicial

Verificar que:

* aparece el título;
* aparece la búsqueda;
* aparecen las categorías;
* aparecen las plantillas;
* aparece el contador.

---

## Navegación desde Home

Verificar que:

```text
Crear mi invitación
```

navega a:

```text
/templates
```

---

## Filtro por categoría

Verificar que:

* muestra solo plantillas de la categoría;
* actualiza el contador;
* permite volver a Todas.

---

## Filtro por estilo

Verificar que:

* combina correctamente con la categoría;
* actualiza resultados.

---

## Búsqueda

Verificar que:

* encuentra por nombre;
* encuentra por descripción;
* ignora mayúsculas y minúsculas;
* muestra estado vacío cuando no coincide.

---

## Limpiar filtros

Verificar que:

* limpia búsqueda;
* restaura categoría;
* restaura estilo;
* muestra todas las plantillas.

---

## Vista previa

Verificar que:

* abre;
* muestra datos;
* cierra con botón;
* cierra con Escape;
* devuelve el foco.

---

## Selección

Verificar que:

```text
Usar plantilla
```

navega con el identificador correcto.

---

## Plantilla próxima

Verificar que:

* muestra “Próximamente”;
* no permite selección;
* no navega.

---

## Identificador inválido

Verificar que:

* muestra error controlado;
* ofrece volver a la galería.

---

## Accesibilidad

Verificar:

* un único `h1`;
* búsqueda etiquetada;
* filtros accesibles;
* modal con nombre;
* botones con texto;
* ausencia de enlaces rotos.

---

# Validación visual manual

Abrir:

```text
http://localhost:5173/templates
```

Revisar en:

```text
320px
375px
768px
1024px
1280px
1440px
```

Confirmar:

* identidad de color corregida;
* filtros claros;
* búsqueda legible;
* tarjetas atractivas;
* vistas previas variadas;
* modal funcional;
* botones visibles;
* sin scroll horizontal;
* sin errores en consola;
* sin elementos de Spider-Man protegidos;
* sin apariencia excesivamente femenina;
* experiencia coherente con el Home.

---

# Criterios de aceptación

La tarea se considera completada cuando:

* existe `/templates`;
* el Home navega hacia la galería;
* existen al menos doce plantillas;
* los datos están separados del componente;
* existe búsqueda;
* existe filtro por categoría;
* existe filtro por estilo;
* existe contador;
* existe estado sin resultados;
* existe vista previa ampliada;
* puede seleccionarse una plantilla disponible;
* las plantillas próximas están deshabilitadas;
* existe `/invitations/create`;
* la ruta temporal reconoce la plantilla;
* los identificadores inválidos se manejan;
* el diseño es responsive;
* la experiencia es accesible;
* no existen rutas rotas;
* no se implementa todavía el editor;
* no se crea backend;
* las pruebas pasan;
* el build funciona;
* no se crea ningún commit.

---

# Validaciones técnicas

Ejecutar:

```bash
npm run typecheck
npm run lint
npm run test
npm run build
git diff --check
```

Utilizar comandos equivalentes si el proyecto tiene otros scripts.

---

# Reporte final esperado

## Implementación

Reportar:

* archivos creados;
* archivos modificados;
* rutas agregadas;
* cantidad de plantillas;
* categorías;
* estilos;
* filtros;
* búsqueda;
* vista previa;
* navegación de selección.

## UX/UI

Confirmar:

* identidad visual roja, azul, negra y blanca;
* galería clara;
* tarjetas diferenciadas;
* estado activo de filtros;
* estado sin resultados;
* modal accesible;
* responsive;
* ausencia de scroll horizontal;
* ausencia de rutas rotas.

## Pruebas

Reportar:

* cantidad total;
* pruebas nuevas;
* pruebas exitosas;
* pruebas fallidas;
* TypeScript;
* lint;
* build;
* `git diff --check`.

## Validación manual

Confirmar únicamente lo realmente revisado:

* Home;
* navegación a galería;
* filtros;
* búsqueda;
* modal;
* selección;
* ruta temporal de creación;
* móvil;
* escritorio;
* consola.

## Seguridad

Confirmar:

* no se añadieron secretos;
* no se utilizaron datos personales reales;
* no se añadieron imágenes protegidas;
* no se copiaron elementos de Spider-Man;
* no se crearon endpoints;
* no se realizó configuración de producción.

## Git

Confirmar explícitamente:

```text
No se creó ningún commit.
```
