
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
    return {
      success: false,
      data: { error: error.message || 'Login failed' },
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
    return {
      success: false,
      data: { error: error.message || 'Registration failed' },
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
