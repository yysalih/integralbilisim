import { createFileRoute } from "@tanstack/react-router";

import { renderSitemap } from "@/lib/seo-files";

/** Yayımlanmış blog yazılarını veritabanından okuyan canlı sitemap. */
export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const { loadFeedPosts } = await import("@/lib/seo-content.server");
        return new Response(renderSitemap(await loadFeedPosts()), {
          headers: {
            "Content-Type": "application/xml; charset=utf-8",
            "Cache-Control": "public, max-age=600",
          },
        });
      },
    },
  },
});
