import { createFileRoute } from "@tanstack/react-router";
import { mediaUrl } from "@/lib/media";
import { Clock, Loader2, Mail, MapPin, Phone, Send } from "lucide-react";
import { useState, type FormEvent } from "react";

import { COMPANY, whatsappLink } from "@/lib/company";
import { sendContactMessage } from "@/lib/contact.functions";
import { SERVICES } from "@/lib/services";
import { cn } from "@/lib/utils";
import { breadcrumbSchema, jsonLd, pageHead } from "@/lib/seo";
import { ConsentFields } from "@/components/ConsentFields";
import { getAttribution } from "@/lib/attribution";
import { track } from "@/lib/track";

export const Route = createFileRoute("/iletisim")({
  head: () => {
    const base = pageHead({
      title: "İletişim | İntegral Bilişim",
      description:
        "Teklif almak veya sorularınız için bize ulaşın. Telefon, WhatsApp, e-posta. Kadıköy / İstanbul.",
      path: "/iletisim",
      image: "/og/iletisim.png",
    });
    return {
      ...base,
      scripts: [
        jsonLd(
          breadcrumbSchema([
            { name: "Ana Sayfa", path: "/" },
            { name: "İletişim", path: "/iletisim" },
          ]),
        ),
      ],
    };
  },
  component: ContactPage,
});

type SendState = "idle" | "sending" | "sent" | "error";

function ContactPage() {
  const [state, setState] = useState<SendState>("idle");

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
        form_location: "contact_page_form",
      });
      if (result.ok) {
        setState("sent");
        form.reset();
      } else {
        setState("error");
      }
    } catch (err) {
      console.error(err);
      track("form_error", { lead_source: "contact", form_location: "contact_page_form" });
      setState("error");
    }
  };

  return (
    <>
      {/* Koyu hero */}
      <section data-track-location="contact_page" className="relative overflow-hidden bg-[#0a0a12] py-24 md:py-28">
      {/* Arka plan görseli + koyu gradyan sandviçi (şablon 5.5) */}
      <img
        src={mediaUrl("/covers/5.jpeg")}
        alt=""
        aria-hidden="true"
        loading="lazy"
        className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-80"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#0a0a12]/90 via-[#0a0a12]/55 to-[#0a0a12]/92" />
        <div
          className="absolute -right-[15%] -top-[35%] h-[75%] w-[50%] rounded-full bg-[#C9436E]/20 blur-[120px]"
          style={{ animation: "orb-drift-a 15s ease-in-out infinite" }}
        />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(60% 85% at 50% 45%, rgba(10,10,18,.82) 0%, rgba(10,10,18,.35) 60%, transparent 100%)",
          }}
        />
        <div className="container relative mx-auto px-4 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/50">İletişim</p>
          <h1 className="mx-auto mt-5 max-w-3xl text-4xl font-bold leading-[1.05] tracking-tight text-white sm:text-5xl md:text-6xl">
            Projenizi konuşalım.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-white/60">
            Teklif almak, fiyat sormak veya aklınızdakini anlatmak için bize yazın; aynı gün dönüş
            yapmaya çalışıyoruz.
          </p>
        </div>
      </section>

      {/* Açık zemin: form + bilgiler */}
      <section data-track-location="contact_page" className="bg-background py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid gap-12 lg:grid-cols-5">
            {/* Form */}
            <div className="lg:col-span-3">
              <h2 className="text-2xl font-bold tracking-tight text-foreground">Bize yazın</h2>
              <form onSubmit={onSubmit} className="mt-6 space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Adınız Soyadınız" name="name" required placeholder="Adınız" />
                  <Field
                    label="E-posta"
                    name="email"
                    type="email"
                    required
                    placeholder="ornek@firma.com"
                  />
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Telefon (isteğe bağlı)" name="phone" placeholder="05xx xxx xx xx" />
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-foreground">
                      Konu
                    </label>
                    <select
                      name="subject"
                      className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-accent"
                      defaultValue="Genel Bilgi"
                    >
                      <option>Genel Bilgi</option>
                      {SERVICES.map((s) => (
                        <option key={s.slug}>{s.title}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-foreground">
                    Mesajınız
                  </label>
                  <textarea
                    name="message"
                    required
                    minLength={10}
                    rows={5}
                    placeholder="Projenizi kısaca anlatın..."
                    className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-accent"
                  />
                </div>
                <ConsentFields />
                <div className="flex flex-wrap items-center gap-4">
                  <button
                    type="submit"
                    disabled={state === "sending"}
                    className={cn(
                      "inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3.5 text-sm font-semibold text-white shadow-lg transition-transform hover:scale-105",
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
                    <p className="text-sm font-medium text-emerald-600">
                      Mesajınız ulaştı. En kısa sürede dönüş yapacağız.
                    </p>
                  )}
                  {state === "error" && (
                    <p className="text-sm font-medium text-red-600">
                      Mesaj şu an gönderilemedi. Lütfen WhatsApp'tan yazın veya bizi arayın:{" "}
                      <a
                        className="underline"
                        href={`tel:${COMPANY.phoneMobile.replace(/\s/g, "")}`}
                      >
                        {COMPANY.phoneMobile}
                      </a>
                    </p>
                  )}
                </div>
              </form>
            </div>

            {/* Bilgi kartları */}
            <div className="space-y-4 lg:col-span-2">
              <InfoCard icon={Phone} title="Telefon">
                <a
                  href={`tel:${COMPANY.phoneMobile.replace(/\s/g, "")}`}
                  className="block hover:text-accent"
                >
                  {COMPANY.phoneMobile}
                </a>
                <a
                  href={`tel:${COMPANY.phoneOffice.replace(/\s/g, "")}`}
                  className="block hover:text-accent"
                >
                  {COMPANY.phoneOffice}
                </a>
                <a
                  href={`tel:${COMPANY.phoneMobile2.replace(/\s/g, "")}`}
                  className="block hover:text-accent"
                >
                  {COMPANY.phoneMobile2}
                </a>
              </InfoCard>
              <InfoCard icon={Mail} title="E-posta">
                <a href={`mailto:${COMPANY.email}`} className="hover:text-accent">
                  {COMPANY.email}
                </a>
              </InfoCard>
              <InfoCard icon={MapPin} title="Adres">
                {COMPANY.address}
              </InfoCard>
              <InfoCard icon={Clock} title="Çalışma Saatleri">
                {COMPANY.workingHours}
              </InfoCard>
              <a
                href={whatsappLink("Merhaba, bilgi almak istiyorum.")}
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-2xl bg-[#25D366] p-5 text-center text-sm font-semibold text-white shadow-lg transition-transform hover:scale-[1.02]"
              >
                WhatsApp'tan hemen yazın →
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
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
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-foreground">{label}</label>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-accent"
      />
    </div>
  );
}

function InfoCard({
  icon: Icon,
  title,
  children,
}: {
  icon: typeof Phone;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-4 rounded-2xl border border-border bg-card p-5">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="font-semibold text-foreground">{title}</p>
        <div className="mt-1 text-sm leading-relaxed text-muted-foreground">{children}</div>
      </div>
    </div>
  );
}
