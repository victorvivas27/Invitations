## Problema

En escritorio el texto de la sección se está renderizando como una columna muy angosta.

Actualmente el `<p>` queda limitado por el ancho de su contenedor y el navegador hace saltos de línea casi en cada palabra.

Resultado actual:

Prepárate para
una aventura
llena de risas,
diversión y
momentos
mágicos...

Esto NO es el comportamiento esperado.

---

## Objetivo

El texto debe ocupar el ancho disponible del contenedor de forma responsiva.

Debe verse aproximadamente así en escritorio:

Prepárate para una aventura llena de risas,
diversión y momentos mágicos.
Queremos celebrar contigo un día
que recordaremos para siempre.

En tablet debe adaptarse naturalmente.

En móvil debe reducir el ancho para mantener una lectura cómoda.

---

## Revisar

NO fijar anchos pequeños como:

```css
max-width: 350px;
max-width: 400px;
width: 300px;
```

ni utilizar contenedores tipo:

```css
display: inline-block;
width: fit-content;
```

---

## El contenedor del texto

Debe ocupar prácticamente todo el ancho disponible.

Ejemplo:

```css
.message {
    width: 100%;
    max-width: 900px;
    margin: 0 auto;
}
```

---

## El párrafo

```css
.message p {
    width: 100%;
    max-width: none;

    text-align: center;

    line-height: 1.3;

    text-wrap: pretty;

    overflow-wrap: normal;
    word-break: normal;
}
```

---

## Responsive

Desktop

```css
font-size: clamp(3rem, 4vw, 5rem);
```

Tablet

```css
font-size: clamp(2.2rem, 5vw, 3rem);
```

Mobile

```css
font-size: clamp(1.6rem, 7vw, 2.2rem);
```

---

## Importante

NO insertar `<br>` manuales.

NO dividir el texto en varios `<span>`.

NO calcular saltos de línea con JavaScript.

El navegador debe hacer el wrapping de forma natural utilizando todo el ancho del contenedor.

Si existe cualquier `max-width`, `width`, `flex-basis`, `grid-column`, `display:inline-block` o `fit-content` que limite el ancho del texto, eliminarlo.

El resultado final debe ser un bloque ancho y centrado, no una columna estrecha de palabras.
*LO TIENES  QUE HACER EN TODO LO QUE CONTENGA LETRAS*
