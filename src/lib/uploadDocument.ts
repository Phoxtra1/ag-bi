
import { storage } from './appwrite';
import { VERIFICATION_BUCKET_ID } from './database';
import { ID } from 'appwrite';

/**
 * Uploads a document (PDF/image/etc.) to Appwrite Storage
 * @param file - The actual File object (e.g., from <input type="file" />)
 * @returns File ID and preview URL
 */
export const uploadDocument = async (file: File) => {
  try {
    const response = await storage.createFile(
      VERIFICATION_BUCKET_ID,
      ID.unique(),
      file
    );

    const previewUrl = storage.getFilePreview(VERIFICATION_BUCKET_ID, response.$id);

    return {
      fileId: response.$id,
      name: response.name,
      previewUrl: previewUrl.toString(),
    };
  } catch (error) {
    console.error('❌ Upload failed:', error);
    throw error;
  }
};
