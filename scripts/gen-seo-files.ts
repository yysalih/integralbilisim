/**
 * robots.txt, sitemap.xml, llms.txt ve security.txt üretir.
 * `npm run build` öncesinde otomatik çalışır (package.json prebuild).
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";

import { SERVICES } from "../src/lib/services";
import { BLOG_POSTS } from "../src/lib/blog";
import { FAQ_ITEMS } from "../src/lib/faq";
import { COMPANY } from "../src/lib/company";

const SITE = (process.env.VITE_SITE_URL ?? "https://integralbilisim.com").replace(/\/$/, "");
const PUB = resolve(import.meta.dirname, "..", "public");
mkdirSync(resolve(PUB, ".well-known"), { recursive: true });

const today = new Date().toISOString().slice(0, 10);

// --- sitemap.xml ---
type Entry = { path: string; lastmod: string; priority: string; changefreq: string };
const entries: Entry[] = [
  { path: "/", lastmod: today, priority: "1.0", changefreq: "weekly" },
  { path: "/teklif", lastmod: today, priority: "0.9", changefreq: "monthly" },
  { path: "/araclar", lastmod: today, priority: "0.8", changefreq: "monthly" },
  { path: "/araclar/site-analizi", lastmod: today, priority: "0.9", changefreq: "monthly" },
  { path: "/hizmetler", lastmod: today, priority: "0.9", changefreq: "monthly" },
  { path: "/hakkimizda", lastmod: today, priority: "0.8", changefreq: "monthly" },
  { path: "/referanslar", lastmod: today, priority: "0.8", changefreq: "monthly" },
  { path: "/blog", lastmod: today, priority: "0.8", changefreq: "weekly" },
  { path: "/iletisim", lastmod: today, priority: "0.7", changefreq: "yearly" },
  { path: "/gizlilik-politikasi", lastmod: today, priority: "0.3", changefreq: "yearly" },
  ...SERVICES.map((s) => ({
    path: `/hizmetler/${s.slug}`,
    lastmod: today,
    priority: "0.9",
    changefreq: "monthly",
  })),
  ...BLOG_POSTS.map((p) => ({
    path: `/blog/${p.slug}`,
    lastmod: p.date,
    priority: "0.7",
    changefreq: "yearly",
  })),
];

writeFileSync(
  resolve(PUB, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries
  .map(
    (e) =>
      `  <url>\n    <loc>${SITE}${e.path}</loc>\n    <lastmod>${e.lastmod}</lastmod>\n    <changefreq>${e.changefreq}</changefreq>\n    <priority>${e.priority}</priority>\n  </url>`,
  )
  .join("\n")}
</urlset>\n`,
);

// --- robots.txt: AI botlarına açık izin ---
const AI_BOTS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-User",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "CCBot",
  "Applebot-Extended",
  "Bytespider",
  "meta-externalagent",
];

writeFileSync(
  resolve(PUB, "robots.txt"),
  `# ${COMPANY.name} — ${SITE}
User-agent: *
Allow: /

${AI_BOTS.map((bot) => `User-agent: ${bot}\nAllow: /`).join("\n\n")}

Sitemap: ${SITE}/sitemap.xml
`,
);

// --- llms.txt: LLM'ler için sade özet ---
const years = new Date().getFullYear() - COMPANY.foundedYear;
writeFileSync(
  resolve(PUB, "llms.txt"),
  `# ${COMPANY.name}

> ${COMPANY.foundedYear}'den beri Kadıköy / İstanbul'da faaliyet gösteren web tasarım, web yazılım ve dijital pazarlama ajansı. ${years} yıllık deneyim, 153 marka referansı.

## Hakkında
- Ticari unvan: ${COMPANY.fullName}
- Kuruluş: ${COMPANY.foundedYear}
- Adres: ${COMPANY.address}
- Telefon: ${COMPANY.phoneMobile} · ${COMPANY.phoneOffice}
- E-posta: ${COMPANY.email}
- Çalışma saatleri: ${COMPANY.workingHours}
- Hizmet bölgesi: Türkiye geneli

## Hizmetler
${SERVICES.map((s) => `- [${s.title}](${SITE}/hizmetler/${s.slug}): ${s.short}`).join("\n")}

## Sayfalar
- [Ana sayfa](${SITE}/)
- [Teklif Sihirbazı](${SITE}/teklif): birkaç soruyla kapsamı netleştirip teklif talebi oluşturma
- [Ücretsiz Site Analizi](${SITE}/araclar/site-analizi): bir web sitesinin hız, teknik SEO, mobil uyum, güven ve paylaşım sinyallerini ölçüp 100 üzerinden skor veren ücretsiz araç
- [Hizmetler](${SITE}/hizmetler)
- [Hakkımızda](${SITE}/hakkimizda)
- [Referanslar](${SITE}/referanslar): 153 markanın listesi
- [Blog](${SITE}/blog)
- [İletişim](${SITE}/iletisim)

## Blog yazıları
${BLOG_POSTS.map((p) => `- [${p.title}](${SITE}/blog/${p.slug}) — ${p.date}`).join("\n")}

## Sık sorulan sorular
${FAQ_ITEMS.map((f) => `### ${f.question}\n${f.answer}`).join("\n\n")}
`,
);

// --- security.txt ---
const expires = new Date(Date.now() + 365 * 864e5).toISOString().replace(/\.\d+Z$/, "Z");
writeFileSync(
  resolve(PUB, ".well-known", "security.txt"),
  `Contact: mailto:${COMPANY.email}
Expires: ${expires}
Preferred-Languages: tr, en
Canonical: ${SITE}/.well-known/security.txt
`,
);

console.log(
  `SEO dosyalari yazildi: sitemap (${entries.length} URL), robots (${AI_BOTS.length} AI botu), llms.txt, security.txt`,
);
