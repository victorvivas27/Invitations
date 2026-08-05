declare const process: {
  env: Record<string, string | undefined>
}

export const config = { runtime: 'edge' }

type Metadata = {
  slug?: string
  shareTitle?: string
  shareDescription?: string
  shareImageUrl?: string
  heroImageUrl?: string
  publicUrl?: string
}

const FALLBACK_TITLE = 'Estás invitado'
const FALLBACK_DESCRIPTION =
  'Acompáñanos a celebrar un momento muy especial.'

const SOCIAL_BOT =
  /facebookexternalhit|facebot|whatsapp|twitterbot|linkedinbot|telegrambot|discordbot|slackbot/i

const escapeHtml = (value: string) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')

const cleanText = (value: unknown, fallback: string) =>
  typeof value === 'string' && value.trim() ? value.trim() : fallback

const secureImage = (value: unknown, fallback: string) => {
  if (typeof value !== 'string' || !value.trim()) {
    return fallback
  }

  try {
    const url = new URL(value.trim())

    return url.protocol === 'https:' ? url.toString() : fallback
  } catch {
    return fallback
  }
}

const documentHtml = ({
  title,
  description,
  image,
  publicUrl,
  appUrl,
  redirect,
}: {
  title: string
  description: string
  image: string
  publicUrl: string
  appUrl?: string
  redirect: boolean
}) => {
  const safeTitle = escapeHtml(title)
  const safeDescription = escapeHtml(description)
  const safeImage = escapeHtml(image)
  const safePublicUrl = escapeHtml(publicUrl)
  const safeAppUrl = appUrl ? escapeHtml(appUrl) : ''

  const redirectMarkup =
    redirect && appUrl
      ? `
  <meta http-equiv="refresh" content="0;url=${safeAppUrl}">
  <script>
    location.replace(
      ${JSON.stringify(appUrl).replaceAll('<', '\\u003c')}
    )
  </script>`
      : ''

  return `<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">

  <title>${safeTitle}</title>
  <meta name="description" content="${safeDescription}">
  <link rel="canonical" href="${safePublicUrl}">

  <meta property="og:locale" content="es_CL">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="Mi Invitación">
  <meta property="og:title" content="${safeTitle}">
  <meta property="og:description" content="${safeDescription}">
  <meta property="og:image" content="${safeImage}">
  <meta property="og:image:secure_url" content="${safeImage}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:url" content="${safePublicUrl}">

  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${safeTitle}">
  <meta name="twitter:description" content="${safeDescription}">
  <meta name="twitter:image" content="${safeImage}">
  ${redirectMarkup}
</head>
<body>
  <p>${redirect ? 'Abriendo invitación…' : safeDescription}</p>
</body>
</html>`
}

export default async function invitationMetadata(request: Request) {
  const requestUrl = new URL(request.url)

  const slug = requestUrl.searchParams.get('slug')?.trim()
  const origin = requestUrl.origin
  const backendUrl = process.env.BACKEND_URL?.replace(/\/$/, '')
  const fallbackImage = `${origin}/images/love-letter-icon.png`

  if (!slug) {
    return new Response(
      documentHtml({
        title: 'Invitación no encontrada',
        description: 'El enlace de la invitación no es válido.',
        image: fallbackImage,
        publicUrl: origin,
        redirect: false,
      }),
      {
        status: 404,
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'no-store',
        },
      },
    )
  }

  const publicUrl = `${origin}/i/${encodeURIComponent(slug)}`
  const appUrl = `${origin}/view/${encodeURIComponent(slug)}`

  let metadata: Metadata = {}
  let status = 200

  try {
    if (!backendUrl) {
      throw new Error('BACKEND_URL is not configured')
    }

    const upstreamUrl =
      `${backendUrl}/api/public/invitations/${encodeURIComponent(slug)}`

    const upstream = await fetch(upstreamUrl, {
      headers: {
        Accept: 'application/json',
      },
      cache: 'no-store',
    })

    if (upstream.status === 404) {
      status = 404
      metadata = {
        shareTitle: 'Invitación no encontrada',
        shareDescription:
          'Esta invitación no existe o ya no está disponible.',
      }
    } else if (!upstream.ok) {
      const responseText = await upstream.text()

      throw new Error(
        `Metadata request failed: ${upstream.status} ${responseText}`,
      )
    } else {
      metadata = (await upstream.json()) as Metadata
    }
  } catch (error) {
    console.error('Could not load invitation metadata', error)
  }

  const userAgent = request.headers.get('user-agent') ?? ''
  const isSocialBot = SOCIAL_BOT.test(userAgent)

  const title = cleanText(metadata.shareTitle, FALLBACK_TITLE)

  const description = cleanText(
    metadata.shareDescription,
    FALLBACK_DESCRIPTION,
  )

  const image = secureImage(
    metadata.shareImageUrl?.trim() ||
      metadata.heroImageUrl?.trim(),
    fallbackImage,
  )

  const html = documentHtml({
    title,
    description,
    image,
    publicUrl,
    appUrl: status === 200 ? appUrl : undefined,
    redirect: status === 200 && !isSocialBot,
  })

return new Response(html, {
  status,
  headers: {
    'Content-Type': 'text/html; charset=utf-8',
    'Cache-Control': 'no-store, no-cache, must-revalidate',
    Vary: 'User-Agent',
  },
})
}
