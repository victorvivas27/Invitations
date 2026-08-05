import { useState } from 'react'
import { uploadInvitationImage } from '../services/invitations'
import type { SectionBackground } from '../types/invitationDraft'

const thematicImages = [
  '/invitation-backgrounds/confetti.svg',
  '/invitation-backgrounds/stars.svg',
  '/invitation-backgrounds/balloons.svg',
]
export function SectionBackgroundEditor({
  value,
  onChange,
  title = 'Personalizar fondo y texto',
}: {
  value: SectionBackground
  onChange: (value: SectionBackground) => void
  title?: string
}) {
  const [uploading, setUploading] = useState(false)
  const update = <K extends keyof SectionBackground>(
    key: K,
    next: SectionBackground[K],
  ) => onChange({ ...value, [key]: next })
  const upload = async (file?: File) => {
    if (!file) return
    setUploading(true)
    try {
      update('imageUrl', await uploadInvitationImage(file))
    } finally {
      setUploading(false)
    }
  }
  return (
    <details className="background-editor" open>
      <summary>{title}</summary>
      <div className="background-type" role="group" aria-label="Tipo de fondo">
        {(['solid', 'gradient', 'image'] as const).map((type) => (
          <button
            type="button"
            key={type}
            aria-pressed={value.customized && value.type === type}
            onClick={() => onChange({ ...value, customized: true, type })}
          >
            {type === 'solid'
              ? 'Color'
              : type === 'gradient'
                ? 'Degradado'
                : 'Imagen'}
          </button>
        ))}
      </div>
      {!value.customized && (
        <p className="background-help">
          Se está usando el diseño original de la plantilla.
        </p>
      )}
      {value.customized && value.type === 'solid' && (
        <label>
          Color de fondo
          <input
            type="color"
            value={value.solidColor}
            onChange={(e) => update('solidColor', e.target.value)}
          />
        </label>
      )}
      {value.customized && value.type === 'gradient' && (
        <div className="background-grid">
          <label>
            Inicial
            <input
              type="color"
              value={value.gradientStart}
              onChange={(e) => update('gradientStart', e.target.value)}
            />
          </label>
          <label>
            Intermedio (opcional)
            <input
              type="color"
              value={value.gradientMiddle || '#ffffff'}
              onChange={(e) => update('gradientMiddle', e.target.value)}
            />
            <button type="button" onClick={() => update('gradientMiddle', '')}>
              Sin intermedio
            </button>
          </label>
          <label>
            Final
            <input
              type="color"
              value={value.gradientEnd}
              onChange={(e) => update('gradientEnd', e.target.value)}
            />
          </label>
          <label>
            Dirección
            <select
              value={value.gradientDirection}
              onChange={(e) =>
                update(
                  'gradientDirection',
                  e.target.value as SectionBackground['gradientDirection'],
                )
              }
            >
              <option value="vertical">Vertical</option>
              <option value="horizontal">Horizontal</option>
              <option value="diagonal">Diagonal</option>
              <option value="radial">Radial</option>
            </select>
          </label>
        </div>
      )}
      {value.customized && value.type === 'image' && (
        <div className="background-grid">
          <label>
            Imagen propia
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              disabled={uploading}
              onChange={(e) => void upload(e.target.files?.[0])}
            />
          </label>
          <div className="thematic-images" aria-label="Imágenes temáticas">
            {thematicImages.map((url) => (
              <button
                type="button"
                key={url}
                aria-pressed={value.imageUrl === url}
                onClick={() => update('imageUrl', url)}
              >
                <img src={url} alt="Fondo temático" />
              </button>
            ))}
          </div>
          <label>
            Posición
            <select
              value={value.imagePosition}
              onChange={(e) => update('imagePosition', e.target.value)}
            >
              <option value="center center">Centro</option>
              <option value="center top">Arriba</option>
              <option value="center bottom">Abajo</option>
              <option value="left center">Izquierda</option>
              <option value="right center">Derecha</option>
            </select>
          </label>
          <label>
            Ajuste
            <select
              value={value.imageFit}
              onChange={(e) =>
                update('imageFit', e.target.value as 'cover' | 'contain')
              }
            >
              <option value="cover">Cubrir</option>
              <option value="contain">Contener</option>
            </select>
          </label>
          <label>
            Overlay
            <input
              type="color"
              value={value.overlayColor}
              onChange={(e) => update('overlayColor', e.target.value)}
            />
          </label>
          <label>
            Opacidad: {Math.round(value.overlayOpacity * 100)}%
            <input
              type="range"
              min="0"
              max="0.85"
              step="0.05"
              value={value.overlayOpacity}
              onChange={(e) => update('overlayOpacity', Number(e.target.value))}
            />
          </label>
        </div>
      )}
      {value.customized && (
        <>
          <div
            className="background-type"
            role="group"
            aria-label="Estilo del texto"
          >
            <button
              type="button"
              aria-pressed={(value.textStyle ?? 'solid') === 'solid'}
              onClick={() => update('textStyle', 'solid')}
            >
              Texto sólido
            </button>
            <button
              type="button"
              aria-pressed={value.textStyle === 'gradient'}
              onClick={() => update('textStyle', 'gradient')}
            >
              Texto degradado
            </button>
          </div>
          {(value.textStyle ?? 'solid') === 'solid' ? (
            <label>
              Color del texto
              <input
                type="color"
                value={value.textColor}
                onChange={(e) => update('textColor', e.target.value)}
              />
            </label>
          ) : (
            <div className="background-grid">
              <label>
                Texto inicial
                <input
                  type="color"
                  value={value.textGradientStart ?? '#d71920'}
                  onChange={(e) => update('textGradientStart', e.target.value)}
                />
              </label>
              <label>
                Texto final
                <input
                  type="color"
                  value={value.textGradientEnd ?? '#1557a0'}
                  onChange={(e) => update('textGradientEnd', e.target.value)}
                />
              </label>
              <label>
                Dirección
                <select
                  value={value.textGradientDirection ?? 'horizontal'}
                  onChange={(e) =>
                    update(
                      'textGradientDirection',
                      e.target
                        .value as SectionBackground['textGradientDirection'],
                    )
                  }
                >
                  <option value="horizontal">Horizontal</option>
                  <option value="vertical">Vertical</option>
                  <option value="diagonal">Diagonal</option>
                </select>
              </label>
            </div>
          )}
          <div className="text-legibility-editor">
            <strong>Legibilidad del texto</strong>
            <div className="background-grid">
              <label>
                Contorno
                <select
                  value={value.textOutline ?? 'auto'}
                  onChange={(e) =>
                    update(
                      'textOutline',
                      e.target.value as SectionBackground['textOutline'],
                    )
                  }
                >
                  <option value="auto">Automático</option>
                  <option value="white">Blanco</option>
                  <option value="black">Negro</option>
                  <option value="none">Sin contorno</option>
                </select>
              </label>
              {(value.textOutline ?? 'auto') !== 'none' && (
                <label>
                  Grosor: {value.textOutlineWidth ?? 1}px
                  <input
                    type="range"
                    min="1"
                    max="3"
                    step="0.5"
                    value={value.textOutlineWidth ?? 1}
                    onChange={(e) =>
                      update('textOutlineWidth', Number(e.target.value))
                    }
                  />
                </label>
              )}
              <label className="background-checkbox">
                <input
                  type="checkbox"
                  checked={value.textShadow ?? true}
                  onChange={(e) => update('textShadow', e.target.checked)}
                />
                Sombra suave
              </label>
              {(value.textShadow ?? true) && (
                <label>
                  Intensidad: {value.textShadowIntensity ?? 35}%
                  <input
                    type="range"
                    min="10"
                    max="80"
                    step="5"
                    value={value.textShadowIntensity ?? 35}
                    onChange={(e) =>
                      update('textShadowIntensity', Number(e.target.value))
                    }
                  />
                </label>
              )}
            </div>
          </div>
          <button
            className="background-reset"
            type="button"
            onClick={() => update('customized', false)}
          >
            Usar diseño original
          </button>
        </>
      )}
    </details>
  )
}
