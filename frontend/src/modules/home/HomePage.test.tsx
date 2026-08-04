import { fireEvent, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { HomePage } from './HomePage'

describe('HomePage', () => {
  beforeEach(() => window.localStorage.clear())
  it('communicates the product and renders the invitation example', () => {
    render(<HomePage />)
    expect(screen.getAllByText('Mi Invitación').length).toBeGreaterThan(0)
    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'Crea invitaciones únicas para momentos inolvidables',
      }),
    ).toBeInTheDocument()
    expect(
      screen.getByText(/Diseña una invitación digital personalizada/),
    ).toBeInTheDocument()
    expect(
      screen.getAllByRole('link', { name: 'Iniciar sesión' })[0],
    ).toHaveAttribute('href', '/login')
    expect(
      screen.getByLabelText('Ejemplo de invitación digital'),
    ).toHaveTextContent('Cumpleaños de Alex')
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
  })

  it('renders every required section and representative categories', () => {
    render(<HomePage />)
    for (const heading of [
      'Una invitación para cada momento',
      'Crea tu invitación en pocos pasos',
      'Todo lo que necesitas para tu evento',
      'Tu próxima celebración comienza aquí',
    ]) {
      expect(screen.getByRole('heading', { name: heading })).toBeInTheDocument()
    }
    for (const category of [
      'Cumpleaños',
      'Bautismos',
      'Matrimonios',
      'Fiestas infantiles',
      'Otros eventos',
    ]) {
      expect(
        screen.getByRole('heading', { name: category }),
      ).toBeInTheDocument()
    }
    expect(screen.getByRole('contentinfo')).toBeInTheDocument()
  })

  it('uses valid internal navigation and marks future functionality honestly', () => {
    const { container } = render(<HomePage />)
    const ids = new Set(
      Array.from(container.querySelectorAll('[id]')).map(
        (node) => `#${node.id}`,
      ),
    )
    for (const link of screen.getAllByRole('link')) {
      const href = link.getAttribute('href')
      expect(href).toBeTruthy()
      if (href?.startsWith('#')) expect(ids.has(href)).toBe(true)
      else expect(href?.startsWith('/')).toBe(true)
    }
    expect(screen.getAllByText('Próximamente').length).toBeGreaterThanOrEqual(8)
    expect(
      screen.getByText('Confirmar asistencia · Próximamente'),
    ).toHaveAttribute('aria-disabled', 'true')
    expect(
      screen.getAllByRole('link', { name: 'Iniciar sesión' }).length,
    ).toBeGreaterThanOrEqual(2)
  })

  it('opens, closes and updates the accessible mobile menu', async () => {
    render(<HomePage />)
    const trigger = screen.getByRole('button', { name: 'Abrir menú' })
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
    await userEvent.click(trigger)
    expect(trigger).toHaveAttribute('aria-expanded', 'true')
    const menu = document.getElementById('mobile-menu')
    expect(menu).toBeInTheDocument()
    expect(
      within(menu!).getByRole('button', { name: 'Cerrar menú' }),
    ).toHaveFocus()
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(document.getElementById('mobile-menu')).not.toBeInTheDocument()
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
  })
})
