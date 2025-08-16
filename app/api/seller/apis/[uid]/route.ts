import { type NextRequest, NextResponse } from "next/server"
import { mockApis } from "@/lib/mock-data"

export async function GET(request: NextRequest, { params }: { params: { uid: string } }) {
  const api = mockApis.find((a) => a.uid === params.uid)
  if (!api) {
    return NextResponse.json({ error: "API not found" }, { status: 404 })
  }
  return NextResponse.json({ api })
}

export async function PUT(request: NextRequest, { params }: { params: { uid: string } }) {
  try {
    const body = await request.json()
    const api = mockApis.find((a) => a.uid === params.uid)
    if (!api) {
      return NextResponse.json({ error: "API not found" }, { status: 404 })
    }

    const updatedApi = { ...api, ...body, updated_at: new Date().toISOString() }
    return NextResponse.json(updatedApi)
  } catch (error) {
    return NextResponse.json({ error: "Failed to update API" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { uid: string } }) {
  return NextResponse.json({ message: "API deleted successfully" })
}
