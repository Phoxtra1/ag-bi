
import { Client, Account } from 'appwrite';

// Initialize Appwrite client for server-side function
const client = new Client()
  .setEndpoint(process.env.APPWRITE_ENDPOINT || 'https://nyc.cloud.appwrite.io/v1')
  .setProject(process.env.APPWRITE_PROJECT_ID || 'amniva-ri03')
  .setKey(process.env.APPWRITE_API_KEY || '');

const account = new Account(client);

export default async ({ req, res }: { req: any; res: any }) => {
  try {
    if (req.method !== 'POST') {
      return res.json({ error: 'Method not allowed' }, 405);
    }

    const { email, password } = JSON.parse(req.body || '{}');

    if (!email || !password) {
      return res.json({ error: 'Email and password are required' }, 400);
    }

    const session = await account.createEmailPasswordSession(email, password);
    
    return res.json({ success: true, session }, 200);
  } catch (error: any) {
    console.error('Login function error:', error);
    return res.json({ error: error.message || 'Login failed' }, 400);
  }
};
