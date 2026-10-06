import { createFileRoute } from "@tanstack/react-router";

import { renderLlms } from "@/lib/seo-files";

/** LLM'ler için site özeti; blog listesi veritabanından canlı gelir. */
export const Route = createFileRoute("/llms.txt")({
  server: {
    handlers: {
      GET: async () => {
        const { loadFeedPosts } = await import("@/lib/seo-content.server");
        return new Response(renderLlms(await loadFeedPosts()), {
          headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Cache-Control": "public, max-age=600",
          },
        });
      },
    },
  },
});
