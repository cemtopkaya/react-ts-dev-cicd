# SonarQube Entegrasyonu

Bu belge, projede SonarQube kod kalite analizi entegrasyonunu ve yapılandırmasını açıklar.

## 1. SonarQube Nedir?

SonarQube, kod kalitesini analiz etmek ve iyileştirmek için kullanılan bir araçtır. Bu projede:

- Kod kalitesini artırmak
- Potansiyel hataları ve güvenlik açıklarını tespit etmek
- Kodun bakımını kolaylaştırmak
- Test kapsamını izlemek (Test Coverage)

amacıyla kullanılmaktadır.

```mermaid
sequenceDiagram
    participant Developer
    participant SonarScanner
    participant SonarQube
    
    Developer->>SonarScanner: npx sonarqube-scanner
    SonarScanner->>SonarQube: Aktif kuralları çek
    SonarQube-->>SonarScanner: JavaScript kuralları (245 rule)
    SonarScanner->>Proje: Kod analizi yap (AST)
    SonarScanner->>Jest: coverage/lcov.info oku
    SonarScanner->>SonarQube: Analiz sonuçlarını gönder
    SonarQube-->>Developer: Dashboard'da rapor göster
```


## 2. Ortam Değişkenleri Yapılandırması

Ortam değişkenleri, uygulamaların farklı ortamlarda (geliştirme, test, üretim) farklı davranmasını sağlayan yapılandırma değerleridir. .env dosyaları bu değişkenleri saklamak için kullanılır.

`.env.example` adlı bir örnek dosya oluşturarak gerekli değişkenleri (değerleri olmadan) belgelendirmek için kullanabilirsiniz.

`.env.local.test` veya `.env.test.local` yerel test ortamı için özel değerleri saklar. Aynı mantıkta `.env.production`, `.env.local.test` veya `.env.test.local` gibi dosyalar oluşturulabilir.

Üretim ortamında mümkünse ortam değişkenlerini doğrudan sunucu/hizmet yapılandırmasında tanımlayın.

### Yükleme Sırası
Çoğu araç (örn. dotenv, Next.js, Create React App) şu sırayla dosyaları yükler:

- `.env`
- `.env.local` (varsa, `.env`'deki değerleri override eder)

Değişkenler genellikle şu sırayla yüklenir ve üst sıradakiler alt sıradakileri geçersiz kılar:

- `.env` (temel varsayılanlar)
- `.env.{ortam}` (örn: .env.development)
- `.env.local` (tüm ortamlar için yerel geçersiz kılmalar)
- `.env.{ortam}.local` (belirli bir ortam için yerel geçersiz kılmalar)

> Not: Test ortamında çoğu framework .env.local dosyasını yüklemez. Bunun nedeni testlerin geliştiriciden bağımsız tutarlı olmasını sağlamaktır.

#### Framework'lere Göre Farklılıklar

**React (Create React App):** `.env`, `.env.local`, `.env.development`, `.env.development.local` sırasıyla yükler. Test ortamında `.env.local` yüklenmez.

**Next.js:** Yukarıdaki sıraya ek olarak `.env.production` ve `.env.production.local` dosyalarını destekler.

**Node.js (dotenv):** Varsayılan olarak sadece `.env` dosyasını yükler, diğerleri için özel yapılandırma gerekir.

Projede SonarQube için üç farklı ortam dosyası kullanılır:

`.env` (Genel Ayarlar)
- Tüm ortamlar için ortak ayarları içerir
- Hassas olmayan yapılandırmaları içerir
- Git ile paylaşılır
- İçerik:
  ```properties
  SONAR_SCANNER_OPTS=-Xmx2G  # SonarScanner için bellek ayarı
  ```

`.env.local` (Kullanıcıya Özel Ayarlar)
- Geliştiriciye özel token ve yerel değerleri içerir
- Gizli anahtarlar, kişisel tokenlar burada saklanır
- Git'e gönderilmemeli (.gitignore'a eklenmelidir)
- İçerik örneği:
  ```properties
  SONAR_TOKEN=kişisel_token_değeriniz
  SONAR_HOST_URL=http://host.docker.internal:34000
  ````

`.env.cicd` (CI/CD Ayarları)
- CI/CD pipeline'larında kullanılacak değişkenleri içerir
- Git'e gönderilmemeli
- İçerik örneği:
  ```properties
  SONAR_TOKEN=ci_cd_token_değeri
  ```


## 3. SonarQube Yapılandırma Dosyaları

Projede iki farklı SonarQube yapılandırma dosyası kullanılır:

`sonar-local.properties`
Yerel geliştirme ortamında kod analizleri için kullanılır:

```properties
sonar.sources=src                  # Analiz edilecek kaynak kod dizini
sonar.sourceEncoding=UTF-8         # Kaynak kodun karakter kodlaması
sonar.typescript.lcov.reportPaths=coverage/lcov.info  # Test kapsam raporu
sonar.exclusions=**/*.spec.ts,**/*.test.ts,**/*.stories.tsx  # Analiz dışı dosyalar
```

`sonar-cicd.properties` 
CI/CD süreçlerinde otomatik kod analizleri için kullanılır. Yerel yapılandırmaya benzer ayarlar içerir.


## 4. SonarQube Token Oluşturma
SonarQube analizleri çalıştırmak için bir kimlik doğrulama token'ı gerekir:

1. SonarQube arayüzünde "My Account" > "Security" bölümüne gidin
2. "Generate Tokens" bölümünden yeni bir token oluşturun
3. Oluşturduğunuz token'ı .env.local dosyanıza ekleyin:
  ```properties
  SONAR_TOKEN=oluşturduğunuz_token
  ```
4. Önemli: Token'ınızı asla paylaşmayın veya git'e göndermeyin

## 5. SonarQube Analizi Çalıştırma
Projede SonarQube analizini çalıştırmak için NPM script'leri hazırlanmıştır:

Yerel Analiz

```sh
npm run sonar:local
```
Bu komut:

- `.env.local` ve `.env` dosyalarındaki değişkenleri yükler
- `sonar-local.properties` dosyasındaki yapılandırmayı kullanır
- Debug modunda çalışır

CI/CD Analizi

```sh
npm run sonar:cicd
```

Bu komut:

- `.env.cicd` ve `.env` dosyalarındaki değişkenleri yükler
- `sonar-cicd.properties` dosyasındaki yapılandırmayı kullanır

## 6. SonarQube Yapılandırma Parametreleri

| Parametre | Açıklama |
| --- | --- |
| `sonar.host.url` | SonarQube sunucusunun adresi |
| `sonar.projectKey` | SonarQube'da projeyi tanımlayan benzersiz anahtar |
| `sonar.projectName` | SonarQube'da görünen proje adı |
| `sonar.sources` | Analiz edilecek kaynak kod dizini |
| `sonar.sourceEncoding` | Kaynak kod karakter kodlaması |
| `sonar.exclusions` | Analiz edilmeyecek dosyalar (glob desenleri) |
| `sonar.typescript.lcov.reportPaths` | Test kapsam raporlarının yolu |
| `sonar.token` | Kimlik doğrulama için kullanılan token (dosyalarda değil, ortam değişkenlerinde saklanır) |


### sonar.host.url

SonarQube sunucusunun URL'sidir. Projenizin analiz edilmesi işini hangi Sonarqube sunucusunda yapacağını belirtir.

CI/CD pipeline'ınızda SonarQube Jenkins eklentisi, sunucu URL'sini `SONAR_HOST_URL` ortam değişkeniniyle sonar-scanner'ın çalışacağı terminale enjekte eder.
Eğer bir CI/CD pipeline'ında kullanıyorsanız, bu satırı yorum satırı haline getirin.

```properties
sonar.host.url=http://host.docker.internal:34000
```


## 7. DevContainer Entegrasyonu

Proje, VS Code DevContainer içinde SonarLint entegrasyonu sağlar:

```json
"sonarlint.ls.javaHome": "/usr/lib/jvm/java-17-openjdk-arm64",
"sonarlint.pathToNodeExecutable": "/usr/local/bin/node",
"sonarlint.connectedMode.connections.sonarqube": [
  {
    "serverUrl": "http://sonar:9000",
    "connectionId": "sonar_container"
  }
]
```

Bu yapılandırma sayesinde:

- Kod yazarken SonarQube kuralları gerçek zamanlı olarak kontrol edilir
- SonarQube sunucusuna bağlanarak proje kuralları kullanılır
- Potansiyel hatalar kodlama anında tespit edilir

## 8. Güvenlik En İyi Uygulamaları
- **Token Güvenliği:** SonarQube token'ınızı daima .env.local dosyasında saklayın, asla yapılandırma dosyalarına yazmayın
- **Git Dışında Tutma:** .env.local ve .env.cicd dosyalarını .gitignore listesine ekleyin
- **Ortam Hiyerarşisi:** Değişkenler şu sırayla yüklenir ve üst sıradakiler alt sıradakileri override eder:
1. `.env.local` (kişisel)
1. `.env.cicd` (CI/CD ortamında)
1. `.env` (temel)

## 9. Sorun Giderme

- **Token Hatası:** "You're not authorized to analyze this project..." mesajı alırsanız, token'ınızın doğru ve geçerli olduğunu kontrol edin
- **Bellek Sorunu:** SonarScanner bellek hatası verirse, .env dosyasındaki SONAR_SCANNER_OPTS değerini artırın
- **Bağlantı Hatası:** SonarQube sunucusuna bağlanılamıyorsa, SONAR_HOST_URL değerinin doğru olduğunu kontrol edin

Daha fazla bilgi için [SonarQube resmi dokümantasyonuna](https://docs.sonarsource.com/) başvurabilirsiniz.
-