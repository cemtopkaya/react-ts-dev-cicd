import { defineConfig } from 'vitest/config';


// --- RAPORLAYICILAR ---
// import { myCustomReporter } from './reporters/custom-reporter';

// --- ÖZEL PLUGINLER ---
// import myCustomPlugin from './plugins/custom-plugin';
// Vitest için Playwright eklentisi
// import { playwright } from 'vitest-playwright'; 

console.log('viTEST.config.ts çalıştı');
export default defineConfig({
  plugins: [],
  test: {
    globals: true,        // Global olarak `describe`, `it`, ve `expect` gibi fonksiyonları kullanmaya izin verir.
    setupFiles: './vitest.setup.ts', // Her test dosyasından önce çalıştırılacak dosya.
    environment: 'jsdom', // Testler için tarayıcı benzeri bir ortam sağlar.
    // environment: 'node', // Testlerin Node.js ortamında çalışacağını belirtir (varsayılan).
    include: ['**/*.test.{js,ts}'], // Hangi dosya kalıplarının test dosyası olarak kabul edileceğini tanımlar.
    exclude: ['node_modules'], // Test kapsamı dışına bırakılacak dosya veya dizinleri belirtir.

    testTimeout: 30000, // E2e testleri için daha uzun bir zaman aşımı (isteğe bağlı)
    hookTimeout: 10000, // Hook'lar için zaman aşımı (isteğe bağlı)
    
    reporters: [ // Hem varsayılan (varsayılan olarak konsola çıktı verir) hem de özel bir raporlayıcıyı kullanır.
      'default', 
      // myCustomReporter()
    ], 
    coverage: {
      reporter: ['text', 'json-summary'], // Kod kapsamı raporlarını yapılandırır.
    },
    // ----- TARAYICI TESTLER -----
    // https://vitest.dev/guide/browser/playwright
    // Tarayıcı testleri için ayarlar
    // Vitest opens a single page to run all tests in the same file.
    browser: {
      enabled: true, // Tarayıcı testlerini etkinleştirir.
      provider: 'playwright', // Kullanılacak tarayıcı otomasyon aracını belirtir.
      headless: true, // Tarayıcının arayüzü olmadan çalışmasını sağlar.
      instances: [
        {
          browser: 'chromium', // ('chromium', 'firefox', 'webkit')
          launch: {
            // Tarayıcı başlatma seçenekleri (isteğe bağlı)
          },
          context: {},
        }
      ]
    }, 
  },
});
