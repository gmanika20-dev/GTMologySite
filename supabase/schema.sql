-- GTMology database (Supabase / PostgreSQL). Run once in Supabase → SQL Editor.
-- Simplified from Step 1 doc 05: Lab answers, diagnosis and formula are stored as JSONB on lab_sessions.

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  name text, company text, website text, role text, company_stage text, industry text,
  utm jsonb, consent_marketing boolean default false,
  created_at timestamptz default now(), updated_at timestamptz default now()
);

create table if not exists public.lab_sessions (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid references public.leads(id) on delete cascade,
  status text default 'complete',            -- complete | emailed
  intake jsonb, answers jsonb, follow_ups jsonb,
  scores jsonb, primary_issue text, formula jsonb,
  entry_source text,
  created_at timestamptz default now()
);

create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid references public.leads(id) on delete cascade,
  session_id uuid references public.lab_sessions(id) on delete set null,
  status text default 'requested',            -- requested | booked | rescheduled | cancelled | completed
  service text, problem text, preferred_times text,
  cal_booking_uid text, starts_at timestamptz, meeting_url text,
  source text,
  created_at timestamptz default now()
);

create table if not exists public.email_log (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid references public.leads(id) on delete cascade,
  template text, status text, provider_id text,
  created_at timestamptz default now()
);

-- Row-Level Security: on for every table. The website writes with the service-role key (server only),
-- so no public policies are needed — the anon key can neither read nor write.
alter table public.leads enable row level security;
alter table public.lab_sessions enable row level security;
alter table public.bookings enable row level security;
alter table public.email_log enable row level security;

create index if not exists lab_sessions_lead_idx on public.lab_sessions(lead_id);
create index if not exists bookings_lead_idx on public.bookings(lead_id);
