
import { storage } from '@/lib/appwrite';
import { ID } from 'appwrite';

/**
 * Uploads a document (PDF/image/etc.) to Appwrite Storage
 * @param file - The actual File object (e.g., from <input type="file" />)
 * @returns File ID and preview URL
 */
export const uploadDocument = async (file: File) => {
  try {
    const response = await storage.createFile(
      'verification-ava', // ✅ Your corrected bucket ID
      ID.unique(),
      file
    );

    const previewUrl = storage.getFilePreview('verification-ava', response.$id);

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
