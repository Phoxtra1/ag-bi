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

// IDs
const databaseId = "amniva-db03";

// ✅ Fixed Collection IDs from you:
const collectionContacts = "contacts-ava";
const collectionPredictions = "predictions-ava";
const collectionNewsletters = "newslettersubscribers-ava";

// ✅ Export everything
export {
  client,
  account,
  databases,
  storage,
  avatars,
  functions,
  databaseId,
  collectionContacts,
  collectionPredictions,
  collectionNewsletters,
};
