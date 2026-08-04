import { FormEvent, useCallback, useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import {
  ActivationApiError,
  completeAccountActivation,
  validateAccountActivation,
} from './services/accountActivation'

export type ActivationViewState =
  'validating' | 'valid' | 'invalid' | 'expired' | 'used' | 'success' | 'error'

const stateMessages: Partial<Record<ActivationViewState, string>> = {
  invalid: 'El enlace de activación no es válido.',
  expired: 'El enlace de activación ha vencido.',
  used: 'Este enlace de activación ya fue utilizado.',
  error: 'No fue posible validar el enlace en este momento.',
}

function passwordError(password: string, confirmation: string): string {
  if (!password) return 'La contraseña es obligatoria.'
  if (!confirmation) return 'La confirmación de contraseña es obligatoria.'
  if (
    password.length < 8 ||
    !/[A-Za-z]/.test(password) ||
    !/\d/.test(password)
  ) {
    return 'Usa al menos 8 caracteres, una letra y un número.'
  }
  if (password !== confirmation) return 'Las contraseñas no coinciden.'
  return ''
}

export function ActivateAccountPage() {
  const [params] = useSearchParams()
  const token = params.get('token')
  const [state, setState] = useState<ActivationViewState>(
    token ? 'validating' : 'invalid',
  )
  const [submitting, setSubmitting] = useState(false)
  const [password, setPassword] = useState('')
  const [confirmation, setConfirmation] = useState('')
  const [formError, setFormError] = useState('')

  const validate = useCallback(async () => {
    if (!token) return
    setState('validating')
    try {
      await validateAccountActivation(token)
      setState('valid')
    } catch (error) {
      if (
        error instanceof ActivationApiError &&
        ['invalid', 'expired', 'used'].includes(error.kind)
      ) {
        setState(error.kind as 'invalid' | 'expired' | 'used')
      } else {
        setState('error')
      }
    }
  }, [token])

  useEffect(() => {
    void validate()
  }, [validate])

  async function submit(event: FormEvent) {
    event.preventDefault()
    if (!token || submitting) return
    const validationMessage = passwordError(password, confirmation)
    if (validationMessage) {
      setFormError(validationMessage)
      return
    }
    setFormError('')
    setSubmitting(true)
    try {
      await completeAccountActivation(token, password)
      setPassword('')
      setConfirmation('')
      setState('success')
    } catch (error) {
      if (
        error instanceof ActivationApiError &&
        ['invalid', 'expired', 'used'].includes(error.kind)
      ) {
        setState(error.kind as 'invalid' | 'expired' | 'used')
      } else {
        setFormError(
          error instanceof Error
            ? error.message
            : 'No fue posible activar la cuenta.',
        )
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="activation-shell">
      <section className="activation-card" aria-live="polite">
        <span className="activation-brand">Invitation</span>
        <span className="activation-icon" aria-hidden="true">
          ✨
        </span>
        {state === 'validating' && (
          <>
            <div className="loader" aria-hidden="true" />
            <h1>Validando enlace…</h1>
          </>
        )}
        {state === 'valid' && (
          <>
            <h1>Crea tu contraseña</h1>
            <p>
              Tu cuenta fue creada correctamente. Establece una contraseña para
              completar la activación.
            </p>
            <form onSubmit={submit} noValidate>
              <label htmlFor="password">Nueva contraseña</label>
              <input
                id="password"
                type="password"
                autoComplete="new-password"
                value={password}
                disabled={submitting}
                onChange={(event) => setPassword(event.target.value)}
              />
              <label htmlFor="confirmation">Confirmar contraseña</label>
              <input
                id="confirmation"
                type="password"
                autoComplete="new-password"
                value={confirmation}
                disabled={submitting}
                onChange={(event) => setConfirmation(event.target.value)}
              />
              {formError && (
                <p className="form-error" role="alert">
                  {formError}
                </p>
              )}
              <button type="submit" disabled={submitting}>
                {submitting ? 'Activando cuenta…' : 'Activar cuenta'}
              </button>
            </form>
          </>
        )}
        {state === 'success' && (
          <>
            <h1>Cuenta activada correctamente.</h1>
            <p>Ya puedes iniciar sesión con tu nueva contraseña.</p>
            <Link className="button-link" to="/login">
              Ir al inicio de sesión
            </Link>
          </>
        )}
        {(
          ['invalid', 'expired', 'used', 'error'] as ActivationViewState[]
        ).includes(state) && (
          <>
            <h1>{stateMessages[state]}</h1>
            <p>
              {state === 'expired'
                ? 'Solicita a un administrador una nueva invitación.'
                : 'Verifica el enlace recibido por correo.'}
            </p>
            {state === 'error' && (
              <button type="button" onClick={() => void validate()}>
                Reintentar
              </button>
            )}
            {state === 'used' && (
              <Link className="button-link" to="/login">
                Ir al inicio de sesión
              </Link>
            )}
          </>
        )}
      </section>
    </main>
  )
}
