// lib/contacts.ts

import { databases } from './appwrite';
import { DATABASE_ID, CONTACTS_COLLECTION_ID } from './database';
import { ID } from 'appwrite';

// Type for a contact form submission
export interface ContactFormData {
  fullName: string;
  email: string;
  message: string;
}

// Create a new contact submission
export async function createContact(data: ContactFormData) {
  try {
    const response = await databases.createDocument(
      DATABASE_ID,
      CONTACTS_COLLECTION_ID,
      ID.unique(),
      {
        fullName: data.fullName,
        email: data.email,
        message: data.message,
      }
    );
    return response;
  } catch (error) {
    console.error('Error creating contact document:', error);
    throw error;
  }
}
// Optionally fetch all contacts
export async function listContacts() {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      CONTACTS_COLLECTION_ID
    );
    return response.documents;
  } catch (error) {
    console.error('Error fetching contacts:', error);
    throw error;
  }
}
