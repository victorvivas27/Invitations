import { afterEach, describe, expect, it, vi } from 'vitest'
import invitationMetadata from './invitation-meta'

const request = (userAgent = 'WhatsApp/2.0') =>
  new Request('https://invitations.example/i/fiesta-123?slug=fiesta-123', {
    headers: { 'user-agent': userAgent },
  })

describe('invitation metadata function', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
    vi.restoreAllMocks()
  })

  it('renders escaped Open Graph and Twitter metadata for social crawlers', async () => {
    vi.stubEnv('BACKEND_URL', 'https://backend.example')
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      Response.json({
        slug: 'fiesta-123',
        shareTitle: 'Cumpleaños de <Theo>',
        shareDescription: 'Ven & celebra "con nosotros"',
        shareImageUrl: 'https://cdn.example/theo.jpg',
      }),
    )

    const response = await invitationMetadata(request())
    const html = await response.text()

    expect(response.status).toBe(200)
    expect(response.headers.get('Content-Type')).toContain('text/html')
    expect(response.headers.get('Cache-Control')).toBe(
      'public, s-maxage=60, stale-while-revalidate=300',
    )
    expect(response.headers.get('Vary')).toBe('User-Agent')
    expect(html).toContain('Cumpleaños de &lt;Theo&gt;')
    expect(html).toContain('Ven &amp; celebra &quot;con nosotros&quot;')
    expect(html).toContain(
      '<meta property="og:image" content="https://cdn.example/theo.jpg">',
    )
    expect(html).toContain(
      '<meta property="og:url" content="https://invitations.example/i/fiesta-123">',
    )
    expect(html).toContain(
      '<meta name="twitter:card" content="summary_large_image">',
    )
    expect(html).toContain('<meta name="twitter:title"')
    expect(html).toContain('<meta name="twitter:description"')
    expect(html).toContain('<meta name="twitter:image"')
    expect(html).not.toContain('location.replace')
    expect(fetchMock).toHaveBeenCalledWith(
      'https://backend.example/api/public/invitations/fiesta-123/metadata',
      {
        headers: { Accept: 'application/json' },
        cache: 'no-store',
      },
    )
  })

  it('redirects normal browsers without waiting for metadata', async () => {
    vi.stubEnv('BACKEND_URL', 'https://backend.example')
    const fetchMock = vi.spyOn(globalThis, 'fetch')
    const response = await invitationMetadata(request('Mozilla/5.0'))

    expect(response.status).toBe(307)
    expect(response.headers.get('Location')).toBe(
      'https://invitations.example/view/fiesta-123',
    )
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('uses safe fallbacks when the backend is unavailable', async () => {
    vi.stubEnv('BACKEND_URL', 'https://backend.example')
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('offline'))
    vi.spyOn(console, 'error').mockImplementation(() => undefined)

    const response = await invitationMetadata(request())
    const html = await response.text()

    expect(response.status).toBe(200)
    expect(html).toContain('<title>Estás invitado</title>')
    expect(html).toContain(
      'content="https://invitations.example/images/love-letter-icon.png"',
    )
    expect(html).not.toContain('undefined')
    expect(html).not.toContain('null')
  })

  it('returns metadata HTML with status 404 for a missing invitation', async () => {
    vi.stubEnv('BACKEND_URL', 'https://backend.example')
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response('', { status: 404 }),
    )

    const response = await invitationMetadata(request())
    const html = await response.text()

    expect(response.status).toBe(404)
    expect(html).toContain('<title>Invitación no encontrada</title>')
    expect(html).not.toContain('location.replace')
  })
})
