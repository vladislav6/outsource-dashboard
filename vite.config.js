import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  build: {
    minify: false,
    sourcemap: true,
    rollupOptions: {
      input: {
        main: 'index.html'
      }
    }
  }
});