-- Correct weekly publishing: generate availability for the current Monday-Friday
-- week only. Future weeks remain unpublished until their Monday arrives.
-- Remove previously pre-generated future weeks/slots without deleting bookings.
update public.appointment_slots s
set published=false
where (s.starts_at at time zone 'UTC')::date >=
      (date_trunc('week', current_date)::date + 7)
  and not exists (
    select 1 from public.appointments a
    where a.slot_id=s.id and a.status not in ('cancelled','declined')
  );

delete from public.appointment_weekly_days
where week_start > date_trunc('week', current_date)::date;

-- Start a clean five-weekday rotation from the next weekly generation.
update public.appointment_weekday_rotation
set weekday_order=(select array_agg(d order by random()) from generate_series(1,5) d),
    next_position=1,
    updated_at=now()
where singleton=true;

create or replace function public.ensure_automatic_appointment_slots(p_until date default current_date)
returns void
language plpgsql security definer set search_path=public
as $$
declare
  v_week date := date_trunc('week', current_date)::date;
  v_order integer[];
  v_next integer;
  v_days integer[] := array[]::integer[];
  v_take integer;
  v_day integer;
  v_date date;
  v_state public.appointment_weekday_rotation%rowtype;
begin
  -- Do not generate future weeks, even when the public calendar requests
  -- a broad date range. The current week is published on demand.
  if exists(select 1 from public.appointment_weekly_days where week_start=v_week) then
    return;
  end if;

  select * into v_state from public.appointment_weekday_rotation
    where singleton=true for update;
  if not found then
    v_order := array(select d from generate_series(1,5) d order by random());
    v_next := 1;
    insert into public.appointment_weekday_rotation(singleton,weekday_order,next_position)
    values(true,v_order,v_next);
  else
    v_order := v_state.weekday_order;
    v_next := v_state.next_position;
  end if;

  while coalesce(array_length(v_days,1),0)<3 loop
    if v_next>5 then
      v_order := array(select d from generate_series(1,5) d order by random());
      v_next := 1;
    end if;
    v_take := least(3-coalesce(array_length(v_days,1),0),6-v_next);
    v_days := v_days || v_order[v_next:v_next+v_take-1];
    v_next := v_next+v_take;
  end loop;

  insert into public.appointment_weekly_days(week_start,selected_weekdays)
  values(v_week,v_days)
  on conflict(week_start) do nothing;

  foreach v_day in array v_days loop
    v_date := v_week+(v_day-1);
    if not exists(select 1 from public.appointment_day_blocks b where b.blocked_date=v_date) then
      insert into public.appointment_slots(starts_at,ends_at,capacity,published)
      select (v_date::timestamp+make_interval(hours=>h)) at time zone 'UTC',
             (v_date::timestamp+make_interval(hours=>h+2)) at time zone 'UTC',
             1,true
      from generate_series(9,15,2) h
      on conflict(starts_at,ends_at) do nothing;
    end if;
  end loop;

  update public.appointment_weekday_rotation
  set weekday_order=v_order,next_position=v_next,updated_at=now()
  where singleton=true;
end;
$$;

create or replace function public.get_public_appointment_slots(
  p_from timestamptz default now(),
  p_to timestamptz default now()+interval '60 days'
)
returns table(id uuid,starts_at timestamptz,ends_at timestamptz,remaining integer)
language plpgsql volatile security definer set search_path=public
as $$
begin
  perform public.ensure_automatic_appointment_slots(current_date);
  return query
    select s.id,s.starts_at,s.ends_at,
      greatest(0,s.capacity-count(a.id)::integer) as remaining
    from public.appointment_slots s
    left join public.appointments a
      on a.slot_id=s.id and a.status not in ('cancelled','declined')
    where s.published and s.starts_at>=p_from and s.starts_at<p_to
      and (s.starts_at at time zone 'UTC')::date
          between date_trunc('week',current_date)::date
              and date_trunc('week',current_date)::date+4
      and not exists(select 1 from public.appointment_day_blocks b
                     where b.blocked_date=(s.starts_at at time zone 'UTC')::date)
    group by s.id
    having s.capacity-count(a.id)::integer>0
    order by s.starts_at;
end;
$$;

grant execute on function public.get_public_appointment_slots(timestamptz,timestamptz) to anon,authenticated;
