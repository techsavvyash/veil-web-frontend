import { type NextRequest, NextResponse } from "next/server"

const mockApiKeys = [
  {
    uid: "key-1",
    subscription_uid: "sub-1",
    key: "veil_sk_test_1234567890abcdef",
    name: "Production Key",
    last_used: "2024-01-16T14:30:00Z",
    created_at: "2024-01-15T10:00:00Z",
    updated_at: "2024-01-15T10:00:00Z",
  },
]

export async function GET() {
  return NextResponse.json(mockApiKeys)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const newKey = {
      uid: `key-${Date.now()}`,
      subscription_uid: body.subscription_uid,
      key: `veil_sk_${Math.random().toString(36).substring(2, 15)}`,
      name: body.name,
      last_used: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    return NextResponse.json(newKey)
  } catch (error) {
    return NextResponse.json({ error: "Failed to create API key" }, { status: 500 })
  }
}
