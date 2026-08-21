import { useEffect, useState } from 'react'
import {
  Link,
  Navigate,
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from 'react-router-dom'
import { AppLayout } from '../../shared/components/layout/AppLayout'
import { getAccessToken } from '../auth/services/authSession'
import { invitationTemplates } from '../templates/data/invitationTemplates'
import { InvitationCreationSuccess } from './components/InvitationCreationSuccess'
import { InvitationPreview } from './components/InvitationPreview'
import { InvitationWizard } from './components/InvitationWizard'
import {
  clearInvitationSession,
  createDraftInvitationId,
  createInvitation,
  getOwnedInvitation,
  InvitationApiError,
  updateInvitation,
} from './services/invitations'
import type {
  CreatedInvitation,
  CreateInvitationInput,
  InvitationEventType,
} from './types/invitation'
import {
  emptyInvitationDraft,
  normalizeSectionBackgrounds,
  type InvitationDraft,
} from './types/invitationDraft'

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

const eventTypeLabels: Record<InvitationEventType, string> = {
  BIRTHDAY: 'Cumpleaños',
  BAPTISM: 'Bautismo',
  WEDDING: 'Matrimonio',
  BABY_SHOWER: 'Baby shower',
  KIDS_PARTY: 'Fiesta infantil',
  ANNIVERSARY: 'Aniversario',
  GRADUATION: 'Graduación',
  OTHER: 'Otro evento',
}

export function CreateInvitationPage() {
  const { slug } = useParams<{ slug: string }>()
  const [params] = useSearchParams()
  const location = useLocation()
  const navigate = useNavigate()

  const editing = Boolean(slug)
  const returnTo = `${location.pathname}${location.search}`
  const selectedTemplateId = params.get('template')

  const [templateId, setTemplateId] = useState<string | null>(
    selectedTemplateId,
  )
  const [invitationId, setInvitationId] = useState<string>(() =>
    createDraftInvitationId(),
  )
  const [draft, setDraft] = useState<InvitationDraft>(emptyInvitationDraft)
  const [loading, setLoading] = useState(editing)
  const [loadError, setLoadError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [created, setCreated] = useState<CreatedInvitation | null>(null)

  const template = invitationTemplates.find((item) => item.id === templateId)

  useEffect(() => {
    if (draft.viewMode === 'navigation') {
      sessionStorage.setItem('invitation-view-mode', 'NAVIGATION')
    } else {
      sessionStorage.removeItem('invitation-view-mode')
    }
  }, [draft.viewMode])

  useEffect(() => {
    if (!editing || !slug || !getAccessToken()) return

    let active = true

    setLoading(true)
    setLoadError('')

    void getOwnedInvitation(slug)
      .then((invitation) => {
        if (!active) return

        setInvitationId(invitation.id)
        setTemplateId(invitation.templateId)

        setDraft({
          ...emptyInvitationDraft,
          viewMode:
            invitation.viewMode === 'NAVIGATION' ? 'navigation' : 'scroll',
          eventType: eventTypeLabels[invitation.eventType],
          eventName: invitation.eventName,
          honoreeName: invitation.honoreeName,
          age:
            invitation.honoreeAge === null ? '' : String(invitation.honoreeAge),
          date: invitation.eventDate,
          time: invitation.eventTime,
          venueName: invitation.venueName,
          address: invitation.address,
          mapsUrl: invitation.mapsUrl ?? '',
          heroImageUrl: invitation.heroImageUrl ?? '',
          galleryImageUrls: invitation.galleryImageUrls,
          message: invitation.message,
          sectionBackgrounds: normalizeSectionBackgrounds(
            invitation.sectionBackgrounds,
          ),
          contactInfo:
            invitation.contactInfo ?? emptyInvitationDraft.contactInfo,
          shareTitle: invitation.shareTitle,
          shareDescription: invitation.shareDescription,
          shareImageUrl: invitation.shareImageUrl ?? '',
        })
      })
      .catch((error) => {
        if (!active) return

        if (
          error instanceof InvitationApiError &&
          error.kind === 'unauthorized'
        ) {
          clearInvitationSession()
          navigate(`/login?returnTo=${encodeURIComponent(returnTo)}`, {
            replace: true,
          })
          return
        }

        setLoadError(
          error instanceof InvitationApiError
            ? error.message
            : 'No fue posible cargar la invitación.',
        )
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [editing, navigate, returnTo, slug])

  if (!getAccessToken()) {
    return (
      <Navigate
        to={`/login?returnTo=${encodeURIComponent(returnTo)}`}
        replace
      />
    )
  }

  if (loading) {
    return (
      <AppLayout
        activePage="my-invitations"
        className="creation-shell section-shell"
      >
        <section className="creation-card" aria-busy="true">
          <h1>Cargando invitación...</h1>
          <p>Estamos preparando todos los datos para que puedas editarla.</p>
        </section>
      </AppLayout>
    )
  }

  if (loadError) {
    return (
      <AppLayout
        activePage="my-invitations"
        className="creation-shell section-shell"
      >
        <section className="creation-card" role="alert">
          <span aria-hidden="true" className="creation-symbol">
            !
          </span>
          <h1>No pudimos cargar la invitación</h1>
          <p>{loadError}</p>
          <Link className="primary-cta" to="/my-invitations">
            Volver a mis invitaciones
          </Link>
        </section>
      </AppLayout>
    )
  }

  if (!template) {
    return (
      <AppLayout
        activePage={editing ? 'my-invitations' : 'templates'}
        className="creation-shell section-shell"
      >
        <section className="creation-card">
          <span aria-hidden="true" className="creation-symbol">
            ?
          </span>
          <h1>La plantilla seleccionada no existe.</h1>
          <p>
            Es posible que el enlace esté incompleto o que esa plantilla ya no
            exista.
          </p>
          <Link
            className="primary-cta"
            to={editing ? '/my-invitations' : '/templates'}
          >
            {editing ? 'Volver a mis invitaciones' : 'Volver a plantillas'}
          </Link>
        </section>
      </AppLayout>
    )
  }

  if (created) {
    return <InvitationCreationSuccess invitation={created} />
  }

  const buildInput = (): CreateInvitationInput => ({
    templateId: template.id,
    viewMode: draft.viewMode === 'navigation' ? 'NAVIGATION' : 'SCROLL',
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
    shareTitle: draft.shareTitle.trim(),
    shareDescription: draft.shareDescription.trim(),
    shareImageUrl: draft.shareImageUrl,
  })

  const submit = async () => {
    if (submitting) return

    setSubmitting(true)
    setSubmitError('')

    try {
      const input = buildInput()

      if (editing && slug) {
        await updateInvitation(slug, input)
        navigate('/my-invitations', { replace: true })
        return
      }

      setCreated(await createInvitation(input, invitationId))
    } catch (error) {
      if (error instanceof InvitationApiError) {
        if (error.kind === 'unauthorized') {
          clearInvitationSession()
          navigate(`/login?returnTo=${encodeURIComponent(returnTo)}`, {
            replace: true,
          })
          return
        }

        setSubmitError(error.message)
      } else {
        setSubmitError(
          editing
            ? 'No fue posible guardar los cambios.'
            : 'No fue posible crear la invitación.',
        )
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AppLayout
      activePage={editing ? 'my-invitations' : 'templates'}
      className="wizard-page section-shell"
    >
      <div className="wizard-template-context">
        <span>{editing ? 'Editar invitación' : 'Nueva invitación'}</span>

        <strong>
          {editing
            ? 'Actualiza los detalles de tu invitación'
            : 'Crea una experiencia especial'}
        </strong>

        <Link to={editing ? '/my-invitations' : '/templates'}>Volver</Link>
      </div>

      <section
        className="experience-choice"
        aria-labelledby="experience-choice-title"
      >
        <div>
          <span className="pill">
            {editing ? 'Presentación' : 'Antes de empezar'}
          </span>

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
          invitationId={invitationId}
          draft={draft}
          onChange={setDraft}
          onSubmit={submit}
          submitting={submitting}
          submitError={submitError}
        />

        <InvitationPreview template={template} draft={draft} />
      </div>
    </AppLayout>
  )
}
import invitationWizardStyles from './styles/InvitationWizard.module.css'
void invitationWizardStyles
