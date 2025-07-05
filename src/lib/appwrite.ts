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

// Optional: export client in case needed directly
export { client };
