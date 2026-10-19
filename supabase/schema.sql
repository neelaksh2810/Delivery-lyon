-- Already applied to the Supabase project "student-delivery-lyon" (cmmeaztwnfdbmqjfypaw).
-- Kept here so you can recreate the database in another project.

create table public.delivery_requests (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  service_type text not null check (service_type in (
    'parcel_residence','delivery_short','delivery_mid','delivery_long',
    'leboncoin_small','leboncoin_large','move_small','move_large')),
  customer_name text not null,
  customer_email text not null,
  customer_phone text not null,
  relay_shop text,
  residence text,
  pickup_address text,
  dropoff_address text,
  slot text not null,
  notes text,
  price_cents integer not null check (price_cents > 0),
  status text not null default 'pending_payment' check (status in (
    'pending_payment','paid','assigned','delivered','cancelled')),
  stripe_session_id text unique,
  rider_name text
);

create table public.rider_applications (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  full_name text not null,
  email text not null,
  phone text not null,
  school text,
  availability text,
  has_cargo_bike boolean not null default false,
  status text not null default 'new' check (status in ('new','contacted','approved','rejected'))
);

-- Row level security on, no public policies: only the server (service role key) reads or writes.
alter table public.delivery_requests enable row level security;
alter table public.rider_applications enable row level security;

create index delivery_requests_status_idx on public.delivery_requests (status, created_at desc);
