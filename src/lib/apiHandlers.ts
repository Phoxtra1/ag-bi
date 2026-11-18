
import { supabase } from "@/lib/supabase";
import { databases, account } from './appwrite';
import { DATABASE_ID, CONTACTS_COLLECTION_ID, PREDICTIONS_COLLECTION_ID, NEWSLETTERS_COLLECTION_ID, API_REQUESTS_COLLECTION_ID } from './database';
import { ID } from 'appwrite';

// Authentication is handled by Supabase. Legacy content collections remain on
// Appwrite during the staged data migration.
export const handleSignup = async (name: string, email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name } },
    });
    if (error) throw error;
    return { success: true, user: data.user, session: data.session };
  } catch (error: any) {
    console.error('Signup error:', error);
    return { success: false, error: error?.message || 'Registration failed' };
  }
};

export const handleLogin = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return { success: true, session: data.session, user: data.user };
  } catch (error: any) {
    console.error('Login error:', error);
    return { success: false, error: error?.message || 'Login failed' };
  }
};

export const handleLogout = async () => {
  const { error } = await supabase.auth.signOut();
  return error ? { success: false, error: error.message } : { success: true };
};

// Contact form handler
export const handleContactSubmission = async (data: {
  fullName: string;
  email: string;
  subject: string;
  category: string;
  message: string;
}) => {
  const create = async () =>
    await databases.createDocument(
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
        timestamp: new Date().toISOString(),
      }
    );

  try {
    const response = await create();
    return { success: true, document: response };
  } catch (error: any) {
    // If not authorized, try creating an anonymous session and retry once
    const msg = error?.message || '';
    const code = error?.code;
    if (code === 401 || code === 403 || /permission|unauthorized|scope/i.test(msg)) {
      try {
        // @ts-ignore - method exists in Appwrite JS SDK
        await account.createAnonymousSession();
        const response = await create();
        return { success: true, document: response };
      } catch (e2: any) {
        console.error('Contact submission retry failed:', e2);
        const hint = 'Ask admin to enable Create permission for guests on contacts-ava or set up a server function proxy.';
        return { success: false, error: `${e2?.message || 'Unauthorized'}. ${hint}` };
      }
    }
    console.error('Contact submission error:', error);
    return { success: false, error: msg || 'Submission failed' };
  }
};

// Prediction form handler with improved error handling
export const handlePredictionSubmission = async (data: {
  name: string;
  email: string;
  prompt: string;
  title?: string;
  description?: string;
}) => {
  const create = async () =>
    await databases.createDocument(
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

  try {
    const response = await create();
    return { success: true, document: response };
  } catch (error: any) {
    const msg = error?.message || '';
    const code = error?.code;
    
    // Retry with anonymous session if permission denied
    if (code === 401 || code === 403 || /permission|unauthorized|scope/i.test(msg)) {
      try {
        await account.createAnonymousSession();
        const response = await create();
        return { success: true, document: response };
      } catch (e2: any) {
        console.error('Prediction submission retry failed:', e2);
        return { 
          success: false, 
          error: `${e2?.message || 'Unauthorized'}. Ensure Create permission is enabled for predictions collection.` 
        };
      }
    }
    console.error('Prediction submission error:', error);
    return { success: false, error: msg || 'Submission failed' };
  }
};

// Newsletter subscription handler with improved error handling
export const handleNewsletterSubscription = async (data: {
  email: string;
  fullName?: string;
}) => {
  const create = async () =>
    await databases.createDocument(
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

  try {
    const response = await create();
    return { success: true, document: response };
  } catch (error: any) {
    const msg = error?.message || '';
    const code = error?.code;
    
    // Handle duplicate subscription gracefully
    if (code === 409 || /already exists|duplicate/i.test(msg)) {
      return { success: true, message: 'Already subscribed!' };
    }
    
    // Retry with anonymous session if permission denied
    if (code === 401 || code === 403 || /permission|unauthorized|scope/i.test(msg)) {
      try {
        await account.createAnonymousSession();
        const response = await create();
        return { success: true, document: response };
      } catch (e2: any) {
        console.error('Newsletter subscription retry failed:', e2);
        return { 
          success: false, 
          error: `${e2?.message || 'Unauthorized'}. Ensure Create permission is enabled for newsletters collection.` 
        };
      }
    }
    console.error('Newsletter subscription error:', error);
    return { success: false, error: msg || 'Subscription failed' };
  }
};

// API access request handler with improved error handling
export const handleApiAccessRequest = async (data: {
  fullName: string;
  email: string;
  organizationName: string;
  sector: string;
  intendedUse: string;
  verificationDocument?: string;
}) => {
  const create = async () =>
    await databases.createDocument(
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

  try {
    const response = await create();
    return { success: true, document: response };
  } catch (error: any) {
    const msg = error?.message || '';
    const code = error?.code;
    
    // Retry with anonymous session if permission denied
    if (code === 401 || code === 403 || /permission|unauthorized|scope/i.test(msg)) {
      try {
        await account.createAnonymousSession();
        const response = await create();
        return { success: true, document: response };
      } catch (e2: any) {
        console.error('API access request retry failed:', e2);
        return { 
          success: false, 
          error: `${e2?.message || 'Unauthorized'}. Ensure Create permission is enabled for api_requests collection.` 
        };
      }
    }
    console.error('API access request error:', error);
    return { success: false, error: msg || 'Request failed' };
  }
};
