// Social authentication providers for Appwrite
import { account } from '@/lib/appwrite';
import { OAuthProvider } from 'appwrite';

// Social login redirect URLs
// We redirect back to /login so the UI can:
// 1) detect the authenticated session, 2) check role, and 3) route to /admin or /dashboard.
const getRedirectUrl = () => `${window.location.origin}/login?oauth=1`;
const getFailureUrl = () => `${window.location.origin}/login?error=oauth_failed`;

/**
 * Initiate Facebook OAuth login
 */
export const loginWithFacebook = async () => {
  try {
    account.createOAuth2Session(
      OAuthProvider.Facebook,
      getRedirectUrl(),
      getFailureUrl()
    );
    return { success: true };
  } catch (error: any) {
    console.error('Facebook login error:', error);
    return { success: false, error: error.message || 'Facebook login failed' };
  }
};

/**
 * Initiate GitHub OAuth login
 */
export const loginWithGithub = async () => {
  try {
    account.createOAuth2Session(
      OAuthProvider.Github,
      getRedirectUrl(),
      getFailureUrl()
    );
    return { success: true };
  } catch (error: any) {
    console.error('GitHub login error:', error);
    return { success: false, error: error.message || 'GitHub login failed' };
  }
};

/**
 * Initiate Microsoft OAuth login
 */
export const loginWithMicrosoft = async () => {
  try {
    account.createOAuth2Session(
      OAuthProvider.Microsoft,
      getRedirectUrl(),
      getFailureUrl()
    );
    return { success: true };
  } catch (error: any) {
    console.error('Microsoft login error:', error);
    return { success: false, error: error.message || 'Microsoft login failed' };
  }
};

/**
 * Check if user is authenticated after OAuth redirect
 */
export const checkOAuthSession = async () => {
  try {
    const user = await account.get();
    return { success: true, user };
  } catch (error) {
    return { success: false, user: null };
  }
};
