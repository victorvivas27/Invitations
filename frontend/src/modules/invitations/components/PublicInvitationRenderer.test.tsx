import { render } from '@testing-library/react'
import { PublicInvitationRenderer } from './PublicInvitationRenderer'
import type { PublicInvitation } from '../types/invitation'

const invitation: PublicInvitation = {
  publicSlug: 'cumpleanos-sofia-a8k3m2',
  templateId: 'birthday-urban',
  eventType: 'BIRTHDAY',
  eventName: 'Cumpleaños de Sofía',
  honoreeName: 'Sofía',
  honoreeAge: 5,
  eventDate: '2027-01-23',
  eventTime: '17:00',
  venueName: 'Salón Central',
  address: 'Avenida Principal 123',
  mapsUrl: 'https://maps.app.goo.gl/example',
  heroImageUrl: 'https://example.test/hero.jpg',
  galleryImageUrls: [
    'https://example.test/1.jpg',
    'https://example.test/2.jpg',
    'https://example.test/3.jpg',
  ],
  message: 'Te esperamos para celebrar.',
  shareTitle: 'Cumpleaños de Sofía',
  shareDescription: '¡Estás invitado!',
  shareImageUrl: 'https://example.test/share.jpg',
}

type Callback = (
  entries: { target: Element; isIntersecting: boolean }[],
  observer: unknown,
) => void

const observers: FakeIntersectionObserver[] = []

class FakeIntersectionObserver {
  readonly observed = new Set<Element>()
  constructor(private readonly callback: Callback) {
    observers.push(this)
  }
  observe(element: Element) {
    this.observed.add(element)
  }
  unobserve(element: Element) {
    this.observed.delete(element)
  }
  disconnect() {
    this.observed.clear()
  }
  revealAll() {
    this.callback(
      [...this.observed].map((target) => ({ target, isIntersecting: true })),
      this,
    )
  }
  hideAll() {
    this.callback(
      [...this.observed].map((target) => ({ target, isIntersecting: false })),
      this,
    )
  }
}

describe('PublicInvitationRenderer animations', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it('marks every chapter of the invitation for reveal', () => {
    const { container } = render(
      <PublicInvitationRenderer invitation={invitation} />,
    )
    const marked = [...container.querySelectorAll('[data-reveal]')].map(
      (element) => element.getAttribute('data-reveal'),
    )
    // Portada (imagen + texto), frase, datos del evento, confirmación, sección
    // de fotos, cuadrícula escalonada y despedida (imagen + texto).
    expect(marked).toEqual([
      'media',
      'group',
      'group',
      'group',
      'group',
      'group',
      'group',
      'media',
      'group',
    ])
    // Ninguna sección completa se anima como bloque: eso movería su propio fondo
    // y es lo que se percibía como zoom en el teléfono.
    expect(container.querySelectorAll('[data-reveal="item"]')).toHaveLength(0)
  })

  it('shows the whole invitation when IntersectionObserver is unavailable', () => {
    const original = window.IntersectionObserver
    // @ts-expect-error se elimina a propósito para simular el navegador sin soporte
    delete window.IntersectionObserver
    const { container, getByText } = render(
      <PublicInvitationRenderer invitation={invitation} />,
    )
    // Sin .motion-ready ninguna regla de reveal.css aplica, así que nada queda
    // oculto de forma permanente.
    expect(container.querySelector('.motion-ready')).toBeNull()
    expect(getByText('Te esperamos para celebrar.')).toBeInTheDocument()
    expect(getByText('Salón Central')).toBeInTheDocument()
    window.IntersectionObserver = original
  })

  it('reveals, hides and reveals marked elements as they cross the viewport', () => {
    vi.stubGlobal('IntersectionObserver', FakeIntersectionObserver)
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((callback) => {
      callback(0)
      return 1
    })
    observers.length = 0
    const { container } = render(
      <PublicInvitationRenderer invitation={invitation} />,
    )
    const marked = container.querySelectorAll('[data-reveal]')
    const revealObserver = observers.find((observer) =>
      observer.observed.has(marked[0]),
    )!
    expect(revealObserver.observed.size).toBe(marked.length)

    revealObserver.revealAll()
    marked.forEach((element) => expect(element).toHaveClass('is-visible'))
    expect(revealObserver.observed.size).toBe(marked.length)
    revealObserver.hideAll()
    marked.forEach((element) => expect(element).not.toHaveClass('is-visible'))
    revealObserver.revealAll()
    marked.forEach((element) => expect(element).toHaveClass('is-visible'))
  })
})
