import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
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
  const navigate = useNavigate()
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
    setUser(null)
    setOpen(false)
    navigate('/', { replace: true })
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
        <Link
          className="public-brand"
          to="/"
          aria-label={`${APP_NAME}, inicio`}
        >
          <span aria-hidden="true">✦</span>
          {APP_NAME}
        </Link>
        <div className="desktop-links">
          <Link className={activePage === 'home' ? 'active' : undefined} to="/">
            Inicio
          </Link>
          <Link to="/#como-funciona">Cómo funciona</Link>
          {authenticated ? (
            <>
              <Link
                className={activePage === 'templates' ? 'active' : undefined}
                aria-current={activePage === 'templates' ? 'page' : undefined}
                to="/templates"
              >
                Plantillas
              </Link>
              <Link
                className={
                  activePage === 'my-invitations' ? 'active' : undefined
                }
                aria-current={
                  activePage === 'my-invitations' ? 'page' : undefined
                }
                to="/my-invitations"
              >
                Mis invitaciones
              </Link>
              {userIndicator}
              <Link className="nav-cta" to="/templates">
                Crear invitación
              </Link>
              <button type="button" className="logout-button" onClick={logout}>
                Cerrar sesión
              </button>
            </>
          ) : (
            <Link className="nav-cta" to="/login">
              Iniciar sesión
            </Link>
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
      {/* pointerdown y no mousedown: iOS Safari no emite eventos de ratón al
          tocar un div sin comportamiento interactivo, así que en el teléfono no
          se podía cerrar el menú tocando fuera. */}
      {open && (
        <div className="menu-overlay" onPointerDown={close}>
          <div
            id="mobile-menu"
            className="mobile-menu"
            onPointerDown={(event) => event.stopPropagation()}
          >
            <button
              ref={closeButton}
              className="menu-close"
              aria-label="Cerrar menú"
              onClick={close}
            >
              ×
            </button>
            <Link to="/" onClick={close}>
              Inicio
            </Link>
            <Link to="/#como-funciona" onClick={close}>
              Cómo funciona
            </Link>
            <ThemeToggle />
            {authenticated ? (
              <>
                {userIndicator}
                <Link
                  aria-current={activePage === 'templates' ? 'page' : undefined}
                  to="/templates"
                  onClick={close}
                >
                  Plantillas
                </Link>
                <Link
                  aria-current={
                    activePage === 'my-invitations' ? 'page' : undefined
                  }
                  to="/my-invitations"
                  onClick={close}
                >
                  Mis invitaciones
                </Link>
                <Link className="nav-cta" to="/templates" onClick={close}>
                  Crear invitación
                </Link>
                <button
                  type="button"
                  className="logout-button"
                  onClick={logout}
                >
                  Cerrar sesión
                </button>
              </>
            ) : (
              <Link className="nav-cta" to="/login" onClick={close}>
                Iniciar sesión
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
