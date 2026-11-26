-- AGBI InfoService request references, AI briefs and appointment notification tracking.
alter table public.infoservice_requests
 add column if not exists request_reference text not null default ('AGBI-'||upper(substr(replace(gen_random_uuid()::text,'-',''),1,10))),
 add column if not exists ai_brief jsonb;
create unique index if not exists infoservice_requests_reference_uidx on public.infoservice_requests(request_reference);
alter table public.appointments
 add column if not exists confirmation_email_sent_at timestamptz,
 add column if not exists reminder_email_sent_at timestamptz;

create or replace function public.save_infoservice_brief(p_request_id uuid,p_brief jsonb)
returns void language plpgsql security definer set search_path=public
as $$
begin
 if auth.uid() is null then raise exception 'Sign in required.'; end if;
 update public.infoservice_requests
 set ai_brief=p_brief
 where id=p_request_id and user_id=auth.uid();
 if not found then raise exception 'Request not found or access denied.'; end if;
end;
$$;
revoke all on function public.save_infoservice_brief(uuid,jsonb) from public;
grant execute on function public.save_infoservice_brief(uuid,jsonb) to authenticated;
grant execute on function public.save_infoservice_brief(uuid,jsonb) to anon;
