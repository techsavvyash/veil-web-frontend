import { type NextRequest, NextResponse } from "next/server"
import { mockApis } from "@/lib/mock-data"

export async function GET() {
  return NextResponse.json({ apis: mockApis })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const newApi = {
      uid: `api-${Date.now()}`,
      name: body.name,
      description: body.description,
      documentation: body.documentation || "",
      base_url: body.base_url,
      version: body.version,
      status: "pending",
      seller_uid: "user-2",
      category_uid: body.category_uid,
      pricing_model: body.pricing_model,
      base_price: body.base_price || 0,
      price_per_request: body.price_per_request || 0,
      rate_limit: body.rate_limit || 1000,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      average_rating: 0,
      total_ratings: 0,
      total_subscribers: 0,
    }

    return NextResponse.json(newApi)
  } catch (error) {
    return NextResponse.json({ error: "Failed to create API" }, { status: 500 })
  }
}
