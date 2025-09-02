// amniva-appwrite.js
// Centralized Appwrite client configuration for Amniva backend

import { Client, Account, Databases, Storage, Functions } from "appwrite";

// =============================
// Environment Configuration
// =============================
const APPWRITE_ENDPOINT =
  import.meta.env.VITE_APPWRITE_ENDPOINT || "https://cloud.appwrite.io/v1";

const APPWRITE_PROJECT_ID =
  import.meta.env.VITE_APPWRITE_PROJECT_ID || "amniva-ri03";

// =============================
// Client Initialization
// =============================
const client = new Client()
  .setEndpoint(APPWRITE_ENDPOINT)
  .setProject(APPWRITE_PROJECT_ID);

// =============================
// Core Services
// =============================
export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
export const functions = new Functions(client);

// =============================
// Utility: Connection Test
// =============================
// This ensures Appwrite is reachable & project is correctly set
export const testConnection = async () => {
  try {
    await client.health.check(); // Check API health instead of requiring auth
    console.log("✅ Appwrite connection successful");
    return true;
  } catch (error) {
    console.error("❌ Appwrite connection failed:", error.message);
    return false;
  }
};

// =============================
// Export Client (if needed)
// =============================
export { client };

// =============================
// Re-export Database Constants
// =============================
export {
  DATABASE_ID,
  CONTACTS_COLLECTION_ID,
  PREDICTIONS_COLLECTION_ID,
  NEWSLETTERS_COLLECTION_ID,
  API_REQUESTS_COLLECTION_ID,
  CONTENT_SUBMISSIONS_COLLECTION_ID,
  VERIFICATION_BUCKET_ID,
  CONTENT_BUCKET_ID,
} from "./database";
