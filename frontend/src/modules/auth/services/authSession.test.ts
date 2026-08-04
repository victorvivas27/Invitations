import { clearSession, getAccessToken, login, register } from './authSession'

describe('authSession', () => {
  afterEach(() => {
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
