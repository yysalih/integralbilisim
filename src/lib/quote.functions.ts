import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const quoteSchema = z.object({
  name: z.string().min(2, "Adınızı yazın").max(120),
  company: z.string().max(160).optional().or(z.literal("")),
  email: z.string().email("Geçerli bir e-posta girin"),
  phone: z.string().max(30).optional().or(z.literal("")),
  services: z.array(z.string()).min(1, "En az bir hizmet seçin"),
  /** İnsan tarafından okunabilir kapsam özeti; sihirbaz üretir. */
  summary: z.array(z.string()).max(60),
  urgency: z.string().max(40),
  budget: z.string().max(40),
  leadScore: z.number().int().min(0).max(100),
  estimateMin: z.number().nonnegative(),
  estimateMax: z.number().nonnegative(),
  /** Fiyat aralığı kullanıcıya gösterildi mi (PRICING_APPROVED durumu). */
  priceShown: z.boolean(),
  consentKvkk: z.boolean().refine((v) => v === true, { message: "KVKK onayı gerekli" }),
  consentMarketing: z.boolean().default(false),
  /** Bot tuzağı: gerçek kullanıcı bu alanı doldurmaz. */
  website: z.string().max(200).optional().or(z.literal("")),
});

export type QuoteInput = z.infer<typeof quoteSchema>;

/**
 * Teklif sihirbazı → satış ekibine e-posta (SMTP).
 * Lead skoru konu satırına yazılır ki öncelik sırası gelen kutusunda görünsün.
 */
export const sendQuoteRequest = createServerFn({ method: "POST" })
  .validator((data: QuoteInput) => quoteSchema.parse(data))
  .handler(async ({ data }) => {
    // Honeypot doluysa sessizce başarılı dön; bot geri bildirim almasın.
    if (data.website) return { ok: true as const };

    const { saveLead } = await import("@/lib/leads.server");
    await saveLead({
      source: "quote_wizard",
      email: data.email,
      name: data.name,
      phone: data.phone,
      company: data.company,
      leadScore: data.leadScore,
      payload: {
        services: data.services,
        summary: data.summary,
        urgency: data.urgency,
        budget: data.budget,
        estimateMin: data.estimateMin,
        estimateMax: data.estimateMax,
        priceShown: data.priceShown,
      },
      consentKvkk: data.consentKvkk,
      consentMarketing: data.consentMarketing,
    });

    const priority = data.leadScore >= 70 ? "ÖNCELİKLİ" : data.leadScore < 40 ? "düşük" : "normal";
    const money = (n: number) => `₺${n.toLocaleString("tr-TR")}`;

    const { sendMail } = await import("@/lib/mailer.server");
    return sendMail({
      subject: `[Teklif Sihirbazı · ${priority} · ${data.leadScore}/100] ${data.name}${
        data.company ? ` — ${data.company}` : ""
      }`,
      replyTo: data.email,
      text: [
        `Lead skoru: ${data.leadScore}/100 (${priority})`,
        "",
        "— İLETİŞİM —",
        `Ad Soyad: ${data.name}`,
        data.company ? `Firma: ${data.company}` : null,
        `E-posta: ${data.email}`,
        data.phone ? `Telefon: ${data.phone}` : null,
        "",
        "— TALEP —",
        `Hizmetler: ${data.services.join(", ")}`,
        `Aciliyet: ${data.urgency}`,
        `Bütçe beyanı: ${data.budget}`,
        "",
        "— KAPSAM —",
        ...data.summary.map((line) => `• ${line}`),
        "",
        "— TAHMİN —",
        data.priceShown
          ? `Kullanıcıya gösterilen aralık: ${money(data.estimateMin)} – ${money(data.estimateMax)} + KDV`
          : "Fiyat aralığı kullanıcıya GÖSTERİLMEDİ (fiyat listesi henüz onaylanmadı). Dahili tahmin: " +
            `${money(data.estimateMin)} – ${money(data.estimateMax)}`,
        "",
        `KVKK onayı: evet · Ticari ileti izni: ${data.consentMarketing ? "evet" : "hayır"}`,
        `Gönderim: ${new Date().toISOString()}`,
      ]
        .filter((line) => line !== null)
        .join("\n"),
    });
  });
