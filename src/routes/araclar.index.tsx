import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Calculator, Gauge, Sparkles } from "lucide-react";

import { breadcrumbSchema, jsonLd, pageHead } from "@/lib/seo";

export const Route = createFileRoute("/araclar/")({
  head: () => ({
    ...pageHead({
      title: "Ücretsiz Araçlar | İntegral Bilişim",
      description:
        "Sitenizin teknik sağlığını ölçün, bütçenizi 90 saniyede hesaplayın. Kayıt gerekmeden çalışan ücretsiz araçlar.",
      path: "/araclar",
      image: "/og/araclar.png",
    }),
    scripts: [
      jsonLd(
        breadcrumbSchema([
          { name: "Ana Sayfa", path: "/" },
          { name: "Araçlar", path: "/araclar" },
        ]),
      ),
    ],
  }),
  component: ToolsHub,
});

function ToolsHub() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-[#0a0a12] pb-24 pt-28 md:pt-32">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute -left-40 -top-48 h-[34rem] w-[34rem] rounded-full opacity-40 blur-[120px] animate-[aurora-a_26s_ease-in-out_infinite]"
          style={{ background: "radial-gradient(circle,#C9436E,transparent 68%)" }}
        />
        <div
          className="absolute -right-48 top-20 h-[30rem] w-[30rem] rounded-full opacity-30 blur-[120px] animate-[aurora-b_32s_ease-in-out_infinite]"
          style={{ background: "radial-gradient(circle,#8B5CF6,transparent 68%)" }}
        />
      </div>

      <div className="container relative mx-auto px-4">
        <div className="mx-auto max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-accent">Araçlar</p>
          <h1 className="mt-4 text-4xl font-bold leading-[1.05] tracking-tight text-white sm:text-5xl">
            Önce ölçün,
            <br />
            sonra karar verin.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-white/55">
            Sitenizin bugün nerede durduğunu ve işinizin ne kadara mal olacağını gösteren
            ücretsiz araçlar. Satış konuşması yok; sadece rakamlar ve bulgular.
          </p>

          <div className="mt-12 grid gap-4 sm:grid-cols-2">
            <Link
              to="/araclar/site-analizi"
              className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-7 transition-all duration-300 hover:-translate-y-1 hover:border-white/20"
            >
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -right-10 -top-12 h-36 w-36 rounded-full bg-accent/35 blur-3xl transition-opacity duration-500 group-hover:opacity-100"
              />
              <div className="relative">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-accent/15">
                  <Gauge className="h-5 w-5 text-accent" />
                </div>
                <h2 className="mt-5 text-xl font-bold text-white">Web Siteniz Ne Kadar Güçlü?</h2>
                <p className="mt-2 text-sm leading-relaxed text-white/55">
                  Hız, teknik SEO, mobil uyum, güven ve paylaşım sinyallerini ölçer; 100 üzerinden
                  skor ve somut bulgular verir.
                </p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-white">
                  Sitenizi analiz edin
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </Link>

            <Link
              to="/teklif"
              className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-7 transition-all duration-300 hover:-translate-y-1 hover:border-white/20"
            >
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -right-10 -top-12 h-36 w-36 rounded-full bg-[#8B5CF6]/35 blur-3xl transition-opacity duration-500 group-hover:opacity-100"
              />
              <div className="relative">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#8B5CF6]/15">
                  <Calculator className="h-5 w-5 text-[#8B5CF6]" />
                </div>
                <h2 className="mt-5 text-xl font-bold text-white">Teklif Sihirbazı</h2>
                <p className="mt-2 text-sm leading-relaxed text-white/55">
                  Birkaç soruyla kapsamı netleştirir, tahmini bütçe aralığınızı ekranda
                  gösterir. İletişim bilgisi en sonda istenir.
                </p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-white">
                  Bütçenizi hesaplayın
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </Link>

            <div className="relative overflow-hidden rounded-3xl border border-dashed border-white/12 bg-white/[0.015] p-7">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/[0.06]">
                <Sparkles className="h-5 w-5 text-white/40" />
              </div>
              <h2 className="mt-5 text-xl font-bold text-white/70">
                Yapay Zekaya Ne Kadar Görünürsünüz?
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-white/40">
                Markanızın ChatGPT, Claude ve Perplexity cevaplarında anılıp anılmadığını gerçek
                sorgularla ölçer.
              </p>
              <span className="mt-5 inline-block rounded-full border border-white/12 px-3 py-1 text-xs font-semibold text-white/45">
                Yakında
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
