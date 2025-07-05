import React, { useEffect, useState } from "react";
import { databases } from "../lib/appwrite";
import { Query } from "appwrite";

const DashboardAdmin = () => {
  const [predictions, setPredictions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const DATABASE_ID = "amniva-db03";
  const COLLECTION_ID = "predictions-ava";

  useEffect(() => {
    const fetchAllPredictions = async () => {
      try {
        const predictionData = await databases.listDocuments(
          DATABASE_ID,
          COLLECTION_ID,
          [Query.orderDesc("$createdAt")]
        );
        setPredictions(predictionData.documents);
      } catch (err) {
        console.error("Failed to load predictions:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllPredictions();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading all predictions...</p>;

  return (
    <div className="max-w-6xl mx-auto mt-10 p-4">
      <h2 className="text-2xl font-bold mb-4 text-center">Admin – All Predictions</h2>

      {predictions.length === 0 ? (
        <p className="text-gray-600 text-center">No predictions submitted yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border text-sm text-left text-gray-700">
            <thead className="bg-gray-100 uppercase">
              <tr>
                <th className="px-4 py-2 border">#</th>
                <th className="px-4 py-2 border">Title</th>
                <th className="px-4 py-2 border">Description</th>
                <th className="px-4 py-2 border">Submitted By</th>
                <th className="px-4 py-2 border">Asset Link</th>
                <th className="px-4 py-2 border">Uploaded</th>
                <th className="px-4 py-2 border">Submitted At</th>
              </tr>
            </thead>
            <tbody>
              {predictions.map((prediction, index) => (
                <tr key={prediction.$id} className="bg-white border-b hover:bg-gray-50">
                  <td className="px-4 py-2 border">{index + 1}</td>
                  <td className="px-4 py-2 border">{prediction.title}</td>
                  <td className="px-4 py-2 border">{prediction.description?.slice(0, 50)}</td>
                  <td className="px-4 py-2 border">{prediction.submittedBy}</td>
                  <td className="px-4 py-2 border">
                    <a
                      href={prediction.assetLink}
                      className="text-blue-600 hover:underline"
                      target="_blank"
                      rel="noreferrer"
                    >
                      View
                    </a>
                  </td>
                  <td className="px-4 py-2 border">
                    {prediction.upload ? "✓" : "—"}
                  </td>
                  <td className="px-4 py-2 border">
                    {new Date(prediction.submittedAt || prediction.$createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default DashboardAdmin;
