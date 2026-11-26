-- AGBI InfoService request references, AI briefs and appointment notification tracking.
alter table public.infoservice_requests
 add column if not exists request_reference text not null default ('AGBI-'||upper(substr(replace(gen_random_uuid()::text,'-',''),1,10))),
 add column if not exists ai_brief jsonb;
create unique index if not exists infoservice_requests_reference_uidx on public.infoservice_requests(request_reference);
alter table public.appointments
 add column if not exists confirmation_email_sent_at timestamptz,
 add column if not exists reminder_email_sent_at timestamptz;
