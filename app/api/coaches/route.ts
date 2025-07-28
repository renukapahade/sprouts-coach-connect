import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { CoachSchema } from "@/lib/validations"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const specialization = searchParams.get("specialization")
    const search = searchParams.get("search")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const skip = (page - 1) * limit

    const db = await getDatabase()
    const coaches = db.collection("coaches")

    // Build filter
    const filter: Record<string, unknown> = {}

    if (specialization && specialization !== "all") {
      filter.specialization = { $in: [specialization, "both"] }
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { bio: { $regex: search, $options: "i" } },
        { specialization: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
      ]
    }

    const [coachList, total] = await Promise.all([
      coaches.find(filter).skip(skip).limit(limit).toArray(),
      coaches.countDocuments(filter),
    ])

    return NextResponse.json({
      data: coachList,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching coaches:", error)
    return NextResponse.json({ error: "Failed to fetch coaches" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = CoachSchema.parse(body)

    const db = await getDatabase()
    const coaches = db.collection("coaches")

    const result = await coaches.insertOne({
      ...validatedData,
      rating: 4.8, // Default rating
      reviewCount: 0, // Default review count
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    return NextResponse.json(
      {
        data: { id: result.insertedId },
        message: "Coach created successfully",
      },
      { status: 201 },
    )
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json({ error: "Validation failed", details: error }, { status: 400 })
    }
    console.error("Error creating coach:", error)
    return NextResponse.json({ error: "Failed to create coach" }, { status: 500 })
  }
}
