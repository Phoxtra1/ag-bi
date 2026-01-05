// Admin authentication utilities
import { account, databases, DATABASE_ID } from '@/lib/appwrite';
import { Query, ID } from 'appwrite';

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
  try {
    console.log(`[AdminAuth] Checking role "${role}" for user: ${userId}`);
    const response = await databases.listDocuments(
      DATABASE_ID,
      USER_ROLES_COLLECTION_ID,
      [Query.equal('user_id', userId), Query.equal('role', role)]
    );
    const found = response.documents.length > 0;
    console.log(`[AdminAuth] Role check result: ${found ? 'FOUND' : 'NOT FOUND'}`, response.documents);
    return found;
  } catch (error: any) {
    console.error('[AdminAuth] Error checking user role:', error);
    console.error('[AdminAuth] This usually means:');
    console.error('  1. The "user_roles" collection does not exist');
    console.error('  2. The collection permissions do not allow reading');
    console.error('  3. The collection attributes (user_id, role) are missing or named differently');
    return false;
  }
};

/**
 * Get all roles for a user
 */
export const getUserRoles = async (userId: string): Promise<AppRole[]> => {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      USER_ROLES_COLLECTION_ID,
      [Query.equal('user_id', userId)]
    );
    return response.documents.map((doc: any) => doc.role as AppRole);
  } catch (error) {
    console.error('Error getting user roles:', error);
    return [];
  }
};

/**
 * Check if current user is an admin and should be redirected
 */
export const checkAdminRedirect = async (): Promise<{ isAdmin: boolean; userId: string | null }> => {
  try {
    const user = await account.get();
    if (!user) return { isAdmin: false, userId: null };
    
    const isAdmin = await hasRole(user.$id, 'admin');
    return { isAdmin, userId: user.$id };
  } catch (error) {
    return { isAdmin: false, userId: null };
  }
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
export const createAdminInvitation = async (
  email: string,
  permissions: string[],
  role: 'admin' | 'supportive' = 'supportive'
): Promise<AdminInvitation | null> => {
  try {
    const currentUser = await account.get();
    if (!currentUser) throw new Error('Not authenticated');
    
    // Verify current user is an admin
    const isAdmin = await hasRole(currentUser.$id, 'admin');
    if (!isAdmin) throw new Error('Unauthorized: Only admins can send invitations');
    
    const token = generateSecureToken();
    const expiresAt = new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString(); // 72 hours
    
    const invitation = await databases.createDocument(
      DATABASE_ID,
      ADMIN_INVITATIONS_COLLECTION_ID,
      ID.unique(),
      {
        email,
        permissions,
        role,
        status: 'pending',
        token,
        expires_at: expiresAt,
        created_at: new Date().toISOString(),
        created_by: currentUser.$id
      }
    );
    
    return invitation as unknown as AdminInvitation;
  } catch (error) {
    console.error('Error creating admin invitation:', error);
    return null;
  }
};

/**
 * Validate an invitation token
 */
export const validateInvitationToken = async (token: string): Promise<AdminInvitation | null> => {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      ADMIN_INVITATIONS_COLLECTION_ID,
      [
        Query.equal('token', token),
        Query.equal('status', 'pending')
      ]
    );
    
    if (response.documents.length === 0) return null;
    
    const invitation = response.documents[0] as unknown as AdminInvitation;
    
    // Check if expired
    if (new Date(invitation.expires_at) < new Date()) {
      // Update status to expired
      await databases.updateDocument(
        DATABASE_ID,
        ADMIN_INVITATIONS_COLLECTION_ID,
        invitation.$id!,
        { status: 'expired' }
      );
      return null;
    }
    
    return invitation;
  } catch (error) {
    console.error('Error validating invitation token:', error);
    return null;
  }
};

/**
 * Complete admin setup - create account and assign role
 */
export const completeAdminSetup = async (
  token: string,
  password: string,
  name: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    const invitation = await validateInvitationToken(token);
    if (!invitation) {
      return { success: false, error: 'Invalid or expired invitation' };
    }
    
    // Create user account
    const user = await account.create(
      ID.unique(),
      invitation.email,
      password,
      name
    );
    
    // Create session
    await account.createEmailPasswordSession(invitation.email, password);
    
    // Assign admin role
    await databases.createDocument(
      DATABASE_ID,
      USER_ROLES_COLLECTION_ID,
      ID.unique(),
      {
        user_id: user.$id,
        role: invitation.role === 'admin' ? 'admin' : 'moderator'
      }
    );
    
    // Mark invitation as accepted
    await databases.updateDocument(
      DATABASE_ID,
      ADMIN_INVITATIONS_COLLECTION_ID,
      invitation.$id!,
      { status: 'accepted' }
    );
    
    return { success: true };
  } catch (error: any) {
    console.error('Error completing admin setup:', error);
    return { success: false, error: error.message || 'Setup failed' };
  }
};

/**
 * Revoke an admin invitation
 */
export const revokeAdminInvitation = async (invitationId: string): Promise<boolean> => {
  try {
    await databases.updateDocument(
      DATABASE_ID,
      ADMIN_INVITATIONS_COLLECTION_ID,
      invitationId,
      { status: 'revoked' }
    );
    return true;
  } catch (error) {
    console.error('Error revoking invitation:', error);
    return false;
  }
};

/**
 * Get all pending invitations (admin only)
 */
export const getPendingInvitations = async (): Promise<AdminInvitation[]> => {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      ADMIN_INVITATIONS_COLLECTION_ID,
      [Query.equal('status', 'pending'), Query.orderDesc('created_at')]
    );
    return response.documents as unknown as AdminInvitation[];
  } catch (error) {
    console.error('Error fetching invitations:', error);
    return [];
  }
};

/**
 * Get admin setup URL for invitation
 */
export const getAdminSetupUrl = (token: string): string => {
  return `${window.location.origin}/admin-setup?token=${token}`;
};
