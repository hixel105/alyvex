import type {
  Bot,
  SiteContent,
  Announcement,
  SiteSettings,
  OwnerLog,
  Stats,
} from "./types";

const FUNCTION_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/owner-api`;
const ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
const REQUEST_TIMEOUT_MS = 15000;

function getToken(): string | null {
  return localStorage.getItem("alyvex_owner_token");
}

async function parseResponse(res: Response): Promise<unknown> {
  const text = await res.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

function friendlyError(status: number, serverMsg?: string): string {
  if (status === 0 || status === -1) {
    return "Error de conexion con el servidor. Intenta nuevamente.";
  }
  if (status === 401) {
    return serverMsg ?? "Contraseña incorrecta.";
  }
  if (status === 429) {
    return serverMsg ?? "Demasiados intentos. Intenta de nuevo mas tarde.";
  }
  if (status === 503) {
    return serverMsg ?? "Error de configuracion en el servidor: faltan variables de entorno.";
  }
  if (status >= 500) {
    return serverMsg ?? "Error interno del servidor. Intenta nuevamente.";
  }
  return serverMsg ?? `Error ${status}`;
}

async function fetchWithTimeout(
  url: string,
  options: RequestInit,
): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") {
      throw new Error("La peticion tardo demasiado. Intenta nuevamente.");
    }
    throw new Error("Error de conexion con el servidor. Intenta nuevamente.");
  } finally {
    clearTimeout(timer);
  }
}

async function adminFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
    apikey: ANON_KEY,
  };
  const res = await fetchWithTimeout(`${FUNCTION_URL}${path}`, { ...options, headers });
  const data = (await parseResponse(res)) as { error?: string } | null;
  if (!res.ok) {
    throw new Error(friendlyError(res.status, data?.error));
  }
  return data as T;
}

export const api = {
  async login(password: string): Promise<{ token: string }> {
    const res = await fetchWithTimeout(`${FUNCTION_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: ANON_KEY,
      },
      body: JSON.stringify({ password }),
    });
    const data = (await parseResponse(res)) as { token?: string; error?: string } | null;
    if (!res.ok) {
      throw new Error(friendlyError(res.status, data?.error));
    }
    if (!data?.token) {
      throw new Error("El servidor no devolvio una sesion valida.");
    }
    localStorage.setItem("alyvex_owner_token", data.token);
    return { token: data.token };
  },

  async validate(): Promise<{ valid: boolean }> {
    try {
      return await adminFetch("/validate", { method: "POST" });
    } catch {
      return { valid: false };
    }
  },

  async logout(): Promise<void> {
    try {
      await adminFetch("/logout", { method: "POST" });
    } catch {
      // ignore network errors on logout
    }
    localStorage.removeItem("alyvex_owner_token");
  },

  // ── Bots ──────────────────────────────────────────────
  async getBots(): Promise<Bot[]> {
    return adminFetch("/bots");
  },
  async createBot(bot: Partial<Bot>): Promise<Bot> {
    return adminFetch("/bots", {
      method: "POST",
      body: JSON.stringify(bot),
    });
  },
  async updateBot(id: string, updates: Partial<Bot>): Promise<Bot> {
    return adminFetch(`/bots/${id}`, {
      method: "PUT",
      body: JSON.stringify(updates),
    });
  },
  async deleteBot(id: string): Promise<void> {
    await adminFetch(`/bots/${id}`, { method: "DELETE" });
  },

  // ── Content ───────────────────────────────────────────
  async getContent(): Promise<SiteContent> {
    return adminFetch("/content");
  },
  async updateContent(key: string, value: unknown): Promise<void> {
    await adminFetch(`/content/${key}`, {
      method: "PUT",
      body: JSON.stringify({ value }),
    });
  },

  // ── Announcements ─────────────────────────────────────
  async getAnnouncements(): Promise<Announcement[]> {
    return adminFetch("/announcements");
  },
  async createAnnouncement(a: Partial<Announcement>): Promise<Announcement> {
    return adminFetch("/announcements", {
      method: "POST",
      body: JSON.stringify(a),
    });
  },
  async updateAnnouncement(
    id: string,
    updates: Partial<Announcement>,
  ): Promise<Announcement> {
    return adminFetch(`/announcements/${id}`, {
      method: "PUT",
      body: JSON.stringify(updates),
    });
  },
  async deleteAnnouncement(id: string): Promise<void> {
    await adminFetch(`/announcements/${id}`, { method: "DELETE" });
  },

  // ── Settings ──────────────────────────────────────────
  async getSettings(): Promise<SiteSettings> {
    return adminFetch("/settings");
  },
  async updateSettings(updates: Partial<SiteSettings>): Promise<SiteSettings> {
    return adminFetch("/settings", {
      method: "PUT",
      body: JSON.stringify(updates),
    });
  },

  // ── Logs ──────────────────────────────────────────────
  async getLogs(limit = 100): Promise<OwnerLog[]> {
    return adminFetch(`/logs?limit=${limit}`);
  },

  // ── Stats ─────────────────────────────────────────────
  async getStats(): Promise<Stats> {
    return adminFetch("/stats");
  },
};
