import type { InvitationTemplate } from '../types/invitationTemplate'
export function TemplateArtwork({
  template,
  large = false,
}: {
  template: InvitationTemplate
  large?: boolean
}) {
  return (
    <div
      className={`template-art art-${template.previewVariant}${large ? ' is-large' : ''}`}
      aria-label={`Demostración visual de ${template.name}`}
      role="img"
    >
      <span className="art-demo">Demostración</span>
      <i aria-hidden="true" />
      <i aria-hidden="true" />
      <div>
        <small>Te invitamos al</small>
        <strong>Cumpleaños de Alex</strong>
        <span>Sábado 22 de agosto · 17:00</span>
        <span>Salón Central</span>
      </div>
    </div>
  )
}
