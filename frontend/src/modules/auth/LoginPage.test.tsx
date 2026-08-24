import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { LoginPage } from './LoginPage'

describe('LoginPage', () => {
  afterEach(() => vi.restoreAllMocks())
  it('shows an accessible real login form', () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>,
    )
    expect(
      screen.getByRole('heading', {
        name: 'Inicia sesión para crear tu invitación',
      }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('textbox', { name: 'Correo electrónico' }),
    ).toBeRequired()
    expect(screen.getByLabelText('Contraseña')).toBeRequired()
    expect(screen.getByRole('button', { name: 'Iniciar sesión' })).toBeEnabled()
    expect(screen.getByRole('link', { name: 'Crear cuenta' })).toHaveAttribute(
      'href',
      '/register?returnTo=%2Ftemplates',
    )
  })
  it('shows invalid credentials without losing entered email', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(null, { status: 401 }),
    )
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>,
    )
    await userEvent.type(
      screen.getByRole('textbox', { name: 'Correo electrónico' }),
      'user@example.com',
    )
    await userEvent.type(screen.getByLabelText('Contraseña'), 'wrong')
    await userEvent.click(
      screen.getByRole('button', { name: 'Iniciar sesión' }),
    )
    expect(await screen.findByRole('alert')).toHaveTextContent(
      'El correo o la contraseña no son correctos.',
    )
    expect(
      screen.getByRole('textbox', { name: 'Correo electrónico' }),
    ).toHaveValue('user@example.com')
  })

  it('allows showing and hiding the password', async () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>,
    )
    const password = screen.getByLabelText('Contraseña')
    expect(password).toHaveAttribute('type', 'password')

    await userEvent.click(
      screen.getByRole('button', { name: 'Mostrar contraseña' }),
    )
    expect(password).toHaveAttribute('type', 'text')

    await userEvent.click(
      screen.getByRole('button', { name: 'Ocultar contraseña' }),
    )
    expect(password).toHaveAttribute('type', 'password')
  })
})
