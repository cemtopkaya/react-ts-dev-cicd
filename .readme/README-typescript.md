# Typescript

## tsconfig.json

`tsconfig.json` dosyasında "references" ile farklı tsconfig dosyalarına referans vererek, projeyi çoklu yapılandırma (project references) ile yönetebilirsiniz. Ancak, hangi ortamı derleyeceğinizi TypeScript'e komut satırında hangi tsconfig dosyasını kullandığınızı belirterek bildirirsiniz.

```json
{
  "files": [],
  "references": [
    { "path": "./tsconfig.app.json" },
    { "path": "./tsconfig.test.json" },
    { "path": "./tsconfig.node.json" }
  ]
}
```

`tsconfig.json` ana dosya olarak referansları içerir, ama doğrudan derlenmez.
Hangi ortamı derleyeceğinizi, `-p` veya `--project` parametresiyle belirttiğiniz tsconfig dosyasıyla seçersiniz. Her bir tsconfig dosyası kendi include, exclude ve compilerOptions ayarlarına sahip olabilir.

### Uygulama Ortamı Derlemesi

`tsc -p tsconfig.app.json` → Canlı ortama kodu derler
`tsc -p tsconfig.test.json` → Test ortamına kodu derler
`tsc -p tsconfig.node.json` → Node ortamı için derler


## tsconfig.*.json

Her ortam için (uygulama ve test) farklı tipler, farklı dosyalar ve farklı ayarlar kullanabilirsiniz. Bu, build'inizden gereksiz test kodlarını ve tiplerini uzak tutar, test ortamında ise ihtiyacınız olan tüm tipleri ve dosyaları dahil eder.

`tsconfig.app.json` ve `tsconfig.test.json` dosyaları, TypeScript projelerinde farklı amaçlar için kullanılan özel yapılandırma dosyalarıdır.

Genellikle büyük projelerde, test ve uygulama kodlarını ayırmak için birden fazla tsconfig dosyası (ör. `tsconfig.app.json`, `tsconfig.test.json`) kullanılır.

### tsconfig.app.json
`tsconfig.app.json` dosyası, TypeScript derleyicisine (`tsc`) projenizin uygulama (app) kısmında hangi dosyaların ve ayarların kullanılacağını belirtmek için kullanılır.

- **Amaç**: Uygulama (production veya development) kodunu derlemek için kullanılır.
- **Kapsam**: Genellikle sadece uygulama kaynak kodunu (src altındaki `.ts` ve `.tsx` dosyaları) içerir.
- **`include/exclude`**: Test dosyalarını (`*.test.ts`, `*.spec.ts`) ve mock/fake dosyalarını kapsamaz.
- **Kullanım**: Uygulamanın derlenmesi, build alınması veya production paketinin hazırlanması sırasında kullanılır.
- **Örnek**:
    ```json
    {
    "extends": "./tsconfig.json",
    "include": ["src/**/*.ts", "src/**/*.tsx"],
    "exclude": ["src/**/*.test.ts", "src/**/*.spec.ts"]
    }
    ```

### tsconfig.test.json

- **Amaç**: Test kodlarını derlemek ve test ortamı için özel tipleri (ör. `jest`, `vitest`, `jest-dom`) eklemek için kullanılır.
- **Kapsam**: Hem uygulama kodunu hem de test dosyalarını (`*.test.ts`, `*.spec.tsx` gibi) içerir.
- **include**: Test dosyalarını ve test ortamı tiplerini kapsar.
- **Kullanım**: Test çalıştırılırken (`vitest`, `jest` veya başka bir test runner ile) kullanılır. Test ortamına özel tipler ve ayarlar burada tanımlanır.
- **Örnek**:
    ```json
    {
    "extends": "./tsconfig.json",
    "include": ["src/**/*.ts", "src/**/*.tsx", "src/**/*.test.tsx"],
    "types": ["vitest/globals", "@testing-library/jest-dom"]
    }
    ```



-   **Kapsamı Sınırlar:** Sadece uygulama kaynak kodunu (`src` gibi) derler, test veya yapılandırma dosyalarını dahil etmez.
-   **Ayrı Ayarlar:** Testler için farklı, uygulama için farklı TypeScript ayarları kullanılabilir.
-   **Daha Temiz Build:** Test dosyaları veya gereksiz dosyalar uygulama build'ine dahil edilmez.

---

## Vite ve Vitest için tsconfig.json ayarı nasıl verilir?

Özetle;
- **Vite**: Otomatik olarak ana tsconfig dosyasını kullanır, genellikle ekstra ayar gerekmez.
- **Vitest**: vitest.config.ts içinde `testTsconfig` ile istediğiniz tsconfig dosyasını belirtebilirsiniz.

**Komut satırında** ise doğrudan `tsc -p tsconfig.xxx.json` ile sadece TypeScript derlemesi yaparsınız, bu test veya Vite çalıştırmaz.  
Vite/Vitest kendi ayar dosyalarından tsconfig'i okur ve uygular.

Vite veya Vitest ile çalışırken doğrudan `tsc -p tsconfig.xxx.json` komutunu kullanmazsınız. Bunun yerine, **Vite** ve **Vitest** kendi yapılandırma dosyalarında hangi TypeScript ayar dosyasını (tsconfig) kullanacaklarını belirtirsiniz.

### Vite için
Vite, kök dizinde tsconfig.json veya tsconfig.app.json gibi dosyaları otomatik olarak bulur. Eğer özel bir tsconfig dosyası kullanmak isterseniz, Vite'nin config dosyasında (ör. vite.config.ts) doğrudan belirtme imkanı yoktur, ancak Vite TypeScript'in default davranışını takip eder ve genellikle ana tsconfig.json veya referans verdiği dosyaları kullanır.

### Vitest için

Vitest, TypeScript ayarlarını otomatik olarak algılar. Ancak, **test ortamı için özel bir tsconfig** kullanmak istiyorsanız, vitest.config.ts dosyasında `test.tsconfig` alanını kullanabilirsiniz:

```ts
// vitest.config.ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './vitest.setup.ts',
    // Burada özel tsconfig dosyasını belirtebilirsiniz:
    testTsconfig: './tsconfig.test.json'
  }
})
```

> Not: `testTsconfig` anahtarı, Vitest 0.34.0 ve sonrası için geçerlidir. Daha eski sürümlerde `tsconfig` olarak da geçebilir.

