import { useEffect, useState, type RefObject } from 'react'

export const MOTION_READY_CLASS = 'motion-ready'
export const REVEALED_CLASS = 'is-visible'
export const RESETTING_CLASS = 'is-resetting'
export const REVEAL_SELECTOR = '[data-reveal]'

/* threshold 0 con un margen inferior negativo: el disparo depende de cuánto ha
   entrado el elemento en pantalla y no de qué fracción de su altura se ve. Con
   un threshold por proporción, una sección más alta que el viewport del teléfono
   se revelaba en un punto distinto que en escritorio. */
export const REVEAL_VIEWPORT: IntersectionObserverInit = {
  threshold: 0,
  rootMargin: '0px 0px -12% 0px',
}

/* Las apariciones se ejecutan una sola vez. Al devolver el elemento a su estado
   oculto cuando salía de pantalla, en un teléfono las secciones entran y salen
   continuamente y la animación se reiniciaba en cada scroll: parpadeo, texto a
   medio camino y trabajo de composición constante. `once: false` queda
   disponible para volver a evaluarlo, pero no es el modo recomendado. */
type RevealOptions = {
  once?: boolean
}

/**
 * Observa todos los descendientes marcados con data-reveal dentro de un
 * contenedor usando un único IntersectionObserver, y les añade la clase de
 * revelado. No provoca renders de React durante el scroll.
 */
export function useRevealGroup(
  containerRef: RefObject<HTMLElement | null>,
  options: RevealOptions & {
    /** Descendiente que hace de contenedor con scroll. */
    rootSelector?: string
    /** El propio contenedor hace de contenedor con scroll. */
    rootIsContainer?: boolean
    refreshKey?: unknown
  } = {},
) {
  const { once = true, rootSelector, rootIsContainer, refreshKey } = options
  useEffect(() => {
    const container = containerRef.current
    if (!container || !('IntersectionObserver' in window)) return
    container.classList.add(MOTION_READY_CLASS)
    const root = rootSelector
      ? container.querySelector(rootSelector)
      : rootIsContainer
        ? container
        : null
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.remove(RESETTING_CLASS)
            entry.target.classList.add(REVEALED_CLASS)
            if (once) observer.unobserve(entry.target)
          } else if (!once) {
            entry.target.classList.add(RESETTING_CLASS)
            entry.target.classList.remove(REVEALED_CLASS)
            window.requestAnimationFrame(() =>
              entry.target.classList.remove(RESETTING_CLASS),
            )
          }
        }),
      { ...REVEAL_VIEWPORT, root },
    )
    // El primer frame pinta el estado inicial que activa .motion-ready; el
    // segundo empieza a observar. Observar en el primer callback permitía que
    // un elemento ya visible recibiera .is-visible antes de que el navegador
    // llegara a pintar su desplazamiento inicial, por lo que no había una
    // transición perceptible.
    let observationFrame = 0
    const preparationFrame = window.requestAnimationFrame(() => {
      observationFrame = window.requestAnimationFrame(() => {
        container
          .querySelectorAll(REVEAL_SELECTOR)
          .forEach((element) => observer.observe(element))
      })
    })
    return () => {
      window.cancelAnimationFrame(preparationFrame)
      window.cancelAnimationFrame(observationFrame)
      observer.disconnect()
    }
  }, [containerRef, once, rootSelector, rootIsContainer, refreshKey])
}

/**
 * Variante para un único elemento que necesita el estado en React. El valor
 * inicial es `true` cuando no hay IntersectionObserver, de modo que el contenido
 * nunca queda oculto de forma permanente.
 */
export function useRevealed(
  elementRef: RefObject<HTMLElement | null>,
  { once = true }: RevealOptions = {},
) {
  const [revealed, setRevealed] = useState(
    () => typeof IntersectionObserver === 'undefined',
  )
  useEffect(() => {
    const element = elementRef.current
    if (!element || !('IntersectionObserver' in window)) {
      setRevealed(true)
      return
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setRevealed(true)
        if (once) observer.disconnect()
      } else if (!once) {
        setRevealed(false)
      }
    }, REVEAL_VIEWPORT)
    observer.observe(element)
    return () => observer.disconnect()
  }, [elementRef, once])
  return revealed
}
