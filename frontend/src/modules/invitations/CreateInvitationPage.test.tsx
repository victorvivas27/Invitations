import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CreateInvitationPage } from './CreateInvitationPage'

const renderWizard = () => {
  window.localStorage.setItem('invitation_access_token', 'safe-token')
  window.history.pushState(
    {},
    '',
    '/invitations/create?template=birthday-urban',
  )
  return render(<CreateInvitationPage />)
}
const next = () =>
  userEvent.click(screen.getByRole('button', { name: 'Siguiente' }))

describe('CreateInvitationPage', () => {
  afterEach(() => {
    vi.restoreAllMocks()
    window.localStorage.clear()
  })
  it('loads the selected template and seven-step progress', () => {
    renderWizard()
    expect(screen.getByText('Nueva invitación')).toBeInTheDocument()
    expect(
      screen.getByText('Crea una experiencia especial'),
    ).toBeInTheDocument()
    expect(screen.getByText('Paso 1 de 7')).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { level: 1, name: 'Información básica' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('list', { name: 'Progreso de creación' }),
    ).toBeInTheDocument()
  })

  it('validates only the current step before advancing', async () => {
    renderWizard()
    await next()
    expect(screen.getAllByText('Este campo es obligatorio.')).toHaveLength(2)
    expect(screen.getByText('Paso 1 de 7')).toBeInTheDocument()
    await userEvent.selectOptions(
      screen.getByRole('combobox', { name: 'Tipo de evento' }),
      'Cumpleaños',
    )
    await userEvent.type(
      screen.getByRole('textbox', { name: 'Nombre del evento' }),
      'Cumpleaños de Sofía',
    )
    await next()
    expect(
      screen.getByRole('heading', { name: 'Persona homenajeada' }),
    ).toBeInTheDocument()
    expect(screen.getByText('Paso 2 de 7')).toBeInTheDocument()
  })

  it('updates the invitation preview immediately', async () => {
    renderWizard()
    await userEvent.selectOptions(
      screen.getByRole('combobox', { name: 'Tipo de evento' }),
      'Cumpleaños',
    )
    await userEvent.type(
      screen.getByRole('textbox', { name: 'Nombre del evento' }),
      'Cumpleaños de Sofía',
    )
    await next()
    await userEvent.type(
      screen.getByRole('textbox', { name: 'Nombre' }),
      'Sofía',
    )
    expect(
      screen.getByLabelText('Vista previa de la invitación'),
    ).toHaveTextContent('Estamos felices de invitarte al cumple de')
    expect(
      screen.getByLabelText('Vista previa de la invitación'),
    ).toHaveTextContent('Sofía')
  })

  it('moves backward and preserves in-memory information', async () => {
    renderWizard()
    await userEvent.selectOptions(
      screen.getByRole('combobox', { name: 'Tipo de evento' }),
      'Cumpleaños',
    )
    await userEvent.type(
      screen.getByRole('textbox', { name: 'Nombre del evento' }),
      'Fiesta de Alex',
    )
    await next()
    await userEvent.click(screen.getByRole('button', { name: 'Anterior' }))
    expect(
      screen.getByRole('textbox', { name: 'Nombre del evento' }),
    ).toHaveValue('Fiesta de Alex')
  })

  it('submits the complete model once and shows a copiable public URL', async () => {
    const fetchMock = vi
      .spyOn(globalThis, 'fetch')
      .mockImplementation(async (input) => {
        if (String(input).endsWith('/api/auth/me'))
          return new Response(
            JSON.stringify({
              code: 'USR-TEST',
              firstName: 'Sofía',
              lastName: 'Pérez',
              email: 'sofia@example.com',
            }),
            { status: 200, headers: { 'Content-Type': 'application/json' } },
          )
        if (String(input).endsWith('/api/invitation-images/social'))
          return new Response(
            JSON.stringify({ url: 'https://cdn.example.com/share.jpg' }),
            {
              status: 200,
              headers: { 'Content-Type': 'application/json' },
            },
          )
        return new Response(
          JSON.stringify({
            publicSlug: 'cumpleanos-de-sofia-a8k3m2',
            publicUrl: '/i/cumpleanos-de-sofia-a8k3m2',
            status: 'PUBLISHED',
            eventName: 'Cumpleaños de Sofía',
          }),
          { status: 201, headers: { 'Content-Type': 'application/json' } },
        )
      })
    window.localStorage.setItem('invitation_access_token', 'safe-token')
    renderWizard()
    await userEvent.selectOptions(
      screen.getByRole('combobox', { name: 'Tipo de evento' }),
      'Cumpleaños',
    )
    await userEvent.type(
      screen.getByRole('textbox', { name: 'Nombre del evento' }),
      'Cumpleaños de Sofía',
    )
    await next()
    await userEvent.type(
      screen.getByRole('textbox', { name: 'Nombre' }),
      'Sofía',
    )
    await next()
    await userEvent.type(screen.getByLabelText('Fecha'), '2026-08-22')
    await userEvent.selectOptions(screen.getByLabelText('Hora'), '17')
    await userEvent.selectOptions(screen.getByLabelText('Minutos'), '00')
    await next()
    await userEvent.type(
      screen.getByRole('textbox', { name: 'Nombre del lugar' }),
      'Salón Central',
    )
    await userEvent.type(
      screen.getByRole('textbox', { name: 'Dirección' }),
      'Avenida Principal 123',
    )
    await userEvent.type(
      screen.getByRole('textbox', { name: 'Enlace de Google Maps (opcional)' }),
      'https://maps.app.goo.gl/example',
    )
    await next()
    await userEvent.type(
      screen.getByRole('textbox', { name: 'Mensaje especial' }),
      'Te esperamos para celebrar.',
    )
    await next()
    expect(screen.getByRole('heading', { name: 'Resumen' })).toBeInTheDocument()
    expect(
      screen.getByText('Cumpleaños · Cumpleaños de Sofía'),
    ).toBeInTheDocument()
    await next()
    await userEvent.type(screen.getByLabelText('Título'), 'Cumpleaños de Sofía')
    await userEvent.type(
      screen.getByLabelText('Descripción para compartir'),
      'Acompáñanos a celebrar este día especial.',
    )
    vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:test')
    vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => undefined)
    const OriginalImage = globalThis.Image
    class LoadedImage {
      naturalWidth = 1200
      naturalHeight = 630
      onload: null | (() => void) = null
      onerror: null | (() => void) = null
      set src(_value: string) {
        queueMicrotask(() => this.onload?.())
      }
    }
    Object.defineProperty(globalThis, 'Image', {
      configurable: true,
      value: LoadedImage,
    })
    await userEvent.upload(
      screen.getByLabelText('Imagen para compartir'),
      new File(['image'], 'share.jpg', { type: 'image/jpeg' }),
    )
    Object.defineProperty(globalThis, 'Image', {
      configurable: true,
      value: OriginalImage,
    })
    await screen.findByAltText('Vista previa para compartir')
    expect(
      screen.getByRole('button', { name: 'Crear invitación' }),
    ).toBeEnabled()
    await userEvent.click(
      screen.getByRole('button', { name: 'Crear invitación' }),
    )
    expect(
      await screen.findByRole('heading', { name: 'Tu invitación está lista' }),
    ).toBeInTheDocument()
    expect(
      screen.getByDisplayValue(/\/i\/cumpleanos-de-sofia-a8k3m2/),
    ).toBeInTheDocument()
    const request = fetchMock.mock.calls.find(([url]) =>
      String(url).endsWith('/api/invitations'),
    )?.[1] as RequestInit
    expect(request.headers).toMatchObject({
      Authorization: 'Bearer safe-token',
    })
    expect(JSON.parse(request.body as string)).toEqual(
      expect.objectContaining({
        templateId: 'birthday-urban',
        eventType: 'BIRTHDAY',
        eventName: 'Cumpleaños de Sofía',
        honoreeName: 'Sofía',
        eventDate: '2026-08-22',
        eventTime: '17:00',
        venueName: 'Salón Central',
        address: 'Avenida Principal 123',
        mapsUrl: 'https://maps.app.goo.gl/example',
        message: 'Te esperamos para celebrar.',
        shareTitle: 'Cumpleaños de Sofía',
        shareDescription: 'Acompáñanos a celebrar este día especial.',
      }),
    )
    expect(
      JSON.parse(JSON.parse(request.body as string).sectionBackgrounds),
    ).toHaveProperty('basic.customized', false)
  }, 10_000)

  it('handles a missing template identifier', () => {
    window.localStorage.setItem('invitation_access_token', 'safe-token')
    window.history.pushState({}, '', '/invitations/create?template=missing')
    render(<CreateInvitationPage />)
    expect(
      screen.getByRole('heading', {
        name: 'La plantilla seleccionada no existe.',
      }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: 'Volver a plantillas' }),
    ).toHaveAttribute('href', '/templates')
  })
})
