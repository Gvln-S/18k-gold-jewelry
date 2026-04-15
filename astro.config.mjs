import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import AutoImport from "astro-auto-import";
import { defineConfig } from "astro/config";
import sharp from "sharp";

export default defineConfig({
  // 1. MODO ESTÁTICO (Funciona en GitHub Pages y Vercel)
  output: "static",

  // 2. URL de tu sitio (Pon la de Vercel o GitHub)
  site: "https://18k-gold-jewelry.vercel.app",

  trailingSlash: "always",
  image: { service: { entrypoint: 'astro/assets/services/sharp' } },

  vite: {
    plugins: [tailwindcss()],
    // Importante para que no intente cargar 'fs' en el navegador
    optimizeDeps: {
      exclude: ['node:fs', 'node:path']
    }
  },

  integrations: [
    react(),
    sitemap(),
    AutoImport({
      imports: [
        "@/shortcodes/Button",
        "@/shortcodes/Accordion",
        "@/shortcodes/Notice",
        "@/shortcodes/Video",
        "@/shortcodes/Youtube",
        "@/shortcodes/Tabs",
        "@/shortcodes/Tab",
      ],
    }),
    mdx(),
  ],
});
