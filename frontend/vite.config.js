import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 5173,
    host: true,
    proxy: {
      '/api': {
        target: 'http://backend:8000',
        changeOrigin: true,
      },
      '/rt-api': {
        target: 'http://realtime:3000',
        changeOrigin: true,
      },
      '/storage': {
        target: 'http://backend:8000',
        changeOrigin: true,
      },
      '/socket.io': {
        target: 'http://realtime:3000',
        ws: true,
        changeOrigin: true,
      },
    }
  }
})
