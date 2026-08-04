export function InvitationPreviewCard() {
  return (
    <div className="preview-wrap" aria-label="Ejemplo de invitación digital">
      <span className="preview-label">Vista de ejemplo</span>
      <article className="invitation-preview">
        <div
          className="preview-art"
          role="img"
          aria-label="Ilustración decorativa de flores y confeti"
        >
          <span>✿</span>
          <span>✦</span>
          <span>❀</span>
        </div>
        <p className="preview-kicker">Estás invitado a celebrar</p>
        <h2>Cumpleaños de Alex</h2>
        <div className="preview-date">
          <strong>22</strong>
          <span>
            Agosto
            <br />
            Sábado · 17:00
          </span>
        </div>
        <p className="preview-place">Salón Central</p>
        <p>Ven a celebrar con nosotros un día inolvidable.</p>
        <span className="preview-button" aria-disabled="true">
          Confirmar asistencia · Próximamente
        </span>
      </article>
    </div>
  )
}
