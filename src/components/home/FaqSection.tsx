import { Plus } from "lucide-react";
import { useState } from "react";

import { FAQ_ITEMS } from "@/lib/faq";
import { COMPANY, whatsappLink } from "@/lib/company";
import { useRevealOnce } from "@/hooks/useRevealOnce";
import { cn } from "@/lib/utils";

/**
 * SSS akordeonu. Yükseklik animasyonu grid-template-rows ile yapılır
 * (JS ölçümü yok); "hareketi azalt" tercihinde geçiş süresi sıfırlanır.
 */
export function FaqSection() {
  const [open, setOpen] = useState<number | null>(0);
  const { ref, revealed } = useRevealOnce<HTMLDivElement>(0.12);

  return (
    <section className="relative overflow-hidden bg-background py-20 md:py-28">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[60%]"
        style={{
          background:
            "radial-gradient(100% 60% at 50% 0%, color-mix(in oklch, var(--color-accent) 8%, transparent) 0%, transparent 72%)",
        }}
      />

      <div ref={ref} className="container relative mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center">
          <h2
            className="font-bold text-foreground"
            style={{
              fontSize: "clamp(1.8rem, 3.6vw, 2.7rem)",
              lineHeight: 1.06,
              letterSpacing: "-0.032em",
            }}
          >
            Merak ettikleriniz.
          </h2>
          <p className="mt-4 text-muted-foreground">
            Aradığınızı bulamazsanız bir telefon kadar uzağız.
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-3xl space-y-3">
          {FAQ_ITEMS.map((item, i) => {
            const isOpen = open === i;
            return (
              <div
                key={item.question}
                className={cn(
                  "overflow-hidden rounded-2xl bg-white/70 backdrop-blur-xl ring-1 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
                  isOpen
                    ? "ring-accent/25 shadow-[0_2px_4px_rgba(16,12,20,.04),0_18px_44px_-20px_rgba(201,67,110,.30)]"
                    : "ring-black/[0.055] shadow-[0_1px_2px_rgba(16,12,20,.04)]",
                  revealed ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0",
                )}
                style={{ transitionDelay: revealed ? `${i * 55}ms` : "0ms" }}
              >
                <h3>
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-panel-${i}`}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-transform duration-100 active:scale-[0.995] md:px-6 md:py-5"
                  >
                    <span
                      className="text-base font-semibold text-foreground md:text-lg"
                      style={{ letterSpacing: "-0.012em" }}
                    >
                      {item.question}
                    </span>
                    <span
                      className={cn(
                        "flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
                        isOpen
                          ? "rotate-45 bg-accent text-white"
                          : "bg-accent/[0.08] text-accent ring-1 ring-accent/15",
                      )}
                    >
                      <Plus className="h-4 w-4" strokeWidth={2} />
                    </span>
                  </button>
                </h3>

                {/* 0fr -> 1fr: yükseklik ölçmeden yumuşak açılma */}
                <div
                  id={`faq-panel-${i}`}
                  role="region"
                  className="grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
                  style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                >
                  <div className="overflow-hidden">
                    <p className="px-5 pb-5 text-sm leading-relaxed text-muted-foreground md:px-6 md:pb-6 md:text-base">
                      {item.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mx-auto mt-10 flex max-w-3xl flex-wrap items-center justify-center gap-4">
          <a
            href={`tel:${COMPANY.phoneMobile.replace(/\s/g, "")}`}
            className="rounded-full bg-accent px-7 py-3.5 text-sm font-semibold text-white shadow-lg transition-transform hover:scale-105 active:scale-[0.98]"
          >
            {COMPANY.phoneMobile}
          </a>
          <a
            href={whatsappLink("Merhaba, bir sorum var.")}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-white/70 px-7 py-3.5 text-sm font-semibold text-foreground ring-1 ring-black/[0.07] backdrop-blur-sm transition-colors hover:bg-white"
          >
            WhatsApp'tan sorun
          </a>
        </div>
      </div>
    </section>
  );
}
