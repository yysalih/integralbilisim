type ParamValue = string | number | boolean | null | undefined;
type Params = Record<string, ParamValue>;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * GA4 olayı gönderir. gtag yalnızca ziyaretçi analitik çerezini kabul edince
 * tanımlanır (bkz. CookieNotice); onay yoksa çağrı sessizce hiçbir şey yapmaz.
 */
export const track = (event: string, params: Params = {}) => {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  const clean: Record<string, string | number | boolean> = {
    page_path: window.location.pathname,
  };
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null && v !== "") clean[k] = v;
  }
  try {
    window.gtag("event", event, clean);
  } catch {
    /* ölçüm hatası siteyi etkilememeli */
  }
};

/** Tıklamanın sayfada nerede olduğunu söyler: data-track-location, yoksa en yakın bölge. */
const locationOf = (el: Element): string => {
  const tagged = el.closest<HTMLElement>("[data-track-location]");
  if (tagged?.dataset.trackLocation) return tagged.dataset.trackLocation;
  if (el.closest("header")) return "header";
  if (el.closest("footer")) return "footer";
  const section = el.closest<HTMLElement>("section[id]");
  return section?.id || "page";
};

/** Bağlantıdan hangi olayın doğacağını belirler; ilgisiz bağlantılar için null döner. */
const classify = (a: HTMLAnchorElement): { event: string; params: Params } | null => {
  const href = a.getAttribute("href") ?? "";
  if (href.startsWith("tel:")) {
    return { event: "phone_click", params: { phone: href.slice(4) } };
  }
  if (href.startsWith("mailto:")) {
    return { event: "email_click", params: {} };
  }
  let url: URL;
  try {
    url = new URL(href, window.location.origin);
  } catch {
    return null;
  }
  if (url.hostname === "wa.me" || url.hostname === "api.whatsapp.com") {
    return { event: "whatsapp_click", params: {} };
  }
  if (url.origin !== window.location.origin) return null;
  if (url.pathname.startsWith("/teklif")) return { event: "cta_quote_click", params: {} };
  if (url.pathname.startsWith("/araclar/site-analizi")) {
    return { event: "cta_audit_click", params: {} };
  }
  return null;
};

/** Sayfa genelinde tel:, mailto:, WhatsApp ve teklif/analiz bağlantı tıklamalarını ölçer. */
export const attachClickTracking = (): (() => void) => {
  const onClick = (e: MouseEvent) => {
    const target = e.target;
    if (!(target instanceof Element)) return;
    const a = target.closest("a");
    if (!a) return;
    const hit = classify(a);
    if (!hit) return;
    track(hit.event, {
      ...hit.params,
      location: locationOf(a),
      link_text: (a.getAttribute("aria-label") || a.textContent || "").trim().slice(0, 60),
    });
  };
  document.addEventListener("click", onClick, { capture: true });
  return () => document.removeEventListener("click", onClick, { capture: true });
};
