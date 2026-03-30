import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
    VitePWA({
      registerType: "prompt",
      includeAssets: ["icon.png"],
      manifest: {
        name: "Zuppa di Pesce",
        short_name: "Zuppa",
        description: "Hearty Italian-American Seafood Stew — recipe, equipment, and shopping list",
        theme_color: "#9b4006",
        background_color: "#fef9f2",
        display: "standalone",
        start_url: "/",
        icons: [
          { src: "/icon.png", sizes: "1024x1024", type: "image/png" },
          { src: "/icon.png", sizes: "1024x1024", type: "image/png", purpose: "maskable" },
        ],
        screenshots: [
          { src: "/screenshots/01-recipe-ingredients.png", sizes: "390x844", type: "image/png", form_factor: "narrow", label: "Recipe — Ingredients" },
          { src: "/screenshots/02-recipe-steps.png",       sizes: "390x844", type: "image/png", form_factor: "narrow", label: "Recipe — Steps" },
          { src: "/screenshots/04-equipment-tab.png",      sizes: "390x844", type: "image/png", form_factor: "narrow", label: "Equipment" },
          { src: "/screenshots/05-shopping-tab.png",       sizes: "390x844", type: "image/png", form_factor: "narrow", label: "Shopping List" },
          { src: "/screenshots/06-settings-tab.png",       sizes: "390x844", type: "image/png", form_factor: "narrow", label: "Settings" },
        ],
      },
      workbox: {
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: "StaleWhileRevalidate",
            options: { cacheName: "google-fonts-stylesheets" },
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "google-fonts-webfonts",
              expiration: { maxEntries: 20, maxAgeSeconds: 365 * 24 * 60 * 60 },
            },
          },
          {
            // Equipment images — Google, Shopify, Amazon CDNs
            urlPattern: /^https:\/\/(lh3\.googleusercontent\.com|.*\.shopify\.com|m\.media-amazon\.com|cdn\.shopify\.com|supplies\.gusta\.ca)\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "equipment-images",
              expiration: { maxEntries: 40, maxAgeSeconds: 30 * 24 * 60 * 60 },
            },
          },
        ],
      },
    }),
  ],
  preview: {
    allowedHosts: ["zuppa-di-pesce-recipe-production.up.railway.app"],
  },
});
