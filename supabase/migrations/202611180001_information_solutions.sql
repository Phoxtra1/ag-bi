-- Amineva Global Information Solutions
-- Initial Supabase schema. Apply through Lovable Cloud / Supabase migrations.
-- Keep AI calls, payment verification and privileged writes in Edge Functions.

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  account_type text not null default 'individual' check (account_type in ('individual','organization')),
  organization_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('admin','moderator','user')),
  created_at timestamptz not null default now(),
  unique (user_id, role)
);

create table if not exists public.info_discovery_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  question text not null,
  category text,
  status text not null default 'submitted'
    check (status in ('submitted','assessing','awaiting_payment','processing','completed','failed','cancelled')),
  preview jsonb,
  report_content jsonb,
  price_amount integer,
  currency text not null default 'GHS',
  payment_status text not null default 'unpaid'
    check (payment_status in ('unpaid','pending','paid','refunded','failed')),
  provider_reference text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.infoservice_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  full_name text not null,
  email text not null,
  category text not null check (category in (
    'career_education','business_information','contracts_commitments',
    'travel_relocation','info_report_verification'
  )),
  request_details text not null,
  status text not null default 'received'
    check (status in ('received','assessment','discussion','quoted','invoiced','paid','in_progress','delivered','closed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  request_id uuid not null references public.info_discovery_requests(id) on delete cascade,
  provider text not null default 'stripe',
  provider_session_id text unique,
  provider_payment_intent_id text unique,
  amount integer not null check (amount > 0),
  currency text not null default 'GHS',
  status text not null default 'pending'
    check (status in ('pending','paid','failed','refunded','cancelled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists info_discovery_user_created_idx
  on public.info_discovery_requests(user_id, created_at desc);
create index if not exists infoservice_user_created_idx
  on public.infoservice_requests(user_id, created_at desc);
create index if not exists payments_user_created_idx
  on public.payments(user_id, created_at desc);

alter table public.profiles enable row level security;
alter table public.user_roles enable row level security;
alter table public.info_discovery_requests enable row level security;
alter table public.infoservice_requests enable row level security;
alter table public.payments enable row level security;

drop policy if exists "Users read own profile" on public.profiles;
create policy "Users read own profile" on public.profiles
  for select to authenticated using (auth.uid() = id);
drop policy if exists "Users update own profile" on public.profiles;
create policy "Users update own profile" on public.profiles
  for update to authenticated using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists "Users read own roles" on public.user_roles;
create policy "Users read own roles" on public.user_roles
  for select to authenticated using (auth.uid() = user_id);

drop policy if exists "Users create own discovery requests" on public.info_discovery_requests;
create policy "Users create own discovery requests" on public.info_discovery_requests
  for insert to authenticated with check (auth.uid() = user_id);

drop policy if exists "Users read own discovery requests" on public.info_discovery_requests;
create policy "Users read own discovery requests" on public.info_discovery_requests
  for select to authenticated using (auth.uid() = user_id);

drop policy if exists "Users create own infoservice requests" on public.infoservice_requests;
create policy "Users create own infoservice requests" on public.infoservice_requests
  for insert to authenticated with check (auth.uid() = user_id);

drop policy if exists "Users read own infoservice requests" on public.infoservice_requests;
create policy "Users read own infoservice requests" on public.infoservice_requests
  for select to authenticated using (auth.uid() = user_id);

drop policy if exists "Users read own payments" on public.payments;
create policy "Users read own payments" on public.payments
  for select to authenticated using (auth.uid() = user_id);

-- No browser-side INSERT/UPDATE policies for requests, reports, roles or payments.
-- Edge Functions validate users, apply limits, create records and verify Stripe webhooks.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', ''))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
