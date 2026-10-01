import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Check, Clock, Lock, Sparkles } from "lucide-react";

import { useRevealOnce } from "@/hooks/useRevealOnce";
import { emptyAnswers, estimate, formatTry } from "@/lib/quote";

const STEPS = [
  "Ne yaptırmak istediğinizi seçin",
  "Kapsamı birkaç soruyla netleştirin",
  "Bugün nerede olduğunuzu söyleyin",
  "Zaman ve bütçenizi belirtin",
  "Tahmini aralığı ekranda görün",
];

/**
 * Örnek kart, sihirbazın gerçek fiyat motorundan hesaplanır; fiyat listesi
 * değişince ana sayfadaki rakam da kendiliğinden güncellenir.
 */
const SAMPLE = estimate({
  ...emptyAnswers(),
  services: ["web-tasarim"],
  scope: { "web-tasarim.sayfa": ["6-15"], "web-tasarim.ekstra": ["blog"] },
  situation: { mevcutSite: "yok", domain: "yok", icerik: "kismen" },
  urgency: "1-ay",
});

export function QuotePromo() {
  const { ref, revealed } = useRevealOnce<HTMLDivElement>(0.25);

  return (
    <section className="relative overflow-hidden bg-background py-20 md:py-28">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 top-10 h-[26rem] w-[26rem] rounded-full opacity-[0.07] blur-[100px]"
        style={{ background: "radial-gradient(circle,#C9436E,transparent 70%)" }}
      />

      <div ref={ref} className="container relative mx-auto px-4">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-accent/25 bg-accent/[0.07] px-3 py-1.5">
              <Sparkles className="h-3.5 w-3.5 text-accent" />
              <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-accent">
                Teklif Sihirbazı
              </span>
            </div>

            <h2 className="mt-5 text-4xl font-bold leading-[1.06] tracking-tight text-foreground md:text-5xl">
              Bütçeniz 90 saniyede
              <br />
              netleşsin.
            </h2>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-muted-foreground">
              Form doldurup bir gün beklemeye gerek yok. Birkaç soruya cevap verin, tahmini
              bütçe aralığınız hemen ekranda çıksın.
            </p>

            <ol className="mt-8 space-y-3">
              {STEPS.map((step, i) => (
                <li
                  key={step}
                  className="flex items-center gap-3 transition-all duration-500"
                  style={{
                    opacity: revealed ? 1 : 0,
                    transform: revealed ? "none" : "translateX(-10px)",
                    transitionDelay: `${140 + i * 90}ms`,
                  }}
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent/10 text-[11px] font-bold text-accent">
                    {i + 1}
                  </span>
                  <span className="text-sm text-foreground/75">{step}</span>
                </li>
              ))}
            </ol>

            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Link
                to="/teklif"
                className="inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3.5 text-sm font-semibold text-white shadow-lg transition-transform hover:scale-[1.03] active:scale-[0.98]"
              >
                Teklifimi hesapla
                <ArrowRight className="h-4 w-4" />
              </Link>
              <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                <Lock className="h-3.5 w-3.5" />
                İletişim bilgisi en sonda
              </span>
              <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                <Clock className="h-3.5 w-3.5" />
                Yaklaşık 90 saniye
              </span>
            </div>
          </div>

          {/* Sihirbazın sonunda çıkan ekranın örneği. */}
          <div className="lg:col-span-6">
            <div
              className="relative overflow-hidden rounded-3xl border border-border bg-card p-7 shadow-[0_30px_80px_-40px_rgba(0,0,0,0.35)] transition-all duration-700 md:p-8"
              style={{
                opacity: revealed ? 1 : 0,
                transform: revealed ? "none" : "translateY(20px) scale(0.98)",
              }}
            >
              <span className="absolute right-6 top-6 rounded-full border border-border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                Örnek sonuç
              </span>

              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-accent">
                <Check className="h-5 w-5 text-white" strokeWidth={3} />
              </div>

              <p className="mt-5 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                Tahmini bütçe aralığı
              </p>
              <p className="mt-2 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                <Counter to={SAMPLE.min} start={revealed} />
                <span className="mx-1.5 text-muted-foreground/50">–</span>
                <Counter to={SAMPLE.max} start={revealed} />
              </p>
              <p className="mt-1 text-sm font-medium text-muted-foreground">+ KDV</p>

              <div className="mt-6 space-y-2 rounded-2xl bg-muted/60 p-4">
                {[
                  "Web Tasarım — 6-15 sayfa · Blog bölümü",
                  "İçerik kısmen hazır",
                  "Zaman: 1 ay içinde",
                ].map((line) => (
                  <div key={line} className="flex gap-2.5 text-xs leading-relaxed text-foreground/70">
                    <span className="mt-[6px] h-1 w-1 shrink-0 rounded-full bg-accent" />
                    {line}
                  </div>
                ))}
              </div>

              <p className="mt-4 text-[11px] leading-relaxed text-muted-foreground/70">
                Aralık verdiğiniz bilgilere göre otomatik hesaplanır; bağlayıcı teklif değildir.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const REDUCED =
  typeof window !== "undefined" &&
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

function Counter({ to, start }: { to: number; start: boolean }) {
  const [n, setN] = useState(REDUCED ? to : 0);

  useEffect(() => {
    if (!start) return;
    if (REDUCED) {
      setN(to);
      return;
    }
    let raf = 0;
    const t0 = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / 1000);
      const eased = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
      setN(Math.round((to * eased) / 500) * 500);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [start, to]);

  return <>{formatTry(n)}</>;
}
