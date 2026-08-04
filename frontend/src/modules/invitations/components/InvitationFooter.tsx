import type { InvitationContactInfo } from '../types/invitationDraft'

const iconPaths = {
  instagram:
    'M7.8 2h8.4A5.8 5.8 0 0 1 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8A5.8 5.8 0 0 1 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2Zm-.2 2A3.6 3.6 0 0 0 4 7.6v8.8A3.6 3.6 0 0 0 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6A3.6 3.6 0 0 0 16.4 4H7.6Zm4.4 3a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z',
  facebook:
    'M14 22v-8h2.7l.4-3H14V9.1c0-.9.3-1.6 1.6-1.6H17V4.8c-.6-.1-1.7-.2-3-.2-3 0-5 1.8-5 5.1V11H6v3h3v8h5Z',
  whatsapp:
    'M12 2a10 10 0 0 0-8.7 14.9L2 22l5.25-1.38A10 10 0 1 0 12 2Zm0 18a8 8 0 0 1-4.08-1.12l-.39-.23-3.12.82.83-3.04-.25-.4A8 8 0 1 1 12 20Zm4.38-5.95c-.24-.12-1.42-.7-1.64-.78-.22-.08-.38-.12-.54.12-.16.24-.62.78-.76.94-.14.16-.28.18-.52.06-1.4-.7-2.32-1.25-3.25-2.84-.25-.43.25-.4.7-1.33.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.78-.2-.47-.4-.4-.54-.41h-.46c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2s.86 2.32.98 2.48c.12.16 1.69 2.58 4.1 3.62 1.52.66 2.12.71 2.88.6.46-.07 1.42-.58 1.62-1.14.2-.56.2-1.04.14-1.14-.06-.1-.22-.16-.46-.28Z',
}
const socialUrl = (kind: 'instagram' | 'facebook', value: string) =>
  value.startsWith('http')
    ? value
    : kind === 'instagram'
      ? `https://instagram.com/${value.replace(/^@/, '')}`
      : `https://facebook.com/${value}`

export function InvitationFooter({
  contact,
}: {
  contact?: InvitationContactInfo
}) {
  if (!contact || !Object.values(contact).some((value) => value.trim()))
    return null
  const links = [
    ...(contact.whatsapp
      ? [
          {
            label: 'WhatsApp',
            href: `https://wa.me/${contact.whatsapp.replace(/\D/g, '')}`,
            icon: iconPaths.whatsapp,
          },
        ]
      : []),
    ...(contact.instagram
      ? [
          {
            label: 'Instagram',
            href: socialUrl('instagram', contact.instagram),
            icon: iconPaths.instagram,
          },
        ]
      : []),
    ...(contact.facebook
      ? [
          {
            label: 'Facebook',
            href: socialUrl('facebook', contact.facebook),
            icon: iconPaths.facebook,
          },
        ]
      : []),
  ]
  return (
    <footer className="invitation-footer">
      <strong>{contact.name || 'Familia anfitriona'}</strong>
      <nav aria-label="Contacto de los anfitriones">
        {links.map(({ label, href, icon }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Contactar por ${label}`}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d={icon} />
            </svg>
            <span>{label}</span>
          </a>
        ))}
      </nav>
    </footer>
  )
}
