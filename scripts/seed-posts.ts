/**
 * Koddaki yazıları Supabase'e aktarır (slug bazlı upsert — tekrar çalıştırmak güvenli).
 *
 * Kullanım:
 *   SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... npm run seed
 */
import { createClient } from "@supabase/supabase-js";

import { BLOG_POSTS } from "../src/lib/blog";

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("SUPABASE_URL ve SUPABASE_SERVICE_ROLE_KEY gerekli.");
  process.exit(1);
}

const db = createClient(url, key, { auth: { persistSession: false } });

// Hangi projeye yazıldığı görünsün; yanlış URL ile başka projeye yazılmasın.
const ref = new URL(url).hostname.split(".")[0];
console.log(`hedef proje: ${ref}`);

const rows = BLOG_POSTS.map((p) => ({
  slug: p.slug,
  title: p.title,
  category: p.category,
  accent: p.accent,
  excerpt: p.excerpt,
  image: p.image,
  body: p.body,
  reading_minutes: p.readingMinutes,
  published_at: p.date,
  is_published: true,
}));

/**
 * "db push"tan hemen sonra çalıştırılırsa Supabase'in API katmanı yeni tabloyu
 * henüz önbelleğe almamış olabilir ("schema cache" hatası). Birkaç kez bekleyip
 * yeniden denenir.
 */
let error: { message: string } | null = null;
for (let attempt = 1; attempt <= 5; attempt++) {
  ({ error } = await db.from("posts").upsert(rows, { onConflict: "slug" }));
  if (!error || !/schema cache/i.test(error.message)) break;
  console.log(`tablo henüz API'de görünmüyor, ${attempt * 3} sn sonra tekrar denenecek...`);
  await new Promise((r) => setTimeout(r, attempt * 3000));
}
if (error) {
  console.error("Aktarım hatası:", error.message);
  if (/schema cache/i.test(error.message)) {
    console.error("İpucu: migration bu projeye uygulanmamış olabilir. `supabase migration list --linked` ile kontrol edin.");
  }
  process.exit(1);
}

const { count } = await db.from("posts").select("*", { count: "exact", head: true });
console.log(`aktarilan: ${rows.length} | tablodaki toplam: ${count}`);
