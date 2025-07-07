
import { Client, Account, Databases, Storage, Functions } from "appwrite";

// Initialize the Appwrite client with environment variables for deployment
const client = new Client();

// Use environment variables for production deployment
const APPWRITE_ENDPOINT = import.meta.env.VITE_APPWRITE_ENDPOINT || "https://nyc.cloud.appwrite.io/v1";
const APPWRITE_PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID || "amniva-ri03";

client
  .setEndpoint(APPWRITE_ENDPOINT)
  .setProject(APPWRITE_PROJECT_ID);

// Export core services
export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
export const functions = new Functions(client);

// Export client in case needed directly
export { client };

// Re-export database constants for convenience
export {
  DATABASE_ID,
  CONTACTS_COLLECTION_ID,
  PREDICTIONS_COLLECTION_ID,
  NEWSLETTERS_COLLECTION_ID,
  API_REQUESTS_COLLECTION_ID,
  CONTENT_SUBMISSIONS_COLLECTION_ID,
  VERIFICATION_BUCKET_ID,
  CONTENT_BUCKET_ID
} from './database';

// Add connection test for deployment
export const testConnection = async () => {
  try {
    await account.get();
    console.log('✅ Appwrite connection successful');
    return true;
  } catch (error) {
    console.warn('⚠️ Appwrite connection test failed (user not authenticated)');
    return false;
  }
};
