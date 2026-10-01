import { supabaseWrite } from "@/lib/supabase.server";

export interface LeadInput {
  source: "quote_wizard" | "site_audit" | "contact";
  email: string;
  name?: string;
  phone?: string;
  company?: string;
  website?: string;
  /** Modüle özel veriler: sihirbaz cevapları, analiz skoru vb. */
  payload?: Record<string, unknown>;
  leadScore?: number;
  consentKvkk?: boolean;
  consentMarketing?: boolean;
}

/**
 * Lead'i veritabanına yazar. Supabase yapılandırılmamışsa sessizce atlanır;
 * e-posta bildirimi her hâlükârda gönderilmeye devam eder.
 *
 * Kayıt, e-posta gönderiminden ÖNCE yapılır: e-posta servisi çökse bile
 * talep kaybolmaz.
 */
export const saveLead = async (lead: LeadInput) => {
  const db = supabaseWrite();
  if (!db) return { saved: false as const };

  const { error } = await db.from("leads").insert({
    source: lead.source,
    email: lead.email,
    name: lead.name ?? null,
    phone: lead.phone || null,
    company: lead.company || null,
    website: lead.website || null,
    payload: lead.payload ?? {},
    lead_score: lead.leadScore ?? 0,
    consent_kvkk: lead.consentKvkk ?? false,
    consent_marketing: lead.consentMarketing ?? false,
  });

  if (error) {
    console.error("[lead] Supabase kaydı başarısız:", error.message);
    return { saved: false as const };
  }
  return { saved: true as const };
};
