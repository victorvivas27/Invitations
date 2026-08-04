import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { PublicHeader } from '../../shared/components/layout/PublicHeader'
import { getAccessToken } from '../auth/services/authSession'
import { invitationTemplates } from '../templates/data/invitationTemplates'
import { InvitationCreationSuccess } from './components/InvitationCreationSuccess'
import { InvitationPreview } from './components/InvitationPreview'
import { InvitationWizard } from './components/InvitationWizard'
import {
  clearInvitationSession,
  createInvitation,
  InvitationApiError,
} from './services/invitations'
import type { CreatedInvitation, InvitationEventType } from './types/invitation'
import { emptyInvitationDraft } from './types/invitationDraft'

const eventTypes: Record<string, InvitationEventType> = {
  Cumpleaños: 'BIRTHDAY',
  Bautismo: 'BAPTISM',
  Matrimonio: 'WEDDING',
  'Baby shower': 'BABY_SHOWER',
  'Fiesta infantil': 'KIDS_PARTY',
  Aniversario: 'ANNIVERSARY',
  Graduación: 'GRADUATION',
  'Otro evento': 'OTHER',
}
export function CreateInvitationPage() {
  const id = new URLSearchParams(window.location.search).get('template')
  const template = invitationTemplates.find((item) => item.id === id)
  const [draft, setDraft] = useState(emptyInvitationDraft)
  useEffect(() => {
    if (draft.viewMode === 'navigation')
      sessionStorage.setItem('invitation-view-mode', 'NAVIGATION')
    else sessionStorage.removeItem('invitation-view-mode')
  }, [draft.viewMode])
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [created, setCreated] = useState<CreatedInvitation | null>(null)
  if (!getAccessToken()) {
    const returnTo = `${window.location.pathname}${window.location.search}`
    return (
      <Navigate
        to={`/login?returnTo=${encodeURIComponent(returnTo)}`}
        replace
      />
    )
  }
  if (!template)
    return (
      <>
        <PublicHeader activePage="templates" />
        <main className="creation-shell section-shell">
          <section className="creation-card">
            <span aria-hidden="true" className="creation-symbol">
              ?
            </span>
            <h1>La plantilla seleccionada no existe.</h1>
            <p>
              Es posible que el enlace esté incompleto o que esa plantilla ya no
              exista.
            </p>
            <a className="primary-cta" href="/templates">
              Volver a plantillas
            </a>
          </section>
        </main>
      </>
    )
  if (created) return <InvitationCreationSuccess invitation={created} />
  const submit = async () => {
    if (submitting) return
    setSubmitting(true)
    setSubmitError('')
    try {
      setCreated(
        await createInvitation({
          templateId: template.id,
          eventType: eventTypes[draft.eventType],
          eventName: draft.eventName.trim(),
          honoreeName: draft.honoreeName.trim(),
          ...(draft.age ? { honoreeAge: Number(draft.age) } : {}),
          eventDate: draft.date,
          eventTime: draft.time,
          venueName: draft.venueName.trim(),
          address: draft.address.trim(),
          ...(draft.mapsUrl.trim() ? { mapsUrl: draft.mapsUrl.trim() } : {}),
          ...(draft.heroImageUrl ? { heroImageUrl: draft.heroImageUrl } : {}),
          ...(draft.galleryImageUrls.length
            ? { galleryImageUrls: draft.galleryImageUrls }
            : {}),
          message: draft.message.trim(),
          sectionBackgrounds: draft.sectionBackgrounds,
          contactInfo: draft.contactInfo,
        }),
      )
    } catch (error) {
      if (error instanceof InvitationApiError) {
        if (error.kind === 'unauthorized') {
          clearInvitationSession()
          const returnTo = `${window.location.pathname}${window.location.search}`
          window.location.assign(
            `/login?returnTo=${encodeURIComponent(returnTo)}`,
          )
          return
        }
        setSubmitError(error.message)
      } else setSubmitError('No fue posible crear la invitación.')
    } finally {
      setSubmitting(false)
    }
  }
  return (
    <>
      <PublicHeader activePage="templates" />
      <main className="wizard-page section-shell">
        <div className="wizard-template-context">
          <span>Nueva invitación</span>
          <strong>Crea una experiencia especial</strong>
          <a href="/templates">Volver</a>
        </div>
        <section
          className="experience-choice"
          aria-labelledby="experience-choice-title"
        >
          <div>
            <span className="pill">Antes de empezar</span>
            <h1 id="experience-choice-title">
              Elige cómo quieres mostrar tu invitación
            </h1>
            <p>Selecciona un solo recorrido para esta invitación.</p>
          </div>
          <div className="experience-choice-options">
            <button
              type="button"
              className={draft.viewMode === 'scroll' ? 'is-selected' : ''}
              aria-pressed={draft.viewMode === 'scroll'}
              onClick={() => setDraft({ ...draft, viewMode: 'scroll' })}
            >
              <strong>Scroll completo</strong>
              <span>De arriba hacia abajo.</span>
            </button>
            <button
              type="button"
              className={draft.viewMode === 'navigation' ? 'is-selected' : ''}
              aria-pressed={draft.viewMode === 'navigation'}
              onClick={() => setDraft({ ...draft, viewMode: 'navigation' })}
            >
              <strong>Navegación lateral</strong>
              <span>Capítulos de lado a lado.</span>
            </button>
          </div>
        </section>
        <div className="wizard-layout">
          <InvitationWizard
            draft={draft}
            onChange={setDraft}
            onSubmit={submit}
            submitting={submitting}
            submitError={submitError}
          />
          <InvitationPreview template={template} draft={draft} />
        </div>
      </main>
    </>
  )
}
