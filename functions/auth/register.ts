
import { account } from '@/src/lib/appwrite';
import { ID } from 'appwrite';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password, name } = body;

    if (!email || !password || !name) {
      return new Response(
        JSON.stringify({ error: 'Email, password, and name are required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const user = await account.create(ID.unique(), email, password, name);
    
    // Auto-login after registration
    const session = await account.createEmailPasswordSession(email, password);
    
    return new Response(
      JSON.stringify({ success: true, user, session }),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('Registration function error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Registration failed' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
