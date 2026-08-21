/*
# Alyvex Community - Complete Schema

## Overview
Creates the full database schema for the Alyvex Community platform: a single-owner
Discord community site with public bot listings, premium info, announcements, and
a private owner panel for managing all content.

## New Tables
1. `bots` — Discord bots shown on the public site.
   - id (uuid PK), name, slug, description, image_url, invite_url, status (active/maintenance/offline),
     premium_description, sort_order, is_visible, created_at, updated_at.
2. `site_content` — editable key/value content for the public site (hero title, subtitle, etc.).
   - id (uuid PK), key (unique), value (jsonb), updated_at.
3. `announcements` — site-wide announcements with priority and active toggle.
   - id (uuid PK), title, message, priority (0-10), is_active, created_at, updated_at.
4. `owner_logs` — audit log of owner panel actions.
   - id (uuid PK), action, detail, result, created_at.
5. `site_settings` — single-row table for global settings (maintenance mode + message).
   - id (int PK, always 1), maintenance_mode (bool), maintenance_message (text).
6. `click_events` — anonymous click counter for stats (invite/premium/discord).
   - id (uuid PK), bot_id (nullable FK), type (invite/premium/discord), created_at.

## Security
- RLS enabled on ALL tables.
- Public read access (anon + authenticated) on bots, site_content, announcements, site_settings.
- Public insert on click_events (anon can record clicks for stats).
- All admin writes (INSERT/UPDATE/DELETE) are restricted to the service role only —
  the frontend never mutates data directly with the anon key; all mutations go through
  edge functions that validate the owner session and use the service role key.
- owner_logs is write-only via service role; readable only by service role (not exposed to anon).
*/

-- ============================================================
-- BOTS
-- ============================================================
CREATE TABLE IF NOT EXISTS bots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL,
  description text NOT NULL,
  image_url text,
  invite_url text NOT NULL,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'maintenance', 'offline')),
  premium_description text,
  sort_order int NOT NULL DEFAULT 0,
  is_visible boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE bots ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_bots" ON bots;
CREATE POLICY "public_read_bots" ON bots FOR SELECT
  TO anon, authenticated USING (true);

-- ============================================================
-- SITE CONTENT (editable key/value)
-- ============================================================
CREATE TABLE IF NOT EXISTS site_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value jsonb NOT NULL,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_content" ON site_content;
CREATE POLICY "public_read_content" ON site_content FOR SELECT
  TO anon, authenticated USING (true);

-- ============================================================
-- ANNOUNCEMENTS
-- ============================================================
CREATE TABLE IF NOT EXISTS announcements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  message text NOT NULL,
  priority int NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_announcements" ON announcements;
CREATE POLICY "public_read_announcements" ON announcements FOR SELECT
  TO anon, authenticated USING (true);

-- ============================================================
-- OWNER LOGS (audit trail)
-- ============================================================
CREATE TABLE IF NOT EXISTS owner_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  action text NOT NULL,
  detail text,
  result text NOT NULL DEFAULT 'success',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE owner_logs ENABLE ROW LEVEL SECURITY;

-- owner_logs: no anon/authenticated read; only service role can read/write

-- ============================================================
-- SITE SETTINGS (single row, id=1)
-- ============================================================
CREATE TABLE IF NOT EXISTS site_settings (
  id int PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  maintenance_mode boolean NOT NULL DEFAULT false,
  maintenance_message text NOT NULL DEFAULT 'Alyvex Community se encuentra en mantenimiento.',
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_settings" ON site_settings;
CREATE POLICY "public_read_settings" ON site_settings FOR SELECT
  TO anon, authenticated USING (true);

-- ============================================================
-- CLICK EVENTS (anonymous stats)
-- ============================================================
CREATE TABLE IF NOT EXISTS click_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bot_id uuid REFERENCES bots(id) ON DELETE SET NULL,
  type text NOT NULL CHECK (type IN ('invite', 'premium', 'discord')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE click_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_insert_clicks" ON click_events;
CREATE POLICY "public_insert_clicks" ON click_events FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "public_read_clicks" ON click_events;
CREATE POLICY "public_read_clicks" ON click_events FOR SELECT
  TO anon, authenticated USING (true);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_bots_sort ON bots(sort_order);
CREATE INDEX IF NOT EXISTS idx_bots_visible ON bots(is_visible);
CREATE INDEX IF NOT EXISTS idx_announcements_active ON announcements(is_active);
CREATE INDEX IF NOT EXISTS idx_click_events_type ON click_events(type);
CREATE INDEX IF NOT EXISTS idx_click_events_created ON click_events(created_at);
CREATE INDEX IF NOT EXISTS idx_owner_logs_created ON owner_logs(created_at);

-- ============================================================
-- SEED DATA
-- ============================================================

-- Site settings single row
INSERT INTO site_settings (id, maintenance_mode, maintenance_message)
VALUES (1, false, 'Alyvex Community se encuentra en mantenimiento.')
ON CONFLICT (id) DO NOTHING;

-- Default bots
INSERT INTO bots (name, slug, description, image_url, invite_url, status, sort_order, is_visible) VALUES
('YumekaiGuard', 'yumekaiguard', 'Bot de seguridad y protección para servidores de Discord.', NULL, 'https://discord.com/oauth2/authorize?client_id=1474703558678155406', 'active', 1, true),
('Bot Perro', 'bot-perro', 'Bot multifunción para mejorar y automatizar tu servidor de Discord.', NULL, 'https://discord.com/oauth2/authorize?client_id=1461074832212099173', 'active', 2, true),
('Nekomi', 'nekomi', 'Un bot de Discord diseñado para ofrecer herramientas y funciones para tu comunidad.', NULL, 'https://discord.com/oauth2/authorize?client_id=1531736888170385559', 'active', 3, true)
ON CONFLICT DO NOTHING;

-- Default site content
INSERT INTO site_content (key, value) VALUES
('hero_title', '"Alyvex Community"'::jsonb),
('hero_subtitle', '"Una comunidad creada para ofrecer bots, herramientas y servicios modernos para Discord."'::jsonb),
('premium_title', '"Alyvex Premium"'::jsonb),
('premium_description', '"Obtén funciones Premium para nuestros bots y disfruta de una experiencia mejorada."'::jsonb),
('premium_url', '"https://alyvex.tip4serv.com/"'::jsonb),
('discord_url', '"https://discord.gg/9yGwxX9CRW"'::jsonb),
('discord_title', '"Únete a nuestra comunidad de Discord"'::jsonb),
('discord_description', '"Conéctate con nuestra comunidad, obtén soporte y mantente al día con todas las novedades."'::jsonb),
('footer_tagline', '"Una comunidad para bots, herramientas y servicios de Discord."'::jsonb),
('bots_section_title', '"Nuestros Bots"'::jsonb),
('bots_section_description', '"Descubre los bots que Alyvex Community ofrece para mejorar tu servidor de Discord."'::jsonb)
ON CONFLICT (key) DO NOTHING;
