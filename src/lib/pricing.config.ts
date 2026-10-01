/**
 * Teklif sihirbazının fiyat konfigürasyonu.
 *
 * PRICING_APPROVED açık: sihirbaz sonuç ekranında fiyat aralığı gösterir.
 *
 * DİKKAT — Aşağıdaki taban fiyatlar İntegral Bilişim'in gerçek fiyat listesinden
 * gelmiyor; piyasa tahminine dayalı başlangıç değerleridir ve ziyaretçiye
 * gösterildikleri için gözden geçirilmeleri gerekir. Güncellemek için yalnızca
 * bu dosyadaki rakamları değiştirmek yeterlidir.
 */
export const PRICING_APPROVED = true;

/**
 * Hizmet başına taban fiyat (TL, KDV hariç).
 * Ölçek: 14 hizmetin tamamı en kapsamlı seçeneklerle seçildiğinde üst sınır
 * 500.000 TL olacak şekilde ayarlandı. Rakam değiştirilirse tavanı
 * `npx tsx scripts/pricing-ceiling.ts` ile yeniden kontrol edin.
 */
export const BASE_PRICE: Record<string, number> = {
  "web-tasarim": 9_900,
  "hazir-web-site": 3_300,
  "e-ticaret-web-siteleri": 18_700,
  "mobil-uygulama": 55_000,
  "domain-hosting": 1_300,
  "marka-tescil": 2_600,
  "google-ads-reklami": 4_400,
  "facebook-reklamciligi": 4_000,
  "sosyal-medya-yonetimi": 5_500,
  "grafik-tasarim": 2_200,
  "kurumsal-kimlik": 7_700,
  "logo-calismasi": 3_300,
  "kartvizit-tasarimi": 900,
  "brosur-katalog-tasarimi": 2_600,
};

/** Aralık genişliği: alt ve üst sınır çarpanları. */
export const RANGE = { low: 0.85, high: 1.3 } as const;

/** Aciliyet fiyata da yansır. */
export const URGENCY_FACTOR: Record<string, number> = {
  "1-ay": 1.15,
  "1-3-ay": 1,
  esnek: 0.95,
};

/** Birden fazla hizmet seçildiğinde ikinci ve sonrakilere paket indirimi. */
export const BUNDLE_DISCOUNT = 0.9;
