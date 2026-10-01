import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { BLOG_POSTS, type BlogPost } from "@/lib/blog";

interface PostRow {
  slug: string;
  title: string;
  category: string;
  accent: string;
  excerpt: string;
  image: string;
  body: BlogPost["body"];
  reading_minutes: number;
  published_at: string;
}

const toPost = (r: PostRow): BlogPost => ({
  slug: r.slug,
  title: r.title,
  category: r.category,
  accent: r.accent,
  date: r.published_at,
  readingMinutes: r.reading_minutes,
  excerpt: r.excerpt,
  image: r.image,
  body: r.body ?? [],
});

const COLUMNS = "slug,title,category,accent,excerpt,image,body,reading_minutes,published_at";
/** Liste ve ilgili yazılar için gövde gereksiz; sayfaya gömülen veri küçülür. */
const SUMMARY_COLUMNS = "slug,title,category,accent,excerpt,image,reading_minutes,published_at";

/** Kart görünümü için gereken alanlar. */
export type PostSummary = Omit<BlogPost, "body">;

const toSummary = (r: Omit<PostRow, "body">): PostSummary => ({
  slug: r.slug,
  title: r.title,
  category: r.category,
  accent: r.accent,
  date: r.published_at,
  readingMinutes: r.reading_minutes,
  excerpt: r.excerpt,
  image: r.image,
});

/**
 * Supabase istemcisi yalnızca sunucuda yüklenir. Statik içe aktarım, bu modül
 * rotalardan çağrıldığı için istemci paketinde yasaklanıyor.
 */
const readClient = async () => (await import("@/lib/supabase.server")).supabaseRead();

/**
 * Yazı listesi.
 *
 * Supabase yapılandırılmamışsa ya da erişilemiyorsa koddaki statik anlık
 * görüntü kullanılır. Veritabanı erişilebilir olduğunda tek doğru kaynak odur.
 */
export const listPosts = createServerFn({ method: "GET" }).handler(
  async (): Promise<PostSummary[]> => {
    const db = await readClient();
    const fallback = () => BLOG_POSTS.map(({ body: _body, ...rest }) => rest);
    if (!db) return fallback();

    const { data, error } = await db
      .from("posts")
      .select(SUMMARY_COLUMNS)
      .eq("is_published", true)
      .order("published_at", { ascending: false });

    // Yalnızca hata durumunda statik anlık görüntüye düşülür. Veritabanı
    // erişilebilir ve boşsa blog da boştur: panelden silinen yazı geri dirilmez.
    if (error) {
      console.error("[blog] Supabase listesi okunamadı:", error.message);
      return fallback();
    }
    return (data as Omit<PostRow, "body">[]).map(toSummary);
  },
);

/** Tek yazı; bulunamazsa null döner (rota 404 gösterir). */
export const readPost = createServerFn({ method: "GET" })
  .validator((data: { slug: string }) => z.object({ slug: z.string().max(200) }).parse(data))
  .handler(async ({ data }): Promise<BlogPost | null> => {
    const db = await readClient();
    if (!db) return BLOG_POSTS.find((p) => p.slug === data.slug) ?? null;

    const { data: row, error } = await db
      .from("posts")
      .select(COLUMNS)
      .eq("slug", data.slug)
      .eq("is_published", true)
      .maybeSingle();

    if (error) {
      console.error("[blog] Supabase yazısı okunamadı:", error.message);
      return BLOG_POSTS.find((p) => p.slug === data.slug) ?? null;
    }
    return row ? toPost(row as PostRow) : null;
  });
