
import { databases, storage } from './appwrite';
import { DATABASE_ID, API_REQUESTS_COLLECTION_ID, VERIFICATION_BUCKET_ID } from './database';
import { ID } from 'appwrite';

export interface ApiRequestData {
  fullName: string;
  email: string;
  organizationName: string;
  sector: 'Academic' | 'Media' | 'Government' | 'Research' | 'Civil' | 'Other';
  intendedUse: string;
  verificationDocument?: string; // File ID from storage
  status?: 'pending' | 'approved' | 'rejected' | 'more-info-needed';
  internalNotes?: string;
}

// Create a new API access request
export async function createApiRequest(data: ApiRequestData) {
  try {
    const response = await databases.createDocument(
      DATABASE_ID,
      API_REQUESTS_COLLECTION_ID,
      ID.unique(),
      {
        fullName: data.fullName,
        email: data.email,
        organizationName: data.organizationName,
        sector: data.sector,
        intendedUse: data.intendedUse,
        verificationDocument: data.verificationDocument || '',
        status: data.status || 'pending',
        internalNotes: data.internalNotes || '',
        submissionDate: new Date().toISOString()
      }
    );
    return response;
  } catch (error) {
    console.error('Error creating API request:', error);
    throw error;
  }
}

// Fetch all API requests
export async function listApiRequests() {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      API_REQUESTS_COLLECTION_ID
    );
    return response.documents;
  } catch (error) {
    console.error('Error fetching API requests:', error);
    throw error;
  }
}

// Update API request status
export async function updateApiRequestStatus(requestId: string, status: 'pending' | 'approved' | 'rejected' | 'more-info-needed', internalNotes?: string) {
  try {
    const updateData: any = { status };
    if (internalNotes !== undefined) {
      updateData.internalNotes = internalNotes;
    }
    
    const response = await databases.updateDocument(
      DATABASE_ID,
      API_REQUESTS_COLLECTION_ID,
      requestId,
      updateData
    );
    return response;
  } catch (error) {
    console.error('Error updating API request status:', error);
    throw error;
  }
}

// Delete API request
export async function deleteApiRequest(requestId: string) {
  try {
    await databases.deleteDocument(
      DATABASE_ID,
      API_REQUESTS_COLLECTION_ID,
      requestId
    );
  } catch (error) {
    console.error('Error deleting API request:', error);
    throw error;
  }
}

// Upload verification document
export async function uploadVerificationDocument(file: File) {
  try {
    const response = await storage.createFile(
      VERIFICATION_BUCKET_ID,
      ID.unique(),
      file
    );
    return response;
  } catch (error) {
    console.error('Error uploading verification document:', error);
    throw error;
  }
}

// Get file preview URL
export function getFilePreviewUrl(fileId: string) {
  try {
    return storage.getFilePreview(VERIFICATION_BUCKET_ID, fileId);
  } catch (error) {
    console.error('Error getting file preview:', error);
    throw error;
  }
}

// Get file download URL
export function getFileDownloadUrl(fileId: string) {
  try {
    return storage.getFileDownload(VERIFICATION_BUCKET_ID, fileId);
  } catch (error) {
    console.error('Error getting file download:', error);
    throw error;
  }
}
