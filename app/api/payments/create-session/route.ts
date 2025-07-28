import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { createPaymentSession } from "@/lib/cashfree"
import { ObjectId } from "mongodb"

export async function POST(request: NextRequest) {
  try {
    const { subscriptionId } = await request.json()

    if (!subscriptionId) {
      return NextResponse.json({ error: "Subscription ID is required" }, { status: 400 })
    }

    const db = await getDatabase()
    const subscriptions = db.collection("subscriptions")

    const subscription = await subscriptions.findOne({ _id: new ObjectId(String(subscriptionId)) })

    if (!subscription) {
      return NextResponse.json({ error: "Subscription not found" }, { status: 404 })
    }

    if (subscription.status !== "pending") {
      return NextResponse.json({ error: "Subscription is not in pending status" }, { status: 400 })
    }

    const orderId = `SUB_${subscriptionId}_${Date.now()}`

    const paymentSession = await createPaymentSession({
      orderId,
      amount: subscription.price,
      customerName: subscription.userName,
      customerEmail: subscription.userEmail,
      customerPhone: subscription.userPhone,
    })

    await subscriptions.updateOne(
      { _id: new ObjectId(String(subscriptionId)) },
      {
        $set: {
          orderId,
          paymentSessionId: paymentSession.payment_session_id,
          updatedAt: new Date(),
        },
      },
    )

    return NextResponse.json({
      paymentSessionId: paymentSession.payment_session_id,
      orderId,
    })
  } catch (error) {
    console.error("Error creating payment session:", error)
    return NextResponse.json({ error: "Failed to create payment session" }, { status: 500 })
  }
}
