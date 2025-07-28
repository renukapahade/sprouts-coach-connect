import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { PackageBookingSchema } from "@/lib/validations"
import { ObjectId } from "mongodb"
import type { Package } from "@/types"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = PackageBookingSchema.parse(body)

    const db = await getDatabase()
    const coaches = db.collection("coaches")
    const users = db.collection("users")
    const subscriptions = db.collection("subscriptions")

    // Get coach and package details
    const coach = await coaches.findOne({ _id: new ObjectId(validatedData.coachId) })
    if (!coach) {
      return NextResponse.json({ error: "Coach not found" }, { status: 404 })
    }

    const selectedPackage = coach.packages?.find((pkg: Package) => pkg.id === validatedData.packageId)
    if (!selectedPackage) {
      return NextResponse.json({ error: "Package not found" }, { status: 404 })
    }

    // Create or get user
    let user = await users.findOne({ email: validatedData.clientEmail })
    if (!user) {
      const newUser = {
        name: validatedData.clientName,
        email: validatedData.clientEmail,
        phone: validatedData.clientPhone,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      const userResult = await users.insertOne(newUser)
      user = { ...newUser, _id: userResult.insertedId }
    }

    // Calculate subscription dates
    const startDate = new Date()
    const endDate = new Date()
    endDate.setMonth(endDate.getMonth() + selectedPackage.duration)

    const subscription = {
      userId: user._id.toString(),
      userName: user.name,
      userEmail: user.email,
      userPhone: user.phone,
      coachId: validatedData.coachId,
      coachName: coach.name,
      packageId: selectedPackage.id,
      packageName: selectedPackage.name,
      duration: selectedPackage.duration,
      totalSessions: selectedPackage.totalSessions,
      usedSessions: 0,
      price: selectedPackage.price,
      startDate,
      endDate,
      status: "pending" as const,
      paymentStatus: "pending" as const,
      notes: validatedData.notes,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await subscriptions.insertOne(subscription)

    return NextResponse.json(
      {
        data: { ...subscription, _id: result.insertedId },
        message: "Package booking created successfully",
      },
      { status: 201 },
    )
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json({ error: "Validation failed", details: error }, { status: 400 })
    }
    console.error("Error creating subscription:", error)
    return NextResponse.json({ error: "Failed to create subscription" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userEmail = searchParams.get("userEmail")

    if (!userEmail) {
      return NextResponse.json({ error: "User email is required" }, { status: 400 })
    }

    const db = await getDatabase()
    const subscriptions = db.collection("subscriptions")

    const userSubscriptions = await subscriptions.find({ userEmail }).sort({ createdAt: -1 }).toArray()

    return NextResponse.json({ data: userSubscriptions })
  } catch (error) {
    console.error("Error fetching subscriptions:", error)
    return NextResponse.json({ error: "Failed to fetch subscriptions" }, { status: 500 })
  }
}
