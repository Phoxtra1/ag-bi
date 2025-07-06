
import { client, account, databases } from './appwrite';
import { DATABASE_ID } from './database';
import { Query } from 'appwrite';

// Authentication utilities
export const getCurrentUser = async () => {
  try {
    return await account.get();
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

export const isUserLoggedIn = async () => {
  try {
    await account.get();
    return true;
  } catch {
    return false;
  }
};

// Database utilities
export const createDocumentWithTimestamp = async (
  collectionId: string, 
  data: Record<string, any>, 
  documentId?: string
) => {
  try {
    const timestamp = new Date().toISOString();
    return await databases.createDocument(
      DATABASE_ID,
      collectionId,
      documentId || 'unique()',
      {
        ...data,
        createdAt: timestamp,
        updatedAt: timestamp
      }
    );
  } catch (error) {
    console.error('Error creating document:', error);
    throw error;
  }
};

export const updateDocumentWithTimestamp = async (
  collectionId: string,
  documentId: string,
  data: Record<string, any>
) => {
  try {
    return await databases.updateDocument(
      DATABASE_ID,
      collectionId,
      documentId,
      {
        ...data,
        updatedAt: new Date().toISOString()
      }
    );
  } catch (error) {
    console.error('Error updating document:', error);
    throw error;
  }
};

// Query builders
export const buildQueries = {
  equal: (attribute: string, value: any) => Query.equal(attribute, value),
  notEqual: (attribute: string, value: any) => Query.notEqual(attribute, value),
  lessThan: (attribute: string, value: any) => Query.lessThan(attribute, value),
  greaterThan: (attribute: string, value: any) => Query.greaterThan(attribute, value),
  search: (attribute: string, value: string) => Query.search(attribute, value),
  orderDesc: (attribute: string) => Query.orderDesc(attribute),
  orderAsc: (attribute: string) => Query.orderAsc(attribute),
  limit: (count: number) => Query.limit(count),
  offset: (count: number) => Query.offset(count)
};

// Error handling
export const handleAppwriteError = (error: any) => {
  console.error('Appwrite Error:', error);
  
  if (error.code === 401) {
    return 'Authentication required. Please log in.';
  } else if (error.code === 403) {
    return 'Access denied. You do not have permission to perform this action.';
  } else if (error.code === 404) {
    return 'Resource not found.';
  } else if (error.code === 429) {
    return 'Too many requests. Please try again later.';
  } else if (error.code >= 500) {
    return 'Server error. Please try again later.';
  }
  
  return error.message || 'An unexpected error occurred.';
};

// Connection test
export const testAppwriteConnection = async () => {
  try {
    await client.subscribe('console', () => {});
    console.log('✅ Appwrite connection successful');
    return true;
  } catch (error) {
    console.error('❌ Appwrite connection failed:', error);
    return false;
  }
};
