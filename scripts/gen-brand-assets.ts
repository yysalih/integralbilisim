/**
 * Favicon seti ve sayfa bazlı OG kartlarını üretir.
 * Çalıştırma: npx tsx scripts/gen-brand-assets.ts
 * Çıktı: public/favicon.ico, public/icon-*.png, public/apple-touch-icon.png, public/og/*.png
 */
import { chromium, type Browser } from "playwright";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";

import { SERVICES } from "../src/lib/services";
import { BLOG_POSTS } from "../src/lib/blog";

const ROOT = resolve(import.meta.dirname, "..");
const PUB = resolve(ROOT, "public");
const OG = resolve(PUB, "og");
mkdirSync(OG, { recursive: true });

const BRAND = "#C9436E";
const dataUri = (file: string) =>
  `data:image/png;base64,${readFileSync(resolve(PUB, file)).toString("base64")}`;
/** Koyu zeminli OG kartlarında beyaz logo. */
const logoDataUri = dataUri("logo-white.png");
/** Simgede pembe kare + beyaz harf olan sürüm kullanılır. */
const markDataUri = dataUri("logo-dark.png");

/**
 * Logonun sol simgesi. Ölçüm (768x229 logo-dark.png): x=38..199, y=13..214.
 * Harf logoda şeffaf bir delik olduğu için altına beyaz konur; simgenin pembe
 * gövdesi zeminle aynı renk olduğundan yalnızca beyaz harf görünür.
 */
const MARK = { x: 38, y: 13, w: 162, h: 202, sheet: 768 };
const iconMarkup = (size: number) => {
  const k = (size * 0.78) / MARK.h;
  const w = MARK.w * k;
  const h = MARK.h * k;
  return `
<style>
  html,body{margin:0;background:transparent}
  .icon{width:${size}px;height:${size}px;position:relative;overflow:hidden;
        border-radius:${Math.round(size * 0.2)}px;background:${BRAND}}
  .mark{position:absolute;overflow:hidden;background:#fff;
        width:${w}px;height:${h}px;left:${(size - w) / 2}px;top:${(size - h) / 2}px}
  .mark img{position:absolute;width:${MARK.sheet * k}px;
            left:${-MARK.x * k}px;top:${-MARK.y * k}px}
</style>
<div class="icon"><div class="mark"><img src="${markDataUri}"></div></div>`;
};

const ogMarkup = (opts: { eyebrow: string; title: string; note?: string; accent?: string }) => {
  const accent = opts.accent ?? BRAND;
  return `
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;800&display=swap');
  html,body{margin:0}
  .card{
    width:1200px;height:630px;position:relative;overflow:hidden;
    background:#0a0a12;font-family:Inter,system-ui,sans-serif;color:#fff;
    display:flex;flex-direction:column;justify-content:space-between;
    padding:64px 72px;box-sizing:border-box;
  }
  .glow{position:absolute;border-radius:50%;filter:blur(90px);pointer-events:none}
  .g1{width:620px;height:620px;background:${accent};opacity:.42;left:-140px;top:-220px}
  .g2{width:560px;height:560px;background:#8B5CF6;opacity:.30;right:-160px;bottom:-240px}
  .g3{width:420px;height:420px;background:${accent};opacity:.16;right:180px;top:-160px}
  .grid{
    position:absolute;inset:0;opacity:.16;
    background-image:linear-gradient(rgba(255,255,255,.12) 1px,transparent 1px),
                     linear-gradient(90deg,rgba(255,255,255,.12) 1px,transparent 1px);
    background-size:64px 64px;
    mask-image:radial-gradient(ellipse at 30% 0%,#000 30%,transparent 72%);
  }
  .row{position:relative;display:flex;align-items:center;justify-content:space-between}
  .logo{height:52px}
  .eyebrow{
    font-size:19px;font-weight:600;letter-spacing:.22em;text-transform:uppercase;
    color:${accent};
  }
  .title{
    position:relative;font-size:${opts.title.length > 52 ? 62 : 74}px;font-weight:800;
    line-height:1.06;letter-spacing:-.025em;max-width:1010px;margin:26px 0 0;
  }
  .note{position:relative;margin-top:22px;font-size:25px;color:rgba(255,255,255,.62);max-width:900px;line-height:1.4}
  .foot{position:relative;display:flex;align-items:center;gap:16px;font-size:21px;color:rgba(255,255,255,.55)}
  .dot{width:7px;height:7px;border-radius:50%;background:${accent}}
  .rule{position:absolute;left:0;right:0;bottom:0;height:7px;
        background:linear-gradient(90deg,${accent},#8B5CF6 55%,transparent)}
</style>
<div class="card">
  <div class="glow g1"></div><div class="glow g2"></div><div class="glow g3"></div>
  <div class="grid"></div>
  <div class="row"><img class="logo" src="${logoDataUri}"><div class="eyebrow">${opts.eyebrow}</div></div>
  <div>
    <h1 class="title">${opts.title}</h1>
    ${opts.note ? `<p class="note">${opts.note}</p>` : ""}
  </div>
  <div class="foot">
    <span>integralbilisim.com</span><span class="dot"></span>
    <span>Kadıköy, İstanbul</span><span class="dot"></span><span>2007'den beri</span>
  </div>
  <div class="rule"></div>
</div>`;
};

const shoot = async (b: Browser, html: string, w: number, h: number, out: string) => {
  const p = await b.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
  await p.setContent(html, { waitUntil: "networkidle" });
  await p.evaluate(() => document.fonts.ready);
  await p.screenshot({ path: out, omitBackground: true });
  await p.close();
};

/** Vista+ ICO: her kare gömülü PNG olarak yazılır. */
const writeIco = (pngs: { size: number; data: Buffer }[], out: string) => {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(pngs.length, 4);
  let offset = 6 + pngs.length * 16;
  const entries: Buffer[] = [];
  for (const { size, data } of pngs) {
    const e = Buffer.alloc(16);
    e.writeUInt8(size >= 256 ? 0 : size, 0);
    e.writeUInt8(size >= 256 ? 0 : size, 1);
    e.writeUInt8(0, 2);
    e.writeUInt8(0, 3);
    e.writeUInt16LE(1, 4);
    e.writeUInt16LE(32, 6);
    e.writeUInt32LE(data.length, 8);
    e.writeUInt32LE(offset, 12);
    offset += data.length;
    entries.push(e);
  }
  writeFileSync(out, Buffer.concat([header, ...entries, ...pngs.map((p) => p.data)]));
};

const b = await chromium.launch({ channel: "chrome" });

// --- Favicon seti ---
for (const [size, name] of [
  [512, "icon-512.png"],
  [192, "icon-192.png"],
  [180, "apple-touch-icon.png"],
  [48, "icon-48.png"],
  [32, "icon-32.png"],
  [16, "icon-16.png"],
] as const) {
  await shoot(b, iconMarkup(size), size, size, resolve(PUB, name));
}
writeIco(
  [16, 32, 48].map((s) => ({ size: s, data: readFileSync(resolve(PUB, `icon-${s}.png`)) })),
  resolve(PUB, "favicon.ico"),
);

// --- OG kartları ---
const cards: { file: string; eyebrow: string; title: string; note?: string; accent?: string }[] = [
  {
    file: "default",
    eyebrow: "Web Tasarım & Yazılım",
    title: "Markanızı internete taşıyan dijital çözüm ortağınız",
    note: "Alan adından tasarıma, yayına almaktan mobil uyuma kadar her şey tek elden.",
  },
  {
    file: "teklif",
    eyebrow: "Teklif Sihirbazı",
    title: "Projenizi 90 saniyede netleştirin",
    note: "Birkaç soru sorup kapsamınızın özetini çıkarıyoruz.",
  },
  {
    file: "araclar",
    eyebrow: "Ücretsiz Araçlar",
    title: "Önce ölçün, sonra karar verin",
    note: "Sitenizin bugün nerede durduğunu gerçek verilerle gösteren araçlar.",
  },
  {
    file: "site-analizi",
    eyebrow: "Ücretsiz Araç",
    title: "Web siteniz ne kadar güçlü?",
    note: "Hız, teknik SEO, mobil uyum ve güven sinyalleri — 100 üzerinden skor.",
  },
  {
    file: "hizmetler",
    eyebrow: "Hizmetler",
    title: "Web'den mobile, tasarımdan pazarlamaya 14 hizmet",
    note: "Her biri tek elden yürütülen, uçtan uca dijital hizmetler.",
  },
  {
    file: "hakkimizda",
    eyebrow: "Hakkımızda",
    title: "2007'den beri dijitalde yanınızdayız",
    note: "153 markanın dijital yüzünü tasarladık.",
  },
  { file: "blog", eyebrow: "Blog", title: "Web, tasarım ve dijital pazarlama üzerine yazılar" },
  {
    file: "referanslar",
    eyebrow: "Referanslar",
    title: "153 markanın dijital yüzünü biz tasarladık",
  },
  {
    file: "iletisim",
    eyebrow: "İletişim",
    title: "Projenizi birlikte konuşalım",
    note: "Kadıköy'deki ofisimizden Türkiye'nin her yerine hizmet veriyoruz.",
  },
  { file: "gizlilik-politikasi", eyebrow: "Kurumsal", title: "Gizlilik Politikası ve KVKK Aydınlatma Metni" },
];

for (const c of cards) await shoot(b, ogMarkup(c), 1200, 630, resolve(OG, `${c.file}.png`));

for (const s of SERVICES) {
  await shoot(
    b,
    ogMarkup({ eyebrow: "Hizmet", title: s.title, note: s.short, accent: s.accent }),
    1200,
    630,
    resolve(OG, `hizmet-${s.slug}.png`),
  );
}

for (const post of BLOG_POSTS) {
  await shoot(
    b,
    ogMarkup({ eyebrow: post.category, title: post.title, note: post.excerpt, accent: post.accent }),
    1200,
    630,
    resolve(OG, `blog-${post.slug}.png`),
  );
}

await b.close();
console.log(`Bitti: ${10 + SERVICES.length + BLOG_POSTS.length} OG kartı + favicon seti`);
