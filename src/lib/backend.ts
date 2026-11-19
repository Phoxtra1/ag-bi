export type AppUser = { id: string; email?: string; user_metadata?: Record<string, unknown> };
export type Session = { access_token: string; refresh_token: string; expires_in?: number; expires_at?: number; user: AppUser };
const BASE = String(import.meta.env.VITE_SUPABASE_URL || "").replace(/\/$/, "");
const KEY = String(import.meta.env.VITE_SUPABASE_ANON_KEY || "");
const STORAGE_KEY = "amineva-info-solutions-session";

function configured() {
  if (!BASE || !KEY) throw new Error("The platform backend is not configured yet. Add the Supabase URL and anon key in the deployment environment.");
}
export function getSession(): Session | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
    const hash = new URLSearchParams(location.hash.replace(/^#/, ""));
    const access_token = hash.get("access_token"), refresh_token = hash.get("refresh_token");
    if (access_token && refresh_token) {
      const expires_in = Number(hash.get("expires_in") || 3600);
      const session = { access_token, refresh_token, expires_in, expires_at: Math.floor(Date.now()/1000)+expires_in, user: { id: "" } };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
      history.replaceState({}, document.title, location.pathname + location.search);
      return session;
    }
  } catch { /* invalid local session */ }
  return null;
}
function saveSession(session: Session | null) {
  if (session) localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  else localStorage.removeItem(STORAGE_KEY);
}
async function refreshSession(): Promise<Session | null> {
  const current=getSession();
  if (!current?.refresh_token) return current;
  const result=await request("/auth/v1/token?grant_type=refresh_token",{method:"POST",body:JSON.stringify({refresh_token:current.refresh_token})},false);
  const next={...result,expires_at:Math.floor(Date.now()/1000)+(result.expires_in||3600)};
  saveSession(next); return next;
}
async function request(path:string,init:RequestInit={},useSession=true) {
  configured();
  let session=useSession?getSession():null;
  if (session?.expires_at && session.expires_at < Math.floor(Date.now()/1000)+45) {
    try { session=await refreshSession(); } catch { saveSession(null); session=null; }
  }
  const headers=new Headers(init.headers || {});
  headers.set("apikey",KEY);
  headers.set("Authorization",`Bearer ${session?.access_token || KEY}`);
  if (init.body && !(init.body instanceof FormData)) headers.set("Content-Type","application/json");
  const response=await fetch(BASE+path,{...init,headers});
  const body=response.status===204?null:await response.json().catch(()=>null);
  if(!response.ok) throw new Error(body?.msg||body?.message||body?.error_description||body?.error||`Request failed (${response.status})`);
  return body;
}
export const backend = {
  configured: () => Boolean(BASE && KEY),
  async signUp(email:string,password:string,fullName:string) {
    const redirect = encodeURIComponent(location.origin + "/login");
    const data=await request(`/auth/v1/signup?redirect_to=${redirect}`,{method:"POST",body:JSON.stringify({email,password,data:{full_name:fullName}})},false);
    if(data?.access_token) saveSession({...data,expires_at:Math.floor(Date.now()/1000)+(data.expires_in||3600)});
    return data;
  },
  async oauth(provider:"google"|"facebook") {\n    configured();\n    const redirect=encodeURIComponent(location.origin+location.pathname+location.search);\n    location.assign(`${BASE}/auth/v1/authorize?provider=${provider}&redirect_to=${redirect}&apikey=${KEY}`);\n  },\n  async signIn(email:string,password:string) {
    const data=await request("/auth/v1/token?grant_type=password",{method:"POST",body:JSON.stringify({email,password})},false);
    saveSession({...data,expires_at:Math.floor(Date.now()/1000)+(data.expires_in||3600)}); return data;
  },
  async resetPassword(email:string) {
    return request("/auth/v1/recover?redirect_to="+encodeURIComponent(location.origin+"/reset-password"),{method:"POST",body:JSON.stringify({email})},false);
  },
  async updatePassword(password:string) {
    const result=await request("/auth/v1/user",{method:"PUT",body:JSON.stringify({password})});
    return result;
  },
  async signOut() { const s=getSession(); if(s) await request("/auth/v1/logout",{method:"POST"}); saveSession(null); },
  async user():Promise<AppUser|null> {
    const params=new URLSearchParams(location.search);
    const tokenHash=params.get("token_hash"), verificationType=params.get("type");
    if(tokenHash && verificationType) {
      const verified=await request("/auth/v1/verify",{method:"POST",body:JSON.stringify({token_hash:tokenHash,type:verificationType})},false);
      if(verified?.access_token) saveSession({...verified,expires_at:Math.floor(Date.now()/1000)+(verified.expires_in||3600)});
      history.replaceState({},document.title,location.pathname);
    }
    const s=getSession(); if(!s) return null;
    if(!s.user?.id) { const user=await request("/auth/v1/user"); const next={...s,user}; saveSession(next); return user; }
    return s.user;
  },
  async table<T=any>(table:string,query:string="select=*"):Promise<T[]> {
    return request(`/rest/v1/${table}?${query}`);
  },
  async insert<T=any>(table:string,values:Record<string,unknown>|Record<string,unknown>[],select="*"):Promise<T[]> {
    return request(`/rest/v1/${table}?select=${encodeURIComponent(select)}`,{method:"POST",headers:{"Prefer":"return=representation"},body:JSON.stringify(values)});
  },
  async update<T=any>(table:string,filters:string,values:Record<string,unknown>):Promise<T[]> {
    return request(`/rest/v1/${table}?${filters}`,{method:"PATCH",headers:{"Prefer":"return=representation"},body:JSON.stringify(values)});
  },
  async rpc<T=any>(fn:string,args:Record<string,unknown>):Promise<T> {
    return request(`/rest/v1/rpc/${fn}`,{method:"POST",body:JSON.stringify(args)});
  },
  async discover(input:{question:string;context?:string|null;mode?:"general"|"sensitive"}) {
    const session=getSession();
    if(!session) throw new Error("Sign in to run and save an information discovery.");
    return request("/functions/v1/info-discovery",{method:"POST",body:JSON.stringify({action:"discover",...input})});
  },
  async unlockDiscovery(runId:string) {
    const session=getSession();
    if(!session) throw new Error("Sign in to unlock your report.");
    return request("/functions/v1/info-discovery",{method:"POST",body:JSON.stringify({action:"unlock",run_id:runId})});
  },
  async role(userId:string):Promise<string|null> {
    const rows=await request(`/rest/v1/user_roles?select=role&user_id=eq.${encodeURIComponent(userId)}&limit=1`);
    return rows?.[0]?.role || null;
  },
};
