import { useState } from 'react'
import {
  deleteUploadedImage,
  uploadInvitationImage,
} from '../services/invitations'
import type { SectionBackground } from '../types/invitationDraft'
import { ImagePositionEditor } from './ImagePositionEditor'

const thematicImages = [
  '/invitation-backgrounds/confetti.svg',
  '/invitation-backgrounds/stars.svg',
  '/invitation-backgrounds/balloons.svg',
]
export function SectionBackgroundEditor({
  value,
  onChange,
  invitationId,
  showIntroText = false,
  showFarewellText = false,
  title = 'Personalizar fondo y texto',
}: {
  value: SectionBackground
  onChange: (value: SectionBackground) => void
  invitationId: string
  showIntroText?: boolean
  showFarewellText?: boolean
  title?: string
}) {
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const update = <K extends keyof SectionBackground>(
    key: K,
    next: SectionBackground[K],
  ) => onChange({ ...value, [key]: next })
  const upload = async (file?: File) => {
    if (!file) return
    setUploading(true)
    setUploadError('')
    try {
      const previous = value.imageUrl
      update(
        'imageUrl',
        await uploadInvitationImage(file, invitationId, 'DECORATION'),
      )
      if (previous)
        void deleteUploadedImage(previous).catch(() =>
          setUploadError(
            'La imagen se reemplazó, pero no pudimos borrar el archivo anterior.',
          ),
        )
    } catch {
      setUploadError('No fue posible subir la imagen de fondo.')
    } finally {
      setUploading(false)
    }
  }
  const selectIncludedImage = (url: string) => {
    const previous = value.imageUrl
    update('imageUrl', url)
    if (previous && previous !== url)
      void deleteUploadedImage(previous).catch(() =>
        setUploadError(
          'Cambiamos el fondo, pero no pudimos borrar el archivo anterior.',
        ),
      )
  }
  return (
    <details className="background-editor" open>
      <summary>{title}</summary>
      {showIntroText && (
        <div className="background-grid">
          <label>
            Texto de introducción
            <textarea
              value={value.introText}
              maxLength={140}
              rows={3}
              onChange={(event) => update('introText', event.target.value)}
              placeholder="Escribe la frase que aparecerá antes del nombre"
            />
          </label>
          <label>
            Tamaño de la introducción: {value.introFontSize}px
            <input
              type="range"
              min="16"
              max="36"
              step="1"
              value={value.introFontSize}
              onChange={(event) =>
                update('introFontSize', Number(event.target.value))
              }
            />
          </label>
          <label>
            Tamaño del nombre: {value.nameFontSize}px
            <input
              type="range"
              min="40"
              max="120"
              step="2"
              value={value.nameFontSize}
              onChange={(event) =>
                update('nameFontSize', Number(event.target.value))
              }
            />
          </label>
          <label>
            Tamaño de la edad: {value.ageFontSize}px
            <input
              type="range"
              min="16"
              max="42"
              step="1"
              value={value.ageFontSize}
              onChange={(event) =>
                update('ageFontSize', Number(event.target.value))
              }
            />
          </label>
        </div>
      )}
      {showFarewellText && (
        <div className="background-grid">
          <label>
            Mensaje de agradecimiento
            <textarea
              value={value.farewellText}
              maxLength={180}
              rows={3}
              onChange={(event) => update('farewellText', event.target.value)}
            />
          </label>
          <label>
            Título final
            <input
              value={value.farewellTitle}
              maxLength={80}
              onChange={(event) => update('farewellTitle', event.target.value)}
            />
          </label>
        </div>
      )}
      <div className="background-grid">
        <label>
          Tamaño del texto: {value.textFontSize}px
          <input
            type="range"
            min="14"
            max="72"
            step="1"
            value={value.textFontSize}
            onChange={(event) =>
              update('textFontSize', Number(event.target.value))
            }
          />
        </label>
        <label>
          Tamaño de títulos y datos destacados: {value.titleFontSize}px
          <input
            type="range"
            min="18"
            max="96"
            step="1"
            value={value.titleFontSize}
            onChange={(event) =>
              update('titleFontSize', Number(event.target.value))
            }
          />
        </label>
      </div>
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
            <span className="thematic-images-label">Fondos incluidos</span>
            {thematicImages.map((url) => (
              <button
                type="button"
                key={url}
                aria-pressed={value.imageUrl === url}
                onClick={() => selectIncludedImage(url)}
              >
                <img src={url} alt="Fondo temático" />
              </button>
            ))}
          </div>
          {value.imageUrl && (
            <ImagePositionEditor
              imageUrl={value.imageUrl}
              fit={value.imageFit}
              offsetX={value.imageOffsetX}
              offsetY={value.imageOffsetY}
              zoom={value.imageZoom}
              onChange={(position) =>
                onChange({
                  ...value,
                  imageOffsetX: position.offsetX,
                  imageOffsetY: position.offsetY,
                  imageZoom: position.zoom,
                })
              }
            />
          )}
          {value.imageUrl && (
            <button
              type="button"
              className="background-reset"
              onClick={() => {
                const previous = value.imageUrl
                update('imageUrl', '')
                void deleteUploadedImage(previous).catch(() =>
                  setUploadError(
                    'Quitamos la referencia, pero no pudimos borrar el archivo remoto.',
                  ),
                )
              }}
            >
              Quitar imagen de fondo
            </button>
          )}
          {uploadError && (
            <p className="wizard-error" role="alert">
              {uploadError}
            </p>
          )}
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
          <label className="background-checkbox">
            <input
              type="checkbox"
              checked={value.glassEnabled}
              onChange={(e) => update('glassEnabled', e.target.checked)}
            />
            Vidrio sobre el fondo
          </label>
          {value.glassEnabled && (
            <>
              <label>
                Desenfoque: {value.glassBlur}px
                <input
                  type="range"
                  min="0"
                  max="30"
                  step="1"
                  value={value.glassBlur}
                  onChange={(e) => update('glassBlur', Number(e.target.value))}
                />
              </label>
              <label>
                Opacidad del vidrio: {Math.round(value.glassOpacity * 100)}%
                <input
                  type="range"
                  min="0"
                  max="0.8"
                  step="0.02"
                  value={value.glassOpacity}
                  onChange={(e) =>
                    update('glassOpacity', Number(e.target.value))
                  }
                />
              </label>
              <label>
                Color base
                <input
                  type="color"
                  value={value.glassColor}
                  onChange={(e) => update('glassColor', e.target.value)}
                />
              </label>
            </>
          )}
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
