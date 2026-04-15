import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  // 1. CAMBIO IMPORTANTE: Modo estático para GitHub Pages
  output: 'static',

  // 2. CAMBIO IMPORTANTE: Tu URL de GitHub Pages
  // Reemplaza 'Gvln-S' por tu usuario si es diferente
  site: 'https://Gvln-S.github.io',

  // 3. CAMBIO IMPORTANTE: El nombre de tu repositorio
  // Esto hace que los archivos se busquen en /18k-gold-jewelry/ en lugar de la raíz
  base: '/18k-gold-jewelry',

  integrations: [
    tailwind(),
    react(),
    mdx(),
    sitemap(),
  ],
});
