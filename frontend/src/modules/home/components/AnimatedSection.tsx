import { useRef } from 'react'
import { useRevealed } from '../../../shared/animation'

type Props = {
  children: React.ReactNode
  className?: string
  direction?: 'up' | 'left' | 'right' | 'scale'
  delay?: number
  as?: 'div' | 'section' | 'article' | 'footer'
}

export function AnimatedSection({
  children,
  className = '',
  direction = 'up',
  delay = 0,
  as: Tag = 'div',
}: Props) {
  const ref = useRef<HTMLElement>(null)
  const visible = useRevealed(ref)
  return (
    <Tag
      ref={ref as React.Ref<never>}
      className={`home-reveal reveal-${direction}${visible ? ' is-visible' : ''} ${className}`}
      style={
        { '--reveal-delay': `${Math.min(delay, 600)}ms` } as React.CSSProperties
      }
    >
      {children}
    </Tag>
  )
}
