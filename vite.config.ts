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
    // 'process.env': process.env, // Node.js ortam değişkenlerini tanımlar
  },
  optimizeDeps: {
    include: ['@testing-library/react', '@testing-library/jest-dom'], // Geliştirme sırasında optimize edilecek bağımlılıkları belirtir
  },
  server: {
    host: "0.0.0.0",
    port: 3300,
    strictPort: true,
    open: true
  },
  preview: {
    host: "0.0.0.0",
    port: 6600,
    strictPort: true,
    open: true
  },
  build: {
    outDir: 'dist', // Çıktı dizini
  },
})