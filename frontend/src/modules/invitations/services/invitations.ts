import type {
  CreatedInvitation,
  CreateInvitationInput,
  OwnedInvitation,
  OwnedInvitationDetail,
  PublicInvitation,
  UpdateInvitationInput,
  UpdatedInvitation,
} from '../types/invitation'

import { clearSession, getAccessToken } from '../../auth/services/authSession'
import { apiBaseUrl } from '../../../shared/config/api'
import { normalizeSectionBackgrounds } from '../types/invitationDraft'
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
  if (response.status === 401) {
    clearSession()
    return new InvitationApiError('unauthorized', 'Tu sesión ha vencido.')
  }
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
      message || 'Revisa los datos de la invitación.',
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
export const createDraftInvitationId = (): string => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function')
    return crypto.randomUUID()

  const bytes = new Uint8Array(16)
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    crypto.getRandomValues(bytes)
  } else {
    for (let index = 0; index < bytes.length; index += 1)
      bytes[index] = Math.floor(Math.random() * 256)
  }
  bytes[6] = (bytes[6] & 0x0f) | 0x40
  bytes[8] = (bytes[8] & 0x3f) | 0x80
  const hex = Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0'))
  return `${hex.slice(0, 4).join('')}-${hex.slice(4, 6).join('')}-${hex.slice(6, 8).join('')}-${hex.slice(8, 10).join('')}-${hex.slice(10).join('')}`
}
export async function createInvitation(
  input: CreateInvitationInput,
  invitationId = createDraftInvitationId(),
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
      invitationId,
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

export async function updateInvitation(
  publicSlug: string,
  input: UpdateInvitationInput,
): Promise<UpdatedInvitation> {
  const token = getAccessToken()

  const response = await request(
    `${apiBaseUrl}/api/invitations/${encodeURIComponent(publicSlug)}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({
        ...input,
        ...(input.sectionBackgrounds
          ? {
              sectionBackgrounds: JSON.stringify(input.sectionBackgrounds),
            }
          : {}),
        ...(input.contactInfo
          ? {
              contactInfo: JSON.stringify(input.contactInfo),
            }
          : {}),
      }),
    },
  )

  if (!response.ok) throw await parseError(response)

  return response.json() as Promise<UpdatedInvitation>
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
  invitation.sectionBackgrounds = normalizeSectionBackgrounds(
    invitation.sectionBackgrounds,
  )
  invitation.dateChangeNoticeEnabled =
    invitation.dateChangeNoticeEnabled ?? false
  return invitation
}

export type PublicInvitationGuest = {
  name: string
  message: string
}

export async function getPublicInvitationGuests(
  publicSlug: string,
): Promise<PublicInvitationGuest[]> {
  const response = await request(
    `${apiBaseUrl}/api/public/invitations/${encodeURIComponent(publicSlug)}/rsvps`,
  )
  if (!response.ok) throw await parseError(response)
  return response.json() as Promise<PublicInvitationGuest[]>
}
export async function getMyInvitations(): Promise<OwnedInvitation[]> {
  const token = getAccessToken()
  const response = await request(`${apiBaseUrl}/api/invitations`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  })
  if (!response.ok) throw await parseError(response)
  return response.json() as Promise<OwnedInvitation[]>
}

export async function getOwnedInvitation(
  publicSlug: string,
): Promise<OwnedInvitationDetail> {
  const token = getAccessToken()

  const response = await request(
    `${apiBaseUrl}/api/invitations/${encodeURIComponent(publicSlug)}`,
    {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    },
  )

  if (!response.ok) throw await parseError(response)

  const invitation = (await response.json()) as OwnedInvitationDetail

  if (typeof invitation.sectionBackgrounds === 'string') {
    try {
      invitation.sectionBackgrounds = JSON.parse(
        invitation.sectionBackgrounds,
      ) as OwnedInvitationDetail['sectionBackgrounds']
    } catch {
      delete invitation.sectionBackgrounds
    }
  }

  if (typeof invitation.contactInfo === 'string') {
    try {
      invitation.contactInfo = JSON.parse(
        invitation.contactInfo,
      ) as OwnedInvitationDetail['contactInfo']
    } catch {
      delete invitation.contactInfo
    }
  }

  invitation.sectionBackgrounds = normalizeSectionBackgrounds(
    invitation.sectionBackgrounds,
  )
  invitation.dateChangeNoticeEnabled =
    invitation.dateChangeNoticeEnabled ?? false

  return invitation
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
export async function uploadInvitationImage(
  image: File,
  invitationId: string,
  context: 'COVER' | 'GALLERY' | 'DECORATION' = 'DECORATION',
): Promise<string> {
  return uploadImageAt('/api/invitation-images', image, invitationId, context)
}
export async function uploadSocialImage(
  image: File,
  invitationId: string,
): Promise<string> {
  return uploadImageAt('/api/invitation-images/social', image, invitationId)
}
async function uploadImageAt(
  path: string,
  image: File,
  invitationId: string,
  context?: 'COVER' | 'GALLERY' | 'DECORATION',
): Promise<string> {
  const token = getAccessToken()
  const form = new FormData()
  form.append('image', image)
  form.append('invitationId', invitationId)
  if (context) form.append('context', context)
  const response = await request(`${apiBaseUrl}${path}`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: form,
  })
  if (!response.ok) throw await parseError(response)
  const uploaded = (await response.json()) as { url: string }
  return uploaded.url
}
export async function deleteUploadedImage(url: string): Promise<void> {
  if (!url.includes('res.cloudinary.com')) return
  const token = getAccessToken()
  const response = await request(
    `${apiBaseUrl}/api/invitation-images?url=${encodeURIComponent(url)}`,
    {
      method: 'DELETE',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    },
  )
  if (!response.ok) throw await parseError(response)
}
export const getInvitationShareUrl = (
  publicSlug: string,
  metadataVersion?: string,
) => {
  const path = `/i/${encodeURIComponent(publicSlug)}`
  return metadataVersion
    ? `${path}?v=${encodeURIComponent(metadataVersion)}`
    : path
}

export const getInvitationViewUrl = (
  publicSlug: string,
  metadataVersion?: string,
) => {
  const path = `/view/${encodeURIComponent(publicSlug)}`
  return metadataVersion
    ? `${path}?v=${encodeURIComponent(metadataVersion)}`
    : path
}
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
  id: string
  name: string
  guestCount: number
  attending: boolean
  message: string | null
  respondedAt: string
}
export type UpdateInvitationGuestInput = Pick<
  InvitationGuest,
  'name' | 'guestCount' | 'attending' | 'message'
>
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

export async function updateInvitationGuest(
  publicSlug: string,
  guestId: string,
  input: UpdateInvitationGuestInput,
): Promise<InvitationGuest> {
  const token = getAccessToken()
  const response = await request(
    `${apiBaseUrl}/api/invitations/${encodeURIComponent(publicSlug)}/guests/${encodeURIComponent(guestId)}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(input),
    },
  )
  if (!response.ok) throw await parseError(response)
  return response.json() as Promise<InvitationGuest>
}

export async function deleteInvitationGuest(
  publicSlug: string,
  guestId: string,
): Promise<void> {
  const token = getAccessToken()
  const response = await request(
    `${apiBaseUrl}/api/invitations/${encodeURIComponent(publicSlug)}/guests/${encodeURIComponent(guestId)}`,
    {
      method: 'DELETE',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    },
  )
  if (!response.ok) throw await parseError(response)
}
