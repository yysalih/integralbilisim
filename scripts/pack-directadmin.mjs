/**
 * DirectAdmin (Node.js app) için dağıtım paketi hazırlar.
 *
 * Kullanım:
 *   npm run pack:directadmin
 *   SITE_URL=https://baska-domain.com npm run pack:directadmin
 *
 * Çıktı: dist-directadmin/ klasörü ve yanında .zip
 * İçerik: .output (sunucu + statik dosyalar), app.mjs (başlatma dosyası),
 *         package.json, .htaccess (301 yönlendirmeleri), KURULUM.md
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
mkdirSync(OUT, { recursive: true });
cpSync(resolve(ROOT, ".output"), resolve(OUT, ".output"), { recursive: true });

// CloudLinux Node Selector / Passenger "başlatma dosyası" ister.
writeFileSync(
  resolve(OUT, "app.mjs"),
  `/**
 * Başlatma dosyası. Node sunucusu PORT ortam değişkenini kullanır;
 * DirectAdmin / Passenger bu değeri kendisi atar.
 */
import "./.output/server/index.mjs";
`,
);

writeFileSync(
  resolve(OUT, "package.json"),
  JSON.stringify(
    {
      name: "integralbilisim-web",
      private: true,
      type: "module",
      engines: { node: ">=20" },
      scripts: { start: "node app.mjs" },
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
  resolve(OUT, ".htaccess"),
  `# İntegral Bilişim — Apache kuralları
# Bu dosya public_html içine konur. Apache, Node uygulamasına vermeden önce
# aşağıdaki yönlendirmeleri uygular.

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

Kanonik adres bu pakette **${SITE_URL}** olarak derlendi.

## 1. Dosyaları yükleyin
Bu klasörün içeriğini uygulama dizinine kopyalayın (örn. \`/home/KULLANICI/nodeapps/integral\`).
\`.htaccess\` dosyası ise \`public_html\` içine konur.

## 2. Node uygulamasını tanımlayın
DirectAdmin > **Node.js Selector** (ya da "Setup Node.js App"):

| Alan | Değer |
|---|---|
| Node sürümü | 20 veya üzeri |
| Application root | uygulamayı kopyaladığınız dizin |
| Application URL | ${SITE_URL} |
| Application startup file | \`app.mjs\` |

## 3. Ortam değişkenleri
Aynı ekranda şunları tanımlayın:

- \`RESEND_API_KEY\` — iletişim ve teklif formlarının e-posta göndermesi için
- \`PSI_API_KEY\` — site analizi aracındaki hız ölçümü için
- \`CONTACT_TO_EMAIL\` — formların düşeceği adres (varsayılan: info@integralbilisim.com)
- \`SUPABASE_URL\`, \`SUPABASE_ANON_KEY\` — blog içeriğini veritabanından okumak için
- \`SUPABASE_SERVICE_ROLE_KEY\` — form taleplerini \`leads\` tablosuna yazmak için
  (bu anahtar yalnızca sunucuda kullanılır, tarayıcıya hiç gönderilmez)

Supabase değişkenleri tanımlanmazsa site çalışmaya devam eder: blog yazıları
koda gömülü anlık görüntüden okunur, form talepleri yalnızca e-posta ile gider.

\`PORT\` değişkenini siz tanımlamayın; panel kendisi atar.

## 4. Başlatın
Panelden **Run NPM Install** gerekmez (bağımlılıklar pakete gömülü).
**Start App** deyin; ardından \`${SITE_URL}\` adresini açın.

## 5. Kontrol listesi
- [ ] Ana sayfa açılıyor
- [ ] \`/teklif\` ve \`/araclar/site-analizi\` açılıyor
- [ ] \`/robots.txt\` ve \`/sitemap.xml\` yanıt veriyor
- [ ] İletişim formu mail gönderiyor (RESEND_API_KEY)
- [ ] Site analizi bir siteyi tarayabiliyor (giden HTTP izni gerekir)
- [ ] Blog yazıları görünüyor (\`/blog\`)

## 6. Supabase'i bağlama (blog + lead yönetimi)
Supabase panelinde proje açtıktan sonra, geliştirme makinesinde:

\`\`\`bash
supabase link --project-ref <proje-ref>
supabase db push                      # tabloları ve erişim kurallarını oluşturur
SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... npm run seed   # yazıları aktarır
\`\`\`

Ardından yukarıdaki üç Supabase değişkenini DirectAdmin'de tanımlayıp uygulamayı
yeniden başlatın. Blog artık veritabanından okunur; yazı değiştirmek için yeniden
derleme gerekmez.

## Dikkat
- Site analizi aracı dış sitelere istek atar ve PageSpeed ölçümü 20-40 saniye
  sürebilir. Paylaşımlı pakette giden bağlantı veya istek süresi sınırlıysa bu
  araç çalışmaz; diğer sayfalar etkilenmez.
- Ziyaretçi ölçümü için GA4 gerekir (\`VITE_GA4_ID\` derleme anında tanımlanmalı).
`,
);

execSync(`cd "${ROOT}" && zip -qry dist-directadmin.zip dist-directadmin`, { stdio: "inherit" });
console.log(`\nPaket hazır: dist-directadmin/ ve dist-directadmin.zip`);
