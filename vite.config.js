import { defineConfig } from 'vite';

export default defineConfig({
  base: './', // Use relative paths for easy deployment on WDEngine / static web servers
  build: {
    outDir: 'dist', // Export production bundle to dist (standard for Vercel & static hosting)
    emptyOutDir: true,
    sourcemap: false
  }
});
