import { useEffect, useRef, useState } from 'react'

type Props = {
  children: React.ReactNode
  className?: string
  direction?: 'up' | 'left' | 'right' | 'scale'
  delay?: number
  as?: 'div' | 'section' | 'article' | 'footer'
}

export function AnimatedSection({ children, className = '', direction = 'up', delay = 0, as: Tag = 'div' }: Props) {
  const ref = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(() => typeof IntersectionObserver === 'undefined')
  useEffect(() => {
    const node = ref.current
    if (!node || !('IntersectionObserver' in window)) { setVisible(true); return }
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.18, rootMargin: '0px 0px -5% 0px' })
    observer.observe(node)
    return () => observer.disconnect()
  }, [])
  return <Tag ref={ref as React.Ref<never>} className={`home-reveal reveal-${direction}${visible ? ' is-visible' : ''} ${className}`} style={{ '--reveal-delay': `${Math.min(delay, 600)}ms` } as React.CSSProperties}>{children}</Tag>
}
