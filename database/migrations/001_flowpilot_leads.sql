-- Baseline schema for the application-owned lead model.
-- Apply through a reviewed Supabase migration; do not expose table reads to anon.
create extension if not exists pgcrypto;

create table if not exists public.flowpilot_leads (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 120),
  email text not null check (char_length(email) <= 320),
  company text not null check (char_length(company) between 2 and 160),
  message text not null check (char_length(message) between 10 and 4000),
  status text not null default 'New'
    check (status in ('New','Contacted','Qualified','Won','Lost')),
  notes text not null default '' check (char_length(notes) <= 3000),
  consent_at timestamptz not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.flowpilot_leads enable row level security;
-- No anon/authenticated policies are intentionally created here.
-- Access is mediated by authenticated, owner-authorized server functions.
