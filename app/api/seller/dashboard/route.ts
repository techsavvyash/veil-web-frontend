import { NextResponse } from "next/server"

export async function GET() {
  const dashboardData = {
    total_apis: 3,
    total_subscribers: 4230,
    total_revenue: 15420.5,
    monthly_revenue: 2340.75,
    recent_subscriptions: [
      {
        uid: "sub-1",
        user_uid: "user-1",
        api_uid: "api-1",
        status: "active",
        created_at: "2024-01-15T10:00:00Z",
      },
    ],
  }

  return NextResponse.json(dashboardData)
}
