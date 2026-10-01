/**
 * Eski WordPress sitesinin içeriğini REST API üzerinden arşivler.
 *
 * Domain yeni siteye geçtiğinde eski site ve API'si ortadan kalkar; bu yüzden
 * arşiv taşımadan ÖNCE alınır ve repoda saklanır. Sonradan yazı geri getirmek,
 * yeniden üretmek ya da panele aktarmak bu arşivden yapılır.
 *
 * Kullanım: node scripts/export-wordpress.mjs [https://integralbilisim.com]
 * Çıktı:    scripts/data/wordpress/{posts,pages,categories,tags,media}.json
 *
 * Not: Medya DOSYALARI indirilmez, yalnızca adres ve bilgileri saklanır.
 * Dosyaların kendisi için DirectAdmin'den wp-content/uploads yedeği alın.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const SITE = (process.argv[2] ?? "https://integralbilisim.com").replace(/\/$/, "");
const OUT = resolve(import.meta.dirname, "data/wordpress");
mkdirSync(OUT, { recursive: true });
const UA = { "user-agent": "Mozilla/5.0 (compatible; IntegralArchive/1.0)" };

const COLLECTIONS = {
  posts: "id,date,modified,slug,link,status,title,content,excerpt,featured_media,categories,tags,yoast_head_json",
  pages: "id,date,modified,slug,link,parent,status,title,content,excerpt,featured_media,yoast_head_json",
  categories: "id,count,name,slug,parent,description",
  tags: "id,count,name,slug",
  media: "id,date,slug,source_url,mime_type,alt_text,media_details,post",
};

const fetchAll = async (type, fields) => {
  const items = [];
  for (let page = 1; ; page++) {
    const url = `${SITE}/wp-json/wp/v2/${type}?per_page=100&page=${page}&_fields=${fields}`;
    const res = await fetch(url, { headers: UA });
    if (res.status === 400) break; // sayfa aralığı bitti
    if (!res.ok) throw new Error(`${type} sayfa ${page}: HTTP ${res.status}`);
    const batch = await res.json();
    items.push(...batch);
    const totalPages = Number(res.headers.get("x-wp-totalpages") ?? 1);
    if (page >= totalPages) break;
  }
  return items;
};

for (const [type, fields] of Object.entries(COLLECTIONS)) {
  const items = await fetchAll(type, fields);
  // Medya için dosya boyutu dışındaki büyük ayrıntıları sadeleştir
  const slim = type === "media"
    ? items.map(({ media_details, ...m }) => ({ ...m, width: media_details?.width, height: media_details?.height, filesize: media_details?.filesize }))
    : items;
  writeFileSync(resolve(OUT, `${type}.json`), JSON.stringify(slim, null, 1));
  console.log(`${type.padEnd(11)} ${String(items.length).padStart(4)} kayit`);
}
console.log(`\narsiv: ${OUT}`);
