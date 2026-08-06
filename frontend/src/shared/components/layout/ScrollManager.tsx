import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Con navegación cliente el navegador ya no reposiciona la vista al cambiar de
 * ruta. Este componente restaura ese comportamiento: sube al inicio en cada
 * cambio de ruta y respeta los enlaces con ancla dentro de una misma página.
 */
export function ScrollManager() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) {
      let target: Element | null
      try {
        target = document.querySelector(hash)
      } catch {
        target = null
      }
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' })
        return
      }
    }
    window.scrollTo({ top: 0, left: 0 })
  }, [pathname, hash])
  return null
}
