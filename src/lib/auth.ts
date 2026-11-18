import { supabase } from "@/lib/supabase";

export interface LoginCredentials { email: string; password: string; }
export interface RegisterCredentials { email: string; password: string; name: string; }
export type UserRole = "admin" | "user";

// Preserve the legacy $id field for older dashboard components while the
// remaining data modules are migrated from Appwrite.
const withLegacyId = (user: any) => user ? { ...user, $id: user.id } : null;

export const loginUser = async ({ email, password }: LoginCredentials) => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  return error
    ? { success: false, data: { error: error.message }, status: 400 }
    : { success: true, data: data.session, status: 200 };
};

export const registerUser = async ({ email, password, name }: RegisterCredentials) => {
  const { data, error } = await supabase.auth.signUp({
    email, password, options: { data: { full_name: name } },
  });
  return error
    ? { success: false, data: { error: error.message }, status: 400 }
    : { success: true, data, status: 201 };
};

export const getCurrentUser = async () => {
  const { data, error } = await supabase.auth.getUser();
  return error ? null : withLegacyId(data.user);
};

export const getCurrentUserRole = async (userId: string): Promise<UserRole> => {
  const { data, error } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .maybeSingle();
  if (error) {
    if (import.meta.env.DEV) console.warn("[Auth] Role lookup failed:", error.message);
    return "user";
  }
  return data?.role === "admin" ? "admin" : "user";
};

export const isAdmin = async (): Promise<boolean> => {
  const user = await getCurrentUser();
  return user ? (await getCurrentUserRole(user.id)) === "admin" : false;
};

export const logoutUser = async () => {
  const { error } = await supabase.auth.signOut();
  return error ? { success: false, error: error.message } : { success: true };
};

export const sendPasswordRecovery = async (email: string) => {
  const redirectTo = `${window.location.origin}/reset-password`;
  const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
  return error ? { success: false, error: error.message } : { success: true };
};

export const resetPassword = async (_userId: string, _secret: string, password: string) => {
  const { error } = await supabase.auth.updateUser({ password });
  return error ? { success: false, error: error.message } : { success: true };
};
