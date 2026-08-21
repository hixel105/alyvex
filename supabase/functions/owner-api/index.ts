import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const SESSION_TTL_MS = 24 * 60 * 60 * 1000;
const RATE_LIMIT_WINDOW_MS = 5 * 60 * 1000;
const RATE_LIMIT_MAX_ATTEMPTS = 5;

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function errorResp(message: string, status = 400): Response {
  return json({ error: message }, status);
}

async function hmacSign(data: string, secret: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(data));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function createToken(secret: string): Promise<string> {
  const payload = JSON.stringify({ exp: Date.now() + SESSION_TTL_MS });
  const b64 = btoa(payload);
  const sig = await hmacSign(b64, secret);
  return `${b64}.${sig}`;
}

async function verifyToken(token: string, secret: string): Promise<boolean> {
  try {
    const [b64, sig] = token.split(".");
    if (!b64 || !sig) return false;
    const expected = await hmacSign(b64, secret);
    if (sig !== expected) return false;
    const payload = JSON.parse(atob(b64));
    if (typeof payload.exp !== "number" || Date.now() > payload.exp) return false;
    return true;
  } catch {
    return false;
  }
}

function getAuth(req: Request): string | null {
  const h = req.headers.get("Authorization");
  if (!h) return null;
  const m = h.match(/^Bearer\s+(.+)$/);
  return m ? m[1] : null;
}

function getSecret(): string {
  return (
    Deno.env.get("SUPABASE_JWT_SECRET") ??
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ??
    Deno.env.get("SESSION_SECRET") ??
    "alyvex-fallback-secret-key-change-me"
  );
}

function getOwnerPassword(): string {
  return Deno.env.get("OWNER_PASSWORD") ?? "vsebasowner";
}

function getConfigError(): string | null {
  const url = Deno.env.get("SUPABASE_URL");
  const key = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !key) {
    return "Faltan variables de configuracion en el servidor (SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY).";
  }
  return null;
}

function createSupabaseClient() {
  const url = Deno.env.get("SUPABASE_URL");
  const key = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !key) return null;
  try {
    return createClient(url, key);
  } catch {
    return null;
  }
}

async function safeLog(
  supabase: ReturnType<typeof createSupabaseClient>,
  action: string,
  detail?: string,
  result = "success",
): Promise<void> {
  if (!supabase) return;
  try {
    await supabase.from("owner_logs").insert({ action, detail, result });
  } catch {
    // logging is best-effort
  }
}

function extractPath(url: URL): string {
  let p = url.pathname;
  // Strip common prefixes the Supabase edge function platform may include
  p = p.replace(/^\/functions\/v1\/owner-api\/?/, "");
  p = p.replace(/^\/owner-api\/?/, "");
  return p;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  const url = new URL(req.url);
  const path = extractPath(url);
  const segments = path.split("/").filter(Boolean);
  const route = segments[0] ?? "";
  const id = segments[1];
  const secret = getSecret();

  // ── LOGIN (no Supabase dependency required) ──────────────
  if (route === "login" && req.method === "POST") {
    try {
      const body = await req.json();
      const password = body?.password;
      if (typeof password !== "string" || !password) {
        return errorResp("Contraseña requerida", 400);
      }

      const ownerPassword = getOwnerPassword();
      const supabase = createSupabaseClient();
      const forwarded = req.headers.get("x-forwarded-for");
      const ip = forwarded ? forwarded.split(",")[0].trim() : "unknown";

      // Rate limiting (best-effort, non-blocking)
      if (supabase) {
        try {
          const since = new Date(Date.now() - RATE_LIMIT_WINDOW_MS).toISOString();
          const { data: recentFails } = await supabase
            .from("owner_logs")
            .select("id")
            .eq("action", "login_attempt")
            .eq("result", "failed")
            .gte("created_at", since)
            .limit(RATE_LIMIT_MAX_ATTEMPTS + 1);

          if (recentFails && recentFails.length >= RATE_LIMIT_MAX_ATTEMPTS) {
            await safeLog(supabase, "login_attempt", `ip=${ip}`, "rate_limited");
            return errorResp("Demasiados intentos. Intenta de nuevo más tarde.", 429);
          }
        } catch {
          // rate limiting failed, continue with login
        }
      }

      if (password !== ownerPassword) {
        await safeLog(supabase, "login_attempt", `ip=${ip}`, "failed");
        return errorResp("Contraseña incorrecta", 401);
      }

      const token = await createToken(secret);
      await safeLog(supabase, "login", `ip=${ip}`, "success");
      return json({ token });
    } catch (err) {
      console.error("Login error:", err);
      const configErr = getConfigError();
      if (configErr) {
        return errorResp(configErr, 503);
      }
      return errorResp("Error interno del servidor. Intenta nuevamente.", 500);
    }
  }

  // ── VALIDATE ─────────────────────────────────────────────
  if (route === "validate" && req.method === "POST") {
    const token = getAuth(req);
    if (!token) return json({ valid: false });
    const valid = await verifyToken(token, secret);
    return json({ valid });
  }

  // ── LOGOUT ───────────────────────────────────────────────
  if (route === "logout" && req.method === "POST") {
    const token = getAuth(req);
    if (token) {
      const supabase = createSupabaseClient();
      await safeLog(supabase, "logout", undefined, "success");
    }
    return json({ ok: true });
  }

  // ── AUTH GATE for all admin routes ───────────────────────
  const token = getAuth(req);
  if (!token || !(await verifyToken(token, secret))) {
    return errorResp("No autorizado", 401);
  }

  // All routes below require Supabase
  const configErr = getConfigError();
  if (configErr) {
    return errorResp(configErr, 503);
  }
  const supabase = createSupabaseClient();
  if (!supabase) {
    return errorResp("El sistema no esta configurado correctamente. Faltan variables de entorno.", 503);
  }

  try {
    // ── BOTS ─────────────────────────────────────────────────
    if (route === "bots") {
      if (req.method === "GET") {
        const { data, error: e } = await supabase
          .from("bots")
          .select("*")
          .order("sort_order", { ascending: true });
        if (e) return errorResp(e.message, 500);
        return json(data);
      }
      if (req.method === "POST") {
        const body = await req.json();
        const { data, error: e } = await supabase
          .from("bots")
          .insert({
            name: body.name,
            slug: body.slug ?? body.name.toLowerCase().replace(/\s+/g, "-"),
            description: body.description ?? "",
            image_url: body.image_url ?? null,
            invite_url: body.invite_url ?? "",
            status: body.status ?? "active",
            premium_description: body.premium_description ?? null,
            sort_order: body.sort_order ?? 0,
            is_visible: body.is_visible ?? true,
          })
          .select()
          .single();
        if (e) return errorResp(e.message, 500);
        await safeLog(supabase, "bot_create", `name=${body.name}`);
        return json(data);
      }
    }

    if (route === "bots" && id) {
      if (req.method === "PUT") {
        const body = await req.json();
        const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
        for (const k of [
          "name", "slug", "description", "image_url", "invite_url",
          "status", "premium_description", "sort_order", "is_visible",
        ]) {
          if (body[k] !== undefined) updates[k] = body[k];
        }
        const { data, error: e } = await supabase
          .from("bots")
          .update(updates)
          .eq("id", id)
          .select()
          .single();
        if (e) return errorResp(e.message, 500);
        await safeLog(supabase, "bot_update", `id=${id}`);
        return json(data);
      }
      if (req.method === "DELETE") {
        const { error: e } = await supabase.from("bots").delete().eq("id", id);
        if (e) return errorResp(e.message, 500);
        await safeLog(supabase, "bot_delete", `id=${id}`);
        return json({ ok: true });
      }
    }

    // ── CONTENT ──────────────────────────────────────────────
    if (route === "content") {
      if (req.method === "GET") {
        const { data, error: e } = await supabase
          .from("site_content")
          .select("*")
          .order("key", { ascending: true });
        if (e) return errorResp(e.message, 500);
        const obj: Record<string, unknown> = {};
        for (const row of data ?? []) obj[row.key] = row.value;
        return json(obj);
      }
      if (req.method === "PUT" && id) {
        const body = await req.json();
        const { data, error: e } = await supabase
          .from("site_content")
          .upsert(
            { key: id, value: body.value, updated_at: new Date().toISOString() },
            { onConflict: "key" },
          )
          .select()
          .single();
        if (e) return errorResp(e.message, 500);
        await safeLog(supabase, "content_update", `key=${id}`);
        return json(data);
      }
    }

    // ── ANNOUNCEMENTS ────────────────────────────────────────
    if (route === "announcements") {
      if (req.method === "GET") {
        const { data, error: e } = await supabase
          .from("announcements")
          .select("*")
          .order("priority", { ascending: false });
        if (e) return errorResp(e.message, 500);
        return json(data);
      }
      if (req.method === "POST") {
        const body = await req.json();
        const { data, error: e } = await supabase
          .from("announcements")
          .insert({
            title: body.title,
            message: body.message,
            priority: body.priority ?? 0,
            is_active: body.is_active ?? true,
          })
          .select()
          .single();
        if (e) return errorResp(e.message, 500);
        await safeLog(supabase, "announcement_create", `title=${body.title}`);
        return json(data);
      }
    }

    if (route === "announcements" && id) {
      if (req.method === "PUT") {
        const body = await req.json();
        const updates: Record<string, unknown> = {
          updated_at: new Date().toISOString(),
        };
        for (const k of ["title", "message", "priority", "is_active"]) {
          if (body[k] !== undefined) updates[k] = body[k];
        }
        const { data, error: e } = await supabase
          .from("announcements")
          .update(updates)
          .eq("id", id)
          .select()
          .single();
        if (e) return errorResp(e.message, 500);
        await safeLog(supabase, "announcement_update", `id=${id}`);
        return json(data);
      }
      if (req.method === "DELETE") {
        const { error: e } = await supabase
          .from("announcements")
          .delete()
          .eq("id", id);
        if (e) return errorResp(e.message, 500);
        await safeLog(supabase, "announcement_delete", `id=${id}`);
        return json({ ok: true });
      }
    }

    // ── SETTINGS ─────────────────────────────────────────────
    if (route === "settings") {
      if (req.method === "GET") {
        const { data, error: e } = await supabase
          .from("site_settings")
          .select("*")
          .eq("id", 1)
          .maybeSingle();
        if (e) return errorResp(e.message, 500);
        return json(data);
      }
      if (req.method === "PUT") {
        const body = await req.json();
        const updates: Record<string, unknown> = {
          updated_at: new Date().toISOString(),
        };
        if (body.maintenance_mode !== undefined)
          updates.maintenance_mode = body.maintenance_mode;
        if (body.maintenance_message !== undefined)
          updates.maintenance_message = body.maintenance_message;
        const { data, error: e } = await supabase
          .from("site_settings")
          .update(updates)
          .eq("id", 1)
          .select()
          .single();
        if (e) return errorResp(e.message, 500);
        await safeLog(
          supabase,
          body.maintenance_mode ? "maintenance_activate" : "maintenance_deactivate",
          body.maintenance_message ?? "",
        );
        return json(data);
      }
    }

    // ── LOGS ─────────────────────────────────────────────────
    if (route === "logs" && req.method === "GET") {
      const limit = parseInt(url.searchParams.get("limit") ?? "100");
      const { data, error: e } = await supabase
        .from("owner_logs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(limit);
      if (e) return errorResp(e.message, 500);
      return json(data);
    }

    // ── STATS ───────────────────────────────────────────────
    if (route === "stats" && req.method === "GET") {
      const [{ count: botCount }, { count: clickCount }, { count: announceCount }] =
        await Promise.all([
          supabase.from("bots").select("*", { count: "exact", head: true }),
          supabase.from("click_events").select("*", { count: "exact", head: true }),
          supabase
            .from("announcements")
            .select("*", { count: "exact", head: true })
            .eq("is_active", true),
        ]);

      let clicksByType: { type: string; count: number }[] = [];
      let clicksByBot: { bot_name: string; count: number }[] = [];
      try {
        const typeRes = await supabase.rpc("count_clicks_by_type");
        if (typeRes.data) clicksByType = typeRes.data;
        const botRes = await supabase.rpc("count_clicks_by_bot");
        if (botRes.data) clicksByBot = botRes.data;
      } catch {
        // RPC functions might not exist
      }

      return json({
        bots_published: botCount ?? 0,
        total_clicks: clickCount ?? 0,
        active_announcements: announceCount ?? 0,
        clicks_by_type: clicksByType,
        clicks_by_bot: clicksByBot,
      });
    }

    return errorResp("Ruta no encontrada", 404);
  } catch (err) {
    console.error("API error:", err);
    const cErr = getConfigError();
    if (cErr) {
      return errorResp(cErr, 503);
    }
    return errorResp("Error interno del servidor. Intenta nuevamente.", 500);
  }
});
