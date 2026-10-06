import { useState, type FormEvent } from "react";
import { useNavigate } from "@tanstack/react-router";
import { ArrowRight, Gauge, Search } from "lucide-react";

import { useRevealOnce } from "@/hooks/useRevealOnce";
import { ScoreDial } from "@/components/audit/ScoreDial";
import { SEVERITY_META } from "@/lib/audit/types";
import { cn } from "@/lib/utils";

/** Örnek rapordaki kategoriler — aracın gerçek ağırlıklarıyla aynı. */
const SAMPLE_ROWS = [
  { label: "Hız & Performans", value: 38 },
  { label: "Teknik SEO", value: 32 },
  { label: "Mobil & Erişilebilirlik", value: 74 },
  { label: "Güven & Dönüşüm", value: 20 },
  { label: "Sosyal & Paylaşım", value: 17 },
];

const SAMPLE_FINDINGS = [
  { severity: "kritik" as const, text: "Yapısal veri (schema) yok" },
  { severity: "kritik" as const, text: "sitemap.xml bulunamadı" },
  { severity: "onemli" as const, text: "Paylaşım görseli (og:image) yok" },
];

export function AuditPromo() {
  const { ref, revealed } = useRevealOnce<HTMLDivElement>(0.25);
  const [url, setUrl] = useState("");
  const navigate = useNavigate();

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const value = url.trim();
    if (!value) return;
    navigate({ to: "/araclar/site-analizi", search: { url: value } });
  };

  return (
    <section data-track-location="home_audit_promo" className="relative overflow-hidden bg-[#0a0a12] py-20 md:py-28">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div
          className="absolute -left-32 top-0 h-[30rem] w-[30rem] rounded-full opacity-35 blur-[110px] animate-[aurora-a_26s_ease-in-out_infinite]"
          style={{ background: "radial-gradient(circle,#C9436E,transparent 68%)" }}
        />
        <div
          className="absolute -right-40 bottom-0 h-[28rem] w-[28rem] rounded-full opacity-25 blur-[110px] animate-[aurora-b_32s_ease-in-out_infinite]"
          style={{ background: "radial-gradient(circle,#8B5CF6,transparent 68%)" }}
        />
      </div>

      <div ref={ref} className="container relative mx-auto px-4">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-6 xl:col-span-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-accent/25 bg-accent/10 px-3 py-1.5">
              <Gauge className="h-3.5 w-3.5 text-accent" />
              <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-accent">
                Ücretsiz Araç
              </span>
            </div>

            <h2 className="mt-5 text-4xl font-bold leading-[1.06] tracking-tight text-white md:text-5xl">
              Sitenizin skoru
              <br />
              kaç çıkardı?
            </h2>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-white/55">
              Adresinizi yazın; hızını, teknik SEO'sunu, mobil uyumunu ve güven sinyallerini
              tarayıp 100 üzerinden puanlayalım. Neyin eksik olduğunu tek tek görün.
            </p>

            <form onSubmit={submit} className="mt-8 flex flex-col gap-3 sm:flex-row sm:max-w-lg">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
                <input
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  inputMode="url"
                  aria-label="Analiz edilecek site adresi"
                  placeholder="siteniz.com"
                  className="w-full rounded-full border border-white/12 bg-white/[0.05] py-4 pl-11 pr-4 text-sm text-white placeholder:text-white/25 outline-none transition-colors focus:border-accent focus:bg-white/[0.09]"
                />
              </div>
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-accent px-7 py-4 text-sm font-semibold text-white shadow-lg transition-transform hover:scale-[1.03] active:scale-[0.98]"
              >
                Skorumu gör
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>

            <p className="mt-3 text-xs text-white/35">
              Ücretsiz · kayıt gerekmez · ilk bulgular hemen ekranda
            </p>
          </div>

          {/* Örnek rapor: aracın gerçekten ne çıkardığını gösterir. */}
          <div className="lg:col-span-6 xl:col-span-5">
            <div
              className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.035] p-6 backdrop-blur-xl transition-all duration-700 md:p-7"
              style={{
                opacity: revealed ? 1 : 0,
                transform: revealed ? "none" : "translateY(20px)",
              }}
            >
              <span className="absolute right-5 top-5 rounded-full border border-white/12 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/35">
                Örnek rapor
              </span>

              <div className="flex items-center gap-5">
                <ScoreDial score={revealed ? 42 : 0} size={116} />
                <div className="min-w-0">
                  <p className="text-lg font-bold" style={{ color: "#F97316" }}>
                    Zayıf
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-white/45">
                    Bu sitede 15 bulgu çıktı, 4'ü kritik.
                  </p>
                </div>
              </div>

              <div className="mt-6 space-y-2.5">
                {SAMPLE_ROWS.map((row, i) => (
                  <div key={row.label}>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-white/55">{row.label}</span>
                      <span className="font-semibold text-white/75">{row.value}%</span>
                    </div>
                    <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-white/10">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: revealed ? `${row.value}%` : "0%",
                          background:
                            row.value >= 65 ? "#F59E0B" : row.value >= 40 ? "#F97316" : "#EF4444",
                          transition: `width 900ms cubic-bezier(0.22,1,0.36,1) ${240 + i * 110}ms`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 space-y-2 border-t border-white/[0.07] pt-5">
                {SAMPLE_FINDINGS.map((f, i) => {
                  const meta = SEVERITY_META[f.severity];
                  return (
                    <div
                      key={f.text}
                      className={cn("flex items-center gap-2.5 transition-all duration-500")}
                      style={{
                        opacity: revealed ? 1 : 0,
                        transform: revealed ? "none" : "translateX(-8px)",
                        transitionDelay: `${800 + i * 130}ms`,
                      }}
                    >
                      <span
                        className="shrink-0 rounded-full px-2 py-0.5 text-[9px] font-bold tracking-[0.1em]"
                        style={{ background: `${meta.color}22`, color: meta.color }}
                      >
                        {meta.label}
                      </span>
                      <span className="truncate text-xs text-white/60">{f.text}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
