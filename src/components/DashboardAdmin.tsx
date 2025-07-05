// components/DashboardAdmin.tsx
import React, { useEffect, useState } from "react";
import { databases, storage, databaseId, predictionCollectionId, bucketId } from "@/lib/appwrite"; // adjust path if needed
import { ID, Permission, Role } from "appwrite";

interface Prediction {
  $id: string;
  title: string;
  description: string;
  submittedBy: string;
  submittedAt: string;
  upload?: string; // file ID from storage
  status?: string;
}

const DashboardAdmin = () => {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPredictions();
  }, []);

  const fetchPredictions = async () => {
    setLoading(true);
    try {
      const response = await databases.listDocuments(databaseId, predictionCollectionId);
      setPredictions(response.documents);
    } catch (error) {
      console.error("Error fetching predictions:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      await databases.updateDocument(databaseId, predictionCollectionId, id, {
        status,
      });
      fetchPredictions();
    } catch (error) {
      console.error(`Error updating status to ${status}:`, error);
    }
  };

  const deletePrediction = async (id: string) => {
    try {
      await databases.deleteDocument(databaseId, predictionCollectionId, id);
      fetchPredictions();
    } catch (error) {
      console.error("Error deleting prediction:", error);
    }
  };

  const getFilePreviewUrl = (fileId: string) => {
    return storage.getFileView(bucketId, fileId).href;
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>

      {loading ? (
        <p>Loading predictions...</p>
      ) : (
        <table className="min-w-full bg-white shadow rounded-lg overflow-hidden">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-2">Title</th>
              <th className="px-4 py-2">Submitted By</th>
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Evidence</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {predictions.map((prediction) => (
              <tr key={prediction.$id} className="border-t text-center">
                <td className="px-4 py-2">{prediction.title}</td>
                <td className="px-4 py-2">{prediction.submittedBy}</td>
                <td className="px-4 py-2">{new Date(prediction.submittedAt).toLocaleDateString()}</td>
                <td className="px-4 py-2 capitalize">{prediction.status || "pending"}</td>
                <td className="px-4 py-2">
                  {prediction.upload ? (
                    <a
                      href={getFilePreviewUrl(prediction.upload)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      View File
                    </a>
                  ) : (
                    "No File"
                  )}
                </td>
                <td className="px-4 py-2 space-x-2">
                  <button
                    onClick={() => updateStatus(prediction.$id, "verified")}
                    className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                  >
                    Verify
                  </button>
                  <button
                    onClick={() => updateStatus(prediction.$id, "rejected")}
                    className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => deletePrediction(prediction.$id)}
                    className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
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

export default DashboardAdmin;
