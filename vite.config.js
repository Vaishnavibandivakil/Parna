import { defineConfig } from 'vite';

export default defineConfig({
  define: {
    process: JSON.stringify({ env: { NODE_ENV: 'production' } }),
  },
  build: {
    outDir: 'dist',
    emptyOutDir: false,
    lib: {
      entry: 'src/hero-scene.jsx',
      formats: ['iife'],
      name: 'ParnaHeroScene',
      fileName: () => 'hero-scene.js',
    },
    rollupOptions: {
      output: {
        banner: 'var process = { env: { NODE_ENV: "production" } };',
      },
    },
  },
});
