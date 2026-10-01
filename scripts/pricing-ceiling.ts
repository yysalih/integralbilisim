/**
 * Teklif sihirbazında "her şey seçili" senaryosunun üst sınırını hesaplar.
 * Kullanım: npx tsx scripts/pricing-ceiling.ts
 * Fiyatlar değiştiğinde tavanın hâlâ hedefte olduğunu doğrulamak için.
 */
import { BASE_PRICE } from "../src/lib/pricing.config";
import {
  SERVICE_QUESTIONS,
  SITUATION_QUESTIONS,
  estimate,
  emptyAnswers,
  type QuoteAnswers,
} from "../src/lib/quote";
import { SERVICES } from "../src/lib/services";

const maxOf = (opts: { value: string; factor: number }[]) =>
  opts.reduce((a, b) => (b.factor > a.factor ? b : a)).value;

/** Her soruda en pahalı cevap; çoklu seçimde hepsi işaretli. */
const worstCase = (services: string[]): QuoteAnswers => {
  const a = emptyAnswers();
  a.services = services;
  for (const slug of services) {
    for (const q of SERVICE_QUESTIONS[slug] ?? []) {
      a.scope[`${slug}.${q.id}`] = q.multi ? q.options.map((o) => o.value) : [maxOf(q.options)];
    }
  }
  for (const q of SITUATION_QUESTIONS) a.situation[q.id] = maxOf(q.options);
  a.urgency = "1-ay";
  a.budget = "200k+";
  return a;
};

// Paket indirimi ilk hizmete uygulanmadığı için en pahalı hizmet başta olduğunda
// toplam en yüksek olur; tavan bu sıralamayla hesaplanır.
const solo = SERVICES.map((s) => ({ slug: s.slug, max: estimate(worstCase([s.slug])).max }))
  .sort((x, y) => y.max - x.max);
const order = solo.map((s) => s.slug);
const result = estimate(worstCase(order));

console.log(`Her şey seçili tavan: ${result.max.toLocaleString("tr-TR")} TL (alt: ${result.min.toLocaleString("tr-TR")})`);
for (const b of result.breakdown) {
  console.log(`  ${b.title.padEnd(26)} ${String(BASE_PRICE[b.slug]).padStart(8)} taban -> max ${b.max.toLocaleString("tr-TR")}`);
}
