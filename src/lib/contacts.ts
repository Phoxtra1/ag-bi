
import { databases } from './appwrite';
import { DATABASE_ID, CONTACTS_COLLECTION_ID } from './database';
import { ID } from 'appwrite';

// Type for a contact form submission
export interface ContactFormData {
  fullName: string;
  email: string;
  subject: string;
  category: string;
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
        subject: data.subject,
        category: data.category,
        message: data.message,
        status: 'new',
        timestamp: new Date().toISOString()
      }
    );
    return response;
  } catch (error) {
    console.error('Error creating contact document:', error);
    throw error;
  }
}

// Fetch all contacts
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

// Update contact status
export async function updateContactStatus(contactId: string, status: 'new' | 'read') {
  try {
    const response = await databases.updateDocument(
      DATABASE_ID,
      CONTACTS_COLLECTION_ID,
      contactId,
      { status }
    );
    return response;
  } catch (error) {
    console.error('Error updating contact status:', error);
    throw error;
  }
}

// Delete contact
export async function deleteContact(contactId: string) {
  try {
    await databases.deleteDocument(
      DATABASE_ID,
      CONTACTS_COLLECTION_ID,
      contactId
    );
  } catch (error) {
    console.error('Error deleting contact:', error);
    throw error;
  }
}
