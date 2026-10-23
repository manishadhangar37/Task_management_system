import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Keep the browser's Host and Origin so Rails sees Vite as the request origin.
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: false,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
      '/csrf_token': {
        target: 'http://localhost:3000',
        changeOrigin: false,
      },
      
      
      
    },
  },
})
