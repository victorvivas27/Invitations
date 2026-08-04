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
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          entry.target.classList.toggle('is-visible', entry.isIntersecting)
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
