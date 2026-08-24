import { apiBaseUrl } from '../../../shared/config/api'
const tokenKey = 'invitation_access_token'
const userKey = 'invitation_session_user'

export type SessionUser = {
  code: string
  firstName: string
  lastName: string
  email: string
  status?: string
  role?: 'USER' | 'ADMIN'
}

export class LoginError extends Error {
  constructor(
    public readonly kind: 'credentials' | 'network' | 'unexpected',
    message: string,
  ) {
    super(message)
  }
}

export class RegistrationError extends Error {
  constructor(
    public readonly kind: 'duplicate' | 'validation' | 'network' | 'unexpected',
    message: string,
  ) {
    super(message)
  }
}

export const getAccessToken = () => window.localStorage.getItem(tokenKey)
export const getSessionUser = (): SessionUser | null => {
  const stored = window.localStorage.getItem(userKey)
  if (!stored) return null
  try {
    return JSON.parse(stored) as SessionUser
  } catch {
    return null
  }
}
export const loadSessionUser = async (): Promise<SessionUser | null> => {
  const token = getAccessToken()
  if (!token) return null
  try {
    const response = await fetch(`${apiBaseUrl}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (!response.ok) return null
    const user = (await response.json()) as SessionUser
    if (!user.firstName || !user.lastName || !user.email || !user.code)
      return null
    window.localStorage.setItem(userKey, JSON.stringify(user))
    return user
  } catch {
    return null
  }
}
export const clearSession = () => {
  window.localStorage.removeItem(tokenKey)
  window.localStorage.removeItem(userKey)
}

export async function login(email: string, password: string): Promise<void> {
  let response: Response
  try {
    response = await fetch(`${apiBaseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.trim(), password }),
    })
  } catch {
    throw new LoginError('network', 'No fue posible conectar con el servidor.')
  }
  if (response.status === 401)
    throw new LoginError(
      'credentials',
      'El correo o la contraseña no son correctos.',
    )
  if (!response.ok)
    throw new LoginError('unexpected', 'No fue posible iniciar sesión.')
  const body = (await response.json()) as { token?: string; user?: SessionUser }
  if (!body.token)
    throw new LoginError(
      'unexpected',
      'La respuesta de inicio de sesión no es válida.',
    )
  window.localStorage.setItem(tokenKey, body.token)
  if (body.user) window.localStorage.setItem(userKey, JSON.stringify(body.user))
}

export async function register(input: {
  firstName: string
  lastName: string
  email: string
  password: string
}): Promise<void> {
  let response: Response
  try {
    response = await fetch(`${apiBaseUrl}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...input,
        firstName: input.firstName.trim(),
        lastName: input.lastName.trim(),
        email: input.email.trim(),
      }),
    })
  } catch {
    throw new RegistrationError(
      'network',
      'No fue posible conectar con el servidor.',
    )
  }
  if (response.status === 409)
    throw new RegistrationError(
      'duplicate',
      'Ya existe una cuenta con ese correo electrónico.',
    )
  if (response.status === 400)
    throw new RegistrationError(
      'validation',
      'Revisa los datos y la contraseña ingresada.',
    )
  if (!response.ok)
    throw new RegistrationError('unexpected', 'No fue posible crear la cuenta.')
}
