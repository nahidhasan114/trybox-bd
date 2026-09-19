-- মাসভিত্তিক অর্ডারের হিসাব + পুরনো মাসের অর্ডার ডিলিট (হিসাব রেখে)

create table if not exists public.monthly_order_summaries (
  month date primary key,
  total_orders int not null default 0,
  delivered_orders int not null default 0,
  cancelled_orders int not null default 0,
  revenue numeric not null default 0,
  archived_at timestamptz not null default now()
);

alter table public.monthly_order_summaries enable row level security;

drop policy if exists "staff read monthly summaries" on public.monthly_order_summaries;
create policy "staff read monthly summaries" on public.monthly_order_summaries
  for select to authenticated
  using (public.is_staff());

create or replace function public.get_monthly_order_stats()
returns table (
  month date,
  total_orders int,
  delivered_orders int,
  cancelled_orders int,
  revenue numeric,
  archived boolean
)
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_staff() then
    raise exception 'Unauthorized';
  end if;

  return query
  with live as (
    select
      date_trunc('month', o.created_at at time zone 'Asia/Dhaka')::date as m,
      count(*)::int as t,
      (count(*) filter (where o.status = 'delivered'))::int as d,
      (count(*) filter (where o.status = 'cancelled'))::int as c,
      coalesce(sum(o.total_amount) filter (where o.status = 'delivered'), 0)::numeric as r
    from public.orders o
    group by 1
  ),
  combined as (
    select m, t, d, c, r, false as a from live
    union all
    select s.month, s.total_orders, s.delivered_orders, s.cancelled_orders, s.revenue, true
    from public.monthly_order_summaries s
  )
  select
    combined.m,
    sum(combined.t)::int,
    sum(combined.d)::int,
    sum(combined.c)::int,
    sum(combined.r)::numeric,
    bool_or(combined.a)
  from combined
  group by combined.m
  order by combined.m desc;
end;
$$;

create or replace function public.archive_and_delete_month(p_month date)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_month date := date_trunc('month', p_month)::date;
  v_start timestamptz;
  v_end timestamptz;
  v_ids uuid[];
  v_total int;
  v_delivered int;
  v_cancelled int;
  v_revenue numeric;
  v_active int;
begin
  if not public.is_owner() then
    raise exception 'শুধু Owner এটা করতে পারবেন';
  end if;

  if v_month >= date_trunc('month', now() at time zone 'Asia/Dhaka')::date then
    raise exception 'চলতি মাসের অর্ডার ডিলিট করা যাবে না';
  end if;

  v_start := v_month::timestamp at time zone 'Asia/Dhaka';
  v_end := (v_month + interval '1 month')::timestamp at time zone 'Asia/Dhaka';

  select
    array_agg(id),
    count(*),
    count(*) filter (where status = 'delivered'),
    count(*) filter (where status = 'cancelled'),
    coalesce(sum(total_amount) filter (where status = 'delivered'), 0),
    count(*) filter (where status not in ('delivered', 'cancelled', 'returned'))
  into v_ids, v_total, v_delivered, v_cancelled, v_revenue, v_active
  from public.orders
  where created_at >= v_start and created_at < v_end;

  if v_total = 0 then
    raise exception 'এই মাসে কোনো অর্ডার নেই';
  end if;

  if v_active > 0 then
    raise exception 'এই মাসে এখনো % টি চলমান অর্ডার আছে — আগে সেগুলো ডেলিভারি/বাতিল করুন', v_active;
  end if;

  insert into public.monthly_order_summaries (month, total_orders, delivered_orders, cancelled_orders, revenue)
  values (v_month, v_total, v_delivered, v_cancelled, v_revenue)
  on conflict (month) do update set
    total_orders = public.monthly_order_summaries.total_orders + excluded.total_orders,
    delivered_orders = public.monthly_order_summaries.delivered_orders + excluded.delivered_orders,
    cancelled_orders = public.monthly_order_summaries.cancelled_orders + excluded.cancelled_orders,
    revenue = public.monthly_order_summaries.revenue + excluded.revenue,
    archived_at = now();

  delete from public.order_items where order_id = any(v_ids);
  delete from public.order_status_history where order_id = any(v_ids);
  delete from public.payments where order_id = any(v_ids);
  delete from public.orders where id = any(v_ids);

  return jsonb_build_object('deleted', v_total, 'month', v_month);
end;
$$;

revoke all on function public.get_monthly_order_stats() from public, anon;
revoke all on function public.archive_and_delete_month(date) from public, anon;
grant execute on function public.get_monthly_order_stats() to authenticated;
grant execute on function public.archive_and_delete_month(date) to authenticated;
