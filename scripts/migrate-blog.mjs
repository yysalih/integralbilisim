import { parse } from "node-html-parser";
import { writeFileSync, mkdirSync } from "node:fs";

const UA = { "user-agent": "Mozilla/5.0 (compatible; IntegralMigration/1.0)" };
const SP = process.env.SP;
const FAMILIES = [
  /^(.+)-logo-tasarimi$/, /^(.+)-hazir-web-sitesi$/, /^(.+)-web-sitesi$/, /^(.+)-web-tasarimi?$/,
  /^(.+)-seo-hizmeti$/, /^(.+)-(google-)?adwords-reklamlari$/, /^(.+)-(marka-)?tescili-hizmeti$/,
  /^(.+)-(sosyal-)?medya-danismanligi$/,
];

const sitemapUrls = async () => {
  const out = [];
  for (let i = 1; i <= 4; i++) {
    const xml = await (await fetch(`https://integralbilisim.com/post-sitemap${i}.xml`, { headers: UA })).text();
    for (const m of xml.matchAll(/<url>\s*<loc>(.*?)<\/loc>(?:\s*<lastmod>(.*?)<\/lastmod>)?/gs))
      out.push({ url: m[1], lastmod: m[2] ?? "" });
  }
  return out;
};

const clean = (t) => t.replace(/ /g, " ").replace(/\s+/g, " ").trim();

export const extract = (html, url) => {
  const root = parse(html, { comment: false });
  root.querySelectorAll("script,style,noscript,nav,header,footer,form,iframe").forEach((n) => n.remove());

  const title = clean(
    root.querySelector('meta[property="og:title"]')?.getAttribute("content") ??
      root.querySelector("h1")?.text ??
      root.querySelector("title")?.text ??
      "",
  )
    .replace(/\s*[-–|]\s*İntegral Bilişim.*$/i, "")
    .replace(/\s*[-–|]\s*$/, "");

  // WordPress yayın tarihi: JSON-LD ya da <time>
  let date = "";
  for (const s of root.querySelectorAll('script[type="application/ld+json"]')) {
    const m = s.text.match(/"datePublished"\s*:\s*"([^"]+)"/);
    if (m) { date = m[1].slice(0, 10); break; }
  }
  if (!date) date = root.querySelector("time[datetime]")?.getAttribute("datetime")?.slice(0, 10) ?? "";

  const image = root.querySelector('meta[property="og:image"]')?.getAttribute("content") ?? "";

  // İçerik gövdesi: en çok paragraf barındıran kap
  const candidates = root.querySelectorAll("article, .entry-content, .elementor-widget-theme-post-content, main, .post-content");
  let best = null, bestScore = 0;
  for (const c of candidates) {
    const score = c.querySelectorAll("p").reduce((n, p) => n + clean(p.text).length, 0);
    if (score > bestScore) { best = c; bestScore = score; }
  }
  const scope = best ?? root;

  const body = [];
  let pendingHeading;
  for (const el of scope.querySelectorAll("h2,h3,p,li")) {
    const text = clean(el.text);
    if (!text || text.length < 25) {
      if (/^h[23]$/i.test(el.rawTagName) && text) pendingHeading = text;
      continue;
    }
    if (/^h[23]$/i.test(el.rawTagName)) { pendingHeading = text; continue; }
    if (/^(İntegral Bilişim|Paylaş|Önceki|Sonraki|Kategoriler?)$/i.test(text)) continue;
    if (body.some((b) => b.text === text)) continue;
    body.push(pendingHeading ? { heading: pendingHeading, text } : { text });
    pendingHeading = undefined;
  }

  const words = body.reduce((n, b) => n + b.text.split(/\s+/).length, 0);
  return { url, slug: decodeURIComponent(url.replace(/\/$/, "").split("/").pop()), title, date, image, body, words };
};

/** Blog dizini, hizmet sayfası gibi yazı olmayan adresler. */
const NOT_A_POST = new Set([
  "blog", "web-sitesi", "hazir-web-site", "web-tasarim", "e-ticaret",
  "iletisim", "hakkimizda", "referanslar",
]);

const all = await sitemapUrls();
const candidates = all.filter(({ url }) => {
  const slug = decodeURIComponent(url.replace(/\/$/, "").split("/").pop());
  return !FAMILIES.some((re) => re.test(slug)) && !NOT_A_POST.has(slug);
});
console.log(`aday yazi: ${candidates.length}`);

const posts = [];
const fail = [];
let done = 0;
const queue = [...candidates];
const worker = async () => {
  while (queue.length) {
    const item = queue.shift();
    try {
      const res = await fetch(item.url, { headers: UA });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const p = extract(await res.text(), item.url);
      // Yayın tarihi sayfada yoksa sitemap'teki lastmod kullanılır.
      if (!p.date && item.lastmod) p.date = item.lastmod.slice(0, 10);
      posts.push(p);
    } catch (e) {
      fail.push({ url: item.url, error: String(e).slice(0, 80) });
    }
    if (++done % 20 === 0) console.log(`  ${done}/${candidates.length}`);
  }
};
await Promise.all(Array.from({ length: 6 }, worker));

// Her yazıda tekrarlayan kalıp metinleri (menü, altbilgi kalıntısı) ayıkla.
const freq = new Map();
for (const p of posts) for (const b of new Set(p.body.map((x) => x.text))) freq.set(b, (freq.get(b) ?? 0) + 1);
const boiler = new Set([...freq].filter(([, n]) => n > posts.length * 0.25).map(([t]) => t));
for (const p of posts) {
  p.body = p.body.filter((b) => !boiler.has(b.text));
  p.words = p.body.reduce((n, b) => n + b.text.split(/\s+/).length, 0);
}

posts.sort((a, b) => (b.date || "").localeCompare(a.date || ""));
writeFileSync(`${SP}/posts.json`, JSON.stringify(posts, null, 1));
console.log(`\nkazinan: ${posts.length} | hatali: ${fail.length} | kalip metin ayiklandi: ${boiler.size}`);
console.log(`kelime dagilimi: <150 -> ${posts.filter((p) => p.words < 150).length}, 150-400 -> ${posts.filter((p) => p.words >= 150 && p.words < 400).length}, 400+ -> ${posts.filter((p) => p.words >= 400).length}`);
console.log(`tarihi olmayan: ${posts.filter((p) => !p.date).length} | gorseli olmayan: ${posts.filter((p) => !p.image).length}`);
if (fail.length) console.log("hatalar:", fail.slice(0, 5));
