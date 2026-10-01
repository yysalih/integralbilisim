import type { AuditResult, CategoryKey, CategoryResult, Finding } from "@/lib/audit/types";

const SEVERITY_ORDER: Record<Finding["severity"], number> = {
  kritik: 0,
  onemli: 1,
  firsat: 2,
  iyi: 3,
};

/**
 * Ölçülemeyen kategoriler toplamdan çıkarılır ve kalan ağırlıklar 100'e
 * yeniden ölçeklenir; böylece skor her zaman 100 üzerinden anlamlı kalır.
 */
export const buildResult = (
  url: string,
  finalUrl: string,
  fetchedAt: string,
  categories: CategoryResult[],
): AuditResult => {
  const measured = categories.filter((c) => c.ratio !== null);
  const unmeasured = categories.filter((c) => c.ratio === null).map((c) => c.key as CategoryKey);
  const totalWeight = measured.reduce((n, c) => n + c.weight, 0);
  const total = totalWeight
    ? Math.round(
        (measured.reduce((n, c) => n + (c.ratio ?? 0) * c.weight, 0) / totalWeight) * 100,
      )
    : 0;

  return { url, finalUrl, fetchedAt, total, categories, unmeasured };
};

/** Tüm bulguları önem sırasına göre düzleştirir. */
export const allFindings = (categories: CategoryResult[]) =>
  categories
    .flatMap((c) => c.findings.map((f) => ({ ...f, category: c.label })))
    .sort((a, b) => SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity]);
