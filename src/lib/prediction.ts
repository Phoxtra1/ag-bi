
import { databases } from './appwrite';
import { DATABASE_ID, PREDICTIONS_COLLECTION_ID } from './database';
import { ID, Models } from 'appwrite';

export interface PredictionData {
  name: string;
  email: string;
  prompt: string;
  title?: string;
  description?: string;
  status?: 'pending' | 'verified' | 'rejected';
}

export async function createPrediction(data: PredictionData) {
  try {
    const res = await databases.createDocument(
      DATABASE_ID,
      PREDICTIONS_COLLECTION_ID,
      ID.unique(),
      {
        name: data.name,
        email: data.email,
        prompt: data.prompt,
        title: data.title || '',
        description: data.description || '',
        status: data.status || 'pending',
        submittedAt: new Date().toISOString(),
        submittedBy: data.email
      }
    );
    return res;
  } catch (err) {
    console.error('Error creating prediction:', err);
    throw err;
  }
}

export async function getPredictions(): Promise<Models.DocumentList<Models.Document>> {
  try {
    const res = await databases.listDocuments(DATABASE_ID, PREDICTIONS_COLLECTION_ID);
    return res;
  } catch (err) {
    console.error('Error fetching predictions:', err);
    throw err;
  }
}

export async function updatePredictionStatus(predictionId: string, status: 'pending' | 'verified' | 'rejected') {
  try {
    const res = await databases.updateDocument(
      DATABASE_ID,
      PREDICTIONS_COLLECTION_ID,
      predictionId,
      { status }
    );
    return res;
  } catch (err) {
    console.error('Error updating prediction status:', err);
    throw err;
  }
}

export async function deletePrediction(predictionId: string) {
  try {
    await databases.deleteDocument(
      DATABASE_ID,
      PREDICTIONS_COLLECTION_ID,
      predictionId
    );
  } catch (err) {
    console.error('Error deleting prediction:', err);
    throw err;
  }
}
