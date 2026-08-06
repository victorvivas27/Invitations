import { useEffect, type RefObject } from 'react'

export function useInvitationAnimations(
  experienceRef: RefObject<HTMLDivElement | null>,
  preview: boolean,
  viewMode: 'scroll' | 'navigation',
  refreshKey: unknown,
) {
  useEffect(() => {
    const experience = experienceRef.current
    if (!experience || !('IntersectionObserver' in window)) return
    experience.classList.add('motion-ready')
    const root =
      viewMode === 'navigation'
        ? experience.querySelector('.experience-chapters')
        : preview
          ? experience
          : null
    // La aparición ocurre una sola vez. Al alternar la clase, en pantallas
    // pequeñas cada sección entraba y salía del viewport continuamente y la
    // animación se reiniciaba a cada scroll, algo que en escritorio casi no se
    // notaba porque las secciones permanecen visibles.
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          entry.target.classList.add('is-visible')
          observer.unobserve(entry.target)
        }),
      { root, threshold: 0.18, rootMargin: '0px 0px -6% 0px' },
    )
    const frame = window.requestAnimationFrame(() => {
      experience
        .querySelectorAll('.experience-animate')
        .forEach((element) => observer.observe(element))
    })
    return () => {
      window.cancelAnimationFrame(frame)
      observer.disconnect()
    }
  }, [experienceRef, preview, viewMode, refreshKey])
}
