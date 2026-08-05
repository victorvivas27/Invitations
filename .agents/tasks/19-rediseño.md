# Tarea 13 – Rediseño Animado del Home y Alineación con el Producto Real

## Objetivo general

Modificar el Home actual de la aplicación.

El diseño actual se considera aproximadamente un 60 % aceptable visualmente, pero presenta tres problemas principales:

1. No explica con claridad lo que realmente permite hacer la aplicación.
2. La tarjeta o invitación de ejemplo no se parece al resultado real que obtiene el usuario al crear una invitación.
3. La página se siente estática porque prácticamente no tiene animaciones.

El nuevo Home debe representar fielmente el producto real, explicar el proceso de creación de invitaciones y tener una experiencia visual moderna, fluida y animada.

No se debe reconstruir todo sin revisar previamente lo existente. Se debe conservar lo que actualmente funciona bien y mejorar o reemplazar únicamente lo que no representa correctamente la aplicación.

---

# 1. Mensaje principal del Home

La aplicación permite crear invitaciones digitales personalizadas que se publican como una página web y se comparten mediante una URL.

El Home debe comunicar claramente que el usuario puede:

* Elegir una plantilla.
* Personalizar la información del evento.
* Agregar el nombre del homenajeado.
* Indicar fecha y hora.
* Agregar dirección o ubicación.
* Escribir un mensaje personalizado.
* Incorporar imágenes.
* Visualizar la invitación mientras la crea.
* Publicar la invitación.
* Compartirla mediante un enlace.
* Permitir que los invitados consulten la información desde cualquier dispositivo.

No presentar la aplicación como un creador de imágenes, tarjetas estáticas o archivos PDF.

El producto principal es una invitación web interactiva accesible mediante una URL.

---

# 2. Hero principal

El Hero debe explicar inmediatamente qué hace la aplicación.

## Contenido sugerido

### Título

**Crea invitaciones digitales que se sienten únicas**

### Descripción

Diseña una invitación web personalizada, agrega todos los detalles de tu evento y compártela fácilmente mediante un enlace.

### Acciones principales

* `Crear mi invitación`
* `Ver plantillas`

### Navegación

* `Crear mi invitación` debe dirigir a `/templates`.
* `Ver plantillas` debe dirigir a `/templates`.

La acción principal debe tener mayor jerarquía visual.

---

# 3. Demostración visual real del producto

Actualmente existe una tarjeta de ejemplo que es muy diferente a la invitación que realmente crea la aplicación.

Esta tarjeta debe eliminarse o rediseñarse por completo.

El ejemplo visual del Home debe reutilizar la misma estructura visual, componentes o datos que utiliza la vista previa real del wizard.

No crear una tarjeta decorativa independiente que represente un producto inexistente.

## Requisito principal

La invitación mostrada en el Home debe parecer una versión real y reducida de una invitación publicada.

Debe mostrar, como mínimo:

* Nombre del evento.
* Nombre del homenajeado.
* Imagen principal o fotografía.
* Fecha.
* Hora.
* Lugar.
* Mensaje.
* Botón de ubicación o confirmación, cuando corresponda.
* Estilo visual de una plantilla real.

## Reutilización recomendada

Cuando sea posible, reutilizar:

```text
InvitationPreview
InvitationTemplate
InvitationSection
```

o los componentes equivalentes existentes.

Si el componente actual de vista previa está demasiado acoplado al wizard, extraer una versión reutilizable que pueda recibir datos mediante propiedades.

Ejemplo conceptual:

```tsx
<InvitationPreview
  template={featuredTemplate}
  invitation={homeInvitationExample}
  mode="home"
/>
```

No duplicar manualmente el diseño de la invitación en el Home.

El Home, el wizard y la invitación publicada deben compartir una misma fuente visual para evitar inconsistencias futuras.

---

# 4. Vista previa interactiva

La demostración puede presentarse dentro de un marco de navegador o dispositivo, pero la invitación debe conservar su apariencia real.

El marco puede incluir:

* Barra superior discreta.
* Dominio de ejemplo.
* Contenedor con scroll visual.
* Vista móvil o escritorio.
* Sombra suave.
* Bordes redondeados.

No debe parecer una tarjeta pequeña sin relación con el producto final.

La vista previa puede tener un movimiento muy ligero de profundidad o desplazamiento, siempre que no dificulte su lectura.

---

# 5. Estructura recomendada del Home

El Home debe organizarse en secciones claras.

## Sección 1 – Hero

Debe incluir:

* Propuesta de valor.
* Breve explicación.
* Botones principales.
* Vista previa real de una invitación.
* Elementos decorativos animados discretos.

## Sección 2 – Qué puedes crear

Mostrar diferentes tipos de eventos:

* Cumpleaños.
* Bautismos.
* Bodas.
* Baby showers.
* Graduaciones.
* Aniversarios.
* Fiestas infantiles.
* Eventos especiales.

Las categorías deben utilizar datos reales del catálogo de plantillas cuando sea posible.

Cada categoría debe dirigir al listado de plantillas con su filtro correspondiente, siempre que esa funcionalidad ya exista.

## Sección 3 – Cómo funciona

Mostrar el proceso real:

1. Elige una plantilla.
2. Personaliza los detalles.
3. Revisa tu invitación.
4. Publica y comparte el enlace.

No incluir pasos o funcionalidades que la aplicación todavía no posee.

## Sección 4 – Personalización

Explicar que el usuario puede modificar:

* Nombre.
* Evento.
* Fecha.
* Hora.
* Lugar.
* Mensaje.
* Fotografías.
* Apariencia de la plantilla.

Utilizar una composición visual basada en la interfaz real del wizard.

## Sección 5 – Invitación adaptable

Mostrar que la invitación funciona en:

* Teléfono.
* Tablet.
* Computador.

Puede utilizarse una misma invitación real dentro de diferentes marcos de dispositivos.

## Sección 6 – Información para los invitados

Explicar que el invitado puede consultar fácilmente:

* Fecha.
* Hora.
* Dirección.
* Mensaje del evento.
* Fotografías.
* Acciones disponibles.
* Ubicación.
* Confirmación de asistencia, cuando esté implementada.

No anunciar funcionalidades futuras como disponibles actualmente.

Cuando una funcionalidad todavía no esté implementada, marcarla claramente como `Próximamente`.

## Sección 7 – Plantillas destacadas

Mostrar plantillas reales disponibles en `/templates`.

No usar imágenes o nombres que no existan en el catálogo actual.

Cada plantilla debe dirigir al flujo real de creación:

```text
/invitations/create?template={id}
```

## Sección 8 – CTA final

Ejemplo:

### Título

**Tu próxima invitación puede empezar aquí**

### Texto

Elige una plantilla, personaliza los detalles y comparte un enlace creado especialmente para tu evento.

### Botón

`Crear mi invitación`

El botón debe dirigir a `/templates`.

## Sección 9 – Footer

Agregar la firma del creador al final del Home.

Mostrar:

```text
Creado por Victor Javier Vivas
victorjaviervivas@gmail.com
```

El correo debe ser interactivo:

```html
<a href="mailto:victorjaviervivas@gmail.com">
  victorjaviervivas@gmail.com
</a>
```

La firma debe ser discreta, profesional y visualmente integrada con el footer.

No debe competir con las acciones principales de la página.

---

# 6. Sistema completo de animaciones

Todo el Home debe tener movimiento.

No animar únicamente el Hero o algunas tarjetas.

Deben animarse todos los elementos importantes que entren en pantalla:

* Títulos.
* Subtítulos.
* Párrafos.
* Botones.
* Tarjetas.
* Iconos.
* Imágenes.
* Vista previa de la invitación.
* Categorías.
* Pasos del proceso.
* Plantillas destacadas.
* Marcos de dispositivos.
* Llamados a la acción.
* Elementos del footer.
* Firma del creador.

Las animaciones deben ser suaves, elegantes y visibles.

La experiencia debe inspirarse en la fluidez de páginas modernas de productos, sin copiar directamente a Apple.

---

# 7. Comportamiento al hacer scroll

Cuando un elemento entra en el viewport:

1. Debe iniciar oculto o parcialmente oculto.
2. Debe aumentar progresivamente su opacidad.
3. Debe desplazarse suavemente hacia su posición final.
4. Debe completar la animación sin movimientos bruscos.
5. La animación debe durar lo suficiente para ser perceptible.

## Configuración recomendada para textos

```text
Opacidad inicial: 0
Desplazamiento inicial: 30px a 60px hacia abajo
Opacidad final: 1
Desplazamiento final: 0
Duración: 0.8s a 1.4s
Easing: ease-out
```

En el Home no es necesario que todos los textos duren más de 1.5 segundos, ya que podría hacer que la navegación se sienta lenta.

Los títulos principales pueden utilizar una duración mayor que los textos secundarios.

## Configuración recomendada para imágenes

```text
Opacidad inicial: 0
Escala inicial: 0.94 a 0.98
Desplazamiento inicial: 30px a 70px
Escala final: 1
Opacidad final: 1
Duración: 1s a 1.6s
```

---

# 8. Repetición de animaciones

Las animaciones deben poder ejecutarse nuevamente cuando un elemento sale completamente del viewport y vuelve a entrar.

Debe funcionar al bajar y al subir.

Si se utiliza Framer Motion:

```tsx
viewport={{
  once: false,
  amount: 0.25
}}
```

No utilizar globalmente:

```tsx
once: true
```

Sin embargo, evitar que los elementos parpadeen o se oculten mientras todavía están parcialmente visibles.

La repetición debe sentirse natural.

Los elementos interactivos no deben desaparecer o moverse mientras el usuario está intentando presionarlos.

---

# 9. Animación escalonada

Los elementos de una misma sección no deben aparecer todos al mismo tiempo.

Utilizar un efecto progresivo.

Ejemplo:

1. Aparece el título.
2. Aparece la descripción.
3. Aparece el primer botón.
4. Aparece el segundo botón.
5. Aparece la vista previa.

Retraso recomendado:

```text
100ms a 180ms
```

Para grupos grandes de tarjetas, evitar retrasos acumulados demasiado extensos.

Se puede limitar el retraso máximo para que la última tarjeta no tarde varios segundos en aparecer.

Ejemplo conceptual:

```ts
delay: Math.min(index * 0.12, 0.6)
```

---

# 10. Variaciones de animación

No utilizar exactamente el mismo efecto para todos los elementos.

Crear un conjunto reducido y consistente de variantes.

## Variantes sugeridas

### Fade up

Para:

* Párrafos.
* Botones.
* Textos secundarios.

### Title reveal

Para:

* Títulos principales.
* Encabezados de sección.

Puede combinar opacidad, desplazamiento y una escala mínima.

### Slide lateral

Para:

* Contenido dividido en dos columnas.
* Bloques de explicación.
* Interfaces del wizard.

Alternar entradas desde izquierda y derecha sin movimientos excesivos.

### Scale reveal

Para:

* Tarjetas.
* Vista previa.
* Dispositivos.
* Plantillas.

### Image zoom

Para:

* Fotografías.
* Imágenes decorativas.
* Capturas del producto.

### Floating element

Para:

* Decoraciones del Hero.
* Figuras abstractas.
* Elementos secundarios.

El movimiento debe ser muy lento y no afectar el contenido principal.

---

# 11. Animación especial del Hero

El Hero debe tener una secuencia inicial organizada.

Orden recomendado:

1. Aparece una etiqueta o texto introductorio.
2. Aparece el título principal.
3. Aparece la descripción.
4. Aparecen los botones.
5. Aparece la invitación de ejemplo.
6. Aparecen los elementos decorativos.

La vista previa de la invitación puede utilizar:

* Entrada con escala.
* Opacidad.
* Movimiento vertical suave.
* Ligera rotación inicial, inferior a 2 grados.
* Efecto de profundidad discreto.

No utilizar rebotes fuertes.

No utilizar animaciones infantiles.

---

# 12. Animaciones de las tarjetas

Las tarjetas de categorías, características y plantillas deben animarse al entrar en pantalla.

En escritorio pueden incluir interacciones al pasar el cursor:

* Elevación ligera.
* Escala entre `1.01` y `1.03`.
* Cambio sutil de sombra.
* Movimiento de icono.
* Transición entre `200ms` y `350ms`.

No desplazar la tarjeta de manera exagerada.

No modificar su tamaño de forma que cambie el layout.

En dispositivos táctiles, no depender del estado `hover` para comunicar información importante.

---

# 13. Animación de letras y títulos

Los títulos principales pueden animarse como bloque o por líneas.

No se recomienda animar cada letra individualmente en todos los títulos porque puede perjudicar la legibilidad y el rendimiento.

Se puede utilizar animación por palabra o por línea únicamente en:

* Título principal del Hero.
* CTA final.
* Uno o dos encabezados destacados.

Ejemplo conceptual:

```tsx
<AnimatedWords text="Crea invitaciones digitales que se sienten únicas" />
```

El texto debe seguir siendo visible para lectores de pantalla como una frase completa.

Evitar duplicar el contenido accesible.

---

# 14. Separación entre secciones

Cada sección principal debe tener una separación visual clara.

La regla compartida puede implementarse como:

```css
.home-section:not(:last-child) {
  margin-bottom: 2cm;
}
```

En móvil:

```css
@media (max-width: 768px) {
  .home-section:not(:last-child) {
    margin-bottom: 1.4cm;
  }
}
```

No utilizar simultáneamente un gran `margin-top` y `margin-bottom`.

La separación principal debe ubicarse debajo de cada sección.

También se puede utilizar `padding` interno dentro de la sección, pero no duplicar espacios hasta producir vacíos excesivos.

Cada sección debe conservar su propio fondo.

El espacio de separación no debe ser cubierto accidentalmente por el fondo de la sección siguiente.

---

# 15. Fondos y profundidad visual

Alternar de manera controlada:

* Fondo blanco.
* Fondo gris muy claro.
* Gradientes discretos.
* Fondos oscuros para secciones destacadas.
* Formas decorativas suaves.
* Imágenes de fondo cuando tengan una función real.

No utilizar un fondo distinto en todas las secciones sin una lógica visual.

Las transiciones entre fondos deben sentirse fluidas.

Se pueden utilizar elementos con efecto de profundidad:

* Círculos desenfocados.
* Gradientes radiales.
* Brillos suaves.
* Formas flotantes.
* Capas de imágenes.

No saturar la página.

---

# 16. Componentes reutilizables

No colocar todas las animaciones dentro de `HomePage.tsx`.

Crear una estructura reutilizable.

Ejemplo:

```text
components/
  animation/
    AnimatedSection.tsx
    AnimatedText.tsx
    AnimatedTitle.tsx
    AnimatedImage.tsx
    AnimatedCard.tsx
    AnimatedGroup.tsx
    animationVariants.ts

  home/
    HomeHero.tsx
    RealInvitationDemo.tsx
    EventCategories.tsx
    HowItWorks.tsx
    PersonalizationSection.tsx
    ResponsiveInvitationSection.tsx
    FeaturedTemplates.tsx
    FinalCta.tsx
    HomeFooter.tsx
```

Los nombres pueden adaptarse a la arquitectura actual del proyecto.

No crear componentes innecesariamente pequeños si no serán reutilizados.

---

# 17. API recomendada para componentes animados

Ejemplo conceptual:

```tsx
interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  amount?: number;
  stagger?: number;
  direction?: "up" | "down" | "left" | "right";
}
```

Uso esperado:

```tsx
<AnimatedSection
  className="home-section"
  amount={0.25}
  stagger={0.14}
  direction="up"
>
  <AnimatedTitle>
    Crea una invitación especial
  </AnimatedTitle>

  <AnimatedText>
    Personaliza los detalles y comparte tu enlace.
  </AnimatedText>
</AnimatedSection>
```

Centralizar las variantes para mantener consistencia.

No definir valores de animación diferentes de forma arbitraria en cada archivo.

---

# 18. Tecnología

Se puede utilizar:

* Framer Motion.
* Motion.
* IntersectionObserver.
* Una solución equivalente compatible con la arquitectura existente.

Antes de agregar una dependencia nueva, verificar si el proyecto ya utiliza una biblioteca de animaciones.

Si ya existe Framer Motion o Motion, reutilizarla.

No añadir dos bibliotecas distintas para resolver el mismo problema.

---

# 19. Accesibilidad

Respetar:

```css
@media (prefers-reduced-motion: reduce)
```

Cuando el usuario tenga activada la reducción de movimiento:

* Eliminar desplazamientos grandes.
* Eliminar efectos flotantes continuos.
* Reducir la duración.
* Mantener el contenido visible.
* Usar únicamente una transición corta de opacidad o ninguna animación.

Las animaciones no deben:

* Cambiar el orden del contenido.
* Impedir la navegación por teclado.
* Ocultar permanentemente información.
* Duplicar textos para lectores de pantalla.
* Mover botones mientras tienen el foco.
* Provocar pérdida de contexto.

---

# 20. Rendimiento

Priorizar:

* `transform`.
* `opacity`.

Evitar animar continuamente:

* `width`.
* `height`.
* `top`.
* `left`.
* Filtros muy pesados.
* Sombras complejas en muchos elementos.
* Grandes imágenes sin optimizar.

Las imágenes deben:

* Tener dimensiones reservadas.
* Utilizar `loading="lazy"` fuera del Hero.
* Usar formatos optimizados.
* Evitar cambios bruscos de layout.
* Mantener una buena calidad visual.

No animar cientos de nodos individualmente.

Agrupar elementos cuando sea conveniente.

---

# 21. Diseño responsive

El Home debe funcionar correctamente en:

* Móviles pequeños.
* Móviles grandes.
* Tablets.
* Laptops.
* Monitores amplios.

En móvil:

* El Hero debe apilar el texto y la demostración.
* La vista previa debe caber sin desbordamiento.
* Las tarjetas deben mantener suficiente separación.
* Los títulos no deben cortarse.
* Las animaciones laterales deben tener desplazamientos menores.
* No debe existir scroll horizontal.
* Los botones principales deben ser fáciles de presionar.

---

# 22. Contenido real y honestidad del producto

Todo texto del Home debe corresponder a una funcionalidad real.

Antes de finalizar, revisar el código actual para determinar:

* Qué funcionalidades están terminadas.
* Qué funcionalidades son parciales.
* Qué funcionalidades están planificadas.
* Qué acciones todavía no funcionan.

Las funcionalidades futuras deben utilizar una etiqueta visible:

```text
Próximamente
```

No presentar como disponible:

* Confirmación de asistencia.
* Mapas.
* Publicación.
* Envío por WhatsApp.
* Galería.
* Música.
* Cuenta regresiva.
* Gestión de invitados.

salvo que realmente estén implementadas y funcionando.

---

# 23. Integración con el sistema de feedback

Los botones y formularios del Home deben utilizar el sistema global de feedback definido en la tarea anterior.

No utilizar:

```ts
alert()
confirm()
prompt()
```

Cuando una acción todavía no esté disponible, utilizar una notificación discreta o un estado `Próximamente`.

No abrir un modal innecesario para enlaces de navegación normales.

---

# 24. Pruebas necesarias

Agregar o actualizar pruebas para verificar:

* El Hero muestra correctamente la propuesta de valor.
* Los botones principales dirigen a `/templates`.
* Las plantillas destacadas utilizan IDs reales.
* La tarjeta de ejemplo anterior ya no aparece.
* La demostración utiliza datos compatibles con la invitación real.
* La firma de Victor Javier Vivas aparece en el footer.
* El correo utiliza `mailto:`.
* No existe desbordamiento horizontal.
* Los componentes animados respetan reducción de movimiento.
* El contenido sigue visible cuando las animaciones están deshabilitadas.
* No existen rutas rotas.
* Las categorías usan información válida.
* Las funcionalidades futuras muestran `Próximamente`.

---

# 25. Criterios de aceptación

La tarea se considera completada cuando:

1. El Home explica claramente que la aplicación crea invitaciones web compartibles por URL.
2. La página deja de parecer un creador de tarjetas estáticas.
3. La demostración visual se parece al resultado real de una invitación.
4. La vista previa reutiliza componentes o estructuras del producto real.
5. La antigua tarjeta de ejemplo incorrecta fue eliminada.
6. Todo el Home contiene animaciones visibles y coherentes.
7. Los textos, imágenes, tarjetas, botones e iconos se animan al entrar en pantalla.
8. Las animaciones se repiten al salir y volver a entrar al viewport.
9. Los grupos utilizan animación escalonada.
10. Las animaciones son suaves y no exageradas.
11. Se respeta `prefers-reduced-motion`.
12. Las animaciones no afectan la lectura ni la interacción.
13. Existe separación clara entre secciones.
14. La separación principal se aplica debajo de cada sección.
15. El Home representa únicamente funcionalidades reales.
16. Las funcionalidades futuras se identifican como `Próximamente`.
17. Las plantillas destacadas provienen del catálogo real.
18. Todos los CTA dirigen a rutas válidas.
19. El Home funciona correctamente en móvil y escritorio.
20. No existe scroll horizontal.
21. El footer muestra:

```text
Creado por Victor Javier Vivas
victorjaviervivas@gmail.com
```

22. El correo abre mediante `mailto:`.
23. No se introdujo lógica duplicada innecesariamente.
24. TypeScript finaliza sin errores.
25. Lint finaliza sin errores.
26. Las pruebas finalizan correctamente.
27. El build de producción finaliza correctamente.

---

# 26. Revisión previa obligatoria

Antes de modificar el Home:

1. Revisar todos los componentes actuales.
2. Identificar qué partes ya son reutilizables.
3. Revisar el catálogo real de plantillas.
4. Revisar la vista previa del wizard.
5. Revisar la invitación publicada, si ya existe.
6. Verificar las rutas actuales.
7. Determinar qué funcionalidades están realmente disponibles.
8. Mantener los elementos del diseño actual que ya tengan buena calidad.

No realizar una sustitución ciega del Home.

El objetivo es mejorar el diseño actual, corregir la comunicación del producto y convertirlo en una experiencia animada y coherente con la invitación que el usuario realmente puede crear.
