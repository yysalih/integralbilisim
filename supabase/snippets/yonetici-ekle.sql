-- Yönetici ekleme (Supabase paneli > SQL Editor).
--
-- 1) Authentication > Users > "Add user" ile kullanıcıyı oluşturun
--    ("Auto Confirm User" işaretli olsun).
-- 2) Aşağıdaki e-postayı o kullanıcınınkiyle değiştirip çalıştırın.

insert into public.admin_users (user_id, email)
select id, email
from auth.users
where email = 'ORNEK@integralbilisim.com'
on conflict (user_id) do nothing;

-- Yöneticiyi kaldırmak için:
-- delete from public.admin_users where email = 'ORNEK@integralbilisim.com';
