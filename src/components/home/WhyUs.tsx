import { COMPANY, yearsInBusiness } from "@/lib/company";
import { cn } from "@/lib/utils";
import { useRevealOnce } from "@/hooks/useRevealOnce";

const PILLARS = [
  {
    title: "2-3 günde yayında",
    detail:
      "Hazır web sitesi çözümlerinde siteniz günler içinde açılır. Haftalarca beklemenize gerek kalmaz.",
  },
  {
    title: "Alan adını biz alırız",
    detail:
      "Domain kaydı, hosting ve SSL. Teknik altyapının tamamı pakete dahil, siz uğraşmazsınız.",
  },
  {
    title: "E-postanız şirket adınızla",
    detail: "info@sirketiniz.com gibi bir adresten yazışırsınız. Kurulumunu biz yaparız.",
  },
  {
    title: "Metinleri biz yerleştiririz",
    detail: "Yazılarınızı ve fotoğraflarınızı siteye biz koyarız. Size düşen sadece göndermek.",
  },
  {
    title: "Takıldığınız yerde arayın",
    detail: "Site yayına girdikten sonra da buradayız. Bakım ve güncellemeler bizim işimiz.",
  },
  {
    title: "Tek muhatap",
    detail:
      "Alan adı için başka, tasarım için başka yere gitmezsiniz. Her şey tek elden karşılanır.",
  },
];

/**
 * Değer önerisi bölümü. Apple tasarım ilkelerine göre kuruldu:
 * malzeme hissi veren katmanlı kartlar (§12), boyuta göre ayarlanmış
 * tipografi (§15), basılma anında tepki (§1) ve scroll ile kademeli giriş.
 */
export function WhyUs() {
  const { ref, revealed } = useRevealOnce<HTMLDivElement>(0.15);

  return (
    <section className="relative overflow-hidden bg-background py-20 md:py-28">
      {/* Camın üstünde duracağı zemin: çok yumuşak accent yıkaması + ince doku */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[70%]"
        style={{
          background:
            "radial-gradient(120% 70% at 50% 0%, color-mix(in oklch, var(--color-accent) 9%, transparent) 0%, transparent 70%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "radial-gradient(circle, color-mix(in oklch, var(--color-foreground) 8%, transparent) 1px, transparent 1px)",
          backgroundSize: "26px 26px",
          maskImage: "radial-gradient(90% 60% at 50% 30%, #000, transparent 75%)",
          WebkitMaskImage: "radial-gradient(90% 60% at 50% 30%, #000, transparent 75%)",
        }}
      />

      <div ref={ref} className="container relative mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center">
          <h2
            className="font-bold text-foreground"
            style={{
              fontSize: "clamp(1.9rem, 4.2vw, 3.1rem)",
              lineHeight: 1.04,
              letterSpacing: "-0.032em",
            }}
          >
            Siz işinize bakın, teknik tarafı biz halledelim.
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
            Alan adı, hosting, kurumsal e-posta, içerik girişi ve yayın sonrası destek aynı
            pakette. {COMPANY.foundedYear}'den bu yana, {yearsInBusiness()} yıldır böyle
            çalışıyoruz.
          </p>
        </div>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PILLARS.map((p, i) => {
            const wide = i < 2;
            return (
              <article
                key={p.title}
                className={cn(
                  "group relative overflow-hidden rounded-3xl p-6 md:p-7",
                  // Malzeme: yarı saydam yüzey + ışığı yakalayan üst kenar + katmanlı gölge
                  "bg-white/70 backdrop-blur-xl ring-1 ring-black/[0.055]",
                  "shadow-[0_1px_2px_rgba(16,12,20,.04),0_8px_24px_-12px_rgba(16,12,20,.10)]",
                  "transition-[transform,box-shadow] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
                  "hover:-translate-y-1 hover:shadow-[0_2px_4px_rgba(16,12,20,.05),0_22px_50px_-18px_rgba(201,67,110,.28)]",
                  // Basılma anında tepki (§1): beklemeden, parmağın altında
                  "active:translate-y-0 active:scale-[0.985] active:duration-100",
                  wide && "lg:col-span-2 lg:p-9",
                  revealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
                )}
                style={{
                  transitionProperty: "transform, box-shadow, opacity",
                  transitionDelay: revealed ? `${i * 70}ms` : "0ms",
                }}
              >
                {/* Üst kenarda ışık çizgisi: yüzeyin kalınlığını hissettirir */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent"
                />
                {/* Geniş kartlarda accent yıkaması */}
                {wide && (
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full opacity-70 blur-3xl"
                    style={{
                      background:
                        "color-mix(in oklch, var(--color-accent) 22%, transparent)",
                    }}
                  />
                )}

                <div className="relative">
                  {/* İkon yerine ince accent çizgi: hover'da uzar. */}
                  <span
                    aria-hidden="true"
                    className={cn(
                      "block h-[3px] origin-left rounded-full bg-accent",
                      "transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-[1.6]",
                      wide ? "w-12" : "w-9",
                    )}
                  />

                  <h3
                    className={cn("mt-5 font-semibold text-foreground", wide ? "text-2xl" : "text-lg")}
                    style={{ letterSpacing: wide ? "-0.022em" : "-0.012em", lineHeight: 1.2 }}
                  >
                    {p.title}
                  </h3>
                  <p
                    className={cn(
                      "mt-2 leading-relaxed text-muted-foreground",
                      wide ? "text-base max-w-md" : "text-sm",
                    )}
                  >
                    {p.detail}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
