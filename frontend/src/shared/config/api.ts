const configuredUrl = import.meta.env.VITE_API_BASE_URL?.trim()

export const apiBaseUrl = (
  configuredUrl || (import.meta.env.DEV ? 'http://localhost:8080' : '')
).replace(/\/$/, '')
