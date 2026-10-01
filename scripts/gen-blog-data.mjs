/**
 * Kazınan yazılardan src/lib/blog.ts üretir.
 * Kullanım: POSTS=/yol/posts.json node scripts/gen-blog-data.mjs
 *
 * Eleme kuralları: 150 kelimeden kısa yazılar, aynı başlığın tekrarları ve
 * ajans konusuyla ilgisiz eski teknoloji haberleri dışarıda bırakılır.
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

const ROOT = resolve(import.meta.dirname, "..");
const posts = JSON.parse(readFileSync(process.env.POSTS, "utf8"));

const norm = (t) => t.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "");
const OFF_TOPIC = ["tesla-d", "data-center", "windows-9"];

/**
 * Aynı başlığın kopyaları arasında seçim: önce daha dolu metin, sonra "-2" gibi
 * ekli olmayan sade adres, sonra daha kısa adres. Sade adres eskidir ve dışarıdan
 * bağlantı almış olma ihtimali yüksektir; bu yüzden tarihten önce gelir.
 * Yazının tarihi ise grubun en yeni tarihi olur (içerik yenilenmiş sayılır).
 */
const suffixed = (x) => /-\d+$/.test(x.slug) || x.slug.endsWith("-");
const better = (a, b) => {
  if (a.words !== b.words) return a.words > b.words;
  if (suffixed(a) !== suffixed(b)) return !suffixed(a);
  if (a.slug.length !== b.slug.length) return a.slug.length < b.slug.length;
  return a.date > b.date;
};

const byTitle = new Map();
const newestDate = new Map();
for (const p of posts) {
  const k = norm(p.title);
  newestDate.set(k, (newestDate.get(k) ?? "") > p.date ? newestDate.get(k) : p.date);
  const cur = byTitle.get(k);
  if (!cur || better(p, cur)) byTitle.set(k, p);
}
for (const [k, p] of byTitle) p.date = newestDate.get(k) ?? p.date;

const kept = [...byTitle.values()]
  .filter((p) => p.words >= 150 && !OFF_TOPIC.some((o) => p.slug.includes(o)))
  .sort((a, b) => b.date.localeCompare(a.date));

/** Başlıktan konu ve renk. Site genelindeki accent paletiyle uyumlu. */
const CATEGORIES = [
  [/seo|arama motoru/i, "SEO", "#3B82F6"],
  [/e-?ticaret/i, "E-Ticaret", "#10B981"],
  [/mobil/i, "Mobil", "#8B5CF6"],
  [/hosting|domain|\.com|alan ad/i, "Altyapı", "#06B6D4"],
  [/marka|patent|tescil|logo|kurumsal kimlik/i, "Marka", "#E11D48"],
  [/reklam|adwords|google ads|sosyal medya|dijital pazarlama/i, "Dijital Pazarlama", "#F59E0B"],
  [/hazır|hazir/i, "Hazır Web Site", "#22D3EE"],
];
const classify = (title) =>
  CATEGORIES.find(([re]) => re.test(title))?.slice(1) ?? ["Web Tasarım", "#C9436E"];

/** Görseli olmayan yazılara mevcut katalogdan dönüşümlü görsel verilir. */
const POOL = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m"];

const excerptOf = (body) => {
  const first = body.find((b) => b.text.length > 80)?.text ?? body[0]?.text ?? "";
  if (first.length <= 165) return first;
  const cut = first.slice(0, 165);
  const stop = Math.max(cut.lastIndexOf(". "), cut.lastIndexOf("! "), cut.lastIndexOf("? "));
  return (stop > 90 ? cut.slice(0, stop + 1) : cut.replace(/\s+\S*$/, "") + "…").trim();
};

let poolIndex = 0;
const entries = kept.map((p) => {
  const [category, accent] = classify(p.title);
  const local = `public/blog/${p.slug}.jpg`;
  const image = existsSync(resolve(ROOT, local))
    ? `/blog/${p.slug}.jpg`
    : `/images/${POOL[poolIndex++ % POOL.length]}.jpeg`;
  return {
    slug: p.slug,
    title: p.title,
    category,
    accent,
    date: p.date,
    readingMinutes: Math.max(1, Math.round(p.words / 200)),
    excerpt: excerptOf(p.body),
    image,
    body: p.body,
  };
});

const s = JSON.stringify;
const file = `/**
 * Blog yazıları. Tamamı integralbilisim.com üzerindeki özgün yazılardan
 * taşınmıştır; adresler (slug) korunmuştur, böylece taşıma sonrası aynı
 * URL'ler çalışmaya devam eder ve yönlendirme gerekmez.
 *
 * Bu dosya üretilir: scripts/gen-blog-data.mjs
 */
export interface BlogPost {
  slug: string;
  title: string;
  category: string;
  accent: string;
  /** ISO tarih; yazının yayın tarihi. */
  date: string;
  readingMinutes: number;
  excerpt: string;
  image: string;
  body: { heading?: string; text: string }[];
}

export const BLOG_POSTS: BlogPost[] = [
${entries
  .map(
    (e) => `  {
    slug: ${s(e.slug)},
    title: ${s(e.title)},
    category: ${s(e.category)},
    accent: ${s(e.accent)},
    date: ${s(e.date)},
    readingMinutes: ${e.readingMinutes},
    excerpt: ${s(e.excerpt)},
    image: ${s(e.image)},
    body: [
${e.body.map((b) => `      { ${b.heading ? `heading: ${s(b.heading)}, ` : ""}text: ${s(b.text)} },`).join("\n")}
    ],
  },`,
  )
  .join("\n")}
];

export const getPost = (slug: string) => BLOG_POSTS.find((p) => p.slug === slug);

export const formatPostDate = (iso: string) =>
  new Date(iso).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" });
`;

writeFileSync(resolve(ROOT, "src/lib/blog.ts"), file);

/**
 * Taşınmayan eski adresler: kopyalar korunan yazıya, kısa/konu dışı olanlar
 * blog listesine yönlendirilir. pack-directadmin.mjs bunu .htaccess'e yazar.
 */
const keptSlugs = new Set(entries.map((e) => e.slug));
const redirects = [];

// Sitemap'te görünmeyen ama yayında olabilen sade adresler: "-2" ile biten bir
// yazı tuttuysak, eksiz hâli de o yazıya yönlendirilir.
for (const e of entries) {
  const plain = e.slug.replace(/-\d+$/, "");
  if (plain !== e.slug && !keptSlugs.has(plain)) redirects.push({ from: plain, to: `/blog/${e.slug}` });
}
for (const p of posts) {
  if (keptSlugs.has(p.slug)) continue;
  const twin = byTitle.get(norm(p.title));
  redirects.push({ from: p.slug, to: twin && keptSlugs.has(twin.slug) ? `/blog/${twin.slug}` : "/blog" });
}
writeFileSync(resolve(ROOT, "scripts/blog-redirects.json"), JSON.stringify(redirects, null, 1) + "\n");
console.log(`yonlendirme: ${redirects.length} eski adres (${redirects.filter((r) => r.to !== "/blog").length} kopya -> asil yazi)`);
const kb = (file.length / 1024).toFixed(0);
console.log(`src/lib/blog.ts yazildi: ${entries.length} yazi, ${kb} KB`);
const cats = entries.reduce((m, e) => ((m[e.category] = (m[e.category] ?? 0) + 1), m), {});
console.log("kategoriler:", Object.entries(cats).map(([k, v]) => `${k} ${v}`).join(" · "));
console.log(`gorsel: ${entries.filter((e) => e.image.startsWith("/blog/")).length} ozgun, ${entries.filter((e) => !e.image.startsWith("/blog/")).length} katalogdan`);
