import { defineConfig } from 'astro/config';
import node from '@astrojs/node';
import { onRequest as sessionMiddleware } from './src/middleware/index.ts';

export default defineConfig({
  output: 'server',
  adapter: node({
    mode: 'standalone'
  }),
  build: {
    assets: '_astro',
  },
  vite: {
    build: {
      rollupOptions: {
        output: {
          manualChunks: () => 'everything.js'
        }
      }
    }
  }
});