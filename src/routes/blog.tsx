import { Outlet, createFileRoute } from "@tanstack/react-router";

/**
 * Yalnızca sarmalayıcı. Head burada tanımlanmaz: layout hem /blog hem de
 * /blog/$slug için çalıştığından, buraya konan canonical ve breadcrumb
 * yazı sayfalarına ikinci kez sızardı.
 */
export const Route = createFileRoute("/blog")({
  component: () => <Outlet />,
});
