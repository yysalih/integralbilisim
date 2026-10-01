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

const { error } = await db.from("posts").upsert(rows, { onConflict: "slug" });
if (error) {
  console.error("Aktarım hatası:", error.message);
  process.exit(1);
}

const { count } = await db.from("posts").select("*", { count: "exact", head: true });
console.log(`aktarilan: ${rows.length} | tablodaki toplam: ${count}`);
