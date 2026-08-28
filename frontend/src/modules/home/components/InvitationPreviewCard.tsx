import { InvitationPreview } from '../../invitations/components/InvitationPreview'
import {
  defaultSectionBackgrounds,
  type InvitationDraft,
} from '../../invitations/types/invitationDraft'
import { invitationTemplates } from '../../templates/data/invitationTemplates'

const featuredTemplate = invitationTemplates.find(
  (template) => template.id === 'birthday-urban',
)!
const example: InvitationDraft = {
  viewMode: 'scroll',
  bgType: 'gradient',
  bgGradient: 'aurora',
  bgImageUrl: '',
  eventType: 'Cumpleaños',
  eventName: 'Cumpleaños de Emilia',
  honoreeName: 'Emilia',
  age: '8',
  date: '2027-01-23',
  time: '17:00',
  venueName: 'Jardín Los Aromos',
  address: 'Av. Primavera 245',
  mapsUrl: 'https://maps.google.com',
  heroImageUrl: '/invitation-backgrounds/balloons.svg',
  heroImagePosition: 50,
  galleryImageUrls: [],
  finalImagePosition: 50,
  message:
    'Queremos compartir contigo una tarde llena de alegría, juegos y recuerdos inolvidables.',
  sectionBackgrounds: defaultSectionBackgrounds(),
  contactInfo: {
    name: 'Familia de Emilia',
    whatsapp: '',
    instagram: '',
    facebook: '',
  },
  shareTitle: 'Cumpleaños de Emilia',
  shareDescription: 'Acompáñanos a celebrar',
  shareImageUrl: '',
  dateChangeNoticeEnabled: false,
}

export function InvitationPreviewCard() {
  return (
    <div
      className="product-demo"
      aria-label="Demostración de una invitación web real"
    >
      <div className="browser-bar">
        <i />
        <i />
        <i />
        <span>miinvitacion.cl/i/emilia-8</span>
      </div>
      <div className="product-demo-scroll">
        <InvitationPreview template={featuredTemplate} draft={example} />
      </div>
    </div>
  )
}
