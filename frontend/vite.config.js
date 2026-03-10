import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    hmr: false,
    fs: {
      strict: false
    }
  },
  build: {
    target: 'es2020',
    minify: false
  },
  optimizeDeps: {
    esbuildOptions: {
      target: 'es2020'
    }
  }
})