# Yönetim paneli altyapısı

Panel bu temelin üstüne yazılır. Burada hazır olanlar ve nasıl kullanılacakları var.

## Mimari

- **Panel ayrı bir adreste çalışır: `https://admin.integralbilisim.com`.** Ana site (`integralbilisim.com`) ayrı bir
  Node uygulamasıdır; panel onun içinde değildir.
- **Aynı Supabase projesini kullanır** (`integralbilisim`, ref `hlpnbchodsvswmmknteq`). Veri ve giriş orada;
  panel `posts` ve `leads` tablolarını doğrudan, kullanıcının oturumuyla (anon anahtar + RLS) okuyup yazar.
  URL ve anon anahtar herkese açık olacak şekilde tasarlanmıştır; `service_role` anahtarı panele **girmez**.
- **Tek sunucu tarafı ihtiyaç görsel yükleme** ve o, ana sitede hazır: `POST https://integralbilisim.com/api/admin/upload`.
  Panel farklı bir kaynaktan çağırdığı için CORS izni vardır (aşağıda). Bu yüzden panel istenirse **sunucusuz, statik bir
  SPA** olabilir (Setup Node.js App gerekmez, dosyalar subdomain'in public_html'ine yüklenir).
- Panel adresi `noindex` olmalı: `robots.txt` içinde `Disallow: /`, sayfalarda `<meta name="robots" content="noindex">`.
- Supabase paneli > Authentication > URL Configuration: **Site URL** `https://admin.integralbilisim.com`, **Redirect URLs**
  listesine `https://admin.integralbilisim.com/**` (parola sıfırlama/davet e-postaları bu adrese döner). Yerel geliştirme için
  `http://localhost:3000/**` eklenebilir.

## Yetki modeli

- Giriş: **Supabase Auth** (e-posta + parola). Kayıt kapalı; kullanıcılar panelden/SQL'den eklenir.
- Giriş yapmak yetki değildir. Yalnızca `public.admin_users` listesindekiler yöneticidir
  (`public.is_admin()` bunu söyler). İlk yönetici: `supabase/snippets/yonetici-ekle.sql`.
- Karar **veritabanında** verilir (RLS). Tarayıcıdan, kullanıcının kendi jetonuyla (anon anahtar +
  oturum) yapılan sorgular otomatik olarak korunur; panel kodunda ayrıca yetki yazmaya gerek yok.
  Şema: `supabase/migrations/20261006120000_admin_roles.sql`.

| Tablo | Yönetici ne yapabilir |
|---|---|
| `posts` | Hepsi (okuma, ekleme, düzenleme, silme, taslak görme) |
| `leads` | Okuma, **yalnızca `status` ve `notes` güncelleme**, silme (KVKK). Ekleme yok. |
| `admin_users` | Yalnızca kendi satırını okur |

`leads.status`: `new` → `contacted` → `quoted` → `won` / `lost`.
Kaynak bilgisi `leads.payload->'attribution'` içinde (`channel`, `utm_*`, `landing_page`, `form_page`, `referrer_host`).

## Sunucu tarafı yardımcılar

- `requireAdmin(request)` — `src/lib/admin-auth.server.ts`. `Authorization: Bearer <erişim jetonu>`
  başlığını doğrular, `is_admin()` sorar. Dönüş: `{ ok: true, userId, email, token }` ya da
  `{ ok: false, status: 401 | 403 | 503, message }`. Panelin sunucu uçları bununla başlamalı.
- `supabaseAs(token)` — `src/lib/supabase.server.ts`. Kullanıcının jetonuyla çalışan istemci (RLS geçerli).
  Yönetim uçlarında `service_role` yerine bunu kullanın.
- `*.server.ts` dosyaları rotalardan **statik import edilemez**; handler içinde `await import(...)` ile yükleyin.
- Bu yardımcılar **ana sitenin** deposundadır. Panel ayrı bir projeyse, sunucu tarafı bir şeye ihtiyaç duyarsa
  (ör. yeni bir yönetim ucu) ya kendi `requireAdmin`'ini yazar ya da ucu ana sitede açıp aynı CORS desenini kullanır.

## Görsel yükleme

`POST /api/admin/upload` — `multipart/form-data`

| Alan | |
|---|---|
| `file` | Zorunlu. JPEG, PNG, WebP veya AVIF; en fazla 5 MB. SVG kabul edilmez. |
| `folder` | İsteğe bağlı; şimdilik yalnızca `blog` |

Başlık: `Authorization: Bearer <supabase erişim jetonu>` (`supabase.auth.getSession()` → `access_token`).

**CORS:** yalnızca `ADMIN_ORIGIN` ortam değişkenindeki adreslere izin verilir (varsayılan `https://admin.integralbilisim.com`;
virgülle birden fazla, yerelde `http://localhost:3000` eklenebilir). Çerez kullanılmaz, kimlik Bearer jetonuyla gelir. Tarayıcı
önce `OPTIONS` ile izin sorar (204); izinsiz adres 403 alır. Panel `fetch`'e `credentials` eklememelidir.

```js
const fd = new FormData();
fd.append("file", file);
const res = await fetch("/api/admin/upload", {
  method: "POST",
  headers: { Authorization: `Bearer ${session.access_token}` },
  body: fd, // Content-Type'ı elle yazmayın
});
const { ok, path, url, error } = await res.json();
```

Başarıda `{ ok: true, path: "/uploads/blog/2026/10/ad-1a2b3c4d.jpg", url: "https://…b-cdn.net/uploads/…", bytes, type }`.
**Yazının `image` alanına `path` yazılır, `url` değil**: site görseli `mediaUrl(post.image)` ile çözer,
`/uploads/...` yolunu CDN'e çevirir. (`/blog/`, `/app/`, `/isler/` gibi yollar sitenin kendi sunucusuna gider.)
`url` yalnızca editörde önizleme içindir.

Hatalar (`{ ok: false, error }`): `401` jeton yok/geçersiz · `403` yönetici değil · `400` dosya yok/klasör geçersiz ·
`413` 5 MB üstü · `415` desteklenmeyen tür · `502` Bunny reddetti/ulaşılamadı · `503` yapılandırma eksik.

Dosya adı sunucuda temizlenir ve rastgele ek alır; aynı ada ikinci yükleme eskisini ezmez, CDN önbelleği
temizlemek gerekmez. Görsel işleme (yeniden boyutlandırma/WebP) yoktur; kapak için ~1600 px genişlik önerilir
ve istemcide küçültüp yüklemek en iyisidir.

Ortam değişkenleri (ana sitenin sunucusunda): `BUNNY_STORAGE_ZONE`, `BUNNY_STORAGE_KEY`, `BUNNY_STORAGE_HOST` (isteğe bağlı), `ADMIN_ORIGIN` (isteğe bağlı).

## Sitemap

`/sitemap.xml` ve `/llms.txt` veritabanından canlı üretilir (5 dk önbellek). Panelden yayımlanan/yayından
kaldırılan yazı kendiliğinden yansır; ayrıca bir işlem gerekmez.
