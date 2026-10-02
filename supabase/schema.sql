-- P2Care Hospital: Supabase schema
create extension if not exists pgcrypto;

do $$ begin create type public.content_status as enum ('draft','published'); exception when duplicate_object then null; end $$;
do $$ begin create type public.appointment_status as enum ('pending','confirmed','rescheduled','completed','cancelled','no_show'); exception when duplicate_object then null; end $$;
do $$ begin create type public.staff_role as enum ('admin','staff'); exception when duplicate_object then null; end $$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role public.staff_role not null default 'staff',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.doctors (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique,
  specialty text not null,
  credentials text,
  experience text,
  availability text,
  bio text,
  languages text[] default '{}',
  initials text,
  tone text,
  status public.content_status not null default 'published',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique,
  detail text,
  icon text,
  status public.content_status not null default 'published',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.articles (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique,
  category text,
  excerpt text,
  content text,
  date text,
  read text,
  tone text,
  status public.content_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.faqs (
  id uuid primary key default gen_random_uuid(),
  q text not null,
  a text not null,
  category text,
  status public.content_status not null default 'published',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.appointments (
  id uuid primary key default gen_random_uuid(),
  patient_name text not null,
  phone text not null,
  email text,
  department text,
  doctor_id uuid references public.doctors(id) on delete set null,
  appointment_date date not null,
  appointment_time time,
  notes text,
  status public.appointment_status not null default 'pending',
  admin_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.doctors enable row level security;
alter table public.services enable row level security;
alter table public.articles enable row level security;
alter table public.faqs enable row level security;
alter table public.appointments enable row level security;

create or replace function public.is_staff() returns boolean language sql stable security definer set search_path = public as $$
  select exists(select 1 from public.profiles where id = auth.uid() and role in ('admin','staff'));
$$;

create or replace function public.is_admin() returns boolean language sql stable security definer set search_path = public as $$
  select exists(select 1 from public.profiles where id = auth.uid() and role = 'admin');
$$;

-- Public read access is limited to published website content.
create policy "published doctors are public" on public.doctors for select using (status = 'published');
create policy "published services are public" on public.services for select using (status = 'published');
create policy "published articles are public" on public.articles for select using (status = 'published');
create policy "published faqs are public" on public.faqs for select using (status = 'published');

-- Staff can manage content and appointments.
create policy "staff manage doctors" on public.doctors for all using (public.is_staff()) with check (public.is_staff());
create policy "staff manage services" on public.services for all using (public.is_staff()) with check (public.is_staff());
create policy "staff manage articles" on public.articles for all using (public.is_staff()) with check (public.is_staff());
create policy "staff manage faqs" on public.faqs for all using (public.is_staff()) with check (public.is_staff());
create policy "staff read appointments" on public.appointments for select using (public.is_staff());
create policy "staff update appointments" on public.appointments for update using (public.is_staff()) with check (public.is_staff());

-- Public appointment submissions need INSERT only; they cannot read other patients' data.
create policy "public can create appointments" on public.appointments for insert with check (status = 'pending' and admin_notes is null);

create policy "users read own profile" on public.profiles for select using (id = auth.uid());

-- Create a profile after creating a user in Supabase Auth:
-- insert into public.profiles (id, full_name, role) values ('AUTH_USER_UUID', 'Hospital Admin', 'admin');
