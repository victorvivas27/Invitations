import { useEffect, useRef, useState } from 'react'
import {
  clearSession,
  getAccessToken,
  getSessionUser,
  loadSessionUser,
} from '../../../modules/auth/services/authSession'
import { ThemeToggle } from './ThemeToggle'

export const APP_NAME = 'Mi Invitación'

export function PublicHeader({
  activePage,
}: {
  activePage?: 'home' | 'templates' | 'my-invitations'
}) {
  const [open, setOpen] = useState(false)
  const authenticated = Boolean(getAccessToken())
  const [user, setUser] = useState(getSessionUser)
  const closeButton = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    document.body.classList.toggle('menu-open', open)
    if (open) closeButton.current?.focus()
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', closeOnEscape)
    return () => {
      document.removeEventListener('keydown', closeOnEscape)
      document.body.classList.remove('menu-open')
    }
  }, [open])
  useEffect(() => {
    if (authenticated && !user)
      void loadSessionUser().then((loaded) => {
        if (loaded) setUser(loaded)
      })
  }, [authenticated, user])
  const close = () => setOpen(false)
  const logout = () => {
    clearSession()
    window.location.assign('/')
  }
  const initials =
    user?.firstName && user?.lastName
      ? `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toLocaleUpperCase(
          'es',
        )
      : 'U'
  const userIndicator = (
    <span
      className="session-indicator"
      title={user?.email ?? 'Usuario conectado'}
    >
      <span className="session-avatar" aria-hidden="true">
        {initials}
      </span>
      <span>{user ? `${user.firstName} ${user.lastName}` : 'Usuario'}</span>
    </span>
  )
  return (
    <header className="public-header">
      <nav className="public-nav" aria-label="Navegación principal">
        <a className="public-brand" href="/" aria-label={`${APP_NAME}, inicio`}>
          <span aria-hidden="true">✦</span>
          {APP_NAME}
        </a>
        <div className="desktop-links">
          <a className={activePage === 'home' ? 'active' : undefined} href="/">
            Inicio
          </a>
          <a href="/#como-funciona">Cómo funciona</a>
          {authenticated ? (
            <>
              <a
                className={activePage === 'templates' ? 'active' : undefined}
                aria-current={activePage === 'templates' ? 'page' : undefined}
                href="/templates"
              >
                Plantillas
              </a>
              <a
                className={
                  activePage === 'my-invitations' ? 'active' : undefined
                }
                aria-current={
                  activePage === 'my-invitations' ? 'page' : undefined
                }
                href="/my-invitations"
              >
                Mis invitaciones
              </a>
              {userIndicator}
              <a className="nav-cta" href="/templates">
                Crear invitación
              </a>
              <button type="button" className="logout-button" onClick={logout}>
                Cerrar sesión
              </button>
            </>
          ) : (
            <a className="nav-cta" href="/login">
              Iniciar sesión
            </a>
          )}
          <ThemeToggle />
        </div>
        <button
          className="menu-trigger"
          aria-label="Abrir menú"
          aria-controls="mobile-menu"
          aria-expanded={open}
          onClick={() => setOpen(true)}
        >
          ☰
        </button>
      </nav>
      {open && (
        <div className="menu-overlay" onMouseDown={close}>
          <div
            id="mobile-menu"
            className="mobile-menu"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <button
              ref={closeButton}
              className="menu-close"
              aria-label="Cerrar menú"
              onClick={close}
            >
              ×
            </button>
            <a href="/" onClick={close}>
              Inicio
            </a>
            <a href="/#como-funciona" onClick={close}>
              Cómo funciona
            </a>
            <ThemeToggle />
            {authenticated ? (
              <>
                {userIndicator}
                <a
                  aria-current={activePage === 'templates' ? 'page' : undefined}
                  href="/templates"
                  onClick={close}
                >
                  Plantillas
                </a>
                <a
                  aria-current={
                    activePage === 'my-invitations' ? 'page' : undefined
                  }
                  href="/my-invitations"
                  onClick={close}
                >
                  Mis invitaciones
                </a>
                <a className="nav-cta" href="/templates" onClick={close}>
                  Crear invitación
                </a>
                <button
                  type="button"
                  className="logout-button"
                  onClick={logout}
                >
                  Cerrar sesión
                </button>
              </>
            ) : (
              <a className="nav-cta" href="/login" onClick={close}>
                Iniciar sesión
              </a>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
