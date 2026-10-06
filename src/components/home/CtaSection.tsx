import { Link } from "@tanstack/react-router";
import { mediaUrl } from "@/lib/media";
import { ArrowRight, Phone } from "lucide-react";

import { COMPANY, whatsappLink } from "@/lib/company";

/** Dönüşüm bölümü — gradient kenarlıklı glow kart, koyu zemin. */
export function CtaSection() {
  return (
    <section data-track-location="home_cta" className="relative overflow-hidden bg-[#0a0a12] py-20 md:py-28">
      {/* Arka plan görseli + koyu gradyan sandviçi (şablon 5.5) */}
      <img
        src={mediaUrl("/covers/2.jpeg")}
        alt=""
        aria-hidden="true"
        loading="lazy"
        className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-85"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#0a0a12]/88 via-[#0a0a12]/52 to-[#0a0a12]/90" />
      <div
        className="absolute -left-[10%] bottom-[0%] h-[55%] w-[45%] rounded-full bg-[#C9436E]/20 blur-[120px]"
        style={{ animation: "orb-drift-a 15s ease-in-out infinite" }}
      />
      <div className="container relative mx-auto px-4">
        <div
          className="mx-auto max-w-4xl rounded-3xl p-[1px] animate-[bundle-glow-pulse_5s_ease-in-out_infinite]"
          style={{
            background: "linear-gradient(135deg, #C9436E66, #8B5CF640, #3B82F640)",
          }}
        >
          <div className="rounded-3xl bg-[#101018] px-6 py-12 text-center md:px-16 md:py-16">
            <img
              src="/logo-white.png"
              alt="İntegral Bilişim"
              className="mx-auto mb-7 h-9 w-auto opacity-90 md:h-10"
            />
            <h2 className="text-3xl font-bold leading-tight tracking-tight text-white md:text-5xl">
              Markanızı bugün internete taşıyalım.
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-white/60">
              İhtiyacınızı anlatın, size en uygun çözümü ve fiyatı birlikte belirleyelim.
              Hazır web sitesi çözümlerinde siteniz 5 gün içinde yayında.
            </p>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/teklif"
                className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-black shadow-lg transition-transform hover:scale-105"
              >
                Teklif Alın
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href={whatsappLink("Merhaba, web sitesi yaptırmak istiyorum.")}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-white/15 px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
              >
                WhatsApp'tan Yazın
              </a>
              <a
                href={`tel:${COMPANY.phoneMobile.replace(/\s/g, "")}`}
                className="inline-flex items-center gap-2 text-sm font-medium text-white/70 hover:text-white"
              >
                <Phone className="h-4 w-4" />
                {COMPANY.phoneMobile}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
