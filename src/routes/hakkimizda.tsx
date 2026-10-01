import { createFileRoute } from "@tanstack/react-router";
import { Eye, Target } from "lucide-react";

import { CtaSection } from "@/components/home/CtaSection";
import { VideoWall } from "@/components/home/VideoWall";
import { COMPANY, yearsInBusiness } from "@/lib/company";
import { REFERENCES } from "@/lib/references";
import { SERVICES } from "@/lib/services";
import { mediaUrl } from "@/lib/media";
import { useRevealOnce } from "@/hooks/useRevealOnce";
import { cn } from "@/lib/utils";
import { breadcrumbSchema, jsonLd, pageHead } from "@/lib/seo";

export const Route = createFileRoute("/hakkimizda")({
  head: () => {
    const base = pageHead({
      title: "Hakkımızda | İntegral Bilişim",
      description:
        "2007'den beri İstanbul'da web tasarım, yazılım ve dijital pazarlama hizmetleri. Misyonumuz, vizyonumuz ve çalışma biçimimiz.",
      path: "/hakkimizda",
      image: "/og/hakkimizda.png",
    });
    return {
      ...base,
      scripts: [
        jsonLd(
          breadcrumbSchema([
            { name: "Ana Sayfa", path: "/" },
            { name: "Hakkımızda", path: "/hakkimizda" },
          ]),
        ),
      ],
    };
  },
  component: AboutPage,
});

// integralbilisim.com/hakkimizda sayfasındaki metnin kendisi.
const STORY_ONE = [
  "Günümüz iş dünyasında internet artık şirketler için bir keyfiyet değil bir zorunluluk haline gelmiştir. Rekabet ortamının giderek arttığı ve gelecek yıllarda daha da artacağı düşünüldüğünde şirketinizi bir adım öne taşımak ve bir farklılık yaratmak için yeniliklere açık olmak, yenilikleri takip etmek ve buna göre pozisyonunuzu belirlemek zorundasınız.",
  "Profesyonel bir web sitesine sahip olmak bu farklılığı yaratmak için önemli bir adımdır.",
];

const STORY_TWO = [
  "Hep söylenen klasik bir cümle var: internette kimse sizin kim olduğunuzu, ne olduğunuzu bilmez. Çok büyük kurumsal bir firma olabileceğiniz gibi küçük ölçekli bir şirkete de sahip olabilirsiniz; ancak sitenizi ziyaret edenler bunu bilemezler.",
  "Kötü dizayn edilmiş ve altyapısı düzgün olmayan bir web sitesine sahip büyük ölçekli bir kurumsal firma kendini olduğundan daha küçük ve amatör gösterebileceği gibi, profesyonel bir yazılım ve tasarım altyapısına sahip küçük bir firma kendini olduğundan daha büyük ve profesyonel gösterebilir.",
];

function AboutPage() {
  return (
    <>
      <ManifestoHero />
      <StoryBlock
        heading="Neden profesyonel bir web sitesi?"
        paragraphs={STORY_ONE}
        image="/covers/5.jpeg"
        imageFirst={false}
        topSpacing
      />
      <StoryBlock
        heading="Sitenizin nasıl göründüğü, sizin nasıl göründüğünüzdür."
        paragraphs={STORY_TWO}
        image="/images/b.jpeg"
        imageFirst
      />
      <ApproachBlock />
      <MissionVisionSection />
      <VideoWall title="Memnun müşteriler." subtitle="Sesi açmak için bir videoya dokunun." />
      <CtaSection />
    </>
  );
}

/** Kısa punchline + fotoğraf arka planlı açılış. */
function ManifestoHero() {
  return (
    <section className="relative overflow-hidden bg-[#0a0a12] py-28 md:py-36">
      <img
        src={mediaUrl("/covers/1.jpeg")}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-95"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#0a0a12]/72 via-[#0a0a12]/30 to-[#0a0a12]/82" />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(56% 74% at 50% 44%, rgba(10,10,18,.7) 0%, rgba(10,10,18,.24) 62%, transparent 100%)",
        }}
      />

      <div className="container relative mx-auto px-4 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/55">
          Hakkımızda
        </p>
        <h1
          className="mx-auto mt-6 max-w-3xl font-bold text-white"
          style={{
            fontSize: "clamp(2.2rem, 5.4vw, 4rem)",
            lineHeight: 1.04,
            letterSpacing: "-0.035em",
          }}
        >
          Sizi internette en iyi şekilde temsil ediyoruz.
        </h1>

        <div className="mx-auto mt-12 grid max-w-3xl grid-cols-3 gap-4 text-center">
          {[
            { v: String(yearsInBusiness()), l: "yıllık deneyim" },
            { v: `${REFERENCES.length}+`, l: "referans marka" },
            { v: String(SERVICES.length), l: "hizmet alanı" },
          ].map((s) => (
            <div key={s.l}>
              <p
                className="text-4xl font-bold text-white md:text-5xl"
                style={{ letterSpacing: "-0.035em" }}
              >
                {s.v}
              </p>
              <p className="mt-1.5 text-xs text-white/55 md:text-sm">{s.l}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Metin + görsel iki kolon; sırası dönüşümlü. */
function StoryBlock({
  heading,
  paragraphs,
  image,
  imageFirst,
  topSpacing = false,
}: {
  heading: string;
  paragraphs: string[];
  image: string;
  imageFirst: boolean;
  /** Hero'dan hemen sonra gelen blok için üst boşluk. */
  topSpacing?: boolean;
}) {
  const { ref, revealed } = useRevealOnce<HTMLDivElement>(0.15);
  return (
    <section className={cn("bg-background pb-20 md:pb-28", topSpacing && "pt-20 md:pt-28")}>
      <div ref={ref} className="container mx-auto px-4">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div className={cn(imageFirst && "lg:order-2")}>
            <h2
              className="font-bold text-foreground"
              style={{
                fontSize: "clamp(1.6rem, 3.2vw, 2.4rem)",
                lineHeight: 1.1,
                letterSpacing: "-0.03em",
              }}
            >
              {heading}
            </h2>
            <div className="mt-6 space-y-5">
              {paragraphs.map((p, i) => (
                <p
                  key={i}
                  className={cn(
                    "leading-relaxed text-muted-foreground transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]",
                    revealed ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0",
                  )}
                  style={{ transitionDelay: revealed ? `${i * 90}ms` : "0ms" }}
                >
                  {p}
                </p>
              ))}
            </div>
          </div>

          <div
            className={cn(
              "overflow-hidden rounded-3xl ring-1 ring-black/[0.06]",
              "shadow-[0_20px_50px_-24px_rgba(16,12,20,.28)]",
              "transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]",
              imageFirst && "lg:order-1",
              revealed ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0",
            )}
          >
            <img
              src={mediaUrl(image)}
              alt=""
              aria-hidden="true"
              loading="lazy"
              className="aspect-[4/3] w-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

/** Yaklaşımımız: sitedeki "yola çıktık" ve hazır site paragrafları. */
function ApproachBlock() {
  const { ref, revealed } = useRevealOnce<HTMLDivElement>(0.15);
  return (
    <section className="bg-background pb-20 md:pb-28">
      <div ref={ref} className="container mx-auto max-w-3xl px-4 text-center">
        <h2
          className="font-bold text-foreground"
          style={{
            fontSize: "clamp(1.6rem, 3.2vw, 2.4rem)",
            lineHeight: 1.1,
            letterSpacing: "-0.03em",
          }}
        >
          Bu yüzden yola çıktık.
        </h2>
        <p
          className={cn(
            "mt-6 leading-relaxed text-muted-foreground transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]",
            revealed ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0",
          )}
        >
          İntegral Bilişim ve Yazılım Hizmetleri olarak tecrübeli ve profesyonel kadromuz,
          güvenilir, modern, en son teknolojiyi kullanan yazılım ve donanım altyapımızla yola
          çıktık. Firmanız ister küçük ölçekli ister büyük kurumsal olsun fark etmez; sizi sanal
          dünyada en iyi şekilde temsil eden profesyonel bir web sitesi hizmeti veriyoruz.
        </p>
        <p
          className={cn(
            "mt-5 leading-relaxed text-muted-foreground transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]",
            revealed ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0",
          )}
          style={{ transitionDelay: revealed ? "90ms" : "0ms" }}
        >
          Özellikle hazır web sitesi hizmetlerimizle, içerikleri hazır olan firmalara 2 veya 3 gün
          içerisinde web sitelerini A'dan Z'ye hazır hale getirip internet ortamında
          yayınlayabiliyoruz.
        </p>
        <p className="mt-9 text-lg font-semibold text-foreground">
          Böyle bir web sitesine sahip olmak size bir telefon kadar yakın.
        </p>
        <a
          href={`tel:${COMPANY.phoneMobile.replace(/\s/g, "")}`}
          className="mt-5 inline-flex rounded-full bg-accent px-7 py-3.5 text-sm font-semibold text-white shadow-lg transition-transform duration-200 hover:scale-105 active:scale-[0.98]"
        >
          {COMPANY.phoneMobile}
        </a>
      </div>
    </section>
  );
}

function MissionVisionSection() {
  const { ref, revealed } = useRevealOnce<HTMLDivElement>(0.2);
  const cards = [
    { icon: Target, title: "Misyonumuz", text: COMPANY.mission },
    { icon: Eye, title: "Vizyonumuz", text: COMPANY.vision },
  ];

  return (
    <section id="misyon-vizyon" className="scroll-mt-24 bg-background pb-20 md:pb-28">
      <div ref={ref} className="container mx-auto px-4">
        <div className="grid gap-4 md:grid-cols-2">
          {cards.map((c, i) => (
            <div
              key={c.title}
              className={cn(
                "rounded-3xl bg-white/70 p-8 backdrop-blur-xl ring-1 ring-black/[0.055] md:p-10",
                "shadow-[0_1px_2px_rgba(16,12,20,.04),0_14px_38px_-20px_rgba(16,12,20,.14)]",
                "transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]",
                revealed ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0",
              )}
              style={{ transitionDelay: revealed ? `${i * 130}ms` : "0ms" }}
            >
              <c.icon className="h-5 w-5 text-accent" strokeWidth={1.75} />
              <h2
                className="mt-5 text-2xl font-bold text-foreground"
                style={{ letterSpacing: "-0.022em" }}
              >
                {c.title}
              </h2>
              <p className="mt-4 leading-relaxed text-muted-foreground">{c.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
