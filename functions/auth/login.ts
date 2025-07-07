import { json } from '@appwrite/api'
import { loginUser } from '@/src/lep/auth'

export async function POST(req: Request) {
  const body = await req.json()
  const result = await loginUser(body)
  return json(result.data, { status: result.status })
}
