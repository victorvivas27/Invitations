import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { ActivateAccountPage, LoginPage, RegisterPage } from './modules/auth'
import { HomePage } from './modules/home'
import {
  CreateInvitationPage,
  InvitationGuestsPage,
  MyInvitationsPage,
  PublicInvitationPage,
} from './modules/invitations'
import { TemplatesPage } from './modules/templates'
import './styles/globals.css'
import foundationStyles from './shared/styles/foundation.module.css'
import templateStyles from './modules/templates/styles/Templates.module.css'
import invitationWizardStyles from './modules/invitations/styles/InvitationWizard.module.css'
import publicInvitationStyles from './modules/invitations/styles/PublicInvitation.module.css'

function NotFoundPage() {
  return (
    <main className="public-state">
      <span aria-hidden="true">?</span>
      <h1>Página no encontrada</h1>
      <p>La dirección ingresada no existe.</p>
      <a className="primary-cta" href="/">
        Ir al inicio
      </a>
    </main>
  )
}

const applicationStyles = {
  ...foundationStyles,
  ...templateStyles,
  ...invitationWizardStyles,
  ...publicInvitationStyles,
}

export default function App() {
  void applicationStyles
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/activate-account" element={<ActivateAccountPage />} />
        <Route path="/templates" element={<TemplatesPage />} />
        <Route path="/invitations/create" element={<CreateInvitationPage />} />
        <Route path="/my-invitations" element={<MyInvitationsPage />} />
        <Route
          path="/my-invitations/:slug/guests"
          element={<InvitationGuestsPage />}
        />
        <Route path="/i/:slug" element={<PublicInvitationPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}
