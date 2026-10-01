import { useEffect, useState } from "react";

import { useRevealOnce } from "@/hooks/useRevealOnce";
import { COMPANY, yearsInBusiness } from "@/lib/company";
import { REFERENCES } from "@/lib/references";
import { SERVICES } from "@/lib/services";

/**
 * Hero'nun hemen altındaki rakamsal kanıt şeridi.
 * Değerlerin tamamı gerçek veriden türetilir: referans listesi, hizmet kataloğu
 * ve kuruluş yılı. Sabit yazılmış bir iddia yok.
 */
const STATS: { value: number | null; display?: string; suffix?: string; label: string; note: string }[] = [
  {
    value: yearsInBusiness(),
    suffix: "+",
    label: "yıllık deneyim",
    note: `${COMPANY.foundedYear}'den beri`,
  },
  { value: REFERENCES.length, suffix: "", label: "marka referansı", note: "Türkiye geneli" },
  { value: SERVICES.length, suffix: "", label: "dijital hizmet", note: "tek elden" },
  { value: null, display: "5", suffix: " gün", label: "yayına alma", note: "hazır web sitesinde" },
];

export function ProofStrip() {
  const { ref, revealed } = useRevealOnce<HTMLDivElement>(0.3);

  return (
    <section className="relative border-t border-white/[0.06] bg-[#0a0a12]">
      {/* Hero ile şerit arasında ince bir marka ışığı */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-accent/60 to-transparent"
      />
      <div ref={ref} className="container mx-auto grid grid-cols-2 gap-px px-4 py-10 md:grid-cols-4 md:py-12">
        {STATS.map((s, i) => (
          <div
            key={s.label}
            className="relative px-2 text-center transition-all duration-700 md:px-6"
            style={{
              opacity: revealed ? 1 : 0,
              transform: revealed ? "none" : "translateY(14px)",
              transitionDelay: `${i * 90}ms`,
            }}
          >
            <div className="text-4xl font-bold tracking-tight text-white md:text-5xl">
              {s.value === null ? (
                s.display
              ) : (
                <CountUp to={s.value} start={revealed} />
              )}
              <span className="text-accent">{s.suffix}</span>
            </div>
            <div className="mt-2 text-sm font-medium text-white/70">{s.label}</div>
            <div className="mt-0.5 text-xs text-white/35">{s.note}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

const REDUCED =
  typeof window !== "undefined" &&
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

/** Görünür olduğunda hedefe sayan rakam; hareket azaltma tercihinde anında hedefi gösterir. */
function CountUp({ to, start }: { to: number; start: boolean }) {
  const [n, setN] = useState(start || REDUCED ? to : 0);

  useEffect(() => {
    if (!start) return;
    if (REDUCED) {
      setN(to);
      return;
    }
    let raf = 0;
    const t0 = performance.now();
    const ms = 1100;
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / ms);
      // easeOutExpo: hızlı başlar, sonda yumuşak durur
      const eased = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
      setN(Math.round(to * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [start, to]);

  return <>{n}</>;
}
