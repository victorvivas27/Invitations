import { useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { AppLayout } from '../../shared/components/layout/AppLayout'
import { getAccessToken } from '../auth/services/authSession'
import {
  deleteInvitation,
  getInvitationViewUrl,
  getMyInvitations,
  InvitationApiError,
} from './services/invitations'
import type { OwnedInvitation } from './types/invitation'
import { AppModal } from '../../shared/components/feedback/AppModal'
import { useFeedback } from '../../shared/components/feedback/FeedbackProvider'
import { Skeleton } from '../../shared/components/feedback/Skeleton'

const formatDate = (value: string) =>
  new Intl.DateTimeFormat('es-CL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'America/Santiago',
  }).format(new Date(`${value}T12:00:00Z`))

function InvitationCardSkeleton() {
  return (
    <article className="my-invitation-card is-skeleton">
      <Skeleton className="skeleton-pill" />
      <Skeleton className="skeleton-title" />
      <Skeleton className="skeleton-line" width="55%" />
      <div className="skeleton-rows">
        <Skeleton className="skeleton-row" />
        <Skeleton className="skeleton-row" />
      </div>
      <Skeleton className="skeleton-action" />
    </article>
  )
}

export function MyInvitationsPage() {
  const [invitations, setInvitations] = useState<OwnedInvitation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [deleting, setDeleting] = useState('')
  const [deleteError, setDeleteError] = useState('')
  const [pendingDelete, setPendingDelete] = useState<OwnedInvitation | null>(
    null,
  )
  const { toast } = useFeedback()
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
    setDeleting(invitation.publicSlug)
    setDeleteError('')
    try {
      await deleteInvitation(invitation.publicSlug)
      setInvitations((current) =>
        current.filter((item) => item.publicSlug !== invitation.publicSlug),
      )
      setPendingDelete(null)
      toast('Invitación eliminada correctamente.', 'success')
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
    <AppLayout
      activePage="my-invitations"
      className="my-invitations section-shell"
    >
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
        <section
          className="my-invitations-grid"
          aria-busy="true"
          aria-label="Cargando tus invitaciones"
        >
          <InvitationCardSkeleton />
          <InvitationCardSkeleton />
          <InvitationCardSkeleton />
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
          <Link className="primary-cta" to="/templates">
            Crear invitación
          </Link>
        </section>
      ) : (
        <section className="my-invitations-grid" aria-label="Tus invitaciones">
          {invitations.map((invitation) => (
            <article className="my-invitation-card" key={invitation.publicSlug}>
              <span className="my-invitation-status">Publicada</span>
              <h2>{invitation.eventName}</h2>
              <p className="my-invitation-person">
                Para {invitation.honoreeName}
              </p>
              <dl>
                <div>
                  <dt>Fecha</dt>
                  <dd>
                    {formatDate(invitation.eventDate)} · {invitation.eventTime}
                  </dd>
                </div>
                <div>
                  <dt>Lugar</dt>
                  <dd>{invitation.venueName}</dd>
                </div>
              </dl>
              <div className="my-invitation-actions">
                <Link
                  className="primary-cta"
                  to={getInvitationViewUrl(
                    invitation.publicSlug,
                    invitation.metadataVersion,
                  )}
                >
                  Ver invitación
                </Link>
                <Link
                  className="guest-button"
                  to={`/my-invitations/${invitation.publicSlug}/guests`}
                >
                  Invitados
                </Link>

                <Link
                  className="guest-button"
                  to={`/my-invitations/${invitation.publicSlug}/edit`}
                >
                  Editar
                </Link>
                <button
                  className="delete-invitation"
                  type="button"
                  disabled={deleting === invitation.publicSlug}
                  onClick={() => {
                    setDeleteError('')
                    setPendingDelete(invitation)
                  }}
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
      <AppModal
        open={Boolean(pendingDelete)}
        variant="confirm"
        title="Eliminar invitación"
        description={`Esta acción eliminará permanentemente la invitación “${pendingDelete?.eventName ?? ''}”. Esta acción no se puede deshacer.`}
        confirmLabel="Eliminar"
        cancelLabel="Cancelar"
        loading={Boolean(deleting)}
        dismissible={false}
        onCancel={() => !deleting && setPendingDelete(null)}
        onConfirm={() => pendingDelete && void remove(pendingDelete)}
      />
      {deleteError && (
        <AppModal
          open
          variant="error"
          title="No pudimos eliminar la invitación"
          description={deleteError}
          confirmLabel="Reintentar"
          cancelLabel="Cerrar"
          onCancel={() => {
            setDeleteError('')
            setPendingDelete(null)
          }}
          onConfirm={() => pendingDelete && void remove(pendingDelete)}
        />
      )}
    </AppLayout>
  )
}
