// @ts-check
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';

import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
const buildDate = new Date().toISOString();

export default defineConfig({
  site: 'https://pablopinxit.com',
  output: 'server',
  adapter: vercel(),
  integrations: [
    react(),
    sitemap({
      serialize(item) {
        const pathname = new URL(item.url).pathname.replace(/\/$/, '') || '/';
        let priority = 0.7;
        let changefreq = 'monthly';

        if (pathname === '/') {
          priority = 1.0;
          changefreq = 'weekly';
        } else if (pathname === '/about' || pathname === '/contact') {
          priority = 0.8;
        } else if (pathname === '/videos' || pathname === '/arts-books') {
          priority = 0.75;
        } else {
          priority = 0.85;
          changefreq = 'weekly';
        }

        return { ...item, lastmod: buildDate, changefreq, priority };
      },
    }),
  ],

  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      include: ['react', 'react-dom', 'react-dom/client', 'react/jsx-runtime'],
    },
  }
});