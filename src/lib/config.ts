
// Appwrite Configuration
export const APPWRITE_CONFIG = {
  endpoint: import.meta.env.VITE_APPWRITE_ENDPOINT || "https://nyc.cloud.appwrite.io/v1",
  projectId: import.meta.env.VITE_APPWRITE_PROJECT_ID || "amniva-ri03",
  databaseId: import.meta.env.VITE_APPWRITE_DATABASE_ID || "amniva-db03"
};

// Collection IDs
export const COLLECTIONS = {
  CONTACTS: "contacts-ava",
  PREDICTIONS: "predictions-ava",
  NEWSLETTERS: "newslettersubscribers-ava",
  API_REQUESTS: "api-requests-ava",
  CONTENT_SUBMISSIONS: "content-submissions-ava"
};

// Bucket IDs
export const BUCKETS = {
  VERIFICATION: "verification-ava",
  CONTENT: "content-ava"
};

// Function IDs
export const FUNCTIONS = {
  NOTIFY_ADMIN: "notify-admin-func",
  SEND_WELCOME_EMAIL: "send-welcome-func"
};

// Validation
export const validateConfig = () => {
  const errors: string[] = [];
  
  if (!APPWRITE_CONFIG.endpoint) {
    errors.push("Missing VITE_APPWRITE_ENDPOINT");
  }
  
  if (!APPWRITE_CONFIG.projectId) {
    errors.push("Missing VITE_APPWRITE_PROJECT_ID");
  }
  
  if (!APPWRITE_CONFIG.databaseId) {
    errors.push("Missing VITE_APPWRITE_DATABASE_ID");
  }
  
  if (errors.length > 0) {
    console.error("Configuration errors:", errors);
    return false;
  }
  
  return true;
};

// Initialize and validate configuration
if (!validateConfig()) {
  console.warn("⚠️  Some Appwrite configuration values are missing. Please check your environment variables.");
}
