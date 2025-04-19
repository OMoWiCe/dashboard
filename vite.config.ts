import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import analyze from 'vite-bundle-analyzer';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), analyze()],
  build: {
    minify: true,
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', '@mui/material', '@mui/icons-material', 'recharts']
        }
      }
    }
  }
});
