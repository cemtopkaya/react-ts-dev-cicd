/**
 * Vitest ayarları ile ilgili ayrıntılı bilgi için:
 * https://vitest.dev/config/
 *
 * https://vitest.dev/guide/configuration.html
 * https://vitest.dev/guide/browser/playwright
 * https://vitest.dev/guide/browser/playwright.html#configuration
 **/

// filepath: vitest.config.ts
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
        // Yukarıdaki threshold değerlerinin altında kalan dosyalar için hata fırlatır.
        // Eğer hata fırlatılmasını istemiyorsanız, bu değeri false yapabilirsiniz.
        // Eğer sadece belirli dosyalar için hata fırlatılmasını istiyorsanız, bu değeri
        // belirli dosyalar için ayarlayabilirsiniz.
        // Örnek: "src/components/**/*.{ts,tsx}": 80
        // "src/components/**/*.{ts,tsx}": {
        //   branches: 80,
        //   functions: 80,
        //   lines: 80,
        //   statements: 80,
        // },
        // "src/**/*.{ts,tsx}": {
        //   branches: 80,
        //   functions: 80,
        //   lines: 80,
        //   statements: 80,
        // },
        perFile: true,
        autoUpdate: false,
      },
      reportsDirectory: "./coverage",
      reporter: [
        ["lcov", { projectRoot: "./src" }],
        ["json", { file: "coverage.json" }],
        ["text"],
        ["text-summary"],    // Add a summary reporter for clearer terminal output
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
