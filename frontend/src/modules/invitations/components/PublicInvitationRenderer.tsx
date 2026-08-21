import { useEffect, useRef, useState, useCallback, useMemo } from 'react'
import { confirmAttendance, InvitationApiError } from '../services/invitations'
import type { PublicInvitation } from '../types/invitation'
import { SectionBackground } from './SectionBackground'
import { InvitationFooter } from './InvitationFooter'
import { useInvitationAnimations } from './useInvitationAnimations'

// Utilidades con mejor manejo de errores
const capitalize = (value: string) =>
  value?.charAt(0)?.toUpperCase() + value?.slice(1) || ''

const formatDate = (date: string) => {
  if (!date) return ''
  try {
    // A YYYY-MM-DD value is a Chilean calendar date, not a UTC instant. Noon
    // UTC remains on the same calendar day when formatted in Santiago.
    const dateObj = new Date(`${date.slice(0, 10)}T12:00:00Z`)
    if (isNaN(dateObj.getTime())) return ''

    return new Intl.DateTimeFormat('es-CL', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      timeZone: 'America/Santiago',
    })
      .formatToParts(dateObj)
      .map((part) =>
        part.type === 'weekday' || part.type === 'month'
          ? capitalize(part.value)
          : part.value,
      )
      .join('')
  } catch {
    return ''
  }
}

const countdown = (date: string, time: string) => {
  if (!date || !time) return { days: 0, hours: 0, minutes: 0 }

  try {
    const normalizedTime = time.slice(0, 5) || '00:00'
    const target = new Date(`${date}T${normalizedTime}:00`).getTime()

    if (isNaN(target)) return { days: 0, hours: 0, minutes: 0 }

    const difference = target - Date.now()
    if (difference <= 0) return { days: 0, hours: 0, minutes: 0 }

    return {
      days: Math.floor(difference / 86400000),
      hours: Math.floor(difference / 3600000) % 24,
      minutes: Math.floor(difference / 60000) % 60,
    }
  } catch {
    return { days: 0, hours: 0, minutes: 0 }
  }
}

// Componente RsvpForm mejorado
function RsvpForm({
  publicSlug,
  preview = false,
}: {
  publicSlug: string
  preview?: boolean
}) {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    guestCount: '1',
    attending: true,
    message: '',
  })
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'error'>(
    'idle',
  )
  const [error, setError] = useState('')

  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    // Keep the form usable in preview without creating a real RSVP.
    if (preview) return

    setState('sending')
    setError('')

    try {
      await confirmAttendance(publicSlug, {
        ...form,
        guestCount: form.attending ? Number(form.guestCount) : 1,
      })
      setState('sent')
    } catch (failure) {
      setState('error')
      setError(
        failure instanceof InvitationApiError
          ? failure.message
          : 'No pudimos enviar tu respuesta. Intenta nuevamente.',
      )
    }
  }

  if (state === 'sent') {
    return (
      <p className="rsvp-success" role="status">
        ¡Gracias! Tu respuesta fue enviada.
      </p>
    )
  }

  return (
    <form
      className="rsvp-form"
      onSubmit={submit}
      aria-hidden={preview || undefined}
      inert={preview || undefined}
    >
      <div className="rsvp-name-row">
        <label>
          <span>Nombre</span>
          <input
            required
            placeholder=" "
            maxLength={55}
            autoComplete="given-name"
            value={form.firstName}
            onChange={(event) =>
              setForm({ ...form, firstName: event.target.value })
            }
          />
        </label>
        <label>
          <span>Apellido</span>
          <input
            required
            placeholder=" "
            maxLength={55}
            autoComplete="family-name"
            value={form.lastName}
            onChange={(event) =>
              setForm({ ...form, lastName: event.target.value })
            }
          />
        </label>
      </div>
      <label>
        <span>Cantidad de asistentes</span>
        <input
          type="number"
          placeholder=" "
          min="1"
          max="20"
          required={form.attending}
          disabled={!form.attending}
          value={form.guestCount}
          onChange={(event) =>
            setForm({ ...form, guestCount: event.target.value })
          }
        />
      </label>
      <fieldset>
        <legend>¿Podrás asistir?</legend>
        <label>
          <input
            type="radio"
            name="attending"
            checked={form.attending}
            onChange={() =>
              setForm({
                ...form,
                attending: true,
                guestCount: form.guestCount || '1',
              })
            }
          />{' '}
          Sí, asistiré
        </label>
        <label>
          <input
            type="radio"
            name="attending"
            checked={!form.attending}
            onChange={() =>
              setForm({ ...form, attending: false, guestCount: '' })
            }
          />{' '}
          No podré asistir
        </label>
      </fieldset>
      <label>
        <span>Mensaje para el anfitrión (opcional)</span>
        <textarea
          maxLength={500}
          placeholder=" "
          rows={2}
          value={form.message}
          onChange={(event) =>
            setForm({ ...form, message: event.target.value })
          }
        />
      </label>
      {state === 'error' && (
        <p className="rsvp-error" role="alert">
          {error}
        </p>
      )}
      <button type="submit" disabled={state === 'sending'}>
        {state === 'sending' ? 'Enviando...' : 'Confirmar asistencia'}
      </button>
    </form>
  )
}

// Componente principal mejorado
export function PublicInvitationRenderer({
  invitation,
  preview = false,
  viewMode: selectedViewMode,
}: {
  invitation: PublicInvitation
  preview?: boolean
  viewMode?: 'scroll' | 'navigation'
}) {
  // Validación temprana de props
  if (!invitation?.publicSlug) {
    console.warn('Invitation missing required props')
    return <div>Error: Datos de invitación incompletos</div>
  }

  const CoverHeading = preview ? 'h2' : 'h1'
  const experienceRef = useRef<HTMLDivElement>(null)
  const [activeChapter, setActiveChapter] = useState('portada')
  const viewMode = selectedViewMode ?? 'scroll'

  // Memoizar el cálculo del countdown
  const initialRemaining = useMemo(
    () => countdown(invitation.eventDate, invitation.eventTime),
    [invitation.eventDate, invitation.eventTime],
  )

  const [remaining, setRemaining] = useState(initialRemaining)

  // Actualizar countdown de forma segura
  useEffect(() => {
    const timer = window.setInterval(() => {
      try {
        setRemaining(countdown(invitation.eventDate, invitation.eventTime))
      } catch {
        // Silenciar errores de actualización
      }
    }, 60000)

    return () => window.clearInterval(timer)
  }, [invitation.eventDate, invitation.eventTime])

  // Hook de animaciones con manejo de errores
  useInvitationAnimations(
    experienceRef,
    preview,
    viewMode,
    invitation.galleryImageUrls || [],
  )

  // Observer de capítulos con mejor manejo
  useEffect(() => {
    const experience = experienceRef.current
    if (!experience || !('IntersectionObserver' in window)) return

    const observationRoot =
      viewMode === 'navigation'
        ? experience.querySelector('.experience-chapters')
        : preview
          ? experience
          : null

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleChapter = entries.find((entry) => entry.isIntersecting)
        if (visibleChapter) {
          setActiveChapter(visibleChapter.target.id)
        }
      },
      { root: observationRoot, threshold: 0.55 },
    )

    const chapters = experience.querySelectorAll<HTMLElement>(
      '.experience-chapter[id]',
    )
    chapters.forEach((chapter) => observer.observe(chapter))

    return () => observer.disconnect()
  }, [preview, viewMode])

  // Posiciones de imágenes con mejor manejo
  useEffect(() => {
    const applyImagePositions = () => {
      const experience = experienceRef.current
      if (!experience) return

      try {
        const hero = experience.querySelector<HTMLImageElement>(
          '.experience-cover-media img',
        )
        const farewell = experience.querySelector<HTMLImageElement>(
          '.experience-farewell-media img',
        )

        const heroPosition =
          invitation.heroImagePosition ??
          Number(sessionStorage.getItem('heroImagePosition') ?? 50)
        const finalPosition =
          invitation.finalImagePosition ??
          Number(sessionStorage.getItem('finalImagePosition') ?? 50)

        if (hero) hero.style.objectPosition = `50% ${heroPosition}%`
        if (farewell) farewell.style.objectPosition = `50% ${finalPosition}%`
      } catch {
        // Silenciar errores de posicionamiento
      }
    }

    applyImagePositions()

    window.addEventListener(
      'invitation-image-position-change',
      applyImagePositions,
    )
    return () =>
      window.removeEventListener(
        'invitation-image-position-change',
        applyImagePositions,
      )
  }, [invitation.heroImagePosition, invitation.finalImagePosition])

  // Navegación con mejor manejo de errores
  const navigateTo = useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>, id: string) => {
      event.preventDefault()
      const experience = experienceRef.current
      if (!experience) return

      const target = experience.querySelector<HTMLElement>(`#${id}`)
      if (!target) return

      try {
        if (viewMode === 'navigation') {
          const container = experience.querySelector<HTMLElement>(
            '.experience-chapters',
          )
          if (container) {
            container.scrollTo({ left: target.offsetLeft, behavior: 'smooth' })
          }
        } else {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      } catch {
        // Silenciar errores de navegación
      }
    },
    [viewMode],
  )

  const navigateAdjacent = useCallback(
    (direction: 1 | -1) => {
      const index = chapters.findIndex(
        (chapter) => chapter.id === activeChapter,
      )
      const adjacent = chapters[index + direction]
      if (!adjacent) return

      const target = experienceRef.current?.querySelector<HTMLElement>(
        `#${adjacent.id}`,
      )
      const container = experienceRef.current?.querySelector<HTMLElement>(
        '.experience-chapters',
      )

      if (container && target) {
        container.scrollTo({ left: target.offsetLeft, behavior: 'smooth' })
      }
    },
    [activeChapter],
  )

  // Capítulos con validación
  const chapters = useMemo(
    () => [
      { id: 'portada', label: 'Portada' },
      { id: 'frase', label: 'Frase' },
      { id: 'fecha', label: 'Datos' },
      { id: 'confirmar', label: '¿Vas a venir?' },
      ...(invitation.galleryImageUrls?.length
        ? [{ id: 'fotos', label: 'Fotos' }]
        : []),
      { id: 'final', label: 'Final' },
    ],
    [invitation.galleryImageUrls],
  )

  const gallery = invitation.galleryImageUrls ?? []
  const finalImage = gallery.at(-1) ?? invitation.heroImageUrl

  // Rendering seguro
  if (!invitation) {
    return <div>Error: Invitación no disponible</div>
  }

  return (
    <div
      ref={experienceRef}
      className={`invitation-experience${preview ? ' is-preview' : ''}${viewMode === 'navigation' ? ' is-navigation' : ' is-scroll'}`}
    >
      {viewMode === 'navigation' && (
        <div
          className="experience-horizontal-hints"
          aria-label="Controles de navegación"
        >
          <button
            type="button"
            className="experience-horizontal-hint is-left"
            aria-label="Desliza hacia la izquierda"
            disabled={activeChapter === chapters[0]?.id}
            onClick={() => navigateAdjacent(-1)}
          >
            ← <span>Desliza izquierda</span>
          </button>
          <button
            type="button"
            className="experience-horizontal-hint is-right"
            aria-label="Desliza hacia la derecha"
            disabled={activeChapter === chapters.at(-1)?.id}
            onClick={() => navigateAdjacent(1)}
          >
            <span>Desliza derecha</span> →
          </button>
        </div>
      )}

      <div className="experience-chapters">
        {/* Cover Section */}
        <SectionBackground
          id="portada"
          className="experience-cover experience-chapter"
          background={invitation.sectionBackgrounds?.basic}
        >
          {invitation.heroImageUrl &&
            !(
              invitation.sectionBackgrounds?.basic?.customized &&
              invitation.sectionBackgrounds.basic.type === 'image'
            ) && (
              <div className="experience-cover-media" data-reveal="media">
                <img
                  src={invitation.heroImageUrl}
                  alt={`Foto principal de ${invitation.honoreeName || 'invitado'}`}
                  fetchPriority="high"
                  decoding="async"
                />
              </div>
            )}
          <div className="experience-cover-copy" data-reveal="group">
            <span className="experience-number">01</span>
            <p className="experience-cover-invite">
              {invitation.sectionBackgrounds?.basic?.introText ||
                'Estamos felices de invitarte al cumple de'}
            </p>
            <CoverHeading className="experience-cover-name">
              {invitation.honoreeName || 'Invitado'}
            </CoverHeading>
            {(invitation.sectionBackgrounds?.basic?.coverDescription ||
              invitation.honoreeAge !== null) && (
              <p className="experience-cover-age">
                {(
                  invitation.sectionBackgrounds?.basic?.coverDescription ||
                  `Cumplo ${invitation.honoreeAge || 0} años`
                )
                  .split(/(\d+(?:[.,]\d+)?)/g)
                  .map((part, index) =>
                    /^\d/.test(part) ? (
                      <strong key={`${part}-${index}`}>{part}</strong>
                    ) : (
                      part
                    ),
                  )}
              </p>
            )}
            <a
              href="#frase"
              aria-label="Continuar"
              onClick={(event) => navigateTo(event, 'frase')}
            >
              {viewMode === 'navigation'
                ? 'Continúa hacia la derecha →'
                : 'Desliza para descubrir ↓'}
            </a>
          </div>
        </SectionBackground>

        {/* Frase Section */}
        <SectionBackground
          id="frase"
          className="experience-section experience-intro experience-chapter"
          background={invitation.sectionBackgrounds?.tribute}
          reveal="group"
        >
          <span className="experience-number">02</span>
          <p>{invitation.message || 'Mensaje especial'}</p>
        </SectionBackground>

        {/* Fecha Section */}
        <SectionBackground
          id="fecha"
          className="experience-section experience-when experience-place experience-chapter"
          background={invitation.sectionBackgrounds?.date}
          reveal="group"
        >
          <span className="experience-number">03</span>
          <h2>Reserva este momento</h2>
          <strong>
            {formatDate(invitation.eventDate) || 'Fecha por definir'}
          </strong>
          <p>
            A las {invitation.eventTime?.slice(0, 5) || 'Hora por definir'}{' '}
            horas
          </p>
          <div className="countdown">
            <div>
              <b>{remaining.days}</b>
              <span>Días</span>
            </div>
            <div>
              <b>{remaining.hours}</b>
              <span>Horas</span>
            </div>
            <div>
              <b>{remaining.minutes}</b>
              <span>Minutos</span>
            </div>
          </div>
          <h2 className="experience-place-title">
            Aquí te esperamos con cariño
          </h2>
          <strong>{invitation.venueName || 'Lugar por confirmar'}</strong>
          <p>{invitation.address || 'Dirección por confirmar'}</p>
          {invitation.mapsUrl && (
            <a
              href={invitation.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Abrir en Google Maps
            </a>
          )}
        </SectionBackground>

        {/* Confirmar Section */}
        <SectionBackground
          id="confirmar"
          className="experience-section experience-rsvp experience-chapter"
          background={invitation.sectionBackgrounds?.message}
          reveal="group"
        >
          <span className="experience-number">04</span>
          <h2>Confirma tu presencia</h2>
          <RsvpForm publicSlug={invitation.publicSlug} preview={preview} />
        </SectionBackground>

        {/* Fotos Section */}
        {(gallery.length > 0 || preview) && (
          <SectionBackground
            id="fotos"
            className="experience-section experience-gallery experience-chapter"
            background={invitation.sectionBackgrounds?.gallery}
            reveal="group"
          >
            <span className="experience-number">05</span>
            <h2>Momentos que guardamos</h2>
            {gallery.length > 0 ? (
              <>
                <div className="experience-gallery-grid" data-reveal="group">
                  {gallery.map((url, index) => (
                    <figure key={url || index}>
                      <img
                        src={url}
                        alt={`Recuerdo ${index + 1} de ${invitation.honoreeName || 'invitado'}`}
                        loading="lazy"
                        decoding="async"
                      />
                    </figure>
                  ))}
                </div>
                <p className="experience-gallery-caption">
                  Cada recuerdo nos trae hasta este día tan especial.
                </p>
              </>
            ) : (
              <p className="experience-gallery-caption">
                Tus fotos aparecerán aquí cuando las agregues.
              </p>
            )}
          </SectionBackground>
        )}

        {/* Final Section */}
        <SectionBackground
          id="final"
          className="experience-farewell experience-chapter"
          background={invitation.sectionBackgrounds?.summary}
        >
          {finalImage &&
            !(
              invitation.sectionBackgrounds?.summary?.customized &&
              invitation.sectionBackgrounds.summary.type === 'image'
            ) && (
              <div className="experience-farewell-media" data-reveal="media">
                <img
                  src={finalImage}
                  alt={`Recuerdo especial de ${invitation.honoreeName || 'invitado'}`}
                  loading="lazy"
                  decoding="async"
                />
              </div>
            )}
          <div className="experience-farewell-copy" data-reveal="group">
            <span className="experience-number">06</span>
            <p>
              {invitation.sectionBackgrounds?.summary?.farewellText ||
                'Gracias por acompañarnos en este día tan especial.'}
            </p>
            <h2>
              {invitation.sectionBackgrounds?.summary?.farewellTitle ||
                '¡Te esperamos!'}
            </h2>
            <span>✦</span>
          </div>
        </SectionBackground>
      </div>

      <InvitationFooter contact={invitation.contactInfo} />
    </div>
  )
}
