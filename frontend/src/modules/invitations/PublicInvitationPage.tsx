import { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { PublicInvitationRenderer } from './components/PublicInvitationRenderer'
import { getPublicInvitation, InvitationApiError } from './services/invitations'
import type { PublicInvitation } from './types/invitation'
type State = 'loading' | 'ready' | 'not-found' | 'network' | 'unexpected'
export function PublicInvitationPage() {
  const { slug = '' } = useParams()
  const [state, setState] = useState<State>('loading')
  const [invitation, setInvitation] = useState<PublicInvitation | null>(null)
  const [attempt, setAttempt] = useState(0)
  const retry = useCallback(() => setAttempt((value) => value + 1), [])
  useEffect(() => {
    let active = true
    setState('loading')
    getPublicInvitation(slug)
      .then((value) => {
        if (!active) return
        setInvitation(value)
        setState('ready')
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
      <main className="public-state" aria-live="polite">
        <span className="loader" />
        <h1>Cargando invitación...</h1>
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
        <a className="primary-cta" href="/">
          Ir al inicio
        </a>
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
