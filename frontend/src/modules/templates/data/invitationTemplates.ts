import type {
  InvitationTemplate,
  InvitationTemplateCategory,
  InvitationTemplateStyle,
} from '../types/invitationTemplate'

export const categoryLabels: Record<InvitationTemplateCategory, string> = {
  birthday: 'Cumpleaños',
  baptism: 'Bautismos',
  wedding: 'Matrimonios',
  'baby-shower': 'Baby shower',
  'kids-party': 'Fiestas infantiles',
  anniversary: 'Aniversarios',
  graduation: 'Graduaciones',
  other: 'Otros',
}
export const styleLabels: Record<InvitationTemplateStyle, string> = {
  modern: 'Moderno',
  elegant: 'Elegante',
  colorful: 'Colorido',
  minimal: 'Minimalista',
  classic: 'Clásico',
  playful: 'Divertido',
}
export const invitationTemplates: InvitationTemplate[] = [
  {
    id: 'birthday-heroes-ready',
    name: 'Cumpleaños de héroes',
    description:
      'Una invitación de cumpleaños lista para usar, con globos, confites, confirmación, regalos y energía de superhéroes.',
    category: 'birthday',
    style: 'playful',
    previewVariant: 'heroes',
    isFeatured: true,
    isAvailable: true,
    preset: 'birthday-heroes',
  },
  {
    id: 'birthday-urban',
    name: 'Cumpleaños urbano',
    description:
      'Formas intensas y tipografía protagonista para una celebración con energía.',
    category: 'birthday',
    style: 'modern',
    previewVariant: 'urban',
    isFeatured: true,
    isAvailable: true,
  },
  {
    id: 'birthday-colorful',
    name: 'Cumpleaños colorido',
    description:
      'Bloques alegres y confeti geométrico para festejar a todo color.',
    category: 'birthday',
    style: 'colorful',
    previewVariant: 'confetti',
    isAvailable: true,
  },
  {
    id: 'baptism-sky',
    name: 'Bautismo cielo',
    description:
      'Una composición serena, luminosa y delicada para compartir este momento.',
    category: 'baptism',
    style: 'minimal',
    previewVariant: 'sky',
    isFeatured: true,
    isAvailable: true,
  },
  {
    id: 'baptism-classic',
    name: 'Bautismo clásico',
    description:
      'Detalles sobrios y una estructura atemporal en azul profundo.',
    category: 'baptism',
    style: 'classic',
    previewVariant: 'classic',
    isAvailable: true,
  },
  {
    id: 'wedding-elegant',
    name: 'Boda elegante',
    description:
      'Contraste refinado y líneas editoriales para anunciar el gran día.',
    category: 'wedding',
    style: 'elegant',
    previewVariant: 'noir',
    isFeatured: true,
    isAvailable: true,
  },
  {
    id: 'wedding-minimal',
    name: 'Boda minimalista',
    description:
      'Mucho aire, tipografía limpia y detalles sutiles para una unión única.',
    category: 'wedding',
    style: 'minimal',
    previewVariant: 'paper',
    isAvailable: true,
  },
  {
    id: 'baby-shower-modern',
    name: 'Baby shower moderno',
    description:
      'Formas suaves y una paleta tranquila para una bienvenida especial.',
    category: 'baby-shower',
    style: 'modern',
    previewVariant: 'soft',
    isAvailable: true,
  },
  {
    id: 'kids-heroes',
    name: 'Fiesta de héroes',
    description:
      'Rayos, movimiento y energía para una aventura infantil original.',
    category: 'kids-party',
    style: 'playful',
    previewVariant: 'heroes',
    isAvailable: true,
  },
  {
    id: 'kids-adventure',
    name: 'Aventura fantástica',
    description: 'Un paisaje geométrico y colorido para pequeños exploradores.',
    category: 'kids-party',
    style: 'colorful',
    previewVariant: 'adventure',
    isAvailable: true,
  },
  {
    id: 'anniversary-night',
    name: 'Aniversario nocturno',
    description:
      'Una atmósfera íntima con contraste oscuro y acentos profundos.',
    category: 'anniversary',
    style: 'elegant',
    previewVariant: 'night',
    isAvailable: false,
  },
  {
    id: 'graduation-modern',
    name: 'Graduación moderna',
    description:
      'Una celebración de logros con formas nítidas y composición audaz.',
    category: 'graduation',
    style: 'modern',
    previewVariant: 'graduate',
    isAvailable: true,
  },
  {
    id: 'blank-canvas',
    name: 'Diseño desde cero',
    description:
      'Un punto de partida neutral para construir una invitación a tu manera.',
    category: 'other',
    style: 'minimal',
    previewVariant: 'blank',
    isAvailable: false,
  },
]
