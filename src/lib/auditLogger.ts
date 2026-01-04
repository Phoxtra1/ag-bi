// Audit logging utilities for tracking admin actions
import { databases, DATABASE_ID, account } from '@/lib/database';
import { ID } from 'appwrite';

const AUDIT_LOGS_COLLECTION = 'audit_logs';

export type ActionCategory = 'auth' | 'role' | 'config' | 'content' | 'system' | 'api';
export type ActionStatus = 'success' | 'failed' | 'warning';

interface LogEntry {
  action_type: string;
  action_category: ActionCategory;
  user_id: string;
  user_email: string;
  target_id?: string;
  target_type?: string;
  details: string;
  ip_address?: string;
  user_agent?: string;
  status: ActionStatus;
}

/**
 * Log an admin action to the audit log collection
 */
export const logAuditEvent = async (
  actionType: string,
  category: ActionCategory,
  details: string,
  status: ActionStatus = 'success',
  targetId?: string,
  targetType?: string
): Promise<boolean> => {
  try {
    const user = await account.get();
    if (!user) {
      console.warn('Cannot log audit event: No authenticated user');
      return false;
    }

    const entry: LogEntry = {
      action_type: actionType,
      action_category: category,
      user_id: user.$id,
      user_email: user.email,
      details,
      status,
      target_id: targetId,
      target_type: targetType,
      user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
    };

    await databases.createDocument(
      DATABASE_ID,
      AUDIT_LOGS_COLLECTION,
      ID.unique(),
      entry
    );

    return true;
  } catch (error) {
    console.error('Failed to log audit event:', error);
    return false;
  }
};

// Convenience functions for common actions
export const logLogin = (email: string, success: boolean) =>
  logAuditEvent('login', 'auth', `User ${email} ${success ? 'logged in' : 'failed to log in'}`, success ? 'success' : 'failed');

export const logLogout = (email: string) =>
  logAuditEvent('logout', 'auth', `User ${email} logged out`, 'success');

export const logRoleChange = (targetEmail: string, oldRole: string, newRole: string, targetUserId: string) =>
  logAuditEvent('role_change', 'role', `Changed role from "${oldRole}" to "${newRole}" for ${targetEmail}`, 'success', targetUserId, 'user');

export const logConfigUpdate = (configName: string, details: string, targetId?: string) =>
  logAuditEvent('config_update', 'config', details, 'success', targetId, configName);

export const logContentAction = (action: 'create' | 'edit' | 'delete', contentType: string, contentId: string, details: string) =>
  logAuditEvent(`content_${action}`, 'content', details, 'success', contentId, contentType);

export const logApiAction = (action: string, details: string, targetId?: string) =>
  logAuditEvent(action, 'api', details, 'success', targetId, 'api');

export const logSystemAction = (action: string, details: string, status: ActionStatus = 'success') =>
  logAuditEvent(action, 'system', details, status);
