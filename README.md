# İntegral Bilişim — Kurumsal Web Sitesi

integralbilisim.com'un yenilenmiş hâli. TanStack Start + React 19 + Tailwind v4.
Tasarım dili `WEBSITE_DESIGN_TEMPLATE.md` (NeuroPlanck şablonu) esas alınarak kuruldu.

## Çalıştırma

```bash
npm install
npm run dev
```

Site `http://localhost:3000` adresinde açılır.

## Yapı

| Yol | İçerik |
|---|---|
| `src/lib/services.ts` | Hizmet kataloğu + accent renk map'i (sistemin kalbi) |
| `src/lib/company.ts` | Şirket bilgileri, telefon, adres, misyon/vizyon |
| `src/lib/references.ts` | `FEATURED_WORK` (hero vitrini) + `REFERENCES` (153 logo) |
| `src/lib/media.ts` | `mediaUrl()` — tüm asset URL'leri buradan geçer |
| `src/components/home/` | Ana sayfa bölümleri |
| `src/routes/` | Sayfalar (dosya bazlı yönlendirme) |

## Medya

Görsel ve videolar Bunny CDN'de (`https://integralbilisim.b-cdn.net`).
Hiçbir asset URL'i hardcode edilmez; her `<img src>` / `<video src>` `mediaUrl()`
fonksiyonundan geçer.

### Logo

Bunny'deki `logo.jpg`'den üretilmiş üç şeffaf sürüm `public/` altında:

| Dosya | Nerede | Görünüm |
|---|---|---|
| `logo-white.png` | Şeffaf başlık (ana sayfa üstü) | Tamamı beyaz; kare dolu beyaz, süsleme oyma |
| `logo-light.png` | Solid beyaz başlık, mobil menü | Özgün renkli logo |
| `logo-dark.png` | Footer | Pembe kare + beyaz yazı |

Logo değişirse üç sürüm birlikte yenilenmelidir.

### Müşteri deneyimi videoları (hero altındaki duvar)

Dört dikey video (1080x1920) Bunny'de `/kalite/videos/1-4.mp4` altında;
tanımlar `src/lib/videos.ts` içinde. Posterler videonun kendi karesinden
üretilip `public/videolar/` altına konmuştur.

**Performans notu:** dört dosya toplam ~42 MB. Bu yüzden kaynak (`src`)
yalnızca kart ekrana girdiğinde bağlanır; hero'dayken tek bayt indirilmez.
Bölüm görünür olunca dördü birden sessiz oynar, ekrandan çıkınca duraklar.

Ses davranışı: aynı anda yalnızca bir videonun sesi açılabilir, ikincisini
açmak birincisini susturur. Ekran dışına çıkan video kendiliğinden susar.
"Hareketi azalt" tercihinde otomatik oynatma yapılmaz.

Video eklemek için `TESTIMONIAL_VIDEOS` dizisine kayıt ekleyin ve posteri
`public/videolar/` altına koyun.

### Hizmet kartı görselleri

Bunny'de `/images/a.jpeg` … `/images/m.jpeg` (13 adet). Eşleştirme
`src/lib/services.ts` içindeki her hizmetin `image` alanında; sıra
SERVICES dizisiyle birebir (a = Web Tasarım … m = Broşür & Katalog) ve
görsellerin içeriği tek tek görülerek doğrulanmıştır.

Aynı görsel hizmet detay sayfasının hero'sunda da arka plan olarak kullanılır.

Kart üzerinde metin okunabilirliği için scrim `from-black/95 via-black/75`
seviyesindedir. Yeni görsel eklerken alt üçte birin sade olmasına dikkat edin.

### Bölüm arka planları

Bunny'de `/covers/1.jpeg` … `/covers/5.jpeg`. **Dosya numarası bölüm sırasıyla
aynı değildir**, eşleştirme içeriğe göre yapılmıştır:

| Dosya | İçerik | Bölüm |
|---|---|---|
| `covers/1.jpeg` | Gece ofis, İstanbul manzarası | Ana sayfa "Fikirden yayına, dört adımda" |
| `covers/2.jpeg` | Loş ışıkta klavye | Hakkımızda hero |
| `covers/3.jpeg` | Soyut koyu gradyan | Ana sayfa CTA |
| `covers/4.jpeg` | Bulanık marka renkleri duvarı | Referanslar hero |
| `covers/5.jpeg` | İstanbul havadan gece | İletişim hero |

Hepsi şablon 5.5 sandviçiyle kullanılır: görsel `opacity-40` + üzerine
`#0a0a12` gradyanı. Metin kontrastı bu katman sayesinde korunur.

### Referans logoları

153 gerçek müşteri logosu `public/referanslar/` altında duruyor (eski siteden
alındı, ~1.4 MB). Bunny'ye taşındığında `references.ts` içindeki yollar
`mediaUrl()` üzerinden geçirilmelidir.

### Hero vitrini (kanıt odaklı)

Hero'da mesaj sabittir, dönen şey yapılan işlerdir. `FEATURED_WORK` içindeki 6
referans, Bunny'deki tanıtım **videolarıyla** gösterilir. Her kart o markanın
accent rengini sayfaya yayar ve tıklanınca canlı siteyi yeni sekmede açar.

Videolar `/hero/*.mp4` altında, 1920x1080 ve 5-10 saniye. Posterler videonun
kendi karesinden üretilip `public/isler/` altına konmuştur.

**Performans notu:** altı dosya toplam ~83 MB. Bu yüzden video kaynağı yalnızca
kart öne geldiğinde bağlanır (`preload="none"` + koşullu `src`); açılışta tek
bir video iner. Video bitince sıradaki işe geçilir; "hareketi azalt" tercihinde
oynatma yapılmaz, kartlar sabit sürede döner.

Vitrine iş eklemek için `FEATURED_WORK` dizisine kayıt ekleyin: video yolu,
poster, canlı site adresi, sektör ve accent rengi.

### Referans logoları

153 gerçek müşteri logosu `public/referanslar/` altında duruyor (eski siteden
alındı, ~1.4 MB). Bunny'ye taşındığında `references.ts` içindeki yollar
`mediaUrl()` üzerinden geçirilmelidir.

### Hero vitrini (kanıt odaklı)

Hero'da mesaj sabittir, dönen şey yapılan işlerdir. `FEATURED_WORK` içindeki 6
referans sitenin **gerçek ekran görüntüsü** gösterilir; her kart o markanın
accent rengini sayfaya yayar ve tıklanınca canlı siteyi yeni sekmede açar.

Görüntüler `public/isler/` altında ve Playwright ile çekilmiştir. Siteler
değiştikçe eskirler; yenilemek için:

```bash
node scripts/capture-work-screenshots.mjs
```

Ardından boyutu küçültün: `sips -Z 1400 public/isler/*.jpg`

Vitrine iş eklemek/çıkarmak için tek yer: `src/lib/references.ts` içindeki
`FEATURED_WORK`. Yeni bir site eklerken betiğe de aynı satırı ekleyin.

#### Canlı önizleme

Kartın altındaki "Canlı önizleme" düğmesi, aktif işi iframe içinde **yayından**
yükler ve otomatik dönüşü duraklatır. Varsayılan kapalıdır; açılış hızı (LCP)
ekran görüntüsüyle korunur.

Her site gömülemez: `X-Frame-Options` / CSP `frame-ancestors` gönderen siteleri
tarayıcı engeller. Bu yüzden `FEATURED_WORK` içinde ölçülmüş bir `embeddable`
alanı var. `false` olanlarda iframe hiç oluşturulmaz, ekran görüntüsü kalır ve
kullanıcıya nedeni yazılır.

Yeni bir site eklerken gömülebilirliğini şöyle ölçün:

```bash
curl -sSIL https://ORNEK.com | grep -iE "x-frame-options|content-security-policy"
```

Ölçüm sonucuna göre `embeddable` alanını doldurun. Ölçmeden `true` yazmayın;
engelli site boş çerçeve olarak görünür.

Güvenlik: iframe `sandbox="allow-scripts allow-same-origin"` ile açılır (gömülen
site sayfamızı yönlendiremez, pencere açamaz) ve `pointer-events: none` taşır
(kaydırma iframe'e takılmaz, kart link olarak çalışmayı sürdürür).

Medya geldikçe doldurulacak diğer alanlar:

- `src/lib/services.ts` → her hizmetin `image` alanı (kart arka planları)

## İletişim formu

`src/lib/contact.functions.ts` Resend API ile e-posta gönderir. `RESEND_API_KEY`
tanımlı değilse form gönderilemez ve kullanıcıya WhatsApp/telefon alternatifi
gösterilir. Değişkenler için `.env.example` dosyasına bakın.

## İçerik kaynağı

Tüm hizmet açıklamaları, misyon/vizyon, değerler ve iletişim bilgileri mevcut
integralbilisim.com sitesinden alınmıştır. Uydurma istatistik veya iddia yoktur.
