/**
 * Bunny Storage istemcisi (yalnızca sunucu). Anahtar tarayıcıya inmez.
 *
 *  BUNNY_STORAGE_ZONE  Storage Zone adı
 *  BUNNY_STORAGE_KEY   Storage Zone parolası (FTP & API Access > Password)
 *  BUNNY_STORAGE_HOST  Bölge uç noktası; varsayılan storage.bunnycdn.com (Falkenstein).
 *                      Başka bölge: ny.storage.bunnycdn.com, la.storage.bunnycdn.com ...
 *
 * Dosyalar, CDN adresiyle (VITE_MEDIA_CDN_URL) aynı yoldan yayımlanır: zone'a
 * /uploads/x.jpg yazılan dosya CDN'de https://<cdn>/uploads/x.jpg olur.
 */
const zone = process.env.BUNNY_STORAGE_ZONE;
const key = process.env.BUNNY_STORAGE_KEY;
const host = (process.env.BUNNY_STORAGE_HOST ?? "storage.bunnycdn.com").replace(/\/$/, "");
const base = /^https?:\/\//.test(host) ? host : `https://${host}`;

export const isBunnyConfigured = Boolean(zone && key);

/** `path` başında / olmayan, zone köküne göreli yoldur: uploads/blog/2026/10/a.jpg */
export const uploadToBunny = async (
  path: string,
  bytes: Uint8Array<ArrayBuffer>,
): Promise<{ ok: true } | { ok: false; error: string }> => {
  if (!zone || !key) return { ok: false, error: "Bunny yapılandırılmamış." };
  try {
    const res = await fetch(`${base}/${zone}/${path}`, {
      method: "PUT",
      headers: { AccessKey: key, "Content-Type": "application/octet-stream" },
      body: bytes,
      signal: AbortSignal.timeout(20_000),
    });
    if (!res.ok) {
      console.error("[bunny] Yükleme reddedildi:", res.status, (await res.text()).slice(0, 200));
      return { ok: false, error: `Bunny ${res.status} döndürdü.` };
    }
    return { ok: true };
  } catch (err) {
    console.error("[bunny] Yükleme başarısız:", err instanceof Error ? err.message : err);
    return { ok: false, error: "Bunny'ye ulaşılamadı." };
  }
};
