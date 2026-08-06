import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  css: {
    modules: {
      scopeBehaviour: 'global',
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.ts',
    // reveal.css se importa como texto en su prueba para verificar que las
    // duraciones y el escalonado siguen dentro de los rangos acordados.
    css: { include: [/reveal\.css/] },
    coverage: { provider: 'v8', reporter: ['text', 'html'] },
  },
})
