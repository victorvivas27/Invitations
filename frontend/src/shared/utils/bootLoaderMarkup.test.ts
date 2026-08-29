import markup from '../../../index.html?raw'

describe('boot loader markup', () => {
  it('keeps the loader outside the empty React root', () => {
    expect(markup.indexOf('id="boot-loader"')).toBeLessThan(
      markup.indexOf('id="root"'),
    )
    expect(markup).toContain('<div id="root"></div>')
  })

  it('preloads the logo and supports safe mobile viewports', () => {
    expect(markup).toContain('viewport-fit=cover')
    expect(markup).toMatch(
      /rel="preload"[\s\S]*href="\/images\/icon-invitacion\.png"[\s\S]*fetchpriority="high"/,
    )
    expect(markup).toContain('env(safe-area-inset-top)')
  })

  it('fades out and disables motion when requested', () => {
    expect(markup).toContain('.boot-loader--hidden')
    expect(markup).toContain('@media (prefers-reduced-motion: reduce)')
    expect(markup).toContain('animation: none !important')
  })
})
