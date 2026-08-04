import { afterEach, describe, expect, it, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { ActivateAccountPage } from './ActivateAccountPage'

const token = 'safe-token'

function response(status: number, message = ''): Response {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => ({ message }),
  } as Response
}

function renderPage(query = `?token=${token}`) {
  return render(
    <MemoryRouter initialEntries={[`/activate-account${query}`]}>
      <ActivateAccountPage />
    </MemoryRouter>,
  )
}

afterEach(() => vi.unstubAllGlobals())

describe('ActivateAccountPage', () => {
  it('shows validation while requesting the encoded token', () => {
    const fetchMock = vi.fn(() => new Promise<Response>(() => undefined))
    vi.stubGlobal('fetch', fetchMock)
    renderPage('?token=a%2Fb')

    expect(
      screen.getByRole('heading', { name: 'Validando enlace…' }),
    ).toBeInTheDocument()
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('token=a%2Fb'),
    )
  })

  it('does not request or show a form when token is absent', () => {
    const fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)
    renderPage('')

    expect(
      screen.getByText('El enlace de activación no es válido.'),
    ).toBeInTheDocument()
    expect(fetchMock).not.toHaveBeenCalled()
    expect(screen.queryByLabelText('Nueva contraseña')).not.toBeInTheDocument()
  })

  it('shows the password form for a valid token', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(response(200)))
    renderPage()

    expect(
      await screen.findByRole('heading', { name: 'Crea tu contraseña' }),
    ).toBeInTheDocument()
    expect(screen.getByLabelText('Nueva contraseña')).toHaveAttribute(
      'autocomplete',
      'new-password',
    )
    expect(screen.getByLabelText('Confirmar contraseña')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Activar cuenta' })).toBeEnabled()
  })

  it.each([
    [404, '', 'El enlace de activación no es válido.'],
    [
      410,
      'Activation token has expired',
      'El enlace de activación ha vencido.',
    ],
    [
      410,
      'Activation token was already used',
      'Este enlace de activación ya fue utilizado.',
    ],
  ])(
    'maps token response %s to a controlled state',
    async (status, message, expected) => {
      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue(response(status, message)),
      )
      renderPage()

      expect(
        await screen.findByRole('heading', { name: expected }),
      ).toBeInTheDocument()
      expect(
        screen.queryByLabelText('Nueva contraseña'),
      ).not.toBeInTheDocument()
    },
  )

  it('rejects different passwords without completing activation', async () => {
    const fetchMock = vi.fn().mockResolvedValue(response(200))
    vi.stubGlobal('fetch', fetchMock)
    renderPage()
    const user = userEvent.setup()
    await screen.findByLabelText('Nueva contraseña')

    await user.type(screen.getByLabelText('Nueva contraseña'), 'Password1')
    await user.type(screen.getByLabelText('Confirmar contraseña'), 'Password2')
    await user.click(screen.getByRole('button', { name: 'Activar cuenta' }))

    expect(screen.getByRole('alert')).toHaveTextContent(
      'Las contraseñas no coinciden.',
    )
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('sends only token and password and shows success', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(response(200))
      .mockResolvedValueOnce(response(204))
    vi.stubGlobal('fetch', fetchMock)
    renderPage()
    const user = userEvent.setup()
    await screen.findByLabelText('Nueva contraseña')

    await user.type(screen.getByLabelText('Nueva contraseña'), 'Password1')
    await user.type(screen.getByLabelText('Confirmar contraseña'), 'Password1')
    await user.click(screen.getByRole('button', { name: 'Activar cuenta' }))

    expect(
      await screen.findByRole('heading', {
        name: 'Cuenta activada correctamente.',
      }),
    ).toBeInTheDocument()
    const options = fetchMock.mock.calls[1][1] as RequestInit
    expect(JSON.parse(options.body as string)).toEqual({
      token,
      password: 'Password1',
    })
    expect(
      screen.getByRole('link', { name: 'Ir al inicio de sesión' }),
    ).toHaveAttribute('href', '/login')
  })

  it('disables the form and prevents duplicate completion', async () => {
    const pending = new Promise<Response>(() => undefined)
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(response(200))
      .mockReturnValueOnce(pending)
    vi.stubGlobal('fetch', fetchMock)
    renderPage()
    const user = userEvent.setup()
    await screen.findByLabelText('Nueva contraseña')
    await user.type(screen.getByLabelText('Nueva contraseña'), 'Password1')
    await user.type(screen.getByLabelText('Confirmar contraseña'), 'Password1')

    await user.click(screen.getByRole('button', { name: 'Activar cuenta' }))

    await waitFor(() =>
      expect(
        screen.getByRole('button', { name: 'Activando cuenta…' }),
      ).toBeDisabled(),
    )
    expect(fetchMock).toHaveBeenCalledTimes(2)
  })
})
