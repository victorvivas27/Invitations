import { Navigate } from 'react-router-dom'
import { PublicFooter } from '../../shared/components/layout/PublicFooter'
import { PublicHeader } from '../../shared/components/layout/PublicHeader'
import { getAccessToken } from '../auth/services/authSession'

const startUrl = '/invitations/create?template=birthday-urban'

export function TemplatesPage() {
  if (!getAccessToken())
    return <Navigate to="/login?returnTo=%2Ftemplates" replace />
  return (
    <>
      <PublicHeader activePage="templates" />
      <main className="start-invitation-page section-shell">
        <section className="start-invitation-card">
          <span className="start-symbol" aria-hidden="true">
            ✦
          </span>
          <span className="pill">Tu celebración comienza aquí</span>
          <h1>Crea una invitación especial</h1>
          <p>
            Agrega tus datos, personaliza cada sección y comparte un momento
            único con tus invitados.
          </p>
          <a className="primary-cta" href={startUrl}>
            Empezar
          </a>
        </section>
      </main>
      <PublicFooter />
    </>
  )
}
