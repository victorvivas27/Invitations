import { useCallback, useEffect, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { PublicInvitationRenderer } from './components/PublicInvitationRenderer'
import { getPublicInvitation, InvitationApiError } from './services/invitations'
import type { PublicInvitation } from './types/invitation'
import { hideBootLoaderAfterRender } from '../../shared/utils/bootLoader'
type State =
  'loading' | 'notice' | 'ready' | 'not-found' | 'network' | 'unexpected'

function DateChangeNotice({ onContinue }: { onContinue: () => void }) {
  return (
    <main className="date-change-notice">
      <section
        className="date-change-notice__card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="date-change-title"
        aria-describedby="date-change-description"
      >
        <div className="date-change-notice__icon" aria-hidden="true">
          <span>!</span>
        </div>
        <p className="date-change-notice__eyebrow">Actualización importante</p>
        <h1 id="date-change-title">Importante: cambiamos la fecha</h1>
        <div id="date-change-description" className="date-change-notice__body">
          <p>Por fuerza mayor, el evento tiene una nueva fecha.</p>
          <ul>
            <li>
              <strong>¿Podés asistir?</strong> No respondas otra vez.
            </li>
            <li>
              <strong>¿No podés?</strong> Respondé nuevamente indicando que no
              asistirás.
            </li>
          </ul>
          <p className="date-change-notice__recommendation">
            Revisá la nueva fecha.
          </p>
        </div>
        <button type="button" autoFocus onClick={onContinue}>
          Entendido, ver invitación
        </button>
      </section>
    </main>
  )
}

const prepareCoverImage = async (invitation: PublicInvitation) => {
  const basicBackground = invitation.sectionBackgrounds?.basic
  const imageUrl =
    basicBackground?.customized && basicBackground.type === 'image'
      ? basicBackground.imageUrl
      : invitation.heroImageUrl

  if (!imageUrl) return

  const image = new Image()
  image.src = imageUrl
  if (typeof image.decode !== 'function') return

  // Una imagen lenta no debe dejar al invitado atrapado en el loader.
  await Promise.race([
    image.decode().catch(() => undefined),
    new Promise<void>((resolve) => window.setTimeout(resolve, 4500)),
  ])
}

export function PublicInvitationPage() {
  const { slug = '' } = useParams()
  const location = useLocation()
  const [state, setState] = useState<State>('loading')
  const [invitation, setInvitation] = useState<PublicInvitation | null>(null)
  const [attempt, setAttempt] = useState(0)
  const retry = useCallback(() => setAttempt((value) => value + 1), [])

  useEffect(() => {
    if (!slug || !location.pathname.startsWith('/view/')) return

    // `/view` is only the internal React entry point. Keep the shareable `/i`
    // address visible so copying the browser URL preserves social metadata.
    const sharePath = `/i/${encodeURIComponent(slug)}${location.search}${location.hash}`
    window.history.replaceState(window.history.state, '', sharePath)
  }, [location.hash, location.pathname, location.search, slug])

  useEffect(() => {
    let active = true
    setState('loading')
    getPublicInvitation(slug)
      .then(async (value) => {
        await prepareCoverImage(value)
        if (!active) return
        setInvitation(value)
        setState(value.dateChangeNoticeEnabled ? 'notice' : 'ready')
        document.title = `${value.eventName} | Mi Invitación`
      })
      .catch((error: unknown) => {
        if (!active) return
        if (error instanceof InvitationApiError && error.kind === 'not-found')
          setState('not-found')
        else if (
          error instanceof InvitationApiError &&
          error.kind === 'network'
        )
          setState('network')
        else setState('unexpected')
      })
    return () => {
      active = false
      document.title = 'Mi Invitación'
    }
  }, [slug, attempt])
  useEffect(() => {
    if (state === 'loading') return
    return hideBootLoaderAfterRender()
  }, [state])
  if (state === 'notice' && invitation)
    return <DateChangeNotice onContinue={() => setState('ready')} />
  if (state === 'ready' && invitation)
    return (
      <PublicInvitationRenderer
        invitation={invitation}
        viewMode={
          invitation.viewMode === 'NAVIGATION' ? 'navigation' : 'scroll'
        }
      />
    )
  if (state === 'loading')
    return (
      <main
        className="boot-loader"
        aria-busy="true"
        aria-live="polite"
        aria-label="Cargando Mi Invitación"
      >
        <div className="boot-loader__content">
          <div className="boot-loader__mark" aria-hidden="true">
            <img
              className="boot-loader__envelope"
              src="/images/icon-invitacion.png"
              alt=""
            />
          </div>
          <h1 className="boot-loader__title">Cargando invitación...</h1>
          <p className="boot-loader__status">Preparando algo especial</p>
          <div className="boot-loader__progress" aria-hidden="true" />
        </div>
      </main>
    )
  if (state === 'not-found')
    return (
      <main className="public-state">
        <span aria-hidden="true">?</span>
        <h1>Esta invitación no está disponible.</h1>
        <p>
          El enlace puede ser incorrecto o la invitación ya no está publicada.
        </p>
        <Link className="primary-cta" to="/">
          Ir al inicio
        </Link>
      </main>
    )
  return (
    <main className="public-state">
      <span aria-hidden="true">!</span>
      <h1>No pudimos cargar la invitación.</h1>
      <p>Comprueba tu conexión e inténtalo nuevamente.</p>
      <button className="primary-cta" type="button" onClick={retry}>
        Reintentar
      </button>
    </main>
  )
}
