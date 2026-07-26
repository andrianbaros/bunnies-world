import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      includeAssets: ['favicon.ico', 'assets/logo-192.png', 'assets/logo-512.png', 'robots.txt'],
      manifest: {
        id: '/',
        name: 'BUNNIES WORLD',
        short_name: 'BUNNIES',
        description: 'Interactive fan portal for NewJeans and Bunnies.',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        background_color: '#0d0b14',
        theme_color: '#0d0b14',
        orientation: 'portrait-primary',
        icons: [
          {
            src: '/assets/logo-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: '/assets/logo-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,jpg,jpeg}']
      }
    })
  ],
  build: {
    target: 'es2020',
    minify: 'esbuild',
    cssMinify: true,
    esbuild: {
      drop: ['console', 'debugger'],
    },
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router-dom') || id.includes('i18next')) {
              return 'vendor-core';
            }
            if (id.includes('framer-motion') || id.includes('lenis')) {
              return 'vendor-animation';
            }
            if (id.includes('lucide-react')) {
              return 'vendor-icons';
            }
            if (id.includes('@supabase')) {
              return 'vendor-supabase';
            }
          }
        }
      }
    }
  }
});
