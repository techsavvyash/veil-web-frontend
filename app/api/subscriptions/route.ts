import { NextResponse } from "next/server"

const mockSubscriptions = [
  {
    uid: "sub-1",
    user_uid: "user-1",
    api_uid: "api-1",
    status: "active",
    created_at: "2024-01-15T10:00:00Z",
    updated_at: "2024-01-15T10:00:00Z",
  },
]

export async function GET() {
  return NextResponse.json(mockSubscriptions)
}
