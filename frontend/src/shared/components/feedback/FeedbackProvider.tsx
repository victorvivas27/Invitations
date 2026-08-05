import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { AppModal, type ModalVariant } from './AppModal'

type ToastVariant = Exclude<ModalVariant, 'confirm'>
type Toast = { id: number; message: string; variant: ToastVariant }
type ConfirmOptions = { title: string; description?: string; confirmLabel?: string; cancelLabel?: string; variant?: ModalVariant }
type Feedback = { confirm: (options: ConfirmOptions) => Promise<boolean>; toast: (message: string, variant?: ToastVariant) => void }
const Context = createContext<Feedback | null>(null)

export function FeedbackProvider({ children }: { children: React.ReactNode }) {
  const [dialog, setDialog] = useState<(ConfirmOptions & { resolve: (value: boolean) => void }) | null>(null)
  const [toasts, setToasts] = useState<Toast[]>([])
  const confirm = useCallback((options: ConfirmOptions) => new Promise<boolean>((resolve) => setDialog({ ...options, resolve })), [])
  const close = (result: boolean) => { dialog?.resolve(result); setDialog(null) }
  const toast = useCallback((message: string, variant: ToastVariant = 'info') => {
    const id = Date.now() + Math.random()
    setToasts((items) => [...items, { id, message, variant }])
    window.setTimeout(() => setToasts((items) => items.filter((item) => item.id !== id)), 4500)
  }, [])
  const value = useMemo(() => ({ confirm, toast }), [confirm, toast])
  return <Context.Provider value={value}>{children}
    <AppModal open={Boolean(dialog)} variant={dialog?.variant ?? 'confirm'} title={dialog?.title ?? ''}
      description={dialog?.description} confirmLabel={dialog?.confirmLabel} cancelLabel={dialog?.cancelLabel ?? 'Cancelar'}
      dismissible={false} onConfirm={() => close(true)} onCancel={() => close(false)} />
    <div className="toast-viewport" aria-live="polite" aria-label="Notificaciones">
      {toasts.map((item) => <div key={item.id} className={`app-toast app-toast--${item.variant}`} role={item.variant === 'error' ? 'alert' : 'status'}>
        <span>{item.message}</span><button type="button" aria-label="Cerrar notificación" onClick={() => setToasts((all) => all.filter((toastItem) => toastItem.id !== item.id))}>×</button>
      </div>)}
    </div>
  </Context.Provider>
}
export function useFeedback() { const value = useContext(Context); if (!value) throw new Error('useFeedback requires FeedbackProvider'); return value }
