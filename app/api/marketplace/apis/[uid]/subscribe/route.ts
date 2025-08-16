import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest, { params }: { params: { uid: string } }) {
  try {
    const body = await request.json()
    const subscription = {
      uid: `sub-${Date.now()}`,
      user_uid: "user-1",
      api_uid: params.uid,
      status: "active",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    return NextResponse.json(subscription)
  } catch (error) {
    return NextResponse.json({ error: "Failed to create subscription" }, { status: 500 })
  }
}
