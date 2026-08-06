import type { ReactNode } from 'react'
import { PublicFooter } from './PublicFooter'
import { PublicHeader } from './PublicHeader'

/**
 * Cabecera, contenedor principal y pie compartidos por todas las páginas
 * internas. Al vivir en un solo componente, la navegación entre rutas
 * reemplaza únicamente el contenido y nunca el marco de la aplicación.
 */
export function AppLayout({
  activePage,
  className,
  withFooter = false,
  children,
}: {
  activePage?: 'home' | 'templates' | 'my-invitations'
  className: string
  withFooter?: boolean
  children: ReactNode
}) {
  return (
    <>
      <PublicHeader activePage={activePage} />
      <main className={className}>{children}</main>
      {withFooter && <PublicFooter />}
    </>
  )
}
