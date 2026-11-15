import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'lucide-react', 'canvas-confetti'],
          jspdf: ['jspdf'],
          html2canvas: ['html2canvas']
        }
      }
    }
  },
  server: {
    port: 3000,
    open: true
  }
});

