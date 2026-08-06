import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { categoryLabels, styleLabels } from '../data/invitationTemplates'
import type { InvitationTemplate } from '../types/invitationTemplate'
import { TemplateArtwork } from './TemplateArtwork'

export function TemplatePreviewDialog({
  template,
  onClose,
  returnFocus,
}: {
  template: InvitationTemplate
  onClose: () => void
  returnFocus: HTMLButtonElement | null
}) {
  const closeRef = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()
    const escape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', escape)
    return () => {
      document.removeEventListener('keydown', escape)
      document.body.style.overflow = previousOverflow
      returnFocus?.focus()
    }
  }, [onClose, returnFocus])
  return (
    <div className="dialog-backdrop" onMouseDown={onClose}>
      <div
        className="template-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="template-dialog-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button
          ref={closeRef}
          className="dialog-close"
          type="button"
          aria-label="Cerrar vista previa"
          onClick={onClose}
        >
          ×
        </button>
        <TemplateArtwork template={template} large />
        <div className="dialog-copy">
          <span className="eyebrow">Vista previa de demostración</span>
          <h2 id="template-dialog-title">{template.name}</h2>
          <p className="template-meta">
            {categoryLabels[template.category]} · {styleLabels[template.style]}
          </p>
          <p>{template.description}</p>
          {template.isAvailable ? (
            <Link
              className="use-action"
              to={`/invitations/create?template=${encodeURIComponent(template.id)}`}
            >
              Usar plantilla
            </Link>
          ) : (
            <button className="use-action" type="button" disabled>
              Próximamente
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
