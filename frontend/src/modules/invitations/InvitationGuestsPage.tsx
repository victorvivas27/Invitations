import { useEffect, useMemo, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { AppLayout } from '../../shared/components/layout/AppLayout'
import { Skeleton } from '../../shared/components/feedback/Skeleton'
import { getAccessToken } from '../auth/services/authSession'
import {
  deleteInvitationGuest,
  getInvitationGuests,
  updateInvitationGuest,
  type InvitationGuest,
} from './services/invitations'

const DELETE_DELAY_MS = 4000

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
  const [editing, setEditing] = useState<InvitationGuest | null>(null)
  const [saving, setSaving] = useState(false)
  const [editError, setEditError] = useState('')
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [deleteError, setDeleteError] = useState('')
  const saveGuest = async () => {
    if (!editing || !editing.name.trim()) return
    setSaving(true)
    setEditError('')
    try {
      const updated = await updateInvitationGuest(slug, editing.id, {
        name: editing.name,
        attending: editing.attending,
        guestCount: editing.guestCount,
        message: editing.message,
      })
      setGuests((current) =>
        current.map((guest) => (guest.id === updated.id ? updated : guest)),
      )
      setEditing(null)
    } catch {
      setEditError('No fue posible guardar la confirmación.')
    } finally {
      setSaving(false)
    }
  }
  useEffect(() => {
    if (!pendingDeleteId) return
    const guestId = pendingDeleteId
    const timer = window.setTimeout(() => {
      setDeletingId(guestId)
      void deleteInvitationGuest(slug, guestId)
        .then(() => {
          setGuests((current) =>
            current.filter((guest) => guest.id !== guestId),
          )
          setPendingDeleteId((current) =>
            current === guestId ? null : current,
          )
        })
        .catch(() => {
          setPendingDeleteId((current) =>
            current === guestId ? null : current,
          )
          setDeleteError(
            'No fue posible eliminar al invitado. Inténtalo nuevamente.',
          )
        })
        .finally(() => setDeletingId(null))
    }, DELETE_DELAY_MS)
    return () => window.clearTimeout(timer)
  }, [pendingDeleteId, slug])
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
          {deleteError && (
            <p className="guest-delete-error" role="alert">
              {deleteError}
            </p>
          )}
          {guests.length === 0 ? (
            <section className="my-invitations-state">
              <h2>Todavía no hay respuestas</h2>
              <p>Las confirmaciones aparecerán aquí.</p>
            </section>
          ) : (
            <section className="guest-list" aria-label="Lista de invitados">
              {guests.map((guest) => (
                <article key={guest.id}>
                  {editing?.id === guest.id ? (
                    <div className="guest-edit-form">
                      <label>
                        Nombre
                        <input
                          maxLength={120}
                          value={editing.name}
                          onChange={(event) =>
                            setEditing({ ...editing, name: event.target.value })
                          }
                        />
                      </label>
                      <label>
                        Respuesta
                        <select
                          value={editing.attending ? 'yes' : 'no'}
                          onChange={(event) =>
                            setEditing({
                              ...editing,
                              attending: event.target.value === 'yes',
                            })
                          }
                        >
                          <option value="yes">Asistirá</option>
                          <option value="no">No asistirá</option>
                        </select>
                      </label>
                      {editing.attending && (
                        <label>
                          Personas
                          <input
                            type="number"
                            min="1"
                            max="20"
                            value={editing.guestCount}
                            onChange={(event) =>
                              setEditing({
                                ...editing,
                                guestCount: Number(event.target.value),
                              })
                            }
                          />
                        </label>
                      )}
                      <label>
                        Mensaje
                        <textarea
                          maxLength={500}
                          value={editing.message ?? ''}
                          onChange={(event) =>
                            setEditing({
                              ...editing,
                              message: event.target.value,
                            })
                          }
                        />
                      </label>
                      {editError && <p role="alert">{editError}</p>}
                      <div className="guest-edit-actions">
                        <button
                          type="button"
                          disabled={saving}
                          onClick={() => setEditing(null)}
                        >
                          Cancelar
                        </button>
                        <button
                          type="button"
                          disabled={saving || !editing.name.trim()}
                          onClick={() => void saveGuest()}
                        >
                          {saving ? 'Guardando…' : 'Guardar'}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
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
                      {guest.message && (
                        <blockquote>{guest.message}</blockquote>
                      )}
                      <small>
                        {new Intl.DateTimeFormat('es-CL', {
                          dateStyle: 'medium',
                          timeStyle: 'short',
                        }).format(new Date(guest.respondedAt))}
                      </small>
                      <div className="guest-card-actions">
                        <button
                          className="guest-edit-button"
                          type="button"
                          onClick={() => {
                            setEditError('')
                            setEditing({ ...guest })
                          }}
                        >
                          <svg
                            aria-hidden="true"
                            viewBox="0 0 24 24"
                            fill="none"
                          >
                            <path
                              d="M13.5 6.5 17.5 10.5M4 20l4.25-.85L19 6.4a2.12 2.12 0 0 0-3-3L5.15 16.25 4 20Z"
                              stroke="currentColor"
                              strokeWidth="1.8"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          Editar
                        </button>
                        <button
                          className={`guest-delete-button${pendingDeleteId === guest.id ? ' is-armed' : ''}`}
                          type="button"
                          disabled={deletingId !== null}
                          aria-label={
                            pendingDeleteId === guest.id
                              ? `Cancelar eliminación de ${guest.name}`
                              : `Eliminar a ${guest.name}`
                          }
                          aria-pressed={pendingDeleteId === guest.id}
                          onClick={() => {
                            setDeleteError('')
                            setPendingDeleteId((current) =>
                              current === guest.id ? null : guest.id,
                            )
                          }}
                        >
                          <svg
                            className="guest-delete-icon"
                            aria-hidden="true"
                            viewBox="0 0 44 44"
                            fill="none"
                          >
                            {pendingDeleteId === guest.id && (
                              <>
                                <circle
                                  className="guest-delete-track"
                                  cx="22"
                                  cy="22"
                                  r="19"
                                />
                                <circle
                                  className="guest-delete-progress"
                                  cx="22"
                                  cy="22"
                                  r="19"
                                  pathLength="1"
                                />
                              </>
                            )}
                            <g
                              className="guest-delete-symbol"
                              transform="translate(10 10)"
                            >
                              <path
                                d={
                                  pendingDeleteId === guest.id
                                    ? 'M7 7l10 10M17 7 7 17'
                                    : 'M5 7h14M9 7V4h6v3m2 0-.75 12h-8.5L7 7m3.25 4v4.5m3.5-4.5v4.5'
                                }
                                stroke="currentColor"
                                strokeWidth="1.9"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </g>
                          </svg>
                        </button>
                      </div>
                    </>
                  )}
                </article>
              ))}
            </section>
          )}
        </>
      )}
    </AppLayout>
  )
}
