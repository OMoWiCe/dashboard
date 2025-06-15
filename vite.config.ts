import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Proxy for main API
      '/api/v1': {
        target: 'https://api.omowice.live/v1',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/v1/, ''),
      },
      // Proxy for admin API
      '/api/admin/v1': {
        target: 'https://api.omowice.live/admin/v1',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/admin\/v1/, ''),
      }
    }
  }
})
