import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { PublicInvitationPage } from './PublicInvitationPage'
const invitation = {
  publicSlug: 'cumpleanos-sofia-a8k3m2',
  templateId: 'birthday-urban',
  eventType: 'BIRTHDAY',
  eventName: 'Cumpleaños de Sofía',
  honoreeName: 'Sofía',
  honoreeAge: 5,
  eventDate: '2026-08-22',
  eventTime: '17:00',
  venueName: 'Salón Central',
  address: 'Avenida Principal 123',
  mapsUrl: 'https://maps.app.goo.gl/example',
  message: 'Te esperamos para celebrar.',
}
const renderPage = () =>
  render(
    <MemoryRouter initialEntries={['/i/cumpleanos-sofia-a8k3m2']}>
      <Routes>
        <Route path="/i/:slug" element={<PublicInvitationPage />} />
      </Routes>
    </MemoryRouter>,
  )
describe('PublicInvitationPage', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })
  it('loads a public invitation by encoded slug and renders its template', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify(invitation), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    )
    renderPage()
    expect(
      screen.getByRole('heading', { name: 'Cargando invitación...' }),
    ).toBeInTheDocument()
    expect(
      await screen.findByRole('heading', { level: 1, name: 'Sofía' }),
    ).toBeInTheDocument()
    expect(screen.getByText('sábado, 22 de agosto de 2026')).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: 'Abrir en Google Maps' }),
    ).toHaveAttribute('href', invitation.mapsUrl)
    expect(screen.queryByText('NaN')).not.toBeInTheDocument()
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining(
        '/api/public/invitations/cumpleanos-sofia-a8k3m2',
      ),
      undefined,
    )
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
  })
  it('hides whether a missing invitation ever existed', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ message: 'Invitation not found' }), {
        status: 404,
      }),
    )
    renderPage()
    expect(
      await screen.findByRole('heading', {
        name: 'Esta invitación no está disponible.',
      }),
    ).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Ir al inicio' })).toHaveAttribute(
      'href',
      '/',
    )
  })
  it('shows a retry action after a network error', async () => {
    const fetchMock = vi
      .spyOn(globalThis, 'fetch')
      .mockRejectedValueOnce(new TypeError('network'))
      .mockResolvedValueOnce(
        new Response(JSON.stringify(invitation), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
      )
    renderPage()
    await userEvent.click(
      await screen.findByRole('button', { name: 'Reintentar' }),
    )
    expect(
      await screen.findByRole('heading', { name: 'Sofía' }),
    ).toBeInTheDocument()
    expect(fetchMock).toHaveBeenCalledTimes(2)
  })
})
