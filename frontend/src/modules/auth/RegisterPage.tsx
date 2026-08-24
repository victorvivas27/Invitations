import { useRef, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { AppLayout } from '../../shared/components/layout/AppLayout'
import { FieldError } from '../../shared/components/feedback/FieldError'
import { register, RegistrationError } from './services/authSession'
const safeReturnTo = (value: string | null) =>
  value?.startsWith('/') && !value.startsWith('//') ? value : '/templates'
type Form = {
  firstName: string
  lastName: string
  email: string
  password: string
  confirmation: string
}
type Errors = Partial<Record<keyof Form | 'form', string>>
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
export function RegisterPage() {
  const [params] = useSearchParams(),
    navigate = useNavigate()
  const returnTo = safeReturnTo(params.get('returnTo'))
  const [form, setForm] = useState<Form>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmation: '',
  })
  const [submitting, setSubmitting] = useState(false),
    [errors, setErrors] = useState<Errors>({})
  const [visiblePasswords, setVisiblePasswords] = useState({
    password: false,
    confirmation: false,
  })
  const refs = {
    firstName: useRef<HTMLInputElement>(null),
    lastName: useRef<HTMLInputElement>(null),
    email: useRef<HTMLInputElement>(null),
    password: useRef<HTMLInputElement>(null),
    confirmation: useRef<HTMLInputElement>(null),
  }
  const update = (field: keyof Form, value: string) => {
    setForm((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({
      ...current,
      [field]: undefined,
      ...(field === 'password' ? { confirmation: undefined } : {}),
      form: undefined,
    }))
  }
  const validate = () => {
    const next: Errors = {}
    if (!form.firstName.trim()) next.firstName = 'El nombre es obligatorio.'
    if (!form.lastName.trim()) next.lastName = 'El apellido es obligatorio.'
    if (!form.email.trim()) next.email = 'El correo electrónico es obligatorio.'
    else if (!emailPattern.test(form.email.trim()))
      next.email = 'Ingresa un correo electrónico válido.'
    if (!form.password) next.password = 'La contraseña es obligatoria.'
    else if (form.password.length < 8)
      next.password = 'La contraseña debe tener al menos 8 caracteres.'
    else if (!/[A-Za-z]/.test(form.password) || !/\d/.test(form.password))
      next.password = 'La contraseña debe incluir una letra y un número.'
    if (!form.confirmation) next.confirmation = 'Confirma tu contraseña.'
    else if (form.password !== form.confirmation)
      next.confirmation = 'Las contraseñas no coinciden.'
    return next
  }
  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (submitting) return
    const next = validate()
    const first = (Object.keys(next) as (keyof Form)[])[0]
    if (first) {
      setErrors(next)
      refs[first].current?.focus()
      return
    }
    setSubmitting(true)
    setErrors({})
    try {
      await register(form)
      navigate(
        `/login?returnTo=${encodeURIComponent(returnTo)}&registered=true`,
        { replace: true },
      )
    } catch (failure) {
      if (
        failure instanceof RegistrationError &&
        failure.kind === 'duplicate'
      ) {
        setErrors({ email: 'Ya existe una cuenta con ese correo electrónico.' })
        refs.email.current?.focus()
      } else
        setErrors({
          form:
            failure instanceof RegistrationError
              ? failure.message
              : 'No fue posible crear la cuenta.',
        })
      setSubmitting(false)
    }
  }
  const input = (
    name: keyof Form,
    label: string,
    type = 'text',
    autocomplete?: string,
  ) => {
    const passwordField = name === 'password' || name === 'confirmation'
    const passwordVisible = passwordField && visiblePasswords[name]
    return (
      <div className="login-field">
        <label htmlFor={`register-${name}`}>{label}</label>
        <div
          className={`auth-input-shell${passwordField ? ' auth-password-shell' : ''}`}
        >
          <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
            {name === 'email' ? (
              <>
                <rect x="3" y="5" width="18" height="14" rx="3" />
                <path d="m4.5 7 7.5 6 7.5-6" />
              </>
            ) : passwordField ? (
              <>
                <rect x="5" y="10" width="14" height="10" rx="3" />
                <path d="M8 10V7a4 4 0 0 1 8 0v3M12 14v2" />
              </>
            ) : (
              <>
                <circle cx="12" cy="8" r="4" />
                <path d="M4.5 21a7.5 7.5 0 0 1 15 0" />
              </>
            )}
          </svg>
          <input
            id={`register-${name}`}
            ref={refs[name]}
            type={passwordField && passwordVisible ? 'text' : type}
            autoComplete={autocomplete}
            placeholder={
              name === 'email'
                ? 'nombre@correo.com'
                : name === 'password'
                  ? 'Crea una contraseña'
                  : name === 'confirmation'
                    ? 'Repítela'
                    : label
            }
            required
            maxLength={
              name === 'email'
                ? 254
                : passwordField
                  ? 72
                  : 100
            }
            value={form[name]}
            onChange={(e) => update(name, e.target.value)}
            aria-invalid={Boolean(errors[name])}
            aria-describedby={errors[name] ? `register-${name}-error` : undefined}
          />
          {passwordField && (
            <button
              className="password-visibility"
              type="button"
              aria-label={`${passwordVisible ? 'Ocultar' : 'Mostrar'} ${label.toLocaleLowerCase('es')}`}
              aria-pressed={passwordVisible}
              onClick={() =>
                setVisiblePasswords((current) => ({
                  ...current,
                  [name]: !current[name],
                }))
              }
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
          )}
        </div>
        <FieldError id={`register-${name}-error`} message={errors[name]} />
      </div>
    )
  }
  return (
    <AppLayout className="login-shell section-shell">
      <section className="login-card register-card register-access-card">
        <span className="pill">Nueva cuenta</span>
        <h1>Crea tu cuenta</h1>
        <p>Regístrate para guardar y publicar tus invitaciones.</p>
        <form onSubmit={submit} noValidate>
          <div className="register-name-row">
            {input('firstName', 'Nombre', 'text', 'given-name')}
            {input('lastName', 'Apellido', 'text', 'family-name')}
          </div>
          {input('email', 'Correo electrónico', 'email', 'email')}
          <div className="register-password-row">
            {input('password', 'Contraseña', 'password', 'new-password')}
            {input(
              'confirmation',
              'Confirmar contraseña',
              'password',
              'new-password',
            )}
          </div>
          <small className="password-requirements">
            Usa al menos 8 caracteres, una letra y un número.
          </small>
          {errors.form && (
            <p className="form-error" role="alert">
              {errors.form}
            </p>
          )}
          <button className="primary-cta" type="submit" disabled={submitting}>
            {submitting ? 'Creando cuenta…' : 'Crear cuenta'}
          </button>
        </form>
        <div className="account-prompt">
          <span>¿Ya tienes una cuenta?</span>
          <Link to={`/login?returnTo=${encodeURIComponent(returnTo)}`}>
            Iniciar sesión
          </Link>
        </div>
      </section>
    </AppLayout>
  )
}
