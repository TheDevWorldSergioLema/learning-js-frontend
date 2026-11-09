import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  server: { host: true },
  preview: { host: true },
  css: {
    preprocessorOptions: {
      scss: { loadPaths: [fileURLToPath(new URL('./src/styles', import.meta.url))] },
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.js'],
    css: false,
  },
})
