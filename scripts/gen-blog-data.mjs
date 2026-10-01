/**
 * Kazınan yazılardan src/lib/blog.ts üretir.
 * Kullanım: node scripts/gen-blog-data.mjs
 * Kaynak: scripts/data/eski-site-yazilari.json — eski WordPress sitesinden
 * kazınan ham yazılar (scripts/migrate-blog.mjs). Eski site kapandığında yeniden
 * kazınamayacağı için repoda saklanır.
 *
 * Eleme kuralları: 150 kelimeden kısa yazılar, aynı başlığın tekrarları ve
 * ajans konusuyla ilgisiz eski teknoloji haberleri dışarıda bırakılır.
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

const ROOT = resolve(import.meta.dirname, "..");
const SOURCE = process.env.POSTS ?? resolve(ROOT, "scripts/data/eski-site-yazilari.json");
const posts = JSON.parse(readFileSync(SOURCE, "utf8"));

const norm = (t) => t.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "");

/**
 * Şablon paragraf imzaları: eski sitede aynı dört paragraflık iskelete yalnızca
 * başlık yapıştırılarak üretilmiş yazılar. Bu paragraflar ayıklanır; geriye
 * 150 kelimeden az gerçek içerik kalan yazılar taşınmaz.
 */
const SPIN = [
  "dijital dünyada öne çıkmak isteyen firmaların sıklıkla",
  "iyi tasarlanmış bir web sitesi, hem kullanıcı deneyimini artırır",
  "birçok işletme için dijital varlık oluşturmak zorlu bir süreç",
  "konusunda bilinçli adımlar atmak",
  "modern işletmelerin dijital varlık stratejilerinde",
  "iyi planlanmış bir site, ziyaretçinin dikkatini çekerken",
  "web sitesi sadece bir tanıtım aracı değil, aynı zamanda satış",
  "hedefleyen firmalar için sağlam temellerle kurulan",
  "işletmelerin online varlıklarını hızlı ve etkili bir şekilde kurmaları",
  "çözümleri sayesinde, kullanıcılar kısa sürede seo uyumlu",
  "hazır web tasarımın sunduğu düşük maliyetli çözümler",
  "dijitalde rekabet avantajı elde etmek isteyen herkes için",
];
const isSpin = (t) => SPIN.some((sig) => t.toLocaleLowerCase("tr").includes(sig));

/** 81 ilin adının alt alta dizildiği kapı sayfası dizinleri. */
const isCityHub = (p) => p.body.filter((b) => b.text.split(/\s+/).length <= 8).length >= 20;

/** Başlığı farklı ama metni aynı yazıların korunan ikizi. */
const CONTENT_TWIN = {};
const tokens = (p) =>
  new Set(p.body.map((b) => b.text).join(" ").toLocaleLowerCase("tr").split(/[^\p{L}0-9]+/u).filter((w) => w.length > 3));
const similar = (a, b) => {
  const x = tokens(a), y = tokens(b);
  let i = 0;
  for (const t of x) if (y.has(t)) i++;
  return i / (x.size + y.size - i || 1);
};

/** Aynı konuyu ele alan iki yazıdan zayıf olanı güçlüsüne birleştirilir. */
const MERGE = { "responsive-web-tasarim-nedir": "responsive-tasarim-nedir" };

/** Taşınmayan yazının en yakın konusu: hizmet sayfası ya da korunan yazı. */
const topicTarget = (title) => {
  const t = title.toLocaleLowerCase("tr");
  if (/hazır|hazir/.test(t)) return "/hizmetler/hazir-web-site";
  if (/e-?ticaret/.test(t)) return "/hizmetler/e-ticaret-web-siteleri";
  if (/kurumsal kimlik/.test(t)) return "/hizmetler/kurumsal-kimlik";
  if (/logo/.test(t)) return "/hizmetler/logo-calismasi";
  if (/marka|patent|tescil/.test(t)) return "/hizmetler/marka-tescil";
  if (/sosyal medya/.test(t)) return "/hizmetler/sosyal-medya-yonetimi";
  if (/reklam|adwords|google ads/.test(t)) return "/hizmetler/google-ads-reklami";
  if (/seo/.test(t)) return "/blog/seo-nedir";
  if (/web|site|tasarım|mobil/.test(t)) return "/hizmetler/web-tasarim";
  return "/blog";
};
const OFF_TOPIC = ["tesla-d", "data-center", "windows-9", "iwork"];

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

for (const p of byTitle.values()) {
  p.body = p.body.filter((b) => !isSpin(b.text) && !/^Diğer Yazılar$/i.test(b.heading ?? ""));
  p.words = p.body.reduce((n, b) => n + b.text.split(/\s+/).length, 0);
}
const kept = [...byTitle.values()]
  .filter((p) => p.words >= 150 && !OFF_TOPIC.some((o) => p.slug.includes(o)))
  .filter((p) => !isCityHub(p) && !MERGE[p.slug])
  .filter((p, _i, all) => {
    // Başlığı farklı, metni neredeyse aynı yazılar: daha iyisi kalır, diğeri ona yönlenir.
    const twin = all.find((o) => o !== p && similar(o, p) >= 0.8 && better(o, p));
    if (twin) CONTENT_TWIN[p.slug] = twin.slug;
    return !twin;
  })
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
  const to = CONTENT_TWIN[p.slug] && keptSlugs.has(CONTENT_TWIN[p.slug])
    ? `/blog/${CONTENT_TWIN[p.slug]}`
    : MERGE[p.slug] && keptSlugs.has(MERGE[p.slug])
    ? `/blog/${MERGE[p.slug]}`
    : twin && keptSlugs.has(twin.slug)
      ? `/blog/${twin.slug}`
      : topicTarget(p.title);
  redirects.push({ from: p.slug, to });
}
writeFileSync(resolve(ROOT, "scripts/blog-redirects.json"), JSON.stringify(redirects, null, 1) + "\n");
const toPosts = redirects.filter((r) => r.to.startsWith("/blog/")).length;
const toServices = redirects.filter((r) => r.to.startsWith("/hizmetler/")).length;
console.log(`yonlendirme: ${redirects.length} eski adres -> ${toPosts} korunan yaziya, ${toServices} hizmet sayfasina, ${redirects.length - toPosts - toServices} blog listesine`);
const kb = (file.length / 1024).toFixed(0);
console.log(`src/lib/blog.ts yazildi: ${entries.length} yazi, ${kb} KB`);
const cats = entries.reduce((m, e) => ((m[e.category] = (m[e.category] ?? 0) + 1), m), {});
console.log("kategoriler:", Object.entries(cats).map(([k, v]) => `${k} ${v}`).join(" · "));
console.log(`gorsel: ${entries.filter((e) => e.image.startsWith("/blog/")).length} ozgun, ${entries.filter((e) => !e.image.startsWith("/blog/")).length} katalogdan`);
