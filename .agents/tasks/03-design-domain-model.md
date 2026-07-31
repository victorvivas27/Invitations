# Tarea 03 — Diseñar el modelo de dominio

## Objetivo

Diseñar el modelo de dominio de la aplicación **Invitation** antes de implementar cualquier funcionalidad.

En esta tarea no desarrolles controladores, servicios, repositorios, autenticación ni frontend.

El objetivo es definir correctamente el modelo de datos que utilizará toda la aplicación.

---

# Análisis

Antes de diseñar las entidades, analiza el flujo completo del usuario.

Piensa cómo una persona utilizará la aplicación desde que crea una invitación hasta que la comparte.

No diseñes únicamente pensando en el MVP.

Diseña un modelo suficientemente flexible para permitir futuras funcionalidades sin romper la estructura.

---

# Funcionalidades futuras a considerar

Aunque no se implementarán ahora, el modelo debe permitir incorporar posteriormente:

- Varias plantillas.
- Invitaciones públicas.
- Invitaciones privadas.
- Confirmación de asistencia (RSVP).
- Lista de invitados.
- Galería de imágenes.
- Música.
- Cuenta regresiva.
- Google Maps.
- Compartir por WhatsApp.
- Compartir por redes sociales.
- Descargar como imagen.
- Descargar como PDF.
- Personalización de colores.
- Emojis.
- Varios eventos por usuario.

---

# Diseñar las entidades

Propón todas las entidades necesarias.

Para cada una indica:

- Propósito.
- Responsabilidad.
- Relación con otras entidades.
- Campos principales.

No escribas todavía código Java.

---

## Relaciones

Define claramente:

- Uno a uno.
- Uno a muchos.
- Muchos a uno.

Justifica cada relación.

---

## Campos

Para cada entidad indica:

- Nombre.
- Tipo.
- Obligatorio u opcional.
- Restricciones.
- Valor por defecto cuando corresponda.

---

## Códigos públicos

Evalúa qué entidades necesitan un identificador público.

Por ejemplo:

```text
INV-XXXXXXXX
```

Evita exponer IDs internos.

---

## Estados

Define los estados que podrían existir.

Ejemplos:

- Draft
- Published
- Archived

No los implementes todavía.

---

## Auditoría

Define qué entidades deberían registrar:

- createdAt
- updatedAt
- createdBy
- updatedBy

---

## Eliminación

Indica si cada entidad debería:

- eliminarse físicamente;
- utilizar borrado lógico;
- no poder eliminarse.

Justifica cada decisión.

---

## Validaciones

Propón las reglas principales de negocio.

Por ejemplo:

- Nombre obligatorio.
- Fecha obligatoria.
- Fecha no puede ser anterior al día actual.
- Un usuario puede tener múltiples invitaciones.
- Una invitación debe pertenecer a un único usuario.

No implementes estas reglas todavía.

---

# Resultado esperado

Entrega un documento técnico que incluya:

- Entidades propuestas.
- Relaciones.
- Responsabilidades.
- Campos.
- Enumeraciones.
- Estados.
- Códigos públicos.
- Reglas de negocio.
- Riesgos detectados.
- Recomendaciones para la implementación.

---

# Restricciones

No crear:

- Entidades JPA.
- Migraciones Flyway.
- Repositorios.
- Servicios.
- Controllers.
- DTOs.
- Endpoints.
- React.
- Formularios.
- Autenticación.
- JWT.

Esta tarea es exclusivamente de diseño del dominio.

---

# Validación

Verifica que el modelo propuesto:

- Sea coherente.
- Sea extensible.
- Evite duplicidad de información.
- No dependa de funcionalidades futuras para funcionar.

No modifiques ningún archivo fuera de `.agents`.
