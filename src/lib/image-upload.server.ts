import { randomBytes } from "node:crypto";

import { requireAdmin } from "@/lib/admin-auth.server";
import { isBunnyConfigured, uploadToBunny } from "@/lib/bunny.server";

/** Panelden yüklenebilecek en büyük görsel. Daha büyüğü sayfayı yavaşlatır. */
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

/** Yükleme klasörleri. Yol /uploads/... olmalı: mediaUrl() bunu CDN'e yönlendirir. */
const FOLDERS = ["blog"] as const;

/**
 * Panel ayrı bir adreste (admin.integralbilisim.com) çalıştığı için bu uç farklı
 * kaynaktan çağrılır. Yalnızca listedeki kaynaklara izin verilir; çerez kullanılmaz
 * (kimlik Bearer jetonuyla gelir), dolayısıyla Allow-Credentials açılmaz.
 * Birden fazla kaynak virgülle: yerelde geliştirme için http://localhost:3000 eklenebilir.
 */
const allowedOrigins = () =>
  (process.env.ADMIN_ORIGIN ?? "https://admin.integralbilisim.com")
    .split(",")
    .map((o) => o.trim().replace(/\/$/, ""))
    .filter(Boolean);

const corsFor = (request: Request): Record<string, string> => {
  const origin = request.headers.get("origin");
  const base = { Vary: "Origin" };
  return origin && allowedOrigins().includes(origin)
    ? { ...base, "Access-Control-Allow-Origin": origin }
    : base;
};

const json = (status: number, body: Record<string, unknown>, cors: Record<string, string>) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      ...cors,
    },
  });

/** Tarayıcının POST öncesi sorduğu izin kontrolü (OPTIONS). */
export const handleImagePreflight = (request: Request): Response => {
  const cors = corsFor(request);
  if (!cors["Access-Control-Allow-Origin"]) return new Response(null, { status: 403, headers: cors });
  return new Response(null, {
    status: 204,
    headers: {
      ...cors,
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Authorization, Content-Type",
      "Access-Control-Max-Age": "86400",
    },
  });
};

/**
 * Dosyanın gerçek türünü ilk baytlarından çıkarır. İstemcinin söylediği
 * Content-Type ya da dosya adı güvenilmez; SVG bilerek yok (içine betik girebilir).
 */
const sniff = (b: Uint8Array): { ext: string; type: string } | null => {
  const at = (i: number, s: string) => [...s].every((c, k) => b[i + k] === c.charCodeAt(0));
  if (b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return { ext: "jpg", type: "image/jpeg" };
  if (b[0] === 0x89 && at(1, "PNG\r\n") && b[6] === 0x1a && b[7] === 0x0a) {
    return { ext: "png", type: "image/png" };
  }
  if (at(0, "RIFF") && at(8, "WEBP")) return { ext: "webp", type: "image/webp" };
  if (at(4, "ftyp") && (at(8, "avif") || at(8, "avis"))) return { ext: "avif", type: "image/avif" };
  return null;
};

const slugify = (name: string) =>
  name
    .replace(/\.[^.]*$/, "")
    .toLocaleLowerCase("tr")
    .replace(/ç/g, "c")
    .replace(/ğ/g, "g")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ş/g, "s")
    .replace(/ü/g, "u")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);

/**
 * POST /api/admin/upload — multipart/form-data: `file` (zorunlu), `folder` (varsayılan blog).
 * Başarıda: { ok, path, url }. Yazının `image` alanına `path` yazılır (mediaUrl onu CDN'e çevirir).
 */
export const handleImageUpload = async (request: Request): Promise<Response> => {
  const cors = corsFor(request);
  const json_ = (status: number, body: Record<string, unknown>) => json(status, body, cors);

  const auth = await requireAdmin(request);
  if (!auth.ok) return json_(auth.status, { ok: false, error: auth.message });

  if (!isBunnyConfigured) return json_(503, { ok: false, error: "Görsel deposu yapılandırılmamış." });

  // Gövdeyi belleğe almadan önce ilan edilen boyuta bak (üst sınır + form payı).
  const declared = Number(request.headers.get("content-length") ?? 0);
  if (declared > MAX_IMAGE_BYTES + 64 * 1024) {
    return json_(413, { ok: false, error: "Dosya çok büyük (en fazla 5 MB)." });
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return json_(400, { ok: false, error: "multipart/form-data bekleniyordu." });
  }

  const file = form.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return json_(400, { ok: false, error: "`file` alanında bir görsel gönderin." });
  }
  if (file.size > MAX_IMAGE_BYTES) {
    return json_(413, { ok: false, error: "Dosya çok büyük (en fazla 5 MB)." });
  }

  const folder = String(form.get("folder") ?? "blog");
  if (!(FOLDERS as readonly string[]).includes(folder)) {
    return json_(400, { ok: false, error: `Geçersiz klasör. İzinli: ${FOLDERS.join(", ")}.` });
  }

  const bytes = new Uint8Array(await file.arrayBuffer());
  const kind = sniff(bytes);
  if (!kind) {
    return json_(415, { ok: false, error: "Yalnızca JPEG, PNG, WebP ve AVIF görseller yüklenebilir." });
  }

  // Her yükleme benzersiz adla yazılır: CDN önbelleğini temizlemek gerekmez,
  // var olan bir dosya da ezilmez.
  const now = new Date();
  const dir = `uploads/${folder}/${now.getUTCFullYear()}/${String(now.getUTCMonth() + 1).padStart(2, "0")}`;
  const base = slugify(file.name) || "gorsel";
  const name = `${base}-${randomBytes(4).toString("hex")}.${kind.ext}`;

  const stored = await uploadToBunny(`${dir}/${name}`, bytes);
  if (!stored.ok) return json_(502, { ok: false, error: stored.error });

  const path = `/${dir}/${name}`;
  const cdn = (process.env.VITE_MEDIA_CDN_URL ?? "https://integralbilisim.b-cdn.net").replace(/\/$/, "");
  console.log(`[admin] Görsel yüklendi: ${path} (${bytes.length} bayt, ${auth.email ?? auth.userId})`);
  return json_(200, { ok: true, path, url: `${cdn}${path}`, bytes: bytes.length, type: kind.type });
};
