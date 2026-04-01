-- ─────────────────────────────────────────────────────────────────────────────
-- QBC 2025 — Supabase Database Setup
-- Paste this entire file into the Supabase SQL Editor and click Run.
-- ─────────────────────────────────────────────────────────────────────────────

-- 1. BUSINESSES
create table if not exists businesses (
  id           serial primary key,
  name         text not null,
  neighborhood text,
  type         text check (type in ('owned', 'allied')) default 'allied',
  emoji        text default '📍',
  about        text,
  active       boolean default true,
  sort_order   integer default 0
);

-- 2. PASSPORTS
create table if not exists passports (
  id           bigserial primary key,
  code         text unique not null,
  first_name   text not null,
  last_name    text,
  email        text not null,
  source       text,
  created_at   timestamptz default now()
);

-- 3. CHECKINS
create table if not exists checkins (
  id             bigserial primary key,
  passport_code  text references passports(code) on delete cascade,
  business_id    integer references businesses(id) on delete cascade,
  checked_in_at  timestamptz default now(),
  unique(passport_code, business_id)
);

-- ─────────────────────────────────────────────────────────────────────────────
-- SEED: Starting business list
-- Edit these rows anytime in the Supabase Table Editor — no code needed.
-- ─────────────────────────────────────────────────────────────────────────────
insert into businesses (name, neighborhood, type, emoji, about, sort_order) values
  ('Brave Books SLC',            '9th & 9th',        'owned',  '📚', 'An independent bookstore celebrating queer voices, trans authors, and LGBTQ+ stories.', 1),
  ('Velvet Underground Vintage', '9th & 9th',        'owned',  '👗', 'Curated vintage clothing and accessories with a queer eye for style.', 2),
  ('Gilded Cactus Bar',          'Sugar House',      'owned',  '🍹', 'A welcoming neighborhood bar with a full cocktail menu and regular community events.', 3),
  ('Bloom Florals',              'Sugar House',      'owned',  '🌸', 'Sustainable, locally-sourced floral arrangements for every occasion.', 4),
  ('Prism Print Studio',         'Granary District', 'owned',  '🖨', 'Screen printing, risograph, and design services with a community focus.', 5),
  ('Wild Honey Candle Co.',      'Granary District', 'owned',  '🕯', 'Hand-poured soy candles made in SLC. Every scent tells a Utah story.', 6),
  ('Copper & Kind Coffee',       'Downtown',         'allied', '☕', 'Specialty coffee shop committed to being a safe and affirming space for all.', 7),
  ('Spectrum Fitness SLC',       'Downtown',         'owned',  '💪', 'An inclusive gym where every body is welcome and celebrated.', 8),
  ('Saltair Salon Collective',   'Capitol Hill',     'owned',  '✂️', 'A worker-owned salon collective specializing in inclusive, affirming hair care.', 9),
  ('The Porch Kitchen',          'Millcreek',        'allied', '🍽', 'Farm-to-table comfort food with a menu that changes with the seasons.', 10),
  ('Red Mesa Ceramics',          'Millcreek',        'allied', '🏺', 'Hand-thrown ceramics, classes, and gallery space celebrating southwestern tradition.', 11),
  ('Pioneer Park Provisions',    'West Side',        'allied', '🧺', 'Local grocery and deli sourcing from Utah farms and producers.', 12)
on conflict do nothing;

-- ─────────────────────────────────────────────────────────────────────────────
-- ROW LEVEL SECURITY
-- Keeps data safe — public can read businesses, insert passports/checkins,
-- but can't delete or modify other people's records.
-- ─────────────────────────────────────────────────────────────────────────────
alter table businesses enable row level security;
alter table passports  enable row level security;
alter table checkins   enable row level security;

create policy "Public can read businesses"
  on businesses for select using (true);

create policy "Anyone can create a passport"
  on passports for insert with check (true);

create policy "Anyone can read their own passport"
  on passports for select using (true);

create policy "Anyone can create a checkin"
  on checkins for insert with check (true);

create policy "Anyone can read checkins"
  on checkins for select using (true);
