import { Link } from "@tanstack/react-router";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

import { CATEGORY_LABELS, SERVICES } from "@/lib/services";
import { cn } from "@/lib/utils";

/** Etkileşimli hizmet detay carousel'i — 5.6 deseni (chip + glass panel). */
export function ServiceExplorer() {
  const [active, setActive] = useState(0);
  const service = SERVICES[active];

  const go = (dir: 1 | -1) => setActive((a) => (a + dir + SERVICES.length) % SERVICES.length);

  return (
    <section className="relative overflow-hidden bg-[#0a0a12] py-20 md:py-28">
      <div
        className="absolute -right-[10%] top-[0%] h-[45%] w-[40%] rounded-full blur-[120px] transition-colors duration-700"
        style={{ backgroundColor: `${service.accent}26` }}
      />

      <div className="container relative mx-auto px-4">
        <div className="mb-10 max-w-3xl">
          <h2 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
            Her hizmetin arkasında bir yöntem var.
          </h2>
        </div>

        {/* Chip satırı */}
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {SERVICES.map((s, i) => (
            <button
              key={s.slug}
              onClick={() => setActive(i)}
              className={cn(
                "shrink-0 rounded-full border px-4 py-2 text-xs font-medium transition-colors",
                i === active
                  ? "text-white"
                  : "border-white/10 text-white/50 hover:border-white/25 hover:text-white/80",
              )}
              style={
                i === active
                  ? { borderColor: s.accent, backgroundColor: `${s.accent}1f`, color: "#fff" }
                  : undefined
              }
            >
              {s.title}
            </button>
          ))}
        </div>

        {/* Glass panel */}
        <div
          key={service.slug}
          className="mt-6 animate-[showcase-fade-in_0.4s_ease-out] rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-md md:p-10"
        >
          <div className="flex flex-wrap items-center gap-3">
            <span
              className="rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-white"
              style={{ backgroundColor: `${service.accent}33`, boxShadow: `inset 0 0 0 1px ${service.accent}66` }}
            >
              {service.tagline}
            </span>
            <span className="text-[11px] uppercase tracking-wider text-white/40">
              {CATEGORY_LABELS[service.category]}
            </span>
          </div>
          <h3 className="mt-4 text-2xl font-bold text-white md:text-3xl">{service.title}</h3>
          <p className="mt-4 max-w-3xl leading-relaxed text-white/70">{service.long[0]}</p>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {service.includes.slice(0, 3).map((inc) => (
              <div key={inc.label} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <p className="text-sm font-semibold text-white">{inc.label}</p>
                <p className="mt-1 text-xs leading-relaxed text-white/50">{inc.detail}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-6">
            <Link
              to="/hizmetler/$slug"
              params={{ slug: service.slug }}
              className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition-transform hover:scale-105"
            >
              Detayları Görün
              <ArrowRight className="h-4 w-4" />
            </Link>
            <div className="flex items-center gap-3">
              <span className="text-xs tabular-nums text-white/40">
                {String(active + 1).padStart(2, "0")} / {String(SERVICES.length).padStart(2, "0")}
              </span>
              <button
                onClick={() => go(-1)}
                aria-label="Önceki hizmet"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/70 transition-colors hover:bg-white/10"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => go(1)}
                aria-label="Sonraki hizmet"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/70 transition-colors hover:bg-white/10"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
