import { useEffect, useMemo, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { AppLayout } from '../../shared/components/layout/AppLayout'
import { Skeleton } from '../../shared/components/feedback/Skeleton'
import { getAccessToken } from '../auth/services/authSession'
import {
  getInvitationGuests,
  type InvitationGuest,
} from './services/invitations'

function GuestsSkeleton() {
  return (
    <div aria-busy="true" aria-label="Cargando invitados">
      <section className="guest-summary">
        {[0, 1, 2].map((index) => (
          <div key={index}>
            <Skeleton className="skeleton-metric" />
            <Skeleton className="skeleton-line" width="70%" />
          </div>
        ))}
      </section>
      <section className="guest-list">
        {[0, 1].map((index) => (
          <article key={index} className="is-skeleton">
            <Skeleton className="skeleton-pill" />
            <Skeleton className="skeleton-title" />
            <Skeleton className="skeleton-line" width="45%" />
            <Skeleton className="skeleton-row" />
          </article>
        ))}
      </section>
    </div>
  )
}

export function InvitationGuestsPage() {
  const { slug = '' } = useParams()
  const [guests, setGuests] = useState<InvitationGuest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  useEffect(() => {
    if (getAccessToken())
      void getInvitationGuests(slug)
        .then(setGuests)
        .catch(() => setError('No fue posible cargar los invitados.'))
        .finally(() => setLoading(false))
  }, [slug])
  const summary = useMemo(
    () => ({
      confirmations: guests.filter((guest) => guest.attending).length,
      declined: guests.filter((guest) => !guest.attending).length,
      people: guests
        .filter((guest) => guest.attending)
        .reduce((total, guest) => total + guest.guestCount, 0),
    }),
    [guests],
  )
  if (!getAccessToken())
    return (
      <Navigate
        to={`/login?returnTo=${encodeURIComponent(`/my-invitations/${slug}/guests`)}`}
        replace
      />
    )
  return (
    <AppLayout
      activePage="my-invitations"
      className="guests-page section-shell"
    >
      <Link className="guests-back" to="/my-invitations">
        ← Mis invitaciones
      </Link>
      <header>
        <h1>Invitados</h1>
      </header>
      {loading ? (
        <GuestsSkeleton />
      ) : error ? (
        <section className="my-invitations-state" role="alert">
          <h2>No pudimos cargar la lista</h2>
          <p>{error}</p>
        </section>
      ) : (
        <>
          <section className="guest-summary" aria-label="Resumen de invitados">
            <div>
              <strong>{summary.people}</strong>
              <span>Personas confirmadas</span>
            </div>
            <div>
              <strong>{summary.confirmations}</strong>
              <span>Respuestas positivas</span>
            </div>
            <div>
              <strong>{summary.declined}</strong>
              <span>No asistirán</span>
            </div>
          </section>
          {guests.length === 0 ? (
            <section className="my-invitations-state">
              <h2>Todavía no hay respuestas</h2>
              <p>Las confirmaciones aparecerán aquí.</p>
            </section>
          ) : (
            <section className="guest-list" aria-label="Lista de invitados">
              {guests.map((guest) => (
                <article key={`${guest.name}-${guest.respondedAt}`}>
                  <span className={guest.attending ? 'guest-yes' : 'guest-no'}>
                    {guest.attending ? 'Asistirá' : 'No asistirá'}
                  </span>
                  <h2>{guest.name}</h2>
                  <p>
                    {guest.attending
                      ? `${guest.guestCount} ${guest.guestCount === 1 ? 'persona' : 'personas'}`
                      : 'Sin asistentes'}
                  </p>
                  {guest.message && <blockquote>{guest.message}</blockquote>}
                  <small>
                    {new Intl.DateTimeFormat('es-CL', {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    }).format(new Date(guest.respondedAt))}
                  </small>
                </article>
              ))}
            </section>
          )}
        </>
      )}
    </AppLayout>
  )
}
