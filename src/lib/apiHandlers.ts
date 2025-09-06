
import { account, databases } from './appwrite';
import { DATABASE_ID, CONTACTS_COLLECTION_ID, PREDICTIONS_COLLECTION_ID, NEWSLETTERS_COLLECTION_ID, API_REQUESTS_COLLECTION_ID } from './database';
import { ID } from 'appwrite';

// Authentication handlers
export const handleSignup = async (name: string, email: string, password: string) => {
  try {
    const user = await account.create(ID.unique(), email, password, name);
    // Ensure we don't conflict with any existing session
    try { await account.deleteSession('current'); } catch {}
    const session = await account.createEmailPasswordSession(email, password);
    return { success: true, user, session };
  } catch (error: any) {
    console.error('Signup error:', error);
    const message: string = error?.message || '';
    const code: number | undefined = error?.code;

    // If the user already exists, attempt to log them in instead
    if (code === 409 || /already exists/i.test(message)) {
      try {
        try { await account.deleteSession('current'); } catch {}
        const session = await account.createEmailPasswordSession(email, password);
        return { success: true, session };
      } catch (loginError: any) {
        return { success: false, error: 'Email already registered. Please log in with your password.' };
      }
    }

    return { success: false, error: message || 'Registration failed' };
  }
};

export const handleLogin = async (email: string, password: string) => {
  try {
    // If a session is already active, clear it first to avoid 409 conflicts
    try { await account.deleteSession('current'); } catch {}
    const session = await account.createEmailPasswordSession(email, password);
    return { success: true, session };
  } catch (error: any) {
    console.error('Login error:', error);
    const message: string = error?.message || '';
    const code: number | undefined = error?.code;

    // If a session is already active, treat as a successful login
    if (code === 409 || /session is active/i.test(message)) {
      return { success: true, session: { current: true } };
    }

    return { success: false, error: message || 'Login failed' };
  }
};

export const handleLogout = async () => {
  try {
    await account.deleteSession('current');
    return { success: true };
  } catch (error: any) {
    console.error('Logout error:', error);
    return { success: false, error: error.message };
  }
};

// Contact form handler
export const handleContactSubmission = async (data: {
  fullName: string;
  email: string;
  subject: string;
  category: string;
  message: string;
}) => {
  try {
    const response = await databases.createDocument(
      DATABASE_ID,
      CONTACTS_COLLECTION_ID,
      ID.unique(),
      {
        fullName: data.fullName,
        email: data.email,
        subject: data.subject,
        category: data.category,
        message: data.message,
        status: 'new',
        timestamp: new Date().toISOString()
      }
    );
    return { success: true, document: response };
  } catch (error: any) {
    console.error('Contact submission error:', error);
    return { success: false, error: error.message };
  }
};

// Prediction form handler
export const handlePredictionSubmission = async (data: {
  name: string;
  email: string;
  prompt: string;
  title?: string;
  description?: string;
}) => {
  try {
    const response = await databases.createDocument(
      DATABASE_ID,
      PREDICTIONS_COLLECTION_ID,
      ID.unique(),
      {
        name: data.name,
        email: data.email,
        prompt: data.prompt,
        title: data.title || '',
        description: data.description || '',
        status: 'pending',
        submittedAt: new Date().toISOString(),
        submittedBy: data.email
      }
    );
    return { success: true, document: response };
  } catch (error) {
    console.error('Prediction submission error:', error);
    return { success: false, error: error.message };
  }
};

// Newsletter subscription handler
export const handleNewsletterSubscription = async (data: {
  email: string;
  fullName?: string;
}) => {
  try {
    const response = await databases.createDocument(
      DATABASE_ID,
      NEWSLETTERS_COLLECTION_ID,
      ID.unique(),
      {
        email: data.email,
        fullName: data.fullName || '',
        subscriptionDate: new Date().toISOString(),
        status: 'active'
      }
    );
    return { success: true, document: response };
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return { success: false, error: error.message };
  }
};

// API access request handler
export const handleApiAccessRequest = async (data: {
  fullName: string;
  email: string;
  organizationName: string;
  sector: string;
  intendedUse: string;
  verificationDocument?: string;
}) => {
  try {
    const response = await databases.createDocument(
      DATABASE_ID,
      API_REQUESTS_COLLECTION_ID,
      ID.unique(),
      {
        fullName: data.fullName,
        email: data.email,
        organizationName: data.organizationName,
        sector: data.sector,
        intendedUse: data.intendedUse,
        verificationDocument: data.verificationDocument || '',
        status: 'pending',
        internalNotes: '',
        submissionDate: new Date().toISOString()
      }
    );
    return { success: true, document: response };
  } catch (error) {
    console.error('API access request error:', error);
    return { success: false, error: error.message };
  }
};
