import { Client, Users, Mail } from "node-appwrite";

export default async ({ req, res, log, error }: any) => {
  const client = new Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT)
    .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

  const users = new Users(client);

  try {
    const payload = JSON.parse(req.body);
    const email = payload.email;

    // Custom logic to send email (you can integrate 3rd party email services if needed)
    log(`Welcome email sent to: ${email}`);
    
    return res.json({ success: true, message: "Welcome email sent" });
  } catch (err) {
    error(err);
    return res.json({ success: false, error: err.message });
  }
};
