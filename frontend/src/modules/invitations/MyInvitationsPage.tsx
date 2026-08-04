import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { PublicHeader } from '../../shared/components/layout/PublicHeader'
import { getAccessToken } from '../auth/services/authSession'
import {
  deleteInvitation,
  getMyInvitations,
  InvitationApiError,
} from './services/invitations'
import type { OwnedInvitation } from './types/invitation'

const formatDate = (value: string) =>
  new Intl.DateTimeFormat('es-CL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${value}T00:00:00Z`))

export function MyInvitationsPage() {
  const [invitations, setInvitations] = useState<OwnedInvitation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [deleting, setDeleting] = useState('')
  const [deleteError, setDeleteError] = useState('')
  const load = () => {
    setLoading(true)
    setError('')
    void getMyInvitations()
      .then(setInvitations)
      .catch((failure) =>
        setError(
          failure instanceof InvitationApiError
            ? failure.message
            : 'No fue posible cargar tus invitaciones.',
        ),
      )
      .finally(() => setLoading(false))
  }
  useEffect(() => {
    if (getAccessToken()) load()
  }, [])
  const remove = async (invitation: OwnedInvitation) => {
    if (!window.confirm(`¿Eliminar definitivamente "${invitation.eventName}"?`))
      return
    setDeleting(invitation.publicSlug)
    setDeleteError('')
    try {
      await deleteInvitation(invitation.publicSlug)
      setInvitations((current) =>
        current.filter((item) => item.publicSlug !== invitation.publicSlug),
      )
    } catch (failure) {
      setDeleteError(
        failure instanceof InvitationApiError
          ? failure.message
          : 'No fue posible eliminar la invitación.',
      )
    } finally {
      setDeleting('')
    }
  }
  if (!getAccessToken())
    return <Navigate to="/login?returnTo=%2Fmy-invitations" replace />
  return (
    <>
      <PublicHeader activePage="my-invitations" />
      <main className="my-invitations section-shell">
        <header>
          <span className="pill">Tu espacio</span>
          <h1>Mis invitaciones</h1>
          <p>Aquí encontrarás todas las invitaciones que has creado.</p>
        </header>
        {deleteError && (
          <p className="my-invitations-error" role="alert">
            {deleteError}
          </p>
        )}
        {loading ? (
          <section className="my-invitations-state" aria-live="polite">
            <span className="loader" />
            <p>Cargando tus invitaciones...</p>
          </section>
        ) : error ? (
          <section className="my-invitations-state" role="alert">
            <h2>No pudimos cargar tus invitaciones</h2>
            <p>{error}</p>
            <button className="primary-cta" type="button" onClick={load}>
              Reintentar
            </button>
          </section>
        ) : invitations.length === 0 ? (
          <section className="my-invitations-state">
            <h2>Aún no tienes invitaciones</h2>
            <p>Comienza y crea tu primera invitación.</p>
            <a className="primary-cta" href="/templates">
              Crear invitación
            </a>
          </section>
        ) : (
          <section
            className="my-invitations-grid"
            aria-label="Tus invitaciones"
          >
            {invitations.map((invitation) => (
              <article
                className="my-invitation-card"
                key={invitation.publicSlug}
              >
                <span className="my-invitation-status">Publicada</span>
                <h2>{invitation.eventName}</h2>
                <p className="my-invitation-person">
                  Para {invitation.honoreeName}
                </p>
                <dl>
                  <div>
                    <dt>Fecha</dt>
                    <dd>
                      {formatDate(invitation.eventDate)} ·{' '}
                      {invitation.eventTime}
                    </dd>
                  </div>
                  <div>
                    <dt>Lugar</dt>
                    <dd>{invitation.venueName}</dd>
                  </div>
                </dl>
                <div className="my-invitation-actions">
                  <a
                    className="primary-cta"
                    href={invitation.publicUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Ver invitación
                  </a>
                  <a
                    className="guest-button"
                    href={`/my-invitations/${invitation.publicSlug}/guests`}
                  >
                    Invitados
                  </a>
                  <button
                    className="delete-invitation"
                    type="button"
                    disabled={deleting === invitation.publicSlug}
                    onClick={() => void remove(invitation)}
                  >
                    {deleting === invitation.publicSlug
                      ? 'Eliminando...'
                      : 'Eliminar'}
                  </button>
                </div>
              </article>
            ))}
          </section>
        )}
      </main>
    </>
  )
}
