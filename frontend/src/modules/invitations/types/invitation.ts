import type {
  InvitationContactInfo,
  SectionBackgrounds,
} from './invitationDraft'
export type InvitationEventType =
  | 'BIRTHDAY'
  | 'BAPTISM'
  | 'WEDDING'
  | 'BABY_SHOWER'
  | 'KIDS_PARTY'
  | 'ANNIVERSARY'
  | 'GRADUATION'
  | 'OTHER'
export type InvitationViewMode = 'SCROLL' | 'NAVIGATION'
export type CreateInvitationInput = {
  templateId: string
  viewMode?: InvitationViewMode
  heroImagePosition?: number
  finalImagePosition?: number
  eventType: InvitationEventType
  eventName: string
  honoreeName: string
  honoreeAge?: number
  eventDate: string
  eventTime: string
  venueName: string
  address: string
  mapsUrl?: string
  heroImageUrl?: string
  galleryImageUrls?: string[]
  message: string
  sectionBackgrounds?: SectionBackgrounds
  contactInfo?: InvitationContactInfo
  shareTitle: string
  shareDescription: string
  shareImageUrl: string
}
export type CreatedInvitation = {
  publicSlug: string
  publicUrl: string
  status: 'PUBLISHED'
  eventName: string
  metadataVersion: string
}
export type PublicInvitation = Omit<
  CreateInvitationInput,
  'honoreeAge' | 'mapsUrl' | 'heroImageUrl' | 'galleryImageUrls'
> & {
  publicSlug: string
  honoreeAge: number | null
  mapsUrl: string | null
  heroImageUrl: string | null
  galleryImageUrls: string[]
}
export type OwnedInvitation = {
  publicSlug: string
  publicUrl: string
  templateId: string
  eventType: InvitationEventType
  eventName: string
  honoreeName: string
  eventDate: string
  eventTime: string
  venueName: string
  status: 'PUBLISHED'
  createdAt: string
  metadataVersion: string
}

export type UpdateInvitationInput = CreateInvitationInput

export type OwnedInvitationDetail = {
  id: string
  publicSlug: string
  publicUrl: string
  templateId: string
  viewMode: InvitationViewMode
  eventType: InvitationEventType
  eventName: string
  honoreeName: string
  honoreeAge: number | null
  eventDate: string
  eventTime: string
  venueName: string
  address: string
  mapsUrl: string | null
  heroImageUrl: string | null
  galleryImageUrls: string[]
  message: string
  sectionBackgrounds?: SectionBackgrounds
  contactInfo?: InvitationContactInfo
  shareTitle: string
  shareDescription: string
  shareImageUrl: string | null
  status: 'PUBLISHED'
  createdAt: string
  updatedAt: string
}

export type UpdatedInvitation = {
  publicSlug: string
  publicUrl: string
  status: 'PUBLISHED'
  eventName: string
  metadataVersion: string
}
