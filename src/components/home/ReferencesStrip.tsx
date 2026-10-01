import { Link } from "@tanstack/react-router";
import { useEffect, useRef } from "react";

import { REFERENCES } from "@/lib/references";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

/** Logo duvarı: sadece logolar. Sektör/kategori etiketi basılmaz. */
export function ReferencesStrip() {
  const trackRef = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  // Şeritte ilk 40 marka döner; tamamı referanslar sayfasında.
  const strip = REFERENCES.slice(0, 40);
  const items = [...strip, ...strip];

  useEffect(() => {
    const el = trackRef.current;
    if (!el || reducedMotion) return;
    let raf = 0;
    const step = () => {
      el.scrollLeft += 0.5;
      if (el.scrollLeft >= el.scrollWidth / 2) el.scrollLeft = 0;
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [reducedMotion]);

  return (
    <section className="border-y border-border bg-background py-14 md:py-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
            {REFERENCES.length} markanın dijital yüzünü biz kurduk.
          </h2>
          <Link to="/referanslar" className="text-sm font-semibold text-accent hover:underline">
            Tüm referanslar →
          </Link>
        </div>
      </div>

      <div
        ref={trackRef}
        className="mt-9 flex gap-10 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        style={{
          maskImage: "linear-gradient(to right, transparent, black 6%, black 94%, transparent)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent, black 6%, black 94%, transparent)",
        }}
      >
        {items.map((r, i) => (
          <img
            key={`${r.logo}-${i}`}
            src={r.logo}
            alt={r.name}
            loading="lazy"
            className="h-14 w-auto shrink-0 object-contain opacity-70 transition-opacity hover:opacity-100 md:h-16"
          />
        ))}
      </div>
    </section>
  );
}
