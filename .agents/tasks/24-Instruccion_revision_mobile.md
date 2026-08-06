# Revisión de comportamiento en dispositivos móviles

## Objetivo

Revisar el comportamiento de la aplicación en dispositivos móviles
porque actualmente no se ve ni se comporta igual que en escritorio.

## 1. Identificar la librería de animaciones

Antes de realizar cambios, identifica qué sistema de animaciones utiliza
el proyecto.

Revisar:

-   `package.json`
-   Imports de los componentes
-   Dependencias instaladas

Determinar si utiliza alguna de las siguientes tecnologías:

-   Framer Motion
-   GSAP
-   AOS
-   Animaciones CSS
-   Otra librería

No asumir cuál se utiliza; verificarlo en el código.

------------------------------------------------------------------------

## 2. Problema: Zoom al hacer scroll

Investigar por qué la aplicación parece hacer zoom o escalarse en
dispositivos móviles.

Revisar:

-   Configuración de `meta viewport`.
-   Propiedades `touch-action`.
-   Gestos táctiles.
-   Elementos que produzcan desbordamiento horizontal.
-   Transformaciones (`scale`) asociadas al scroll.
-   Inputs con `font-size` menor a 16px (Safari puede hacer zoom
    automáticamente).

No bloquear el zoom como solución rápida sin identificar primero la
causa.

------------------------------------------------------------------------

## 3. Problema: Animaciones diferentes a escritorio

Las animaciones no se ejecutan igual que en la versión desktop.

Verificar:

-   Animaciones dependientes de `hover`.
-   `IntersectionObserver`.
-   `whileInView`.
-   `prefers-reduced-motion`.
-   Contenedores con `overflow`.
-   Diferencias entre Safari móvil y Chrome móvil.

Corregir cualquier diferencia para mantener un comportamiento
consistente.

------------------------------------------------------------------------

## 4. Problema: Animación extraña del texto

Investigar por qué el texto presenta movimientos o cambios visuales
inesperados.

Revisar:

-   Carga de fuentes.
-   Cambios de `font-size`.
-   Cambios de `font-weight`.
-   Cambios de `letter-spacing`.
-   Cambios de `line-height`.
-   Ajuste automático del texto en Safari.
-   Transformaciones aplicadas directamente al texto.

Cuando corresponda, reemplazar este tipo de animaciones por animaciones
basadas en:

-   `opacity`
-   `transform`

------------------------------------------------------------------------

## 5. Pruebas

Validar el comportamiento en:

-   iPhone (Safari)
-   Android (Chrome)

Realizar pruebas en dispositivos reales, no únicamente utilizando el
modo responsive del navegador.

------------------------------------------------------------------------

## 6. Entregables

Al finalizar entregar un informe indicando:

-   Librería de animaciones utilizada.
-   Causa encontrada para cada problema.
-   Archivos modificados.
-   Cambios realizados.
-   Diferencias restantes entre escritorio y móvil.
-   Evidencia de las pruebas realizadas.
