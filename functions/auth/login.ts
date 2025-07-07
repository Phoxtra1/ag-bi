
import { account } from '@/src/lib/appwrite';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return new Response(
        JSON.stringify({ error: 'Email and password are required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const session = await account.createEmailPasswordSession(email, password);
    
    return new Response(
      JSON.stringify({ success: true, session }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('Login function error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Login failed' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
