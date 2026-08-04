import { useState } from 'react'
import { PublicHeader } from '../../shared/components/layout/PublicHeader'
import { register, RegistrationError } from './services/authSession'

const returnTo = () => {
  const value = new URLSearchParams(window.location.search).get('returnTo')
  return value?.startsWith('/') && !value.startsWith('//')
    ? value
    : '/templates'
}
export function RegisterPage() {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmation: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const update = (field: keyof typeof form, value: string) =>
    setForm((current) => ({ ...current, [field]: value }))
  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (submitting) return
    if (form.password !== form.confirmation) {
      setError('Las contraseñas no coinciden.')
      return
    }
    setSubmitting(true)
    setError('')
    try {
      await register(form)
      window.location.assign(
        `/login?returnTo=${encodeURIComponent(returnTo())}&registered=true`,
      )
    } catch (failure) {
      setError(
        failure instanceof RegistrationError
          ? failure.message
          : 'No fue posible crear la cuenta.',
      )
      setSubmitting(false)
    }
  }
  return (
    <>
      <PublicHeader />
      <main className="login-shell section-shell">
        <section className="login-card register-card">
          <span className="pill">Nueva cuenta</span>
          <h1>Crea tu cuenta</h1>
          <p>Regístrate para guardar y publicar tus invitaciones.</p>
          <form onSubmit={submit}>
            <div className="register-name-row">
              <label>
                <span>Nombre</span>
                <input
                  aria-label="Nombre"
                  autoComplete="given-name"
                  required
                  maxLength={100}
                  value={form.firstName}
                  onChange={(event) => update('firstName', event.target.value)}
                />
              </label>
              <label>
                <span>Apellido</span>
                <input
                  aria-label="Apellido"
                  autoComplete="family-name"
                  required
                  maxLength={100}
                  value={form.lastName}
                  onChange={(event) => update('lastName', event.target.value)}
                />
              </label>
            </div>
            <label>
              <span>Correo electrónico</span>
              <input
                aria-label="Correo electrónico"
                type="email"
                autoComplete="email"
                required
                maxLength={254}
                value={form.email}
                onChange={(event) => update('email', event.target.value)}
              />
            </label>
            <label>
              <span>Contraseña</span>
              <input
                aria-label="Contraseña"
                type="password"
                autoComplete="new-password"
                required
                minLength={8}
                maxLength={72}
                value={form.password}
                onChange={(event) => update('password', event.target.value)}
              />
              <small>Al menos 8 caracteres, una letra y un número.</small>
            </label>
            <label>
              <span>Confirmar contraseña</span>
              <input
                aria-label="Confirmar contraseña"
                type="password"
                autoComplete="new-password"
                required
                maxLength={72}
                value={form.confirmation}
                onChange={(event) => update('confirmation', event.target.value)}
              />
            </label>
            {error && (
              <p className="form-error" role="alert">
                {error}
              </p>
            )}
            <button className="primary-cta" type="submit" disabled={submitting}>
              {submitting ? 'Creando cuenta...' : 'Crear cuenta'}
            </button>
          </form>
          <div className="account-prompt">
            <span>¿Ya tienes una cuenta?</span>
            <a href={`/login?returnTo=${encodeURIComponent(returnTo())}`}>
              Iniciar sesión
            </a>
          </div>
        </section>
      </main>
    </>
  )
}
