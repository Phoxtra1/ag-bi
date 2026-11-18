-- Information Solutions: clean Supabase schema
-- Apply once in the Supabase SQL editor or through Supabase migrations.
create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('admin','reviewer','support','customer')),
  created_at timestamptz not null default now(),
  unique(user_id, role)
);

create or replace function public.has_staff_role()
returns boolean language sql stable security definer
set search_path = public
as $$
  select exists (
    select 1 from public.user_roles
    where user_id = auth.uid() and role in ('admin','reviewer','support')
  );
$$;

create or replace function public.has_admin_role()
returns boolean language sql stable security definer
set search_path = public
as $$
  select exists (
    select 1 from public.user_roles
    where user_id = auth.uid() and role = 'admin'
  );
$$;

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, email)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name',''), new.email)
  on conflict (id) do update set email = excluded.email;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created_information_solutions on auth.users;
create trigger on_auth_user_created_information_solutions
after insert on auth.users
for each row execute procedure public.handle_new_user();

create table if not exists public.info_discovery_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  category text not null default 'general',
  question text not null,
  context text,
  status text not null default 'submitted' check (status in ('submitted','under_review','awaiting_customer','quoted','approved','in_progress','awaiting_payment','paid','completed','released','declined','cancelled')),
  assessment_notes text,
  preview_text text,
  quoted_amount numeric(12,2),
  currency text not null default 'GHS',
  reviewed_by uuid references auth.users(id),
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.infoservice_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  full_name text not null,
  email text not null,
  category text not null check (category in ('career_education','business_information','contracts_commitments','travel_relocation','info_report_verification')),
  request_details text not null,
  status text not null default 'submitted' check (status in ('submitted','under_review','awaiting_customer','quoted','approved','in_progress','awaiting_payment','paid','completed','released','declined','cancelled')),
  assessment_notes text,
  quoted_amount numeric(12,2),
  currency text not null default 'GHS',
  reviewed_by uuid references auth.users(id),
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.invoices (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  discovery_request_id uuid references public.info_discovery_requests(id) on delete set null,
  infoservice_request_id uuid references public.infoservice_requests(id) on delete set null,
  invoice_number text not null unique,
  description text not null,
  amount numeric(12,2) not null check (amount >= 0),
  currency text not null default 'GHS',
  status text not null default 'draft' check (status in ('draft','issued','paid','void','overdue')),
  due_at timestamptz,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (num_nonnulls(discovery_request_id, infoservice_request_id) <= 1)
);

create table if not exists public.payment_records (
  id uuid primary key default gen_random_uuid(),
  invoice_id uuid not null references public.invoices(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  provider text not null default 'manual',
  provider_reference text unique,
  amount numeric(12,2) not null check (amount >= 0),
  currency text not null default 'GHS',
  status text not null default 'pending' check (status in ('pending','succeeded','failed','refunded')),
  confirmed_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  discovery_request_id uuid references public.info_discovery_requests(id) on delete set null,
  infoservice_request_id uuid references public.infoservice_requests(id) on delete set null,
  invoice_id uuid references public.invoices(id) on delete set null,
  title text not null,
  summary text,
  report_content jsonb,
  storage_path text,
  status text not null default 'draft' check (status in ('draft','review','approved','released','archived')),
  verification_status text check (verification_status in ('confirmed','contradicted','unverified','inconclusive','requires_further_confirmation')),
  methodology text,
  limitations text,
  released_at timestamptz,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (num_nonnulls(discovery_request_id, infoservice_request_id) <= 1)
);

create table if not exists public.request_activity (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  discovery_request_id uuid references public.info_discovery_requests(id) on delete cascade,
  infoservice_request_id uuid references public.infoservice_requests(id) on delete cascade,
  actor_id uuid references auth.users(id),
  activity_type text not null,
  message text not null,
  visible_to_customer boolean not null default false,
  created_at timestamptz not null default now(),
  check (num_nonnulls(discovery_request_id, infoservice_request_id) = 1)
);

create index if not exists discovery_user_created_idx on public.info_discovery_requests(user_id, created_at desc);
create index if not exists infoservice_user_created_idx on public.infoservice_requests(user_id, created_at desc);
create index if not exists reports_user_status_idx on public.reports(user_id, status);
create index if not exists invoices_user_status_idx on public.invoices(user_id, status);
create index if not exists activity_discovery_idx on public.request_activity(discovery_request_id, created_at desc);
create index if not exists activity_infoservice_idx on public.request_activity(infoservice_request_id, created_at desc);

alter table public.profiles enable row level security;
alter table public.user_roles enable row level security;
alter table public.info_discovery_requests enable row level security;
alter table public.infoservice_requests enable row level security;
alter table public.invoices enable row level security;
alter table public.payment_records enable row level security;
alter table public.reports enable row level security;
alter table public.request_activity enable row level security;

drop policy if exists "Profile owner or staff read" on public.profiles;
create policy "Profile owner or staff read" on public.profiles for select to authenticated using (id = auth.uid() or public.has_staff_role());
drop policy if exists "Profile owner update" on public.profiles;
create policy "Profile owner update" on public.profiles for update to authenticated using (id = auth.uid()) with check (id = auth.uid());

drop policy if exists "Role owner or staff read" on public.user_roles;
create policy "Role owner or staff read" on public.user_roles for select to authenticated using (user_id = auth.uid() or public.has_staff_role());
drop policy if exists "Only admins manage roles" on public.user_roles;
create policy "Only admins manage roles" on public.user_roles for all to authenticated using (public.has_admin_role()) with check (public.has_admin_role());

drop policy if exists "Customers create discovery requests" on public.info_discovery_requests;
create policy "Customers create discovery requests" on public.info_discovery_requests for insert to authenticated with check (user_id = auth.uid());
drop policy if exists "Customers and staff read discovery requests" on public.info_discovery_requests;
create policy "Customers and staff read discovery requests" on public.info_discovery_requests for select to authenticated using (user_id = auth.uid() or public.has_staff_role());
drop policy if exists "Staff update discovery requests" on public.info_discovery_requests;
create policy "Staff update discovery requests" on public.info_discovery_requests for update to authenticated using (public.has_staff_role()) with check (public.has_staff_role());

drop policy if exists "Customers create infoservice requests" on public.infoservice_requests;
create policy "Customers create infoservice requests" on public.infoservice_requests for insert to authenticated with check (user_id = auth.uid());
drop policy if exists "Customers and staff read infoservice requests" on public.infoservice_requests;
create policy "Customers and staff read infoservice requests" on public.infoservice_requests for select to authenticated using (user_id = auth.uid() or public.has_staff_role());
drop policy if exists "Staff update infoservice requests" on public.infoservice_requests;
create policy "Staff update infoservice requests" on public.infoservice_requests for update to authenticated using (public.has_staff_role()) with check (public.has_staff_role());

drop policy if exists "Customer or staff read invoices" on public.invoices;
create policy "Customer or staff read invoices" on public.invoices for select to authenticated using (user_id = auth.uid() or public.has_staff_role());
drop policy if exists "Staff manage invoices" on public.invoices;
create policy "Staff manage invoices" on public.invoices for all to authenticated using (public.has_staff_role()) with check (public.has_staff_role());

drop policy if exists "Customer or staff read payment records" on public.payment_records;
create policy "Customer or staff read payment records" on public.payment_records for select to authenticated using (user_id = auth.uid() or public.has_staff_role());
drop policy if exists "Staff manage payment records" on public.payment_records;
create policy "Staff manage payment records" on public.payment_records for all to authenticated using (public.has_staff_role()) with check (public.has_staff_role());

drop policy if exists "Customer reads released reports and staff read all" on public.reports;
create policy "Customer reads released reports and staff read all" on public.reports for select to authenticated using ((user_id = auth.uid() and status = 'released') or public.has_staff_role());
drop policy if exists "Staff manage reports" on public.reports;
create policy "Staff manage reports" on public.reports for all to authenticated using (public.has_staff_role()) with check (public.has_staff_role());

drop policy if exists "Customer or staff read request activity" on public.request_activity;
create policy "Customer or staff read request activity" on public.request_activity for select to authenticated using ((user_id = auth.uid() and visible_to_customer) or public.has_staff_role());
drop policy if exists "Staff create request activity" on public.request_activity;
create policy "Staff create request activity" on public.request_activity for insert to authenticated with check (public.has_staff_role());

-- Private report storage. The client receives access only through authenticated policies.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('information-reports','information-reports',false,52428800,array['application/pdf','application/vnd.openxmlformats-officedocument.wordprocessingml.document','text/plain'])
on conflict (id) do nothing;

drop policy if exists "Users read their own report files" on storage.objects;
create policy "Users read their own report files" on storage.objects for select to authenticated
using (bucket_id = 'information-reports' and (public.has_staff_role() or (storage.foldername(name))[1] = auth.uid()::text));

drop policy if exists "Staff upload report files" on storage.objects;
create policy "Staff upload report files" on storage.objects for insert to authenticated
with check (bucket_id = 'information-reports' and public.has_staff_role());

drop policy if exists "Staff update report files" on storage.objects;
create policy "Staff update report files" on storage.objects for update to authenticated
using (bucket_id = 'information-reports' and public.has_staff_role())
with check (bucket_id = 'information-reports' and public.has_staff_role());

-- Bootstrap the first administrator manually after the first account is registered:
-- insert into public.user_roles (user_id, role) values ('AUTH_USER_UUID', 'admin');
-- Never expose the Supabase service-role key in browser code.
