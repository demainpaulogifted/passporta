
-- PassPorta: lifetime course access and payment records
create extension if not exists pgcrypto;

create table if not exists public.course_payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  email text not null,
  reference text not null unique,
  amount_kobo integer not null default 500000
    check (amount_kobo = 500000),
  currency text not null default 'NGN'
    check (currency = 'NGN'),
  status text not null default 'pending'
    check (status in ('pending', 'success', 'failed')),
  paid_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.course_access (
  user_id uuid primary key references auth.users(id) on delete cascade,
  payment_reference text not null unique
    references public.course_payments(reference),
  granted_at timestamptz not null default now(),
  access_type text not null default 'lifetime'
    check (access_type = 'lifetime')
);

create table if not exists public.course_progress (
  user_id uuid not null references auth.users(id) on delete cascade,
  lesson_id text not null,
  completed boolean not null default false,
  updated_at timestamptz not null default now(),
  primary key (user_id, lesson_id)
);

alter table public.course_payments enable row level security;
alter table public.course_access enable row level security;
alter table public.course_progress enable row level security;

drop policy if exists "Users read their own payments"
on public.course_payments;

create policy "Users read their own payments"
on public.course_payments
for select
to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists "Users read their own course access"
on public.course_access;

create policy "Users read their own course access"
on public.course_access
for select
to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists "Users read their own progress"
on public.course_progress;

create policy "Users read their own progress"
on public.course_progress
for select
to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists "Users save their own progress"
on public.course_progress;

create policy "Users save their own progress"
on public.course_progress
for insert
to authenticated
with check ((select auth.uid()) = user_id);

drop policy if exists "Users update their own progress"
on public.course_progress;

create policy "Users update their own progress"
on public.course_progress
for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

-- Do not allow browser clients to create or modify payment/access records.
revoke insert, update, delete
on public.course_payments from anon, authenticated;

revoke insert, update, delete
on public.course_access from anon, authenticated;

grant select on public.course_payments to authenticated;
grant select on public.course_access to authenticated;
grant select, insert, update on public.course_progress to authenticated;
