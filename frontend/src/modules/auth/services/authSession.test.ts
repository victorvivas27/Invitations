import {
  clearSession,
  getAccessToken,
  getSessionUser,
  loadSessionUser,
  login,
  register,
} from './authSession'

const jwt = (expiration: number) =>
  `header.${window.btoa(JSON.stringify({ exp: expiration })).replace(/=/g, '')}.signature`

describe('authSession', () => {
  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
    window.localStorage.clear()
  })

  it('authenticates and stores the bearer token for invitation creation', async () => {
    const fetchMock = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(
        new Response(
          JSON.stringify({ token: 'signed-token', tokenType: 'Bearer' }),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        ),
      )
    await login(' user@example.com ', 'Password1')
    expect(getAccessToken()).toBe('signed-token')
    const options = fetchMock.mock.calls[0][1] as RequestInit
    expect(JSON.parse(options.body as string)).toEqual({
      email: 'user@example.com',
      password: 'Password1',
    })
    clearSession()
    expect(getAccessToken()).toBeNull()
  })

  it('maps invalid credentials without storing a session', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(null, { status: 401 }),
    )
    await expect(login('user@example.com', 'wrong')).rejects.toEqual(
      expect.objectContaining({ kind: 'credentials' }),
    )
    expect(getAccessToken()).toBeNull()
  })

  it('clears an expired stored JWT instead of exposing a false session', () => {
    window.localStorage.setItem(
      'invitation_access_token',
      jwt(Math.floor(Date.now() / 1000) - 60),
    )
    window.localStorage.setItem(
      'invitation_session_user',
      JSON.stringify({
        code: 'ACC-123',
        firstName: 'Ana',
        lastName: 'Pérez',
        email: 'ana@example.com',
      }),
    )

    expect(getAccessToken()).toBeNull()
    expect(getSessionUser()).toBeNull()
  })

  it('stores and enforces the expiration returned by login', async () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-08-28T12:00:00Z'))
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ token: 'signed-token', expiresIn: 3600 }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    )

    await login('user@example.com', 'Password1')
    expect(getAccessToken()).toBe('signed-token')

    vi.setSystemTime(new Date('2026-08-28T13:00:01Z'))
    expect(getAccessToken()).toBeNull()
  })

  it('clears the session when the backend rejects session restoration', async () => {
    window.localStorage.setItem('invitation_access_token', 'signed-token')
    window.localStorage.setItem(
      'invitation_session_user',
      JSON.stringify({ code: 'ACC-123' }),
    )
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(null, { status: 401 }),
    )

    await expect(loadSessionUser()).resolves.toBeNull()
    expect(getAccessToken()).toBeNull()
    expect(getSessionUser()).toBeNull()
  })

  it('registers a normalized account without storing the password locally', async () => {
    const fetchMock = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(
        new Response(JSON.stringify({ code: 'ACC-123' }), { status: 201 }),
      )
    await register({
      firstName: ' Ana ',
      lastName: ' Pérez ',
      email: ' ana@example.com ',
      password: 'Password1',
    })
    const options = fetchMock.mock.calls[0][1] as RequestInit
    expect(JSON.parse(options.body as string)).toEqual({
      firstName: 'Ana',
      lastName: 'Pérez',
      email: 'ana@example.com',
      password: 'Password1',
    })
    expect(getAccessToken()).toBeNull()
  })

  it('maps duplicate registration safely', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(null, { status: 409 }),
    )
    await expect(
      register({
        firstName: 'Ana',
        lastName: 'Pérez',
        email: 'ana@example.com',
        password: 'Password1',
      }),
    ).rejects.toEqual(expect.objectContaining({ kind: 'duplicate' }))
  })
})
