import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight, Plus } from "lucide-react";

import { useRevealOnce } from "@/hooks/useRevealOnce";
import { mediaUrl } from "@/lib/media";
import { formatTry, startingEstimate } from "@/lib/quote";
import { FEATURED_WORK } from "@/lib/references";
import type { ServiceContent, ServiceStep } from "@/lib/service-content";
import { cn } from "@/lib/utils";

/** Hizmet sayfasının derin içeriği: bölümler, temalar, süreç, işler, fiyat, SSS. */
export function ServiceBody({
  slug,
  title,
  accent,
  content,
  process,
}: {
  slug: string;
  title: string;
  accent: string;
  content: ServiceContent;
  process: ServiceStep[] | null;
}) {
  const works = (content.works ?? [])
    .map((name) => FEATURED_WORK.find((w) => w.name === name))
    .filter((w): w is (typeof FEATURED_WORK)[number] => Boolean(w));

  return (
    <>
      <section className="bg-background pb-16 md:pb-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl space-y-16">
            {content.sections.map((section) => (
              <Section key={section.heading} section={section} accent={accent} />
            ))}

            {content.chips && (
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                  {content.chips.heading}
                </h2>
                <p className="mt-4 leading-relaxed text-muted-foreground">{content.chips.intro}</p>
                <ul className="mt-6 flex flex-wrap gap-2">
                  {content.chips.items.map((item) => (
                    <li
                      key={item}
                      className="rounded-full border px-3.5 py-1.5 text-sm text-foreground/80"
                      style={{ borderColor: `${accent}33`, backgroundColor: `${accent}0a` }}
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </section>

      {process && <Process steps={process} accent={accent} />}

      {works.length > 0 && (
        <section className="bg-background py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-5xl">
              <h2 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                Bu alanda yaptığımız işler
              </h2>
              <div
                className={cn(
                  "mt-8 grid gap-5",
                  works.length === 1 ? "sm:grid-cols-1 sm:max-w-md" : "sm:grid-cols-2 lg:grid-cols-3",
                )}
              >
                {works.map((w) => (
                  <WorkCard key={w.name} work={w} />
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="bg-background pb-20 md:pb-28">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl">
            <Pricing slug={slug} title={title} accent={accent} />
            <Faq faqs={content.faqs} title={title} accent={accent} />
          </div>
        </div>
      </section>
    </>
  );
}

function Section({
  section,
  accent,
}: {
  section: ServiceContent["sections"][number];
  accent: string;
}) {
  return (
    <div>
      <h2 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">{section.heading}</h2>
      {section.body.length > 0 && (
        <div className="mt-5 space-y-4 leading-[1.75] text-muted-foreground">
          {section.body.map((p) => (
            <p key={p.slice(0, 40)}>{p}</p>
          ))}
        </div>
      )}
      {section.list && (
        <dl className="mt-6 grid gap-x-8 gap-y-5 sm:grid-cols-2">
          {section.list.map((item) => (
            <div key={item.label} className="flex gap-3">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: accent }} />
              <div>
                <dt className="font-semibold text-foreground">{item.label}</dt>
                <dd className="mt-1 text-sm leading-relaxed text-muted-foreground">{item.detail}</dd>
              </div>
            </div>
          ))}
        </dl>
      )}
    </div>
  );
}

function Process({ steps, accent }: { steps: ServiceStep[]; accent: string }) {
  const { ref, revealed } = useRevealOnce<HTMLDivElement>(0.2);
  return (
    <section className="bg-[#0a0a12] py-16 md:py-24">
      <div ref={ref} className="container mx-auto px-4">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-2xl font-bold tracking-tight text-white md:text-3xl">Nasıl ilerliyoruz?</h2>
          <ol
            className={cn(
              "mt-10 grid gap-5",
              steps.length === 3 ? "md:grid-cols-3" : "sm:grid-cols-2 lg:grid-cols-4",
            )}
          >
            {steps.map((step, i) => (
              <li
                key={step.title}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition-all duration-700"
                style={{
                  opacity: revealed ? 1 : 0,
                  transform: revealed ? "none" : "translateY(16px)",
                  transitionDelay: `${i * 90}ms`,
                }}
              >
                <span
                  className="flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold text-white"
                  style={{ backgroundColor: accent }}
                >
                  {i + 1}
                </span>
                <h3 className="mt-4 font-semibold text-white">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/60">{step.detail}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

function WorkCard({ work }: { work: (typeof FEATURED_WORK)[number] }) {
  const inner = (
    <>
      <div className="aspect-[16/10] overflow-hidden rounded-2xl ring-1 ring-black/[0.06]">
        <img
          src={mediaUrl(work.poster)}
          alt={`${work.name} için yaptığımız çalışma`}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
        />
      </div>
      <div className="mt-3 flex items-start justify-between gap-3">
        <div>
          <p className="font-semibold text-foreground">{work.name}</p>
          <p className="text-sm text-muted-foreground">{work.sector}</p>
        </div>
        {work.url && (
          <ArrowUpRight className="mt-1 h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        )}
      </div>
    </>
  );
  return work.url ? (
    <a href={work.url} target="_blank" rel="noopener noreferrer" className="group block">
      {inner}
    </a>
  ) : (
    <div className="group">{inner}</div>
  );
}

function Pricing({ slug, title, accent }: { slug: string; title: string; accent: string }) {
  const { min } = startingEstimate(slug);
  return (
    <div
      data-track-location="service_pricing"
      className="flex flex-col gap-6 rounded-3xl border p-7 md:flex-row md:items-center md:justify-between md:p-8"
      style={{ borderColor: `${accent}33`, backgroundColor: `${accent}0b` }}
    >
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          Tahmini başlangıç
        </p>
        <p className="mt-2 text-3xl font-bold tracking-tight text-foreground">
          {formatTry(min)}
          <span className="ml-1.5 text-base font-medium text-muted-foreground">+ KDV</span>
        </p>
        <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
          En dar kapsam için hesaplanmıştır. {title} için kendi ihtiyacınıza göre aralığı
          birkaç soruda görebilirsiniz; bağlayıcı teklif değildir.
        </p>
      </div>
      <Link
        to="/teklif"
        search={{ services: slug }}
        className="inline-flex shrink-0 items-center gap-2 self-start rounded-full px-6 py-3.5 text-sm font-semibold text-white shadow-lg transition-transform hover:scale-[1.03] md:self-center"
        style={{ backgroundColor: accent }}
      >
        Fiyatımı hesapla
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}

function Faq({
  faqs,
  title,
  accent,
}: {
  faqs: ServiceContent["faqs"];
  title: string;
  accent: string;
}) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="mt-16">
      <h2 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
        {title} hakkında sık sorulanlar
      </h2>
      <div className="mt-8 space-y-3">
        {faqs.map((f, i) => {
          const isOpen = open === i;
          return (
            <div
              key={f.q}
              className="overflow-hidden rounded-2xl border border-border bg-card transition-colors"
              style={isOpen ? { borderColor: `${accent}55` } : undefined}
            >
              <button
                type="button"
                aria-expanded={isOpen}
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left md:px-6"
              >
                <h3 className="text-base font-semibold text-foreground">{f.q}</h3>
                <span
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-transform duration-300"
                  style={{
                    backgroundColor: `${accent}18`,
                    color: accent,
                    transform: isOpen ? "rotate(45deg)" : "none",
                  }}
                >
                  <Plus className="h-4 w-4" />
                </span>
              </button>
              {/* Kapalıyken de DOM'da: arama motorları cevabı okuyabilsin. */}
              <div
                className="grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
                style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
              >
                <div className="overflow-hidden">
                  <p className="px-5 pb-5 text-sm leading-relaxed text-muted-foreground md:px-6 md:text-base">
                    {f.a}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
