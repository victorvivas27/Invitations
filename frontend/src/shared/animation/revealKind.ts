/**
 * Formas de aparición que admite reveal.css.
 *
 *   item   el elemento marcado entra por sí mismo
 *   group  entran sus hijos directos, escalonados
 *   media  entra la imagen que contiene, con una escala mínima
 */
export type RevealKind = 'item' | 'group' | 'media'
