# Viteest

Vitest bir test koşturucusudur. v3 ve Istanbul ise coverage raporlayıcısıdır.

## Kurulum

Kullanılacak paketlerin rolleri:

- **vitest**: Test çalıştırıcısı
- **@testing-library/react**: React bileşenlerini render etmek için araçlar
- **@testing-library/jest-dom**: DOM elemanlarını test etmek için ek matcher'lar
- **jsdom**: Tarayıcı benzeri bir DOM ortamı
- **@testing-library/user-event**: Kullanıcı etkileşimlerini simüle etmek için
- **@vitest/reporters**: XML raporunu JUnit formatında çıkaracak

```sh
npm install --save-dev \
            vitest \
            @testing-library/react \
            @testing-library/user-event \
            jsdom \
            @vitest/ui \
            @testing-library/jest-dom \
            @vitest/reporters \
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

### @vitest/ui

Bir UI üzerinde çıktıları görmek istersek `@vitest/ui` paketine ihtiyacımız olacak.
`@vitest/ui` paketi Vitest test koşucusu için görsel bir arayüz sağlar. Paketinizin bağımlılıkları arasında görünmüyor. Bu paket şu işlevleri sunar:

- Test sonuçlarını görsel olarak izleme
- Test başarısızlıklarını daha detaylı inceleme
- Code coverage sonuçlarını interaktif olarak görüntüleme
- Testleri seçerek çalıştırma imkanı
- Hot reloading ile canlı test sonuçlarını görebilme

Mevcut projenizde kullanılmıyor, test çalıştırmaları için CLI komutları kullanıyorsunuz. UI'ı kullanmak isterseniz:

```bash
npm install -D @vitest/ui
```

Sonra `package.json`'a başlatan betiği ekleyebilirsiniz. Aşağıdaki `package.json` içinde yer alabilecek betikte `--api.port` ve `--api.host` bilgisi eğer konteyner içinde çalıştırıyor ve ana bilgisayardan erişmek isterseniz çok kullanışlı olacaktır:

```json
"test:ui": "npx vitest --ui --api.host=0.0.0.0 --api.port=9999 "
```


Testi koşsun ve sürekli kodların değişimini takip ederek tüm testleri koşar:

```json
"test:watch": "npx vitest --watch --ui --api.host=0.0.0.0 --api.port=8999",
```

Tüm testleri koşar ve sürekli değiştirilen dosyalardan etkilenen testleri çalıştır:

```json
"test:changed": "npx vitest --ui --api.host=0.0.0.0 --api.port=8999 --changed --coverage=false",
```

Belirli bir dizindeki testleri sürekli koşar:
```json
"test:dir": "npx vitest --ui --api.host=0.0.0.0 --api.port=8999 --dir src/components --coverage=false",
```

HTML formatında birim test sonuç raporu üretmesi için:

```json
"test:html": "npx vitest --run --coverage --reporter=html --config ./vitest.config.ts --outputFile=test-results/unit/html/output.html"
```

JSON formatında birim test sonuç raporu üretmesi için:

```json
"test:json": "npx vitest --run --coverage --reporter=json --outputFile=test-results/unit/json/output.json"
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


