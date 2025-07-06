
import { Client, Account, Databases, Storage, Avatars, Functions } from "appwrite";

// Appwrite client initialization
const client = new Client();

client
  .setEndpoint("https://nyc.cloud.appwrite.io/v1") // Your Appwrite API endpoint
  .setProject("amniva-ri03"); // Your Appwrite project ID

// Services
const account = new Account(client);
const databases = new Databases(client);
const storage = new Storage(client);
const avatars = new Avatars(client);
const functions = new Functions(client);

// Database and Collection IDs
export const DATABASE_ID = "amniva-db03";
export const CONTACTS_COLLECTION_ID = "contacts-ava";
export const PREDICTIONS_COLLECTION_ID = "predictions-ava";
export const NEWSLETTERS_COLLECTION_ID = "newslettersubscribers-ava";
export const API_REQUESTS_COLLECTION_ID = "api-requests-ava";
export const CONTENT_SUBMISSIONS_COLLECTION_ID = "content-submissions-ava";

// Storage Bucket IDs
export const VERIFICATION_BUCKET_ID = "verification-ava";
export const CONTENT_BUCKET_ID = "content-ava";

// Export everything
export {
  client,
  account,
  databases,
  storage,
  avatars,
  functions,
};
