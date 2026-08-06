import { type RefObject } from 'react'
import { useRevealGroup } from '../../../shared/animation'

/**
 * Apariciones de la invitación. Delega en el primitivo compartido y solo aporta
 * lo propio de esta vista: en modo navegación los capítulos se desplazan dentro
 * de un carrusel horizontal, así que ese contenedor es el root del observer; en
 * la vista previa del wizard el root es la propia experiencia.
 */
export function useInvitationAnimations(
  experienceRef: RefObject<HTMLDivElement | null>,
  preview: boolean,
  viewMode: 'scroll' | 'navigation',
  refreshKey: unknown,
) {
  useRevealGroup(experienceRef, {
    rootSelector:
      viewMode === 'navigation' ? '.experience-chapters' : undefined,
    rootIsContainer: viewMode !== 'navigation' && preview,
    refreshKey,
  })
}
