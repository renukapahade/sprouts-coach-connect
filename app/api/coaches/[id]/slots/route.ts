import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { getCoachMonthlySlots } from "@/lib/slot-manager"
import { ObjectId } from "mongodb"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { searchParams } = new URL(request.url)
    const date = searchParams.get("date")

    if (!date) {
      return NextResponse.json({ error: "Date parameter is required" }, { status: 400 })
    }

    const db = await getDatabase()
    const coaches = db.collection("coaches")
    const sessions = db.collection("sessions")

    const coach = await coaches.findOne({ _id: new ObjectId(params.id) })

    if (!coach) {
      return NextResponse.json({ error: "Coach not found" }, { status: 404 })
    }

    // Check if coach has available monthly slots
    const bookingDate = new Date(date)
    const year = bookingDate.getFullYear()
    const month = bookingDate.getMonth() + 1

    const monthlySlotInfo = await getCoachMonthlySlots(params.id, year, month)

    if (monthlySlotInfo.availableSlots <= 0) {
      return NextResponse.json({
        slots: [],
        monthlySlotInfo,
        message: "No monthly slots available for this month",
      })
    }

    // Get day of week from date
    const dayOfWeek = new Date(date).toLocaleDateString("en-US", { weekday: "long" }).toLowerCase()

    const availability = coach.availability?.find((avail: any) => avail.day === dayOfWeek)

    if (!availability) {
      return NextResponse.json({ slots: [], monthlySlotInfo })
    }

    // Get existing sessions for the date
    const existingSessions = await sessions
      .find({
        coachId: params.id,
        date: date,
        status: { $in: ["confirmed", "pending"] },
      })
      .toArray()

    // Generate available slots
    const slots = generateTimeSlots(availability.startTime, availability.endTime, existingSessions)

    return NextResponse.json({ slots, monthlySlotInfo })
  } catch (error) {
    console.error("Error fetching slots:", error)
    return NextResponse.json({ error: "Failed to fetch slots" }, { status: 500 })
  }
}

function generateTimeSlots(startTime: string, endTime: string, sessions: any[]) {
  const slots = []
  const start = new Date(`2000-01-01T${startTime}:00`)
  const end = new Date(`2000-01-01T${endTime}:00`)

  while (start < end) {
    const slotStart = start.toTimeString().slice(0, 5)
    const slotEnd = new Date(start.getTime() + 60 * 60 * 1000).toTimeString().slice(0, 5)

    const isBooked = sessions.some((session) => session.startTime === slotStart)

    if (!isBooked) {
      slots.push({
        startTime: slotStart,
        endTime: slotEnd,
        available: true,
      })
    }

    start.setHours(start.getHours() + 1)
  }

  return slots
}
