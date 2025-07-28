import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { PackageBookingSchema } from "@/lib/validations"
import { ObjectId } from "mongodb"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = PackageBookingSchema.parse(body)

    const db = await getDatabase()
    const bookings = db.collection("bookings")
    const coaches = db.collection("coaches")

    // Check if coach exists
    const coach = await coaches.findOne({ _id: new ObjectId(validatedData.coachId) })
    if (!coach) {
      return NextResponse.json({ error: "Coach not found" }, { status: 404 })
    }

    // Check if slot is available
    const existingBooking = await bookings.findOne({
      coachId: validatedData.coachId,
      status: { $in: ["confirmed", "pending"] },
    })

    if (existingBooking) {
      return NextResponse.json({ error: "Slot is already booked" }, { status: 409 })
    }

    const booking = {
      ...validatedData,
      status: "pending",
      amount: coach.hourlyRate,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await bookings.insertOne(booking)

    return NextResponse.json(
      {
        id: result.insertedId,
        booking: { ...booking, _id: result.insertedId },
        message: "Booking created successfully",
      },
      { status: 201 },
    )
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json({ error: "Validation failed", details: error }, { status: 400 })
    }
    console.error("Error creating booking:", error)
    return NextResponse.json({ error: "Failed to create booking" }, { status: 500 })
  }
}
