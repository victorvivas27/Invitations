import type { CSSProperties, ReactNode } from 'react'

type Props = {
  title: string
  description: string
  icon: ReactNode
  accent: string
}

export function EventCategoryCard({ title, description, icon, accent }: Props) {
  return (
    <article
      className="category-card"
      style={{ '--card-accent': accent } as CSSProperties}
    >
      <span className="category-icon" aria-hidden="true">
        {icon}
      </span>
      <h3>{title}</h3>
      <p>{description}</p>
    </article>
  )
}
