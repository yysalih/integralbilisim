import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Supabase istemcileri — yalnızca sunucuda kullanılır.
 * Bu dosya istemci paketine girmemelidir; içe aktarımı server fonksiyonlarıyla
 * sınırlı tutun.
 *
 * Okuma için anon anahtar + RLS yeterlidir (yalnızca yayımlanmış içerik gelir).
 * Yazma işlemleri service_role ister; o anahtar hiçbir zaman tarayıcıya inmez.
 */
const url = process.env.SUPABASE_URL;
const anonKey = process.env.SUPABASE_ANON_KEY;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

/** Supabase yapılandırılmadıysa uygulama statik içerikle çalışmaya devam eder. */
export const isSupabaseConfigured = Boolean(url && anonKey);

let readClient: SupabaseClient | null = null;
export const supabaseRead = () => {
  if (!url || !anonKey) return null;
  readClient ??= createClient(url, anonKey, { auth: { persistSession: false } });
  return readClient;
};

let writeClient: SupabaseClient | null = null;
export const supabaseWrite = () => {
  if (!url || !serviceKey) return null;
  writeClient ??= createClient(url, serviceKey, { auth: { persistSession: false } });
  return writeClient;
};

/**
 * Giriş yapmış kullanıcının kimliğiyle çalışan istemci: sorgular o kullanıcının
 * jetonuyla gider, dolayısıyla RLS politikaları (is_admin) uygulanır. Yönetim
 * uçları service_role yerine bunu kullanmalı; yetki kontrolü veritabanında kalır.
 */
export const supabaseAs = (accessToken: string) => {
  if (!url || !anonKey) return null;
  return createClient(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { headers: { Authorization: `Bearer ${accessToken}` } },
  });
};
