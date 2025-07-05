// lib/predictions.ts
import { databases } from './appwrite';
import { DATABASE_ID, PREDICTIONS_COLLECTION_ID } from './database';
import { ID, Models } from 'appwrite';

export async function createPrediction(data: {
  name: string;
  email: string;
  prompt: string;
}) {
  try {
    const res = await databases.createDocument(
      DATABASE_ID,
      PREDICTIONS_COLLECTION_ID,
      ID.unique(),
      {
        name: data.name,
        email: data.email,
        prompt: data.prompt,
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
