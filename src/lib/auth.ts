import { account } from '@/lib/appwrite';
import { ID } from 'appwrite';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  name: string;
}

export const loginUser = async (credentials: LoginCredentials) => {
  try {
    // Clear any existing session to avoid 409 conflicts
    try { await account.deleteSession('current'); } catch {}
    const session = await account.createEmailPasswordSession(
      credentials.email,
      credentials.password
    );
    return { success: true, data: session, status: 200 };
  } catch (error: any) {
    console.error('Login error:', error);
    const message: string = error?.message || 'Login failed';
    const code: number | undefined = error?.code;

    // If a session is already active, consider it success
    if (code === 409 || /session is active/i.test(message)) {
      return { success: true, data: { current: true }, status: 200 };
    }

    return { success: false, data: { error: message }, status: 400 };
  }
};

export const registerUser = async (credentials: RegisterCredentials) => {
  try {
    // Always clear any existing session first to avoid 409 conflicts
    try { await account.deleteSession('current'); } catch {}

    // Create the user
    const user = await account.create(
      ID.unique(),
      credentials.email,
      credentials.password,
      credentials.name
    );

    // Give Appwrite a moment to finalize user creation before login
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Auto-login after successful registration
    const session = await account.createEmailPasswordSession(
      credentials.email,
      credentials.password
    );

    return { success: true, data: { user, session }, status: 201 };
  } catch (error: any) {
    console.error('Registration error:', error);
    const message: string = error?.message || 'Registration failed';
    const code: number | undefined = error?.code;

    // If user already exists, try logging them in
    if (code === 409 || /already exists/i.test(message)) {
      try {
        // Clean up any stale sessions before login
        try { await account.deleteSession('current'); } catch {}
        const session = await account.createEmailPasswordSession(
          credentials.email,
          credentials.password
        );
        return { success: true, data: { session }, status: 200 };
      } catch (loginError: any) {
        console.error('Auto-login after duplicate user failed:', loginError);
        return {
          success: false,
          data: { error: 'Email already registered. Please log in with your password.' },
          status: 400,
        };
      }
    }

    // Generic error response
    return { success: false, data: { error: message }, status: 400 };
  }
};

export const getCurrentUser = async () => {
  try {
    const user = await account.get();
    return user;
  } catch (error) {
    console.error('Get current user error:', error);
    return null;
  }
};

export const logoutUser = async () => {
  try {
    await account.deleteSession('current');
    return { success: true };
  } catch (error: any) {
    console.error('Logout error:', error);
    return { success: false, error: error.message };
  }
};

export const sendPasswordRecovery = async (email: string) => {
  try {
    const resetUrl = `${window.location.origin}/reset-password`;
    await account.createRecovery(email, resetUrl);
    return { success: true };
  } catch (error: any) {
    console.error('Password recovery error:', error);
    return { success: false, error: error.message };
  }
};

export const resetPassword = async (userId: string, secret: string, password: string) => {
  try {
    await account.updateRecovery(userId, secret, password);
    return { success: true };
  } catch (error: any) {
    console.error('Password reset error:', error);
    return { success: false, error: error.message };
  }
};
