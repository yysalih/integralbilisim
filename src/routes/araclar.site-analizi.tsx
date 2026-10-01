import { createFileRoute } from "@tanstack/react-router";
import { Eye, Gift, ShieldCheck } from "lucide-react";

import { AuditTool } from "@/components/audit/AuditTool";
import { breadcrumbSchema, jsonLd, pageHead } from "@/lib/seo";

export const Route = createFileRoute("/araclar/site-analizi")({
  // Ana sayfadaki mini formdan gelen adres doğrudan taramayı başlatır.
  validateSearch: (search: Record<string, unknown>): { url?: string } => ({
    url: typeof search.url === "string" ? search.url.slice(0, 300) : undefined,
  }),
  head: () => ({
    ...pageHead({
      title: "Web Siteniz Ne Kadar Güçlü? | Ücretsiz Site Analizi",
      description:
        "Sitenizin hızını, teknik SEO'sunu, mobil uyumunu ve güven sinyallerini ölçün. 100 üzerinden skor, somut bulgular ve ne yapılması gerektiği — ücretsiz.",
      path: "/araclar/site-analizi",
      image: "/og/site-analizi.png",
    }),
    scripts: [
      jsonLd(
        breadcrumbSchema([
          { name: "Ana Sayfa", path: "/" },
          { name: "Araçlar", path: "/araclar" },
          { name: "Site Analizi", path: "/araclar/site-analizi" },
        ]),
      ),
    ],
  }),
  component: SiteAuditPage,
});

const PROMISES = [
  { icon: Gift, text: "Ücretsiz, kayıt yok" },
  { icon: Eye, text: "İlk bulgular hemen ekranda" },
  { icon: ShieldCheck, text: "Suçlayıcı değil, yol gösterici" },
];

function SiteAuditPage() {
  const { url } = Route.useSearch();
  return (
    <section className="relative min-h-screen overflow-hidden bg-[#0a0a12] pb-24 pt-28 md:pt-32">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute -left-40 -top-52 h-[36rem] w-[36rem] rounded-full opacity-40 blur-[120px] animate-[aurora-a_26s_ease-in-out_infinite]"
          style={{ background: "radial-gradient(circle,#C9436E,transparent 68%)" }}
        />
        <div
          className="absolute -right-52 top-24 h-[32rem] w-[32rem] rounded-full opacity-30 blur-[120px] animate-[aurora-b_32s_ease-in-out_infinite]"
          style={{ background: "radial-gradient(circle,#8B5CF6,transparent 68%)" }}
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

      <div className="container relative mx-auto px-4">
        <div className="mx-auto max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-accent">
            Ücretsiz Araç
          </p>
          <h1 className="mt-4 text-4xl font-bold leading-[1.05] tracking-tight text-white sm:text-5xl">
            Web siteniz
            <br />
            ne kadar güçlü?
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-white/55">
            Adresinizi yazın; sitenizi gerçek verilerle tarayıp 100 üzerinden bir skor ve
            neyin eksik olduğunu tek tek çıkaralım.
          </p>

          <ul className="mt-7 flex flex-wrap gap-x-6 gap-y-3">
            {PROMISES.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-2 text-xs font-medium text-white/45">
                <Icon className="h-3.5 w-3.5 text-accent" />
                {text}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-12 md:mt-14">
          <AuditTool initialUrl={url} />
        </div>
      </div>
    </section>
  );
}
