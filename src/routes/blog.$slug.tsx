import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { CtaSection } from "@/components/home/CtaSection";
import { formatPostDate } from "@/lib/blog";
import { listPosts, readPost } from "@/lib/blog.data";
import { mediaUrl } from "@/lib/media";
import { cn } from "@/lib/utils";
import { blogPostingSchema, breadcrumbSchema, jsonLd, pageHead } from "@/lib/seo";

export const Route = createFileRoute("/blog/$slug")({
  loader: async ({ params }) => {
    const post = await readPost({ data: { slug: params.slug } });
    if (!post) throw notFound();
    // İlgili yazılar aynı istekte gelsin; ikinci tur gidip gelme olmasın.
    const all = await listPosts();
    return { post, all };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {};
    const { post } = loaderData;
    return {
      ...pageHead({
        title: `${post.title} | İntegral Bilişim`,
        description: post.excerpt,
        path: `/blog/${post.slug}`,
        image: `/og/blog-${post.slug}.png`,
        type: "article",
        publishedTime: post.date,
      }),
      scripts: [
        jsonLd(blogPostingSchema(post)),
        jsonLd(
          breadcrumbSchema([
            { name: "Ana Sayfa", path: "/" },
            { name: "Blog", path: "/blog" },
            { name: post.title, path: `/blog/${post.slug}` },
          ]),
        ),
      ],
    };
  },
  component: BlogPostPage,
});

function BlogPostPage() {
  const { post, all } = Route.useLoaderData();
  const others = all.filter((p) => p.slug !== post.slug).slice(0, 3);

  return (
    <>
      <article className="relative overflow-hidden bg-background pb-20 pt-24 md:pb-28 md:pt-28">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-[45%]"
          style={{
            background: `radial-gradient(90% 60% at 50% 0%, ${post.accent}1f 0%, transparent 72%)`,
          }}
        />

        <div className="container relative mx-auto max-w-3xl px-4">
          <Link
            to="/blog"
            className="inline-flex w-fit items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Tüm yazılar
          </Link>

          <span
            className="mt-7 block w-fit rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wider"
            style={{ backgroundColor: `${post.accent}1a`, color: post.accent }}
          >
            {post.category}
          </span>

          <h1
            className="mt-4 font-bold text-foreground"
            style={{
              fontSize: "clamp(1.9rem, 4.4vw, 3.1rem)",
              lineHeight: 1.06,
              letterSpacing: "-0.035em",
            }}
          >
            {post.title}
          </h1>

          <p className="mt-4 text-sm text-muted-foreground">
            {formatPostDate(post.date)} · {post.readingMinutes} dk okuma
          </p>

          <div
            className="mt-9 overflow-hidden rounded-3xl ring-1 ring-black/[0.06]"
            style={{ boxShadow: `0 24px 60px -28px ${post.accent}59` }}
          >
            <img
              src={mediaUrl(post.image)}
              alt=""
              aria-hidden="true"
              className="aspect-[16/9] w-full object-cover"
            />
          </div>

          <div className="mt-10 space-y-7">
            {post.body.map((block, i) => (
              <div key={i}>
                {block.heading && (
                  <h2
                    className="mb-3 text-xl font-bold text-foreground md:text-2xl"
                    style={{ letterSpacing: "-0.022em" }}
                  >
                    {block.heading}
                  </h2>
                )}
                <p className="leading-[1.75] text-muted-foreground">{block.text}</p>
              </div>
            ))}
          </div>

        </div>
      </article>

      {others.length > 0 && (
        <section className="bg-background pb-20 md:pb-28">
          <div className="container mx-auto px-4">
            <h2
              className="text-2xl font-bold text-foreground md:text-3xl"
              style={{ letterSpacing: "-0.028em" }}
            >
              Diğer yazılar
            </h2>
            <div className="mt-8 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
              {others.map((p) => (
                <Link key={p.slug} to="/blog/$slug" params={{ slug: p.slug }} className="group block">
                  <div className="overflow-hidden rounded-2xl ring-1 ring-black/[0.06]">
                    <img
                      src={mediaUrl(p.image)}
                      alt=""
                      aria-hidden="true"
                      loading="lazy"
                      className={cn(
                        "aspect-[4/3] w-full object-cover",
                        "transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]",
                      )}
                    />
                  </div>
                  <p
                    className="mt-4 text-[11px] font-semibold uppercase tracking-wider"
                    style={{ color: p.accent }}
                  >
                    {p.category}
                  </p>
                  <h3 className="mt-1.5 font-bold text-foreground transition-colors group-hover:text-accent">
                    {p.title}
                  </h3>
                  <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-accent">
                    Oku
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <CtaSection />
    </>
  );
}
