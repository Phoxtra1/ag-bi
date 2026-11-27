-- Automatic InfoService booking calendar.
-- Each week exposes three randomly rotated weekdays (Mon-Fri). The saved
-- rotation consumes all five weekdays before starting a fresh shuffled cycle.
-- Admins do not publish dates; they only manage bookings and can block dates
-- for exceptional events through appointment_day_blocks.

create table if not exists public.appointment_day_blocks (
  blocked_date date primary key,
  reason text,
  created_at timestamptz not null default now(),
  created_by uuid references auth.users(id)
);
alter table public.appointment_day_blocks enable row level security;
drop policy if exists "Staff manage appointment day blocks" on public.appointment_day_blocks;
create policy "Staff manage appointment day blocks"
  on public.appointment_day_blocks for all to authenticated
  using (public.has_staff_role()) with check (public.has_staff_role());

create table if not exists public.appointment_weekday_rotation (
  singleton boolean primary key default true check (singleton),
  weekday_order integer[] not null,
  next_position integer not null default 1 check (next_position between 1 and 6),
  updated_at timestamptz not null default now()
);
insert into public.appointment_weekday_rotation(singleton,weekday_order,next_position)
select true, array_agg(day order by random()), 1 from generate_series(1,5) day
on conflict (singleton) do nothing;

create table if not exists public.appointment_weekly_days (
  week_start date primary key,
  selected_weekdays integer[] not null,
  created_at timestamptz not null default now(),
  check (array_length(selected_weekdays,1)=3)
);
alter table public.appointment_weekly_days enable row level security;
drop policy if exists "Staff read generated booking weeks" on public.appointment_weekly_days;
create policy "Staff read generated booking weeks"
  on public.appointment_weekly_days for select to authenticated
  using (public.has_staff_role());

create or replace function public.ensure_automatic_appointment_slots(p_until date default (current_date + 90))
returns void
language plpgsql security definer set search_path=public
as $$
declare
  v_week date := date_trunc('week', current_date)::date;
  v_order integer[];
  v_next integer;
  v_days integer[];
  v_take integer;
  v_new_order integer[];
  v_day integer;
  v_date date;
  v_state public.appointment_weekday_rotation%rowtype;
begin
  select * into v_state from public.appointment_weekday_rotation
    where singleton=true for update;
  if not found then
    v_state.weekday_order := array(select d from generate_series(1,5) d order by random());
    v_state.next_position := 1;
    insert into public.appointment_weekday_rotation(singleton,weekday_order,next_position)
    values(true,v_state.weekday_order,1);
  end if;
  v_order := v_state.weekday_order;
  v_next := v_state.next_position;

  while v_week < p_until loop
    if not exists(select 1 from public.appointment_weekly_days w where w.week_start=v_week) then
      v_days := array[]::integer[];
      while coalesce(array_length(v_days,1),0) < 3 loop
        if v_next > 5 then
          v_order := array(select d from generate_series(1,5) d order by random());
          v_next := 1;
        end if;
        v_take := least(3-coalesce(array_length(v_days,1),0),6-v_next);
        v_days := v_days || v_order[v_next:v_next+v_take-1];
        v_next := v_next + v_take;
      end loop;

      insert into public.appointment_weekly_days(week_start,selected_weekdays)
      values(v_week,v_days);

      foreach v_day in array v_days loop
        v_date := v_week + (v_day-1);
        if not exists(select 1 from public.appointment_day_blocks b where b.blocked_date=v_date) then
          insert into public.appointment_slots(starts_at,ends_at,capacity,published)
          select (v_date::timestamp + make_interval(hours=>h)) at time zone 'UTC',
                 (v_date::timestamp + make_interval(hours=>h+2)) at time zone 'UTC',
                 1,true
          from generate_series(9,15,2) h
          on conflict(starts_at,ends_at) do nothing;
        end if;
      end loop;
    end if;
    v_week := v_week + 7;
  end loop;

  update public.appointment_weekday_rotation
    set weekday_order=v_order,next_position=v_next,updated_at=now()
    where singleton=true;
end;
$$;
revoke all on function public.ensure_automatic_appointment_slots(date) from public,anon,authenticated;

create or replace function public.get_public_appointment_slots(
  p_from timestamptz default now(),
  p_to timestamptz default now()+interval '60 days'
)
returns table(id uuid,starts_at timestamptz,ends_at timestamptz,remaining integer)
language plpgsql volatile security definer set search_path=public
as $$
begin
  perform public.ensure_automatic_appointment_slots(greatest(current_date,p_to::date));
  return query
    select s.id,s.starts_at,s.ends_at,
      greatest(0,s.capacity-count(a.id)::integer) as remaining
    from public.appointment_slots s
    left join public.appointments a
      on a.slot_id=s.id and a.status not in ('cancelled','declined')
    where s.published and s.starts_at>=p_from and s.starts_at<p_to
      and not exists(select 1 from public.appointment_day_blocks b
                     where b.blocked_date=(s.starts_at at time zone 'UTC')::date)
    group by s.id
    having s.capacity-count(a.id)::integer>0
    order by s.starts_at;
end;
$$;
grant execute on function public.get_public_appointment_slots(timestamptz,timestamptz) to anon,authenticated;
