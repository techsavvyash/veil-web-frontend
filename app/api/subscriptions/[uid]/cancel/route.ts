import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest, { params }: { params: { uid: string } }) {
  return NextResponse.json({ message: "Subscription cancelled successfully" })
}
