// components/DashboardUser.tsx
import React, { useEffect, useState } from "react";
import { databases, storage, databaseId, predictionCollectionId, bucketId } from "@/lib/appwrite";
import { getCurrentUser } from "@/lib/auth"; // make sure auth.ts has this
import { ID } from "appwrite";

interface Prediction {
  $id: string;
  title: string;
  description: string;
  submittedBy: string;
  submittedAt: string;
  upload?: string;
  status?: string;
}

const DashboardUser = () => {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUserPredictions();
  }, []);

  const fetchUserPredictions = async () => {
    setLoading(true);
    try {
      const user = await getCurrentUser();
      if (!user) return;

      const response = await databases.listDocuments(databaseId, predictionCollectionId, [
        {
          key: "submittedBy",
          operator: "equal",
          value: user.email,
        },
      ]);

      setPredictions(response.documents);
    } catch (error) {
      console.error("Error fetching user predictions:", error);
    } finally {
      setLoading(false);
    }
  };

  const deletePrediction = async (id: string) => {
    try {
      await databases.deleteDocument(databaseId, predictionCollectionId, id);
      fetchUserPredictions();
    } catch (error) {
      console.error("Error deleting prediction:", error);
    }
  };

  const getFilePreviewUrl = (fileId: string) => {
    return storage.getFileView(bucketId, fileId).href;
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">My Predictions</h2>
      {loading ? (
        <p>Loading your predictions...</p>
      ) : predictions.length === 0 ? (
        <p>No predictions submitted yet.</p>
      ) : (
        <table className="min-w-full bg-white shadow rounded-lg overflow-hidden">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-2">Title</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Submitted At</th>
              <th className="px-4 py-2">File</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {predictions.map((prediction) => (
              <tr key={prediction.$id} className="border-t text-center">
                <td className="px-4 py-2">{prediction.title}</td>
                <td className="px-4 py-2 capitalize">{prediction.status || "pending"}</td>
                <td className="px-4 py-2">{new Date(prediction.submittedAt).toLocaleDateString()}</td>
                <td className="px-4 py-2">
                  {prediction.upload ? (
                    <a
                      href={getFilePreviewUrl(prediction.upload)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      View
                    </a>
                  ) : (
                    "No File"
                  )}
                </td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => deletePrediction(prediction.$id)}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default DashboardUser;
