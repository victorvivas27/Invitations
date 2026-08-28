import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ReactNode } from 'react'
import { MemoryRouter, Route, Routes, useNavigate } from 'react-router-dom'
import { MyInvitationsPage } from './MyInvitationsPage'

const mocks = vi.hoisted(() => ({
  getMyInvitations: vi.fn(),
}))

vi.mock('../auth/services/authSession', () => ({
  getAccessToken: () => 'access-token',
}))

vi.mock('./services/invitations', () => ({
  deleteInvitation: vi.fn(),
  getInvitationViewUrl: (slug: string, version?: string) =>
    `/view/${encodeURIComponent(slug)}${version ? `?v=${encodeURIComponent(version)}` : ''}`,
  getMyInvitations: mocks.getMyInvitations,
  InvitationApiError: class InvitationApiError extends Error {},
}))

vi.mock('../../shared/components/layout/AppLayout', () => ({
  AppLayout: ({ children }: { children: ReactNode }) => <>{children}</>,
}))

vi.mock('../../shared/components/feedback/FeedbackProvider', () => ({
  useFeedback: () => ({ toast: vi.fn() }),
}))

function InvitationView() {
  const navigate = useNavigate()
  return (
    <main>
      <h1>Vista de la invitación</h1>
      <button type="button" onClick={() => navigate(-1)}>
        Volver
      </button>
    </main>
  )
}

describe('MyInvitationsPage navigation', () => {
  beforeEach(() => {
    mocks.getMyInvitations.mockResolvedValue([
      {
        publicSlug: 'cumpleanos-sofia-a8k3m2',
        publicUrl: '/i/cumpleanos-sofia-a8k3m2?v=1724360000000',
        templateId: 'birthday-urban',
        eventType: 'BIRTHDAY',
        eventName: 'Cumpleaños de Sofía',
        honoreeName: 'Sofía',
        eventDate: '2026-08-22',
        eventTime: '17:00',
        venueName: 'Salón Central',
        status: 'PUBLISHED',
        createdAt: '2026-08-01T12:00:00Z',
        metadataVersion: '1724360000000',
      },
    ])
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('keeps Mis invitaciones in history when opening an invitation', async () => {
    const user = userEvent.setup()

    render(
      <MemoryRouter initialEntries={['/my-invitations']}>
        <Routes>
          <Route path="/my-invitations" element={<MyInvitationsPage />} />
          <Route path="/view/:slug" element={<InvitationView />} />
        </Routes>
      </MemoryRouter>,
    )

    const link = await screen.findByRole('link', { name: 'Ver invitación' })
    expect(link).toHaveAttribute(
      'href',
      '/view/cumpleanos-sofia-a8k3m2?v=1724360000000',
    )
    expect(link).not.toHaveAttribute('target')

    await user.click(link)
    expect(
      screen.getByRole('heading', { name: 'Vista de la invitación' }),
    ).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Volver' }))
    expect(
      await screen.findByRole('heading', { name: 'Mis invitaciones' }),
    ).toBeInTheDocument()
  })
})
