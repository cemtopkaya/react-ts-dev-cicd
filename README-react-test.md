# Viteest

Vitest bir test koşturucusudur. v3 ve Istanbul ise coverage raporlayıcısıdır.

## Kurulum

Kullanılacak paketlerin rolleri:

- **vitest**: Test çalıştırıcısı
- **@testing-library/react**: React bileşenlerini render etmek için araçlar
- **@testing-library/jest-dom**: DOM elemanlarını test etmek için ek matcher'lar
- **jsdom**: Tarayıcı benzeri bir DOM ortamı
- **@testing-library/user-event**: Kullanıcı etkileşimlerini simüle etmek için

```sh
npm install --save-dev \
            vitest \
            @testing-library/react \
            @testing-library/user-event \
            jsdom \
            @vitest/ui \
            @testing-library/jest-dom \
            @vitest/coverage-istanbul
```


`vitest.config.ts` (veya `.js`) dosyası oluşturun:

```javascript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './vitest.setup.ts',
    css: true,
  }
});
```

### Test Ortamı Kurulumu

1. `vitest.setup.ts` dosyası oluşturun:

    ```javascript
    import '@testing-library/jest-dom';
    ```

1. `package.json`'a Test Scriptleri Ekleme

    ```javascript
    "scripts": {
    "test": "vitest",
    "test:watch": "vitest watch",
    "test:coverage": "vitest run --coverage"
    }
    ````

## Hata Giderme

### Property 'toHaveTextContent' does not exist on type 'Assertion<HTMLElement>'

`CounterButton.test.tsx` dosyasındaki `"toHaveTextContent bulunamadı"` hatası, genellikle TypeScript'in `jest-dom` tiplerini görmemesinden kaynaklanır. Bu tipler, test ortamında `jest-dom matchers`'larını (ör. `toHaveTextContent`) tanımlar.

**Sorunun Kaynağı**

-   Eğer `tsconfig.app.json`'daki `include` alanı test dosyalarını (ör. `**/*.test.tsx`) kapsamıyorsa, TypeScript bu dosyaları ve onların ihtiyaç duyduğu tipleri derlemez.
-   Bu durumda, jest-dom'un tip tanımları test dosyalarına uygulanmaz ve `toHaveTextContent` gibi matcher'lar bilinmez.

**Çözüm: `include`'a Test Dosyalarını Eklemek**

-   `tsconfig.app.json` veya testler için kullanılan tsconfig dosyanızın `include` kısmına test dosyalarını (örn. `src/**/*.test.tsx`) eklediğinizde, TypeScript artık bu dosyaları ve onların bağımlı olduğu tipleri (ör. jest-dom) görebilir.
-   Böylece, `toHaveTextContent` gibi jest-dom matchers'ları TypeScript tarafından tanınır ve hata ortadan kalkar.

**Özet:**
`tsconfig.app.json`'daki `include` alanına test dosyalarını eklemek, TypeScript'in test ortamı tiplerini (ör. jest-dom) görmesini sağlar ve `toHaveTextContent` gibi matcher'ların bulunamama hatasını giderir.


