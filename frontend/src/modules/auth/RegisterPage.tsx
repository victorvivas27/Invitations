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
  ) => (
    <label>
      <span>{label}</span>
      <input
        ref={refs[name]}
        aria-label={label}
        type={type}
        autoComplete={autocomplete}
        required
        maxLength={
          name === 'email'
            ? 254
            : name === 'password' || name === 'confirmation'
              ? 72
              : 100
        }
        value={form[name]}
        onChange={(e) => update(name, e.target.value)}
        aria-invalid={Boolean(errors[name])}
        aria-describedby={errors[name] ? `register-${name}-error` : undefined}
      />
      <FieldError id={`register-${name}-error`} message={errors[name]} />
    </label>
  )
  return (
    <AppLayout className="login-shell section-shell">
      <section className="login-card register-card">
        <span className="pill">Nueva cuenta</span>
        <h1>Crea tu cuenta</h1>
        <p>Regístrate para guardar y publicar tus invitaciones.</p>
        <form onSubmit={submit} noValidate>
          <div className="register-name-row">
            {input('firstName', 'Nombre', 'text', 'given-name')}
            {input('lastName', 'Apellido', 'text', 'family-name')}
          </div>
          {input('email', 'Correo electrónico', 'email', 'email')}
          {input('password', 'Contraseña', 'password', 'new-password')}
          <small>Al menos 8 caracteres, una letra y un número.</small>
          {input(
            'confirmation',
            'Confirmar contraseña',
            'password',
            'new-password',
          )}
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
