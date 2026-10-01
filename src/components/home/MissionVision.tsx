import { Link } from "@tanstack/react-router";

import { COMPANY, yearsInBusiness } from "@/lib/company";
import { REFERENCES } from "@/lib/references";
import { SERVICES } from "@/lib/services";
import { mediaUrl } from "@/lib/media";
import { useRevealOnce } from "@/hooks/useRevealOnce";
import { cn } from "@/lib/utils";

/** Marka felsefesi + gerçek rakamlar. Fotoğraf arka planlı koyu bölüm (şablon 5.5). */
export function MissionVision() {
  const { ref, revealed } = useRevealOnce<HTMLDivElement>(0.2);

  const stats = [
    {
      value: String(yearsInBusiness()),
      label: "yıllık deneyim",
      note: `${COMPANY.foundedYear}'den bu yana`,
    },
    { value: String(SERVICES.length), label: "hizmet alanı", note: "tasarımdan pazarlamaya" },
    { value: `${REFERENCES.length}+`, label: "referans marka", note: "farklı sektörlerden" },
  ];

  return (
    <section className="relative overflow-hidden bg-[#0a0a12] py-20 md:py-28">
      <img
        src={mediaUrl("/covers/4.jpeg")}
        alt=""
        aria-hidden="true"
        loading="lazy"
        className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-90"
      />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(100deg,#0a0a12_0%,rgba(10,10,18,.94)_34%,rgba(10,10,18,.55)_66%,rgba(10,10,18,.72)_100%)]" />

      <div ref={ref} className="container relative mx-auto px-4">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-white/70 ring-1 ring-white/15">
              Misyon &amp; Vizyon
            </span>
            <h2
              className="mt-5 font-bold text-white"
              style={{
                fontSize: "clamp(1.8rem, 3.6vw, 2.75rem)",
                lineHeight: 1.08,
                letterSpacing: "-0.03em",
              }}
            >
              Kaliteyi her geçen gün artırmak için çalışıyoruz.
            </h2>
            <div className="mt-6 space-y-5 leading-relaxed text-white/65">
              <p>
                <span className="font-semibold text-white">Misyonumuz:</span> {COMPANY.mission}
              </p>
              <p>
                <span className="font-semibold text-white">Vizyonumuz:</span> {COMPANY.vision}
              </p>
            </div>
            <Link
              to="/hakkimizda"
              className="mt-8 inline-flex rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-black shadow-lg transition-transform hover:scale-105 active:scale-[0.98]"
            >
              Bizi Daha Yakından Tanıyın
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
            {stats.map((s, i) => (
              <div
                key={s.label}
                className={cn(
                  "rounded-3xl border border-white/10 bg-white/[0.05] p-6 text-center backdrop-blur-md",
                  "shadow-[inset_0_1px_0_rgba(255,255,255,.10)]",
                  "transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]",
                  revealed ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0",
                )}
                style={{ transitionDelay: revealed ? `${i * 110}ms` : "0ms" }}
              >
                <p
                  className="text-5xl font-bold text-accent"
                  style={{ letterSpacing: "-0.035em" }}
                >
                  {s.value}
                </p>
                <p className="mt-2 text-sm font-semibold text-white">{s.label}</p>
                <p className="mt-1 text-xs text-white/50">{s.note}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
