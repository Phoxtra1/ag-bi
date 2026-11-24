create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text, email text,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('admin','reviewer','support','customer')),
  created_at timestamptz not null default now(),
  unique(user_id, role)
);

create or replace function public.has_staff_role()
returns boolean language sql stable security definer set search_path = public
as $$ select exists (select 1 from public.user_roles where user_id = auth.uid() and role in ('admin','reviewer','support')); $$;

create or replace function public.has_admin_role()
returns boolean language sql stable security definer set search_path = public
as $$ select exists (select 1 from public.user_roles where user_id = auth.uid() and role = 'admin'); $$;

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, email)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name',''), new.email)
  on conflict (id) do update set email = excluded.email;
  return new;
end;
$$;
drop trigger if exists on_auth_user_created_information_solutions on auth.users;
create trigger on_auth_user_created_information_solutions after insert on auth.users
for each row execute procedure public.handle_new_user();

create table if not exists public.info_discovery_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  category text not null default 'general',
  question text not null, context text,
  status text not null default 'submitted' check (status in ('submitted','under_review','awaiting_customer','quoted','approved','in_progress','awaiting_payment','paid','completed','released','declined','cancelled')),
  assessment_notes text, preview_text text, quoted_amount numeric(12,2),
  currency text not null default 'USD',
  reviewed_by uuid references auth.users(id), reviewed_at timestamptz,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table if not exists public.infoservice_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  full_name text not null, email text not null,
  category text not null check (category in ('career_education','business_information','contracts_commitments','travel_relocation','info_report_verification')),
  request_details text not null,
  status text not null default 'submitted' check (status in ('submitted','under_review','awaiting_customer','quoted','approved','in_progress','awaiting_payment','paid','completed','released','declined','cancelled')),
  assessment_notes text, quoted_amount numeric(12,2),
  currency text not null default 'USD',
  reviewed_by uuid references auth.users(id), reviewed_at timestamptz,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table if not exists public.discovery_runs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  question text not null, context text, title text,
  preview jsonb not null default '{}'::jsonb,
  recommendations jsonb not null default '[]'::jsonb,
  price numeric(12,2),
  currency text not null default 'USD',
  payment_status text not null default 'preview' check (payment_status in ('preview','pending','paid','failed')),
  payment_reference text,
  discovery_mode text not null default 'general' check (discovery_mode in ('general','sensitive')),
  pricing_tier text check (pricing_tier is null or pricing_tier in ('Quick Discovery','Insight Report','Deep Research','Sensitive Info')),
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table if not exists public.invoices (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  discovery_request_id uuid references public.info_discovery_requests(id) on delete set null,
  infoservice_request_id uuid references public.infoservice_requests(id) on delete set null,
  discovery_run_id uuid references public.discovery_runs(id) on delete set null,
  invoice_number text not null unique,
  description text not null,
  amount numeric(12,2) not null check (amount >= 0),
  currency text not null default 'USD',
  status text not null default 'draft' check (status in ('draft','issued','paid','void','overdue')),
  due_at timestamptz, created_by uuid references auth.users(id),
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  check (num_nonnulls(discovery_request_id, infoservice_request_id) <= 1)
);

create table if not exists public.payment_records (
  id uuid primary key default gen_random_uuid(),
  invoice_id uuid not null references public.invoices(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  provider text not null default 'manual',
  provider_reference text unique,
  amount numeric(12,2) not null check (amount >= 0),
  currency text not null default 'USD',
  status text not null default 'pending' check (status in ('pending','succeeded','failed','refunded')),
  confirmed_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  discovery_request_id uuid references public.info_discovery_requests(id) on delete set null,
  infoservice_request_id uuid references public.infoservice_requests(id) on delete set null,
  discovery_run_id uuid references public.discovery_runs(id) on delete set null,
  invoice_id uuid references public.invoices(id) on delete set null,
  title text not null, summary text, report_content jsonb, storage_path text,
  status text not null default 'draft' check (status in ('draft','review','approved','released','archived')),
  verification_status text check (verification_status in ('confirmed','contradicted','unverified','inconclusive','requires_further_confirmation')),
  methodology text, limitations text, released_at timestamptz,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  check (num_nonnulls(discovery_request_id, infoservice_request_id) <= 1)
);

create table if not exists public.request_activity (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  discovery_request_id uuid references public.info_discovery_requests(id) on delete cascade,
  infoservice_request_id uuid references public.infoservice_requests(id) on delete cascade,
  actor_id uuid references auth.users(id),
  activity_type text not null, message text not null,
  visible_to_customer boolean not null default false,
  created_at timestamptz not null default now(),
  check (num_nonnulls(discovery_request_id, infoservice_request_id) = 1)
);

create table if not exists public.discovery_report_private (
  id uuid primary key default gen_random_uuid(),
  discovery_run_id uuid not null unique references public.discovery_runs(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  full_report jsonb not null,
  created_at timestamptz not null default now()
);

create table if not exists public.infoservice_attachments (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references public.infoservice_requests(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  storage_path text not null unique,
  file_name text not null, mime_type text,
  size_bytes bigint not null check (size_bytes >= 0),
  created_at timestamptz not null default now()
);

-- Grants
grant select, update on public.profiles to authenticated;
grant select, insert, update, delete on public.user_roles to authenticated;
grant select, insert, update on public.info_discovery_requests to authenticated;
grant select, insert, update on public.infoservice_requests to authenticated;
grant select, insert on public.discovery_runs to authenticated;
grant select, insert, update, delete on public.invoices to authenticated;
grant select, insert, update, delete on public.payment_records to authenticated;
grant select, insert, update, delete on public.reports to authenticated;
grant select, insert on public.request_activity to authenticated;
grant select, insert on public.infoservice_attachments to authenticated;
grant all on public.profiles, public.user_roles, public.info_discovery_requests, public.infoservice_requests, public.discovery_runs, public.invoices, public.payment_records, public.reports, public.request_activity, public.discovery_report_private, public.infoservice_attachments to service_role;
revoke all on public.discovery_report_private from anon, authenticated;

create index if not exists discovery_user_created_idx on public.info_discovery_requests(user_id, created_at desc);
create index if not exists infoservice_user_created_idx on public.infoservice_requests(user_id, created_at desc);
create index if not exists reports_user_status_idx on public.reports(user_id, status);
create index if not exists invoices_user_status_idx on public.invoices(user_id, status);
create index if not exists activity_discovery_idx on public.request_activity(discovery_request_id, created_at desc);
create index if not exists activity_infoservice_idx on public.request_activity(infoservice_request_id, created_at desc);
create index if not exists discovery_runs_user_created_idx on public.discovery_runs(user_id, created_at desc);
create index if not exists infoservice_attachments_request_idx on public.infoservice_attachments(request_id, created_at);

alter table public.profiles enable row level security;
alter table public.user_roles enable row level security;
alter table public.info_discovery_requests enable row level security;
alter table public.infoservice_requests enable row level security;
alter table public.discovery_runs enable row level security;
alter table public.invoices enable row level security;
alter table public.payment_records enable row level security;
alter table public.reports enable row level security;
alter table public.request_activity enable row level security;
alter table public.discovery_report_private enable row level security;
alter table public.infoservice_attachments enable row level security;

create policy "Profile owner or staff read" on public.profiles for select to authenticated using (id = auth.uid() or public.has_staff_role());
create policy "Profile owner update" on public.profiles for update to authenticated using (id = auth.uid()) with check (id = auth.uid());
create policy "Role owner or staff read" on public.user_roles for select to authenticated using (user_id = auth.uid() or public.has_staff_role());
create policy "Only admins manage roles" on public.user_roles for all to authenticated using (public.has_admin_role()) with check (public.has_admin_role());
create policy "Customers create discovery requests" on public.info_discovery_requests for insert to authenticated with check (user_id = auth.uid());
create policy "Customers and staff read discovery requests" on public.info_discovery_requests for select to authenticated using (user_id = auth.uid() or public.has_staff_role());
create policy "Staff update discovery requests" on public.info_discovery_requests for update to authenticated using (public.has_staff_role()) with check (public.has_staff_role());
create policy "Customers create infoservice requests" on public.infoservice_requests for insert to authenticated with check (user_id = auth.uid());
create policy "Customers and staff read infoservice requests" on public.infoservice_requests for select to authenticated using (user_id = auth.uid() or public.has_staff_role());
create policy "Staff update infoservice requests" on public.infoservice_requests for update to authenticated using (public.has_staff_role()) with check (public.has_staff_role());
create policy "Customers read own discovery runs" on public.discovery_runs for select to authenticated using (user_id = auth.uid());
create policy "Customers create own discovery runs" on public.discovery_runs for insert to authenticated with check (user_id = auth.uid());
create policy "Staff read discovery runs" on public.discovery_runs for select to authenticated using (public.has_staff_role());
create policy "Customer or staff read invoices" on public.invoices for select to authenticated using (user_id = auth.uid() or public.has_staff_role());
create policy "Staff manage invoices" on public.invoices for all to authenticated using (public.has_staff_role()) with check (public.has_staff_role());
create policy "Customer or staff read payment records" on public.payment_records for select to authenticated using (user_id = auth.uid() or public.has_staff_role());
create policy "Staff manage payment records" on public.payment_records for all to authenticated using (public.has_staff_role()) with check (public.has_staff_role());
create policy "Customer reads released reports and staff read all" on public.reports for select to authenticated using ((user_id = auth.uid() and status = 'released') or public.has_staff_role());
create policy "Staff manage reports" on public.reports for all to authenticated using (public.has_staff_role()) with check (public.has_staff_role());
create policy "Customer or staff read request activity" on public.request_activity for select to authenticated using ((user_id = auth.uid() and visible_to_customer) or public.has_staff_role());
create policy "Staff create request activity" on public.request_activity for insert to authenticated with check (public.has_staff_role());
create policy "Customers and staff read InfoService attachments" on public.infoservice_attachments for select to authenticated using (user_id = auth.uid() or public.has_staff_role());
create policy "Customers add files to their own InfoService requests" on public.infoservice_attachments for insert to authenticated
  with check (user_id = auth.uid()
    and exists (select 1 from public.infoservice_requests r where r.id = request_id and r.user_id = auth.uid())
    and exists (select 1 from storage.objects o where o.bucket_id = 'infoservice-attachments' and o.name = storage_path));

create policy "Users read their own report files" on storage.objects for select to authenticated
  using (bucket_id = 'information-reports' and (public.has_staff_role() or (storage.foldername(name))[1] = auth.uid()::text));
create policy "Staff upload report files" on storage.objects for insert to authenticated
  with check (bucket_id = 'information-reports' and public.has_staff_role());
create policy "Staff update report files" on storage.objects for update to authenticated
  using (bucket_id = 'information-reports' and public.has_staff_role())
  with check (bucket_id = 'information-reports' and public.has_staff_role());
create policy "Customers upload files for their own InfoService requests" on storage.objects for insert to authenticated
  with check (bucket_id = 'infoservice-attachments' and (storage.foldername(name))[1] = auth.uid()::text
    and exists (select 1 from public.infoservice_requests r where r.id::text = (storage.foldername(name))[2] and r.user_id = auth.uid()));
create policy "Customers and staff read InfoService request files" on storage.objects for select to authenticated
  using (bucket_id = 'infoservice-attachments' and (public.has_staff_role() or (storage.foldername(name))[1] = auth.uid()::text));

create or replace function public.confirm_manual_invoice_payment(p_invoice_id uuid, p_provider_reference text default null)
returns void language plpgsql security definer set search_path = public
as $$
declare inv public.invoices%rowtype; payment_ref text;
begin
  if not public.has_staff_role() then raise exception 'Staff access required'; end if;
  select * into inv from public.invoices where id = p_invoice_id for update;
  if not found then raise exception 'Invoice not found'; end if;
  if inv.status = 'void' then raise exception 'A void invoice cannot be paid'; end if;
  if inv.status = 'paid' then return; end if;
  payment_ref := coalesce(nullif(p_provider_reference,''), 'MANUAL-' || inv.id::text);
  insert into public.payment_records(invoice_id,user_id,provider,provider_reference,amount,currency,status,confirmed_at)
  values(inv.id,inv.user_id,'manual',payment_ref,inv.amount,inv.currency,'succeeded',now())
  on conflict (provider_reference) do nothing;
  update public.invoices set status='paid',updated_at=now() where id=inv.id;
  if inv.discovery_request_id is not null then
    update public.info_discovery_requests set status='paid',updated_at=now() where id=inv.discovery_request_id;
  elsif inv.infoservice_request_id is not null then
    update public.infoservice_requests set status='paid',updated_at=now() where id=inv.infoservice_request_id;
  end if;
end;
$$;
grant execute on function public.confirm_manual_invoice_payment(uuid, text) to authenticated;

create or replace function public.enforce_report_release_payment()
returns trigger language plpgsql security definer set search_path = public
as $$
declare invoice_status text;
begin
  if new.status = 'released' and new.invoice_id is not null then
    select status into invoice_status from public.invoices where id = new.invoice_id and user_id = new.user_id;
    if invoice_status is distinct from 'paid' then
      raise exception 'The linked invoice must be paid before this report can be released';
    end if;
  end if;
  return new;
end;
$$;
create trigger reports_require_paid_invoice before insert or update of status, invoice_id on public.reports
for each row execute procedure public.enforce_report_release_payment();