import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { TemplatesPage } from './TemplatesPage'

describe('TemplatesPage', () => {
  beforeEach(() =>
    window.localStorage.setItem('invitation_access_token', 'safe-token'),
  )
  afterEach(() => window.localStorage.clear())

  it('offers a ready birthday template and the customizable base', () => {
    render(
      <MemoryRouter>
        <TemplatesPage />
      </MemoryRouter>,
    )
    expect(
      screen.getByRole('heading', { name: 'Plantillas para tu celebración' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: 'Usar esta plantilla' }),
    ).toHaveAttribute(
      'href',
      '/invitations/create?template=birthday-heroes-ready',
    )
    expect(
      screen.getByRole('link', { name: 'Comenzar desde la base' }),
    ).toHaveAttribute('href', '/invitations/create?template=birthday-urban')
  })
})
