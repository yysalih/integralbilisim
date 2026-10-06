import { BLOG_POSTS } from "@/lib/blog";
import type { FeedPost } from "@/lib/seo-files";
import { supabaseRead } from "@/lib/supabase.server";

const TTL_MS = 5 * 60_000;
let cache: { at: number; posts: FeedPost[] } | null = null;

const fromSnapshot = (): FeedPost[] =>
  BLOG_POSTS.map((p) => ({ slug: p.slug, title: p.title, date: p.date }));

/**
 * Sitemap ve llms.txt için yayımlanmış yazılar. Panelden eklenen/silinen yazı
 * en geç birkaç dakika içinde yansır. Veritabanı yapılandırılmamışsa ya da
 * erişilemiyorsa koddaki anlık görüntüye düşülür (blog listesiyle aynı kural).
 */
export const loadFeedPosts = async (): Promise<FeedPost[]> => {
  if (cache && Date.now() - cache.at < TTL_MS) return cache.posts;

  const db = supabaseRead();
  if (!db) return fromSnapshot();

  const { data, error } = await db
    .from("posts")
    .select("slug,title,published_at,updated_at")
    .eq("is_published", true)
    .order("published_at", { ascending: false });

  if (error) {
    console.error("[seo] Yazı listesi okunamadı:", error.message);
    return fromSnapshot();
  }

  const posts = (data as { slug: string; title: string; published_at: string; updated_at: string }[]).map(
    (r) => ({ slug: r.slug, title: r.title, date: r.published_at, updated: r.updated_at }),
  );
  cache = { at: Date.now(), posts };
  return posts;
};
