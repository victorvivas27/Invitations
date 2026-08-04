import { useState } from 'react'
import type { CreatedInvitation } from '../types/invitation'
import { getInvitationShareUrl } from '../services/invitations'
export function InvitationCreationSuccess({
  invitation,
}: {
  invitation: CreatedInvitation
}) {
  const [copyState, setCopyState] = useState('')
  const shareUrl = new URL(
    getInvitationShareUrl(invitation.publicSlug),
    window.location.origin,
  ).toString()
  const copy = async () => {
    try {
      if (!navigator.clipboard) throw new Error()
      await navigator.clipboard.writeText(shareUrl)
      setCopyState('Enlace copiado')
    } catch {
      setCopyState(
        'No pudimos copiar el enlace. Puedes seleccionarlo manualmente.',
      )
    }
  }
  return (
    <main className="creation-success section-shell">
      <section>
        <span className="success-mark" aria-hidden="true">
          ✓
        </span>
        <span className="pill">Invitación publicada</span>
        <h1>Tu invitación está lista</h1>
        <p>Ya puedes abrirla y compartirla con tus invitados.</p>
        <label className="share-url">
          <span>Enlace público</span>
          <input
            readOnly
            value={shareUrl}
            onFocus={(event) => event.currentTarget.select()}
          />
        </label>
        <div className="success-actions">
          <a className="primary-cta" href={invitation.publicUrl}>
            Ver invitación
          </a>
          <button type="button" className="secondary-cta" onClick={copy}>
            Copiar enlace
          </button>
          <a href="/templates">Volver a plantillas</a>
        </div>
        <p className="copy-status" aria-live="polite">
          {copyState}
        </p>
      </section>
    </main>
  )
}
