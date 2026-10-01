import { createFileRoute } from "@tanstack/react-router";
import { Clock, Lock, ShieldCheck } from "lucide-react";

import { QuoteWizard } from "@/components/quote/QuoteWizard";
import { breadcrumbSchema, jsonLd, pageHead } from "@/lib/seo";

export const Route = createFileRoute("/teklif")({
  // Hero ve araç kartlarından gelen bağlantı hizmeti önceden seçili getirir.
  validateSearch: (search: Record<string, unknown>): { services?: string } => ({
    services: typeof search.services === "string" ? search.services.slice(0, 200) : undefined,
  }),
  head: () => ({
    ...pageHead({
      title: "Teklif Alın | İntegral Bilişim",
      description:
        "Birkaç soruyla projenizin kapsamını netleştirin, talebinizi anında bize iletin. Web sitesi, e-ticaret, mobil uygulama ve dijital pazarlama için teklif.",
      path: "/teklif",
      image: "/og/teklif.png",
    }),
    scripts: [
      jsonLd(
        breadcrumbSchema([
          { name: "Ana Sayfa", path: "/" },
          { name: "Teklif Alın", path: "/teklif" },
        ]),
      ),
    ],
  }),
  component: QuotePage,
});

const ASSURANCES = [
  { icon: Clock, text: "Yaklaşık 90 saniye" },
  { icon: Lock, text: "İletişim bilgisi en sonda" },
  { icon: ShieldCheck, text: "Satış baskısı yok" },
];

function QuotePage() {
  const { services } = Route.useSearch();
  return (
    <section className="relative min-h-screen overflow-hidden bg-[#0a0a12] pb-20 pt-28 md:pt-32">
      <QuoteAurora />

      <div className="container relative mx-auto px-4">
        <div className="mx-auto max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-accent">
            Teklif Sihirbazı
          </p>
          <h1 className="mt-4 text-4xl font-bold leading-[1.05] tracking-tight text-white sm:text-5xl">
            Projenizi birlikte
            <br />
            netleştirelim.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-white/55">
            Birkaç soru soruyoruz, siz cevapladıkça kapsam netleşiyor. Sonunda talebinizin
            özetini çıkarıp size dönüş yapıyoruz.
          </p>

          <ul className="mt-7 flex flex-wrap gap-x-6 gap-y-3">
            {ASSURANCES.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-2 text-xs font-medium text-white/45">
                <Icon className="h-3.5 w-3.5 text-accent" />
                {text}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-12 md:mt-14">
          <QuoteWizard initialServices={services} />
        </div>
      </div>
    </section>
  );
}

/** Sayfanın arkasında yavaşça dolaşan marka ışıkları. */
function QuoteAurora() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className="absolute -left-40 -top-52 h-[38rem] w-[38rem] rounded-full opacity-45 blur-[120px] animate-[aurora-a_26s_ease-in-out_infinite]"
        style={{ background: "radial-gradient(circle,#C9436E,transparent 68%)" }}
      />
      <div
        className="absolute -right-52 top-24 h-[34rem] w-[34rem] rounded-full opacity-35 blur-[120px] animate-[aurora-b_32s_ease-in-out_infinite]"
        style={{ background: "radial-gradient(circle,#8B5CF6,transparent 68%)" }}
      />
      <div
        className="absolute inset-x-0 bottom-[-16rem] mx-auto h-[30rem] w-[46rem] rounded-full opacity-25 blur-[130px] animate-[aurora-c_38s_ease-in-out_infinite]"
        style={{ background: "radial-gradient(circle,#C9436E,transparent 70%)" }}
      />
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.5) 1px,transparent 1px)",
          backgroundSize: "72px 72px",
          maskImage: "radial-gradient(ellipse at 50% 0%,#000 25%,transparent 68%)",
        }}
      />
    </div>
  );
}
