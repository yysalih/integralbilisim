import { createServerFn } from "@tanstack/react-start";

const GA4_PATTERN = /^G-[A-Z0-9]{6,}$/;

/**
 * Tarayıcıya inmesinde sakınca olmayan, çalışma anında okunan ayarlar.
 * VITE_ önekli değişkenler derleme sırasında koda gömülür; ölçüm kimliğini
 * sunucu panelinden değiştirebilmek için burada process.env'den okunur.
 */
export const getPublicConfig = createServerFn({ method: "GET" }).handler(async () => {
  const raw = (process.env.GA4_ID ?? process.env.VITE_GA4_ID ?? "").trim();
  return { ga4Id: GA4_PATTERN.test(raw) ? raw : null };
});
