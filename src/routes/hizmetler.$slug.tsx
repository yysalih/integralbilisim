import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { mediaUrl } from "@/lib/media";
import { ArrowRight, Check } from "lucide-react";

import { CtaSection } from "@/components/home/CtaSection";
import { whatsappLink } from "@/lib/company";
import { CATEGORY_LABELS, SERVICES, getService } from "@/lib/services";
import { breadcrumbSchema, faqSchema, jsonLd, pageHead, serviceSchema } from "@/lib/seo";
import { SERVICE_CONTENT, processFor } from "@/lib/service-content";
import { ServiceBody } from "@/components/service/ServiceBody";

export const Route = createFileRoute("/hizmetler/$slug")({
  loader: ({ params }) => {
    const service = getService(params.slug);
    if (!service) throw notFound();
    return { service };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {};
    const { service } = loaderData;
    const content = SERVICE_CONTENT[service.slug];
    return {
      ...pageHead({
        title: `${service.title} | İntegral Bilişim`,
        description: service.short,
        path: `/hizmetler/${service.slug}`,
        image: `/og/hizmet-${service.slug}.png`,
      }),
      scripts: [
        jsonLd(serviceSchema(service)),
        jsonLd(
          breadcrumbSchema([
            { name: "Ana Sayfa", path: "/" },
            { name: "Hizmetler", path: "/hizmetler" },
            { name: service.title, path: `/hizmetler/${service.slug}` },
          ]),
        ),
        ...(content
          ? [jsonLd(faqSchema(content.faqs.map((f) => ({ question: f.q, answer: f.a }))))]
          : []),
      ],
    };
  },
  component: ServiceDetailPage,
});

function ServiceDetailPage() {
  const { service } = Route.useLoaderData();
  const accent = service.accent;
  const content = SERVICE_CONTENT[service.slug];
  // Derin içerik varsa giriş oradan gelir; yoksa kısa açıklamaya düşülür.
  const introParagraphs = content?.intro ?? service.long;
  const others = SERVICES.filter((s) => s.slug !== service.slug).slice(0, 6);

  return (
    <>
      {/* Koyu hero */}
      <section data-track-location="service_page" className="relative overflow-hidden bg-[#0a0a12] py-24 md:py-32">
        <div
          className="absolute -left-[10%] -top-[25%] h-[65%] w-[50%] rounded-full blur-[120px]"
          style={{ backgroundColor: `${accent}33`, animation: "orb-drift-a 15s ease-in-out infinite" }}
        />
        {service.image && (
          <>
            <img
              src={mediaUrl(service.image)}
              alt=""
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-80"
            />
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(105deg,rgba(10,10,18,.95)_0%,rgba(10,10,18,.86)_38%,rgba(10,10,18,.5)_72%,rgba(10,10,18,.7)_100%)]" />
          </>
        )}
        <div
          className="absolute inset-0"
          style={{ background: `radial-gradient(circle at 85% 80%, ${accent}1a, transparent 50%)` }}
        />
        <div className="container relative mx-auto px-4">
          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-3">
              <span
                className="rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-white"
                style={{ backgroundColor: `${accent}33`, boxShadow: `inset 0 0 0 1px ${accent}66` }}
              >
                {service.tagline}
              </span>
              <span className="text-[11px] uppercase tracking-[0.25em] text-white/40">
                {CATEGORY_LABELS[service.category]}
              </span>
            </div>
            <h1 className="mt-6 text-4xl font-bold leading-[1.05] tracking-tight text-white sm:text-5xl md:text-6xl">
              {service.title}
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-white/65">{service.short}</p>
            <div className="mt-9 flex flex-wrap gap-4">
              <Link
                to="/iletisim"
                className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-black shadow-lg transition-transform hover:scale-105"
              >
                Teklif Alın
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href={whatsappLink(`Merhaba, ${service.title} hizmetiniz hakkında bilgi almak istiyorum.`)}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-white/15 px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
              >
                WhatsApp'tan Sorun
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Açık zemin: detay + pakete dahil */}
      <section data-track-location="service_page" className="bg-background py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid gap-12 lg:grid-cols-5">
            <div className="lg:col-span-3">
              <span
                className="rounded-full px-3 py-1 text-[11px] font-medium uppercase tracking-wider"
                style={{ backgroundColor: `${accent}1a`, color: accent }}
              >
                Hizmet Detayı
              </span>
              <h2 className="mt-5 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                Bu hizmette neyi, nasıl yapıyoruz?
              </h2>
              <div className="mt-6 space-y-5 leading-relaxed text-muted-foreground">
                {introParagraphs.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </div>

            <div className="lg:col-span-2">
              <div
                className="rounded-3xl border p-7"
                style={{ borderColor: `${accent}30`, backgroundColor: `${accent}0c` }}
              >
                <h3 className="text-lg font-semibold text-foreground">Pakete dahil olanlar</h3>
                <ul className="mt-5 space-y-4">
                  {service.includes.map((inc) => (
                    <li key={inc.label} className="flex gap-3">
                      <span
                        className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full"
                        style={{ backgroundColor: `${accent}25` }}
                      >
                        <Check className="h-3 w-3" style={{ color: accent }} />
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-foreground">{inc.label}</p>
                        <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                          {inc.detail}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {content && (
        <ServiceBody
          slug={service.slug}
          title={service.title}
          accent={accent}
          content={content}
          process={processFor(service.slug)}
        />
      )}

      {/* Diğer hizmetler */}
      <section data-track-location="service_page" className="bg-[#0a0a12] py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <h2 className="text-2xl font-bold tracking-tight text-white md:text-3xl">
              Diğer hizmetlerimiz
            </h2>
            <Link
              to="/hizmetler"
              className="rounded-full border border-white/15 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              Tümünü Gör
            </Link>
          </div>
          <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {others.map((s) => (
              <Link
                key={s.slug}
                to="/hizmetler/$slug"
                params={{ slug: s.slug }}
                className="group relative flex min-h-[260px] w-64 shrink-0 snap-start flex-col justify-end overflow-hidden rounded-3xl p-6 ring-1 ring-white/10 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1"
                style={{
                  background: `linear-gradient(155deg, ${s.accent}26 0%, #14141f 60%, #0d0d16 100%)`,
                }}
              >
                {s.image && (
                  <>
                    <img
                      src={mediaUrl(s.image)}
                      alt=""
                      aria-hidden="true"
                      loading="lazy"
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/70 to-black/20" />
                  </>
                )}
                <span
                  className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  style={{ boxShadow: `inset 0 0 0 1px ${s.accent}80, 0 20px 50px -22px ${s.accent}59` }}
                />
                <div className="relative">
                  <h3 className="text-lg font-bold text-white">{s.title}</h3>
                  <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-white/70 transition-colors group-hover:text-white">
                    İncele
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <CtaSection />
    </>
  );
}
