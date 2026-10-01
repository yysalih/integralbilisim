import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

import { CtaSection } from "@/components/home/CtaSection";
import { formatPostDate } from "@/lib/blog";
import { listPosts, type PostSummary } from "@/lib/blog.data";
import { mediaUrl } from "@/lib/media";
import { useMemo, useState } from "react";

import { useRevealOnce } from "@/hooks/useRevealOnce";
import { cn } from "@/lib/utils";
import { breadcrumbSchema, jsonLd, pageHead } from "@/lib/seo";

export const Route = createFileRoute("/blog/")({
  head: () => {
    const base = pageHead({
      title: "Blog | İntegral Bilişim",
      description:
        "Web tasarım, SEO, e-ticaret ve dijital pazarlama üzerine yazılar. İntegral Bilişim blog.",
      path: "/blog",
      image: "/og/blog.png",
    });
    return {
      ...base,
      scripts: [
        jsonLd(
          breadcrumbSchema([
            { name: "Ana Sayfa", path: "/" },
            { name: "Blog", path: "/blog" },
          ]),
        ),
      ],
    };
  },
  loader: () => listPosts(),
  component: BlogIndexPage,
});

/** Bir seferde gösterilen yazı sayısı; 81 yazı tek sayfaya sığmaz. */
const PAGE_SIZE = 18;

function BlogIndexPage() {
  const posts = Route.useLoaderData();
  const [category, setCategory] = useState<string>("Tümü");
  const [limit, setLimit] = useState(PAGE_SIZE);

  const categories = useMemo(
    () => ["Tümü", ...[...new Set(posts.map((p) => p.category))].sort()],
    [posts],
  );
  const filtered = useMemo(
    () => (category === "Tümü" ? posts : posts.filter((p) => p.category === category)),
    [posts, category],
  );
  const visible = filtered.slice(0, limit);

  return (
    <>
      <section className="relative overflow-hidden bg-background pb-16 pt-28 md:pb-20 md:pt-32">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-[70%]"
          style={{
            background:
              "radial-gradient(100% 60% at 50% 0%, color-mix(in oklch, var(--color-accent) 10%, transparent) 0%, transparent 72%)",
          }}
        />
        <div className="container relative mx-auto px-4 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent">Yazılar</p>
          <h1
            className="mx-auto mt-5 max-w-3xl font-bold text-foreground"
            style={{
              fontSize: "clamp(2rem, 4.8vw, 3.5rem)",
              lineHeight: 1.06,
              letterSpacing: "-0.035em",
            }}
          >
            Dijitalde doğru bilinen yanlışlar.
          </h1>
          <p className="mx-auto mt-5 max-w-xl leading-relaxed text-muted-foreground">
            Web sitesi, SEO ve e-ticaret tarafında sık sorulan soruları sade bir dille
            cevaplıyoruz.
          </p>
        </div>
      </section>

      <section className="bg-background pb-20 md:pb-28">
        <div className="container mx-auto px-4">
          <div className="mb-10 flex flex-wrap justify-center gap-2">
            {categories.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => {
                  setCategory(c);
                  setLimit(PAGE_SIZE);
                }}
                className={cn(
                  "rounded-full border px-4 py-2 text-xs font-semibold transition-colors",
                  category === c
                    ? "border-transparent bg-accent text-white"
                    : "border-border text-muted-foreground hover:bg-muted",
                )}
              >
                {c}
                {c !== "Tümü" && (
                  <span className="ml-1.5 opacity-50">
                    {posts.filter((p) => p.category === c).length}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((post, i) => (
              <PostCard key={post.slug} post={post} index={i} />
            ))}
          </div>

          {visible.length < filtered.length && (
            <div className="mt-14 text-center">
              <button
                type="button"
                onClick={() => setLimit((n) => n + PAGE_SIZE)}
                className="rounded-full border border-border px-7 py-3.5 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
              >
                Daha fazla yazı
                <span className="ml-2 text-muted-foreground">
                  {visible.length} / {filtered.length}
                </span>
              </button>
            </div>
          )}
        </div>
      </section>

      <CtaSection />
    </>
  );
}

/** Çerçevesiz editoryal kart: çıplak görsel, altında meta ve başlık. */
function PostCard({ post, index }: { post: PostSummary; index: number }) {
  // Gözlemci kart başına: ızgara ekrandan uzun olduğunda tek bir kap gözlemcisi
  // eşiği hiçbir zaman yakalayamaz ve kartlar görünmez kalırdı.
  const { ref, revealed } = useRevealOnce<HTMLAnchorElement>(0.15);

  return (
    <Link
      ref={ref}
      to="/blog/$slug"
      params={{ slug: post.slug }}
      className={cn(
        "group block transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]",
        "active:scale-[0.99] active:duration-100",
        revealed ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0",
      )}
      // Kademeli giriş yalnızca satır içinde; uzun listede toplam gecikme büyümesin.
      style={{ transitionDelay: revealed ? `${(index % 3) * 70}ms` : "0ms" }}
    >
      <div className="overflow-hidden rounded-2xl ring-1 ring-black/[0.06]">
        <img
          src={mediaUrl(post.image)}
          alt=""
          aria-hidden="true"
          loading="lazy"
          className="aspect-[4/3] w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
        />
      </div>

      <span
        className="mt-5 inline-flex rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wider"
        style={{ backgroundColor: `${post.accent}1a`, color: post.accent }}
      >
        {post.category}
      </span>

      <p className="mt-3 text-xs text-muted-foreground">
        {formatPostDate(post.date)} · {post.readingMinutes} dk okuma
      </p>

      <h2
        className="mt-2 text-xl font-bold text-foreground transition-colors group-hover:text-accent"
        style={{ letterSpacing: "-0.02em", lineHeight: 1.2 }}
      >
        {post.title}
      </h2>

      <p className="mt-2.5 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
        {post.excerpt}
      </p>

      <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-accent">
        Yazıyı oku
        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" />
      </span>
    </Link>
  );
}
