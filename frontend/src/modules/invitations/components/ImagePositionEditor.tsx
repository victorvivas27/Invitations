import { useRef, type PointerEvent, type WheelEvent } from 'react'

type Position = { offsetX: number; offsetY: number; zoom: number }

export function ImagePositionEditor({
  imageUrl,
  offsetX,
  offsetY,
  zoom,
  fit,
  onChange,
}: Position & {
  imageUrl: string
  fit: 'cover' | 'contain'
  onChange: (position: Position) => void
}) {
  const drag = useRef<{
    x: number
    y: number
    offsetX: number
    offsetY: number
  } | null>(null)
  const changeZoom = (next: number) =>
    onChange({ offsetX, offsetY, zoom: Math.min(3, Math.max(1, next)) })
  const start = (event: PointerEvent<HTMLDivElement>) => {
    event.preventDefault()
    drag.current = { x: event.clientX, y: event.clientY, offsetX, offsetY }
    event.currentTarget.setPointerCapture(event.pointerId)
  }
  const move = (event: PointerEvent<HTMLDivElement>) => {
    if (!drag.current) return
    event.preventDefault()
    onChange({
      offsetX: drag.current.offsetX + event.clientX - drag.current.x,
      offsetY: drag.current.offsetY + event.clientY - drag.current.y,
      zoom,
    })
  }
  const stop = (event: PointerEvent<HTMLDivElement>) => {
    drag.current = null
    if (event.currentTarget.hasPointerCapture(event.pointerId))
      event.currentTarget.releasePointerCapture(event.pointerId)
  }
  const wheel = (event: WheelEvent<HTMLDivElement>) => {
    event.preventDefault()
    changeZoom(zoom + (event.deltaY < 0 ? 0.1 : -0.1))
  }
  return (
    <div className="position-editor">
      <div
        className="position-editor-viewport"
        onPointerDown={start}
        onPointerMove={move}
        onPointerUp={stop}
        onPointerCancel={stop}
        onLostPointerCapture={() => {
          drag.current = null
        }}
        onWheel={wheel}
        role="application"
        aria-label="Arrastra la imagen para ajustar su encuadre"
      >
        <img
          src={imageUrl}
          alt="Vista previa del encuadre"
          draggable={false}
          style={{
            objectFit: fit,
            objectPosition: `calc(50% + ${offsetX}px) calc(50% + ${offsetY}px)`,
            transform: `scale(${zoom})`,
          }}
        />
        <span className="position-editor-guide">Zona segura para el texto</span>
      </div>
      <div className="position-editor-controls">
        <button
          type="button"
          aria-label="Alejar imagen"
          onClick={() => changeZoom(zoom - 0.1)}
        >
          −
        </button>
        <label>
          Zoom {zoom.toFixed(1)}×
          <input
            type="range"
            min="1"
            max="3"
            step="0.05"
            value={zoom}
            onChange={(event) => changeZoom(Number(event.target.value))}
          />
        </label>
        <button
          type="button"
          aria-label="Acercar imagen"
          onClick={() => changeZoom(zoom + 0.1)}
        >
          +
        </button>
        <button
          type="button"
          onClick={() => onChange({ offsetX: 0, offsetY: 0, zoom: 1 })}
        >
          Restablecer
        </button>
      </div>
    </div>
  )
}
