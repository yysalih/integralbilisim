import { BASE_PRICE, BUNDLE_DISCOUNT, RANGE, URGENCY_FACTOR } from "@/lib/pricing.config";
import { SERVICES } from "@/lib/services";

export interface QuoteOption {
  value: string;
  label: string;
  detail?: string;
  /** Taban fiyatı çarpan katsayı. */
  factor: number;
}

export interface QuoteQuestion {
  id: string;
  label: string;
  hint?: string;
  /** Çoklu seçimde her işaretli seçeneğin katsayısı çarpılır. */
  multi?: boolean;
  options: QuoteOption[];
}

/** Adım 2 — hizmete göre değişen kapsam soruları. */
export const SERVICE_QUESTIONS: Record<string, QuoteQuestion[]> = {
  "web-tasarim": [
    {
      id: "sayfa",
      label: "Kaç sayfalık bir site düşünüyorsunuz?",
      options: [
        { value: "1-5", label: "1-5 sayfa", detail: "Tanıtım sitesi", factor: 0.8 },
        { value: "6-15", label: "6-15 sayfa", detail: "Kurumsal site", factor: 1 },
        { value: "16+", label: "16+ sayfa", detail: "Geniş içerikli", factor: 1.45 },
      ],
    },
    {
      id: "ekstra",
      label: "Ek olarak neler gerekiyor?",
      hint: "Birden fazla seçebilirsiniz.",
      multi: true,
      options: [
        { value: "cokdilli", label: "Çok dilli", detail: "İkinci dil desteği", factor: 1.25 },
        { value: "blog", label: "Blog bölümü", factor: 1.1 },
        { value: "animasyon", label: "Özel animasyon", detail: "Hareketli, 3D öğeler", factor: 1.3 },
        { value: "panel", label: "Yönetim paneli", detail: "İçeriği kendiniz yönetin", factor: 1.2 },
      ],
    },
  ],
  "hazir-web-site": [
    {
      id: "paket",
      label: "Hangi kapsam size uygun?",
      options: [
        { value: "temel", label: "Temel", detail: "Hazır tasarım, içerik sizden", factor: 1 },
        { value: "icerik", label: "İçerik dahil", detail: "Metin ve görselleri biz hazırlayalım", factor: 1.4 },
        { value: "ozel", label: "Özelleştirilmiş", detail: "Hazır altyapı, markanıza özel tasarım", factor: 1.8 },
      ],
    },
  ],
  "e-ticaret-web-siteleri": [
    {
      id: "urun",
      label: "Kaç ürün satacaksınız?",
      options: [
        { value: "50-", label: "50'den az", factor: 0.85 },
        { value: "50-500", label: "50-500 ürün", factor: 1 },
        { value: "500+", label: "500+ ürün", detail: "Toplu ürün aktarımı gerekir", factor: 1.4 },
      ],
    },
    {
      id: "entegrasyon",
      label: "Hangi entegrasyonlar gerekiyor?",
      hint: "Birden fazla seçebilirsiniz.",
      multi: true,
      options: [
        { value: "odeme", label: "Sanal POS", detail: "Kredi kartı ile tahsilat", factor: 1.1 },
        { value: "kargo", label: "Kargo entegrasyonu", factor: 1.1 },
        { value: "pazaryeri", label: "Pazaryeri", detail: "Trendyol, Hepsiburada", factor: 1.25 },
        { value: "b2b", label: "B2B fiyatlandırma", detail: "Bayiye özel fiyat", factor: 1.3 },
      ],
    },
  ],
  "mobil-uygulama": [
    {
      id: "platform",
      label: "Hangi platformlar?",
      options: [
        { value: "tek", label: "Tek platform", detail: "Yalnızca iOS ya da Android", factor: 0.8 },
        { value: "ikisi", label: "iOS + Android", factor: 1 },
      ],
    },
    {
      id: "ozellik",
      label: "Uygulamada neler olacak?",
      hint: "Birden fazla seçebilirsiniz.",
      multi: true,
      options: [
        { value: "giris", label: "Kullanıcı girişi", factor: 1.15 },
        { value: "odeme", label: "Uygulama içi ödeme", factor: 1.25 },
        { value: "push", label: "Bildirim", detail: "Push notification", factor: 1.1 },
        { value: "backend", label: "Sıfırdan altyapı", detail: "Mevcut bir sisteminiz yok", factor: 1.35 },
      ],
    },
  ],
  "domain-hosting": [
    {
      id: "kapsam",
      label: "Neye ihtiyacınız var?",
      multi: true,
      hint: "Birden fazla seçebilirsiniz.",
      options: [
        { value: "domain", label: "Alan adı", factor: 1 },
        { value: "hosting", label: "Hosting", factor: 1.2 },
        { value: "mail", label: "Kurumsal e-posta", factor: 1.15 },
        { value: "tasima", label: "Mevcut sitenin taşınması", factor: 1.3 },
      ],
    },
  ],
  "marka-tescil": [
    {
      id: "sinif",
      label: "Kaç sınıfta tescil düşünüyorsunuz?",
      hint: "Sınıf, markanızın koruma alanını belirler.",
      options: [
        { value: "1", label: "1 sınıf", factor: 1 },
        { value: "2-3", label: "2-3 sınıf", factor: 1.6 },
        { value: "4+", label: "4 ve üzeri", factor: 2.4 },
      ],
    },
    {
      id: "durum",
      label: "Logonuz hazır mı?",
      options: [
        { value: "hazir", label: "Hazır", factor: 1 },
        { value: "yok", label: "Logo da gerekiyor", detail: "Tasarım sürece eklenir", factor: 1.9 },
      ],
    },
  ],
  "google-ads-reklami": [
    {
      id: "butce",
      label: "Aylık reklam bütçeniz ne kadar?",
      hint: "Bu tutar Google'a ödenir; aşağıdaki tahmin yönetim hizmetimiz içindir.",
      options: [
        { value: "10k-", label: "10.000 TL altı", factor: 0.85 },
        { value: "10-50k", label: "10.000 - 50.000 TL", factor: 1 },
        { value: "50k+", label: "50.000 TL üzeri", factor: 1.5 },
      ],
    },
    {
      id: "hesap",
      label: "Mevcut bir reklam hesabınız var mı?",
      options: [
        { value: "var", label: "Var", detail: "Devralıp iyileştirelim", factor: 0.9 },
        { value: "yok", label: "Yok", detail: "Sıfırdan kuralım", factor: 1.15 },
      ],
    },
  ],
  "facebook-reklamciligi": [
    {
      id: "butce",
      label: "Aylık reklam bütçeniz ne kadar?",
      hint: "Bu tutar Meta'ya ödenir; aşağıdaki tahmin yönetim hizmetimiz içindir.",
      options: [
        { value: "10k-", label: "10.000 TL altı", factor: 0.85 },
        { value: "10-50k", label: "10.000 - 50.000 TL", factor: 1 },
        { value: "50k+", label: "50.000 TL üzeri", factor: 1.5 },
      ],
    },
  ],
  "sosyal-medya-yonetimi": [
    {
      id: "kanal",
      label: "Hangi kanallar yönetilecek?",
      hint: "Birden fazla seçebilirsiniz.",
      multi: true,
      options: [
        { value: "instagram", label: "Instagram", factor: 1 },
        { value: "facebook", label: "Facebook", factor: 1.15 },
        { value: "tiktok", label: "TikTok", factor: 1.25 },
        { value: "linkedin", label: "LinkedIn", factor: 1.2 },
      ],
    },
    {
      id: "icerik",
      label: "Ayda kaç içerik üretilsin?",
      options: [
        { value: "8", label: "8 içerik", factor: 0.85 },
        { value: "12", label: "12 içerik", factor: 1 },
        { value: "20+", label: "20+ içerik", detail: "Video ve reels dahil", factor: 1.6 },
      ],
    },
  ],
  "kurumsal-kimlik": [
    {
      id: "kapsam",
      label: "Kimlik çalışması neleri kapsasın?",
      hint: "Birden fazla seçebilirsiniz.",
      multi: true,
      options: [
        { value: "logo", label: "Logo", factor: 1 },
        { value: "kartvizit", label: "Kartvizit ve antetli", factor: 1.15 },
        { value: "kilavuz", label: "Kullanım kılavuzu", detail: "Marka rehberi", factor: 1.35 },
        { value: "sosyal", label: "Sosyal medya şablonları", factor: 1.2 },
      ],
    },
  ],
  "logo-calismasi": [
    {
      id: "konsept",
      label: "Kaç farklı konsept görmek istersiniz?",
      options: [
        { value: "2", label: "2 konsept", factor: 0.85 },
        { value: "3", label: "3 konsept", factor: 1 },
        { value: "5", label: "5 konsept", detail: "Daha geniş seçenek", factor: 1.4 },
      ],
    },
  ],
  "grafik-tasarim": [
    {
      id: "adet",
      label: "Yaklaşık kaç tasarım gerekiyor?",
      options: [
        { value: "1-5", label: "1-5 tasarım", factor: 0.9 },
        { value: "6-15", label: "6-15 tasarım", factor: 1.3 },
        { value: "surekli", label: "Sürekli destek", detail: "Aylık paket", factor: 2 },
      ],
    },
  ],
  "kartvizit-tasarimi": [
    {
      id: "baski",
      label: "Baskı da bizden olsun mu?",
      options: [
        { value: "tasarim", label: "Yalnızca tasarım", factor: 1 },
        { value: "baski", label: "Tasarım + baskı", detail: "Baskı adedine göre değişir", factor: 1.8 },
      ],
    },
  ],
  "brosur-katalog-tasarimi": [
    {
      id: "sayfa",
      label: "Kaç sayfalık bir çalışma?",
      options: [
        { value: "1-4", label: "1-4 sayfa", detail: "Broşür / föy", factor: 0.8 },
        { value: "8-16", label: "8-16 sayfa", factor: 1 },
        { value: "24+", label: "24+ sayfa", detail: "Katalog", factor: 1.7 },
      ],
    },
  ],
};

/** Adım 3 — herkese sorulan mevcut durum soruları. */
export const SITUATION_QUESTIONS: QuoteQuestion[] = [
  {
    id: "mevcutSite",
    label: "Şu anda bir web siteniz var mı?",
    options: [
      { value: "var", label: "Var", detail: "Yenilemek istiyorum", factor: 1 },
      { value: "yok", label: "Yok", detail: "Sıfırdan başlıyoruz", factor: 1 },
    ],
  },
  {
    id: "domain",
    label: "Alan adınız (domain) hazır mı?",
    options: [
      { value: "var", label: "Hazır", factor: 1 },
      { value: "yok", label: "Yok", detail: "Bulup kaydedelim", factor: 1.02 },
    ],
  },
  {
    id: "icerik",
    label: "Metin ve görselleriniz hazır mı?",
    options: [
      { value: "hazir", label: "Hazır", factor: 1 },
      { value: "kismen", label: "Kısmen", factor: 1.1 },
      { value: "yok", label: "Hiç yok", detail: "İçeriği biz üretelim", factor: 1.25 },
    ],
  },
];

/** Adım 4 — zaman ve bütçe. */
export const URGENCY_OPTIONS: QuoteOption[] = [
  { value: "1-ay", label: "1 ay içinde", detail: "Acele ediyorum", factor: 1 },
  { value: "1-3-ay", label: "1-3 ay içinde", factor: 1 },
  { value: "esnek", label: "Zamanım esnek", factor: 1 },
];

export const BUDGET_OPTIONS: QuoteOption[] = [
  { value: "0-25k", label: "25.000 TL altı", factor: 1 },
  { value: "25-75k", label: "25.000 - 75.000 TL", factor: 1 },
  { value: "75-200k", label: "75.000 - 200.000 TL", factor: 1 },
  { value: "200k+", label: "200.000 TL üzeri", factor: 1 },
  { value: "bilmiyorum", label: "Henüz netleşmedi", factor: 1 },
];

export interface QuoteAnswers {
  services: string[];
  /** `${serviceSlug}.${questionId}` → seçilen değer(ler) */
  scope: Record<string, string[]>;
  situation: Record<string, string>;
  urgency: string;
  budget: string;
}

export const emptyAnswers = (): QuoteAnswers => ({
  services: [],
  scope: {},
  situation: {},
  urgency: "",
  budget: "",
});

/** Seçilen hizmetler için adım 2'de sorulacak soruların düz listesi. */
export const scopeQuestionsFor = (services: string[]) =>
  services.flatMap((slug) =>
    (SERVICE_QUESTIONS[slug] ?? []).map((q) => ({
      key: `${slug}.${q.id}`,
      service: SERVICES.find((s) => s.slug === slug)!,
      question: q,
    })),
  );

const factorOf = (q: QuoteQuestion, values: string[]) =>
  values.reduce((acc, v) => acc * (q.options.find((o) => o.value === v)?.factor ?? 1), 1);

export interface Estimate {
  min: number;
  max: number;
  /** Hizmet bazında dağılım — sonuç ekranındaki kapsam özeti için. */
  breakdown: { slug: string; title: string; min: number; max: number }[];
}

/** Şeffaf ağırlıklı model: taban × kapsam × durum × aciliyet, sonra aralık. */
export const estimate = (a: QuoteAnswers): Estimate => {
  const situationFactor = SITUATION_QUESTIONS.reduce(
    (acc, q) => acc * (q.options.find((o) => o.value === a.situation[q.id])?.factor ?? 1),
    1,
  );
  const urgencyFactor = URGENCY_FACTOR[a.urgency] ?? 1;

  const breakdown = a.services.map((slug, i) => {
    const service = SERVICES.find((s) => s.slug === slug);
    const base = BASE_PRICE[slug] ?? 0;
    const scopeFactor = (SERVICE_QUESTIONS[slug] ?? []).reduce(
      (acc, q) => acc * factorOf(q, a.scope[`${slug}.${q.id}`] ?? []),
      1,
    );
    const bundle = i === 0 ? 1 : BUNDLE_DISCOUNT;
    const value = base * scopeFactor * situationFactor * urgencyFactor * bundle;
    return {
      slug,
      title: service?.title ?? slug,
      min: round(value * RANGE.low),
      max: round(value * RANGE.high),
    };
  });

  return {
    min: breakdown.reduce((n, b) => n + b.min, 0),
    max: breakdown.reduce((n, b) => n + b.max, 0),
    breakdown,
  };
};

/** En yakın 500'e yuvarlar; sahte kesinlik vermemek için. */
const round = (n: number) => Math.round(n / 500) * 500;

export const formatTry = (n: number) => `₺${n.toLocaleString("tr-TR")}`;

export interface LeadContact {
  name: string;
  company: string;
  email: string;
  phone: string;
}

/** PRD 5.1.4 — satışın öncelik sırası için 0-100 lead skoru. */
export const leadScore = (a: QuoteAnswers, c: LeadContact) => {
  let score = 0;
  if (a.budget === "200k+") score += 30;
  else if (a.budget === "75-200k") score += 22;
  else if (a.budget === "25-75k") score += 12;
  if (a.urgency === "1-ay") score += 25;
  else if (a.urgency === "1-3-ay") score += 12;
  if (c.email && !/@(gmail|hotmail|outlook|yahoo|icloud|yandex)\./i.test(c.email)) score += 15;
  if (c.phone.trim()) score += 10;
  if (a.services.length > 1) score += 10;
  if (a.situation.mevcutSite === "var") score += 10;
  return Math.min(100, score);
};

/** Sonuç ekranında ve satışa giden e-postada kullanılan okunur kapsam özeti. */
export const summaryLines = (a: QuoteAnswers): string[] => {
  const lines: string[] = [];
  for (const slug of a.services) {
    const service = SERVICES.find((s) => s.slug === slug);
    const picks: string[] = [];
    for (const q of SERVICE_QUESTIONS[slug] ?? []) {
      const values = a.scope[`${slug}.${q.id}`] ?? [];
      const labels = values
        .map((v) => q.options.find((o) => o.value === v)?.label)
        .filter(Boolean) as string[];
      if (labels.length) picks.push(labels.join(", "));
    }
    lines.push(`${service?.title ?? slug}${picks.length ? ` — ${picks.join(" · ")}` : ""}`);
  }
  for (const q of SITUATION_QUESTIONS) {
    const opt = q.options.find((o) => o.value === a.situation[q.id]);
    if (opt) lines.push(`${q.label} ${opt.label}`);
  }
  const urgency = URGENCY_OPTIONS.find((o) => o.value === a.urgency);
  if (urgency) lines.push(`Zaman: ${urgency.label}`);
  const budget = BUDGET_OPTIONS.find((o) => o.value === a.budget);
  if (budget) lines.push(`Bütçe: ${budget.label}`);
  return lines;
};

/**
 * Bir hizmetin tahmini başlangıç aralığı: en dar kapsam, içerik ve alan adı
 * hazır, zaman esnek. Hizmet sayfalarındaki "başlayan fiyatlarla" bilgisi
 * buradan hesaplanır; fiyat listesi değişince sayfalar da kendiliğinden güncellenir.
 */
export const startingEstimate = (slug: string) => {
  const cheapest = (opts: QuoteOption[]) =>
    opts.reduce((a, b) => (b.factor < a.factor ? b : a)).value;
  const a = emptyAnswers();
  a.services = [slug];
  for (const q of SERVICE_QUESTIONS[slug] ?? []) a.scope[`${slug}.${q.id}`] = [cheapest(q.options)];
  for (const q of SITUATION_QUESTIONS) a.situation[q.id] = cheapest(q.options);
  a.urgency = "esnek";
  return estimate(a);
};
