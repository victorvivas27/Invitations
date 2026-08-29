let removed = false

export function hideBootLoader(): void {
  if (removed) return

  const loader = document.getElementById('boot-loader')
  if (!loader) {
    removed = true
    return
  }

  loader.classList.add('boot-loader--hidden')
  loader.setAttribute('aria-busy', 'false')

  const removeLoader = () => {
    if (removed) return
    removed = true
    loader.removeEventListener('transitionend', handleTransitionEnd)
    loader.remove()
  }
  const handleTransitionEnd = (event: Event) => {
    if (event.target === loader) removeLoader()
  }

  loader.addEventListener('transitionend', handleTransitionEnd)
  window.setTimeout(removeLoader, 600)
}

export function hideBootLoaderAfterRender(): () => void {
  const requestFrame =
    window.requestAnimationFrame ??
    ((callback: FrameRequestCallback) =>
      window.setTimeout(() => callback(performance.now()), 16))
  const cancelFrame =
    window.cancelAnimationFrame ??
    ((handle: number) => window.clearTimeout(handle))
  let secondFrame = 0
  const firstFrame = requestFrame(() => {
    secondFrame = requestFrame(hideBootLoader)
  })

  return () => {
    cancelFrame(firstFrame)
    if (secondFrame) cancelFrame(secondFrame)
  }
}
