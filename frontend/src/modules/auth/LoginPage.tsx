import { useState } from 'react'
import { PublicHeader } from '../../shared/components/layout/PublicHeader'
import { login, LoginError } from './services/authSession'

const safeReturnTo = () => {
  const value = new URLSearchParams(window.location.search).get('returnTo')
  return value?.startsWith('/') && !value.startsWith('//')
    ? value
    : '/templates'
}
const registrationUrl = () =>
  `/register?returnTo=${encodeURIComponent(safeReturnTo())}`

export function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (submitting) return
    setSubmitting(true)
    setError('')
    try {
      await login(email, password)
      window.location.assign(safeReturnTo())
    } catch (failure) {
      setError(
        failure instanceof LoginError
          ? failure.message
          : 'No fue posible iniciar sesión.',
      )
      setSubmitting(false)
    }
  }
  return (
    <>
      <PublicHeader />
      <main className="login-shell section-shell">
        <section className="login-card">
          <span className="pill">Acceso seguro</span>
          <h1>Inicia sesión para crear tu invitación</h1>
          <p>
            Tu cuenta permite asociar y conservar las invitaciones que
            publiques.
          </p>
          <form onSubmit={submit}>
            <label>
              <span>Correo electrónico</span>
              <input
                type="email"
                autoComplete="email"
                required
                maxLength={254}
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </label>
            <label>
              <span>Contraseña</span>
              <input
                type="password"
                autoComplete="current-password"
                required
                maxLength={72}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </label>
            {error && (
              <p className="form-error" role="alert">
                {error}
              </p>
            )}
            <button className="primary-cta" type="submit" disabled={submitting}>
              {submitting ? 'Iniciando sesión...' : 'Iniciar sesión'}
            </button>
          </form>
          <div className="account-prompt">
            <span>¿Todavía no tienes una cuenta?</span>
            <a href={registrationUrl()}>Crear cuenta</a>
          </div>
          <a className="login-back" href="/">
            Volver al inicio
          </a>
        </section>
      </main>
    </>
  )
}
