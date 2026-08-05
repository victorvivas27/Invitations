import { useRef, useState } from 'react'
import type { InvitationDraft } from '../types/invitationDraft'
import { WizardNavigation } from './WizardNavigation'
import { WizardStepper } from './WizardStepper'
import {
  uploadInvitationImage,
  uploadSocialImage,
} from '../services/invitations'
import { ImageCropEditor } from './ImageCropEditor'
import { SectionBackgroundEditor } from './SectionBackgroundEditor'
import type { InvitationSection } from '../types/invitationDraft'

const eventTypes = [
  'Cumpleaños',
  'Bautismo',
  'Matrimonio',
  'Baby shower',
  'Fiesta infantil',
  'Aniversario',
  'Graduación',
  'Otro evento',
]
const hours = Array.from({ length: 24 }, (_, hour) =>
  String(hour).padStart(2, '0'),
)
const minutes = Array.from({ length: 12 }, (_, index) =>
  String(index * 5).padStart(2, '0'),
)
type Props = {
  draft: InvitationDraft
  onChange: (draft: InvitationDraft) => void
  onSubmit: () => void
  submitting: boolean
  submitError: string
}

export function InvitationWizard({
  draft,
  onChange,
  onSubmit,
  submitting,
  submitError,
}: Props) {
  const [step, setStep] = useState(1)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const wizardRef = useRef<HTMLElement>(null)
  const update = <K extends keyof InvitationDraft>(
    field: K,
    value: InvitationDraft[K],
  ) => {
    onChange({ ...draft, [field]: value })
    if (field === 'heroImagePosition' || field === 'finalImagePosition') {
      sessionStorage.setItem(field, String(value))
      window.dispatchEvent(new Event('invitation-image-position-change'))
    }
    if (errors[field]) setErrors((current) => ({ ...current, [field]: '' }))
  }
  const validate = () => {
    const next: Record<string, string> = {}
    const required: Partial<Record<number, (keyof InvitationDraft)[]>> = {
      1: ['eventType', 'eventName'],
      2: ['honoreeName'],
      3: ['date', 'time'],
      4: ['venueName', 'address'],
      5: ['message'],
      7: ['shareTitle', 'shareDescription', 'shareImageUrl'],
    }
    for (const field of required[step] ?? []) {
      const value = draft[field]
      if (typeof value === 'string' && !value.trim())
        next[field] = 'Este campo es obligatorio.'
    }
    if (
      step === 2 &&
      draft.age &&
      (!/^\d+$/.test(draft.age) || Number(draft.age) > 150)
    )
      next.age = 'Ingresa una edad válida.'
    if (step === 3 && draft.date) {
      const today = new Date()
      const localToday = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
      if (draft.date < localToday) next.date = 'La fecha no puede ser anterior a hoy.'
    }
    if (step === 4 && draft.mapsUrl) {
      try {
        if (!['http:', 'https:'].includes(new URL(draft.mapsUrl).protocol))
          next.mapsUrl = 'Ingresa un enlace http o https válido.'
      } catch {
        next.mapsUrl = 'Ingresa un enlace válido de Google Maps.'
      }
    }
    setErrors(next)
    const firstInvalid = Object.keys(next)[0]
    if (firstInvalid) window.requestAnimationFrame(() => {
      const target = wizardRef.current?.querySelector<HTMLElement>(
        `[name="${firstInvalid}"], [data-field="${firstInvalid}"]`,
      )
      target?.focus()
      target?.scrollIntoView?.({ behavior: 'smooth', block: 'center' })
    })
    return Object.keys(next).length === 0
  }
  const next = () => {
    if (validate()) setStep((current) => Math.min(7, current + 1))
  }
  type TextField = Exclude<
    keyof InvitationDraft,
    'galleryImageUrls' | 'sectionBackgrounds' | 'contactInfo'
  >
  const field = (
    name: TextField,
    label: string,
    type = 'text',
    placeholder?: string,
  ) => (
    <label className="wizard-field">
      <span>{label}</span>
      <input
        name={name}
        aria-label={label}
        type={type}
        min={name === 'date' ? new Date().toLocaleDateString('en-CA') : undefined}
        value={draft[name]}
        onChange={(event) => update(name, event.target.value)}
        placeholder={placeholder}
        maxLength={
          name === 'eventName'
            ? 120
            : name === 'shareTitle'
              ? 70
              : name === 'honoreeName'
                ? 100
                : name === 'venueName'
                  ? 150
                  : name === 'address'
                    ? 250
                    : name === 'mapsUrl'
                      ? 500
                      : undefined
        }
        aria-invalid={Boolean(errors[name])}
        aria-describedby={errors[name] ? `${name}-error` : undefined}
      />
      {errors[name] && (
        <small id={`${name}-error`} className="wizard-error">
          {errors[name]}
        </small>
      )}
    </label>
  )
  const [selectedHour = '', selectedMinute = ''] = draft.time.split(':')
  const updateHour = (hour: string) =>
    update('time', hour ? `${hour}:${selectedMinute || '00'}` : '')
  const updateMinute = (minute: string) =>
    update('time', minute && selectedHour ? `${selectedHour}:${minute}` : '')
  const uploadHero = async (files: FileList | null) => {
    const image = files?.[0]
    if (!image) return
    setUploading(true)
    setUploadError('')
    try {
      update('heroImageUrl', await uploadInvitationImage(image))
    } catch {
      setUploadError('No fue posible subir la foto de portada.')
    } finally {
      setUploading(false)
    }
  }
  const uploadGallery = async (files: FileList | null) => {
    if (!files?.length) return
    setUploading(true)
    setUploadError('')
    try {
      const available = Math.max(0, 6 - draft.galleryImageUrls.length)
      const urls = await Promise.all(
        Array.from(files).slice(0, available).map(uploadInvitationImage),
      )
      update('galleryImageUrls', [...draft.galleryImageUrls, ...urls])
    } catch {
      setUploadError('No fue posible subir una o más fotos.')
    } finally {
      setUploading(false)
    }
  }
  const uploadShareImage = async (files: FileList | null) => {
    const image = files?.[0]
    if (!image) return
    setUploadError('')
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(image.type)) {
      setUploadError('La imagen para compartir debe ser JPG, PNG o WebP.')
      return
    }
    if (image.size > 5 * 1024 * 1024) {
      setUploadError('La imagen para compartir no puede superar los 5 MB.')
      return
    }
    const dimensions = await new Promise<{ width: number; height: number }>(
      (resolve, reject) => {
        const preview = new Image()
        const objectUrl = URL.createObjectURL(image)
        preview.onload = () => {
          URL.revokeObjectURL(objectUrl)
          resolve({
            width: preview.naturalWidth,
            height: preview.naturalHeight,
          })
        }
        preview.onerror = () => {
          URL.revokeObjectURL(objectUrl)
          reject(new Error('invalid image'))
        }
        preview.src = objectUrl
      },
    ).catch(() => null)
    const ratio = dimensions ? dimensions.width / dimensions.height : 0
    if (
      !dimensions ||
      dimensions.width < 600 ||
      dimensions.height < 315 ||
      ratio < 1.7 ||
      ratio > 2.1
    ) {
      setUploadError(
        'Usa una imagen horizontal de al menos 600 × 315 px y proporción cercana a 1.91:1.',
      )
      return
    }
    setUploading(true)
    try {
      update('shareImageUrl', await uploadSocialImage(image))
    } catch {
      setUploadError('No fue posible subir la imagen para compartir.')
    } finally {
      setUploading(false)
    }
  }
  return (
    <section ref={wizardRef} className="invitation-wizard" aria-label="Asistente de creación">
      <WizardStepper currentStep={step} />
      <p className="required-legend"><span aria-hidden="true">*</span> Campos obligatorios</p>
      {step === 5 && (
        <div
          className="image-position-controls"
          aria-label="Posición de las imágenes"
        >
          <ImageCropEditor
            label="Recorte de portada"
            imageUrl={draft.heroImageUrl}
            position={draft.heroImagePosition}
            onPositionChange={(value) => update('heroImagePosition', value)}
          />
          <ImageCropEditor
            label="Recorte de imagen final"
            imageUrl={draft.galleryImageUrls.at(-1) ?? draft.heroImageUrl}
            position={draft.finalImagePosition}
            onPositionChange={(value) => update('finalImagePosition', value)}
          />
        </div>
      )}
      <div className="wizard-step" key={step}>
        {step === 1 && (
          <>
            <div className="wizard-heading">
              <span>01</span>
              <h1>Información básica</h1>
              <p>
                Cuéntanos qué vas a celebrar y dale un nombre a tu invitación.
              </p>
            </div>
            <label className="wizard-field">
              <span>Tipo de evento</span>
              <select
                name="eventType"
                aria-label="Tipo de evento"
                value={draft.eventType}
                onChange={(event) => update('eventType', event.target.value)}
                aria-invalid={Boolean(errors.eventType)}
                aria-describedby={
                  errors.eventType ? 'eventType-error' : undefined
                }
              >
                <option value="">Selecciona un tipo</option>
                {eventTypes.map((type) => (
                  <option key={type}>{type}</option>
                ))}
              </select>
              {errors.eventType && (
                <small id="eventType-error" className="wizard-error">
                  {errors.eventType}
                </small>
              )}
            </label>
            {field(
              'eventName',
              'Nombre del evento',
              'text',
              'Ej. Cumpleaños de Sofía',
            )}
          </>
        )}
        {step === 2 && (
          <>
            <div className="wizard-heading">
              <span>02</span>
              <h1>Persona homenajeada</h1>
              <p>Agrega el nombre protagonista de esta celebración.</p>
            </div>
            {field('honoreeName', 'Nombre', 'text', 'Ej. Sofía')}
            {field('age', 'Edad que cumple (opcional)', 'number', 'Ej. 7')}
          </>
        )}
        {step === 3 && (
          <>
            <div className="wizard-heading">
              <span>03</span>
              <h1>Fecha y hora</h1>
              <p>Indica cuándo se reunirán para celebrar.</p>
            </div>
            <div className="wizard-field-row">
              {field('date', 'Fecha', 'date')}
              <div className="wizard-time-field">
                <span>Hora (formato 24 h)</span>
                <div className="wizard-time-selects">
                  <label className="wizard-field">
                    <select
                      aria-label="Hora"
                      data-field="time"
                      value={selectedHour}
                      onChange={(event) => updateHour(event.target.value)}
                      aria-invalid={Boolean(errors.time)}
                    >
                      <option value="">--</option>
                      {hours.map((hour) => (
                        <option key={hour} value={hour}>
                          {hour}
                        </option>
                      ))}
                    </select>
                  </label>
                  <span aria-hidden="true">:</span>
                  <label className="wizard-field">
                    <select
                      aria-label="Minutos"
                      value={selectedMinute}
                      onChange={(event) => updateMinute(event.target.value)}
                      aria-invalid={Boolean(errors.time)}
                      disabled={!selectedHour}
                    >
                      <option value="">--</option>
                      {minutes.map((minute) => (
                        <option key={minute} value={minute}>
                          {minute}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
                {errors.time && (
                  <small id="time-error" className="wizard-error">
                    {errors.time}
                  </small>
                )}
              </div>
            </div>
          </>
        )}
        {step === 4 && (
          <>
            <div className="wizard-heading">
              <span>04</span>
              <h1>Lugar</h1>
              <p>Ayuda a tus invitados a encontrar el evento fácilmente.</p>
            </div>
            {field(
              'venueName',
              'Nombre del lugar',
              'text',
              'Ej. Salón Central',
            )}
            {field('address', 'Dirección', 'text', 'Ej. Avenida Principal 123')}
            {field(
              'mapsUrl',
              'Enlace de Google Maps (opcional)',
              'url',
              'https://maps.app.goo.gl/...',
            )}
          </>
        )}
        {step === 5 && (
          <>
            <div className="wizard-heading">
              <span>05</span>
              <h1>Historia y fotos</h1>
              <p>Agrega una portada, una galería y unas palabras especiales.</p>
            </div>
            <label className="wizard-field image-upload-field">
              <span>Foto principal (opcional)</span>
              <input
                aria-label="Foto principal"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                disabled={uploading}
                onChange={(event) => void uploadHero(event.target.files)}
              />
            </label>
            {draft.heroImageUrl && (
              <div className="uploaded-hero">
                <img src={draft.heroImageUrl} alt="Portada seleccionada" />
                <button
                  type="button"
                  onClick={() => update('heroImageUrl', '')}
                >
                  Quitar
                </button>
              </div>
            )}
            <label className="wizard-field image-upload-field">
              <span>Galería (hasta 6 fotos)</span>
              <input
                aria-label="Fotos de la galería"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                disabled={uploading || draft.galleryImageUrls.length >= 6}
                onChange={(event) => void uploadGallery(event.target.files)}
              />
            </label>
            {draft.galleryImageUrls.length > 0 && (
              <div className="uploaded-gallery">
                {draft.galleryImageUrls.map((url, index) => (
                  <figure key={url}>
                    <img src={url} alt={`Foto ${index + 1} de la galería`} />
                    <button
                      type="button"
                      aria-label={`Quitar foto ${index + 1}`}
                      onClick={() =>
                        update(
                          'galleryImageUrls',
                          draft.galleryImageUrls.filter((item) => item !== url),
                        )
                      }
                    >
                      ×
                    </button>
                  </figure>
                ))}
              </div>
            )}
            {uploading && <p className="upload-status">Subiendo fotos...</p>}
            {uploadError && (
              <p className="wizard-error" role="alert">
                {uploadError}
              </p>
            )}
            <label className="wizard-field">
              <span>Mensaje especial</span>
              <textarea
                name="message"
                aria-label="Mensaje especial"
                value={draft.message}
                onChange={(event) => update('message', event.target.value)}
                placeholder="Queremos compartir contigo un día lleno de alegría..."
                rows={5}
                maxLength={1000}
                aria-invalid={Boolean(errors.message)}
                aria-describedby={errors.message ? 'message-error' : undefined}
              />
              {errors.message && (
                <small id="message-error" className="wizard-error">
                  {errors.message}
                </small>
              )}
            </label>
          </>
        )}
        {step === 6 && (
          <>
            <div className="wizard-heading">
              <span>06</span>
              <h1>Resumen</h1>
              <p>
                Revisa la información antes de continuar en una próxima etapa.
              </p>
            </div>
            <dl className="wizard-summary">
              <div>
                <dt>Evento</dt>
                <dd>
                  {draft.eventType} · {draft.eventName}
                </dd>
              </div>
              <div>
                <dt>Persona homenajeada</dt>
                <dd>
                  {draft.honoreeName}
                  {draft.age ? ` · ${draft.age} años` : ''}
                </dd>
              </div>
              <div>
                <dt>Fecha</dt>
                <dd>
                  {draft.date} · {draft.time}
                </dd>
              </div>
              <div>
                <dt>Lugar</dt>
                <dd>
                  {draft.venueName} · {draft.address}
                  {draft.mapsUrl ? ' · Google Maps agregado' : ''}
                </dd>
              </div>
              <div>
                <dt>Mensaje</dt>
                <dd>{draft.message}</dd>
              </div>
            </dl>
            <fieldset className="contact-editor">
              <legend>Contacto de los anfitriones (opcional)</legend>
              <p>
                Estos datos aparecerán al final de la invitación para que tus
                invitados puedan contactarte.
              </p>
              <label>
                Nombre de contacto
                <input
                  maxLength={100}
                  value={draft.contactInfo.name}
                  placeholder="Ej. Mamá de Sofía"
                  onChange={(e) =>
                    update('contactInfo', {
                      ...draft.contactInfo,
                      name: e.target.value,
                    })
                  }
                />
              </label>
              <label>
                WhatsApp
                <input
                  maxLength={30}
                  value={draft.contactInfo.whatsapp}
                  inputMode="tel"
                  placeholder="Ej. +56 9 1234 5678"
                  onChange={(e) =>
                    update('contactInfo', {
                      ...draft.contactInfo,
                      whatsapp: e.target.value,
                    })
                  }
                />
              </label>
              <label>
                Instagram
                <input
                  maxLength={200}
                  value={draft.contactInfo.instagram}
                  placeholder="Ej. @familiasofia"
                  onChange={(e) =>
                    update('contactInfo', {
                      ...draft.contactInfo,
                      instagram: e.target.value,
                    })
                  }
                />
              </label>
              <label>
                Facebook
                <input
                  maxLength={300}
                  value={draft.contactInfo.facebook}
                  placeholder="Nombre o enlace del perfil"
                  onChange={(e) =>
                    update('contactInfo', {
                      ...draft.contactInfo,
                      facebook: e.target.value,
                    })
                  }
                />
              </label>
            </fieldset>
          </>
        )}
        {step === 7 && (
          <>
            <div className="wizard-heading">
              <span>07</span>
              <h1>Vista previa al compartir</h1>
              <p>Configura cómo se verá el enlace en WhatsApp y otras redes.</p>
            </div>
            {field(
              'shareTitle',
              'Título',
              'text',
              `Te invitamos a ${draft.eventName || 'nuestro evento'}`,
            )}
            <label className="wizard-field">
              <span>Descripción</span>
              <textarea
                aria-label="Descripción para compartir"
                value={draft.shareDescription}
                onChange={(event) =>
                  update('shareDescription', event.target.value)
                }
                placeholder="Acompáñanos en este día especial. Consulta aquí todos los detalles."
                rows={4}
                maxLength={160}
                aria-invalid={Boolean(errors.shareDescription)}
              />
              <small>{draft.shareDescription.length}/160 caracteres</small>
              {errors.shareDescription && (
                <small className="wizard-error">
                  {errors.shareDescription}
                </small>
              )}
            </label>
            <label className="wizard-field image-upload-field social-image-upload">
              <span>Imagen para compartir</span>
              <input
                aria-label="Imagen para compartir"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                disabled={uploading}
                onChange={(event) => void uploadShareImage(event.target.files)}
              />
              <small>
                Recomendado: 1200 × 630 px, JPG, PNG o WebP, máximo 5 MB.
                Mínimo: 600 × 315 px.
              </small>
            </label>
            {draft.shareImageUrl && (
              <div className="social-share-preview">
                <img
                  src={draft.shareImageUrl}
                  alt="Vista previa para compartir"
                />
                <div>
                  <strong>
                    {draft.shareTitle || 'Título de la invitación'}
                  </strong>
                  <p>
                    {draft.shareDescription || 'Descripción de la invitación'}
                  </p>
                  <small>invitations-inky-seven.vercel.app</small>
                </div>
                <button
                  type="button"
                  onClick={() => update('shareImageUrl', '')}
                >
                  Quitar
                </button>
              </div>
            )}
            {uploading && <p className="upload-status">Subiendo imagen...</p>}
            {uploadError && (
              <p className="wizard-error" role="alert">
                {uploadError}
              </p>
            )}
          </>
        )}
      </div>
      {(
        [
          ['basic'],
          ['tribute'],
          ['date'],
          ['venue'],
          ['gallery', 'message'],
          ['summary'],
          [],
        ] as InvitationSection[][]
      )[step - 1].map((section) => (
        <SectionBackgroundEditor
          key={section}
          title={`Personalizar ${section === 'basic' ? 'portada' : section === 'tribute' ? 'homenaje' : section === 'date' ? 'fecha y hora' : section === 'venue' ? 'lugar' : section === 'gallery' ? 'galería' : section === 'message' ? 'confirmación' : 'sección final'}`}
          value={draft.sectionBackgrounds[section]}
          onChange={(background) =>
            update('sectionBackgrounds', {
              ...draft.sectionBackgrounds,
              [section]: background,
            })
          }
        />
      ))}
      {submitError && (
        <div className="wizard-submit-error" role="alert">
          <p>{submitError}</p>
        </div>
      )}
      <WizardNavigation
        step={step}
        onPrevious={() => {
          setErrors({})
          setStep((current) => Math.max(1, current - 1))
        }}
        onNext={next}
        onSubmit={onSubmit}
        submitting={submitting}
      />
    </section>
  )
}
