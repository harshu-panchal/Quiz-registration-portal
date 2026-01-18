import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom', 'react-hook-form'],
          'vendor-ui': ['framer-motion', 'lottie-react', 'lucide-react'],
          'vendor-charts': ['recharts'],
          'vendor-forms': ['@hookform/resolvers', 'zod'],
        },
      },
    },
    chunkSizeWarningLimit: 1000, // Increase warning limit for larger chunks
  },
})
