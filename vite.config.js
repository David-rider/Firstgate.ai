import { defineConfig } from 'vite';

export default defineConfig({
  base: './', // Use relative paths for easy deployment on WP Engine / static web servers
  build: {
    outDir: 'dist', // Export production bundle to dist (standard for Vercel & static hosting)
    emptyOutDir: true,
    sourcemap: false
  }
});
