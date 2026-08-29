# Tarea — Auditar y reparar estilos de la invitación con foco en la galería

## Objetivo

Revisar todos los estilos que afectan el renderizado público de la invitación y encontrar por qué la galería de fotos no está respetando correctamente su layout.

No aplicar parches rápidos al final del CSS.

Primero identificar la causa real del conflicto de estilos.

---

## Alcance principal

Revisar especialmente:

- `PublicInvitationRenderer.tsx`
- `SectionBackground.tsx`
- `PublicInvitation.module.css`
- `InvitationWizard.module.css`

y cualquier otro archivo CSS que realmente esté afectando clases usadas por la invitación pública.

No revisar backend.

No tocar servicios, rutas, API ni lógica de negocio.

---

# Paso 1 — Mapear la estructura real del DOM

Analizar cómo se renderiza exactamente la sección:

```text
id="fotos"
