import { defineConfig } from 'astro/config';
import node from '@astrojs/node';
import { onRequest as sessionMiddleware } from './src/middleware/index.ts';

export default defineConfig({
  output: 'server',
  adapter: node({
    mode: 'standalone' // puedes dejarlo también para facilitar el deploy
  }),
  site: process.env.NODE_ENV === 'production' ? 'http://tgxc7w5c-4321.usw3.devtunnels.ms' : undefined,
});
