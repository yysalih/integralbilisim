-- İntegral Bilişim — yönetim paneli yetkileri
--
-- Panel, Supabase Auth ile giriş yapan kullanıcıyla (authenticated rolü) çalışır.
-- Giriş yapmış olmak yetki değildir: yalnızca admin_users tablosundakiler
-- yönetici sayılır. Kayıt (sign-up) açık kalsa bile yabancı hesaplar hiçbir
-- veriye erişemez.
--
-- İlk yöneticiyi eklemek için: supabase/snippets/yonetici-ekle.sql

-- ---------- Yönetici listesi ----------
create table if not exists public.admin_users (
  user_id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  created_at timestamptz not null default now()
);

alter table public.admin_users enable row level security;

-- Kullanıcı yalnızca kendi satırını görür (panel "yönetici miyim?" sorusunu
-- buradan sorar). Ekleme/silme için API politikası YOK: yalnızca SQL editörü
-- ya da service_role ile yapılır.
drop policy if exists "yonetici kendi kaydini gorur" on public.admin_users;
create policy "yonetici kendi kaydini gorur"
  on public.admin_users for select
  to authenticated
  using (user_id = auth.uid());

-- ---------- Yönetici mi? ----------
-- security definer: politika içinde admin_users'a RLS'siz bakabilsin diye.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.admin_users where user_id = auth.uid());
$$;

revoke all on function public.is_admin() from public, anon;
grant execute on function public.is_admin() to authenticated;

-- ---------- Blog yazıları: yöneticiler her şeyi yapabilir ----------
-- Herkese açık "yayımlanmış yazıları oku" politikası aynen kalır.
drop policy if exists "yonetici yazilari yonetir" on public.posts;
create policy "yonetici yazilari yonetir"
  on public.posts for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ---------- Lead'ler: yönetici okur, durum/not günceller, siler ----------
drop policy if exists "yonetici lead okur" on public.leads;
create policy "yonetici lead okur"
  on public.leads for select
  to authenticated
  using (public.is_admin());

drop policy if exists "yonetici lead gunceller" on public.leads;
create policy "yonetici lead gunceller"
  on public.leads for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- KVKK m.11: silme talebi gelen kişinin kaydı panelden silinebilmeli.
drop policy if exists "yonetici lead siler" on public.leads;
create policy "yonetici lead siler"
  on public.leads for delete
  to authenticated
  using (public.is_admin());

-- Satır politikası sütunu kısıtlayamaz; sütun yetkisiyle yöneticinin yalnızca
-- durum ve notu değiştirebilmesi sağlanır. Onay bilgileri, iletişim bilgileri
-- ve kaynak verisi panelden (bir hata olsa bile) değiştirilemez.
revoke update on public.leads from authenticated;
grant update (status, notes) on public.leads to authenticated;

-- Lead'e ekleme yalnızca sunucudan (service_role) yapılır; authenticated için
-- insert politikası yoktur.
