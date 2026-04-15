import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import AutoImport from "astro-auto-import";
import { defineConfig } from "astro/config";
import sharp from "sharp";

// https://astro.build/config
export default defineConfig({
  // 1. MODO ESTÁTICO (Obligatorio para GitHub Pages)
  output: "static",

  // 2. URL DE TU SITIO (Ajusta 'Gvln-S' si es tu usuario)
  site: "https://Gvln-S.github.io",

  // 3. RUTA BASE (Nombre exacto de tu repositorio)
  base: "/18k-gold-jewelry",

  trailingSlash: "always",
  image: { service: { entrypoint: 'astro/assets/services/sharp' } },

  // 4. CONFIGURACIÓN TAILWIND 4 (Plugin de Vite)
  vite: {
    plugins: [tailwindcss()]
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
  markdown: {
    shikiConfig: {
      theme: "one-dark-pro",
      wrap: true,
    },
    extendDefaultPlugins: true,
  },
});
