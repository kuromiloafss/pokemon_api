import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    // Memaksa Vite pakai esbuild standar (bukan lightningcss yang rewel cache)
    transformer: 'esbuild',
    minify: 'esbuild'
  }
})