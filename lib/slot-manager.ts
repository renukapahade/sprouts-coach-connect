import { getDatabase } from "./mongodb"
import { ObjectId } from "mongodb"

export async function getCoachMonthlySlots(coachId: string, year: number, month: number) {
  const db = await getDatabase()
  const coaches = db.collection("coaches")
  const sessions = db.collection("sessions")

  const coach = await coaches.findOne({ _id: new ObjectId(coachId) })
  if (!coach) {
    throw new Error("Coach not found")
  }

  // Get sessions booked for this month
  const startDate = new Date(year, month - 1, 1)
  const endDate = new Date(year, month, 0)

  const bookedSessions = await sessions.countDocuments({
    coachId,
    date: {
      $gte: startDate.toISOString().split("T")[0],
      $lte: endDate.toISOString().split("T")[0],
    },
    status: { $in: ["confirmed", "pending"] },
  })

  return {
    totalSlots: coach.monthlySlots,
    usedSlots: bookedSessions,
    availableSlots: coach.monthlySlots - bookedSessions,
  }
}

export async function canBookSlot(coachId: string, date: string): Promise<boolean> {
  const bookingDate = new Date(date)
  const year = bookingDate.getFullYear()
  const month = bookingDate.getMonth() + 1

  const slotInfo = await getCoachMonthlySlots(coachId, year, month)
  return slotInfo.availableSlots > 0
}

export async function getSubscriptionSessions(subscriptionId: string) {
  const db = await getDatabase()
  const sessions = db.collection("sessions")
  const subscriptions = db.collection("subscriptions")

  const subscription = await subscriptions.findOne({ _id: new ObjectId(subscriptionId) })
  if (!subscription) {
    throw new Error("Subscription not found")
  }

  const bookedSessions = await sessions.countDocuments({
    subscriptionId,
    status: { $in: ["confirmed", "pending"] },
  })

  return {
    totalSessions: subscription.totalSessions,
    usedSessions: bookedSessions,
    remainingSessions: subscription.totalSessions - bookedSessions,
  }
}
