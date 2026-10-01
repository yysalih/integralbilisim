import { Outlet, createFileRoute } from "@tanstack/react-router";

/**
 * Yalnızca sarmalayıcı. Head burada tanımlanmaz: layout hem /araclar hem de
 * alt araç sayfaları için çalıştığından, buraya konan canonical ve breadcrumb
 * alt sayfalara ikinci kez sızardı.
 */
export const Route = createFileRoute("/araclar")({
  component: () => <Outlet />,
});
