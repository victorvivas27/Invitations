import { useRef, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { AppLayout } from '../../shared/components/layout/AppLayout'
import { FieldError } from '../../shared/components/feedback/FieldError'
import { login, LoginError } from './services/authSession'
const safeReturnTo = (value: string | null) =>
  value?.startsWith('/') && !value.startsWith('//') ? value : '/templates'
type Errors = Partial<Record<'email' | 'password' | 'form', string>>
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
export function LoginPage() {
  const [params] = useSearchParams(),
    navigate = useNavigate()
  const returnTo = safeReturnTo(params.get('returnTo'))
  const registrationUrl = `/register?returnTo=${encodeURIComponent(returnTo)}`
  const [email, setEmail] = useState(''),
    [password, setPassword] = useState('')
  const [passwordVisible, setPasswordVisible] = useState(false)
  const [submitting, setSubmitting] = useState(false),
    [errors, setErrors] = useState<Errors>({})
  const refs = {
    email: useRef<HTMLInputElement>(null),
    password: useRef<HTMLInputElement>(null),
  }
  const update = (field: 'email' | 'password', value: string) => {
    if (field === 'email') setEmail(value)
    else setPassword(value)
    setErrors((current) => ({
      ...current,
      [field]: undefined,
      form: undefined,
    }))
  }
  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (submitting) return
    const next: Errors = {}
    if (!email.trim()) next.email = 'El correo electrónico es obligatorio.'
    else if (!emailPattern.test(email.trim()))
      next.email = 'Ingresa un correo electrónico válido.'
    if (!password) next.password = 'La contraseña es obligatoria.'
    if (Object.keys(next).length) {
      setErrors(next)
      ;(next.email ? refs.email : refs.password).current?.focus()
      return
    }
    setSubmitting(true)
    setErrors({})
    try {
      await login(email, password)
      navigate(returnTo, { replace: true })
    } catch (failure) {
      const message =
        failure instanceof LoginError
          ? failure.message
          : 'No fue posible iniciar sesión.'
      setErrors(
        failure instanceof LoginError && failure.kind === 'credentials'
          ? { email: message }
          : { form: message },
      )
      setSubmitting(false)
      ;(failure instanceof LoginError && failure.kind === 'credentials'
        ? refs.email
        : refs.password
      ).current?.focus()
    }
  }
  return (
    <AppLayout className="login-shell section-shell">
      <section className="login-card login-access-card">
        <span className="pill">Acceso seguro</span>
        <h1>Inicia sesión para crear tu invitación</h1>
        <p>
          Tu cuenta permite asociar y conservar las invitaciones que publiques.
        </p>
        <form onSubmit={submit} noValidate>
          <div className="login-fields">
            <div className="login-field">
              <label htmlFor="login-email">Correo electrónico</label>
              <div className="auth-input-shell">
                <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="5" width="18" height="14" rx="3" />
                  <path d="m4.5 7 7.5 6 7.5-6" />
                </svg>
                <input
                  id="login-email"
                  ref={refs.email}
                  type="email"
                  autoComplete="email"
                  placeholder="nombre@correo.com"
                  required
                  maxLength={254}
                  value={email}
                  onChange={(e) => update('email', e.target.value)}
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={
                    errors.email ? 'login-email-error' : undefined
                  }
                />
              </div>
              <FieldError id="login-email-error" message={errors.email} />
            </div>
            <div className="login-field">
              <label htmlFor="login-password">Contraseña</label>
              <div className="auth-input-shell auth-password-shell">
                <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
                  <rect x="5" y="10" width="14" height="10" rx="3" />
                  <path d="M8 10V7a4 4 0 0 1 8 0v3M12 14v2" />
                </svg>
                <input
                  id="login-password"
                  ref={refs.password}
                  type={passwordVisible ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="Tu contraseña"
                  required
                  maxLength={72}
                  value={password}
                  onChange={(e) => update('password', e.target.value)}
                  aria-invalid={Boolean(errors.password)}
                  aria-describedby={
                    errors.password ? 'login-password-error' : undefined
                  }
                />
                <button
                  className="password-visibility"
                  type="button"
                  aria-label={
                    passwordVisible ? 'Ocultar contraseña' : 'Mostrar contraseña'
                  }
                  aria-pressed={passwordVisible}
                  onClick={() => setPasswordVisible((visible) => !visible)}
                >
                  <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
                    {passwordVisible ? (
                      <>
                        <path d="M3 3l18 18" />
                        <path d="M10.6 10.7a2 2 0 0 0 2.7 2.7M9.9 4.3A10.8 10.8 0 0 1 12 4c5.5 0 9 5.5 9 5.5a15 15 0 0 1-2.3 2.8M6.6 6.6C4.3 8.1 3 10.5 3 10.5S6.5 16 12 16c1 0 2-.2 2.9-.5" />
                      </>
                    ) : (
                      <>
                        <path d="M3 12s3.5-5.5 9-5.5 9 5.5 9 5.5-3.5 5.5-9 5.5S3 12 3 12Z" />
                        <circle cx="12" cy="12" r="2.5" />
                      </>
                    )}
                  </svg>
                </button>
              </div>
              <FieldError id="login-password-error" message={errors.password} />
            </div>
          </div>
          {errors.form && (
            <p className="form-error" role="alert">
              {errors.form}
            </p>
          )}
          <button className="primary-cta" type="submit" disabled={submitting}>
            {submitting ? 'Iniciando sesión…' : 'Iniciar sesión'}
          </button>
        </form>
        <div className="account-prompt">
          <span>¿Todavía no tienes una cuenta?</span>
          <Link to={registrationUrl}>Crear cuenta</Link>
        </div>
        <Link className="login-back" to="/">
          Volver al inicio
        </Link>
      </section>
    </AppLayout>
  )
}
