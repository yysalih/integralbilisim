import { z } from "zod";

const field = z.string().max(200).optional();

/** Bir talebin hangi kanaldan geldiğini anlatan, formla birlikte gönderilen bilgi. */
export const attributionSchema = z
  .object({
    channel: z.string().max(30),
    referrer_host: field,
    utm_source: field,
    utm_medium: field,
    utm_campaign: field,
    utm_term: field,
    utm_content: field,
    /** Reklam tıklama kimliğinin türü (gclid, msclkid, fbclid); değeri saklanmaz. */
    click_id: field,
    landing_page: field,
    form_page: field,
    first_seen: field,
  })
  .optional();

export type Attribution = NonNullable<z.infer<typeof attributionSchema>>;

const KEY = "ib-attribution";
const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"] as const;
const CLICK_IDS = ["gclid", "msclkid", "fbclid"] as const;

const SEARCH_HOST = /(^|\.)(google|bing|yandex|duckduckgo|yahoo|ecosia|baidu|seznam)\./i;
const SOCIAL_HOST =
  /(^|\.)(facebook|instagram|twitter|linkedin|youtube|tiktok|pinterest|whatsapp|reddit)\.com$|^(t\.co|x\.com|lnkd\.in|l\.facebook\.com|l\.instagram\.com)$/i;
const SOCIAL_SOURCE = /facebook|instagram|meta|tiktok|linkedin|twitter|pinterest|youtube|^fb$|^ig$/i;

const clip = (v: string | null | undefined) => (v ? v.slice(0, 200) : undefined);

const classify = (a: {
  utm_source?: string;
  utm_medium?: string;
  click_id?: string;
  referrer_host?: string;
}): string => {
  const medium = (a.utm_medium ?? "").toLowerCase();
  const source = (a.utm_source ?? "").toLowerCase();
  if (/^(cpc|ppc|paid|paidsearch|paid_social|paidsocial|display|retargeting)/.test(medium)) {
    return SOCIAL_SOURCE.test(source) || medium.includes("social") ? "paid_social" : "paid_search";
  }
  if (a.click_id === "gclid" || a.click_id === "msclkid") return "paid_search";
  if (/^(email|e-mail|newsletter|eposta)/.test(medium)) return "email";
  if (a.utm_source || a.utm_medium) return "other";
  if (a.click_id === "fbclid") return "social";
  if (a.referrer_host) {
    if (SEARCH_HOST.test(a.referrer_host)) return "organic_search";
    if (SOCIAL_HOST.test(a.referrer_host)) return "social";
    return "referral";
  }
  return "direct";
};

const hasCampaign = (a: Attribution) =>
  Boolean(a.utm_source || a.utm_medium || a.utm_campaign || a.click_id);

let memory: Attribution | undefined;

const read = (): Attribution | undefined => {
  try {
    const raw = sessionStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Attribution) : memory;
  } catch {
    return memory;
  }
};

/**
 * Oturumun ilk girişindeki kaynağı (UTM, tıklama kimliği, yönlendiren site,
 * giriş sayfası) tarayıcının oturum belleğine yazar. Veri yalnızca ziyaretçi
 * bir form gönderirse sunucuya gider; sekme kapanınca silinir. Oturum içinde
 * sonradan reklam bağlantısıyla gelinirse, kampanyasız ilk kayıt ezilir.
 */
export const captureAttribution = () => {
  if (typeof window === "undefined") return;
  const params = new URLSearchParams(window.location.search);

  const found: Attribution = { channel: "direct", first_seen: new Date().toISOString() };
  for (const k of UTM_KEYS) {
    const v = clip(params.get(k));
    if (v) found[k] = v;
  }
  const click = CLICK_IDS.find((k) => params.has(k));
  if (click) found.click_id = click;

  try {
    const host = document.referrer ? new URL(document.referrer).hostname : "";
    const own = window.location.hostname;
    if (host && host !== own && !host.endsWith(".integralbilisim.com")) {
      found.referrer_host = host.slice(0, 200);
    }
  } catch {
    /* geçersiz referrer yok sayılır */
  }

  found.landing_page = window.location.pathname.slice(0, 200);
  found.channel = classify(found);

  const existing = read();
  if (existing && !(hasCampaign(found) && !hasCampaign(existing))) return;

  memory = found;
  try {
    sessionStorage.setItem(KEY, JSON.stringify(found));
  } catch {
    /* depolama kapalıysa bellekteki kopya bu sayfa ömrü boyunca yeter */
  }
};

/** Form gönderiminde eklenecek kaynak bilgisi; formun bulunduğu sayfayı da ekler. */
export const getAttribution = (): Attribution | undefined => {
  if (typeof window === "undefined") return undefined;
  const stored = read();
  if (!stored) return undefined;
  return { ...stored, form_page: window.location.pathname.slice(0, 200) };
};

const CHANNEL_LABEL: Record<string, string> = {
  direct: "Doğrudan (adres yazarak / yer imi)",
  organic_search: "Organik arama (Google vb.)",
  paid_search: "Ücretli arama reklamı",
  paid_social: "Ücretli sosyal medya reklamı",
  social: "Sosyal medya",
  referral: "Başka bir siteden bağlantı",
  email: "E-posta bülteni",
  other: "Diğer kampanya",
};

/** E-posta gövdesine eklenecek satırlar; bilgi yoksa boş döner. */
export const attributionLines = (a: Attribution | undefined): string[] => {
  if (!a) return [];
  const campaign = [a.utm_source, a.utm_medium, a.utm_campaign].filter(Boolean).join(" / ");
  return [
    "",
    "— KAYNAK —",
    `Kanal: ${CHANNEL_LABEL[a.channel] ?? a.channel}`,
    campaign ? `Kampanya: ${campaign}` : null,
    a.utm_term ? `Anahtar kelime: ${a.utm_term}` : null,
    a.click_id ? `Reklam tıklaması: ${a.click_id}` : null,
    a.referrer_host ? `Yönlendiren site: ${a.referrer_host}` : null,
    a.landing_page ? `İlk giriş sayfası: ${a.landing_page}` : null,
    a.form_page ? `Formun gönderildiği sayfa: ${a.form_page}` : null,
  ].filter((line): line is string => line !== null);
};
