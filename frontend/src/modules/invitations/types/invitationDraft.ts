export type InvitationBackgroundGradient =
  'aurora' | 'sunset' | 'cosmic' | 'candy' | 'ocean' | 'festive'

export type SectionBackground = {
  introText: string
  coverDescription: string
  ageText: string
  ageSuffix: string
  introFontSize: number
  nameFontSize: number
  ageFontSize: number
  textFontSize: number
  titleFontSize: number
  farewellText: string
  farewellTitle: string
  customized: boolean
  type: 'solid' | 'gradient' | 'image'
  solidColor: string
  gradientStart: string
  gradientMiddle: string
  gradientEnd: string
  gradientDirection: 'vertical' | 'horizontal' | 'diagonal' | 'radial'
  imageUrl: string
  imageFit: 'cover' | 'contain'
  overlayColor: string
  overlayOpacity: number
  textColor: string
  textStyle: 'solid' | 'gradient'
  textGradientStart: string
  textGradientEnd: string
  textGradientDirection: 'vertical' | 'horizontal' | 'diagonal'
  textOutline: 'none' | 'auto' | 'white' | 'black'
  textOutlineWidth: number
  textShadow: boolean
  textShadowIntensity: number
  imageOffsetX: number
  imageOffsetY: number
  imageZoom: number
  glassEnabled: boolean
  glassBlur: number
  glassOpacity: number
  glassColor: string
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
  introText: 'Estamos felices de invitarte al cumple de',
  coverDescription: '',
  ageText: 'En mi cumple número',
  ageSuffix: 'años',
  introFontSize: 24,
  nameFontSize: 88,
  ageFontSize: 28,
  textFontSize: 28,
  titleFontSize: 34,
  farewellText: 'Gracias por acompañarnos en este día tan especial.',
  farewellTitle: '¡Te esperamos!',
  customized: false,
  type: 'solid',
  solidColor: '#ffffff',
  gradientStart: '#dbeafe',
  gradientMiddle: '',
  gradientEnd: '#fce7f3',
  gradientDirection: 'diagonal',
  imageUrl: '',
  imageFit: 'cover',
  overlayColor: '#000000',
  overlayOpacity: 0,
  textColor: '#172033',
  textStyle: 'solid',
  textGradientStart: '#d71920',
  textGradientEnd: '#1557a0',
  textGradientDirection: 'horizontal',
  textOutline: 'auto',
  textOutlineWidth: 1,
  textShadow: true,
  textShadowIntensity: 35,
  imageOffsetX: 0,
  imageOffsetY: 0,
  imageZoom: 1,
  glassEnabled: false,
  glassBlur: 10,
  glassOpacity: 0.18,
  glassColor: '#ffffff',
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

export const normalizeSectionBackgrounds = (
  value?: Partial<SectionBackgrounds>,
): SectionBackgrounds => {
  const defaults = defaultSectionBackgrounds()
  return Object.fromEntries(
    (Object.keys(defaults) as InvitationSection[]).map((section) => [
      section,
      { ...defaults[section], ...value?.[section] },
    ]),
  ) as SectionBackgrounds
}

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
