import { useRef, useState } from 'react'

type Props = {
  label: string
  imageUrl: string
  position: number
  onPositionChange: (position: number) => void
  variant?: 'cover' | 'final'
}

export function ImageCropEditor({
  label,
  imageUrl,
  position,
  onPositionChange,
  variant = 'cover',
}: Props) {
  const frameRef = useRef<HTMLDivElement>(null)
  const [dragging, setDragging] = useState(false)

  const move = (clientY: number) => {
    const frame = frameRef.current
    if (!frame) return

    const rect = frame.getBoundingClientRect()
    const newPosition = ((clientY - rect.top) / rect.height) * 100
    onPositionChange(Math.max(0, Math.min(100, newPosition)))
  }

  return (
    <div className={`image-crop-editor is-${variant}`}>
      <span>{label}</span>

      <div
        ref={frameRef}
        className={`image-crop-frame${dragging ? ' is-dragging' : ''}`}
        onPointerDown={(event) => {
          setDragging(true)
          event.currentTarget.setPointerCapture(event.pointerId)
          move(event.clientY)
        }}
        onPointerMove={(event) => {
          if (dragging) move(event.clientY)
        }}
        onPointerUp={() => setDragging(false)}
        onPointerCancel={() => setDragging(false)}
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            style={{ objectPosition: `50% ${position}%` }}
            alt="Vista del recorte"
          />
        ) : (
          <small>Sube una imagen para ajustar el recorte</small>
        )}
        <i>Arrastra la imagen</i>
      </div>
    </div>
  )
}
