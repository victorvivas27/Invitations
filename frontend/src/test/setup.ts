import '@testing-library/jest-dom/vitest'

// jsdom no implementa el desplazamiento; ScrollManager lo invoca en cada ruta.
window.scrollTo = (() => undefined) as typeof window.scrollTo
if (!Element.prototype.scrollIntoView)
  Element.prototype.scrollIntoView = () => undefined
