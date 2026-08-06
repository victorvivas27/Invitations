import type { CSSProperties } from 'react'

/**
 * Bloque de carga que reserva el espacio real del contenido, para que la vista
 * no salte ni muestre un estado vacío mientras llegan los datos.
 */
export function Skeleton({
  className = '',
  width,
  height,
}: {
  className?: string
  width?: string
  height?: string
}) {
  const style: CSSProperties = {}
  if (width) style.width = width
  if (height) style.height = height
  return (
    <span
      className={`skeleton ${className}`.trim()}
      style={style}
      aria-hidden="true"
    />
  )
}
