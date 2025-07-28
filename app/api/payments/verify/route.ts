import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { verifyPayment } from "@/lib/cashfree"

export async function POST(request: NextRequest) {
  try {
    const { orderId } = await request.json()

    const db = await getDatabase()
    const subscriptions = db.collection("subscriptions")

    const subscription = await subscriptions.findOne({ orderId })

    if (!subscription) {
      return NextResponse.json({ error: "Subscription not found" }, { status: 404 })
    }

    const paymentData = await verifyPayment(orderId)
    console.log("paymentData", paymentData)

    if (paymentData && paymentData.order_status === "PAID") {
      await subscriptions.updateOne(
        { orderId },
        {
          $set: {
            status: "active",
            paymentStatus: "completed",
            paymentId: paymentData.cf_order_id,
            updatedAt: new Date(),
          },
        },
      )

      return NextResponse.json({
        success: true,
        message: "Payment verified and subscription activated",
      })
    } else {
      await subscriptions.updateOne(
        { orderId },
        {
          $set: {
            status: "cancelled",
            paymentStatus: "failed",
            updatedAt: new Date(),
          },
        },
      )

      return NextResponse.json({ error: "Payment verification failed" }, { status: 400 })
    }

  } catch (error) {
    console.error("Error verifying payment:", error)
    return NextResponse.json({ error: "Failed to verify payment" }, { status: 500 })
  }
}
