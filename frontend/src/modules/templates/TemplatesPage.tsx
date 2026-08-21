import { Link, Navigate } from 'react-router-dom'
import { AppLayout } from '../../shared/components/layout/AppLayout'
import { getAccessToken } from '../auth/services/authSession'

const startUrl = '/invitations/create?template=birthday-urban'

export function TemplatesPage() {
  if (!getAccessToken())
    return <Navigate to="/login?returnTo=%2Ftemplates" replace />
  return (
    <AppLayout
      activePage="templates"
      className="start-invitation-page section-shell"
      withFooter
    >
      <section className="start-invitation-card">
        <span className="start-symbol" aria-hidden="true">
          ✦
        </span>
        <span className="pill">Tu celebración comienza aquí</span>
        <h1>Crea una invitación especial</h1>
        <p>
          Agrega tus datos, personaliza cada sección y comparte un momento único
          con tus invitados.
        </p>
        <Link className="primary-cta" to={startUrl}>
          Empezar
        </Link>
      </section>
    </AppLayout>
  )
}
