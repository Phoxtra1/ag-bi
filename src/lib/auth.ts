
import { account } from './appwrite';
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
    
    return {
      success: true,
      data: session,
      status: 200
    };
  } catch (error: any) {
    console.error('Login error:', error);
    const message: string = error?.message || 'Login failed';
    const code: number | undefined = error?.code;

    // If a session is already active, consider it success
    if (code === 409 || /session is active/i.test(message)) {
      return { success: true, data: { current: true }, status: 200 };
    }

    return {
      success: false,
      data: { error: message },
      status: 400
    };
  }
};

export const registerUser = async (credentials: RegisterCredentials) => {
  try {
    const user = await account.create(
      ID.unique(),
      credentials.email,
      credentials.password,
      credentials.name
    );
    
    // Auto-login after registration
    try { await account.deleteSession('current'); } catch {}
    const session = await account.createEmailPasswordSession(
      credentials.email,
      credentials.password
    );
    
    return {
      success: true,
      data: { user, session },
      status: 201
    };
  } catch (error: any) {
    console.error('Registration error:', error);
    const message: string = error?.message || 'Registration failed';
    const code: number | undefined = error?.code;

    // If the user already exists, attempt to sign them in
    if (code === 409 || /already exists/i.test(message)) {
      try {
        try { await account.deleteSession('current'); } catch {}
        const session = await account.createEmailPasswordSession(
          credentials.email,
          credentials.password
        );
        return { success: true, data: { session }, status: 200 };
      } catch (loginError: any) {
        return { success: false, data: { error: 'Email already registered. Please log in with your password.' }, status: 400 };
      }
    }

    return {
      success: false,
      data: { error: message },
      status: 400
    };
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
