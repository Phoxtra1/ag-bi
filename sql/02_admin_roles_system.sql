-- ============================================
-- AMNIVA ADMIN ROLES & INVITATIONS SYSTEM
-- Run this migration in your Appwrite console
-- ============================================

-- 1. Create enum for roles (conceptual - Appwrite uses string attributes)
-- Roles: 'admin', 'moderator', 'user'

-- 2. User Roles Collection: user_roles
-- This stores role assignments separate from user profiles (security best practice)
-- Schema:
-- - id: string (auto-generated)
-- - user_id: string (references auth.users)
-- - role: string (enum: 'admin', 'moderator', 'user')
-- Indexes: unique(user_id, role)

-- 3. Admin Invitations Collection: admin_invitations
-- Schema:
-- - id: string (auto-generated)
-- - email: string (required, max 255)
-- - permissions: string[] (array of permission keys)
-- - role: string ('admin' or 'supportive')
-- - status: string ('pending', 'accepted', 'expired', 'revoked')
-- - token: string (secure random token, indexed, unique)
-- - expires_at: datetime
-- - created_at: datetime
-- - created_by: string (user_id of admin who created invitation)

-- ============================================
-- APPWRITE COLLECTION SETUP INSTRUCTIONS
-- ============================================

-- Step 1: Create 'user_roles' Collection
-- Navigate to: Database > Your Database > Create Collection
-- Collection ID: user_roles
-- Name: User Roles
-- Permissions: 
--   - Read: role:all (or restrict to authenticated users)
--   - Create: role:admin
--   - Update: role:admin
--   - Delete: role:admin

-- Attributes for user_roles:
-- 1. user_id (String, Required, Size: 36)
-- 2. role (String, Required, Size: 20) - Values: admin, moderator, user

-- Indexes for user_roles:
-- 1. unique_user_role (Unique): [user_id, role]
-- 2. idx_user_id (Key): [user_id]
-- 3. idx_role (Key): [role]

-- Step 2: Create 'admin_invitations' Collection
-- Collection ID: admin_invitations
-- Name: Admin Invitations
-- Permissions:
--   - Read: role:admin
--   - Create: role:admin
--   - Update: role:admin (and role:all for token validation during setup)
--   - Delete: role:admin

-- Attributes for admin_invitations:
-- 1. email (Email, Required, Size: 255)
-- 2. permissions (String[], Required) - Array of permission strings
-- 3. role (String, Required, Size: 20) - 'admin' or 'supportive'
-- 4. status (String, Required, Size: 20) - 'pending', 'accepted', 'expired', 'revoked'
-- 5. token (String, Required, Size: 64) - Secure random token
-- 6. expires_at (Datetime, Required)
-- 7. created_at (Datetime, Required)
-- 8. created_by (String, Required, Size: 36)

-- Indexes for admin_invitations:
-- 1. idx_token (Unique): [token]
-- 2. idx_email (Key): [email]
-- 3. idx_status (Key): [status]
-- 4. idx_status_token (Key): [status, token]

-- ============================================
-- SECURITY FUNCTION (Conceptual)
-- ============================================
-- In Appwrite, you'd create a Function to check roles:
-- 
-- export async function hasRole(userId: string, role: string): boolean {
--   const result = await databases.listDocuments(
--     DATABASE_ID,
--     'user_roles',
--     [Query.equal('user_id', userId), Query.equal('role', role)]
--   );
--   return result.documents.length > 0;
-- }

-- ============================================
-- INITIAL SUPER ADMIN SETUP
-- ============================================
-- To bootstrap the first admin:
-- 1. Create a user account manually in Appwrite Console > Auth > Users
-- 2. Add a document to user_roles:
--    {
--      "user_id": "<user-id-from-step-1>",
--      "role": "admin"
--    }
-- 3. This user can now login and will be redirected to /admin
-- 4. They can then invite other admins using the Admin Management panel

-- ============================================
-- RLS-STYLE PERMISSIONS (Appwrite Permissions)
-- ============================================
-- For user_roles collection, set document-level permissions:
-- - Only admins can read all roles
-- - Users can read their own roles
-- 
-- For admin_invitations:
-- - Admins can CRUD all invitations
-- - Anonymous/guest users can READ invitations by token (for validation)
-- - This allows the setup page to validate tokens without authentication

-- ============================================
-- AUDIT LOGS COLLECTION
-- ============================================
-- Step 3: Create 'audit_logs' Collection
-- Collection ID: audit_logs
-- Name: Audit Logs
-- Permissions:
--   - Read: role:admin
--   - Create: role:admin
--   - Update: none (logs are immutable)
--   - Delete: role:admin (for maintenance only)

-- Attributes for audit_logs:
-- 1. action_type (String, Required, Size: 50) - e.g., "login", "role_change", "config_update"
-- 2. action_category (String, Required, Size: 20) - "auth", "role", "config", "content", "system", "api"
-- 3. user_id (String, Required, Size: 36) - ID of user performing action
-- 4. user_email (String, Required, Size: 255) - Email of user
-- 5. target_id (String, Optional, Size: 36) - ID of affected resource
-- 6. target_type (String, Optional, Size: 50) - Type of affected resource
-- 7. details (String, Required, Size: 1000) - Human-readable description
-- 8. ip_address (String, Optional, Size: 45) - IPv4/IPv6 address
-- 9. user_agent (String, Optional, Size: 500) - Browser/client info
-- 10. status (String, Required, Size: 20) - "success", "failed", "warning"

-- Indexes for audit_logs:
-- 1. idx_created_at (Key): [$createdAt] (descending for recent-first queries)
-- 2. idx_user_id (Key): [user_id]
-- 3. idx_action_category (Key): [action_category]
-- 4. idx_status (Key): [status]
-- 5. idx_category_status (Key): [action_category, status]

-- ============================================
-- DESIGNATED ADMIN EMAIL SETUP
-- ============================================
-- The designated admin email should be stored in your environment variables
-- or Appwrite project settings, NOT in the database for security.
--
-- Option 1: Environment Variable (Recommended)
-- Set ADMIN_EMAIL in your .env file or Appwrite Function environment:
--   ADMIN_EMAIL=youradmin@yourdomain.com
--
-- Option 2: Appwrite Project Settings
-- Go to Settings > Environment Variables in Appwrite Console
-- Add: ADMIN_EMAIL = youradmin@yourdomain.com
--
-- The application will check this email during login to auto-assign admin role
-- to the first admin or validate authorized admin emails.

-- BOOTSTRAPPING YOUR FIRST ADMIN:
-- 1. Set ADMIN_EMAIL environment variable to your designated admin email
-- 2. Create a user in Appwrite Console > Auth > Users with that email
-- 3. Add a document to user_roles collection:
--    { "user_id": "<user-id>", "role": "admin" }
-- 4. OR use the /admin-setup page with an invitation token
