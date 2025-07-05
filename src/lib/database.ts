// database.ts

import { Client, Databases, ID } from 'appwrite';

// Appwrite config
const client = new Client()
  .setEndpoint('https://nyc.cloud.appwrite.io/v1')
  .setProject('amniva-ri03');

const databases = new Databases(client);

// Constants
const databaseId = 'amniva-db03';

// ✅ Create Document (e.g., contact form, submission, etc.)
export const createDocument = async (
  collectionId: string,
  data: Record<string, any>
) => {
  try {
    const response = await databases.createDocument(
      databaseId,
      collectionId,
      ID.unique(),
      data
    );
    return response;
  } catch (error) {
    throw error;
  }
};

// ✅ Get All Documents
export const getAllDocuments = async (collectionId: string) => {
  try {
    const response = await databases.listDocuments(databaseId, collectionId);
    return response.documents;
  } catch (error) {
    throw error;
  }
};

// ✅ Get Single Document by ID
export const getDocumentById = async (
  collectionId: string,
  documentId: string
) => {
  try {
    const response = await databases.getDocument(
      databaseId,
      collectionId,
      documentId
    );
    return response;
  } catch (error) {
    throw error;
  }
};

// ✅ Update Document
export const updateDocument = async (
  collectionId: string,
  documentId: string,
  data: Record<string, any>
) => {
  try {
    const response = await databases.updateDocument(
      databaseId,
      collectionId,
      documentId,
      data
    );
    return response;
  } catch (error) {
    throw error;
  }
};

// ✅ Delete Document
export const deleteDocument = async (
  collectionId: string,
  documentId: string
) => {
  try {
    const response = await databases.deleteDocument(
      databaseId,
      collectionId,
      documentId
    );
    return response;
  } catch (error) {
    throw error;
  }
};
