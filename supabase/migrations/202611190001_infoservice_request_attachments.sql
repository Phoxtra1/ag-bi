-- Private supporting documents supplied with InfoService requests.
-- Files remain private and can be read by the request owner or authorized staff.

create table if not exists public.infoservice_attachments (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references public.infoservice_requests(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  storage_path text not null unique,
  file_name text not null,
  mime_type text,
  size_bytes bigint not null check (size_bytes >= 0),
  created_at timestamptz not null default now()
);

create index if not exists infoservice_attachments_request_idx
  on public.infoservice_attachments(request_id, created_at);

alter table public.infoservice_attachments enable row level security;

drop policy if exists "Customers and staff read InfoService attachments" on public.infoservice_attachments;
create policy "Customers and staff read InfoService attachments"
  on public.infoservice_attachments for select to authenticated
  using (user_id = auth.uid() or public.has_staff_role());

drop policy if exists "Customers add files to their own InfoService requests" on public.infoservice_attachments;
create policy "Customers add files to their own InfoService requests"
  on public.infoservice_attachments for insert to authenticated
  with check (
    user_id = auth.uid()
    and exists (
      select 1 from public.infoservice_requests r
      where r.id = request_id and r.user_id = auth.uid()
    )
    and exists (
      select 1 from storage.objects o
      where o.bucket_id = 'infoservice-attachments'
        and o.name = storage_path
    )
  );

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'infoservice-attachments',
  'infoservice-attachments',
  false,
  15728640,
  array[
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/heic',
    'image/heif'
  ]
)
on conflict (id) do update
set public = false,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Customers upload files for their own InfoService requests" on storage.objects;
create policy "Customers upload files for their own InfoService requests"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'infoservice-attachments'
    and (storage.foldername(name))[1] = auth.uid()::text
    and exists (
      select 1 from public.infoservice_requests r
      where r.id::text = (storage.foldername(name))[2]
        and r.user_id = auth.uid()
    )
  );

drop policy if exists "Customers and staff read InfoService request files" on storage.objects;
create policy "Customers and staff read InfoService request files"
  on storage.objects for select to authenticated
  using (
    bucket_id = 'infoservice-attachments'
    and (
      public.has_staff_role()
      or (storage.foldername(name))[1] = auth.uid()::text
    )
  );
