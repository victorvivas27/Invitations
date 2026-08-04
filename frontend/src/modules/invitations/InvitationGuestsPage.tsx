import { useEffect, useMemo, useState } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { PublicHeader } from '../../shared/components/layout/PublicHeader'
import { getAccessToken } from '../auth/services/authSession'
import {
  getInvitationGuests,
  type InvitationGuest,
} from './services/invitations'

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
    <>
      <PublicHeader activePage="my-invitations" />
      <main className="guests-page section-shell">
        <a className="guests-back" href="/my-invitations">
          ← Mis invitaciones
        </a>
        <header>
          <span className="pill">Confirmaciones</span>
          <h1>Invitados</h1>
          <p>Revisa quiénes asistirán y los mensajes que dejaron.</p>
        </header>
        {loading ? (
          <section className="my-invitations-state">
            <span className="loader" />
            <p>Cargando invitados...</p>
          </section>
        ) : error ? (
          <section className="my-invitations-state" role="alert">
            <h2>No pudimos cargar la lista</h2>
            <p>{error}</p>
          </section>
        ) : (
          <>
            <section
              className="guest-summary"
              aria-label="Resumen de invitados"
            >
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
                    <span
                      className={guest.attending ? 'guest-yes' : 'guest-no'}
                    >
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
      </main>
    </>
  )
}
