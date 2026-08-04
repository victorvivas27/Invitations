import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { TemplatesPage } from './TemplatesPage'

describe('TemplatesPage', () => {
  beforeEach(() =>
    window.localStorage.setItem('invitation_access_token', 'safe-token'),
  )
  afterEach(() => window.localStorage.clear())

  it('offers one clear starting point without demo template cards', () => {
    render(
      <MemoryRouter>
        <TemplatesPage />
      </MemoryRouter>,
    )
    expect(
      screen.getByRole('heading', { name: 'Crea una invitación especial' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Empezar' })).toHaveAttribute(
      'href',
      '/invitations/create?template=birthday-urban',
    )
    expect(screen.queryByText('Cumpleaños urbano')).not.toBeInTheDocument()
  })
})
