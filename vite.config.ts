// https://vite.dev/config/
/// <reference types="vitest" />

import { defineConfig } from 'vite'

// --- PLUGINLER ---
// Vite için React eklentisi
import react from '@vitejs/plugin-react'

console.log('vite.config.ts çalıştı');

export default defineConfig({
  
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src', // '@' ile başlayan yolları '/src' dizinine yönlendirir
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: '@import "@/styles/variables.scss";', // SCSS dosyalarında kullanılacak değişkenleri ekler
      },
    },
  },
  define: {
    'process.env': process.env, // Node.js ortam değişkenlerini tanımlar
  },
  optimizeDeps: {
    include: ['@testing-library/react', '@testing-library/jest-dom'], // Geliştirme sırasında optimize edilecek bağımlılıkları belirtir
  },
  // --- TEST AYARLARI ---
  // Vitest için test ayarları
  // https://vitest.dev/guide/configuration.html
  // https://vitest.dev/guide/browser/playwright
  // https://vitest.dev/guide/browser/playwright.html#configuration
  test: {
    environment: 'jsdom',
    globals: true,
    // Test başlamadan önce çalışacak kodlar, ayarlar, mocklar
    setupFiles: './vitest.setup.ts',
  },
  server: {
    host: true,
    open: true,
    port: 3000,
  }
})