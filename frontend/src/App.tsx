import { lazy, Suspense, useEffect } from 'react'
import {
  BrowserRouter,
  Link,
  Route,
  Routes,
  useLocation,
} from 'react-router-dom'
import './styles/globals.css'
import './shared/animation/reveal.css'
import foundationStyles from './shared/styles/foundation.module.css'
import templateStyles from './modules/templates/styles/Templates.module.css'
import invitationWizardStyles from './modules/invitations/styles/InvitationWizard.module.css'
import publicInvitationStyles from './modules/invitations/styles/PublicInvitation.module.css'
import './styles/theme.css'
import './styles/navigation.css'
import './styles/home-theme.css'
import './styles/auth.css'
import './styles/admin.css'
import { FeedbackProvider } from './shared/components/feedback/FeedbackProvider'
import { ScrollManager } from './shared/components/layout/ScrollManager'
import { hideBootLoaderAfterRender } from './shared/utils/bootLoader'

function NotFoundPage() {
  return (
    <main className="public-state">
      <span aria-hidden="true">?</span>
      <h1>Página no encontrada</h1>
      <p>La dirección ingresada no existe.</p>
      <Link className="primary-cta" to="/">
        Ir al inicio
      </Link>
    </main>
  )
}

const applicationStyles = {
  ...foundationStyles,
  ...templateStyles,
  ...invitationWizardStyles,
  ...publicInvitationStyles,
}

const HomePage = lazy(() =>
  import('./modules/home/HomePage').then((module) => ({
    default: module.HomePage,
  })),
)
const LoginPage = lazy(() =>
  import('./modules/auth/LoginPage').then((module) => ({
    default: module.LoginPage,
  })),
)
const RegisterPage = lazy(() =>
  import('./modules/auth/RegisterPage').then((module) => ({
    default: module.RegisterPage,
  })),
)
const ActivateAccountPage = lazy(() =>
  import('./modules/auth/ActivateAccountPage').then((module) => ({
    default: module.ActivateAccountPage,
  })),
)
const TemplatesPage = lazy(() =>
  import('./modules/templates/TemplatesPage').then((module) => ({
    default: module.TemplatesPage,
  })),
)
const CreateInvitationPage = lazy(() =>
  import('./modules/invitations/CreateInvitationPage').then((module) => ({
    default: module.CreateInvitationPage,
  })),
)
const InvitationGuestsPage = lazy(() =>
  import('./modules/invitations/InvitationGuestsPage').then((module) => ({
    default: module.InvitationGuestsPage,
  })),
)
const MyInvitationsPage = lazy(() =>
  import('./modules/invitations/MyInvitationsPage').then((module) => ({
    default: module.MyInvitationsPage,
  })),
)
const PublicInvitationPage = lazy(() =>
  import('./modules/invitations/PublicInvitationPage').then((module) => ({
    default: module.PublicInvitationPage,
  })),
)
const AdminUsersPage = lazy(() =>
  import('./modules/admin/AdminUsersPage').then((module) => ({
    default: module.AdminUsersPage,
  })),
)

function RouteFallback() {
  if (document.getElementById('boot-loader')) return null
  return (
    <main
      className="boot-loader"
      aria-busy="true"
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
        <p className="boot-loader__title">Mi Invitación</p>
        <p className="boot-loader__status">Preparando algo especial</p>
        <div className="boot-loader__progress" aria-hidden="true" />
      </div>
    </main>
  )
}

function BootLoaderReady() {
  const { pathname, search } = useLocation()

  useEffect(() => {
    if (
      pathname.startsWith('/i/') ||
      pathname.startsWith('/view/') ||
      pathname === '/admin/users'
    )
      return
    return hideBootLoaderAfterRender()
  }, [pathname, search])

  return null
}

export default function App() {
  void applicationStyles
  return (
    <FeedbackProvider>
      <BrowserRouter>
        {/* El contenedor persiste entre rutas: el fondo nunca se desmonta. */}
        <div className="app-shell">
          <ScrollManager />
          <Suspense fallback={<RouteFallback />}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route
                path="/activate-account"
                element={<ActivateAccountPage />}
              />
              <Route path="/templates" element={<TemplatesPage />} />
              <Route
                path="/invitations/create"
                element={<CreateInvitationPage />}
              />
              <Route path="/my-invitations" element={<MyInvitationsPage />} />
              <Route path="/admin/users" element={<AdminUsersPage />} />
              <Route
                path="/my-invitations/:slug/guests"
                element={<InvitationGuestsPage />}
              />
              <Route path="/i/:slug" element={<PublicInvitationPage />} />
              <Route path="/view/:slug" element={<PublicInvitationPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="*" element={<NotFoundPage />} />
              <Route
                path="/my-invitations/:slug/edit"
                element={<CreateInvitationPage />}
              />
            </Routes>
            <BootLoaderReady />
          </Suspense>
        </div>
      </BrowserRouter>
    </FeedbackProvider>
  )
}
