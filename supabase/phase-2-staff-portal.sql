-- Run once in Supabase > SQL Editor after the original schema.sql.
-- Operational records are private. The website uses the server-side secret key
-- and every mutation also verifies the signed-in staff member.

create table if not exists public.customer_enquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  mobile text not null,
  email text,
  message text not null,
  status text not null default 'new' check (status in ('new','contacted','resolved','spam')),
  staff_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.pet_stays (
  id uuid primary key default gen_random_uuid(),
  owner_name text not null,
  owner_mobile text not null,
  owner_email text,
  emergency_contact text,
  pet_name text not null,
  pet_type text not null default 'dog' check (pet_type in ('dog','cat','other')),
  breed text,
  room text,
  check_in_at timestamptz not null,
  check_out_at timestamptz not null,
  feeding_notes text,
  medication_notes text,
  vaccination_verified boolean not null default false,
  status text not null default 'reserved' check (status in ('reserved','checked_in','checked_out','cancelled')),
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint valid_stay_dates check (check_out_at > check_in_at)
);

create table if not exists public.care_logs (
  id uuid primary key default gen_random_uuid(),
  stay_id uuid not null references public.pet_stays(id) on delete cascade,
  care_type text not null check (care_type in ('feeding','water','walk','medication','cleaning','health_check','update','other')),
  notes text,
  completed_at timestamptz not null default now(),
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.grooming_jobs (
  id uuid primary key default gen_random_uuid(),
  owner_name text not null,
  owner_mobile text not null,
  pet_name text not null,
  pet_type text not null default 'dog' check (pet_type in ('dog','cat','other')),
  service text not null,
  appointment_at timestamptz not null,
  status text not null default 'scheduled' check (status in ('scheduled','confirmed','in_progress','completed','cancelled')),
  notes text,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists pet_stays_status_dates_idx on public.pet_stays(status,check_in_at,check_out_at);
create index if not exists care_logs_stay_date_idx on public.care_logs(stay_id,completed_at desc);
create index if not exists grooming_jobs_status_date_idx on public.grooming_jobs(status,appointment_at);
create index if not exists customer_enquiries_status_date_idx on public.customer_enquiries(status,created_at desc);

alter table public.customer_enquiries enable row level security;
alter table public.pet_stays enable row level security;
alter table public.care_logs enable row level security;
alter table public.grooming_jobs enable row level security;

-- Deliberately no browser-access policies: these records contain private customer
-- and pet information and are accessed only through authenticated server actions.
revoke all on public.customer_enquiries from anon, authenticated;
revoke all on public.pet_stays from anon, authenticated;
revoke all on public.care_logs from anon, authenticated;
revoke all on public.grooming_jobs from anon, authenticated;
