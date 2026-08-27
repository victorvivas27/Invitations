import { Link, Navigate } from 'react-router-dom'
import { AppLayout } from '../../shared/components/layout/AppLayout'
import { getAccessToken } from '../auth/services/authSession'

export function TemplatesPage() {
  if (!getAccessToken())
    return <Navigate to="/login?returnTo=%2Ftemplates" replace />

  return (
    <AppLayout
      activePage="templates"
      className="templates-choice-page section-shell"
      withFooter
    >
      <header className="templates-choice-heading">
        <span className="pill">Elige tu punto de partida</span>
        <h1>Plantillas para tu celebración</h1>
        <p>
          Puedes comenzar con el diseño actual o elegir una invitación de
          cumpleaños que ya viene preparada.
        </p>
      </header>

      <section
        className="template-choice-grid"
        aria-label="Plantillas disponibles"
      >
        <article className="template-choice-card is-ready">
          <div className="template-choice-art" aria-hidden="true">
            <i>🎈</i>
            <strong>¡Mi cumpleaños!</strong>
            <span>🦸 🎉 🎁</span>
          </div>
          <div className="template-choice-copy">
            <span className="badge-featured">Prediseñada</span>
            <h2>Cumpleaños de héroes</h2>
            <p>
              Textos, globos, confites, regalos y secciones listas para
              completar con tus datos.
            </p>
            <Link
              className="primary-cta"
              to="/invitations/create?template=birthday-heroes-ready"
            >
              Usar esta plantilla
            </Link>
          </div>
        </article>

        <article className="template-choice-card">
          <div className="template-choice-art is-base" aria-hidden="true">
            <i>✦</i>
            <strong>Tu celebración</strong>
            <span>Diseña a tu manera</span>
          </div>
          <div className="template-choice-copy">
            <span className="badge-available">Base actual</span>
            <h2>Diseño personalizable</h2>
            <p>
              Comienza con la estructura actual y decide cada texto y detalle
              durante la creación.
            </p>
            <Link
              className="primary-cta"
              to="/invitations/create?template=birthday-urban"
            >
              Comenzar desde la base
            </Link>
          </div>
        </article>
      </section>
    </AppLayout>
  )
}
