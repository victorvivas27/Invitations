import { act, fireEvent, render, screen } from '@testing-library/react'
import type { ReactNode } from 'react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { InvitationGuestsPage } from './InvitationGuestsPage'

const mocks = vi.hoisted(() => ({
  deleteInvitationGuest: vi.fn(),
  getInvitationGuests: vi.fn(),
  updateInvitationGuest: vi.fn(),
}))

vi.mock('../auth/services/authSession', () => ({
  getAccessToken: () => 'access-token',
}))

vi.mock('./services/invitations', () => mocks)

vi.mock('../../shared/components/layout/AppLayout', () => ({
  AppLayout: ({ children }: { children: ReactNode }) => <>{children}</>,
}))

function renderPage() {
  return render(
    <MemoryRouter initialEntries={['/my-invitations/fiesta/guests']}>
      <Routes>
        <Route
          path="/my-invitations/:slug/guests"
          element={<InvitationGuestsPage />}
        />
      </Routes>
    </MemoryRouter>,
  )
}

describe('InvitationGuestsPage guest deletion', () => {
  beforeEach(() => {
    mocks.getInvitationGuests.mockResolvedValue([
      {
        id: 'guest-1',
        name: 'Ana Pérez',
        guestCount: 2,
        attending: true,
        message: 'Nos vemos',
        respondedAt: '2026-08-28T12:00:00Z',
      },
    ])
    mocks.deleteInvitationGuest.mockResolvedValue(undefined)
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.clearAllMocks()
  })

  it('arms, cancels and deletes only after the countdown finishes', async () => {
    renderPage()
    const deleteButton = await screen.findByRole('button', {
      name: 'Eliminar a Ana Pérez',
    })
    vi.useFakeTimers()

    fireEvent.click(deleteButton)
    expect(
      screen.getByRole('button', { name: 'Cancelar eliminación de Ana Pérez' }),
    ).toHaveAttribute('aria-pressed', 'true')

    fireEvent.click(deleteButton)
    await act(() => vi.advanceTimersByTimeAsync(4000))
    expect(mocks.deleteInvitationGuest).not.toHaveBeenCalled()

    fireEvent.click(deleteButton)
    await act(() => vi.advanceTimersByTimeAsync(4000))

    expect(mocks.deleteInvitationGuest).toHaveBeenCalledWith(
      'fiesta',
      'guest-1',
    )
    expect(screen.queryByText('Ana Pérez')).not.toBeInTheDocument()
  })
})
