import type { CSSProperties, PropsWithChildren } from 'react'
import type { RevealKind } from '../../../shared/animation'
import type { SectionBackground as Background } from '../types/invitationDraft'

const gradients = {
  vertical: 'to bottom',
  horizontal: 'to right',
  diagonal: '135deg',
} as const

const luminance = (hex: string) => {
  const normalized = hex.replace('#', '')
  if (!/^[0-9a-f]{6}$/i.test(normalized)) return 128
  const channels = [0, 2, 4].map((offset) =>
    Number.parseInt(normalized.slice(offset, offset + 2), 16),
  )
  return channels[0] * 0.299 + channels[1] * 0.587 + channels[2] * 0.114
}

const automaticOutline = (background: Background) => {
  const colors =
    background.textStyle === 'gradient'
      ? [background.textGradientStart, background.textGradientEnd]
      : [background.textColor]
  const average =
    colors.reduce((sum, color) => sum + luminance(color), 0) / colors.length
  return average > 145 ? '#000000' : '#ffffff'
}

export function sectionBackgroundStyle(background?: Background): CSSProperties {
  if (!background || background.customized === false) return {}
  let backgroundImage: string | undefined
  if (background.type === 'image' && background.imageUrl)
    backgroundImage = `linear-gradient(${background.overlayColor}${Math.round(
      background.overlayOpacity * 255,
    )
      .toString(16)
      .padStart(2, '0')}, ${background.overlayColor}${Math.round(
      background.overlayOpacity * 255,
    )
      .toString(16)
      .padStart(2, '0')}), url("${background.imageUrl.replaceAll('"', '\\"')}")`
  if (background.type === 'gradient') {
    const colors = [
      background.gradientStart,
      background.gradientMiddle,
      background.gradientEnd,
    ]
      .filter(Boolean)
      .join(', ')
    backgroundImage =
      background.gradientDirection === 'radial'
        ? `radial-gradient(circle, ${colors})`
        : `linear-gradient(${gradients[background.gradientDirection]}, ${colors})`
  }
  return {
    color: background.textColor,
    backgroundColor:
      background.type === 'solid' ? background.solidColor : undefined,
    backgroundImage,
    backgroundPosition: background.imagePosition,
    backgroundSize:
      background.type === 'image' ? background.imageFit : undefined,
    backgroundRepeat: 'no-repeat',
  }
}

export function SectionBackground({
  background,
  children,
  reveal,
  ...props
}: PropsWithChildren<{
  background?: Background
  id: string
  className: string
  /** Forma de aparición al entrar en pantalla; ver reveal.css. */
  reveal?: RevealKind
}>) {
  const textDirection =
    background?.textGradientDirection === 'vertical'
      ? 'to bottom'
      : background?.textGradientDirection === 'diagonal'
        ? '135deg'
        : 'to right'
  const outline = background?.textOutline ?? 'auto'
  const outlineColor = background
    ? outline === 'auto'
      ? automaticOutline(background)
      : outline === 'white'
        ? '#ffffff'
        : '#000000'
    : '#000000'
  const shadowOpacity = Math.round(
    (background?.textShadowIntensity ?? 35) * 2.55,
  )
    .toString(16)
    .padStart(2, '0')
  return (
    <section
      {...props}
      data-reveal={reveal}
      data-custom-background={background?.customized ? 'true' : undefined}
      data-background-type={
        background?.customized ? background.type : undefined
      }
      data-gradient-text={
        background?.customized && background.textStyle === 'gradient'
          ? 'true'
          : undefined
      }
      style={
        {
          ...sectionBackgroundStyle(background),
          '--section-text-color': background?.textColor,
          '--section-text-gradient': `linear-gradient(${textDirection}, ${background?.textGradientStart}, ${background?.textGradientEnd})`,
          '--section-text-outline':
            outline === 'none'
              ? '0 transparent'
              : `${background?.textOutlineWidth ?? 1}px ${outlineColor}`,
          '--section-text-shadow':
            (background?.textShadow ?? true)
              ? `0 2px 5px #000000${shadowOpacity}`
              : 'none',
        } as CSSProperties
      }
    >
      {children}
    </section>
  )
}
