describe('hideBootLoader', () => {
  beforeEach(() => vi.useFakeTimers())

  afterEach(() => {
    vi.useRealTimers()
    vi.resetModules()
    document.getElementById('boot-loader')?.remove()
  })

  it('hides and removes the loader after its transition', async () => {
    document.body.insertAdjacentHTML(
      'afterbegin',
      '<div id="boot-loader" aria-busy="true"></div>',
    )
    const { hideBootLoader } = await import('./bootLoader')

    hideBootLoader()
    hideBootLoader()

    const loader = document.getElementById('boot-loader')
    expect(loader).toHaveClass('boot-loader--hidden')
    expect(loader).toHaveAttribute('aria-busy', 'false')
    loader?.dispatchEvent(new Event('transitionend'))
    expect(document.getElementById('boot-loader')).not.toBeInTheDocument()
  })

  it('uses a timeout fallback when transitionend does not fire', async () => {
    document.body.insertAdjacentHTML(
      'afterbegin',
      '<div id="boot-loader" aria-busy="true"></div>',
    )
    const { hideBootLoader } = await import('./bootLoader')

    hideBootLoader()
    vi.advanceTimersByTime(600)

    expect(document.getElementById('boot-loader')).not.toBeInTheDocument()
  })
})
