import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest, { params }: { params: { uid: string } }) {
  try {
    const regeneratedKey = {
      uid: params.uid,
      subscription_uid: "sub-1",
      key: `veil_sk_${Math.random().toString(36).substring(2, 15)}`,
      name: "Production Key",
      last_used: null,
      created_at: "2024-01-15T10:00:00Z",
      updated_at: new Date().toISOString(),
    }

    return NextResponse.json(regeneratedKey)
  } catch (error) {
    return NextResponse.json({ error: "Failed to regenerate API key" }, { status: 500 })
  }
}
