import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8001',
        changeOrigin: true,
        secure: false,
      },
      '/ws': {
        target: 'ws://localhost:8001',
        ws: true,
      }
    },
    port: 3000,
    host: '0.0.0.0',  // Permet l'accès depuis d'autres appareils
  },
  publicDir: 'public',  // Assure que les assets publics sont correctement servis
  base: './', // Utilise des chemins relatifs pour les assets
  build: {
    // Assure que tous les assets sont inclus dans le bundle
    assetsInlineLimit: 0
  }
})
