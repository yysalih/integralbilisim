import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { lookup } from "node:dns/promises";
import { isIP } from "node:net";

import { analyzeHtml, type PageInput } from "@/lib/audit/analyze";
import { psiToCategory, type PsiPayload } from "@/lib/audit/psi";
import type { CategoryResult } from "@/lib/audit/types";

const PAGE_TIMEOUT_MS = 10_000;
const MAX_REDIRECTS = 3;
const MAX_BYTES = 3_000_000;
const CACHE_TTL_MS = 24 * 60 * 60 * 1000;

/** Aynı adres 24 saat boyunca yeniden taranmaz (maliyet ve hız). */
const cache = new Map<string, { at: number; value: AuditServerResult }>();

export interface AuditServerResult {
  finalUrl: string;
  fetchedAt: string;
  categories: CategoryResult[];
  bytes: number;
}

const inputSchema = z.object({
  url: z.string().min(4).max(2000),
});

/** Özel ağ aralıkları — SSRF koruması. */
const isPrivateIp = (ip: string) => {
  if (isIP(ip) === 6) {
    const v = ip.toLowerCase();
    return (
      v === "::1" ||
      v.startsWith("fc") ||
      v.startsWith("fd") ||
      v.startsWith("fe80") ||
      v.startsWith("::ffff:")
    );
  }
  const [a, b] = ip.split(".").map(Number);
  return (
    a === 10 ||
    a === 127 ||
    a === 0 ||
    (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 && b === 168) ||
    (a === 169 && b === 254) ||
    (a === 100 && b >= 64 && b <= 127)
  );
};

const assertPublicUrl = async (raw: string) => {
  let u: URL;
  try {
    u = new URL(raw);
  } catch {
    throw new Error("Adres okunamadı. Örnek: https://siteniz.com");
  }
  if (u.protocol !== "http:" && u.protocol !== "https:") {
    throw new Error("Yalnızca http ve https adresleri taranabilir.");
  }
  const host = u.hostname.replace(/^\[|\]$/g, "");
  if (host === "localhost" || host.endsWith(".local") || host.endsWith(".internal")) {
    throw new Error("Yerel ağ adresleri taranamaz.");
  }
  const ip = isIP(host) ? host : (await lookup(host)).address;
  if (isPrivateIp(ip)) throw new Error("Yerel ağ adresleri taranamaz.");
  return u;
};

const timedFetch = async (url: string, init?: RequestInit) => {
  const ac = new AbortController();
  const timer = setTimeout(() => ac.abort(), PAGE_TIMEOUT_MS);
  try {
    return await fetch(url, {
      ...init,
      signal: ac.signal,
      redirect: "manual",
      headers: {
        "user-agent":
          "Mozilla/5.0 (compatible; IntegralSiteAudit/1.0; +https://integralbilisim.com/araclar/site-analizi)",
        accept: "text/html,application/xhtml+xml",
        ...(init?.headers ?? {}),
      },
    });
  } finally {
    clearTimeout(timer);
  }
};

/** Yönlendirme zincirini adım adım, her adımda SSRF kontrolüyle takip eder. */
const fetchFollowing = async (start: URL) => {
  let current = start;
  for (let i = 0; i <= MAX_REDIRECTS; i++) {
    const res = await timedFetch(current.toString());
    if (res.status >= 300 && res.status < 400) {
      const loc = res.headers.get("location");
      if (!loc) return { res, url: current };
      const next = new URL(loc, current);
      await assertPublicUrl(next.toString());
      current = next;
      continue;
    }
    return { res, url: current };
  }
  throw new Error("Çok fazla yönlendirme var; adres kontrol edilmeli.");
};

/** Yalnızca durum kodu gereken yardımcı istekler. */
const probe = async (url: URL) => {
  try {
    const res = await timedFetch(url.toString());
    if (res.status >= 300 && res.status < 400) {
      const loc = res.headers.get("location");
      if (loc) {
        const r2 = await timedFetch(new URL(loc, url).toString());
        return { status: r2.status, body: await safeText(r2) };
      }
    }
    return { status: res.status, body: await safeText(res) };
  } catch {
    return { status: 0, body: "" };
  }
};

const safeText = async (res: Response) => {
  try {
    const t = await res.text();
    return t.slice(0, 4000);
  } catch {
    return "";
  }
};

/**
 * Hedef sitenin ana sayfasını çeker ve HTML'den ölçülebilen dört kategoriyi
 * hesaplar. Hız kategorisi tarayıcı tarafında PageSpeed Insights ile ölçülür;
 * uzun sürdüğü için sunucu isteğine dahil edilmez.
 */
export const auditSite = createServerFn({ method: "POST" })
  .validator((data: { url: string }) => inputSchema.parse(data))
  .handler(async ({ data }): Promise<AuditServerResult> => {
    const raw = /^https?:\/\//i.test(data.url) ? data.url : `https://${data.url}`;
    const start = await assertPublicUrl(raw);

    const cached = cache.get(start.origin + start.pathname);
    if (cached && Date.now() - cached.at < CACHE_TTL_MS) return cached.value;

    const { res, url: finalUrl } = await fetchFollowing(start);
    if (!res.ok) {
      throw new Error(
        `Site ${res.status} yanıtı verdi. Adres doğru mu, site şu an açık mı kontrol edin.`,
      );
    }

    const buf = await res.arrayBuffer();
    if (buf.byteLength > MAX_BYTES) {
      throw new Error("Sayfa çok büyük olduğu için taranamadı.");
    }
    const html = new TextDecoder("utf-8").decode(buf);

    const [robots, sitemapRoot, notFound] = await Promise.all([
      probe(new URL("/robots.txt", finalUrl)),
      probe(new URL("/sitemap.xml", finalUrl)),
      probe(new URL(`/integral-analiz-${Date.now().toString(36)}`, finalUrl)),
    ]);

    // robots.txt içinde sitemap satırı da geçerli sayılır.
    const sitemapDeclared = /sitemap:\s*http/i.test(robots.body);

    const input: PageInput = {
      html,
      finalUrl: finalUrl.toString(),
      robotsOk: robots.status === 200 && robots.body.length > 0,
      sitemapOk: sitemapRoot.status === 200 || sitemapDeclared,
      notFoundOk: notFound.status === 404 || notFound.status === 410,
      bytes: buf.byteLength,
    };

    const value: AuditServerResult = {
      finalUrl: input.finalUrl,
      fetchedAt: new Date().toISOString(),
      categories: analyzeHtml(input),
      bytes: buf.byteLength,
    };

    cache.set(start.origin + start.pathname, { at: Date.now(), value });
    return value;
  });

const leadSchema = z.object({
  email: z.string().email("Geçerli bir e-posta girin"),
  targetUrl: z.string().max(2000),
  score: z.number().int().min(0).max(100),
  criticalCount: z.number().int().min(0).max(100),
  consentKvkk: z.boolean().refine((v) => v === true, { message: "KVKK onayı gerekli" }),
  consentMarketing: z.boolean().default(false),
  /** Bot tuzağı. */
  website: z.string().max(200).optional().or(z.literal("")),
});

export type AuditLeadInput = z.infer<typeof leadSchema>;

/** Tam raporu açan e-posta kapısı; adres satışa bildirilir. */
export const sendAuditLead = createServerFn({ method: "POST" })
  .validator((data: AuditLeadInput) => leadSchema.parse(data))
  .handler(async ({ data }) => {
    if (data.website) return { ok: true as const };

    const { saveLead } = await import("@/lib/leads.server");
    await saveLead({
      source: "site_audit",
      email: data.email,
      website: data.targetUrl,
      payload: { score: data.score, criticalCount: data.criticalCount },
      consentKvkk: data.consentKvkk,
      consentMarketing: data.consentMarketing,
    });

    const { sendMail } = await import("@/lib/mailer.server");
    return sendMail({
      subject: `[Site Analizi · ${data.score}/100] ${new URL(data.targetUrl).hostname}`,
      replyTo: data.email,
      text: [
        `Analiz edilen site: ${data.targetUrl}`,
        `Skor: ${data.score}/100`,
        `Kritik bulgu sayısı: ${data.criticalCount}`,
        "",
        `E-posta: ${data.email}`,
        `KVKK onayı: evet · Ticari ileti izni: ${data.consentMarketing ? "evet" : "hayır"}`,
        `Gönderim: ${new Date().toISOString()}`,
      ].join("\n"),
    });
  });

const PSI_ENDPOINT = "https://www.googleapis.com/pagespeedonline/v5/runPagespeed";
const PSI_TIMEOUT_MS = 55_000;

/** Hız ölçümü 24 saat önbelleklenir; PSI çağrısı hem yavaş hem kotalı. */
const psiCache = new Map<string, { at: number; value: CategoryResult }>();

/**
 * PageSpeed Insights ölçümü. Sunucuda çalışır: API anahtarı tarayıcıya inmez.
 * Ölçüm 20-40 saniye sürebildiği için fonksiyonun süre sınırı yükseltilmiştir
 * (scripts/set-function-duration.mjs). Başarısız olursa çağıran tarafta
 * kategori "ölçülemedi" sayılır ve kalan ağırlıklar 100'e yeniden ölçeklenir.
 */
export const measureSpeed = createServerFn({ method: "POST" })
  .validator((data: { url: string }) => z.object({ url: z.string().max(2000) }).parse(data))
  .handler(async ({ data }): Promise<CategoryResult> => {
    const cached = psiCache.get(data.url);
    if (cached && Date.now() - cached.at < CACHE_TTL_MS) return cached.value;

    // Kullanıcı anahtarı VITE_ önekiyle eklemiş olabilir; iki adı da kabul et.
    const key = process.env.PSI_API_KEY ?? process.env.VITE_PSI_API_KEY;
    const qs = new URLSearchParams({ url: data.url, strategy: "mobile" });
    qs.append("category", "performance");
    if (key) qs.append("key", key);

    const ac = new AbortController();
    const timer = setTimeout(() => ac.abort(), PSI_TIMEOUT_MS);
    try {
      const res = await fetch(`${PSI_ENDPOINT}?${qs}`, { signal: ac.signal });
      if (!res.ok) {
        const body = await res.text().catch(() => "");
        console.error("[site-analizi] PSI hatası:", res.status, body.slice(0, 300));
        throw new Error(`PSI ${res.status}`);
      }
      const value = psiToCategory((await res.json()) as PsiPayload);
      psiCache.set(data.url, { at: Date.now(), value });
      return value;
    } finally {
      clearTimeout(timer);
    }
  });
