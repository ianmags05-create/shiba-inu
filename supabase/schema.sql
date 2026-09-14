-- Run once in Supabase > SQL Editor.
create extension if not exists pgcrypto;

create table if not exists public.site_content (
  id uuid primary key default gen_random_uuid(),
  content_key text unique not null,
  label text not null,
  section text not null default 'General',
  value text not null default '',
  content_type text not null default 'text' check (content_type in ('text','textarea','url','phone','email')),
  sort_order integer not null default 0,
  published boolean not null default true,
  updated_at timestamptz not null default now()
);

create table if not exists public.menu_items (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  url text not null,
  parent_id uuid references public.menu_items(id) on delete cascade,
  sort_order integer not null default 0,
  visible boolean not null default true,
  updated_at timestamptz not null default now()
);

create table if not exists public.media_assets (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  alt_text text not null default '',
  public_url text not null,
  storage_path text not null unique,
  slot_key text unique,
  created_at timestamptz not null default now()
);

create table if not exists public.app_users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  full_name text not null default '',
  role text not null default 'staff' check (role in ('admin','editor','staff')),
  active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.site_content enable row level security;
alter table public.menu_items enable row level security;
alter table public.media_assets enable row level security;
alter table public.app_users enable row level security;

drop policy if exists "Public reads published content" on public.site_content;
create policy "Public reads published content" on public.site_content for select to anon, authenticated using (published);
drop policy if exists "Public reads visible menus" on public.menu_items;
create policy "Public reads visible menus" on public.menu_items for select to anon, authenticated using (visible);
drop policy if exists "Public reads media" on public.media_assets;
create policy "Public reads media" on public.media_assets for select to anon, authenticated using (true);
drop policy if exists "Users read own profile" on public.app_users;
create policy "Users read own profile" on public.app_users for select to authenticated using (auth.uid() = id);

insert into storage.buckets (id,name,public,file_size_limit,allowed_mime_types)
values ('site-media','site-media',true,5242880,array['image/jpeg','image/png','image/webp','image/gif'])
on conflict (id) do update set public=true, file_size_limit=5242880;

insert into public.site_content (content_key,label,section,value,content_type,sort_order) values
('hero.eyebrow','Hero eyebrow','Hero','Davao City pet hotel, grooming & shop','text',10),
('hero.title','Hero heading','Hero','A home away from home for your furbabies','text',20),
('services.title','Services heading','Services','Four ways we look after your pet','text',30),
('hotel.title','Hotel heading','Hotel','Premium care, happy pets','text',40),
('grooming.title','Grooming heading','Grooming','Every service, every price, up front','text',50),
('gallery.title','Gallery heading','Gallery','Have a look around the shop','text',60),
('story.title','Story heading','Story','It began with one Shiba Inu called Kumi','text',70),
('team.title','Team heading','Team','The people your pet will actually meet','text',80),
('reviews.title','Reviews heading','Reviews','What owners tell us','text',90),
('contact.title','Contact heading','Contact','Contact us or give us a ring','text',100),
('contact.phone','Phone number','Contact','0955 422 2664','phone',110),
('contact.email','Email address','Contact','hello@shibainupetshop.ph','email',120)
on conflict (content_key) do nothing;

insert into public.menu_items (label,url,sort_order) values
('Home','#top',10),('Services','#services',20),('Gallery','#gallery',30),('Team','#team',40),('Reviews','#reviews',50),('Contact us','#book',60)
on conflict do nothing;

insert into public.app_users (id,email,full_name,role,active)
select id,email,coalesce(raw_user_meta_data->>'full_name','Owner'),'admin',true from auth.users
where email='janmags09@gmail.com'
on conflict (id) do update set role='admin',active=true;
