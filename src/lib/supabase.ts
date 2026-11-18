type AuthSession = {
  access_token: string;
  refresh_token: string;
  expires_at?: number;
  expires_in?: number;
  token_type?: string;
  user?: any;
};

const projectUrl = String(import.meta.env.VITE_SUPABASE_URL || "").replace(/\/$/, "");
const anonKey = String(import.meta.env.VITE_SUPABASE_ANON_KEY || "");
const SESSION_KEY = "amineva-information-solutions-session";

const readSession = (): AuthSession | null => {
  if (typeof window === "undefined") return null;
  try { return JSON.parse(window.localStorage.getItem(SESSION_KEY) || "null"); }
  catch { return null; }
};

const saveSession = (session: AuthSession | null) => {
  if (typeof window === "undefined") return;
  if (session) window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  else window.localStorage.removeItem(SESSION_KEY);
};

const ensureConfig = () => {
  if (!projectUrl || !anonKey) {
    throw new Error("Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in Lovable Cloud.");
  }
};

const rawRequest = async (path: string, init: RequestInit = {}, token?: string) => {
  ensureConfig();
  const response = await fetch(`${projectUrl}${path}`, {
    ...init,
    headers: {
      apikey: anonKey,
      Authorization: `Bearer ${token || anonKey}`,
      "Content-Type": "application/json",
      ...(init.headers || {}),
    },
  });
  const body = response.status === 204 ? null : await response.json().catch(() => null);
  if (!response.ok) throw new Error(body?.msg || body?.message || body?.error_description || body?.error || `Supabase request failed (${response.status})`);
  return body;
};

const accessToken = async (): Promise<string | undefined> => {
  const session = readSession();
  if (!session) return undefined;
  const expiry = session.expires_at || (session.expires_in ? Math.floor(Date.now() / 1000) + session.expires_in : 0);
  if (expiry && expiry < Math.floor(Date.now() / 1000) + 60 && session.refresh_token) {
    try {
      const refreshed = await rawRequest("/auth/v1/token?grant_type=refresh_token", {
        method: "POST", body: JSON.stringify({ refresh_token: session.refresh_token }),
      });
      saveSession({ ...refreshed, expires_at: Math.floor(Date.now() / 1000) + (refreshed.expires_in || 3600) });
      return refreshed.access_token;
    } catch {
      saveSession(null);
      return undefined;
    }
  }
  return session.access_token;
};

const authCall = async (path: string, init: RequestInit = {}) => {
  const result = await rawRequest(`/auth/v1${path}`, init, await accessToken());
  if (result?.access_token) {
    saveSession({ ...result, expires_at: Math.floor(Date.now() / 1000) + (result.expires_in || 3600) });
  }
  return result;
};

const auth = {
  signUp: async ({ email, password, options }: any) => {
    try {
      const data = await authCall("/signup", {
        method: "POST",
        body: JSON.stringify({ email, password, data: options?.data || {} }),
      });
      if (data?.session) saveSession({ ...data.session, user: data.user });
      return { data, error: null };
    } catch (error: any) { return { data: { user: null, session: null }, error }; }
  },
  signInWithPassword: async ({ email, password }: { email: string; password: string }) => {
    try {
      const data = await authCall("/token?grant_type=password", {
        method: "POST", body: JSON.stringify({ email, password }),
      });
      saveSession({ ...data, expires_at: Math.floor(Date.now() / 1000) + (data.expires_in || 3600) });
      return { data: { ...data, session: data }, error: null };
    } catch (error: any) { return { data: { user: null, session: null }, error }; }
  },
  signOut: async () => {
    try {
      const token = await accessToken();
      if (token) await rawRequest("/auth/v1/logout", { method: "POST" }, token);
      saveSession(null);
      return { error: null };
    } catch (error: any) { saveSession(null); return { error }; }
  },
  getUser: async () => {
    try {
      const token = await accessToken();
      if (!token) return { data: { user: null }, error: new Error("Not authenticated") };
      const user = await rawRequest("/auth/v1/user", { method: "GET" }, token);
      return { data: { user }, error: null };
    } catch (error: any) { return { data: { user: null }, error }; }
  },
  signInWithOAuth: async ({ provider, options }: any) => {
    try {
      ensureConfig();
      const url = new URL(`${projectUrl}/auth/v1/authorize`);
      url.searchParams.set("provider", provider);
      if (options?.redirectTo) url.searchParams.set("redirect_to", options.redirectTo);
      window.location.assign(url.toString());
      return { error: null };
    } catch (error: any) { return { error }; }
  },
  resetPasswordForEmail: async (email: string, options: any = {}) => {
    try {
      await authCall(`/recover${options.redirectTo ? `?redirect_to=${encodeURIComponent(options.redirectTo)}` : ""}`, {
        method: "POST", body: JSON.stringify({ email }),
      });
      return { error: null };
    } catch (error: any) { return { error }; }
  },
  updateUser: async (attributes: Record<string, unknown>) => {
    try {
      const data = await authCall("/user", { method: "PUT", body: JSON.stringify(attributes) });
      return { data: { user: data }, error: null };
    } catch (error: any) { return { data: { user: null }, error }; }
  },
};

const from = (table: string) => {
  const filters: string[] = [];
  let columns = "*";
  return {
    select(selection = "*") { columns = selection; return this; },
    eq(column: string, value: string) {
      filters.push(`${encodeURIComponent(column)}=eq.${encodeURIComponent(value)}`);
      return this;
    },
    async maybeSingle() {
      try {
        const token = await accessToken();
        if (!token) throw new Error("Not authenticated");
        const query = [`select=${encodeURIComponent(columns)}`, ...filters, "limit=1"].join("&");
        const rows = await rawRequest(`/rest/v1/${encodeURIComponent(table)}?${query}`, { method: "GET" }, token);
        return { data: Array.isArray(rows) ? (rows[0] || null) : rows, error: null };
      } catch (error: any) { return { data: null, error }; }
    },
  };
};

export const supabase = { auth, from };
