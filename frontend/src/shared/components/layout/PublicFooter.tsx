import { useEffect, useRef, useState } from 'react'
import { APP_NAME } from './PublicHeader'

export function PublicFooter() {
  const signatureRef = useRef<HTMLDivElement>(null)
  const [signatureVisible, setSignatureVisible] = useState(
    () => typeof IntersectionObserver === 'undefined',
  )
  useEffect(() => {
    const node = signatureRef.current
    if (!node || !('IntersectionObserver' in window)) {
      setSignatureVisible(true)
      return
    }
    const observer = new IntersectionObserver(
      ([entry]) => setSignatureVisible(entry.isIntersecting),
      { threshold: 0.35 },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])
  return (
    <footer className="public-footer">
      <div>
        <a className="public-brand" href="#inicio">
          <span aria-hidden="true">✦</span>
          {APP_NAME}
        </a>
        <p>Invitaciones digitales para celebrar momentos especiales.</p>
      </div>
      <p>
        © {new Date().getFullYear()} {APP_NAME}
      </p>
      <div
        ref={signatureRef}
        className={`creator-signature${signatureVisible ? ' is-visible' : ''}`}
        aria-label="Autor del proyecto"
      >
        <span className="creator-monogram" aria-hidden="true">VJ</span>
        <span className="creator-copy">
          <small>Diseño y desarrollo</small>
          <strong>Creado por Victor Javier Vivas</strong>
          <a href="mailto:victorjaviervivas@gmail.com">
            <span>victorjaviervivas@gmail.com</span>
            <i aria-hidden="true">↗</i>
          </a>
        </span>
        <span className="creator-web" aria-hidden="true">
          <i /><i /><i />
        </span>
      </div>
    </footer>
  )
}
