import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['react-router-dom'],
  },
  build: {
    outDir: 'dist', // Output folder for GitHub Pages
  },
  base: '/prosjektoppgave/', // Set base URL for GitHub Pages
});
