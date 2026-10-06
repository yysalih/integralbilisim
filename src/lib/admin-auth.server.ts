import { supabaseAs } from "@/lib/supabase.server";

export type AdminCheck =
  | { ok: true; userId: string; email: string | undefined; token: string }
  | { ok: false; status: 401 | 403 | 503; message: string };

/**
 * Yönetim uçlarının ortak kapısı. İstemci Supabase oturumunun erişim jetonunu
 * `Authorization: Bearer <jeton>` başlığıyla gönderir.
 *
 * 1) Jeton Supabase Auth'a doğrulatılır (süresi dolmuş/sahte jeton → 401).
 * 2) Kullanıcı admin_users listesinde mi diye is_admin() sorulur; sorgu
 *    kullanıcının kendi jetonuyla gittiği için karar veritabanında verilir
 *    (giriş yapmış ama yönetici olmayan → 403).
 */
export const requireAdmin = async (request: Request): Promise<AdminCheck> => {
  const header = request.headers.get("authorization") ?? "";
  const token = /^Bearer\s+(.+)$/i.exec(header)?.[1]?.trim();
  if (!token) return { ok: false, status: 401, message: "Giriş gerekli." };

  const db = supabaseAs(token);
  if (!db) return { ok: false, status: 503, message: "Veritabanı yapılandırılmamış." };

  const { data: userData, error: userError } = await db.auth.getUser(token);
  if (userError || !userData.user) {
    return { ok: false, status: 401, message: "Oturum geçersiz ya da süresi dolmuş." };
  }

  const { data: isAdmin, error: adminError } = await db.rpc("is_admin");
  if (adminError) {
    console.error("[admin] is_admin sorgusu başarısız:", adminError.message);
    return { ok: false, status: 503, message: "Yetki kontrolü yapılamadı." };
  }
  if (isAdmin !== true) return { ok: false, status: 403, message: "Bu işlem için yetkiniz yok." };

  return { ok: true, userId: userData.user.id, email: userData.user.email, token };
};
