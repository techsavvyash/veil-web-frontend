import { type NextRequest, NextResponse } from "next/server"
import { mockApis } from "@/lib/mock-data"

export async function GET(request: NextRequest, { params }: { params: { uid: string } }) {
  try {
    const api = mockApis.find((a) => a.uid === params.uid)

    if (!api) {
      return NextResponse.json({ error: "API not found" }, { status: 404 })
    }

    return NextResponse.json({ api })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
