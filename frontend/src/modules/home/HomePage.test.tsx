import { fireEvent, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { invitationTemplates } from '../templates/data/invitationTemplates'
import { HomePage } from './HomePage'

describe('HomePage redesign', () => {
  beforeEach(() => window.localStorage.clear())

  it('explains the web product and links both hero actions to templates', () => {
    render(<HomePage />)
    expect(screen.getByRole('heading', { level: 1, name: 'Crea invitaciones digitales que se sienten únicas' })).toBeInTheDocument()
    expect(screen.getByText(/invitación web personalizada/)).toBeInTheDocument()
    expect(screen.getByLabelText('Demostración de una invitación web real')).toHaveTextContent('Emilia')
    expect(screen.queryByText('Cumpleaños de Alex', { selector: '.invitation-preview h2' })).not.toBeInTheDocument()
    expect(screen.getAllByRole('link', { name: /Crear mi invitación|Ver plantillas/ })).toHaveLength(3)
    for (const link of screen.getAllByRole('link', { name: /Crear mi invitación|Ver plantillas/ })) expect(link).toHaveAttribute('href', '/templates')
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
  })

  it('uses real categories and featured template identifiers', () => {
    render(<HomePage />)
    for (const category of ['Cumpleaños', 'Bautismos', 'Matrimonios', 'Graduaciones']) expect(screen.getByRole('heading', { name: category })).toBeInTheDocument()
    const featured = invitationTemplates.filter((item) => item.isFeatured && item.isAvailable)
    const templateLinks = screen.getAllByRole('link', { name: /Usar esta plantilla/ })
    expect(templateLinks).toHaveLength(featured.length)
    featured.forEach((template) => expect(templateLinks.some((link) => link.getAttribute('href') === `/invitations/create?template=${template.id}`)).toBe(true))
  })

  it('shows actual and future capabilities honestly and includes the creator signature', () => {
    render(<HomePage />)
    expect(screen.getByText('Confirmación de asistencia')).toBeInTheDocument()
    expect(screen.getAllByText('Disponible').length).toBeGreaterThanOrEqual(4)
    expect(screen.getByText('Música personalizada')).toBeInTheDocument()
    expect(screen.getByText('Próximamente')).toBeInTheDocument()
    expect(screen.getByText('Creado por Victor Javier Vivas')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'victorjaviervivas@gmail.com' })).toHaveAttribute('href', 'mailto:victorjaviervivas@gmail.com')
  })

  it('keeps content visible without IntersectionObserver and has no page-level horizontal overflow class', () => {
    const { container } = render(<HomePage />)
    expect(container.querySelectorAll('.home-reveal:not(.is-visible)')).toHaveLength(0)
    expect(container.querySelector('.redesigned-home')).toHaveClass('redesigned-home')
    expect(container.querySelector('.product-demo .wizard-preview')).toBeInTheDocument()
  })

  it('opens, closes and updates the accessible mobile menu', async () => {
    render(<HomePage />)
    const trigger = screen.getByRole('button', { name: 'Abrir menú' })
    await userEvent.click(trigger)
    const menu = document.getElementById('mobile-menu')
    expect(within(menu!).getByRole('button', { name: 'Cerrar menú' })).toHaveFocus()
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(document.getElementById('mobile-menu')).not.toBeInTheDocument()
  })

  it('switches between light and dark themes and remembers the choice', async () => {
    render(<HomePage />)
    const toggles = screen.getAllByRole('button', { name: 'Cambiar a tema oscuro' })
    await userEvent.click(toggles[0])
    expect(document.documentElement).toHaveAttribute('data-theme', 'dark')
    expect(window.localStorage.getItem('invitation-theme')).toBe('dark')
    expect(screen.getAllByRole('button', { name: 'Cambiar a tema claro' }).length).toBeGreaterThan(0)
  })
})
