import { type NextRequest, NextResponse } from "next/server"

const mockUser = {
  uid: "user-1",
  email: "john@example.com",
  name: "John Doe",
  role: "buyer",
  created_at: "2024-01-15T10:00:00Z",
  updated_at: "2024-01-15T10:00:00Z",
}

export async function GET() {
  return NextResponse.json(mockUser)
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const updatedUser = { ...mockUser, ...body, updated_at: new Date().toISOString() }
    return NextResponse.json(updatedUser)
  } catch (error) {
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 })
  }
}
