-- InfoService appointments, public intake, Paystack checkout and staff communications.
create extension if not exists pgcrypto;

create table if not exists public.appointment_slots (
 id uuid primary key default gen_random_uuid(),
 starts_at timestamptz not null,
 ends_at timestamptz not null,
 capacity integer not null default 1 check(capacity > 0),
 published boolean not null default true,
 created_by uuid references auth.users(id),
 created_at timestamptz not null default now(),
 check(ends_at > starts_at),
 unique(starts_at,ends_at)
);
create index if not exists appointment_slots_public_idx on public.appointment_slots(starts_at) where published;

create table if not exists public.appointments (
 id uuid primary key default gen_random_uuid(),
 slot_id uuid not null references public.appointment_slots(id),
 booking_type text not null check(booking_type in ('request_submission','consultation')),
 duration_minutes integer not null default 60 check(duration_minutes in (30,60,90,120)),
 full_name text not null,
 email text not null,
 phone text not null,
 service_category text,
 request_type text,
 description text not null,
 additional_information text,
 amount numeric(12,2) not null default 0 check(amount >= 0),
 currency text not null default 'USD',
 payment_status text not null default 'not_required' check(payment_status in ('not_required','pending','paid','failed','refunded')),
 payment_reference text unique,
 status text not null default 'pending' check(status in ('pending','confirmed','declined','cancelled','completed')),
 user_id uuid references auth.users(id) on delete set null,
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now()
);
create index if not exists appointments_slot_idx on public.appointments(slot_id,status);
create index if not exists appointments_email_idx on public.appointments(lower(email),created_at desc);

create table if not exists public.infoservice_messages (
 id uuid primary key default gen_random_uuid(),
 request_id uuid not null references public.infoservice_requests(id) on delete cascade,
 recipient_email text not null,
 subject text not null,
 body text not null,
 sent_by uuid not null references auth.users(id),
 provider_message_id text,
 sent_at timestamptz not null default now()
);

alter table public.infoservice_requests alter column user_id drop not null;
alter table public.infoservice_requests add column if not exists phone text;
alter table public.infoservice_requests add column if not exists request_type text;
alter table public.infoservice_requests add column if not exists request_summary text;

alter table public.appointment_slots enable row level security;
alter table public.appointments enable row level security;
alter table public.infoservice_messages enable row level security;

drop policy if exists "Staff manage appointment slots" on public.appointment_slots;
create policy "Staff manage appointment slots" on public.appointment_slots for all to authenticated using(public.has_staff_role()) with check(public.has_staff_role());
drop policy if exists "Staff read appointments" on public.appointments;
create policy "Staff read appointments" on public.appointments for select to authenticated using(public.has_staff_role());
drop policy if exists "Staff update appointments" on public.appointments;
create policy "Staff update appointments" on public.appointments for update to authenticated using(public.has_staff_role()) with check(public.has_staff_role());
drop policy if exists "Staff read service messages" on public.infoservice_messages;
create policy "Staff read service messages" on public.infoservice_messages for select to authenticated using(public.has_staff_role());

create or replace function public.get_public_appointment_slots(p_from timestamptz default now(), p_to timestamptz default now()+interval '60 days')
returns table(id uuid,starts_at timestamptz,ends_at timestamptz,remaining integer)
language sql stable security definer set search_path=public
as $$
 select s.id,s.starts_at,s.ends_at,greatest(0,s.capacity-count(a.id)::integer) as remaining
 from appointment_slots s left join appointments a on a.slot_id=s.id and a.status not in ('cancelled','declined')
 where s.published and s.starts_at>=p_from and s.starts_at<p_to
 group by s.id having s.capacity-count(a.id)::integer>0
 order by s.starts_at;
$$;

create or replace function public.submit_infoservice_request(
 p_full_name text,p_email text,p_category text,p_request_details text,
 p_request_type text default null,p_request_summary text default null,p_phone text default null
) returns uuid language plpgsql security definer set search_path=public
as $$
declare v_id uuid;
begin
 if length(trim(coalesce(p_full_name,'')))<2 or length(trim(coalesce(p_email,'')))<5 or length(trim(coalesce(p_request_details,'')))<20 then
  raise exception 'Please provide your name, valid email and a meaningful description.';
 end if;
 if p_category not in ('career_education','business_information','travel_relocation','info_report_verification') then raise exception 'Invalid service area.'; end if;
 insert into infoservice_requests(user_id,full_name,email,phone,category,request_type,request_summary,request_details,status)
 values(auth.uid(),trim(p_full_name),lower(trim(p_email)),nullif(trim(p_phone),''),p_category,nullif(trim(p_request_type),''),nullif(trim(p_request_summary),''),trim(p_request_details),'submitted')
 returning id into v_id;
 return v_id;
end; $$;

create or replace function public.create_appointment(
 p_slot_id uuid,p_booking_type text,p_duration_minutes integer,p_full_name text,p_email text,p_phone text,
 p_service_category text,p_request_type text,p_description text,p_additional_information text default null
) returns jsonb language plpgsql security definer set search_path=public
as $$
declare s appointment_slots%rowtype; v_count integer; v_id uuid; v_amount numeric;
begin
 if p_booking_type not in ('request_submission','consultation') then raise exception 'Invalid appointment type.'; end if;
 if p_duration_minutes not in (30,60,90,120) then raise exception 'Invalid consultation duration.'; end if;
 if length(trim(coalesce(p_full_name,'')))<2 or length(trim(coalesce(p_email,'')))<5 or length(trim(coalesce(p_phone,'')))<5 or length(trim(coalesce(p_description,'')))<10 then raise exception 'Complete all required contact and appointment details.'; end if;
 select * into s from appointment_slots where id=p_slot_id and published and starts_at>now() for update;
 if not found then raise exception 'This appointment time is no longer available. Please choose another.'; end if;
 select count(*) into v_count from appointments where slot_id=p_slot_id and status not in ('cancelled','declined');
 if v_count>=s.capacity then raise exception 'This appointment time has just been booked. Please choose another.'; end if;
 v_amount:=case when p_booking_type='consultation' then (50.0*p_duration_minutes/60.0) else 0 end;
 insert into appointments(slot_id,booking_type,duration_minutes,full_name,email,phone,service_category,request_type,description,additional_information,amount,currency,payment_status,status,user_id)
 values(p_slot_id,p_booking_type,p_duration_minutes,trim(p_full_name),lower(trim(p_email)),trim(p_phone),p_service_category,nullif(trim(p_request_type),''),trim(p_description),nullif(trim(p_additional_information),''),v_amount,'USD',case when v_amount>0 then 'pending' else 'not_required' end,case when v_amount>0 then 'pending' else 'confirmed' end,auth.uid())
 returning id into v_id;
 return jsonb_build_object('appointment_id',v_id,'amount',v_amount,'currency','USD','payment_required',v_amount>0);
end; $$;

grant execute on function public.get_public_appointment_slots(timestamptz,timestamptz) to anon,authenticated;
grant execute on function public.submit_infoservice_request(text,text,text,text,text,text,text) to anon,authenticated;
grant execute on function public.create_appointment(uuid,text,integer,text,text,text,text,text,text,text) to anon,authenticated;
