import { Link } from 'react-router-dom'
import { categoryLabels, styleLabels } from '../data/invitationTemplates'
import type { InvitationTemplate } from '../types/invitationTemplate'
import { TemplateArtwork } from './TemplateArtwork'
export function TemplateCard({
  template,
  onPreview,
}: {
  template: InvitationTemplate
  onPreview: (template: InvitationTemplate, trigger: HTMLButtonElement) => void
}) {
  return (
    <article className="template-card">
      <TemplateArtwork template={template} />
      <div className="template-card-body">
        <div className="template-badges">
          {template.isFeatured && (
            <span className="badge-featured">Recomendada</span>
          )}
          <span
            className={template.isAvailable ? 'badge-available' : 'badge-soon'}
          >
            {template.isAvailable ? 'Disponible' : 'Próximamente'}
          </span>
        </div>
        <h2>{template.name}</h2>
        <p className="template-meta">
          {categoryLabels[template.category]} · {styleLabels[template.style]}
        </p>
        <p>{template.description}</p>
        <div className="template-actions">
          <button
            type="button"
            className="preview-action"
            onClick={(event) => onPreview(template, event.currentTarget)}
          >
            Vista previa
          </button>
          {template.isAvailable ? (
            <Link
              className="use-action"
              to={`/invitations/create?template=${encodeURIComponent(template.id)}`}
            >
              Usar plantilla
            </Link>
          ) : (
            <button type="button" className="use-action" disabled>
              Usar plantilla
            </button>
          )}
        </div>
      </div>
    </article>
  )
}
