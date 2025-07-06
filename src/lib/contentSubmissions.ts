
import { databases, storage } from './appwrite';
import { DATABASE_ID, CONTENT_SUBMISSIONS_COLLECTION_ID, CONTENT_BUCKET_ID } from './database';
import { ID } from 'appwrite';

export interface ContentSubmissionData {
  title: string;
  link?: string;
  type: 'article' | 'video' | 'message' | 'other';
  content?: string;
  submitterName: string;
  submitterEmail: string;
  status?: 'pending' | 'approved' | 'rejected';
  attachments?: string[]; // Array of file IDs
}

// Create a new content submission
export async function createContentSubmission(data: ContentSubmissionData) {
  try {
    const response = await databases.createDocument(
      DATABASE_ID,
      CONTENT_SUBMISSIONS_COLLECTION_ID,
      ID.unique(),
      {
        title: data.title,
        link: data.link || '',
        type: data.type,
        content: data.content || '',
        submitterName: data.submitterName,
        submitterEmail: data.submitterEmail,
        status: data.status || 'pending',
        attachments: data.attachments || [],
        submissionTime: new Date().toISOString()
      }
    );
    return response;
  } catch (error) {
    console.error('Error creating content submission:', error);
    throw error;
  }
}

// Fetch all content submissions
export async function listContentSubmissions() {
  try {
    const response = await databases.listDocuments(
      DATABASE_ID,
      CONTENT_SUBMISSIONS_COLLECTION_ID
    );
    return response.documents;
  } catch (error) {
    console.error('Error fetching content submissions:', error);
    throw error;
  }
}

// Update content submission status
export async function updateContentSubmissionStatus(submissionId: string, status: 'pending' | 'approved' | 'rejected') {
  try {
    const response = await databases.updateDocument(
      DATABASE_ID,
      CONTENT_SUBMISSIONS_COLLECTION_ID,
      submissionId,
      { status }
    );
    return response;
  } catch (error) {
    console.error('Error updating content submission status:', error);
    throw error;
  }
}

// Delete content submission
export async function deleteContentSubmission(submissionId: string) {
  try {
    await databases.deleteDocument(
      DATABASE_ID,
      CONTENT_SUBMISSIONS_COLLECTION_ID,
      submissionId
    );
  } catch (error) {
    console.error('Error deleting content submission:', error);
    throw error;
  }
}

// Upload content attachment
export async function uploadContentAttachment(file: File) {
  try {
    const response = await storage.createFile(
      CONTENT_BUCKET_ID,
      ID.unique(),
      file
    );
    return response;
  } catch (error) {
    console.error('Error uploading content attachment:', error);
    throw error;
  }
}
