import { NextResponse } from "next/server"
import { mockCategories } from "@/lib/mock-data"

export async function GET() {
  try {
    return NextResponse.json({ categories: mockCategories })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
