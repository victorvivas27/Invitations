# Tarea: Mejorar carga inicial y eliminar flashes visuales

## Objetivo

Mejorar la experiencia de carga inicial del frontend de **Mi Invitación**, eliminando o reduciendo al máximo:

* Flash blanco o negro al iniciar.
* Destellos durante la inicialización de React.
* Cambios bruscos entre el loader y la aplicación.
* Saltos visuales mientras se resuelve la autenticación.
* Aparición momentánea de una ruta incorrecta antes de mostrar la definitiva.
* Cambios bruscos de fondo.
* Layout shifts durante el arranque.
* Problemas visuales en dispositivos móviles, especialmente iPhone/Safari.

La transición esperada debe sentirse como una aplicación profesional:

```text
Loader inicial
      ↓
React carga detrás
      ↓
Se inicializa la aplicación
      ↓
Se resuelve autenticación/sesión
      ↓
Se determina la ruta correcta
      ↓
La pantalla final está preparada
      ↓
Fade suave del loader
      ↓
Aplicación visible
```

No debería existir una secuencia como:

```text
Loader
→ pantalla vacía
→ login
→ flash
→ comprobación de sesión
→ dashboard
```

---

# 1. IMPORTANTE: analizar el proyecto antes de modificar

Antes de realizar cambios:

1. Revisar el `index.html` actual.
2. Revisar `src/main.tsx`.
3. Revisar `App.tsx`.
4. Revisar cómo funciona actualmente el sistema de autenticación.
5. Identificar el AuthProvider/AuthContext/hook equivalente.
6. Revisar cómo se determina si la sesión ya fue inicializada.
7. Revisar el router y las rutas protegidas.
8. Revisar los estilos globales.
9. Revisar si existen loaders adicionales durante el inicio.
10. Revisar si React está mostrando temporalmente `/login`, `/templates`, `/my-invitations` u otra ruta antes de conocer el estado real de autenticación.

NO asumir nombres de hooks, providers, componentes o variables.

Adaptar la implementación a la arquitectura real existente.

---

# 2. Problema principal del loader actual

Actualmente el loader inicial está dentro de:

```html
<div id="root">
  <!-- loader -->
</div>
```

Esto provoca que React destruya/reemplace el contenido inicial de `#root` cuando ejecuta:

```tsx
createRoot(...).render(...)
```

Esto puede producir un cambio visual brusco entre el HTML inicial y React.

Modificar la arquitectura para que sea:

```html
<body>

  <div id="boot-loader">
    <!-- loader -->
  </div>

  <div id="root"></div>

  <script type="module" src="/src/main.tsx"></script>

</body>
```

El loader debe quedar completamente FUERA de `#root`.

React debe montar exclusivamente dentro de:

```html
<div id="root"></div>
```

De esta manera React podrá inicializar la aplicación detrás del loader.

---

# 3. Mantener metadata existente

NO eliminar ni romper:

* Open Graph.
* Twitter metadata.
* favicon.
* apple-touch-icon.
* manifest.
* theme-color.
* configuración PWA existente.

Mantener como mínimo la metadata actual.

Si existe lógica especial relacionada con metadata dinámica de invitaciones compartidas, NO modificarla como parte de esta tarea salvo que sea estrictamente necesario.

Esta tarea está enfocada en la experiencia visual de carga.

---

# 4. Preload del logo

Agregar en `<head>`:

```html
<link
  rel="preload"
  href="/images/icon-invitacion.png"
  as="image"
  fetchpriority="high"
/>
```

El objetivo es evitar:

```text
fondo
↓
contenedor
↓
logo aparece después
```

El logo principal del loader debe estar disponible lo antes posible.

---

# 5. Viewport para iPhone

Usar:

```html
<meta
  name="viewport"
  content="width=device-width, initial-scale=1.0, viewport-fit=cover"
/>
```

Utilizar safe areas cuando corresponda:

```css
env(safe-area-inset-top)
env(safe-area-inset-right)
env(safe-area-inset-bottom)
env(safe-area-inset-left)
```

El loader debe verse correctamente en:

* Desktop.
* Android.
* iPhone.
* Safari móvil.
* Dispositivos con notch.
* Dispositivos con Dynamic Island.

---

# 6. Fondo consistente

Utilizar el mismo color base durante todo el arranque:

```css
#050b16
```

Aplicarlo al menos en:

```css
:root
html
body
#root
.boot-loader
```

Ejemplo:

```css
:root {
  color-scheme: dark;
  background: #050b16;
}

html,
body,
#root {
  margin: 0;
  min-height: 100%;
  background: #050b16;
}

body {
  min-height: 100vh;
  min-height: 100dvh;
}

#root {
  min-height: 100vh;
  min-height: 100dvh;
}
```

El objetivo es impedir que el navegador tenga oportunidad de mostrar un frame blanco o un color diferente durante la inicialización.

---

# 7. Loader inicial

Mantener el concepto visual actual de **Mi Invitación**:

* Fondo azul oscuro.
* Rojo como accent.
* Azul secundario.
* Icono del sobre.
* Texto "Mi Invitación".
* Texto "Preparando algo especial".
* Indicador de progreso.

Pero mejorar su implementación para que sea visualmente estable y eficiente.

La estructura recomendada es:

```html
<div
  id="boot-loader"
  class="boot-loader"
  role="status"
  aria-live="polite"
  aria-busy="true"
  aria-label="Cargando Mi Invitación"
>
  <div class="boot-loader__ambient" aria-hidden="true">
    <span class="boot-loader__orb boot-loader__orb--one"></span>
    <span class="boot-loader__orb boot-loader__orb--two"></span>
  </div>

  <div class="boot-loader__content">

    <div class="boot-loader__mark" aria-hidden="true">
      <img
        class="boot-loader__envelope"
        src="/images/icon-invitacion.png"
        alt=""
        decoding="async"
        fetchpriority="high"
      />
    </div>

    <p class="boot-loader__title">
      Mi Invitación
    </p>

    <p class="boot-loader__status">
      Preparando algo especial
    </p>

    <div
      class="boot-loader__progress"
      aria-hidden="true"
    ></div>

  </div>
</div>

<div id="root"></div>
```

Se puede adaptar la implementación siempre que se conserve el objetivo.

---

# 8. Transición de salida

NO eliminar el loader abruptamente.

Implementar una clase:

```css
.boot-loader--hidden {
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
}
```

Y una transición aproximada de:

```css
.boot-loader {
  opacity: 1;
  visibility: visible;

  transition:
    opacity 280ms ease,
    visibility 280ms ease;
}
```

El tiempo puede ajustarse ligeramente si mejora la experiencia.

No utilizar una transición excesivamente lenta.

El resultado debe sentirse rápido pero suave.

---

# 9. Crear utilidad para eliminar el loader

Crear una utilidad equivalente a:

```text
src/utils/bootLoader.ts
```

Adaptar la ubicación a la estructura existente si existe un lugar mejor.

Implementación de referencia:

```ts
let removed = false;

export function hideBootLoader(): void {
  if (removed) return;

  const loader = document.getElementById('boot-loader');

  if (!loader) {
    removed = true;
    return;
  }

  loader.classList.add('boot-loader--hidden');
  loader.setAttribute('aria-busy', 'false');

  const removeLoader = () => {
    if (removed) return;

    removed = true;
    loader.remove();
  };

  loader.addEventListener(
    'transitionend',
    removeLoader,
    { once: true },
  );

  window.setTimeout(removeLoader, 600);
}
```

Debe existir fallback mediante timeout por si `transitionend` no se dispara.

La función debe ser idempotente:

```ts
hideBootLoader();
hideBootLoader();
hideBootLoader();
```

no debe provocar errores.

---

# 10. NO esconder el loader demasiado temprano

Este punto es MUY IMPORTANTE.

NO hacer simplemente:

```tsx
useEffect(() => {
  hideBootLoader();
}, []);
```

si la aplicación todavía está:

* restaurando sesión;
* leyendo token;
* validando autenticación;
* consultando `/me`;
* determinando permisos;
* resolviendo una ruta protegida;
* esperando información necesaria para decidir qué pantalla mostrar.

Primero identificar cómo funciona realmente el sistema de autenticación existente.

El loader debe desaparecer cuando la aplicación conozca el estado inicial necesario para mostrar la pantalla correcta.

Conceptualmente:

```tsx
const { initialized } = useAuth();

useEffect(() => {
  if (!initialized) {
    return;
  }

  requestAnimationFrame(() => {
    hideBootLoader();
  });
}, [initialized]);
```

IMPORTANTE:

`initialized` es solamente un ejemplo.

NO crear una segunda arquitectura de autenticación si ya existe una.

Usar el estado real existente en el proyecto.

Podría llamarse:

```text
initialized
isInitialized
loading
isLoading
authReady
sessionReady
hydrated
isCheckingSession
```

o tener otra implementación.

Analizar el código primero.

---

# 11. Evitar flash de rutas protegidas

Revisar especialmente este escenario:

```text
Usuario entra
↓
React inicia
↓
Router muestra Login
↓
Auth recupera sesión
↓
Router descubre que está autenticado
↓
Dashboard
```

Eso genera un flash visual.

La lógica correcta debería ser:

```text
Usuario entra
↓
Boot loader sigue visible
↓
Auth recupera sesión
↓
Router conoce estado real
↓
Pantalla correcta preparada
↓
Boot loader desaparece
```

Mientras el estado de autenticación inicial sea desconocido, NO renderizar una pantalla incorrecta debajo si eso puede producir flashes.

---

# 12. Evitar loaders duplicados

Revisar si actualmente existe algo similar a:

```tsx
if (loading) {
  return <LoadingScreen />;
}
```

en:

* App.
* AuthProvider.
* ProtectedRoute.
* Layout.
* Router.

No queremos:

```text
Boot loader
↓
React loader
↓
otro spinner
↓
pantalla
```

Durante el arranque inicial debe existir una transición coherente.

Los loaders internos pueden seguir utilizándose posteriormente para operaciones normales, pero evitar duplicarlos durante el bootstrap inicial.

---

# 13. Rendimiento de animaciones

Priorizar animaciones utilizando:

```css
transform
opacity
```

Evitar animar constantemente propiedades que produzcan layout/reflow como:

```css
width
height
top
left
margin
padding
```

cuando no sea necesario.

Usar `will-change` solamente donde aporte valor.

No abusar de blur, filtros o sombras extremadamente pesadas en dispositivos móviles.

El loader debe mantener aproximadamente 60 FPS en dispositivos razonables.

---

# 14. prefers-reduced-motion

Agregar soporte correcto:

```css
@media (prefers-reduced-motion: reduce) {
  .boot-loader__mark,
  .boot-loader__mark::before,
  .boot-loader__mark::after,
  .boot-loader__progress::after,
  .boot-loader__orb {
    animation: none !important;
  }

  .boot-loader {
    transition-duration: 100ms;
  }
}
```

No utilizar simplemente animaciones más lentas.

Si el usuario solicita reducción de movimiento, reducir/eliminar las animaciones.

---

# 15. No introducir delays artificiales

NO implementar:

```ts
setTimeout(() => {
  hideLoader();
}, 2000);
```

solamente para que el loader permanezca visible.

El loader debe representar inicialización real.

Si la aplicación está lista rápidamente, debe desaparecer rápidamente.

El único timeout aceptable es el pequeño fallback utilizado para remover el elemento después del fade.

---

# 16. Evitar parpadeo cuando la aplicación carga extremadamente rápido

Revisar el comportamiento en conexiones rápidas.

No debe ocurrir:

```text
loader aparece durante 20ms
↓
desaparece
```

si eso produce más sensación de flash que no mostrarlo.

Si técnicamente corresponde, se puede implementar una estrategia simple para evitar flicker, pero NO agregar delays largos artificiales.

Priorizar estabilidad visual.

---

# 17. CSS válido

Asegurarse de que el código final tenga CSS válido.

Las animaciones deben declararse:

```css
@keyframes boot-float
```

NO:

```css
@keyframes *boot-float*
```

Las clases deben escribirse:

```css
.boot-loader__content
```

NO:

```css
.boot-loader\_\_content
```

Los comentarios HTML deben ser:

```html
<!-- comentario -->
```

Los caracteres escapados que aparecieron al copiar código por chat NO deben terminar en el archivo real.

---

# 18. No romper navegación

Verificar especialmente:

```text
/templates
/my-invitations
/login
/register
/i/:slug
```

y cualquier otra ruta existente.

El cambio del loader inicial NO debe provocar que vuelva a mostrarse en cada navegación interna.

El `boot-loader` es exclusivamente para el bootstrap inicial del documento.

Al navegar con React Router:

```text
/templates
→ /my-invitations
```

NO debe reaparecer el boot loader.

---

# 19. Invitaciones públicas

Prestar especial atención a:

```text
/i/:slug
```

Las invitaciones públicas deben seguir funcionando correctamente.

No introducir una dependencia innecesaria del sistema de autenticación para determinar que una invitación pública está lista.

Si las rutas públicas y privadas tienen diferentes procesos de inicialización, manejar correctamente ambos casos.

---

# 20. Open Graph / bots

El cambio visual NO debe interferir con la implementación existente de metadata dinámica para:

* WhatsApp.
* Facebook.
* Telegram.
* Discord.
* LinkedIn.
* Twitter/X.

No modificar las rewrites ni endpoints de metadata salvo que sea estrictamente necesario.

---

# 21. Revisar fuentes

Si la aplicación utiliza fuentes web externas, revisar si producen FOIT/FOUT o cambios de tamaño importantes.

Evitar:

```text
fuente fallback
↓
fuente real
↓
texto cambia de tamaño
↓
layout se mueve
```

Si existe este problema, optimizar la carga de fuentes sin bloquear innecesariamente la aplicación.

No agregar dependencias solamente para esto.

---

# 22. Imágenes principales

Si la pantalla inicial después del loader contiene imágenes críticas, revisar si están causando layout shift.

Cuando sea posible utilizar:

```html
width
height
```

o:

```css
aspect-ratio
```

para reservar el espacio antes de que cargue la imagen.

No permitir que la página cambie de altura bruscamente cuando aparecen imágenes.

---

# 23. No agregar dependencias innecesarias

NO instalar librerías para resolver este problema salvo que exista una razón técnica fuerte.

No necesitamos:

* nueva librería de loaders;
* nueva librería de animaciones;
* nuevo state manager;
* nueva librería de routing.

Resolverlo utilizando la arquitectura existente, React, TypeScript y CSS.

---

# 24. Resultado visual esperado

La experiencia final debe ser:

```text
┌───────────────────────────────┐
│                               │
│             LOGO              │
│                               │
│        Mi Invitación          │
│                               │
│   PREPARANDO ALGO ESPECIAL    │
│                               │
│          ━━━━━━━              │
│                               │
└───────────────────────────────┘
               ↓
       aplicación preparada
               ↓
          fade 280-320ms
               ↓
┌───────────────────────────────┐
│                               │
│      PANTALLA CORRECTA        │
│                               │
└───────────────────────────────┘
```

Sin pantalla intermedia visible.

---

# 25. Criterios de aceptación

Antes de considerar terminada la tarea, verificar:

* [ ] El boot loader está fuera de `#root`.
* [ ] React monta solamente dentro de `#root`.
* [ ] No existe flash blanco inicial.
* [ ] No existe cambio brusco de fondo.
* [ ] El loader desaparece mediante fade.
* [ ] No se elimina antes de resolver el estado inicial necesario.
* [ ] No aparece momentáneamente `/login` si el usuario ya tiene sesión.
* [ ] No aparece momentáneamente una ruta privada incorrecta.
* [ ] No existen loaders iniciales duplicados.
* [ ] El loader no reaparece al navegar internamente.
* [ ] `/i/:slug` continúa funcionando.
* [ ] `/templates` continúa funcionando.
* [ ] `/my-invitations` continúa funcionando.
* [ ] Login y Register continúan funcionando.
* [ ] Funciona correctamente en desktop.
* [ ] Funciona correctamente en viewport móvil.
* [ ] Funciona correctamente en Safari/iPhone.
* [ ] Respeta safe areas.
* [ ] Respeta `prefers-reduced-motion`.
* [ ] No se agregaron delays largos artificiales.
* [ ] No se agregaron dependencias innecesarias.
* [ ] No se rompió Open Graph.
* [ ] No se rompió metadata dinámica.
* [ ] No se rompió PWA/manifest/favicon.
* [ ] TypeScript compila correctamente.
* [ ] El build de producción finaliza correctamente.
* [ ] No existen errores nuevos en consola.

---

# 26. Validación final obligatoria

Después de implementar los cambios:

1. Ejecutar lint si el proyecto lo tiene configurado.
2. Ejecutar TypeScript check si existe.
3. Ejecutar tests relacionados si existen.
4. Ejecutar build de producción.
5. Corregir cualquier error causado por esta implementación.

Ejemplo:

```bash
npm run build
```

Utilizar los comandos reales definidos en `package.json`.

NO modificar tests simplemente para hacerlos pasar si revelan un problema real.

---

# 27. Entrega final

Al terminar, informar:

## Archivos modificados

Enumerar los archivos realmente modificados.

## Cambios realizados

Explicar brevemente:

* cómo funciona ahora el boot loader;
* cuándo se elimina;
* cómo se integra con autenticación;
* qué se hizo para evitar flashes;
* qué optimizaciones móviles se realizaron.

## Validaciones

Indicar qué comandos fueron ejecutados y su resultado.

## Problemas encontrados

Si durante la revisión se descubre que alguno de los destellos NO proviene del `index.html` sino de:

* AuthProvider;
* React Router;
* ProtectedRoute;
* carga de CSS;
* fuentes;
* imágenes;
* layouts;
* fetching;
* Suspense;

corregir la causa raíz si está dentro del alcance y documentarla.

---

# REGLA PRINCIPAL

No limitarse a reemplazar el `index.html` ciegamente.

Primero analizar el flujo real de inicialización del frontend.

La prioridad es conseguir:

**HTML inicial → React preparado → pantalla correcta**

con una única transición visual suave y sin flashes perceptibles.
