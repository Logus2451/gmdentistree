import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "prompt",
      includeAssets: ["favicon.ico", "apple-touch-icon.png", "masked-icon.svg"],
      devOptions: {
        enabled: false,
      },
      injectRegister: 'auto',
      manifest: {
        name: "Dr.G.M's Dentistree - Professional Dental Services",
        short_name: "Dentistree",
        description:
          "Professional dental care with online booking and consultation services",
        theme_color: "#10b981",
        background_color: "#ffffff",
        display: "standalone",
        orientation: "portrait",
        scope: "/",
        start_url: "/?source=pwa",
        id: "/?source=pwa",
        categories: ["medical", "health"],
        icons: [
          {
            src: "pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,jpg,jpeg}"],
        maximumFileSizeToCacheInBytes: 5000000,
        navigateFallbackDenylist: [/^\/api\//, /supabase/],
        skipWaiting: true,
        clientsClaim: true,
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/images\.unsplash\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "unsplash-images",
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365,
              },
            },
          },
          {
            urlPattern: /^https:\/\/.*\.supabase\.co\/.*/i,
            handler: "NetworkOnly",
            options: {
              cacheName: "supabase-api",
            },
          },
        ],
      },
    }),
  ],

  optimizeDeps: {
    exclude: ["lucide-react"],
  },

  server: {
    host: true,
  },

  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          router: ["react-router-dom"],
          ui: ["framer-motion", "lucide-react"],
        },
      },
    },
    target: "es2015",
  },
});
