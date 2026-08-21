import { render, screen } from '@testing-library/react'
import App from './App'

describe('public routes', () => {
  beforeEach(() => window.localStorage.clear())
  it('opens Home without authentication', async () => {
    window.history.pushState({}, '', '/')
    render(<App />)
    expect(
      await screen.findByRole('heading', {
        name: 'Crea invitaciones digitales que se sienten únicas',
      }),
    ).toBeInTheDocument()
  })

  it('keeps account activation public', async () => {
    window.history.pushState({}, '', '/activate-account')
    render(<App />)
    expect(
      await screen.findByRole('heading', {
        name: 'El enlace de activación no es válido.',
      }),
    ).toBeInTheDocument()
  })

  it('requires a JWT before showing templates', async () => {
    window.history.pushState({}, '', '/templates')
    render(<App />)
    expect(
      await screen.findByRole('heading', {
        name: 'Inicia sesión para crear tu invitación',
      }),
    ).toBeInTheDocument()
    expect(window.location.search).toContain('returnTo=%2Ftemplates')
  })

  it('shows templates and creation actions after login', async () => {
    window.localStorage.setItem('invitation_access_token', 'safe-token')
    window.history.pushState({}, '', '/')
    render(<App />)
    expect(
      await screen.findByRole('link', { name: 'Plantillas' }),
    ).toHaveAttribute('href', '/templates')
    expect(
      screen.getAllByRole('link', { name: 'Crear invitación' }).length,
    ).toBeGreaterThan(0)
    expect(
      screen.queryByRole('link', { name: 'Iniciar sesión' }),
    ).not.toBeInTheDocument()
  })
})
