-- İntegral Bilişim — başlangıç şeması
-- Herkese açık okuma yalnızca yayımlanmış içerikte; tüm yazma işlemleri
-- sunucu tarafındaki service_role anahtarıyla yapılır.

-- ---------- Blog ----------
create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  category text not null,
  accent text not null default '#C9436E',
  excerpt text not null default '',
  image text not null default '',
  -- Gövde: [{ heading?: string, text: string }]
  body jsonb not null default '[]'::jsonb,
  reading_minutes int not null default 1,
  published_at date not null default current_date,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists posts_published_idx
  on public.posts (is_published, published_at desc);
create index if not exists posts_category_idx on public.posts (category);

-- ---------- Lead havuzu ----------
-- Teklif sihirbazı, site analizi ve iletişim formu tek tabloda toplanır.
create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  source text not null check (source in ('quote_wizard', 'site_audit', 'contact')),
  name text,
  email text not null,
  phone text,
  company text,
  website text,
  -- Sihirbaz cevapları ya da analiz skoru gibi modüle özel veriler
  payload jsonb not null default '{}'::jsonb,
  lead_score int not null default 0 check (lead_score between 0 and 100),
  status text not null default 'new'
    check (status in ('new', 'contacted', 'quoted', 'won', 'lost')),
  consent_kvkk boolean not null default false,
  consent_marketing boolean not null default false,
  notes text
);

create index if not exists leads_created_idx on public.leads (created_at desc);
create index if not exists leads_status_idx on public.leads (status, created_at desc);

-- ---------- updated_at ----------
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists posts_touch_updated_at on public.posts;
create trigger posts_touch_updated_at
  before update on public.posts
  for each row execute function public.touch_updated_at();

-- ---------- Erişim kuralları ----------
alter table public.posts enable row level security;
alter table public.leads enable row level security;

-- Site ziyaretçisi (anon) yalnızca yayımlanmış yazıları okuyabilir.
drop policy if exists "yayimlanmis yazilar herkese acik" on public.posts;
create policy "yayimlanmis yazilar herkese acik"
  on public.posts for select
  to anon, authenticated
  using (is_published);

-- leads için hiçbir anon politikası yok: okuma ve yazma yalnızca service_role
-- ile (RLS'yi atlar) yapılır. Panel geldiğinde authenticated rolü için
-- ayrı politika eklenecek.
