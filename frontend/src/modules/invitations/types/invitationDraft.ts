export type InvitationBackgroundGradient =
  'aurora' | 'sunset' | 'cosmic' | 'candy' | 'ocean' | 'festive'

export type SectionBackground = {
  customized: boolean
  type: 'solid' | 'gradient' | 'image'
  solidColor: string
  gradientStart: string
  gradientMiddle: string
  gradientEnd: string
  gradientDirection: 'vertical' | 'horizontal' | 'diagonal' | 'radial'
  imageUrl: string
  imagePosition: string
  imageFit: 'cover' | 'contain'
  overlayColor: string
  overlayOpacity: number
  textColor: string
  textStyle: 'solid' | 'gradient'
  textGradientStart: string
  textGradientEnd: string
  textGradientDirection: 'vertical' | 'horizontal' | 'diagonal'
}
export type InvitationSection =
  'basic' | 'tribute' | 'date' | 'venue' | 'gallery' | 'message' | 'summary'
export type SectionBackgrounds = Record<InvitationSection, SectionBackground>
export type InvitationContactInfo = {
  name: string
  whatsapp: string
  instagram: string
  facebook: string
}

export const defaultSectionBackground = (): SectionBackground => ({
  customized: false,
  type: 'solid',
  solidColor: '#ffffff',
  gradientStart: '#dbeafe',
  gradientMiddle: '',
  gradientEnd: '#fce7f3',
  gradientDirection: 'diagonal',
  imageUrl: '',
  imagePosition: 'center center',
  imageFit: 'cover',
  overlayColor: '#000000',
  overlayOpacity: 0,
  textColor: '#172033',
  textStyle: 'solid',
  textGradientStart: '#d71920',
  textGradientEnd: '#1557a0',
  textGradientDirection: 'horizontal',
})
export const defaultSectionBackgrounds = (): SectionBackgrounds => ({
  basic: defaultSectionBackground(),
  tribute: defaultSectionBackground(),
  date: defaultSectionBackground(),
  venue: defaultSectionBackground(),
  gallery: defaultSectionBackground(),
  message: defaultSectionBackground(),
  summary: defaultSectionBackground(),
})

export type InvitationDraft = {
  viewMode: 'scroll' | 'navigation'
  bgType: 'gradient' | 'image'
  bgGradient: InvitationBackgroundGradient
  bgImageUrl: string
  eventType: string
  eventName: string
  honoreeName: string
  age: string
  date: string
  time: string
  venueName: string
  address: string
  mapsUrl: string
  heroImageUrl: string
  heroImagePosition: number
  galleryImageUrls: string[]
  finalImagePosition: number
  message: string
  sectionBackgrounds: SectionBackgrounds
  contactInfo: InvitationContactInfo
  shareTitle: string
  shareDescription: string
  shareImageUrl: string
}

export const emptyInvitationDraft: InvitationDraft = {
  viewMode: 'scroll',
  bgType: 'gradient',
  bgGradient: 'aurora',
  bgImageUrl: '',
  eventType: '',
  eventName: '',
  honoreeName: '',
  age: '',
  date: '',
  time: '',
  venueName: '',
  address: '',
  mapsUrl: '',
  heroImageUrl: '',
  heroImagePosition: 50,
  galleryImageUrls: [],
  finalImagePosition: 50,
  message: '',
  sectionBackgrounds: defaultSectionBackgrounds(),
  contactInfo: { name: '', whatsapp: '', instagram: '', facebook: '' },
  shareTitle: '',
  shareDescription: '',
  shareImageUrl: '',
}
