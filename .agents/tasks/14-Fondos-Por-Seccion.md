# Mejora de personalización de fondos por sección

## Contexto

La aplicación ya permite personalizar la portada y la sección final con
una imagen de fondo. Sin embargo, todas las secciones intermedias
utilizan un fondo blanco fijo.

Quiero eliminar esa limitación para que cada sección pueda
personalizarse de forma independiente.

## Objetivo

Cada sección de la invitación debe permitir configurar su propio fondo
sin afectar a las demás.
Repara la ui/ux que se rompio 
Las opciones de fondo deben ser:

-   Color sólido.
-   Degradado (Gradient).
-   Imagen de fondo.

El fondo blanco solo debe quedar como una opción más, no como una
obligación.

## Secciones

- Información básica
- Homenaje
- Fecha
- Lugar
- Mensaje
- Resumen.

Cada una debe tener su propia configuración.

## Fondo degradado

Permitir configurar: - Color inicial. - Color final. - Color intermedio
(opcional). - Dirección (vertical, horizontal, diagonal y radial).

## Fondo con imagen

Permitir: - Cargar imagen propia. - Seleccionar imágenes temáticas. -
Configurar posición. - Elegir cover o contain. - Agregar overlay y
controlar su opacidad.

## Requisitos de arquitectura

No crear lógica específica para Avatar, Mickey, Frozen u otras
temáticas.

Las temáticas deben ser simplemente imágenes seleccionadas por el
usuario.

Crear un componente reutilizable para editar el fondo de cualquier
sección y otro componente para aplicar dicho fondo.

## Vista previa

La vista previa debe actualizarse en tiempo real cuando cambie: -
Fondo. - Degradado. - Imagen. - Overlay. - Color del texto.

## Legibilidad

Mantener un buen contraste entre fondo y contenido. Permitir cambiar el
color del texto. El formulario RSVP puede mantenerse dentro de una
tarjeta clara o semitransparente para mejorar la lectura.

## Compatibilidad

-   No romper las invitaciones existentes.
-   Mantener responsive móvil y escritorio.
-   Reutilizar la lógica existente de portada y sección final.

## Validaciones finales

-   Ejecutar ESLint.
-   Ejecutar TypeScript.
-   Ejecutar tests.
-   Ejecutar build.

Entregar un resumen con: - Nueva arquitectura. - Componentes creados. -
Archivos modificados. - Justificación técnica.

Antes de implementar, analizar cómo funcionan actualmente la portada y
la sección final y reutilizar esa solución para construir un sistema
genérico aplicable a todas las secciones.
