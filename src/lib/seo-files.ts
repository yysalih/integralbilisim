import { COMPANY } from "@/lib/company";
import { FAQ_ITEMS } from "@/lib/faq";
import { SERVICES } from "@/lib/services";
import { SITE_URL } from "@/lib/seo";

/** Sitemap ve llms.txt'e giren yazı bilgisi. */
export interface FeedPost {
  slug: string;
  title: string;
  /** Yayın tarihi (YYYY-AA-GG). */
  date: string;
  /** Son düzenleme (ISO). Yoksa yayın tarihi kullanılır. */
  updated?: string;
}

interface Entry {
  path: string;
  lastmod?: string;
  priority: string;
  changefreq: string;
}

/**
 * Sabit sayfalar lastmod taşımaz: her derlemede "bugün" yazmak Google'a yanlış
 * değişiklik sinyali verir ve lastmod'a olan güveni düşürür.
 */
const STATIC_ENTRIES: Entry[] = [
  { path: "/", priority: "1.0", changefreq: "weekly" },
  { path: "/teklif", priority: "0.9", changefreq: "monthly" },
  { path: "/araclar", priority: "0.8", changefreq: "monthly" },
  { path: "/araclar/site-analizi", priority: "0.9", changefreq: "monthly" },
  { path: "/hizmetler", priority: "0.9", changefreq: "monthly" },
  { path: "/hakkimizda", priority: "0.8", changefreq: "monthly" },
  { path: "/referanslar", priority: "0.8", changefreq: "monthly" },
  { path: "/blog", priority: "0.8", changefreq: "weekly" },
  { path: "/iletisim", priority: "0.7", changefreq: "yearly" },
  { path: "/gizlilik-politikasi", priority: "0.3", changefreq: "yearly" },
  ...SERVICES.map((s) => ({
    path: `/hizmetler/${s.slug}`,
    priority: "0.9",
    changefreq: "monthly",
  })),
];

const xml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export const renderSitemap = (posts: FeedPost[]): string => {
  const entries: Entry[] = [
    ...STATIC_ENTRIES,
    ...posts.map((p) => ({
      path: `/blog/${p.slug}`,
      lastmod: (p.updated ?? p.date).slice(0, 10),
      priority: "0.7",
      changefreq: "yearly",
    })),
  ];
  const urls = entries
    .map(
      (e) =>
        `  <url>\n    <loc>${xml(SITE_URL + e.path)}</loc>\n${
          e.lastmod ? `    <lastmod>${e.lastmod}</lastmod>\n` : ""
        }    <changefreq>${e.changefreq}</changefreq>\n    <priority>${e.priority}</priority>\n  </url>`,
    )
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
};

export const renderLlms = (posts: FeedPost[]): string => {
  const years = new Date().getFullYear() - COMPANY.foundedYear;
  return `# ${COMPANY.name}

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
${SERVICES.map((s) => `- [${s.title}](${SITE_URL}/hizmetler/${s.slug}): ${s.short}`).join("\n")}

## Sayfalar
- [Ana sayfa](${SITE_URL}/)
- [Teklif Sihirbazı](${SITE_URL}/teklif): birkaç soruyla kapsamı netleştirip teklif talebi oluşturma
- [Ücretsiz Site Analizi](${SITE_URL}/araclar/site-analizi): bir web sitesinin hız, teknik SEO, mobil uyum, güven ve paylaşım sinyallerini ölçüp 100 üzerinden skor veren ücretsiz araç
- [Hizmetler](${SITE_URL}/hizmetler)
- [Hakkımızda](${SITE_URL}/hakkimizda)
- [Referanslar](${SITE_URL}/referanslar): 153 markanın listesi
- [Blog](${SITE_URL}/blog)
- [İletişim](${SITE_URL}/iletisim)

## Blog yazıları
${posts.map((p) => `- [${p.title}](${SITE_URL}/blog/${p.slug}) — ${p.date}`).join("\n")}

## Sık sorulan sorular
${FAQ_ITEMS.map((f) => `### ${f.question}\n${f.answer}`).join("\n\n")}
`;
};
