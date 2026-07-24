import { defineConfig } from 'vite';

export default defineConfig({
  base: './', // Use relative paths for easy deployment on WDEngine / static web servers
  build: {
    outDir: 'out', // Export production bundle directly to the out directory
    emptyOutDir: true,
    sourcemap: false
  }
});
