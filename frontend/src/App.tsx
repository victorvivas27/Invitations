import { lazy, Suspense } from 'react'
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom'
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
  return (
    <main
      className="boot-loader"
      aria-busy="true"
      aria-label="Cargando Mi Invitación"
    >
      <div className="boot-loader__content">
        <div className="boot-loader__mark" aria-hidden="true">
          <svg
            className="boot-loader__envelope"
            viewBox="0 0 48 48"
            fill="none"
          >
            <path
              d="M7 14.5A3.5 3.5 0 0 1 10.5 11h27a3.5 3.5 0 0 1 3.5 3.5v19a3.5 3.5 0 0 1-3.5 3.5h-27A3.5 3.5 0 0 1 7 33.5v-19Z"
              stroke="currentColor"
              strokeWidth="2.6"
            />
            <path
              d="m9 14 12.7 10.1a3.7 3.7 0 0 0 4.6 0L39 14M9 34l10.1-9M39 34l-10.1-9"
              stroke="currentColor"
              strokeWidth="2.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M33.5 7.5v5M31 10h5"
              stroke="#195baa"
              strokeWidth="2.4"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <p className="boot-loader__title">Mi Invitación</p>
        <p className="boot-loader__status">Preparando algo especial</p>
        <div className="boot-loader__progress" aria-hidden="true" />
      </div>
    </main>
  )
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
          </Suspense>
        </div>
      </BrowserRouter>
    </FeedbackProvider>
  )
}
