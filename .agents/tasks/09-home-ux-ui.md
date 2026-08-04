# Corrección de la Tarea 09 — Nueva identidad visual

**Guardar en:** `docs/tasks/task-09-home-color-correction.md`

---

# Objetivo

Modificar exclusivamente la identidad visual del Home público implementado en la Tarea 09.

La estructura, los textos, las secciones, la navegación y el comportamiento actual deben conservarse.

La paleta actual rosada, violeta o excesivamente femenina debe reemplazarse por una identidad visual inspirada en la energía de Spider-Man:

* rojo intenso;
* azul profundo;
* negro;
* blanco;
* grises neutros.

La interfaz no debe copiar logotipos, personajes, telarañas oficiales, trajes, imágenes ni elementos protegidos de Spider-Man.

La inspiración debe limitarse a:

* combinación cromática;
* energía visual;
* contraste;
* formas dinámicas;
* sensación moderna y juvenil.

No utilizar la palabra Spider-Man dentro de la interfaz pública.

No crear ningún commit.

---

# Alcance

Modificar únicamente:

* variables de color;
* fondos;
* botones;
* tarjetas;
* badges;
* enlaces;
* estados hover;
* decoraciones abstractas;
* sombras;
* bordes;
* vista previa de invitación;
* contraste general.

No modificar:

* rutas;
* textos principales;
* componentes funcionales;
* pruebas de comportamiento;
* navegación;
* contenido de las secciones;
* backend;
* endpoints;
* autenticación;
* configuración de producción.

---

# Paleta principal

Utilizar como base:

```css
:root {
  --color-primary: #D71920;
  --color-primary-dark: #A90F18;
  --color-primary-soft: rgba(215, 25, 32, 0.10);

  --color-secondary: #1557A0;
  --color-secondary-dark: #0B3568;
  --color-secondary-soft: rgba(21, 87, 160, 0.10);

  --color-accent: #E63946;
  --color-accent-hover: #C51624;

  --color-background: #F6F8FC;
  --color-surface: #FFFFFF;
  --color-surface-dark: #111827;
  --color-surface-soft: #EAF0F8;

  --color-text: #121826;
  --color-text-muted: #5D6677;
  --color-text-inverse: #FFFFFF;

  --color-border: #D9E0EA;
  --color-border-strong: #AEB9C8;

  --color-success: #168A4B;
  --color-warning: #D97706;
  --color-error: #C81E1E;
  --color-info: #1557A0;

  --shadow-small: 0 4px 14px rgba(17, 24, 39, 0.08);
  --shadow-medium: 0 14px 38px rgba(17, 24, 39, 0.12);
  --shadow-primary: 0 14px 34px rgba(215, 25, 32, 0.20);

  --radius-small: 10px;
  --radius-medium: 18px;
  --radius-large: 28px;
}
```

La paleta puede adaptarse ligeramente si el proyecto ya utiliza variables equivalentes.

No dejar variables rosadas o violetas sin uso.

No repetir colores hardcodeados si ya existen variables semánticas.

---

# Proporción de color

La pantalla no debe quedar completamente roja o azul.

Utilizar aproximadamente:

```text
60 % fondos blancos o grises claros
25 % azul profundo
10 % rojo
5 % negro y detalles
```

El rojo debe utilizarse principalmente en:

* botón principal;
* elementos destacados;
* pequeños acentos;
* etiquetas activas;
* llamadas a la acción.

El azul debe utilizarse principalmente en:

* encabezado;
* secciones importantes;
* fondos oscuros;
* elementos secundarios;
* enlaces.

El negro debe utilizarse con moderación en:

* textos;
* contraste;
* detalles gráficos;
* footer.

---

# Header

Actualizar el encabezado para utilizar:

* fondo blanco o azul profundo;
* marca legible;
* enlaces con buen contraste;
* botón principal rojo;
* menú móvil coherente.

Ejemplo recomendado:

```text
Fondo: blanco
Texto principal: azul oscuro
CTA: rojo
Hover de enlaces: rojo
```

Alternativa permitida:

```text
Fondo: azul profundo
Texto: blanco
CTA: rojo
```

No combinar demasiados fondos saturados dentro del mismo encabezado.

---

# Hero

El Hero debe sentirse:

* dinámico;
* fuerte;
* moderno;
* creativo;
* neutral respecto del género;
* apropiado para distintas celebraciones.

Utilizar:

* fondo claro;
* texto oscuro;
* palabra o fragmento destacado en rojo;
* formas abstractas azules;
* pequeñas líneas diagonales;
* patrones geométricos discretos.

No utilizar:

* telarañas reconocibles;
* máscaras;
* ojos de superhéroes;
* personajes;
* arañas;
* logotipos protegidos;
* imitaciones del traje.

---

# Botones

## Botón principal

Utilizar:

```css
background: var(--color-primary);
color: var(--color-text-inverse);
```

Hover:

```css
background: var(--color-primary-dark);
```

Debe conservar:

* contraste suficiente;
* foco visible;
* estado deshabilitado;
* transición breve.

---

## Botón secundario

Utilizar:

```css
background: transparent;
color: var(--color-secondary);
border: 1px solid var(--color-secondary);
```

Hover:

```css
background: var(--color-secondary-soft);
```

---

# Tarjetas

Las tarjetas deben utilizar:

* fondo blanco;
* borde gris azulado;
* sombra suave;
* título oscuro;
* acentos rojos o azules;
* iconos dentro de superficies suaves.

Ejemplo:

```css
.card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  box-shadow: var(--shadow-small);
}
```

Hover permitido:

```css
.card:hover {
  transform: translateY(-3px);
  border-color: var(--color-secondary);
  box-shadow: var(--shadow-medium);
}
```

Respetar movimiento reducido.

---

# Categorías de eventos

Las categorías pueden utilizar variaciones controladas de la nueva paleta.

Ejemplos:

```text
Cumpleaños: rojo
Bautismo: azul claro
Matrimonio: azul oscuro
Baby shower: rojo suave o azul suave
Fiesta infantil: mezcla de rojo, azul y amarillo discreto
Aniversario: rojo oscuro
Otros eventos: gris azulado
```

No utilizar rosa como color dominante.

No limitar todos los eventos a una única estética infantil.

---

# Vista previa de invitación

Actualizar el ejemplo visual de invitación para que sea neutral y moderno.

Puede utilizar:

* fondo blanco;
* encabezado azul;
* acento rojo;
* fotografía de ejemplo neutral;
* fecha destacada;
* botón rojo;
* detalles geométricos.

No crear una invitación que parezca exclusivamente femenina.

Ejemplo de contenido:

```text
Cumpleaños de Alex

Sábado 22 de agosto
17:00 horas

Salón Central

Ven a celebrar con nosotros
```

---

# Secciones alternadas

Para evitar una página plana, alternar:

```text
Fondo blanco
Fondo gris azulado
Fondo azul profundo
Fondo blanco
```

Las secciones oscuras deben utilizar texto blanco y suficiente contraste.

No colocar dos secciones oscuras consecutivas salvo que el diseño lo justifique.

---

# CTA final

La llamada final debe tener mayor impacto visual.

Opción recomendada:

```text
Fondo azul profundo
Título blanco
Texto gris claro
Botón rojo
```

Puede incluir formas diagonales abstractas en rojo y azul.

No utilizar imágenes protegidas.

---

# Footer

Utilizar:

```text
Fondo negro azulado
Texto blanco
Enlaces gris claro
Hover rojo
```

Ejemplo:

```css
background: #0B1220;
```

Mantener el footer simple.

---

# Tipografía

Mantener una tipografía principal clara y moderna.

Evitar tipografías manuscritas o excesivamente delicadas.

La identidad debe sentirse fuerte y directa.

Puede utilizarse una fuente de títulos con peso:

```text
700
800
```

No agregar nuevas fuentes externas si no son necesarias.

---

# Formas decorativas

Se permiten:

* diagonales;
* círculos;
* puntos;
* líneas;
* bloques superpuestos;
* patrones abstractos;
* bordes angulares moderados.

No se permiten:

* arañas;
* telarañas reconocibles;
* máscaras;
* personajes;
* símbolos oficiales;
* ilustraciones copiadas.

---

# Accesibilidad

Verificar:

* contraste del rojo sobre blanco;
* contraste del blanco sobre azul;
* foco visible;
* estados hover que no dependan solo del color;
* enlaces subrayados cuando sea necesario;
* texto legible en tarjetas;
* botones distinguibles.

No utilizar rojo para todos los mensajes de estado.

Mantener:

```text
Verde para éxito
Naranja para advertencia
Rojo para error
Azul para información
```

---

# Responsive

Revisar nuevamente:

```text
320px
375px
768px
1024px
1280px
1440px
```

Confirmar:

* formas decorativas no generan desbordamiento;
* fondos no cortan contenido;
* textos conservan contraste;
* CTA no se desborda;
* menú móvil se mantiene legible;
* no existe scroll horizontal.

---

# Pruebas

Actualizar pruebas solamente si dependen de clases, estilos o textos modificados.

No eliminar pruebas existentes.

Ejecutar:

```bash
npm run typecheck
npm run lint
npm run test
npm run build
git diff --check
```

---

# Criterios de aceptación

La corrección se considera completa cuando:

* desaparece la paleta rosada o violeta dominante;
* la página utiliza rojo, azul, negro, blanco y grises;
* el diseño se siente neutral y dinámico;
* no se copia propiedad visual de Spider-Man;
* el Home conserva todas sus secciones;
* no se rompen rutas;
* no se modifica el comportamiento;
* el diseño sigue siendo festivo;
* el contraste es correcto;
* no existe scroll horizontal;
* las pruebas pasan;
* el build funciona;
* se realiza revisión visual;
* no se crea ningún commit.

---

# Reporte esperado

Reportar:

* variables de color modificadas;
* componentes visuales ajustados;
* colores anteriores eliminados;
* comportamiento del Hero;
* comportamiento del Header;
* comportamiento del CTA;
* revisión responsive;
* pruebas ejecutadas;
* resultado del build;
* resultado de `git diff --check`.

Confirmar:

```text
No se utilizaron personajes, logos ni recursos protegidos de Spider-Man.
```

Confirmar:

```text
No se creó ningún commit.
```
