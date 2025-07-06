
import { Client, Account, Databases, Storage, Functions } from "appwrite";

// Initialize the Appwrite client
const client = new Client();

client
  .setEndpoint("https://nyc.cloud.appwrite.io/v1") // API Endpoint
  .setProject("amniva-ri03");                      // Project ID

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
