const CDN_BASE = (import.meta.env.VITE_MEDIA_CDN_URL ?? "https://integralbilisim.b-cdn.net").replace(
  /\/$/,
  "",
);

/** Projede (public/) duran varlıklar CDN'e yönlendirilmez. */
const LOCAL_PREFIXES = ["/app/", "/blog/", "/isler/", "/referanslar/", "/videolar/", "/logo-"];

/** Tüm asset URL'leri buradan geçer; hiçbir src hardcode edilmez. */
export const mediaUrl = (path: string) => {
  const p = path.startsWith("/") ? path : `/${path}`;
  if (LOCAL_PREFIXES.some((prefix) => p.startsWith(prefix))) return p;
  return `${CDN_BASE}${p}`;
};
