-- Correct calendar generation: every week in the requested calendar horizon
-- receives exactly three selected Monday-Friday dates. All other dates,
-- including Saturday and Sunday, have no public slots and remain disabled.

-- Clear pre-generated future dates from the earlier all-days/future-weeks logic.
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

create or replace function public.ensure_automatic_appointment_slots(p_until date default (current_date + 90))
returns void
language plpgsql security definer set search_path=public
as $$
declare
  v_week date := date_trunc('week', current_date)::date;
  v_last_week date := date_trunc('week', coalesce(p_until,current_date+90))::date;
  v_order integer[];
  v_next integer;
  v_days integer[];
  v_take integer;
  v_day integer;
  v_date date;
  v_state public.appointment_weekday_rotation%rowtype;
begin
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

  while v_week <= v_last_week loop
    if not exists(select 1 from public.appointment_weekly_days w where w.week_start=v_week) then
      v_days := array[]::integer[];
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
      values(v_week,v_days) on conflict(week_start) do nothing;

      foreach v_day in array v_days loop
        v_date := v_week+(v_day-1);
        if v_date>=current_date
          and not exists(select 1 from public.appointment_day_blocks b where b.blocked_date=v_date) then
          insert into public.appointment_slots(starts_at,ends_at,capacity,published)
          select (v_date::timestamp+make_interval(hours=>h)) at time zone 'UTC',
                 (v_date::timestamp+make_interval(hours=>h+2)) at time zone 'UTC',
                 1,true
          from generate_series(9,15,2) h
          on conflict(starts_at,ends_at) do update set published=true;
        end if;
      end loop;
    end if;
    v_week:=v_week+7;
  end loop;

  update public.appointment_weekday_rotation
  set weekday_order=v_order,next_position=v_next,updated_at=now()
  where singleton=true;
end;
$$;

create or replace function public.get_public_appointment_slots(
  p_from timestamptz default now(),
  p_to timestamptz default now()+interval '90 days'
)
returns table(id uuid,starts_at timestamptz,ends_at timestamptz,remaining integer)
language plpgsql volatile security definer set search_path=public
as $$
begin
  perform public.ensure_automatic_appointment_slots(coalesce(p_to::date,current_date+90));
  return query
    select s.id,s.starts_at,s.ends_at,
      greatest(0,s.capacity-count(a.id)::integer) as remaining
    from public.appointment_slots s
    left join public.appointments a
      on a.slot_id=s.id and a.status not in ('cancelled','declined')
    where s.published and s.starts_at>=p_from and s.starts_at<p_to
      and extract(isodow from (s.starts_at at time zone 'UTC')) between 1 and 5
      and exists(
        select 1 from public.appointment_weekly_days w
        where w.week_start=date_trunc('week',(s.starts_at at time zone 'UTC'))::date
          and extract(isodow from (s.starts_at at time zone 'UTC'))=any(w.selected_weekdays)
      )
      and not exists(select 1 from public.appointment_day_blocks b
                     where b.blocked_date=(s.starts_at at time zone 'UTC')::date)
    group by s.id
    having s.capacity-count(a.id)::integer>0
    order by s.starts_at;
end;
$$;
grant execute on function public.get_public_appointment_slots(timestamptz,timestamptz) to anon,authenticated;
