import { useEffect, useState } from "react";
import { AlertTriangle, Check, Download, MessageCircle, Phone } from "lucide-react";

import { COMPANY, whatsappLink } from "@/lib/company";
import { formatTry } from "@/lib/quote";
import { PRICING_APPROVED } from "@/lib/pricing.config";

/**
 * Sihirbazın sonuç ekranı.
 * Fiyat listesi onaylanana dek (PRICING_APPROVED) rakam gösterilmez; bunun
 * yerine kapsam özeti ve dönüş sözü verilir. Uydurma aralık gösterilmez.
 */
export function QuoteResult({
  summary,
  min,
  max,
  delivered,
}: {
  summary: string[];
  min: number;
  max: number;
  /** Bildirim e-postası gitti mi. Gitmediyse özet WhatsApp'a hazır iletilir. */
  delivered: boolean;
}) {
  // Talep kaybolmasın diye özet WhatsApp mesajına da gömülür.
  const waMessage = [
    "Merhaba, teklif sihirbazından talep oluşturdum.",
    "",
    ...summary.map((line) => `• ${line}`),
    "",
    PRICING_APPROVED ? `Ekranda görünen aralık: ${formatTry(min)} – ${formatTry(max)} + KDV` : "",
  ]
    .filter(Boolean)
    .join("\n");

  return (
    <div className="mx-auto w-full max-w-3xl">
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-7 backdrop-blur-xl md:p-10">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-accent/30 blur-3xl"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-24 -left-16 h-64 w-64 rounded-full bg-[#8B5CF6]/25 blur-3xl"
        />

        <div className="relative">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent">
            <Check className="h-6 w-6 text-white" strokeWidth={3} />
          </div>

          <h2 className="mt-5 text-3xl font-bold tracking-tight text-white md:text-4xl">
            {PRICING_APPROVED ? "Tahmini bütçe aralığınız" : "Talebiniz bize ulaştı"}
          </h2>

          {!delivered && (
            <div className="mt-5 flex gap-3 rounded-2xl border border-amber-400/25 bg-amber-500/10 p-4">
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
              <p className="text-sm leading-relaxed text-amber-100/90">
                Özetiniz hazır, ancak otomatik bildirim şu anda gönderilemedi. Talebinizin
                bize ulaşması için aşağıdaki{" "}
                <strong className="font-semibold">WhatsApp</strong> düğmesini kullanın —
                özet mesaja hazır olarak eklendi.
              </p>
            </div>
          )}

          {PRICING_APPROVED ? (
            <>
              <div className="mt-5 text-4xl font-bold tracking-tight text-white md:text-5xl">
                <Counter to={min} /> <span className="text-white/40">–</span> <Counter to={max} />
                <span className="ml-2 text-base font-medium text-white/45">+ KDV</span>
              </div>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/55">
                Bu aralık verdiğiniz bilgilere göre otomatik hesaplandı. Kesin teklif, 1 iş günü
                içinde detaylı görüşmeyle netleşir.
              </p>
            </>
          ) : (
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/55">
              Seçimlerinizi aldık. Kapsamınıza özel fiyat teklifini{" "}
              <strong className="font-semibold text-white">1 iş günü içinde</strong> e-posta ile
              gönderiyoruz. Acele ediyorsanız aşağıdan doğrudan bize ulaşabilirsiniz.
            </p>
          )}

          <div className="mt-8 rounded-2xl border border-white/10 bg-black/20 p-5">
            <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-white/40">
              Talebinizin özeti
            </h3>
            <ul className="mt-3 space-y-2">
              {summary.map((line) => (
                <li key={line} className="flex gap-2.5 text-sm leading-relaxed text-white/75">
                  <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-accent" />
                  {line}
                </li>
              ))}
            </ul>
          </div>

          <p className="mt-4 text-xs leading-relaxed text-white/35">
            Bu özet bağlayıcı teklif değildir. Kesin fiyat, kapsamın karşılıklı
            netleştirilmesinden sonra yazılı olarak iletilir.
          </p>

          <div className="mt-7 flex flex-wrap gap-3 print:hidden">
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition-transform hover:scale-[1.03]"
            >
              <Download className="h-4 w-4" />
              PDF olarak kaydet
            </button>
            <a
              href={whatsappLink(waMessage)}
              target="_blank"
              rel="noreferrer"
              className={
                delivered
                  ? "inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
                  : "inline-flex items-center gap-2 rounded-full bg-[#25D366] px-6 py-3 text-sm font-semibold text-white transition-transform hover:scale-[1.03]"
              }
            >
              <MessageCircle className="h-4 w-4" />
              WhatsApp'tan yazın
            </a>
            <a
              href={`tel:${COMPANY.phoneMobile.replace(/\s/g, "")}`}
              className="inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              <Phone className="h-4 w-4" />
              {COMPANY.phoneMobile}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

const REDUCED =
  typeof window !== "undefined" &&
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

/** Tutarı hedefe doğru sayar; hareket azaltma tercihinde anında gösterir. */
function Counter({ to }: { to: number }) {
  const [n, setN] = useState(REDUCED ? to : 0);

  useEffect(() => {
    if (REDUCED) return;
    let raf = 0;
    const t0 = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / 900);
      const eased = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
      setN(Math.round((to * eased) / 500) * 500);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to]);

  return <>{formatTry(n)}</>;
}
