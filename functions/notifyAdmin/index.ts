import { Client, Databases, Users, ID } from "node-appwrite";

export default async ({ req, res, log, error }: any) => {
  const client = new Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT)
    .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

  const users = new Users(client);
  const databases = new Databases(client);

  try {
    // example: send notification to admin
    log("New user or event triggered admin notification");

    // Logic here...
    return res.json({ success: true, message: "Admin notified" });
  } catch (err) {
    error(err);
    return res.json({ success: false, error: err.message });
  }
};
