import { useEffect, useId, useRef } from 'react'
import { createPortal } from 'react-dom'

export type ModalVariant = 'confirm' | 'success' | 'error' | 'warning' | 'info'
export type AppModalProps = {
  open: boolean; variant: ModalVariant; title: string; description?: string
  confirmLabel?: string; cancelLabel?: string; loading?: boolean; dismissible?: boolean
  onConfirm?: () => void; onCancel?: () => void; onClose?: () => void
}

export function AppModal({ open, variant, title, description, confirmLabel = 'Aceptar', cancelLabel,
  loading = false, dismissible = true, onConfirm, onCancel, onClose }: AppModalProps) {
  const titleId = useId(), descriptionId = useId(), panel = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!open) return
    const previous = document.activeElement as HTMLElement | null
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    panel.current?.focus()
    const keydown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && dismissible && !loading) onClose?.()
      if (event.key !== 'Tab' || !panel.current) return
      const items = [...panel.current.querySelectorAll<HTMLElement>('button,[href],input,select,textarea,[tabindex]:not([tabindex="-1"])')].filter((item) => !item.hasAttribute('disabled'))
      if (!items.length) return
      const first = items[0], last = items.at(-1)!
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus() }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus() }
    }
    document.addEventListener('keydown', keydown)
    return () => { document.removeEventListener('keydown', keydown); document.body.style.overflow = overflow; previous?.focus() }
  }, [dismissible, loading, onClose, open])
  if (!open) return null
  return createPortal(
    <div className="app-modal-backdrop" onMouseDown={() => dismissible && !loading && onClose?.()}>
      <div ref={panel} className={`app-modal app-modal--${variant}`} role="dialog" aria-modal="true"
        aria-labelledby={titleId} aria-describedby={description ? descriptionId : undefined} tabIndex={-1}
        onMouseDown={(event) => event.stopPropagation()}>
        <span className="app-modal-icon" aria-hidden="true">{variant === 'success' ? '✓' : variant === 'error' ? '!' : variant === 'warning' ? '!' : variant === 'confirm' ? '?' : 'i'}</span>
        <h2 id={titleId}>{title}</h2>
        {description && <p id={descriptionId}>{description}</p>}
        <div className="app-modal-actions">
          {cancelLabel && <button type="button" disabled={loading} onClick={onCancel ?? onClose}>{cancelLabel}</button>}
          <button type="button" className={variant === 'confirm' || variant === 'error' ? 'is-danger' : 'is-primary'} disabled={loading} onClick={onConfirm ?? onClose}>
            {loading ? 'Procesando…' : confirmLabel}
          </button>
        </div>
      </div>
    </div>, document.body)
}
