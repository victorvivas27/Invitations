# Instrucción para animaciones y separación entre secciones

## Objetivo general

Quiero que toda la invitación tenga animaciones suaves, elegantes, lentas y visibles al hacer scroll, inspiradas en la sensación visual de las páginas de productos de Apple.

La invitación debe sentirse moderna, fluida y con movimiento, pero sin animaciones bruscas, exageradas o desordenadas.

---

## Elementos que deben animarse

Todo elemento visible que contenga texto o imágenes debe animarse al entrar en pantalla.

Esto incluye:

- Títulos
- Subtítulos
- Frases
- Párrafos
- Fecha
- Hora
- Dirección
- Botones
- Iconos
- Formulario de asistencia
- Fotografías
- Imágenes decorativas
- Personajes
- Fondos
- Mensajes finales
- Texto de agradecimiento

No quiero que solamente se animen algunos elementos. Quiero que toda la invitación tenga movimiento.

---

## Comportamiento de las animaciones al hacer scroll

Cuando un elemento entra en el área visible de la pantalla:

1. Debe comenzar oculto o parcialmente oculto.
2. Debe aparecer lentamente.
3. Debe moverse suavemente hasta su posición final.
4. La animación debe ser visible y durar lo suficiente para que se note.
5. No debe aparecer de golpe.

### Configuración recomendada para textos

- Opacidad inicial: `0`
- Movimiento inicial: entre `30px` y `60px` hacia abajo
- Opacidad final: `1`
- Posición final: normal
- Duración: entre `1.2s` y `1.8s`
- Transición: suave
- Easing recomendado: `ease-out`

### Configuración recomendada para imágenes

- Opacidad inicial: `0`
- Escala inicial: entre `0.92` y `0.97`
- Movimiento inicial: entre `30px` y `80px`
- Opacidad final: `1`
- Escala final: `1`
- Duración: entre `1.4s` y `2s`
- Transición lenta y elegante

---

## Las animaciones deben repetirse

No quiero que la animación ocurra una sola vez.

Cuando el usuario hace scroll y un elemento sale completamente de la pantalla, el elemento debe quedar preparado para animarse nuevamente.

Cuando el usuario vuelva a esa sección, la animación debe ejecutarse otra vez.

Esto debe funcionar tanto al bajar como al subir.

### Ejemplo esperado

1. El usuario baja hasta la galería.
2. Las imágenes aparecen con animación.
3. El usuario sigue bajando y la galería sale de pantalla.
4. El usuario vuelve hacia arriba.
5. Las imágenes deben animarse nuevamente.

Si se utiliza Framer Motion:

- No usar `once: true`.
- La animación debe repetirse cada vez que el elemento vuelva a entrar en pantalla.
- Configurar correctamente los estados visibles y ocultos.
- Detectar la entrada y salida del viewport.

---

## Animación escalonada

Cuando existen varios elementos dentro de una misma sección, no quiero que todos aparezcan exactamente al mismo tiempo.

Deben aparecer uno después de otro.

### Ejemplo

1. Primero aparece el título.
2. Después aparece la frase.
3. Después aparece la fecha.
4. Después aparece la dirección.
5. Después aparece el botón.

Usar un retraso aproximado de entre `100ms` y `200ms` entre cada elemento.

En una galería:

1. Aparece la primera imagen.
2. Luego aparece la segunda.
3. Luego aparece la tercera.
4. Y así sucesivamente.

---

## Variaciones de animación

No quiero que todos los elementos tengan exactamente la misma animación.

Usar diferentes variaciones, pero manteniendo un estilo uniforme.

Ejemplos:

- Textos que aparecen desde abajo.
- Títulos que aparecen lentamente con escala.
- Frases que entran desde un costado.
- Imágenes con zoom suave.
- Fotografías con movimiento vertical ligero.
- Personajes con una entrada más destacada.
- Fondos con un efecto de profundidad suave.

No usar rebotes exagerados.

No usar movimientos rápidos.

No usar animaciones que distraigan o dificulten la lectura.

---

## Efecto visual inspirado en Apple

Quiero una experiencia similar a una página moderna de Apple:

- Movimientos lentos.
- Transiciones suaves.
- Elementos que aparecen progresivamente.
- Imágenes con pequeños efectos de escala.
- Sensación de profundidad.
- Animaciones controladas por el scroll.
- Movimiento elegante y limpio.
- Buena separación visual entre cada sección.
- Sin saltos bruscos.
- Sin rebotes exagerados.
- Sin movimientos infantiles o desordenados.

No quiero copiar exactamente una página de Apple. Quiero replicar la sensación de fluidez, elegancia y movimiento.

---

## Separación entre secciones

Quiero que la separación entre cada sección de la invitación se note claramente.

Cada sección debe tener un espacio visible solamente en la parte inferior.

La separación debe ser aproximadamente de `2cm`.

### Regla principal

Agregar margen inferior a cada sección:

```css
.invitation-section {
  margin-bottom: 2cm;
}
```

No agregar el mismo margen en la parte superior.

La separación debe estar solamente debajo de cada sección.

### Importante

- No duplicar la separación usando `margin-top` y `margin-bottom`.
- No agregar un espacio superior adicional.
- El espacio debe existir únicamente al final de cada sección.
- La última sección puede quedar sin margen inferior si no es necesario.
- La separación debe mantenerse en todas las secciones principales.
- El espacio debe ser visible tanto si la sección tiene fondo blanco, gradiente o imagen.

### Opción recomendada para evitar margen después de la última sección

```css
.invitation-section:not(:last-child) {
  margin-bottom: 2cm;
}
```

### En dispositivos móviles

Si `2cm` genera demasiado espacio en pantallas pequeñas, se puede reducir levemente, pero la separación todavía debe notarse.

```css
.invitation-section:not(:last-child) {
  margin-bottom: 2cm;
}

@media (max-width: 768px) {
  .invitation-section:not(:last-child) {
    margin-bottom: 1.4cm;
  }
}
```

No eliminar por completo la separación en dispositivos móviles.

---

## Fondos de las secciones

La separación inferior debe permitir distinguir claramente dónde termina una sección y dónde comienza la siguiente.

Esto debe funcionar con:

- Secciones con fondo blanco
- Secciones con gradiente
- Secciones con imagen de fondo
- Secciones con personajes
- Secciones con fotografías
- Secciones con fondos personalizados por el usuario

Cada sección debe mantener su propio fondo y terminar antes del espacio de separación.

El espacio inferior no debe quedar cubierto accidentalmente por la imagen de fondo de la sección siguiente.

---

## Estructura de componentes

No colocar toda la lógica dentro de un solo archivo.

Crear componentes reutilizables, por ejemplo:

- `AnimatedSection`
- `AnimatedText`
- `AnimatedTitle`
- `AnimatedImage`
- `AnimatedGallery`
- `InvitationSection`

Cada sección debe utilizar una clase o componente común para controlar:

- La animación
- La entrada al viewport
- La salida del viewport
- La repetición de la animación
- El margen inferior
- La accesibilidad
- El rendimiento

---

## Implementación recomendada

Se puede utilizar:

- `IntersectionObserver`
- Framer Motion
- Motion
- Otra librería equivalente, siempre que sea liviana y tenga buen rendimiento

Si se usa Framer Motion, crear variantes reutilizables.

Ejemplo conceptual:

```tsx
<motion.section
  className="invitation-section"
  initial="hidden"
  whileInView="visible"
  viewport={{
    once: false,
    amount: 0.25
  }}
  variants={sectionVariants}
>
  {/* Contenido */}
</motion.section>
```

La animación debe volver al estado oculto cuando la sección salga del viewport, para poder reproducirse otra vez al regresar.

---

## Accesibilidad y rendimiento

- Respetar `prefers-reduced-motion`.
- No bloquear el scroll.
- No afectar el rendimiento en teléfonos.
- No provocar saltos en el diseño.
- Priorizar `transform` y `opacity`.
- Evitar animar propiedades pesadas.
- Mantener el tamaño reservado para las imágenes.
- Evitar cambios bruscos de altura.
- No afectar la lectura del formulario.
- No hacer que los botones se muevan mientras el usuario intenta presionarlos.

---

## Resultado esperado

Al abrir la invitación y hacer scroll:

- Cada sección debe aparecer con una animación lenta.
- Todos los textos deben animarse.
- Todas las imágenes deben animarse.
- Las animaciones deben notarse claramente.
- Los elementos deben aparecer de forma progresiva.
- Las animaciones deben repetirse cuando el usuario salga de una sección y vuelva.
- La separación entre secciones debe ser visible.
- Cada sección debe tener aproximadamente `2cm` de espacio solamente en la parte inferior.
- La invitación debe sentirse moderna, elegante, fluida y especial.
