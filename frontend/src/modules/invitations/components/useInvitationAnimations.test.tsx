import { render } from '@testing-library/react'
import { useRef } from 'react'
import { useInvitationAnimations } from './useInvitationAnimations'

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
  emit(element: Element, isIntersecting: boolean) {
    this.callback([{ target: element, isIntersecting }], this)
  }
}

function Harness() {
  const experience = useRef<HTMLDivElement>(null)
  useInvitationAnimations(experience, true, 'scroll', 'key')
  return (
    <div ref={experience}>
      <section className="experience-animate" data-testid="chapter" />
    </div>
  )
}

describe('useInvitationAnimations', () => {
  beforeEach(() => {
    observers.length = 0
    vi.stubGlobal('IntersectionObserver', FakeIntersectionObserver)
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((callback) => {
      callback(0)
      return 1
    })
  })
  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it('reveals each chapter once and stops observing it', () => {
    const { getByTestId } = render(<Harness />)
    const chapter = getByTestId('chapter')
    const [observer] = observers
    expect(observer.observed.has(chapter)).toBe(true)

    observer.emit(chapter, true)
    expect(chapter).toHaveClass('is-visible')
    expect(observer.observed.has(chapter)).toBe(false)
  })

  it('keeps a revealed chapter visible when it leaves the viewport', () => {
    const { getByTestId } = render(<Harness />)
    const chapter = getByTestId('chapter')
    const [observer] = observers

    observer.emit(chapter, true)
    observer.emit(chapter, false)
    expect(chapter).toHaveClass('is-visible')
  })
})
