# Tarea 11 — Asistente de creación de invitaciones (Wizard)

**Guardar en:** `docs/tasks/task-11-invitation-creation-wizard.md`

---

# Objetivo

Implementar el primer asistente de creación de invitaciones.

La aplicación **no genera un PDF** ni una imagen estática.

Cada invitación será una **página web pública** que posteriormente podrá compartirse mediante una URL única.

En esta tarea comenzará el proceso de construcción de esa página.

El usuario irá completando la información paso a paso mediante un Wizard.

No implementar todavía persistencia.

No implementar backend.

No crear endpoints.

No crear ningún commit.

---

# Concepto del producto

Una plantilla representa únicamente el diseño.

Una invitación representa el contenido.

Ejemplo:

```text
Plantilla:
Modern Birthday

↓

Invitación creada:

Cumpleaños de Sofía

↓

URL pública

https://app/i/cumple-sofia
```

La invitación será posteriormente una página completa.

No un PDF.

No una imagen.

---

# Flujo

```text
Home

↓

Plantillas

↓

Seleccionar plantilla

↓

Wizard

↓

Vista previa

↓

Guardar (próxima tarea)

↓

URL pública (próxima tarea)
```

---

# Ruta

Crear:

```text
/invitations/create
```

Debe recibir:

```text
template
```

por query string.

Ejemplo:

```text
/invitations/create?template=birthday-modern
```

---

# Si no existe template

Mostrar:

```text
La plantilla seleccionada no existe.
```

Botón:

```text
Volver a plantillas
```

---

# Wizard

Crear un asistente de varios pasos.

No utilizar un formulario enorme.

Los pasos deben mostrarse visualmente.

Ejemplo:

```text
Paso 1 de 6
```

---

# Pasos

## Paso 1

Información básica

Campos:

* tipo de evento
* nombre del evento

Ejemplo:

```text
Cumpleaños

Cumpleaños de Sofía
```

---

## Paso 2

Persona homenajeada

Campos:

* nombre
* edad (opcional)

Ejemplo:

```text
Sofía

5 años
```

---

## Paso 3

Fecha

Campos:

* fecha
* hora

---

## Paso 4

Lugar

Campos:

* nombre del lugar
* dirección

No integrar mapas todavía.

---

## Paso 5

Mensaje

Campo grande:

```text
Te esperamos para compartir un día muy especial...
```

---

## Paso 6

Resumen

Mostrar toda la información.

No guardar todavía.

---

# Barra de progreso

Mostrar:

```text
●────○────○────○────○────○
```

o un Stepper equivalente.

El usuario debe saber siempre en qué paso está.

---

# Navegación

Botones:

```text
Anterior

Siguiente
```

En el último paso:

```text
Finalizar próximamente
```

Debe permanecer deshabilitado.

---

# Validaciones

Cada paso debe validar únicamente sus campos.

No permitir avanzar si existen errores.

---

# Estado

Toda la información debe mantenerse en memoria.

No guardar todavía.

No utilizar LocalStorage.

No llamar al backend.

---

# Vista previa lateral

En escritorio mostrar una tarjeta que vaya cambiando en tiempo real.

Debe verse una invitación.

No un formulario.

Cada vez que el usuario escriba:

```text
Cumpleaños de Sofía
```

la vista previa debe actualizarse inmediatamente.

---

# Responsive

En móvil:

Wizard arriba.

Vista previa debajo.

En escritorio:

Wizard izquierda.

Vista previa derecha.

---

# Componentes sugeridos

Crear componentes reutilizables.

Ejemplo:

```text
InvitationWizard

WizardStepper

WizardNavigation

InvitationPreview

WizardLayout
```

---

# Accesibilidad

Cumplir:

* navegación por teclado
* foco visible
* etiquetas
* mensajes claros
* botones reales

---

# Pruebas

Agregar pruebas para:

* cambio de pasos
* validaciones
* actualización de la vista previa
* navegación
* plantilla inexistente

---

# Validaciones técnicas

Ejecutar:

```bash
npm run typecheck
```

```bash
npm run lint
```

```bash
npm run test
```

```bash
npm run build
```

```bash
git diff --check
```

---

# Criterios de aceptación

La tarea estará completa cuando:

* exista el Wizard;
* existan los seis pasos;
* exista una barra de progreso;
* la plantilla seleccionada se cargue correctamente;
* la vista previa cambie en tiempo real;
* no exista persistencia todavía;
* no exista backend nuevo;
* el diseño sea responsive;
* las pruebas pasen;
* el build funcione;
* no se cree ningún commit.

---

# Reporte esperado

Informar:

* archivos creados;
* archivos modificados;
* componentes nuevos;
* pasos implementados;
* comportamiento responsive;
* cantidad de pruebas;
* resultado de TypeScript;
* resultado de lint;
* resultado del build;
* resultado de `git diff --check`.

Confirmar explícitamente:

```text
No se implementó persistencia.
No se implementó backend.
No se generó todavía una URL pública.
No se creó ningún commit.
```

