import { useEffect, useRef, useState } from 'react'
import { confirmAttendance, InvitationApiError } from '../services/invitations'
import type { PublicInvitation } from '../types/invitation'
import { SectionBackground } from './SectionBackground'
import { InvitationFooter } from './InvitationFooter'
import { useInvitationAnimations } from './useInvitationAnimations'

const formatDate = (date: string) =>
  new Intl.DateTimeFormat('es-CL', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(`${date}T12:00:00`))
const countdown = (date: string, time: string) => {
  const normalizedTime = (time || '00:00').slice(0, 5)
  const target = new Date(`${date}T${normalizedTime}:00`).getTime()
  const difference = target - Date.now()
  if (!date || !Number.isFinite(target) || difference <= 0)
    return { days: 0, hours: 0, minutes: 0 }
  return {
    days: Math.floor(difference / 86400000),
    hours: Math.floor(difference / 3600000) % 24,
    minutes: Math.floor(difference / 60000) % 60,
  }
}

function RsvpForm({ publicSlug }: { publicSlug: string }) {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    guestCount: 1,
    attending: true,
    message: '',
  })
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'error'>(
    'idle',
  )
  const [error, setError] = useState('')
  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    setState('sending')
    setError('')
    try {
      await confirmAttendance(publicSlug, form)
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
  if (state === 'sent')
    return (
      <p className="rsvp-success" role="status">
        ¡Gracias! Tu respuesta fue enviada.
      </p>
    )
  return (
    <form className="rsvp-form" onSubmit={submit}>
      <div className="rsvp-name-row">
        <label>
          <span>Nombre</span>
          <input
            required
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
          min="1"
          max="20"
          required
          value={form.guestCount}
          onChange={(event) =>
            setForm({ ...form, guestCount: Number(event.target.value) })
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
            onChange={() => setForm({ ...form, attending: true })}
          />{' '}
          Sí, asistiré
        </label>
        <label>
          <input
            type="radio"
            name="attending"
            checked={!form.attending}
            onChange={() => setForm({ ...form, attending: false })}
          />{' '}
          No podré asistir
        </label>
      </fieldset>
      <label>
        <span>Mensaje para el anfitrión (opcional)</span>
        <textarea
          maxLength={500}
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

export function PublicInvitationRenderer({
  invitation,
  preview = false,
  viewMode: selectedViewMode,
}: {
  invitation: PublicInvitation
  preview?: boolean
  viewMode?: 'scroll' | 'navigation'
}) {
  const CoverHeading = preview ? 'h2' : 'h1'
  const experienceRef = useRef<HTMLDivElement>(null)
  const [activeChapter, setActiveChapter] = useState('portada')
  const viewMode = selectedViewMode ?? 'scroll'
  const [remaining, setRemaining] = useState(() =>
    countdown(invitation.eventDate, invitation.eventTime),
  )
  useEffect(() => {
    const timer = window.setInterval(
      () => setRemaining(countdown(invitation.eventDate, invitation.eventTime)),
      60000,
    )
    return () => window.clearInterval(timer)
  }, [invitation.eventDate, invitation.eventTime])
  useInvitationAnimations(
    experienceRef,
    preview,
    viewMode,
    invitation.galleryImageUrls,
  )
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
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveChapter(entry.target.id)
        }),
      { root: observationRoot, threshold: 0.55 },
    )
    experience
      .querySelectorAll<HTMLElement>('.experience-chapter[id]')
      .forEach((chapter) => observer.observe(chapter))
    return () => observer.disconnect()
  }, [preview, viewMode, invitation.galleryImageUrls])
  const gallery = invitation.galleryImageUrls ?? []
  const finalImage = gallery.at(-1) ?? invitation.heroImageUrl
  useEffect(() => {
    const applyImagePositions = () => {
      const experience = experienceRef.current
      if (!experience) return
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
  }, [
    invitation.heroImagePosition,
    invitation.finalImagePosition,
    invitation.heroImageUrl,
    finalImage,
  ])
  const chapters = [
    { id: 'portada', label: 'Portada' },
    { id: 'frase', label: 'Frase' },
    { id: 'fecha', label: 'Fecha' },
    { id: 'lugar', label: 'Lugar' },
    ...(gallery.length ? [{ id: 'fotos', label: 'Fotos' }] : []),
    { id: 'confirmar', label: '¿Vas a venir?' },
    { id: 'final', label: 'Final' },
  ]
  const navigateTo = (
    event: React.MouseEvent<HTMLAnchorElement>,
    id: string,
  ) => {
    event.preventDefault()
    const experience = experienceRef.current
    const target = experience?.querySelector<HTMLElement>(`#${id}`)
    if (!target) return
    if (viewMode === 'navigation')
      experience
        ?.querySelector<HTMLElement>('.experience-chapters')
        ?.scrollTo({ left: target.offsetLeft, behavior: 'smooth' })
    else target.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
  const navigateAdjacent = (direction: 1 | -1) => {
    const index = chapters.findIndex((chapter) => chapter.id === activeChapter)
    const adjacent = chapters[index + direction]
    if (!adjacent) return
    const target = experienceRef.current?.querySelector<HTMLElement>(
      `#${adjacent.id}`,
    )
    experienceRef.current
      ?.querySelector<HTMLElement>('.experience-chapters')
      ?.scrollTo({ left: target?.offsetLeft ?? 0, behavior: 'smooth' })
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
        <SectionBackground
          id="portada"
          className="experience-cover experience-chapter"
          background={invitation.sectionBackgrounds?.basic}
        >
          {invitation.heroImageUrl && (
            <div className="experience-cover-media experience-animate">
              <img
                src={invitation.heroImageUrl}
                alt={`Foto principal de ${invitation.honoreeName}`}
              />
            </div>
          )}
          <div className="experience-cover-copy experience-animate">
            <p className="experience-cover-invite">
              Estamos felices de invitarte al cumple de
            </p>
            <CoverHeading>{invitation.honoreeName}</CoverHeading>
            {invitation.honoreeAge !== null && (
              <p className="experience-cover-age">
                que cumple <strong>{invitation.honoreeAge} años</strong>
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
        <SectionBackground
          id="frase"
          className="experience-section experience-intro experience-animate experience-chapter"
          background={invitation.sectionBackgrounds?.tribute}
        >
          <span className="experience-number">01</span>
          <p>{invitation.message}</p>
        </SectionBackground>
        <SectionBackground
          id="fecha"
          className="experience-section experience-when experience-animate experience-chapter"
          background={invitation.sectionBackgrounds?.date}
        >
          <span className="experience-number">02</span>
          <h2>Reserva este momento</h2>
          <strong>{formatDate(invitation.eventDate)}</strong>
          <p>A las {invitation.eventTime.slice(0, 5)} horas</p>
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
        </SectionBackground>
        <SectionBackground
          id="lugar"
          className="experience-section experience-place experience-animate experience-chapter"
          background={invitation.sectionBackgrounds?.venue}
        >
          <span className="experience-number">03</span>
          <h2>Nos encontramos aquí</h2>
          <strong>{invitation.venueName}</strong>
          <p>{invitation.address}</p>
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
        {gallery.length > 0 && (
          <SectionBackground
            id="fotos"
            className="experience-section experience-gallery experience-animate experience-chapter"
            background={invitation.sectionBackgrounds?.gallery}
          >
            <span className="experience-number">04</span>
            <h2>Momentos que guardamos</h2>
            <div>
              {gallery.map((url, index) => (
                <figure
                  key={url}
                  style={
                    {
                      '--reveal-delay': `${index * 150}ms`,
                    } as React.CSSProperties
                  }
                >
                  <img
                    src={url}
                    alt={`Recuerdo ${index + 1} de ${invitation.honoreeName}`}
                    loading="lazy"
                  />
                </figure>
              ))}
            </div>
            <p>Cada recuerdo nos trae hasta este día tan especial.</p>
          </SectionBackground>
        )}
        <SectionBackground
          id="confirmar"
          className="experience-section experience-rsvp experience-animate experience-chapter"
          background={invitation.sectionBackgrounds?.message}
        >
          <span className="experience-number">05</span>
          <h2>Confirma tu presencia</h2>
          {preview ? (
            <div className="rsvp-preview">
              El formulario de confirmación aparecerá aquí.
            </div>
          ) : (
            <RsvpForm publicSlug={invitation.publicSlug} />
          )}
        </SectionBackground>
        <SectionBackground
          id="final"
          className="experience-farewell experience-chapter"
          background={invitation.sectionBackgrounds?.summary}
        >
          {finalImage && (
            <div className="experience-farewell-media experience-animate">
              <img
                src={finalImage}
                alt={`Recuerdo especial de ${invitation.honoreeName}`}
                loading="lazy"
              />
            </div>
          )}
          <div className="experience-farewell-copy experience-animate">
            <p>Tu presencia hará este día todavía más especial.</p>
            <h2>Te esperamos</h2>
            <span>✦</span>
          </div>
        </SectionBackground>
      </div>
      <InvitationFooter contact={invitation.contactInfo} />
    </div>
  )
}
