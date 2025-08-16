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

export async function GET(request: NextRequest, { params }: { params: { uid: string } }) {
  const key = mockApiKeys.find((k) => k.uid === params.uid)
  if (!key) {
    return NextResponse.json({ error: "API key not found" }, { status: 404 })
  }
  return NextResponse.json(key)
}

export async function PUT(request: NextRequest, { params }: { params: { uid: string } }) {
  try {
    const body = await request.json()
    const key = mockApiKeys.find((k) => k.uid === params.uid)
    if (!key) {
      return NextResponse.json({ error: "API key not found" }, { status: 404 })
    }

    const updatedKey = { ...key, ...body, updated_at: new Date().toISOString() }
    return NextResponse.json(updatedKey)
  } catch (error) {
    return NextResponse.json({ error: "Failed to update API key" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { uid: string } }) {
  return NextResponse.json({ message: "API key deleted successfully" })
}
