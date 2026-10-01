import nodemailer, { type Transporter } from "nodemailer";

/**
 * Form bildirimleri — firmanın kendi SMTP sunucusu üzerinden (ör. DirectAdmin
 * e-posta hesabı). Yalnızca sunucuda kullanılır; şifre tarayıcıya hiç inmez.
 * Bu modül istemci paketine girmesin diye çağıranlar onu handler içinde
 * dinamik olarak yükler.
 *
 * Ortam değişkenleri:
 *   SMTP_HOST, SMTP_USER, SMTP_PASS  — zorunlu
 *   SMTP_PORT    — varsayılan 465
 *   SMTP_SECURE  — 465'te true (doğrudan TLS), 587'de false (STARTTLS)
 *   SMTP_FROM    — gönderen adres; varsayılan SMTP_USER
 *   SMTP_TLS_SERVERNAME — SMTP_HOST=localhost kullanılıyorsa sertifikanın
 *                  doğrulanacağı ad (ör. mail.integralbilisim.com). Sunucunun
 *                  güvenlik duvarı dış SMTP bağlantısını engellediğinde gerekir.
 *   CONTACT_TO_EMAIL — bildirimlerin gideceği adres
 */
const host = process.env.SMTP_HOST;
const user = process.env.SMTP_USER;
const pass = process.env.SMTP_PASS;
const port = Number(process.env.SMTP_PORT ?? 465);
const secure = (process.env.SMTP_SECURE ?? String(port === 465)) === "true";
const tlsServername = process.env.SMTP_TLS_SERVERNAME;

let transporter: Transporter | null = null;
const transport = () => {
  if (!host || !user || !pass) return null;
  transporter ??= nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
    // Sertifika doğrulaması hiçbir durumda kapatılmaz; yalnızca beklenen ad değişir.
    ...(tlsServername ? { tls: { servername: tlsServername } } : {}),
    // Form gönderen ziyaretçi dakikalarca beklemesin; varsayılan süreler çok uzun.
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 20_000,
  });
  return transporter;
};

export interface MailInput {
  subject: string;
  text: string;
  /** Yanıtla dendiğinde formu dolduran kişiye gitsin. */
  replyTo?: string;
}

export const sendMail = async (mail: MailInput) => {
  const t = transport();
  if (!t) {
    console.error("[mail] SMTP_HOST, SMTP_USER ve SMTP_PASS tanımlı değil; bildirim gönderilemedi.");
    return { ok: false as const };
  }
  try {
    await t.sendMail({
      from: { name: "İntegral Bilişim Web", address: process.env.SMTP_FROM ?? user! },
      to: process.env.CONTACT_TO_EMAIL ?? "info@integralbilisim.com",
      replyTo: mail.replyTo,
      subject: mail.subject,
      text: mail.text,
    });
    return { ok: true as const };
  } catch (err) {
    console.error("[mail] Gönderilemedi:", err instanceof Error ? err.message : err);
    return { ok: false as const };
  }
};
