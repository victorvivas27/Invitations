declare const process: {
  env: Record<string, string | undefined>
}

export const config = { runtime: 'edge' }

export default async function shareInvitation(request: Request) {
  const requestUrl = new URL(request.url)
  const slug = requestUrl.searchParams.get('slug')
  const apiBaseUrl = (
    process.env.API_BASE_URL ?? process.env.VITE_API_BASE_URL
  )?.replace(/\/$/, '')

  if (!slug) return new Response('Invitation slug is required', { status: 400 })
  if (!apiBaseUrl)
    return new Response('API_BASE_URL is not configured', { status: 500 })

  const upstream = await fetch(
    `${apiBaseUrl}/api/public/invitations/${encodeURIComponent(slug)}/share`,
    { headers: { Accept: 'text/html' } },
  )
  const html = await upstream.text()

  return new Response(html, {
    status: upstream.status,
    headers: {
      'Content-Type': upstream.headers.get('Content-Type') ?? 'text/html; charset=utf-8',
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
    },
  })
}
