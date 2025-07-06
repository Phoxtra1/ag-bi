
import { databases } from "./appwrite";
import { ID } from "appwrite";
import { DATABASE_ID, PREDICTIONS_COLLECTION_ID } from "./database";

export async function createPrediction(name: string, email: string, subject: string, details: string) {
  try {
    const response = await databases.createDocument(
      DATABASE_ID,
      PREDICTIONS_COLLECTION_ID,
      ID.unique(),
      {
        name,
        email,
        subject,
        details,
        status: 'pending',
        submittedAt: new Date().toISOString(),
        submittedBy: email
      }
    );

    return response;
  } catch (error) {
    console.error("Prediction submission failed:", error);
    throw error;
  }
}
