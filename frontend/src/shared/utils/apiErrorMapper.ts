export type ApiErrorResult = {
  message: string
  fieldErrors: Record<string, string>
  status?: number
}

const safeMessages: Record<string, string> = {
  INVITATION_NOT_FOUND: 'La invitación no existe o fue eliminada.',
}

export async function mapApiError(response: Response): Promise<ApiErrorResult> {
  let body: unknown
  try {
    body = await response.json()
  } catch {
    body = null
  }
  const data = body && typeof body === 'object' ? (body as Record<string, unknown>) : {}
  const rawErrors = data.errors
  const fieldErrors: Record<string, string> = {}
  if (rawErrors && typeof rawErrors === 'object') {
    for (const [field, value] of Object.entries(rawErrors as Record<string, unknown>)) {
      if (typeof value === 'string') fieldErrors[field] = value
      else if (Array.isArray(value) && typeof value[0] === 'string') fieldErrors[field] = value[0]
    }
  }
  const code = typeof data.code === 'string' ? data.code : typeof data.error === 'string' ? data.error : ''
  const supplied = typeof data.message === 'string' ? data.message : ''
  const safeSupplied = supplied && !/validation failed|unexpected|internal|trace|exception/i.test(supplied)
  return {
    status: response.status,
    fieldErrors,
    message:
      safeMessages[code] ??
      (safeSupplied ? supplied : response.status >= 500
        ? 'Ocurrió un problema inesperado. Inténtalo nuevamente.'
        : 'No pudimos completar la solicitud. Revisa los datos e inténtalo nuevamente.'),
  }
}

export const networkErrorMessage = 'No fue posible conectarse con el servidor.'
