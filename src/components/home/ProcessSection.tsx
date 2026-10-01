import { cn } from "@/lib/utils";
import { useRevealOnce } from "@/hooks/useRevealOnce";
import { mediaUrl } from "@/lib/media";

const STEPS = [
  {
    no: "01",
    accent: "#C9436E",
    title: "Görüşme & Analiz",
    detail:
      "İhtiyacınızı dinliyor, sektörünüze ve hedef kitlenize en uygun çözümü birlikte belirliyoruz.",
  },
  {
    no: "02",
    accent: "#8B5CF6",
    title: "Tasarım",
    detail:
      "Kullanıcı deneyimini ön planda tutarak estetik, işlevsel ve mobil uyumlu web siteleri tasarlıyoruz.",
  },
  {
    no: "03",
    accent: "#3B82F6",
    title: "İçerik & Kurulum",
    detail:
      "Domain, hosting, içerik, kurumsal e-posta ve teknik destek dahil; tüm ihtiyaçlarınız tek elden karşılanır.",
  },
  {
    no: "04",
    accent: "#10B981",
    title: "Yayın & Destek",
    detail:
      "Hazır web sitesi çözümlerinde siteniz 5 gün içinde yayında olur; sonrasında teknik destekle yanınızdayız.",
  },
];

/** Koyu zeminli süreç bölümü — orb'lı atmosfer, 5.5 deseni. */
export function ProcessSection() {
  const { ref, revealed } = useRevealOnce<HTMLDivElement>(0.2);

  return (
    <section className="relative overflow-hidden bg-[#0a0a12] py-20 md:py-28">
      {/* Arka plan görseli + koyu gradyan sandviçi (şablon 5.5) */}
      <img
        src={mediaUrl("/covers/3.jpeg")}
        alt=""
        aria-hidden="true"
        loading="lazy"
        className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-75"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#0a0a12]/92 via-[#0a0a12]/58 to-[#0a0a12]/94" />
      <div
        className="absolute -left-[15%] top-[10%] h-[50%] w-[45%] rounded-full bg-[#C9436E]/20 blur-[120px]"
        style={{ animation: "orb-drift-a 16s ease-in-out infinite" }}
      />
      <div
        className="absolute -right-[15%] bottom-[5%] h-[55%] w-[45%] rounded-full bg-[#3B82F6]/15 blur-[120px]"
        style={{ animation: "orb-drift-b 20s ease-in-out infinite" }}
      />
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[62%]"
        style={{
          background:
            "radial-gradient(70% 100% at 50% 12%, rgba(10,10,18,.88) 0%, rgba(10,10,18,.45) 55%, transparent 100%)",
        }}
      />
      <div ref={ref} className="container relative mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-3 flex items-center justify-center gap-3 text-[11px] uppercase tracking-[0.25em] text-white/50">
            <span className="h-px w-10 bg-gradient-to-r from-transparent to-white/30" />
            Nasıl Çalışıyoruz
            <span className="h-px w-10 bg-gradient-to-l from-transparent to-white/30" />
          </p>
          <h2 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
            Fikirden yayına, dört adımda.
          </h2>
          <p className="mt-4 text-white/60">
            Süreç boyunca tek muhatabınız biziz. Siz onaylarsınız, biz uygularız.
          </p>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, i) => (
            <div
              key={step.no}
              className={cn(
                "relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-md",
                "transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]",
                revealed ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
              )}
              style={{ transitionDelay: revealed ? `${i * 140}ms` : "0ms" }}
            >
              {/* Süreci anlatan ilerleme çizgisi: adımlar sırayla dolar. */}
              <span
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-[3px] origin-left transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
                style={{
                  backgroundColor: step.accent,
                  transform: revealed ? "scaleX(1)" : "scaleX(0)",
                  transitionDelay: revealed ? `${300 + i * 220}ms` : "0ms",
                }}
              />
              <span
                className="inline-flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold text-white"
                style={{ backgroundColor: `${step.accent}33`, boxShadow: `inset 0 0 0 1px ${step.accent}66` }}
              >
                {i + 1}
              </span>
              <h3 className="mt-4 text-lg font-semibold text-white">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/60">{step.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
