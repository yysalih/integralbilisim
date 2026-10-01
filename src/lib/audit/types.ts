export type Severity = "kritik" | "onemli" | "firsat" | "iyi";

export interface Finding {
  severity: Severity;
  title: string;
  /** Ne bulundu — veriyle, tek cümle. */
  evidence: string;
  /** Neden önemli — iş etkisi, tek cümle. */
  why: string;
  /** Ne yapılmalı — aksiyon, tek cümle. */
  action: string;
  /** İlgili İntegral hizmeti (slug). */
  service?: string;
}

export type CategoryKey = "hiz" | "seo" | "mobil" | "guven" | "sosyal";

export interface CategoryResult {
  key: CategoryKey;
  label: string;
  /** Ağırlık (toplam 100). Ölçülemeyen kategori yeniden dağıtılır. */
  weight: number;
  /** 0-1 arası başarı oranı; null ise ölçülemedi. */
  ratio: number | null;
  findings: Finding[];
}

export interface AuditResult {
  url: string;
  finalUrl: string;
  fetchedAt: string;
  /** 0-100. Ölçülemeyen kategoriler hariç tutulup yeniden ağırlıklandırılır. */
  total: number;
  categories: CategoryResult[];
  /** Ölçülemeyen kategoriler kullanıcıya açıkça bildirilir. */
  unmeasured: CategoryKey[];
}

export const BAND = (score: number) =>
  score >= 85
    ? { label: "Güçlü", color: "#10B981" }
    : score >= 65
      ? { label: "İyi, ama eksikleri var", color: "#F59E0B" }
      : score >= 40
        ? { label: "Zayıf", color: "#F97316" }
        : { label: "Kritik", color: "#EF4444" };

export const SEVERITY_META: Record<Severity, { label: string; color: string }> = {
  kritik: { label: "KRİTİK", color: "#EF4444" },
  onemli: { label: "ÖNEMLİ", color: "#F97316" },
  firsat: { label: "FIRSAT", color: "#F59E0B" },
  iyi: { label: "İYİ", color: "#10B981" },
};
