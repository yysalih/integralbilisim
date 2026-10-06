import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { attributionLines, attributionSchema } from "@/lib/attribution";

const contactSchema = z.object({
  name: z.string().min(2, "Adınızı yazın").max(120),
  email: z.string().email("Geçerli bir e-posta girin"),
  phone: z.string().max(30).optional().or(z.literal("")),
  subject: z.string().min(1).max(160),
  message: z.string().min(10, "Mesajınızı biraz açar mısınız?").max(4000),
  /** KVKK aydınlatma metnine açık rıza — form bu onay olmadan gönderilemez. */
  consentKvkk: z.boolean().refine((v) => v === true, { message: "KVKK onayı gerekli" }),
  /** Ticari elektronik ileti izni — ayrı ve isteğe bağlı. */
  consentMarketing: z.boolean().default(false),
  attribution: attributionSchema,
});

export type ContactInput = z.infer<typeof contactSchema>;

/**
 * İletişim formu → e-posta (SMTP). SMTP tanımlı değilse e-posta gitmez ama
 * talep leads tablosuna kaydedilir; arayüz WhatsApp/telefon alternatifini gösterir.
 */
export const sendContactMessage = createServerFn({ method: "POST" })
  .validator((data: ContactInput) => contactSchema.parse(data))
  .handler(async ({ data }) => {
    // Kayıt önce: e-posta gönderilemese bile talep veritabanında durur.
    const { saveLead } = await import("@/lib/leads.server");
    await saveLead({
      source: "contact",
      email: data.email,
      name: data.name,
      phone: data.phone,
      payload: { subject: data.subject, message: data.message, attribution: data.attribution },
      consentKvkk: data.consentKvkk,
      consentMarketing: data.consentMarketing,
    });

    const { sendMail } = await import("@/lib/mailer.server");
    return sendMail({
      subject: `[Web Sitesi İletişim Formu] ${data.subject}`,
      replyTo: data.email,
      text: [
        `Ad Soyad: ${data.name}`,
        `E-posta: ${data.email}`,
        data.phone ? `Telefon: ${data.phone}` : null,
        `KVKK onayı: evet · Ticari ileti izni: ${data.consentMarketing ? "evet" : "hayır"}`,
        `Gönderim: ${new Date().toISOString()}`,
        ...attributionLines(data.attribution),
        "",
        data.message,
      ]
        .filter((line) => line !== null)
        .join("\n"),
    });
  });
