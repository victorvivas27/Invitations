Revisa y refactoriza la estructura completa del frontend del proyecto.

Objetivo principal: mejorar la organización, legibilidad y mantenibilidad del código sin cambiar el comportamiento visual ni funcional de la aplicación.

Realiza los siguientes cambios:

1. Formatea todo el código

* Aplica indentación consistente.
* Corrige espacios, saltos de línea y llaves.
* Ordena imports.
* Elimina imports no utilizados.
* Divide líneas excesivamente largas.
* Usa Prettier como formato principal.
* Ejecuta ESLint y corrige los errores encontrados.

2. Separa componentes demasiado grandes

* Identifica archivos React o TSX con demasiadas responsabilidades.
* Divide cada pantalla en componentes pequeños y reutilizables.
* Evita componentes de cientos de líneas.
* Cada componente debe tener una responsabilidad clara.
* No dupliques código.

3. Organiza el proyecto por módulos o funcionalidades
   No dejes todos los componentes y estilos mezclados en carpetas generales.

Usa una estructura similar a esta:

src/
modules/
home/
components/
styles/
hooks/
types/
HomePage.tsx
index.ts

```
templates/
  components/
  styles/
  hooks/
  types/
  TemplatesPage.tsx
  index.ts

invitations/
  components/
  styles/
  hooks/
  types/
  InvitationWizard.tsx
  InvitationPreview.tsx
  CreateInvitationPage.tsx
  index.ts
```

shared/
components/
hooks/
styles/
types/
utils/

4. Coloca los estilos junto a cada módulo o componente

* Cada módulo debe tener sus propios estilos.
* No acumules todos los CSS en una sola carpeta global.
* Los estilos específicos de un componente deben vivir cerca de ese componente.

Ejemplos:

InvitationWizard.tsx
InvitationWizard.module.css

TemplateCard.tsx
TemplateCard.module.css

HomeHero.tsx
HomeHero.module.css

* Usa CSS Modules para evitar conflictos de nombres.
* Conserva únicamente estilos globales realmente globales, como variables, reset, tipografía y estilos base.
* No uses estilos inline salvo que sean valores dinámicos necesarios.

5. Mantén separados los estilos globales
   La carpeta global de estilos debe contener únicamente archivos como:

src/styles/
globals.css
variables.css
reset.css
typography.css

No coloques estilos específicos de páginas o componentes dentro de esta carpeta.

6. Extrae lógica fuera de los componentes

* Mueve lógica reutilizable a hooks.
* Mueve tipos e interfaces a archivos de tipos.
* Mueve constantes y datos estáticos a archivos separados.
* Mueve funciones auxiliares a utils.
* Evita declarar grandes cantidades de datos dentro de los componentes.

7. Usa nombres claros

* Los archivos, componentes, funciones y variables deben indicar claramente su responsabilidad.
* Evita nombres como Component1, styles2, dataTemp o helper.
* Usa nombres descriptivos y consistentes.

8. No rompas la aplicación

* Mantén todas las rutas actuales.
* Conserva el diseño responsive.
* No cambies el comportamiento móvil ni de escritorio.
* No cambies el aspecto visual sin necesidad.
* No agregues dependencias nuevas sin justificarlo.
* Realiza los cambios de manera incremental.

9. Verificación obligatoria
   Al finalizar ejecuta:

* Prettier
* ESLint
* TypeScript
* Tests
* Build de producción

Corrige cualquier error generado por la refactorización.

10. Entrega final
    Al terminar, muestra:

* La nueva estructura de carpetas.
* Los componentes que fueron divididos.
* Los estilos que fueron movidos.
* Los archivos eliminados o renombrados.
* Los comandos de validación ejecutados.
* Cualquier cambio que pueda afectar futuras tareas.

Antes de modificar archivos, analiza el proyecto completo y presenta un plan breve de refactorización. Después implementa el plan sin cambiar la funcionalidad existente.
