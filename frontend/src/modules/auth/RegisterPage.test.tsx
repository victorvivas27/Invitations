import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { RegisterPage } from './RegisterPage'

describe('RegisterPage', () => {
  afterEach(() => vi.restoreAllMocks())
  it('offers the fields required by the existing backend registration', () => {
    render(<MemoryRouter><RegisterPage /></MemoryRouter>)
    expect(
      screen.getByRole('heading', { name: 'Crea tu cuenta' }),
    ).toBeInTheDocument()
    for (const label of [
      'Nombre',
      'Apellido',
      'Correo electrónico',
      'Contraseña',
      'Confirmar contraseña',
    ])
      expect(screen.getByLabelText(label)).toBeRequired()
    expect(screen.getByRole('button', { name: 'Crear cuenta' })).toBeEnabled()
  })
  it('rejects mismatched passwords before calling the backend', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch')
    render(<MemoryRouter><RegisterPage /></MemoryRouter>)
    await userEvent.type(screen.getByLabelText('Nombre'), 'Ana')
    await userEvent.type(screen.getByLabelText('Apellido'), 'Pérez')
    await userEvent.type(
      screen.getByLabelText('Correo electrónico'),
      'ana@example.com',
    )
    await userEvent.type(screen.getByLabelText('Contraseña'), 'Password1')
    await userEvent.type(
      screen.getByLabelText('Confirmar contraseña'),
      'Password2',
    )
    await userEvent.click(screen.getByRole('button', { name: 'Crear cuenta' }))
    expect(screen.getByRole('alert')).toHaveTextContent(
      'Las contraseñas no coinciden.',
    )
    expect(fetchMock).not.toHaveBeenCalled()
  })
  it('shows an existing-account error without clearing the form', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(null, { status: 409 }),
    )
    render(<MemoryRouter><RegisterPage /></MemoryRouter>)
    await userEvent.type(screen.getByLabelText('Nombre'), 'Ana')
    await userEvent.type(screen.getByLabelText('Apellido'), 'Pérez')
    await userEvent.type(
      screen.getByLabelText('Correo electrónico'),
      'ana@example.com',
    )
    await userEvent.type(screen.getByLabelText('Contraseña'), 'Password1')
    await userEvent.type(
      screen.getByLabelText('Confirmar contraseña'),
      'Password1',
    )
    await userEvent.click(screen.getByRole('button', { name: 'Crear cuenta' }))
    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Ya existe una cuenta con ese correo electrónico.',
    )
    expect(screen.getByLabelText('Correo electrónico')).toHaveValue(
      'ana@example.com',
    )
  })
})
