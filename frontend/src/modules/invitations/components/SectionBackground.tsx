import type { CSSProperties, PropsWithChildren } from 'react'
import type { SectionBackground as Background } from '../types/invitationDraft'

const gradients = {
  vertical: 'to bottom',
  horizontal: 'to right',
  diagonal: '135deg',
} as const

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
  ...props
}: PropsWithChildren<{
  background?: Background
  id: string
  className: string
}>) {
  const textDirection =
    background?.textGradientDirection === 'vertical'
      ? 'to bottom'
      : background?.textGradientDirection === 'diagonal'
        ? '135deg'
        : 'to right'
  return (
    <section
      {...props}
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
        } as CSSProperties
      }
    >
      {children}
    </section>
  )
}
