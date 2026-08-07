# Instrucción para un diseño móvil realmente adaptado

## Objetivo

Corregir la versión móvil de la aplicación para que se vea diseñada específicamente para pantallas pequeñas.

No quiero que la versión móvil sea simplemente la versión de escritorio con todos los elementos colocados uno debajo del otro.

La interfaz debe adaptarse progresivamente al ancho disponible, manteniendo una composición compacta, legible y equilibrada.

---

## 1. Tipografía responsive

Los títulos, textos y etiquetas deben reducir su tamaño en pantallas pequeñas.

Un `h1` de escritorio no puede conservar el mismo tamaño en móvil.

Ejemplo recomendado:

```css
.hero-title {
  font-size: clamp(2rem, 5vw, 4.5rem);
  line-height: 1.05;
}
```

Aplicar tamaños responsive a:

* `h1`
* `h2`
* `h3`
* Párrafos
* Botones
* Etiquetas
* Textos secundarios
* Contenido de tarjetas

La reducción debe ser gradual y no depender únicamente de un breakpoint.

No utilizar textos tan grandes que:

* Ocupen demasiadas líneas.
* Empujen el contenido fuera de la pantalla.
* Generen scroll horizontal.
* Hagan que una sección ocupe toda la pantalla innecesariamente.

---

## 2. Botones en una misma fila

Cuando existan dos botones principales juntos, deben mantenerse uno al lado del otro en móvil siempre que sea posible.

No colocarlos automáticamente uno encima del otro.

Antes de cambiar a una columna, reducir progresivamente:

* El espacio entre botones.
* El `padding` horizontal.
* El tamaño de la tipografía.
* El ancho mínimo.
* El tamaño de los iconos.

Ejemplo:

```css
.actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: nowrap;
}

.actions button,
.actions a {
  flex: 1;
  min-width: 0;
  padding: 0.75rem 1rem;
  font-size: 0.9rem;
  white-space: nowrap;
}
```

En pantallas más pequeñas:

```css
@media (max-width: 420px) {
  .actions {
    gap: 0.5rem;
  }

  .actions button,
  .actions a {
    padding: 0.65rem 0.6rem;
    font-size: 0.78rem;
  }
}
```

Los botones solamente deben colocarse uno debajo del otro cuando realmente sea imposible mantenerlos legibles en la misma fila.

No utilizar anchos fijos que provoquen desbordamiento.

---

## 3. Orden de adaptación de una tarjeta

Cuando una tarjeta no cabe correctamente en una pantalla móvil, no reducir inmediatamente toda la tipografía.

Aplicar esta secuencia:

1. Reducir el ancho externo y los márgenes.
2. Reducir el `padding` interno.
3. Reducir el espacio entre elementos.
4. Reducir el tamaño de imágenes o iconos.
5. Ajustar la distribución interna.
6. Reducir moderadamente la tipografía.
7. Cambiar la estructura solamente como último recurso.

La tarjeta debe adaptarse de afuera hacia adentro.

Ejemplo:

```css
.card {
  width: 100%;
  max-width: 100%;
  padding: clamp(0.85rem, 3vw, 1.5rem);
  gap: clamp(0.6rem, 2vw, 1rem);
  box-sizing: border-box;
}
```

No permitir que el contenido interno fuerce un ancho mayor que la pantalla.

---

## 4. Tarjetas de dos columnas en móvil

Cuando el diseño muestre dos tarjetas por fila, ambas deben entrar completamente dentro del ancho de la pantalla.

No deben cortarse ni generar scroll horizontal.

Ejemplo:

```css
.card-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.75rem;
  width: 100%;
}
```

Es importante utilizar:

```css
minmax(0, 1fr)
```

para evitar que el contenido fuerce el crecimiento de la columna.

Cada tarjeta debe incluir:

```css
.card {
  min-width: 0;
  width: 100%;
  overflow: hidden;
}
```

Los textos largos deben poder ajustarse:

```css
.card-title,
.card-description {
  overflow-wrap: anywhere;
}
```

Las imágenes deben respetar el ancho disponible:

```css
.card img {
  width: 100%;
  max-width: 100%;
  height: auto;
  display: block;
}
```

---

## 5. Reducción progresiva en tarjetas de dos columnas

Para conservar dos tarjetas por fila en móvil, reducir:

* `padding`
* `gap`
* Tamaño del icono
* Altura de la imagen
* Tamaño del título
* Cantidad de texto visible
* Separación entre título y descripción

Ejemplo:

```css
.card-grid {
  gap: clamp(0.5rem, 2vw, 0.9rem);
}

.card {
  padding: clamp(0.65rem, 2.5vw, 1rem);
}

.card-title {
  font-size: clamp(0.8rem, 3vw, 1rem);
}

.card-description {
  font-size: clamp(0.7rem, 2.5vw, 0.9rem);
  line-height: 1.35;
}
```

Si una descripción es demasiado larga, puede limitarse visualmente:

```css
.card-description {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
```

No reducir la tipografía hasta volverla ilegible.

Si después de optimizar todos estos valores dos tarjetas todavía no caben correctamente, entonces se puede cambiar a una columna.

---

## 6. Evitar desbordamiento horizontal

No debe existir scroll horizontal en ninguna pantalla.

Revisar especialmente:

* Contenedores con `width: 100vw`.
* Elementos con ancho fijo.
* Botones con `min-width` demasiado grande.
* Imágenes sin `max-width`.
* Grillas con columnas rígidas.
* Textos con `white-space: nowrap`.
* Márgenes negativos.
* Elementos posicionados de forma absoluta.
* Animaciones que desplazan contenido fuera del viewport.

Aplicar globalmente:

```css
*,
*::before,
*::after {
  box-sizing: border-box;
}

html,
body,
#root {
  width: 100%;
  max-width: 100%;
  overflow-x: hidden;
}
```

No utilizar `overflow-x: hidden` como única solución para ocultar errores de layout. Primero se debe corregir el elemento que está desbordando.

---

## 7. Contenedores móviles

Los contenedores deben utilizar espacios laterales más pequeños en móvil.

Ejemplo:

```css
.page-container {
  width: min(100% - 2rem, 1200px);
  margin-inline: auto;
}
```

En pantallas pequeñas:

```css
@media (max-width: 480px) {
  .page-container {
    width: min(100% - 1rem, 1200px);
  }
}
```

No usar márgenes laterales excesivos que reduzcan innecesariamente el espacio útil.

---

## 8. Hero en móvil

El Hero debe mantener una composición compacta.

Ajustar:

* Tamaño del `h1`.
* Ancho del texto.
* Separación entre título y descripción.
* Altura de botones.
* Tamaño de la demostración visual.
* Espacios superior e inferior.

Los dos botones principales deben mantenerse en la misma fila cuando sea posible.

La vista previa de la invitación debe escalar dentro del ancho disponible:

```css
.hero-preview {
  width: 100%;
  max-width: 100%;
  transform-origin: top center;
}
```

No permitir que el Hero genere una pantalla excesivamente larga antes de mostrar el siguiente contenido.

---

## 9. No apilar todo automáticamente

Evitar reglas genéricas como:

```css
@media (max-width: 768px) {
  * {
    flex-direction: column;
  }
}
```

Cada componente debe evaluarse individualmente.

En móvil pueden mantenerse en fila:

* Dos botones.
* Dos tarjetas.
* Icono y texto.
* Fecha y hora.
* Pequeños controles.
* Acciones secundarias.

Solamente apilar cuando la legibilidad o el espacio realmente lo requieran.

---

## 10. Breakpoints basados en el contenido

No depender únicamente de breakpoints tradicionales como `768px`.

Probar también:

* `360px`
* `375px`
* `390px`
* `412px`
* `430px`
* `480px`
* `768px`

Los cambios deben realizarse cuando el componente deja de verse correctamente, no solo porque se alcanzó un ancho genérico.

---

## 11. Uso recomendado de `clamp`

Utilizar `clamp()` para lograr una reducción progresiva.

Ejemplos:

```css
font-size: clamp(0.8rem, 2.5vw, 1rem);
padding: clamp(0.65rem, 2vw, 1rem);
gap: clamp(0.5rem, 2vw, 1rem);
border-radius: clamp(0.75rem, 2vw, 1.25rem);
```

Esto permite que los elementos reduzcan su tamaño de manera gradual en lugar de cambiar bruscamente entre escritorio y móvil.

---

## 12. Pruebas visuales obligatorias

Revisar cada sección en los siguientes anchos:

```text
320px
360px
375px
390px
412px
430px
480px
768px
```

Verificar:

* Que no exista scroll horizontal.
* Que los títulos no se corten.
* Que los botones entren correctamente.
* Que dos botones puedan mantenerse en la misma fila.
* Que dos tarjetas entren en una misma fila cuando el diseño lo requiera.
* Que ninguna tarjeta salga fuera del viewport.
* Que las imágenes se reduzcan correctamente.
* Que la tipografía siga siendo legible.
* Que los espacios no sean excesivos.
* Que la composición no parezca una versión de escritorio apilada.
* Que los elementos animados no provoquen desbordamiento.

---

## 13. Criterios de aceptación

La tarea se considera completada cuando:

1. La versión móvil se siente diseñada específicamente para móvil.
2. Los títulos reducen su tamaño progresivamente.
3. Los párrafos y textos secundarios se adaptan al ancho disponible.
4. Dos botones permanecen uno al lado del otro cuando existe espacio suficiente.
5. Los botones reducen primero su `padding`, espacio y tipografía antes de apilarse.
6. Las tarjetas se reducen de afuera hacia adentro.
7. Las tarjetas ajustan primero márgenes, `padding`, espacios e imágenes.
8. La tipografía se reduce solamente después de optimizar la estructura.
9. Las grillas de dos columnas entran completamente en la pantalla.
10. Ninguna tarjeta sale fuera del viewport.
11. No existe scroll horizontal.
12. Las imágenes respetan el ancho de su contenedor.
13. Los textos largos no rompen el layout.
14. No se aplican reglas genéricas que conviertan todo en una columna.
15. Cada componente tiene un comportamiento responsive propio.
16. El diseño funciona correctamente desde `320px`.
17. Las animaciones no provocan desbordamiento horizontal.
18. La interfaz conserva buena legibilidad y jerarquía visual.
19. TypeScript, lint, pruebas y build finalizan sin errores.

## Resultado esperado

La versión móvil debe sentirse compacta, proporcionada y correctamente adaptada.

Los componentes deben aprovechar el ancho disponible antes de cambiar su estructura.

La prioridad debe ser:

```text
Reducir espacios
→ reducir padding
→ reducir imágenes e iconos
→ ajustar distribución
→ reducir tipografía
→ cambiar columnas únicamente si sigue siendo necesario
```

No convertir automáticamente todos los componentes en bloques verticales.
