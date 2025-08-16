import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { uid: string } }) {
  const analytics = {
    total_requests: 15420,
    monthly_requests: 2340,
    revenue: 1250.3,
    subscribers: 45,
    usage_by_day: Array.from({ length: 30 }, (_, i) => ({
      date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      requests: Math.floor(Math.random() * 100) + 50,
    })),
  }

  return NextResponse.json(analytics)
}
