# Prompt: İntegral Bilişim — yönetim paneli

> Bu metni **yeni, boş bir klasörde** (öneri: `~/Desktop/siteler/integralbilisimadmin`)
> kod ajanına ver. Ajan sıfır bağlamla başlar; bu yüzden sitenin bugünkü durumu,
> hazır altyapı ve referans panel aşağıda anlatılıyor. Bölüm 0 ve 8'i atlama.

---

## 0. İş ne

`~/Desktop/aurageoadmin` (İntegral GEO iç paneli) çalışan, canlıda bir panel.
**Aynı kalıbı İntegral Bilişim için kur**: aynı yetki felsefesi, aynı "hata yutulmaz"
disiplini, aynı ekran iskeleti — ama **bu projenin gerçek durumuna göre**: veritabanı
ve yetki altyapısı **zaten kuruldu**, hosting **DirectAdmin** (Vercel yok).

Hedef: bir ajansın sitesini ve gelen işini tek yerden yönetmek.
Sırayla: **gelen talepler (lead) → blog ve site içeriği → ölçüm.**

İlk iş **kodlamak değil**: Bölüm 1 ve 2'yi oku, Bölüm 8'deki soruları kullanıcıya sor,
sonra aşamalı bir plan öner ve onay al. Aşama 1 bitmeden Aşama 2'ye geçme.

## 1. Referans: önce bunları oku

**Bu projede (`~/Desktop/siteler/integralbilisim`) — sırayla:**

1. `docs/admin-altyapi.md` — **panelin temeli.** Yetki modeli, hazır yardımcılar,
   görsel yükleme sözleşmesi, mimari kararlar. Burası bu dosyanın tamamlayıcısı.
2. `supabase/migrations/*.sql` — şema ve RLS (özellikle `…_initial_schema.sql`,
   `…_admin_roles.sql`).
3. `supabase/snippets/yonetici-ekle.sql` — ilk yönetici nasıl eklenir.
4. `src/lib/leads.server.ts`, `contact.functions.ts`, `quote.functions.ts`,
   `audit.functions.ts`, `attribution.ts` — lead hattı ve atıf.
5. `KURULUM.md` mantığı için `scripts/pack-directadmin.mjs` — DirectAdmin paketleme.

**Referans panel (`~/Desktop/aurageoadmin`) — kalıp için, kopyalamak için değil:**

1. `CLAUDE.md` — yetki modeli, RLS dersleri, "hata yutulmaz" kuralı. **Zor yoldan
   öğrenilmiş dersler burada; geçerli olanları bu projeye taşı.**
2. `docs/prompt-admin-panel.md`, `README.md`.
3. `supabase/migrations/` içindeki rol ve CRM migration'ları, `src/lib/nav.ts`,
   `src/lib/access.ts`, `(panel)/gelen-kutusu/`, `(panel)/blog/` — iskelet ekranlar.

**Alma:** `.env*` (gerçek anahtarlar), `.git`, `node_modules`, `.next`, `.vercel`,
iyzico / RevenueCat / fiyat / GEO'ya özgü her şey, `--aura-*` adları. Kalanı
**anlayarak uyarla**, körlemesine kopyalama. Referans **Next.js + Vercel**;
bu projenin hosting'i farklı (aşağıda) — yığın kararı Bölüm 8'de.

## 2. Hedef sistem: bugünkü hâl

**Site:** `~/Desktop/siteler/integralbilisim` — **git deposu:
`https://github.com/yysalih/integralbilisim.git`** (site değişiklikleri hep oraya
commit + push; ev dizinindeki başka bir git deposuna **asla**). Canlı:
`https://integralbilisim.com`. Yığın: TanStack Start 1.168 (React 19, Vite,
Tailwind v4, Nitro `node-server`), SSR. Yayın: **DirectAdmin → Setup Node.js App**
(CloudLinux Passenger, Node 22, başlangıç dosyası `app.js`), `npm run pack:directadmin`
ile zip. Ortam değişkenleri yalnızca DirectAdmin panelinden, **çalışma anında**;
`VITE_*` olanlar derlemeye gömülü. (Canlıya alma sürüyor olabilir — kullanıcıya sor.)

**Veritabanı: Supabase projesi `integralbilisim` (ref `hlpnbchodsvswmmknteq`,
bölge `eu-central-1` / Frankfurt). Yeni proje AÇMA, bunu kullan.**

| Tablo | Durum |
|---|---|
| `public.posts` | slug, title, category, accent, excerpt, image, `body jsonb` (`[{heading?, text}]`), reading_minutes, published_at, is_published, created_at, updated_at. 26 yayımlı yazı. |
| `public.leads` | id, created_at, `source` (`contact` / `quote_wizard` / `site_audit` — CHECK kısıtı), name, email, phone, company, website, `payload jsonb`, lead_score (0–100), `status` (`new` → `contacted` → `quoted` → `won` / `lost`), consent_kvkk, consent_marketing, notes |
| `public.admin_users` | user_id, email. **Yönetici = bu listedekiler.** |

**Yetki (hazır, uygulamadan önce `supabase migration list` ile uzakta uygulandığını
doğrula):** `public.is_admin()` + RLS. Yönetici `posts`'u tamamen yönetir; `leads`'te
okur, **yalnızca `status` ve `notes` günceller** (sütun yetkisi), siler (KVKK), **ekleyemez**.
`anon` yalnızca yayımlı yazıyı okur. `authenticated` olmak yetki değildir. Test edildi.

**Lead hattı — bugün:** üç form (iletişim, teklif sihirbazı, site analizi) sunucu
fonksiyonuyla önce `saveLead` (Supabase, **`service_role` ile** — bkz. Bölüm 3), sonra
nodemailer/SMTP ile e-posta. `payload` kaynağa göre:
- `contact`: `subject`, `message`
- `quote_wizard`: `services[]`, `summary[]`, `urgency`, `budget`, `estimateMin/Max`, `priceShown`
- `site_audit`: `score`, `criticalCount` (+ `website` sütununda analiz edilen adres)

Her `payload.attribution` içinde: `channel` (`direct` / `organic_search` /
`paid_search` / `paid_social` / `social` / `referral` / `email` / `other`),
`referrer_host`, `utm_*`, `click_id` (yalnızca türü), `landing_page`, `form_page`,
`first_seen`. Kampanya/kaynak kırılımı **bundan** yapılır; ayrı olay toplama gerekmez.

**Ölçüm — bugün:** GA4 (`GA4_ID`, çalışma anında) + çerez onayı + Consent Mode v2
(onaysız Google'a istek yok). `track()` olayları: `generate_lead`, `form_error`,
`phone_click`, `whatsapp_click`, `email_click`, `cta_quote_click`, `cta_audit_click`,
`quote_start`, `quote_step`, `audit_start`, `audit_complete`, `audit_error`,
`hero_tool_tab`. Birinci taraf olay toplama **yok**.

**İçerik — nerede:**

| Yer | İçerik |
|---|---|
| Supabase `posts` | Blog (kaynak). `src/lib/blog.ts` yalnızca **hata anındaki yedek** (okuma yolu: hata varsa koda düş, boşsa boş) |
| `src/lib/services.ts`, `service-content.ts` | Hizmetler + 14 hizmetin derin içeriği (bölümler, süreç, SSS, kaynaklar) |
| `src/lib/faq.ts` | Ana sayfa SSS |
| `src/lib/references.ts` | 153 marka referansı; `FEATURED_WORK` |
| `src/lib/company.ts` | Telefon, WhatsApp, adres, e-posta |
| `src/lib/pricing.config.ts` | Teklif sihirbazı fiyatları. **Kullanıcı kararı: her şey seçiliyken tavan 500.000 TL** (`npx tsx scripts/pricing-ceiling.ts` ile doğrulanır). Sınır aşılmamalı. |
| `.htaccess` kuralları (`htaccess-kurallari.txt`, pack betiği üretir) | Eski WordPress adresleri için 301'ler. **Apache'de; panelden değiştirilemez** — Bölüm 8 |

**SEO (hazır):** `/sitemap.xml` ve `/llms.txt` **canlı rotalar** (Supabase'ten, 5 dk
önbellek; hata/yoksa koddaki 26 yazıya düşer). Statik `public/sitemap.xml` yok — aynı
adlı statik dosya rotayı **gölgeler**, tekrar ekleme. JSON-LD ve canonical kodda.

**Medya:** Bunny CDN `https://integralbilisim.b-cdn.net`. `mediaUrl()` yalnızca
`/blog/`, `/app/`, `/isler/`, `/referanslar/`, `/videolar/`, `/logo-` yollarını sitenin
kendi sunucusuna, gerisini CDN'e verir. Panelden yüklenen görsel `/uploads/...` yoluna
gider (**`posts.image`'a `path` yazılır, `url` değil**).

**Bilinen borçlar (Bölüm 3 ve 4'te ele al):**
- Site, lead yazmak için **`SUPABASE_SERVICE_ROLE_KEY`** kullanıyor. Hedef: `service_role`
  yok; yalnızca insert yapabilen kısıtlı bir yol (örn. `security definer` RPC + anahtar).
- Sonuç ekranı yalnızca **e-postanın** gidip gitmediğine bakıyor; Supabase'e yazılmış ama
  e-posta çökmüşse kullanıcı hata görüyor. Üç bağımsız kanaldan (e-posta, Supabase, yedek
  dosya) herhangi biri tutmuşsa başarı gösterilmeli.
- İletişim formunda honeypot yok (teklif ve analiz formlarında var).
- Gizlilik politikasında **kesin saklama süresi ve yurt dışı aktarım bilgisi yok** (Bölüm 7/8).

## 3. Mimari

- **Panel: `https://admin.integralbilisim.com`** (DirectAdmin subdomain), `noindex`,
  `robots.txt`'te `Disallow: /`, siteden bağlantı verilmez. Supabase **"Allow new users to
  sign up" kapalı**; Site URL = panel adresi; Redirect URLs'e `https://admin.integralbilisim.com/**`.
- **Aynı Supabase projesi.** Panel `posts` ve `leads`'i **kullanıcının kendi oturumuyla**
  (anon anahtar + RLS) okuyup yazar. Anon anahtar ve URL herkese açık olacak şekilde
  tasarlanmıştır. **`service_role` panele girmez, tarayıcıya inmez.**
- **Sunucu tarafı ihtiyaç:** görsel yükleme zaten ana sitede hazır
  (`POST https://integralbilisim.com/api/admin/upload`, Bearer jeton, CORS izinli —
  sözleşme `docs/admin-altyapi.md`'de). Başka sunucu tarafı ihtiyaç doğarsa ana sitede
  aynı desenle (`requireAdmin` + CORS) aç; panelde `service_role` ile yapma.
- **Migration'lar tek yerde:** `integralbilisim/supabase/migrations/` (proje oraya bağlı,
  `supabase db push` oradan). Panel deposunda şema **kopyalama**; yeni migration'ı oraya,
  mevcut adlandırmayla (`YYYYMMDDHHMMSS_ad.sql`) ekle, **var olan migration'ı düzenleme**.
- **DirectAdmin tuzağı:** subdomain klasörü varsayılan olarak ana sitenin `public_html/admin`
  içinde açılır; üst `.htaccess` (ana sitenin Passenger bloğu ve yönlendirmeleri) altına
  **sızabilir**. Subdomain'i açınca ana sitenin sayfası görünüyor mu **mutlaka test et**;
  gerekirse `admin/.htaccess` içinde ana uygulamayı devre dışı bırak. Statik SPA ise
  Apache'de tüm yolları `index.html`'e yönlendiren kural gerekir.
- **Dayanıklılık (pazarlık konusu değil):** Supabase kapalıyken site ve formlar çalışmalı;
  talep kaybolmamalı. Hedef: e-posta + Supabase + sunucuda yedek dosya, kullanıcıya
  hata yalnızca **hepsi** başarısızsa.
- **Hata yutulmaz:** yetki/şema/ağ hatası "yetkin yok" diye gizlenmez; gerçek sebep ekranda.

## 4. Kapsam — aşamalar

### Aşama 1 — Giriş ve talepler (en değerli, siteye en az dokunan)
- **Giriş:** Supabase Auth (e-posta + parola). Oturum açan ama `is_admin()` olmayan
  hesap hiçbir şey görmez ve nedeni açıkça yazılır. Parola sıfırlama.
- **Talepler (gelen kutusu):** liste; filtre (kaynak, durum, kanal/kampanya, tarih, skor);
  detay: tüm alanlar, **kaynağa göre okunur `payload`** (sihirbaz özeti, analiz skoru,
  mesaj), atıf (kanal, kampanya, anahtar kelime, giriş sayfası), **KVKK ve ticari ileti
  rızası satırda görünür**; durum hattı (**gerçek süreci kullanıcıya sor** — mevcut beş
  durum yeterli mi?); not (tek `notes` sütunu mu, geçmişli `lead_notes` tablosu mu?);
  silme (KVKK) ve dışa aktarma (CSV).
- **Panel ana sayfası:** yalnızca gerçek veriden — bekleyen talep sayısı, kaynağa/kanala
  göre dağılım, son talepler. **Boşsa boş göster, uydurma yok.**
- **Ekip:** mevcut `admin_users` yeter mi, yoksa aurageo'daki gibi rol/yetenek modeli
  (`staff_roles`, `can()`) mı? Tek-iki kişi için gereksiz karmaşıklıksa **basit tut**,
  kararı kullanıcıya bırak. Son yönetici kaldırılamaz.
- **Site tarafı (küçük, ayrı commit'ler):** Bölüm 2'deki borçlar — `service_role`'ü
  kaldırma, üç kanallı dayanıklılık, honeypot.
- Müşteri/CRM, proje ve ödeme takibi **bu aşamada yok**; gerekiyorsa kullanıcı söyler.

### Aşama 2 — İçerik yönetimi
Sıra: **Blog** (en basit; tablo ve RLS hazır, görsel yükleme hazır) → SSS → Referanslar
(logo yükleme) → Hizmetler ve derin içerik → Şirket bilgileri → **301 yönlendirmeleri**
→ (isteğe bağlı, dikkatli) **teklif sihirbazı fiyatları**.
- **Blog editörü:** taslak/yayında, slug (benzersiz, değişince eski adrese 301 düşün),
  kategori, kapak görseli (`/uploads/...` yolu), özet, gövde blokları, okuma süresi,
  önizleme. Yayına alınan yazı `/sitemap.xml`'e **kendiliğinden** girer (hazır).
- **Diğer içerik** şu an **kodda**: veritabanına taşınacaksa tablo, RLS, **mevcut içeriğin
  seed'i** (panel boş açılmasın) ve sitede **SSR okuma + hata anında koda düşme**
  (blogda olduğu gibi, istemcide fetch yok) birlikte yapılır. Her içeriği taşımak zorunda
  değilsin: değişme sıklığına göre kullanıcıyla önceliklendir.
- **Fiyat yönetimi** yapılacaksa 500.000 TL tavanı panelde de zorunlu kıl; sınır aşılırsa
  kaydetme. Soru olarak sor, varsayma.
- **301'ler Apache'de** olduğu için panelden anında yönetilemez. Seçenekler: tablo + Node
  tarafında 404 öncesi eşleştirme, ya da yalnızca "yeni 301 ekle" isteklerini listeleyip
  `.htaccess`'i elle güncelleme. Kararı kullanıcıyla ver.

### Aşama 3 — Ölçüm (isteğe bağlı, karar kullanıcıda)
GA4 zaten arayüz sunuyor ve lead'ler kendi atıf verisini taşıyor. **Birinci taraf olay
toplama gerçekten gerekli mi** diye sor; çoğu durumda değildir. Yapılacaksa: onaysız tek
istek yok, ham IP/UA saklanmaz, saklama süresi tanımlı ve otomatik temizlenir, bot ayıklama.

## 5. Tasarım

Panel temayı **siteden** alır: `~/Desktop/siteler/integralbilisim/src/styles.css`.
Vurgu `oklch(0.58 0.17 10)` (≈ `#C9436E`), zemin `oklch(0.99 0.005 90)`, yazı
`oklch(0.145 0.04 270)`, kart beyaz, soluk `oklch(0.95 0.01 250)`, kenarlık
`oklch(0.9 0.01 250)`, yarıçap `0.625rem`; yazı tipi **Inter**; sitedeki koyu bölüm zemini
`#0a0a12`. Logo: `https://integralbilisim.com/logo-dark.png` (açık zeminde),
`logo-white.png` (koyuda). Renkler **token** olarak tanımlanır, bileşene hex yazılmaz.
Tek tema (açık). Arayüz **tamamen Türkçe**, `lang="tr"`. Panel bir iç araç: sade, hızlı,
okunur; süs yok.

## 6. Kurallar

**aurageo'dan taşı** (gerekçeleri `CLAUDE.md`'de):
- Politikalar **rol değil yetenek/kimlik** sorar; arayüzde gizlemek güvenlik değildir,
  veriyi **RLS** korur.
- `security definer` fonksiyonda **`revoke … from public, anon, authenticated`** yaz, sonra
  istenen rolü açıkça `grant` et (`from public` tek başına yetmez). Mevcut `is_admin()` böyle.
- **Hata yutulmaz.** Gün sınırı İstanbul saati. Anahtarsız anonim yazma **42501** vermeli (test et).

**Bu projeye özgü:**
- **Uydurma veri yok.** Mevcut içerik sitenin kaynağından geldi; örnek müşteri/talep/
  istatistik uydurma. Panelde gösterilen her sayı gerçek veriden.
- **Anahtarlar:** `.env*` commit edilmez, çıktıya/sohbete yazılmaz. SMTP parolası, Supabase
  `service_role` ve Bunny anahtarı **yalnızca** DirectAdmin ortamında durur.
- **Sildiğin yerde dikkat:** içerikte silme yerine **yayından kaldırma** (taslağa alma)
  tercih et; yalnızca KVKK silme talebinde kalıcı sil.
- Site tarafı değişiklikleri **küçük, ayrı commit**; her biri `integralbilisim` deposuna.
- Sitenin `public/` altındaki statik dosyaları rotaları **gölgeler**; dinamikleştirirken
  statik dosyayı kaldır.

## 7. KVKK — bilmen gerekenler

- Talepler **kişisel veri**. Bugün Supabase'de, **Frankfurt'ta** (`eu-central-1`)
  saklanıyor — yani **yurt dışında**. Mevcut gizlilik politikası (`src/routes/gizlilik-politikasi.tsx`)
  bunu **söylemiyor** ve kesin bir saklama süresi vermiyor ("gerekli olduğu süre boyunca").
- Metnin güncellenmesi, hukuki dayanak (açık rıza / taahhütname vb.) ve saklama süresi
  **kullanıcı + danışmanının kararı**: sen hukuki metin uydurma. Kullanıcıya sor, kayda geç;
  gerekirse yalnızca olgusal bilgi cümlesini (hangi hizmet, hangi bölge) eklemeyi öner.
- Panelde: her talepte rıza (kvkk/pazarlama) görünür; **dışa aktarma ve silme** (unutulma
  hakkı) var; saklama süresi netleşince otomatik temizlik.
- Panele açıkça yazılmış bir "ne toplanıyor, ne kadar saklanıyor" özeti ekle.

## 8. Başlamadan kullanıcıya sor

1. **Yığın ve barındırma:** Hosting DirectAdmin (Vercel yok). Öneri: **statik bir SPA**
   (Vite + React + `supabase-js`; Node uygulaması gerekmez, subdomain klasörüne
   yüklenir; veriyi RLS korur, tek sunucu ihtiyacı olan görsel yükleme ana sitede hazır).
   Alternatif: sitenin yığınıyla (TanStack Start) ikinci bir Node uygulaması (aynı paketleme
   hattı). Referanstaki **Next.js + Vercel** burada uygun değil. Hangisi? Panel için ayrı
   GitHub deposu açılsın mı (öneri `yysalih/integralbilisimadmin`)?
2. **Altyapı hazır mı:** yetki migration'ı uzakta uygulandı mı, ilk yönetici eklendi mi,
   "Allow new users to sign up" kapatıldı mı, subdomain ve SSL açıldı mı, Bunny anahtarları
   (`BUNNY_STORAGE_ZONE/KEY`) ana siteye girildi mi?
3. **KVKK:** Frankfurt'ta saklama ve gizlilik metni (Bölüm 7). Saklama süresi? Danışman
   onayı var mı?
4. **Kullanıcılar ve roller:** panelde kimler olacak? Tek yönetici mi, birden fazla ve farklı
   yetkiyle mi?
5. **Satış süreci:** talep → ? → kazanıldı. Mevcut durumlar (yeni, arandı, teklif verildi,
   kazanıldı, kaybedildi) gerçeği yansıtıyor mu? Teklif/proje/ödeme takibi gerekiyor mu,
   yoksa yalnızca durum ve not mu? "Müşteri" kavramı lazım mı?
6. **Atama:** talepler kişilere atanacak mı?
7. **Geçmiş talepler:** yayına alınmadan önce gelen talepler yalnızca e-postadaydı; içe
   aktarılacak bir şey var mı, yoksa sıfırdan mı?
8. **İçerik önceliği:** blog dışında hangisi panelden yönetilmeli (SSS, referanslar,
   hizmetler, fiyatlar, şirket bilgileri)? Hangisi sık değişiyor?
9. **301'ler:** Apache'de kaldıkları için panelden yönetim sınırlı (Bölüm 4). Yeterli mi?
10. **Aşama 3** (birinci taraf ölçüm) gerekli mi, yoksa GA4 + lead atfı yeterli mi?
11. **Aşama sırası** onayı.

## 9. Bitince doğrula

- Anahtarsız anonim yazma (`posts` ve `leads`) **42501** ile reddediliyor; anon `leads`
  okuyamıyor, taslak yazıyı göremiyor.
- Giriş yapmış **yönetici olmayan** hesap panelde hiçbir veri görmüyor ve nedeni yazıyor.
- Yönetici `leads`'te yalnızca `status` ve `notes` değiştirebiliyor; e-posta/rıza/atıf
  değiştirme **reddediliyor**.
- **Supabase kapatılınca** site formu çalışıyor, talep kaybolmuyor. E-posta çökünce talep
  veritabanında.
- Honeypot dolu talep veritabanına girmiyor. KVKK onaysız talep reddediliyor.
- Panelden yayımlanan yazı sitede (SSR HTML'inde) ve `sitemap.xml`'de görünüyor; yayından
  kaldırılan sitemap'ten çıkıyor ve sayfası 404 veriyor.
- Panel `noindex`, `robots.txt`'te dışarıda, signups kapalı, `admin.` adresi ana sitenin
  sayfasını **göstermiyor**.
- `service_role` panel paketinde ve tarayıcıda **yok** (derlenmiş dosyalarda ara).
- Panele "ne toplanıyor, ne kadar saklanıyor" özeti yazılmış.
