import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  clearSession,
  getAccessToken,
  getSessionUser,
  loadSessionUser,
} from '../../../modules/auth/services/authSession'
import { ThemeToggle } from './ThemeToggle'

export const APP_NAME = 'Mi Invitación'

type NavIconName =
  'home' | 'info' | 'templates' | 'invitations' | 'create' | 'login' | 'logout'

function NavIcon({ name }: { name: NavIconName }) {
  const paths: Record<NavIconName, ReactNode> = {
    home: <path d="M3.5 10.5 12 3l8.5 7.5M5.5 9v11h13V9M9.5 20v-6h5v6" />,
    info: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 11v6M12 7.5h.01" />
      </>
    ),
    templates: (
      <>
        <rect x="4" y="3.5" width="16" height="17" rx="2.5" />
        <path d="M8 8h8M8 12h8M8 16h5" />
      </>
    ),
    invitations: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2.5" />
        <path d="m4.5 7 7.5 6 7.5-6" />
      </>
    ),
    create: <path d="M12 5v14M5 12h14" />,
    login: (
      <>
        <path d="M14 4h5v16h-5M10 8l4 4-4 4M14 12H3" />
      </>
    ),
    logout: (
      <>
        <path d="M10 4H5v16h5M14 8l4 4-4 4M18 12H8" />
      </>
    ),
  }

  return (
    <svg
      className="nav-item-icon"
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
    >
      <g
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {paths[name]}
      </g>
    </svg>
  )
}

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
      <span>{user ? `${user.firstName} ${user.lastName}` : 'Usuario'}</span>
      <span className="session-avatar" aria-hidden="true">
        {initials}
      </span>
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
          <div className="desktop-navigation">
            <Link
              className={activePage === 'home' ? 'active' : undefined}
              to="/"
            >
              <NavIcon name="home" />
              Inicio
            </Link>
            <Link to="/#como-funciona">
              <NavIcon name="info" />
              Cómo funciona
            </Link>
            {authenticated && (
              <>
                <Link
                  className={activePage === 'templates' ? 'active' : undefined}
                  aria-current={activePage === 'templates' ? 'page' : undefined}
                  to="/templates"
                >
                  <NavIcon name="templates" />
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
                  <NavIcon name="invitations" />
                  Mis invitaciones
                </Link>
              </>
            )}
          </div>
          <div className="desktop-actions">
            {authenticated ? (
              <>
                <Link className="nav-cta" to="/templates">
                  <NavIcon name="create" />
                  Crear invitación
                </Link>
                <button
                  type="button"
                  className="logout-button"
                  onClick={logout}
                >
                  <NavIcon name="logout" />
                  Cerrar sesión
                </button>
                <ThemeToggle />
                {userIndicator}
              </>
            ) : (
              <>
                <Link className="nav-cta" to="/login">
                  <NavIcon name="login" />
                  Iniciar sesión
                </Link>
                <ThemeToggle />
              </>
            )}
          </div>
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
              <NavIcon name="home" />
              Inicio
            </Link>
            <Link to="/#como-funciona" onClick={close}>
              <NavIcon name="info" />
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
                  <NavIcon name="templates" />
                  Plantillas
                </Link>
                <Link
                  aria-current={
                    activePage === 'my-invitations' ? 'page' : undefined
                  }
                  to="/my-invitations"
                  onClick={close}
                >
                  <NavIcon name="invitations" />
                  Mis invitaciones
                </Link>
                <Link className="nav-cta" to="/templates" onClick={close}>
                  <NavIcon name="create" />
                  Crear invitación
                </Link>
                <button
                  type="button"
                  className="logout-button"
                  onClick={logout}
                >
                  <NavIcon name="logout" />
                  Cerrar sesión
                </button>
              </>
            ) : (
              <Link className="nav-cta" to="/login" onClick={close}>
                <NavIcon name="login" />
                Iniciar sesión
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
