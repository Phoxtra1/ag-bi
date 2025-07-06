
import { databases } from './appwrite';
import { DATABASE_ID, NEWSLETTERS_COLLECTION_ID } from './database';
import { ID } from 'appwrite';

// Type for newsletter subscription
export interface NewsletterSubscription {
  email: string;
  fullName?: string;
  subscriptionDate?: string;
  status?: 'active' | 'unsubscribed';
}

// Create a new newsletter subscription
export async function createNewsletterSubscription(data: NewsletterSubscription) {
  try {
    const response = await databases.createDocument(
      DATABASE_ID,
      NEWSLETTERS_COLLECTION_ID,
      ID.unique(),
      {
        email: data.email,
        fullName: data.fullName || '',
        subscriptionDate: data.subscriptionDate || new Date().toISOString(),
        status: data.status || 'active'
      }
    );
    return response;
  } catch (error) {
    console.error('Error creating newsletter subscription:', error);
    throw error;
  }
}

// Fetch all newsletter subscriptions
export async function listNewsletterSubscriptions() {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      NEWSLETTERS_COLLECTION_ID
    );
    return response.documents;
  } catch (error) {
    console.error('Error fetching newsletter subscriptions:', error);
    throw error;
  }
}

// Update subscription status
export async function updateSubscriptionStatus(subscriptionId: string, status: 'active' | 'unsubscribed') {
  try {
    const response = await databases.updateDocument(
      DATABASE_ID,
      NEWSLETTERS_COLLECTION_ID,
      subscriptionId,
      { status }
    );
    return response;
  } catch (error) {
    console.error('Error updating subscription status:', error);
    throw error;
  }
}
