export type InvitationTemplateCategory =
  | 'birthday'
  | 'baptism'
  | 'wedding'
  | 'baby-shower'
  | 'kids-party'
  | 'anniversary'
  | 'graduation'
  | 'other'

export type InvitationTemplateStyle =
  'modern' | 'elegant' | 'colorful' | 'minimal' | 'classic' | 'playful'

export type InvitationTemplate = {
  id: string
  name: string
  description: string
  category: InvitationTemplateCategory
  style: InvitationTemplateStyle
  previewVariant: string
  isFeatured?: boolean
  isAvailable: boolean
}
