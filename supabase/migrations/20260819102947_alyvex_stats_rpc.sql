/*
# Stats RPC functions

## Overview
Creates two SECURITY DEFINER functions for aggregating click_events for the stats dashboard.

## New Functions
1. `count_clicks_by_type()` — returns counts grouped by click type (invite/premium/discord).
2. `count_clicks_by_bot()` — returns counts grouped by bot name for invite clicks.

## Security
- Both functions are SECURITY DEFINER so they can read click_events regardless of caller role.
- They only perform SELECTs (read-only aggregation).
*/

-- Drop existing functions if they exist (idempotent)
DROP FUNCTION IF EXISTS count_clicks_by_type();
DROP FUNCTION IF EXISTS count_clicks_by_bot();

CREATE OR REPLACE FUNCTION count_clicks_by_type()
RETURNS TABLE (type text, count bigint)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT type, COUNT(*)::bigint AS count
  FROM click_events
  GROUP BY type
  ORDER BY count DESC;
$$;

CREATE OR REPLACE FUNCTION count_clicks_by_bot()
RETURNS TABLE (bot_name text, count bigint)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(b.name, 'Unknown') AS bot_name, COUNT(*)::bigint AS count
  FROM click_events ce
  LEFT JOIN bots b ON ce.bot_id = b.id
  WHERE ce.type = 'invite'
  GROUP BY b.name
  ORDER BY count DESC;
$$;
