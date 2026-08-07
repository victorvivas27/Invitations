# Tarea — Reparar la galería de fotografías y la sección final de la invitación

## Objetivo

Corregir únicamente el diseño visual de:

1. La galería de fotografías.
2. La última sección de la invitación.

No modificar ninguna otra funcionalidad del proyecto.

---

# Restricciones

No modificar:

- Backend.
- API.
- Modelos.
- Tipos.
- Estado.
- Hooks.
- Servicios.
- Rutas.
- Persistencia.
- Animaciones existentes.
- Componentes no relacionados.

Trabajar únicamente sobre los componentes y estilos responsables de estas dos secciones.

No realizar refactorizaciones innecesarias.

No cambiar la estructura general de la invitación.

---

# Parte 1 — Galería de fotografías

## Problema actual

Actualmente las fotografías aparecen apiladas y desordenadas.

El resultado no es profesional ni responsive.

---

## Objetivo

Transformar la galería en una sección moderna, limpia y completamente responsive.

---

## Desktop

Utilizar CSS Grid.

Requisitos:

- 3 columnas.
- Espaciado uniforme.
- Tarjetas con la misma altura.
- Bordes redondeados.
- Sombra suave.
- object-fit: cover.
- Las imágenes nunca deben deformarse.
- Evitar que una imagen empuje a otra.
- Mantener una distribución equilibrada.

Ejemplo esperado:

```
┌────────────┬────────────┬────────────┐
│            │            │            │
│    FOTO    │    FOTO    │    FOTO    │
│            │            │            │
├────────────┼────────────┼────────────┤
│            │            │            │
│    FOTO    │    FOTO    │    FOTO    │
│            │            │            │
└────────────┴────────────┴────────────┘
```

---

## Mobile

La galería debe convertirse automáticamente en:

- una sola columna;
- ancho completo;
- imágenes grandes;
- separación uniforme.

Ejemplo:

```
┌──────────────────────────┐
│                          │
│          FOTO            │
│                          │
└──────────────────────────┘

┌──────────────────────────┐
│                          │
│          FOTO            │
│                          │
└──────────────────────────┘

┌──────────────────────────┐
│                          │
│          FOTO            │
│                          │
└──────────────────────────┘
```

---

## No utilizar

- Masonry.
- Posiciones absolutas.
- Imágenes superpuestas.
- Alturas aleatorias.

La galería debe verse limpia y consistente.

---

# Parte 2 — Última sección

## Problema actual

Actualmente la última sección muestra:

```
Imagen

Texto
```

La imagen aparece arriba y el contenido debajo.

Esto es incorrecto.

---

## Objetivo

La imagen debe convertirse en el fondo completo de la sección.

El contenido debe aparecer encima.

---

## Resultado esperado

```
┌──────────────────────────────────────┐
│                                      │
│                                      │
│         IMAGEN DE FONDO              │
│                                      │
│                                      │
│        Gracias por acompañarnos      │
│        ¡Te esperamos!                │
│                                      │
└──────────────────────────────────────┘
```

---

## Implementación

La estructura debe ser similar a:

```html
<section class="hero-section">

    <div class="background-image"></div>

    <div class="background-overlay"></div>

    <div class="hero-content">

        ...

    </div>

</section>
```

No utilizar una etiqueta `<img>` colocada encima del contenido.

La imagen debe comportarse como un verdadero fondo.

---

# Overlay

Agregar una capa oscura o semitransparente.

Objetivo:

- mejorar la lectura del texto;
- conservar la imagen visible.

No oscurecer excesivamente la fotografía.

---

# Texto

El contenido debe permanecer:

- perfectamente centrado;
- verticalmente;
- horizontalmente;
- siempre encima del fondo;
- completamente responsive.

---

# Responsive

## Desktop

Altura aproximada:

500–700 px.

La imagen debe cubrir toda la sección.

---

## Mobile

Altura aproximada:

350–450 px.

El contenido debe seguir centrado.

No permitir que el texto salga del área visible.

---

# Calidad visual

Buscar una apariencia moderna similar a:

- Apple
- Airbnb
- Stripe
- Canva

Priorizar:

- limpieza;
- equilibrio visual;
- consistencia;
- buena experiencia tanto en escritorio como en dispositivos móviles.

---

# Validación

Antes de finalizar:

- ejecutar:

```bash
pnpm exec tsc -b
```

- corregir cualquier error de TypeScript;
- confirmar que la compilación finaliza sin errores.

---

# Importante

No modificar ninguna otra sección de la invitación.

No cambiar componentes reutilizados.

No alterar la lógica existente.

No modificar el backend.

No cambiar el comportamiento funcional de la aplicación.

La tarea debe limitarse exclusivamente a mejorar la galería de fotografías y la última sección con imagen de fondo y contenido superpuesto.

