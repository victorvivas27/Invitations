import type {
  CreatedInvitation,
  CreateInvitationInput,
  OwnedInvitation,
  PublicInvitation,
} from '../types/invitation'
import { clearSession, getAccessToken } from '../../auth/services/authSession'
import { apiBaseUrl } from '../../../shared/config/api'
export type InvitationErrorKind =
  | 'validation'
  | 'duplicate'
  | 'unauthorized'
  | 'forbidden'
  | 'template'
  | 'not-found'
  | 'network'
  | 'unexpected'
export class InvitationApiError extends Error {
  constructor(
    public readonly kind: InvitationErrorKind,
    message: string,
  ) {
    super(message)
  }
}

const parseError = async (response: Response): Promise<InvitationApiError> => {
  let message = ''
  try {
    message = ((await response.json()) as { message?: string }).message ?? ''
  } catch {
    /* controlled non-JSON response */
  }
  if (response.status === 401)
    return new InvitationApiError('unauthorized', 'Tu sesión ha vencido.')
  if (response.status === 403)
    return new InvitationApiError(
      'forbidden',
      'No tienes permiso para crear invitaciones.',
    )
  if (response.status === 404)
    return new InvitationApiError(
      'not-found',
      'Esta invitación no está disponible.',
    )
  if (response.status === 409)
    return new InvitationApiError(
      'duplicate',
      'Este nombre y apellido ya confirmó su asistencia.',
    )
  if (response.status === 400 && message.toLowerCase().includes('template'))
    return new InvitationApiError(
      'template',
      'La plantilla seleccionada ya no está disponible.',
    )
  if (response.status === 400)
    return new InvitationApiError(
      'validation',
      'Revisa los datos de la invitación.',
    )
  return new InvitationApiError(
    'unexpected',
    'No fue posible crear la invitación.',
  )
}
const request = async (url: string, init?: RequestInit) => {
  try {
    return await fetch(url, init)
  } catch {
    throw new InvitationApiError(
      'network',
      'No fue posible conectar con el servidor.',
    )
  }
}
export const clearInvitationSession = clearSession
export async function createInvitation(
  input: CreateInvitationInput,
): Promise<CreatedInvitation> {
  const token = getAccessToken()
  const storedMode =
    typeof window !== 'undefined'
      ? window.sessionStorage.getItem('invitation-view-mode')
      : null
  const viewMode =
    input.viewMode ?? (storedMode === 'NAVIGATION' ? 'NAVIGATION' : undefined)
  const response = await request(`${apiBaseUrl}/api/invitations`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({
      ...(viewMode ? { ...input, viewMode } : input),
      ...(input.sectionBackgrounds
        ? { sectionBackgrounds: JSON.stringify(input.sectionBackgrounds) }
        : {}),
      ...(input.contactInfo
        ? { contactInfo: JSON.stringify(input.contactInfo) }
        : {}),
    }),
  })
  if (!response.ok) throw await parseError(response)
  return response.json() as Promise<CreatedInvitation>
}
export async function getPublicInvitation(
  slug: string,
): Promise<PublicInvitation> {
  const response = await request(
    `${apiBaseUrl}/api/public/invitations/${encodeURIComponent(slug)}`,
  )
  if (!response.ok) throw await parseError(response)
  const invitation = (await response.json()) as PublicInvitation & {
    sectionBackgrounds?: unknown
  }
  if (typeof invitation.sectionBackgrounds === 'string') {
    try {
      invitation.sectionBackgrounds = JSON.parse(
        invitation.sectionBackgrounds,
      ) as PublicInvitation['sectionBackgrounds']
    } catch {
      delete invitation.sectionBackgrounds
    }
  }
  if (typeof invitation.contactInfo === 'string') {
    try {
      invitation.contactInfo = JSON.parse(
        invitation.contactInfo,
      ) as PublicInvitation['contactInfo']
    } catch {
      delete invitation.contactInfo
    }
  }
  return invitation
}
export async function getMyInvitations(): Promise<OwnedInvitation[]> {
  const token = getAccessToken()
  const response = await request(`${apiBaseUrl}/api/invitations`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  })
  if (!response.ok) throw await parseError(response)
  return response.json() as Promise<OwnedInvitation[]>
}
export async function deleteInvitation(publicSlug: string): Promise<void> {
  const token = getAccessToken()
  const response = await request(
    `${apiBaseUrl}/api/invitations/${encodeURIComponent(publicSlug)}`,
    {
      method: 'DELETE',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    },
  )
  if (!response.ok) throw await parseError(response)
}
export async function uploadInvitationImage(image: File): Promise<string> {
  return uploadImageAt('/api/invitation-images', image)
}
export async function uploadSocialImage(image: File): Promise<string> {
  return uploadImageAt('/api/invitation-images/social', image)
}
async function uploadImageAt(path: string, image: File): Promise<string> {
  const token = getAccessToken()
  const form = new FormData()
  form.append('image', image)
  const response = await request(`${apiBaseUrl}${path}`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: form,
  })
  if (!response.ok) throw await parseError(response)
  const uploaded = (await response.json()) as { url: string }
  return uploaded.url.startsWith('http')
    ? uploaded.url
    : `${apiBaseUrl}${uploaded.url}`
}
export const getInvitationShareUrl = (publicSlug: string) =>
  `${apiBaseUrl}/api/public/invitations/${encodeURIComponent(publicSlug)}/share`
export async function confirmAttendance(
  publicSlug: string,
  input: {
    firstName: string
    lastName: string
    guestCount: number
    attending: boolean
    message: string
  },
): Promise<void> {
  const response = await request(
    `${apiBaseUrl}/api/public/invitations/${encodeURIComponent(publicSlug)}/rsvps`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    },
  )
  if (!response.ok) throw await parseError(response)
}
export type InvitationGuest = {
  name: string
  guestCount: number
  attending: boolean
  message: string | null
  respondedAt: string
}
export async function getInvitationGuests(
  publicSlug: string,
): Promise<InvitationGuest[]> {
  const token = getAccessToken()
  const response = await request(
    `${apiBaseUrl}/api/invitations/${encodeURIComponent(publicSlug)}/guests`,
    { headers: token ? { Authorization: `Bearer ${token}` } : {} },
  )
  if (!response.ok) throw await parseError(response)
  return response.json() as Promise<InvitationGuest[]>
}
