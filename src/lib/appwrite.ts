// src/lib/appwrite.js
import { Client, Account, Databases, Storage, Functions } from "appwrite";

// Initialize the Appwrite client
const client = new Client();

// Use environment variables with fallbacks for safety
const APPWRITE_ENDPOINT =
  import.meta.env.VITE_APPWRITE_ENDPOINT || "https://nyc.cloud.appwrite.io/v1";
const APPWRITE_PROJECT_ID =
  import.meta.env.VITE_APPWRITE_PROJECT_ID || "amniva-ri03";

// Configure the Appwrite client
client
  .setEndpoint(APPWRITE_ENDPOINT)
  .setProject(APPWRITE_PROJECT_ID);

// Export core Appwrite services
export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
export const functions = new Functions(client);

// Export client in case direct access is needed
export { client };

/* 
   Database & Storage constants 
   👉 keep them here so they’re easy to update
   👉 prevents "undefined import" issues
*/
export const DATABASE_ID = "amniva-db03";
export const CONTACTS_COLLECTION_ID = "contacts-ava";
export const PREDICTIONS_COLLECTION_ID = "predictions-ava";
export const NEWSLETTERS_COLLECTION_ID = "newslettersubscribers-ava";
export const API_REQUESTS_COLLECTION_ID = "api-requests-ava";
export const CONTENT_SUBMISSIONS_COLLECTION_ID =
  "content-submissions-ava";
export const REPORTS_COLLECTION_ID = "reports-ava";
export const INSIGHTS_COLLECTION_ID = "insights-ava";

export const VERIFICATION_BUCKET_ID = "verification-ava";
export const CONTENT_BUCKET_ID = "content-ava";

// Quick test function to confirm deployment connection
export const testConnection = async () => {
  try {
    await account.get();
    console.log("✅ Appwrite connection successful");
    return true;
  } catch (error) {
    console.warn(
      "⚠️ Appwrite connection test failed (likely no user session):",
      error.message
    );
    return false;
  }
};
