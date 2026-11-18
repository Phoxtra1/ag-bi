// Admin authentication utilities
import { supabase } from '@/lib/supabase';
import { getCurrentUser } from '@/lib/auth';

export const USER_ROLES_COLLECTION_ID = 'user_roles';
export const ADMIN_INVITATIONS_COLLECTION_ID = 'admin_invitations';

export type AppRole = 'admin' | 'moderator' | 'user';

export interface AdminInvitation {
  $id?: string;
  email: string;
  permissions: string[];
  role: 'admin' | 'supportive';
  status: 'pending' | 'accepted' | 'expired' | 'revoked';
  token: string;
  expires_at: string;
  created_at: string;
  created_by: string;
}

/**
 * Check if a user has a specific role (server-side safe pattern)
 */
export const hasRole = async (userId: string, role: AppRole): Promise<boolean> => {
  const { data, error } = await supabase.from("user_roles").select("role")
    .eq("user_id", userId).eq("role", role).maybeSingle();
  return !error && !!data;
};

/**
 * Get all roles for a user
 */
export const getUserRoles = async (userId: string): Promise<AppRole[]> => {
  const { data, error } = await supabase.from("user_roles").select("role").eq("user_id", userId);
  return error ? [] : (data || []).map((row: any) => row.role as AppRole);
};

/**
 * Check if current user is an admin and should be redirected
 */
export const checkAdminRedirect = async (): Promise<{ isAdmin: boolean; userId: string | null }> => {
  const user = await getCurrentUser();
  if (!user) return { isAdmin: false, userId: null };
  return { isAdmin: await hasRole(user.id, "admin"), userId: user.id };
};

/**
 * Generate a secure random token for admin invitations
 */
export const generateSecureToken = (): string => {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

/**
 * Create an admin invitation (only callable by existing admins)
 */
export const createAdminInvitation = async (): Promise<AdminInvitation | null> => null;
export const validateInvitationToken = async (_token: string): Promise<AdminInvitation | null> => null;
export const completeAdminSetup = async (_token: string, _password: string, _name: string) => ({
  success: false, error: "Admin invitations will be enabled after the Supabase admin workflow is configured.",
});
export const revokeAdminInvitation = async (_invitationId: string): Promise<boolean> => false;
