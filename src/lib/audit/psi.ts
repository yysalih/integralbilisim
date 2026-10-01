import type { CategoryResult, Finding } from "@/lib/audit/types";

interface PsiAudit {
  numericValue?: number;
  displayValue?: string;
  score?: number | null;
}

export interface PsiPayload {
  lighthouseResult?: {
    categories?: { performance?: { score?: number | null } };
    audits?: Record<string, PsiAudit>;
  };
}

/**
 * PageSpeed Insights yanıtını Hız & Performans kategorisine çevirir.
 * Saf fonksiyon: ağ çağrısı sunucuda yapılır, API anahtarı tarayıcıya inmez.
 */
export const psiToCategory = (json: PsiPayload): CategoryResult => {
  const lh = json.lighthouseResult;
  const score = lh?.categories?.performance?.score;
  if (typeof score !== "number") throw new Error("PSI sonucu okunamadı");

  const audits = lh?.audits ?? {};
  const findings: Finding[] = [];
  const lcp = audits["largest-contentful-paint"];
  if (lcp?.numericValue && lcp.numericValue > 2500) {
    findings.push({
      severity: lcp.numericValue > 4000 ? "kritik" : "onemli",
      title: "Sayfa ana içeriği geç yükleniyor",
      evidence: `En büyük içerik ${(lcp.numericValue / 1000).toFixed(1)} saniyede görünüyor (hedef: 2,5 sn altı).`,
      why: "Ziyaretçilerin önemli bir kısmı üç saniyeyi geçen sayfaları beklemeden çıkar.",
      action: "Öne çıkan görsel optimize edilmeli, gereksiz betikler ertelenmeli.",
      service: "web-tasarim",
    });
  }

  const cls = audits["cumulative-layout-shift"];
  if (cls?.numericValue && cls.numericValue > 0.1) {
    findings.push({
      severity: cls.numericValue > 0.25 ? "onemli" : "firsat",
      title: "Sayfa yüklenirken içerik kayıyor",
      evidence: `Düzen kayması ${cls.numericValue.toFixed(2)} (hedef: 0,10 altı).`,
      why: "Okurken yerinden oynayan içerik yanlış tıklamaya ve güven kaybına yol açar.",
      action: "Görsel ve reklam alanlarına sabit boyut verilmeli.",
      service: "web-tasarim",
    });
  }

  const tbt = audits["total-blocking-time"];
  if (tbt?.numericValue && tbt.numericValue > 200) {
    findings.push({
      severity: tbt.numericValue > 600 ? "onemli" : "firsat",
      title: "Sayfa etkileşime geç hazır oluyor",
      evidence: `Engelleme süresi ${Math.round(tbt.numericValue)} ms (hedef: 200 ms altı).`,
      why: "Ziyaretçi tıklıyor ama sayfa yanıt vermiyor; ilk izlenim yavaş bir site oluyor.",
      action: "Kullanılmayan JavaScript temizlenmeli, üçüncü parti betikler azaltılmalı.",
      service: "web-tasarim",
    });
  }

  const weight = audits["total-byte-weight"];
  if (weight?.numericValue && weight.numericValue > 3_000_000) {
    findings.push({
      severity: "firsat",
      title: "Sayfa boyutu yüksek",
      evidence: `Toplam indirilen veri ${(weight.numericValue / 1_048_576).toFixed(1)} MB.`,
      why: "Mobil veriyle giren ziyaretçi için hem yavaş hem maliyetli.",
      action: "Görseller WebP/AVIF formatına çevrilip boyutları küçültülmeli.",
      service: "web-tasarim",
    });
  }

  if (!findings.length) {
    findings.push({
      severity: "iyi",
      title: "Hız değerleri iyi durumda",
      evidence: `Mobil performans skoru ${Math.round(score * 100)}/100.`,
      why: "Hızlı açılan site hem ziyaretçiyi tutar hem arama sıralamasına olumlu yansır.",
      action: "Mevcut performans korunmalı; yeni eklenen betikler ölçülerek eklenmeli.",
    });
  }

  return { key: "hiz", label: "Hız & Performans", weight: 30, ratio: score, findings };
};
