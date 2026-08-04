const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080'

export type ActivationErrorKind =
  'invalid' | 'expired' | 'used' | 'password' | 'unexpected'

export class ActivationApiError extends Error {
  constructor(
    public readonly kind: ActivationErrorKind,
    message: string,
  ) {
    super(message)
  }
}

async function toError(
  response: Response,
  completing: boolean,
): Promise<ActivationApiError> {
  let backendMessage = ''
  try {
    const body = (await response.json()) as { message?: string }
    backendMessage = body.message ?? ''
  } catch {
    // A non-JSON error remains a controlled unexpected response.
  }
  if (response.status === 404 || (!completing && response.status === 400)) {
    return new ActivationApiError(
      'invalid',
      'El enlace de activación no es válido.',
    )
  }
  if (response.status === 410) {
    const used = backendMessage.toLowerCase().includes('already used')
    return new ActivationApiError(
      used ? 'used' : 'expired',
      used
        ? 'Este enlace de activación ya fue utilizado.'
        : 'El enlace de activación ha vencido.',
    )
  }
  if (completing && response.status === 400) {
    return new ActivationApiError(
      'password',
      'La contraseña no cumple la política requerida.',
    )
  }
  return new ActivationApiError(
    'unexpected',
    'No fue posible validar el enlace en este momento.',
  )
}

export async function validateAccountActivation(token: string): Promise<void> {
  try {
    const response = await fetch(
      `${apiBaseUrl}/api/auth/account-activation/validate?token=${encodeURIComponent(token)}`,
    )
    if (!response.ok) throw await toError(response, false)
  } catch (error) {
    if (error instanceof ActivationApiError) throw error
    throw new ActivationApiError(
      'unexpected',
      'No fue posible validar el enlace en este momento.',
    )
  }
}

export async function completeAccountActivation(
  token: string,
  password: string,
): Promise<void> {
  try {
    const response = await fetch(
      `${apiBaseUrl}/api/auth/account-activation/complete`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      },
    )
    if (!response.ok) throw await toError(response, true)
  } catch (error) {
    if (error instanceof ActivationApiError) throw error
    throw new ActivationApiError(
      'unexpected',
      'No fue posible activar la cuenta en este momento.',
    )
  }
}
