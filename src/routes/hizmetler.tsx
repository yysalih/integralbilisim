import { Outlet, createFileRoute } from "@tanstack/react-router";

/**
 * Yalnızca sarmalayıcı. Head burada tanımlanmaz: layout hem /hizmetler hem de
 * /hizmetler/$slug için çalıştığından, buraya konan canonical ve breadcrumb
 * alt sayfalara ikinci kez sızardı.
 */
export const Route = createFileRoute("/hizmetler")({
  component: () => <Outlet />,
});
