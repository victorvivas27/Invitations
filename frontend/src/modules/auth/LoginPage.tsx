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
      <section className="login-card">
        <span className="pill">Acceso seguro</span>
        <h1>Inicia sesión para crear tu invitación</h1>
        <p>
          Tu cuenta permite asociar y conservar las invitaciones que publiques.
        </p>
        <form onSubmit={submit} noValidate>
          <label>
            <span>Correo electrónico</span>
            <input
              ref={refs.email}
              aria-label="Correo electrónico"
              type="email"
              autoComplete="email"
              required
              maxLength={254}
              value={email}
              onChange={(e) => update('email', e.target.value)}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? 'login-email-error' : undefined}
            />
            <FieldError id="login-email-error" message={errors.email} />
          </label>
          <label>
            <span>Contraseña</span>
            <input
              ref={refs.password}
              type="password"
              autoComplete="current-password"
              required
              maxLength={72}
              value={password}
              onChange={(e) => update('password', e.target.value)}
              aria-invalid={Boolean(errors.password)}
              aria-describedby={
                errors.password ? 'login-password-error' : undefined
              }
            />
            <FieldError id="login-password-error" message={errors.password} />
          </label>
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
