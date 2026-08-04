import type { InvitationTemplate } from '../../templates/types/invitationTemplate'
import type { InvitationEventType, PublicInvitation } from '../types/invitation'
import type { InvitationDraft } from '../types/invitationDraft'
import { PublicInvitationRenderer } from './PublicInvitationRenderer'

const types: Record<string, InvitationEventType> = {
  Cumpleaños: 'BIRTHDAY',
  Bautismo: 'BAPTISM',
  Matrimonio: 'WEDDING',
  'Baby shower': 'BABY_SHOWER',
  'Fiesta infantil': 'KIDS_PARTY',
  Aniversario: 'ANNIVERSARY',
  Graduación: 'GRADUATION',
  'Otro evento': 'OTHER',
}
export function InvitationPreview({
  template,
  draft,
}: {
  template: InvitationTemplate
  draft: InvitationDraft
}) {
  const invitation: PublicInvitation = {
    publicSlug: 'vista-previa',
    templateId: template.id,
    eventType: types[draft.eventType] ?? 'BIRTHDAY',
    eventName: draft.eventName || 'Tu celebración',
    honoreeName: draft.honoreeName || 'Nombre de la persona',
    honoreeAge: draft.age ? Number(draft.age) : null,
    eventDate: draft.date || new Date().toISOString().slice(0, 10),
    eventTime: draft.time || '17:00',
    venueName: draft.venueName || 'Lugar del evento',
    address: draft.address || 'Dirección por definir',
    mapsUrl: draft.mapsUrl || null,
    heroImageUrl: draft.heroImageUrl || null,
    galleryImageUrls: draft.galleryImageUrls,
    sectionBackgrounds: draft.sectionBackgrounds,
    contactInfo: draft.contactInfo,
    shareTitle: draft.shareTitle,
    shareDescription: draft.shareDescription,
    shareImageUrl: draft.shareImageUrl,
    message:
      draft.message || 'Queremos compartir contigo un día lleno de alegría.',
  }
  return (
    <aside
      className="wizard-preview"
      aria-label="Vista previa de la invitación"
    >
      <PublicInvitationRenderer
        invitation={invitation}
        preview
        viewMode={draft.viewMode}
      />
      <p className="preview-caption">
        Esta es la misma experiencia que recibirán tus invitados.
      </p>
    </aside>
  )
}
