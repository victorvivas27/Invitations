import { render } from '@testing-library/react'
import { useRef } from 'react'
import revealStylesheet from './reveal.css?raw'
import { useRevealGroup } from './useReveal'

type Callback = (
  entries: { target: Element; isIntersecting: boolean }[],
  observer: unknown,
) => void

const observers: FakeIntersectionObserver[] = []

class FakeIntersectionObserver {
  readonly observed = new Set<Element>()
  constructor(
    private readonly callback: Callback,
    readonly options?: IntersectionObserverInit,
  ) {
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
  emit(element: Element, isIntersecting: boolean) {
    this.callback([{ target: element, isIntersecting }], this)
  }
}

function Harness({ once }: { once?: boolean }) {
  const container = useRef<HTMLDivElement>(null)
  useRevealGroup(container, { once, rootIsContainer: true })
  return (
    <div ref={container}>
      <section data-reveal="group" data-testid="section">
        <h2>Reserva este momento</h2>
      </section>
    </div>
  )
}

describe('useRevealGroup', () => {
  beforeEach(() => {
    observers.length = 0
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((callback) => {
      callback(0)
      return 1
    })
  })
  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it('does not hide anything when IntersectionObserver is unavailable', () => {
    const original = window.IntersectionObserver
    // @ts-expect-error se elimina a propósito para simular el navegador sin soporte
    delete window.IntersectionObserver
    const { container, getByTestId } = render(<Harness />)
    expect(container.firstElementChild).not.toHaveClass('motion-ready')
    expect(getByTestId('section')).not.toHaveClass('is-visible')
    window.IntersectionObserver = original
  })

  it('reveals a marked element once and stops observing it', () => {
    vi.stubGlobal('IntersectionObserver', FakeIntersectionObserver)
    const { container, getByTestId } = render(<Harness />)
    const section = getByTestId('section')
    const [observer] = observers
    expect(container.firstElementChild).toHaveClass('motion-ready')
    expect(observer.observed.has(section)).toBe(true)

    observer.emit(section, true)
    expect(section).toHaveClass('is-visible')
    expect(observer.observed.has(section)).toBe(false)

    observer.emit(section, false)
    expect(section).toHaveClass('is-visible')
  })

  it('can be configured to hide again on exit', () => {
    vi.stubGlobal('IntersectionObserver', FakeIntersectionObserver)
    const { getByTestId } = render(<Harness once={false} />)
    const section = getByTestId('section')
    const [observer] = observers

    observer.emit(section, true)
    expect(section).toHaveClass('is-visible')
    observer.emit(section, false)
    expect(section).not.toHaveClass('is-visible')
  })

  it('triggers on entry distance rather than on a share of the element height', () => {
    vi.stubGlobal('IntersectionObserver', FakeIntersectionObserver)
    render(<Harness />)
    // Un threshold por proporción se dispara en puntos distintos según la altura
    // del elemento frente al viewport, que es lo que difería entre móvil y
    // escritorio.
    expect(observers[0].options?.threshold).toBe(0)
    expect(observers[0].options?.rootMargin).toBe('0px 0px -12% 0px')
  })
})

describe('reveal.css', () => {
  // Se comparan las declaraciones, no los comentarios: el propio archivo
  // documenta qué propiedades están prohibidas.
  const source = revealStylesheet.replace(/\/\*[\s\S]*?\*\//g, '')
  const token = (name: string) => {
    const match = new RegExp(`--${name}:\\s*([^;]+);`).exec(source)
    if (!match) throw new Error(`Falta el token --${name}`)
    return match[1].trim()
  }
  const milliseconds = (name: string) => Number.parseInt(token(name), 10)

  it('keeps every duration between 700ms and 1.2s', () => {
    for (const name of ['reveal-duration', 'reveal-duration-media']) {
      expect(milliseconds(name)).toBeGreaterThanOrEqual(700)
      expect(milliseconds(name)).toBeLessThanOrEqual(1200)
    }
  })

  it('keeps the stagger step between 80ms and 150ms', () => {
    expect(milliseconds('reveal-stagger')).toBeGreaterThanOrEqual(80)
    expect(milliseconds('reveal-stagger')).toBeLessThanOrEqual(150)
  })

  it('scales images by at most 0.98 and never scales anything else', () => {
    expect(
      Number.parseFloat(token('reveal-image-scale')),
    ).toBeGreaterThanOrEqual(0.98)
    const scaleUses = source.match(/transform:[^;]*scale\(/g) ?? []
    expect(scaleUses).toHaveLength(1)
    expect(source).toMatch(
      /\[data-reveal='media'\] > img \{[^}]*transform: scale\(/,
    )
  })

  it('never animates typographic properties', () => {
    for (const property of [
      'font-size',
      'font-weight',
      'line-height',
      'letter-spacing',
    ])
      expect(source).not.toContain(property)
  })

  it('neutralises the reveals under prefers-reduced-motion', () => {
    expect(source).toMatch(/@media \(prefers-reduced-motion: reduce\)/)
  })
})
