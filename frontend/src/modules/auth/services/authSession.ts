import { apiBaseUrl } from '../../../shared/config/api'
const tokenKey = 'invitation_access_token'
const userKey = 'invitation_session_user'
const expirationKey = 'invitation_session_expires_at'

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

const jwtExpiration = (token: string): number | null => {
  const payload = token.split('.')[1]
  if (!payload) return null

  try {
    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/')
    const padded = normalized.padEnd(
      normalized.length + ((4 - (normalized.length % 4)) % 4),
      '=',
    )
    const expiration = (JSON.parse(window.atob(padded)) as { exp?: unknown })
      .exp
    return typeof expiration === 'number' && Number.isFinite(expiration)
      ? expiration * 1000
      : null
  } catch {
    return null
  }
}

const storedExpiration = (token: string): number | null => {
  const stored = Number(window.localStorage.getItem(expirationKey))
  return Number.isFinite(stored) && stored > 0 ? stored : jwtExpiration(token)
}

export const getAccessToken = () => {
  const token = window.localStorage.getItem(tokenKey)
  if (!token) return null

  const expiration = storedExpiration(token)
  if (expiration !== null && expiration <= Date.now()) {
    clearSession()
    return null
  }

  return token
}
export const getSessionUser = (): SessionUser | null => {
  if (!getAccessToken()) return null
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
    if (response.status === 401) clearSession()
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
  window.localStorage.removeItem(expirationKey)
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
  const body = (await response.json()) as {
    token?: string
    expiresIn?: number
    user?: SessionUser
  }
  if (!body.token)
    throw new LoginError(
      'unexpected',
      'La respuesta de inicio de sesión no es válida.',
    )
  window.localStorage.setItem(tokenKey, body.token)
  if (
    typeof body.expiresIn === 'number' &&
    Number.isFinite(body.expiresIn) &&
    body.expiresIn > 0
  )
    window.localStorage.setItem(
      expirationKey,
      String(Date.now() + body.expiresIn * 1000),
    )
  else window.localStorage.removeItem(expirationKey)
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
