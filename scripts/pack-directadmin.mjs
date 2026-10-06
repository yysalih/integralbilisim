/**
 * DirectAdmin (Node.js app) için dağıtım paketi hazırlar.
 *
 * Kullanım:
 *   npm run pack:directadmin
 *   SITE_URL=https://baska-domain.com npm run pack:directadmin
 *
 * Çıktı: dist-directadmin/ ve integralbilisim-directadmin.zip
 *   uygulama/               -> Node uygulama dizinine yüklenir
 *     .output/              sunucu + statik dosyalar
 *     app.js                başlatma dosyası (Passenger)
 *     package.json
 *   htaccess-kurallari.txt  -> public_html/.htaccess dosyasına EKLENİR
 *   KURULUM.md
 */
import { execSync } from "node:child_process";
import { cpSync, mkdirSync, rmSync, writeFileSync, existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const ROOT = resolve(import.meta.dirname, "..");
const OUT = resolve(ROOT, "dist-directadmin");
const SITE_URL = (process.env.SITE_URL ?? "https://integralbilisim.com").replace(/\/$/, "");

console.log(`Derleniyor — kanonik adres: ${SITE_URL}`);
execSync("npm run build", {
  cwd: ROOT,
  stdio: "inherit",
  env: { ...process.env, VITE_SITE_URL: SITE_URL, NITRO_PRESET: "node-server" },
});

if (!existsSync(resolve(ROOT, ".output/server/index.mjs"))) {
  console.error("HATA: .output/server/index.mjs üretilmedi.");
  process.exit(1);
}

rmSync(OUT, { recursive: true, force: true });
const APP = resolve(OUT, "uygulama");
mkdirSync(APP, { recursive: true });
cpSync(resolve(ROOT, ".output"), resolve(APP, ".output"), { recursive: true });

// CloudLinux Node Selector / Passenger "başlatma dosyası" ister. CommonJS
// tutulur: eski Passenger sürümleri ESM başlatma dosyasını yükleyemez.
// Sunucu (ESM) dinamik içe aktarımla yüklenir; bu her iki sürümde de çalışır.
writeFileSync(
  resolve(APP, "app.js"),
  `/**
 * Başlatma dosyası. Sunucu PORT ortam değişkenini kullanır;
 * DirectAdmin / Passenger bu değeri kendisi atar.
 */
import("./.output/server/index.mjs").catch((err) => {
  console.error("Sunucu başlatılamadı:", err);
  process.exit(1);
});
`,
);

writeFileSync(
  resolve(APP, "package.json"),
  JSON.stringify(
    {
      name: "integralbilisim-web",
      private: true,
      engines: { node: ">=20" },
      scripts: { start: "node app.js" },
    },
    null,
    2,
  ) + "\n",
);

/**
 * Eski WordPress sitesindeki 620 şehir şablonu sayfası, tek tek kural yazmak
 * yerine son ekine göre ilgili hizmet sayfasına yönlendirilir.
 */
/** Taşınan yazılar: /eski-slug -> /blog/eski-slug */
const movedSlugs = [...readFileSync(resolve(ROOT, "src/lib/blog.ts"), "utf8").matchAll(/^    slug: "([^"]+)",$/gm)].map((m) => m[1]);
const BLOG_MOVED = movedSlugs.map((s) => `RewriteRule ^${s}/?$ /blog/${s} [R=301,L]`).join("\n");
const dropped = JSON.parse(readFileSync(resolve(ROOT, "scripts/blog-redirects.json"), "utf8"));
const BLOG_DROPPED = dropped.map((r) => `RewriteRule ^${r.from}/?$ ${r.to} [R=301,L]`).join("\n");
/** Eski sitenin sayfaları (hizmetler, sektör temaları, kurumsal sayfalar). */
const oldPages = JSON.parse(readFileSync(resolve(ROOT, "scripts/data/eski-sayfa-yonlendirmeleri.json"), "utf8"));
const OLD_PAGES = oldPages.map((r) => `RewriteRule ^${r.from}/?$ ${r.to} [R=301,L]`).join("\n");

const FAMILY_REDIRECTS = [
  ["(.+)-logo-tasarimi", "/hizmetler/logo-calismasi"],
  ["(.+)-hazir-web-sitesi", "/hizmetler/hazir-web-site"],
  ["(.+)-web-sitesi", "/hizmetler/web-tasarim"],
  ["(.+)-web-tasarimi?", "/hizmetler/web-tasarim"],
  // Hizmet kataloğunda ayrı bir SEO sayfası yok; arama niyetine en yakın
  // içerik ücretsiz site analizi aracı.
  ["(.+)-seo-hizmeti", "/araclar/site-analizi"],
  ["(.+)-(google-)?adwords-reklamlari", "/hizmetler/google-ads-reklami"],
  ["(.+)-(marka-)?tescili-hizmeti", "/hizmetler/marka-tescil"],
  ["(.+)-(sosyal-)?medya-danismanligi", "/hizmetler/sosyal-medya-yonetimi"],
];

writeFileSync(
  resolve(OUT, "htaccess-kurallari.txt"),
  `# İntegral Bilişim — Apache kuralları
# Bu satırlar public_html/.htaccess dosyasına EKLENİR, dosyanın yerine konmaz.
# Node.js Selector'ün yazdığı "CLOUDLINUX PASSENGER CONFIGURATION" bloğuna
# dokunmayın; bu kuralları o bloğun ÜSTÜNE yapıştırın.

RewriteEngine On

# --- www -> apex ve https zorlaması ---
RewriteCond %{HTTP_HOST} ^www\\.(.+)$ [NC]
RewriteRule ^ https://%1%{REQUEST_URI} [R=301,L]
RewriteCond %{HTTPS} off
RewriteRule ^ https://%{HTTP_HOST}%{REQUEST_URI} [R=301,L]

# --- Taşınan yazılar ---
# 81 özgün yazı aynı adreslerle taşındı (ör. /seo-nedir -> /blog/seo-nedir).
${BLOG_MOVED}

# --- Taşınmayan eski yazılar (kopya ya da çok kısa) ---
${BLOG_DROPPED}

# --- Eski sitenin sayfaları (hizmetler, sektör temaları, kurumsal) ---
${OLD_PAGES}

# --- Eski sitedeki şehir şablonu yazıları (620 adres) ---
# Kesin eşleşen blog adresleri yukarıda çözüldüğü için kalıplar onları gölgelemez.
${FAMILY_REDIRECTS.map(([pattern, target]) => `RewriteRule ^${pattern}/?$ ${target} [R=301,L]`).join("\n")}

# --- Eski WordPress adresleri ---
RewriteRule ^wp-(admin|login|content|includes)(/.*)?$ / [R=301,L]
RewriteRule ^(category|tag|author)/.*$ /blog [R=301,L]
RewriteRule ^feed/?$ /blog [R=301,L]
`,
);

writeFileSync(
  resolve(OUT, "KURULUM.md"),
  `# DirectAdmin kurulumu

Bu paket **${SITE_URL}** adresi için derlendi (canonical, sitemap ve paylaşım
kartları bu adresi gösterir).

Paket içeriği:

| Dosya | Nereye |
|---|---|
| \`uygulama/\` klasörünün **içeriği** | Node uygulama dizinine (ör. \`/home/KULLANICI/integralbilisim\`) |
| \`htaccess-kurallari.txt\` | \`public_html/.htaccess\` dosyasına **eklenir** (adım 3) |

## 1. Eski sitenin yedeğini alın
Taşımadan önce DirectAdmin > **Create/Restore Backups** ile eski WordPress
sitesinin tam yedeğini alın (veritabanı + dosyalar). İçerik ve görseller ayrıca
arşivlendi, ama veritabanı ve eklenti ayarları yalnızca bu yedekte bulunur.

## 2. Uygulamayı yükleyip tanımlayın
1. File Manager'da public_html DIŞINDA bir klasör açın (ör. \`integralbilisim\`)
   ve \`uygulama/\` klasörünün içindekileri oraya yükleyin. Gizli \`.output\`
   klasörünün de yüklendiğinden emin olun.
2. DirectAdmin > **Setup Node.js App** > Create Application:

| Alan | Değer |
|---|---|
| Node.js version | 20 veya üzeri (20 ile test edildi) |
| Application mode | Production |
| Application root | 1. adımdaki klasör |
| Application URL | ${SITE_URL.replace(/^https?:\/\//, "")} |
| Application startup file | \`app.js\` |

**Run NPM Install** gerekmez; bağımlılıklar pakete gömülüdür.

## 3. .htaccess kurallarını ekleyin
Uygulamayı oluşturduğunuzda panel \`public_html/.htaccess\` içine şöyle bir blok yazar:

\`\`\`
# DO NOT REMOVE. CLOUDLINUX PASSENGER CONFIGURATION BEGIN
...
# DO NOT REMOVE. CLOUDLINUX PASSENGER CONFIGURATION END
\`\`\`

Bu bloğa **dokunmayın**. \`htaccess-kurallari.txt\` içeriğini kopyalayıp bu
bloğun **üstüne** yapıştırın. Dosyayı komple değiştirirseniz site açılmaz.

Bu kurallar eski sitenin 820 adresinin tamamını yeni sayfalara 301 ile
yönlendirir. public_html'de eski WordPress dosyaları duruyorsa (index.php,
wp-* klasörleri) yedek aldıktan sonra kaldırın.

## 4. Ortam değişkenleri
Aynı ekranda **Environment variables** bölümüne ekleyin:

| Değişken | Ne için |
|---|---|
| \`SMTP_HOST\` | E-posta sunucusu, ör. \`mail.integralbilisim.com\` |
| \`SMTP_PORT\` | \`465\` (SSL) ya da \`587\` (STARTTLS) |
| \`SMTP_SECURE\` | 465 için \`true\`, 587 için \`false\` |
| \`SMTP_USER\` | Gönderim yapacak e-posta hesabı, ör. \`bildirim@integralbilisim.com\` |
| \`SMTP_PASS\` | O hesabın şifresi |
| \`SMTP_FROM\` | (İsteğe bağlı) gönderen adres; boşsa \`SMTP_USER\` kullanılır |
| \`CONTACT_TO_EMAIL\` | Formların düşeceği adres (varsayılan: info@integralbilisim.com) |
| \`PSI_API_KEY\` | Site analizi aracındaki hız ölçümü |
| \`BUNNY_STORAGE_ZONE\` | Yönetim panelinden görsel yükleme: Bunny Storage Zone adı |
| \`BUNNY_STORAGE_KEY\` | Aynı zone'un parolası (FTP & API Access > Password) |
| \`BUNNY_STORAGE_HOST\` | (İsteğe bağlı) bölge uç noktası; boşsa \`storage.bunnycdn.com\` |
| \`GA4_ID\` | Google Analytics 4 ölçüm kimliği (\`G-\` ile başlar). Boşsa çerez bildirimi çıkmaz, ölçüm yapılmaz |
| \`SUPABASE_URL\` | Blog ve lead veritabanı |
| \`SUPABASE_ANON_KEY\` | Blog okuma |
| \`SUPABASE_SERVICE_ROLE_KEY\` | Form taleplerini kaydetme (yalnızca sunucuda kullanılır) |

\`PORT\` tanımlamayın; panel kendisi atar.

**SMTP hesabı:** DirectAdmin > **E-Mail Accounts** bölümünden form bildirimleri
için ayrı bir hesap açmanızı öneririz (ör. \`bildirim@integralbilisim.com\`).
Sunucu adı genellikle \`mail.integralbilisim.com\` olur; port ve SSL ayarını aynı
ekrandaki "Mail Client Settings" bilgisinden kontrol edin. Gönderen adres bu
hesapla aynı domain'de olmalıdır; aksi halde sunucu iletiyi reddedebilir.
Bildirimleri Gmail gibi dış bir adrese yönlendirecekseniz DirectAdmin'de bu
domain için DKIM'in açık olduğundan emin olun, yoksa iletiler spam'e düşebilir.
(Mail gitmese bile talepler Supabase'deki \`leads\` tablosuna kaydedilir.)

Test edilen değerler: sunucu \`mail.integralbilisim.com\`, 465 (SSL) ve 587
(STARTTLS) açık, SSL sertifikası bu adı kapsıyor.

**Mail gitmiyorsa:** uygulama log'unda \`[mail] Gönderilemedi: connect ETIMEDOUT\`
ya da \`ECONNREFUSED\` görüyorsanız sunucunun güvenlik duvarı uygulamanın SMTP
portlarına çıkmasını engelliyor olabilir. Bu durumda \`SMTP_HOST=localhost\` ve
\`SMTP_TLS_SERVERNAME=mail.integralbilisim.com\` tanımlayıp uygulamayı yeniden başlatın.

## 5. Başlatın ve kontrol edin
**Start App** deyin, sonra:

- [ ] Ana sayfa, \`/blog\`, \`/teklif\`, \`/araclar/site-analizi\` açılıyor
- [ ] \`/robots.txt\` ve \`/sitemap.xml\` yanıt veriyor
- [ ] Eski bir adres yönleniyor: \`/seo-nedir\` -> \`/blog/seo-nedir\`,
      \`/web-siteler/otel-siteleri\` -> \`/hizmetler/hazir-web-site\`
- [ ] \`http://\` ve \`www.\` adresleri \`${SITE_URL}\` adresine yönleniyor
- [ ] İletişim formu e-posta gönderiyor
- [ ] Site analizi bir siteyi tarayabiliyor (giden HTTP izni gerekir)

Uygulama açılmazsa Setup Node.js App ekranındaki log dosyasına bakın.

## Dikkat
- Site analizi aracı dış sitelere istek atar ve PageSpeed ölçümü 20-40 saniye
  sürebilir. Paylaşımlı pakette giden bağlantı ya da istek süresi sınırlıysa
  yalnızca bu araç çalışmaz; diğer sayfalar etkilenmez.
- Yayından sonra Search Console'a \`${SITE_URL}/sitemap.xml\` adresini gönderin.
`,
);

execSync(
  `cd "${ROOT}" && rm -f integralbilisim-directadmin.zip && cd dist-directadmin && zip -qry ../integralbilisim-directadmin.zip .`,
  { stdio: "inherit" },
);
console.log(`\nPaket hazır: integralbilisim-directadmin.zip`);
