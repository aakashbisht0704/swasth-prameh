-- Diagnosis and Plans tables for AI pipeline

create table if not exists public.diagnosis (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  features jsonb not null,
  dosha text not null,
  probabilities jsonb not null,
  diet_recommendation text,
  lifestyle_recommendation text,
  remedies text,
  prognosis text,
  model_version text not null default 'v1.0',
  created_at timestamptz not null default now()
);

alter table public.diagnosis enable row level security;

-- Users can see their own diagnosis rows
drop policy if exists "diagnosis_select_own" on public.diagnosis;
create policy "diagnosis_select_own" on public.diagnosis
  for select using (auth.uid() = user_id);

-- Users can insert their own diagnosis rows
drop policy if exists "diagnosis_insert_own" on public.diagnosis;
create policy "diagnosis_insert_own" on public.diagnosis
  for insert with check (auth.uid() = user_id);

-- Admins can read all
drop policy if exists "diagnosis_admin_read" on public.diagnosis;
create policy "diagnosis_admin_read" on public.diagnosis
  for select using (
    exists (
      select 1 from auth.users u
      where u.id = auth.uid()
      and u.raw_user_meta_data->>'role' = 'admin'
    )
  );

create index if not exists idx_diagnosis_user_id on public.diagnosis(user_id);
create index if not exists idx_diagnosis_created_at on public.diagnosis(created_at);

-- Plans table
create table if not exists public.plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  diagnosis_id uuid references public.diagnosis(id) on delete set null,
  plan_json jsonb not null,
  summary text not null,
  created_at timestamptz not null default now()
);

alter table public.plans enable row level security;

drop policy if exists "plans_select_own" on public.plans;
create policy "plans_select_own" on public.plans
  for select using (auth.uid() = user_id);

drop policy if exists "plans_insert_own" on public.plans;
create policy "plans_insert_own" on public.plans
  for insert with check (auth.uid() = user_id);

drop policy if exists "plans_admin_read" on public.plans;
create policy "plans_admin_read" on public.plans
  for select using (
    exists (
      select 1 from auth.users u
      where u.id = auth.uid()
      and u.raw_user_meta_data->>'role' = 'admin'
    )
  );

create index if not exists idx_plans_user_id on public.plans(user_id);
create index if not exists idx_plans_created_at on public.plans(created_at);


