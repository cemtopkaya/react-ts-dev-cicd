## Vite ve Npm Betikleri

[Vite](https://vitejs.dev/) (Fransızca'da "hızlı" anlamına gelir), modern web projelerinin geliştirilmesi için tasarlanmış hızlı bir derleme aracıdır. Vite, dev sunucu aşamasında ES modüllerini kullanarak anında modül yükleme sağlar ve üretim sürümü için Rollup ile birlikte çalışır.

### Temel npm Betikleri

Bu projede kullanılan temel npm betikleri şunlardır:

#### `npm run dev`

```bash
npx vite --config ./vite.config.ts
```

Bu betik, geliştirme sunucusunu başlatır. Çalıştırdığınızda:
- Yerel bir geliştirme sunucusu (genellikle http://localhost:5173) açılır
- Hot Module Replacement (HMR) etkinleştirilir, bu sayede kod değişiklikleriniz anında tarayıcıya yansır
- Kodunuzda hata ayıklama yapmayı kolaylaştıran kaynak haritaları sağlanır
- TypeScript dosyalarınızı otomatik olarak derler

#### `npm run build`

```bash
npm run dev -- build --outDir dist
```

Bu betik, uygulamanızı üretim için derler:
- JavaScript ve CSS dosyalarını küçültür (minify)
- Bundle'ları optimize eder ve gereksiz kodu çıkarır
- Statik varlıkları işler ve gerektiğinde hash ekler
- Tüm üretim dosyalarını `dist` klasörüne çıkarır
- Gerçek ortamda çalıştırılabilecek optimum sürümü oluşturur

#### `npm run preview`

```bash
npm run build && npm run dev -- preview --outDir dist
```

Bu betik:
- Önce `build` komutunu çalıştırarak üretim sürümünü oluşturur
- Ardından oluşturulan üretim sürümünü yerel bir sunucuda başlatır
- Üretim ortamına dağıtmadan önce uygulamanızın son halini test etmenizi sağlar

Bu preview modu, geliştirme sunucusundan farklıdır çünkü gerçek üretim build'ini kullanır ve böylece gerçek kullanıcıların göreceği deneyimi daha doğru şekilde simüle eder.
