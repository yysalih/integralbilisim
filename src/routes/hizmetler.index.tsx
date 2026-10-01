import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

import { CtaSection } from "@/components/home/CtaSection";
import { mediaUrl } from "@/lib/media";
import { CATEGORY_LABELS, SERVICES, type ServiceCategory, type ServiceMeta } from "@/lib/services";
import { useRevealOnce } from "@/hooks/useRevealOnce";
import { cn } from "@/lib/utils";
import { breadcrumbSchema, jsonLd, pageHead } from "@/lib/seo";

export const Route = createFileRoute("/hizmetler/")({
  head: () => ({
    ...pageHead({
      title: "Hizmetlerimiz | İntegral Bilişim",
      description:
        "Web tasarım, e-ticaret, mobil uygulama, SEO, sosyal medya ve marka tescili. Tek elden yürüttüğümüz 14 dijital hizmet.",
      path: "/hizmetler",
      image: "/og/hizmetler.png",
    }),
    scripts: [
      jsonLd(
        breadcrumbSchema([
          { name: "Ana Sayfa", path: "/" },
          { name: "Hizmetler", path: "/hizmetler" },
        ]),
      ),
    ],
  }),
  component: ServicesIndexPage,
});

/** Bölüm sırası: web ve yazılım önce, sonra pazarlama, en sonda marka işleri. */
const CATEGORIES = Object.keys(CATEGORY_LABELS) as ServiceCategory[];

function ServicesIndexPage() {
  return (
    <>
      {/* Sayfa boyunca akan renkli zemin */}
      <div className="relative overflow-hidden bg-[#0a0a12]">
        <PageAurora />

        <section className="relative py-24 md:py-32">
          <div className="container mx-auto px-4 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/50">
              İntegral Bilişim
            </p>
            <h1
              className="mx-auto mt-6 max-w-3xl font-bold text-white"
              style={{
                fontSize: "clamp(2.2rem, 5.5vw, 4rem)",
                lineHeight: 1.03,
                letterSpacing: "-0.035em",
              }}
            >
              Dijitalde ihtiyacınız olan her şey.
            </h1>
            <p className="mx-auto mt-6 max-w-2xl leading-relaxed text-white/60">
              Web tasarımdan marka tesciline, reklam yönetiminden kurumsal kimliğe: tüm
              ihtiyaçlarınız tek elden, profesyonel bir yaklaşımla.
            </p>
          </div>
        </section>

        <div className="relative container mx-auto px-4 pb-24 md:pb-32">
          {CATEGORIES.map((cat) => (
            <CategoryBlock key={cat} category={cat} />
          ))}
        </div>
      </div>
      <CtaSection />
    </>
  );
}

/** Sayfanın tamamına yayılan, yavaşça yer değiştiren renk kütleleri. */
function PageAurora() {
  const layers = [
    { top: "-8%", left: "-12%", size: "h-[52vh] w-[55vw]", color: "#C9436E4d", anim: "aurora-a 17s ease-in-out infinite" },
    { top: "18%", left: "58%", size: "h-[46vh] w-[48vw]", color: "#3B82F63d", anim: "aurora-b 21s ease-in-out infinite" },
    { top: "42%", left: "-6%", size: "h-[48vh] w-[46vw]", color: "#8B5CF63d", anim: "aurora-c 26s ease-in-out infinite" },
    { top: "62%", left: "55%", size: "h-[50vh] w-[50vw]", color: "#10B98130", anim: "aurora-a 23s ease-in-out infinite" },
    { top: "84%", left: "10%", size: "h-[44vh] w-[52vw]", color: "#F59E0B2b", anim: "aurora-b 19s ease-in-out infinite" },
  ];

  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden="true">
      {layers.map((l, i) => (
        <div
          key={i}
          className={cn("absolute rounded-full blur-[110px] will-change-transform", l.size)}
          style={{ top: l.top, left: l.left, backgroundColor: l.color, animation: l.anim }}
        />
      ))}
      {/* Renk kütlelerinin üstünde ince doku */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
          backgroundSize: "30px 30px",
        }}
      />
    </div>
  );
}

function CategoryBlock({ category }: { category: ServiceCategory }) {
  const { ref, revealed } = useRevealOnce<HTMLDivElement>(0.08);
  const items = SERVICES.filter((s) => s.category === category);

  return (
    <div ref={ref} className="mb-16 last:mb-0 md:mb-20">
      <div className="mb-7 flex items-end gap-4">
        <h2
          className="font-bold text-white"
          style={{ fontSize: "clamp(1.4rem, 2.6vw, 2rem)", letterSpacing: "-0.028em" }}
        >
          {CATEGORY_LABELS[category]}
        </h2>
        <span className="mb-2 h-px flex-1 bg-gradient-to-r from-white/20 to-transparent" />
      </div>

      <div
        className={cn(
          "grid gap-5 sm:grid-cols-2",
          // Hücre sayısı içerikle birebir olsun; satır sonunda boşluk kalmasın.
          items.length === 4 ? "lg:grid-cols-2" : "lg:grid-cols-3",
        )}
      >
        {items.map((s, i) => (
          <ServiceCard
            key={s.slug}
            service={s}
            index={i}
            revealed={revealed}
            // 5 öğede ilk kart iki hücre kaplar: 2+4 = iki tam satır.
            wide={items.length % 3 === 2 && i === 0}
          />
        ))}
      </div>
    </div>
  );
}

function ServiceCard({
  service: s,
  index,
  revealed,
  wide = false,
}: {
  service: ServiceMeta;
  index: number;
  revealed: boolean;
  wide?: boolean;
}) {
  return (
    <Link
      to="/hizmetler/$slug"
      params={{ slug: s.slug }}
      className={cn(
        "group relative flex min-h-[380px] flex-col justify-end overflow-hidden rounded-3xl p-6 md:min-h-[420px]",
        wide && "lg:col-span-2",
        "ring-1 ring-white/10 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
        "hover:-translate-y-1.5 active:translate-y-0 active:scale-[0.99] active:duration-100",
        revealed ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0",
      )}
      style={{
        background: `linear-gradient(155deg, ${s.accent}26 0%, #14141f 60%, #0d0d16 100%)`,
        transitionDelay: revealed ? `${index * 70}ms` : "0ms",
      }}
    >
      {s.image && (
        <>
          <img
            src={mediaUrl(s.image)}
            alt=""
            aria-hidden="true"
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/72 to-black/25" />
        </>
      )}

      {/* Hover'da markanın renginde iç kenarlık ve ışıma */}
      <span
        className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ boxShadow: `inset 0 0 0 1px ${s.accent}80, 0 24px 60px -24px ${s.accent}66` }}
      />

      <div className="relative">
        <h3
          className="text-xl font-bold text-white md:text-2xl"
          style={{ letterSpacing: "-0.02em" }}
        >
          {s.title}
        </h3>
        <p className="mt-2.5 line-clamp-3 text-sm leading-relaxed text-white/65">{s.short}</p>
        <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-white/75 transition-colors group-hover:text-white">
          İncele
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" />
        </span>
      </div>
    </Link>
  );
}
