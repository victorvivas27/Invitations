import { categoryLabels, styleLabels } from '../data/invitationTemplates'
import type {
  InvitationTemplateCategory,
  InvitationTemplateStyle,
} from '../types/invitationTemplate'
type Props = {
  query: string
  category: 'all' | InvitationTemplateCategory
  style: 'all' | InvitationTemplateStyle
  onQuery: (value: string) => void
  onCategory: (value: 'all' | InvitationTemplateCategory) => void
  onStyle: (value: 'all' | InvitationTemplateStyle) => void
}
export function TemplateFilters({
  query,
  category,
  style,
  onQuery,
  onCategory,
  onStyle,
}: Props) {
  return (
    <section className="template-filters" aria-label="Filtros de plantillas">
      <label className="search-field">
        <span>Buscar plantillas</span>
        <input
          type="search"
          value={query}
          onChange={(event) => onQuery(event.target.value)}
          placeholder="Ej. cumpleaños, elegante o infantil"
        />
      </label>
      <div className="category-scroller" aria-label="Categorías">
        <button
          type="button"
          aria-pressed={category === 'all'}
          onClick={() => onCategory('all')}
        >
          Todas
        </button>
        {Object.entries(categoryLabels).map(([value, label]) => (
          <button
            type="button"
            key={value}
            aria-pressed={category === value}
            onClick={() => onCategory(value as InvitationTemplateCategory)}
          >
            {label}
          </button>
        ))}
      </div>
      <label className="style-select">
        <span>Estilo</span>
        <select
          value={style}
          onChange={(event) =>
            onStyle(event.target.value as 'all' | InvitationTemplateStyle)
          }
        >
          <option value="all">Todos los estilos</option>
          {Object.entries(styleLabels).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </label>
    </section>
  )
}
