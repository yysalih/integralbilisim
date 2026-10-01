import { createFileRoute } from "@tanstack/react-router";

import { CtaSection } from "@/components/home/CtaSection";
import { REFERENCES } from "@/lib/references";
import { useRevealOnce } from "@/hooks/useRevealOnce";
import { cn } from "@/lib/utils";
import { breadcrumbSchema, jsonLd, pageHead } from "@/lib/seo";

export const Route = createFileRoute("/referanslar")({
  head: () => {
    const base = pageHead({
      title: "Referanslar | İntegral Bilişim",
      description:
        "Zemin firmalarından hukuk bürolarına, restoranlardan teknoloji şirketlerine. Birlikte çalıştığımız 153 marka.",
      path: "/referanslar",
      image: "/og/referanslar.png",
    });
    return {
      ...base,
      scripts: [
        jsonLd(
          breadcrumbSchema([
            { name: "Ana Sayfa", path: "/" },
            { name: "Referanslar", path: "/referanslar" },
          ]),
        ),
      ],
    };
  },
  component: ReferencesPage,
});

function ReferencesPage() {
  const { ref, revealed } = useRevealOnce<HTMLDivElement>(0.05);

  return (
    <>
      <section className="relative overflow-hidden bg-background pb-14 pt-28 md:pb-16 md:pt-32">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-[70%]"
          style={{
            background:
              "radial-gradient(100% 60% at 50% 0%, color-mix(in oklch, var(--color-accent) 10%, transparent) 0%, transparent 72%)",
          }}
        />
        <div className="container relative mx-auto px-4 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent">Referanslar</p>
          <h1
            className="mx-auto mt-5 max-w-3xl font-bold text-foreground"
            style={{
              fontSize: "clamp(2rem, 4.8vw, 3.5rem)",
              lineHeight: 1.06,
              letterSpacing: "-0.035em",
            }}
          >
            {REFERENCES.length} markanın dijital yüzü.
          </h1>
          <p className="mx-auto mt-5 max-w-2xl leading-relaxed text-muted-foreground">
            Zemin ve inşaattan hukuka, yeme-içmeden teknolojiye kadar pek çok sektörde çalıştık.
          </p>
        </div>
      </section>

      <section className="bg-background pb-20 md:pb-28">
        <div ref={ref} className="container mx-auto px-4">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-5">
            {REFERENCES.map((r, i) => (
              <div
                key={r.logo}
                className={cn(
                  "flex min-h-[120px] items-center justify-center rounded-2xl bg-white/70 p-5 backdrop-blur-xl",
                  "ring-1 ring-black/[0.055] shadow-[0_1px_2px_rgba(16,12,20,.04)]",
                  "transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
                  "hover:-translate-y-1 hover:shadow-[0_2px_4px_rgba(16,12,20,.05),0_16px_36px_-18px_rgba(201,67,110,.25)]",
                  revealed ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0",
                )}
                // Uzun listede gecikme sınırlanır; son kartlar da makul sürede belirir.
                style={{ transitionDelay: revealed ? `${Math.min(i, 24) * 25}ms` : "0ms" }}
              >
                <img
                  src={r.logo}
                  alt={r.name}
                  loading="lazy"
                  className="max-h-14 w-auto max-w-full object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaSection />
    </>
  );
}
