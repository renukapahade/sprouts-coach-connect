import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const db = await getDatabase()
    const coaches = db.collection("coaches")

    const coach = await coaches.findOne({ _id: new ObjectId(params.id) })

    if (!coach) {
      return NextResponse.json({ error: "Coach not found" }, { status: 404 })
    }

    return NextResponse.json(coach)
  } catch (error) {
    console.error("Error fetching coach:", error)
    return NextResponse.json({ error: "Failed to fetch coach" }, { status: 500 })
  }
}
