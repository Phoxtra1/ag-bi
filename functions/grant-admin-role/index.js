/**
 * Appwrite Function: Grant Admin Role
 * 
 * Securely assigns the admin role to the designated admin email.
 * This function should be called during initial setup or via admin console.
 * 
 * Required environment variables:
 * - APPWRITE_ENDPOINT
 * - APPWRITE_PROJECT_ID
 * - APPWRITE_API_KEY (Server-side API key with database write permissions)
 * - ADMIN_EMAIL (The designated admin email)
 * - DATABASE_ID
 */

import { Client, Databases, Users, Query, ID } from 'node-appwrite';

const client = new Client()
  .setEndpoint(process.env.APPWRITE_ENDPOINT || 'https://nyc.cloud.appwrite.io/v1')
  .setProject(process.env.APPWRITE_PROJECT_ID || 'amniva-ri03')
  .setKey(process.env.APPWRITE_API_KEY);

const databases = new Databases(client);
const users = new Users(client);

const DATABASE_ID = process.env.DATABASE_ID || 'amniva-db03';
const USER_ROLES_COLLECTION_ID = 'user_roles';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || process.env.VITE_ADMIN_EMAIL;

/**
 * Find user by email using the Users API (server-side only)
 */
async function findUserByEmail(email) {
  try {
    const usersList = await users.list([Query.equal('email', email)]);
    if (usersList.users.length > 0) {
      return usersList.users[0];
    }
    return null;
  } catch (error) {
    console.error('Error finding user by email:', error);
    return null;
  }
}

/**
 * Check if user already has admin role
 */
async function hasAdminRole(userId) {
  try {
    const roles = await databases.listDocuments(
      DATABASE_ID,
      USER_ROLES_COLLECTION_ID,
      [Query.equal('user_id', userId), Query.equal('role', 'admin')]
    );
    return roles.documents.length > 0;
  } catch (error) {
    console.error('Error checking admin role:', error);
    return false;
  }
}

/**
 * Grant admin role to user
 */
async function grantAdminRole(userId) {
  try {
    const document = await databases.createDocument(
      DATABASE_ID,
      USER_ROLES_COLLECTION_ID,
      ID.unique(),
      {
        user_id: userId,
        role: 'admin',
        granted_at: new Date().toISOString(),
        granted_by: 'system'
      }
    );
    return { success: true, document };
  } catch (error) {
    console.error('Error granting admin role:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Main handler
 */
export default async function handler(req, res) {
  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Content-Type': 'application/json'
  };

  // Handle OPTIONS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).set(headers).send('');
  }

  try {
    // Validate admin email is configured
    if (!ADMIN_EMAIL) {
      console.error('ADMIN_EMAIL environment variable not set');
      return res.status(500).set(headers).json({
        success: false,
        error: 'Admin email not configured in environment variables'
      });
    }

    console.log(`[Grant Admin Role] Looking up user with email: ${ADMIN_EMAIL}`);

    // Find user by email
    const user = await findUserByEmail(ADMIN_EMAIL);
    
    if (!user) {
      console.log(`[Grant Admin Role] No user found with email: ${ADMIN_EMAIL}`);
      return res.status(404).set(headers).json({
        success: false,
        error: `No user account found for ${ADMIN_EMAIL}. Please register first.`,
        hint: 'The designated admin must create an account before the role can be assigned.'
      });
    }

    console.log(`[Grant Admin Role] Found user: ${user.$id}`);

    // Check if already admin
    const alreadyAdmin = await hasAdminRole(user.$id);
    
    if (alreadyAdmin) {
      console.log(`[Grant Admin Role] User ${user.$id} is already an admin`);
      return res.status(200).set(headers).json({
        success: true,
        message: 'User already has admin role',
        userId: user.$id,
        email: ADMIN_EMAIL
      });
    }

    // Grant admin role
    const result = await grantAdminRole(user.$id);
    
    if (result.success) {
      console.log(`[Grant Admin Role] Successfully granted admin role to ${user.$id}`);
      return res.status(200).set(headers).json({
        success: true,
        message: 'Admin role granted successfully',
        userId: user.$id,
        email: ADMIN_EMAIL,
        documentId: result.document.$id
      });
    } else {
      console.error(`[Grant Admin Role] Failed to grant admin role:`, result.error);
      return res.status(500).set(headers).json({
        success: false,
        error: result.error
      });
    }

  } catch (error) {
    console.error('[Grant Admin Role] Unexpected error:', error);
    return res.status(500).set(headers).json({
      success: false,
      error: error.message || 'Internal server error'
    });
  }
}
