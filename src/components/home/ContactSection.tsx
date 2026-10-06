import { Clock, Loader2, Mail, Phone, Send } from "lucide-react";
import { useState, type FormEvent } from "react";

import { COMPANY } from "@/lib/company";
import { sendContactMessage } from "@/lib/contact.functions";
import { SERVICES } from "@/lib/services";
import { useRevealOnce } from "@/hooks/useRevealOnce";
import { cn } from "@/lib/utils";
import { getAttribution } from "@/lib/attribution";
import { track } from "@/lib/track";
import { ConsentFields } from "@/components/ConsentFields";

type SendState = "idle" | "sending" | "sent" | "error";

/**
 * Ana sayfa iletişim formu. Açık zeminde cam kart; alanlar WCAG AA
 * kontrastını korur, geri bildirim satır içinde verilir.
 */
export function ContactSection() {
  const [state, setState] = useState<SendState>("idle");
  const { ref, revealed } = useRevealOnce<HTMLDivElement>(0.15);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    setState("sending");
    try {
      const result = await sendContactMessage({
        data: {
          name: String(fd.get("name") ?? ""),
          email: String(fd.get("email") ?? ""),
          phone: String(fd.get("phone") ?? ""),
          subject: String(fd.get("subject") ?? "Genel Bilgi"),
          message: String(fd.get("message") ?? ""),
          consentKvkk: fd.get("consentKvkk") === "on",
          consentMarketing: fd.get("consentMarketing") === "on",
          attribution: getAttribution(),
        },
      });
      track(result.ok ? "generate_lead" : "form_error", {
        lead_source: "contact",
        form_location: "home_form",
      });
      if (result.ok) {
        setState("sent");
        form.reset();
      } else {
        setState("error");
      }
    } catch (err) {
      console.error(err);
      track("form_error", { lead_source: "contact", form_location: "home_form" });
      setState("error");
    }
  };

  return (
    <section data-track-location="home_contact" className="relative overflow-hidden bg-background py-20 md:py-28">
      {/* Camın üstünde duracağı zemin */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[65%]"
        style={{
          background:
            "radial-gradient(110% 65% at 50% 0%, color-mix(in oklch, var(--color-accent) 10%, transparent) 0%, transparent 72%)",
        }}
      />

      <div ref={ref} className="container relative mx-auto px-4">
        <div className="grid items-start gap-10 lg:grid-cols-12 lg:gap-14">
          {/* Sol: davet + doğrudan kanallar */}
          <div className="lg:col-span-5">
            <h2
              className="font-bold text-foreground"
              style={{
                fontSize: "clamp(1.8rem, 3.6vw, 2.7rem)",
                lineHeight: 1.06,
                letterSpacing: "-0.032em",
              }}
            >
              Projenizi birlikte konuşalım.
            </h2>
            <p className="mt-5 max-w-md leading-relaxed text-muted-foreground">
              İhtiyacınızı anlatın, size en uygun çözümü ve fiyatı birlikte belirleyelim. Aynı gün
              dönüş yapmaya çalışıyoruz.
            </p>

            <div className="mt-8 space-y-3">
              <DirectRow icon={Phone} label={COMPANY.phoneMobile} href={`tel:${COMPANY.phoneMobile.replace(/\s/g, "")}`} />
              <DirectRow icon={Mail} label={COMPANY.email} href={`mailto:${COMPANY.email}`} />
              <DirectRow icon={Clock} label={COMPANY.workingHours} />
            </div>
          </div>

          {/* Sağ: cam form kartı */}
          <div className="lg:col-span-7">
            <div
              className={cn(
                "relative overflow-hidden rounded-3xl p-6 md:p-9",
                "bg-white/75 backdrop-blur-xl ring-1 ring-black/[0.055]",
                "shadow-[0_1px_2px_rgba(16,12,20,.04),0_20px_50px_-24px_rgba(16,12,20,.16)]",
                "transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]",
                revealed ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
              )}
            >
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent"
              />
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -right-20 -top-20 h-52 w-52 rounded-full opacity-70 blur-3xl"
                style={{ background: "color-mix(in oklch, var(--color-accent) 20%, transparent)" }}
              />

              <form onSubmit={onSubmit} className="relative space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Adınız Soyadınız" name="name" required placeholder="Adınız" />
                  <Field
                    label="E-posta"
                    name="email"
                    type="email"
                    required
                    placeholder="ornek@firma.com"
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Telefon" name="phone" placeholder="05xx xxx xx xx" />
                  <div>
                    <label htmlFor="hs-subject" className="mb-1.5 block text-sm font-medium text-foreground">
                      Konu
                    </label>
                    <select
                      id="hs-subject"
                      name="subject"
                      defaultValue="Genel Bilgi"
                      className="h-[46px] w-full rounded-xl border border-black/10 bg-white px-4 text-sm text-foreground outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-accent/25"
                    >
                      <option>Genel Bilgi</option>
                      {SERVICES.map((s) => (
                        <option key={s.slug}>{s.title}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label htmlFor="hs-message" className="mb-1.5 block text-sm font-medium text-foreground">
                    Mesajınız
                  </label>
                  <textarea
                    id="hs-message"
                    name="message"
                    required
                    minLength={10}
                    rows={4}
                    placeholder="Projenizi kısaca anlatın..."
                    className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/70 outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-accent/25"
                  />
                </div>

                <div className="pt-1">
                  <ConsentFields />
                </div>

                <div className="flex flex-wrap items-center gap-4 pt-1">
                  <button
                    type="submit"
                    disabled={state === "sending"}
                    className={cn(
                      "inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3.5 text-sm font-semibold text-white",
                      "shadow-lg transition-transform duration-200 hover:scale-[1.03] active:scale-[0.98]",
                      state === "sending" && "opacity-70",
                    )}
                  >
                    {state === "sending" ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                    {state === "sending" ? "Gönderiliyor..." : "Mesajı Gönder"}
                  </button>

                  {state === "sent" && (
                    <p className="text-sm font-medium text-emerald-700">
                      Mesajınız ulaştı. En kısa sürede dönüş yapacağız.
                    </p>
                  )}
                  {state === "error" && (
                    <p className="text-sm font-medium text-red-700">
                      Şu an gönderilemedi. Bizi arayabilirsiniz:{" "}
                      <a className="underline" href={`tel:${COMPANY.phoneMobile.replace(/\s/g, "")}`}>
                        {COMPANY.phoneMobile}
                      </a>
                    </p>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function DirectRow({
  icon: Icon,
  label,
  href,
}: {
  icon: typeof Phone;
  label: string;
  href?: string;
}) {
  const inner = (
    <>
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/[0.08] text-accent ring-1 ring-accent/15">
        <Icon className="h-4.5 w-4.5" strokeWidth={1.75} />
      </span>
      <span className="text-sm font-medium text-foreground">{label}</span>
    </>
  );
  const base =
    "flex items-center gap-3 rounded-2xl bg-white/60 px-4 py-3 ring-1 ring-black/[0.05] backdrop-blur-sm";
  return href ? (
    <a href={href} className={cn(base, "transition-colors hover:bg-white")}>
      {inner}
    </a>
  ) : (
    <div className={base}>{inner}</div>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  const id = `hs-${name}`;
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-foreground">
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="h-[46px] w-full rounded-xl border border-black/10 bg-white px-4 text-sm text-foreground placeholder:text-muted-foreground/70 outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-accent/25"
      />
    </div>
  );
}
