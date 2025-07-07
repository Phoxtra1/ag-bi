import { json } from '@appwrite/api'
import { registerUser } from '@/src/lep/auth' // adjust if path differs

export async function POST(req: Request) {
  const body = await req.json()
  const result = await registerUser(body)
  return json(result.data, { status: result.status })
}
