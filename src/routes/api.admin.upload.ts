import { createFileRoute } from "@tanstack/react-router";

/** Yönetim paneli görsel yükleme ucu; ayrıntı: src/lib/image-upload.server.ts */
export const Route = createFileRoute("/api/admin/upload")({
  server: {
    handlers: {
      OPTIONS: async ({ request }) => {
        const { handleImagePreflight } = await import("@/lib/image-upload.server");
        return handleImagePreflight(request);
      },
      // Diğer yöntemlerde boş bir sayfa değil, açık bir 405 dönsün.
      GET: () => new Response("Method Not Allowed", { status: 405, headers: { Allow: "POST" } }),
      POST: async ({ request }) => {
        const { handleImageUpload } = await import("@/lib/image-upload.server");
        return handleImageUpload(request);
      },
    },
  },
});
