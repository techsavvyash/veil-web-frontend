import { type NextRequest, NextResponse } from "next/server"
import { mockApis } from "@/lib/mock-data"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search")
    const category = searchParams.get("category")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")

    let filteredApis = [...mockApis]

    // Apply search filter
    if (search) {
      filteredApis = filteredApis.filter(
        (api) =>
          api.name.toLowerCase().includes(search.toLowerCase()) ||
          api.description.toLowerCase().includes(search.toLowerCase()),
      )
    }

    // Apply category filter
    if (category) {
      filteredApis = filteredApis.filter((api) => api.category_uid === category)
    }

    // Apply pagination
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedApis = filteredApis.slice(startIndex, endIndex)

    return NextResponse.json({
      apis: paginatedApis,
      total: filteredApis.length,
      page,
      limit,
      total_pages: Math.ceil(filteredApis.length / limit),
    })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
