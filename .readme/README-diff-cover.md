# diff-cover

Birim testleri koşup coverage raporu oluştururuz. Bu rapor lcov raporlayıcısıyla üretilirse `lcov.info` dosyasını üretmiş oluruz. Bu dosyanın içeriğinde `SF:` önekiyle olan satırlarda dosya yollarını göreceksin. `git diff main..HEAD` hali hazırdaki kodla `main` branşı arasındaki farkları görürüz. `coverage/lcov.info` Dosyasında testlerin hangi satırlardan, kaç kez geçtiğinin raporunu tutuyor. Bu rapor dosyası ve `git diff main..HEAD` çıktısına bakarak yeni veya güncellenmiş satırların testleri geçip geçmediğini anlayabiliyoruz. Bu işi kabuk betiği ile yapmak yerine diff-cover uygulamasına da yaptırabiliriz.

```shell
# yüklü paketleri listeleyelim ve içinde diff-cover var mı bakalım
pipx list

# yoksa yükleyelim
pipx install diff-cover

# diff-cover yüklü mü yerini bulalım
find / -name diff-cover 2>/dev/null

# komut satırından çalıştırabilmek için yolunu ekleyelim
export PATH="$HOME/.local/bin:$PATH"
```

Özetle:
> Kodu değiştir, testi koştur, coverage raporunu lcov raporlayıcısını kullanarak oluştur ve diff-cover ile yeni kodları kapsayıp kapsamadığına bak.

```shell
npx vitest run --coverage

diff-cover coverage/lcov.info --compare-branch=main --fail-under=90
```

Şimdi biraz daha ayrıntıya girelim:

`vitest.config.ts` dosyasındaki sihirli satırlar:

```javascript
...
      reportsDirectory: "./coverage",
      reporter: [
        ["lcov", { projectRoot: "." }]
      ],
...
```

Bu satırlar sayesinde `./coverage/lcov.info` dosyası oluşturulacak. Şimdi gel biraz daha ayrıntılı bakalım. `/workspace/src/components/CounterButton.tsx` Dosyasını düşünelim. Eğer lcov raporunu `{ projectRoot: "./src" }` ayarıyla çalıştırırsak raporda `SF:components/CounterButton.tsx` çıktısını görürüz. Oysa `git diff main..HEAD` cli  çıktısında `diff --git a/src/components/CounterButton.tsx b/src/components/CounterButton.tsx` görürüz. Yani eşleşme diff-cover tarafından yapılamaz. 3 saat kadar acısını çektikten sonra diyorum ki; `{ projectRoot: "."}` yaparsak çıktımız beklediğimiz gibi olur. 

```javascript
import { defineConfig } from "vitest/config";

export default defineConfig({
  // --- TEST AYARLARI ---
  test: {
    environment: "jsdom",
    globals: true,
    // Test başlamadan önce çalışacak kodlar, ayarlar, mocklar
    setupFiles: "./vitest.setup.ts",

    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    exclude: ["node_modules", "dist"],
    // Burada özel tsconfig dosyasını belirtebilirsiniz:
    typecheck: {
      tsconfig: "./tsconfig.test.json",
    },
    // coverage ayarı
    coverage: {
      // Use provider to select the tool for coverage collection.
      provider: "istanbul", // 'v8' | 'istanbul' | 'custom'
      // Enables coverage collection. Can be overridden using --coverage CLI option.
      enabled: true,
      // List of files included in coverage as glob patterns
      include: ["src/**/*.{ts,tsx}"],
      exclude: [
        "src/**/*.test.{ts,tsx}",
        "src/**/*.spec.{ts,tsx}",
        "src/**/*.stories.{ts,tsx}",
        "src/**/*.d.ts",
        "src/**/*.config.{ts,js}",
        "src/**/index.ts",
        "src/**/types.ts",
        "src/**/types.d.ts",
        "src/**/types.js",
        "src/**/types.json",
        "coverage/**",
        "dist/**",
        "**/node_modules/**",
        "**/[.]**",
        "packages/*/test?(s)/**",
        "**/*.d.ts",
        "**/virtual:*",
        "**/__x00__*",
        "**/\x00*",
        "cypress/**",
        "test?(s)/**",
        "test?(-*).?(c|m)[jt]s?(x)",
        "**/*{.,-}{test,spec,bench,benchmark}?(-d).?(c|m)[jt]s?(x)",
        "**/__tests__/**",
        "**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build,eslint,prettier}.config.*",
        "**/vitest.{workspace,projects}.[jt]s?(on)",
        "**/.{eslint,mocha,prettier}rc.{?(c|m)js,yml}",
      ],
      thresholds: {
        branches: 80,
        functions: 80,
        lines: 80,
        statements: 80,
        perFile: true,
        autoUpdate: false,
      },
      reportsDirectory: "./coverage",
      reporter: [
        ["lcov", { projectRoot: "." }]
      ],
      // Whether to include all files, including the untested ones into report.
      // Changed to true to include all src files in coverage report
      all: true,
      // Clean coverage results before running tests
      clean: true,
      cleanOnRerun: false,
      // Generate coverage report even when tests fail.
      // Changed to true to get reports even on test failures
      reportOnFailure: true,
      // Do not show files with 100% statement, branch, and function coverage.
      skipFull: false,
    },
  },
});
```

