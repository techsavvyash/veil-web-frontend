import { type NextRequest, NextResponse } from "next/server"
import { mockUsers } from "@/lib/mock-data"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, name, role } = body

    // Simulate validation
    if (!email || !password || !name || !role) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = mockUsers.find((user) => user.email === email)
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 409 })
    }

    // Create new user
    const newUser = {
      uid: `user-${Date.now()}`,
      email,
      name,
      role: role as "buyer" | "seller",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    mockUsers.push(newUser)

    // Generate mock JWT token
    const token = `mock_jwt_token_${newUser.uid}`

    return NextResponse.json({
      message: "User registered successfully",
      user: newUser,
      token,
    })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
