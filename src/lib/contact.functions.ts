import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

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
});

export type ContactInput = z.infer<typeof contactSchema>;

/**
 * İletişim formu → e-posta (Resend). RESEND_API_KEY tanımlı değilse
 * form gönderilemez; arayüz kullanıcıya WhatsApp/telefon alternatifini gösterir.
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
      payload: { subject: data.subject, message: data.message },
      consentKvkk: data.consentKvkk,
      consentMarketing: data.consentMarketing,
    });

    const apiKey = process.env.RESEND_API_KEY;
    const to = process.env.CONTACT_TO_EMAIL ?? "info@integralbilisim.com";
    const from = process.env.CONTACT_FROM_EMAIL ?? "onboarding@resend.dev";

    if (!apiKey) {
      console.error("[iletisim] RESEND_API_KEY tanımlı değil; form gönderilemedi.");
      return { ok: false as const };
    }

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: `İntegral Bilişim Web <${from}>`,
        to: [to],
        reply_to: data.email,
        subject: `[Web Sitesi İletişim Formu] ${data.subject}`,
        text: [
          `Ad Soyad: ${data.name}`,
          `E-posta: ${data.email}`,
          data.phone ? `Telefon: ${data.phone}` : null,
          `KVKK onayı: evet · Ticari ileti izni: ${data.consentMarketing ? "evet" : "hayır"}`,
          `Gönderim: ${new Date().toISOString()}`,
          "",
          data.message,
        ]
          .filter(Boolean)
          .join("\n"),
      }),
    });

    if (!res.ok) {
      console.error("[iletisim] Resend hatası:", res.status, await res.text());
      return { ok: false as const };
    }
    return { ok: true as const };
  });
