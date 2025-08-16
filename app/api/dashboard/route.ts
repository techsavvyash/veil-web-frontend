import { NextResponse } from "next/server"

export async function GET() {
  const dashboardData = {
    total_subscriptions: 5,
    active_keys: 8,
    monthly_usage: 12450,
    monthly_spend: 89.5,
  }

  return NextResponse.json(dashboardData)
}
