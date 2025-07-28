/* eslint-disable @typescript-eslint/no-explicit-any */
import { Cashfree } from "cashfree-pg"

if (!process.env.CASHFREE_APP_ID || !process.env.CASHFREE_SECRET_KEY) {
  throw new Error("Missing Cashfree credentials")
}

const cashfree = new Cashfree(
  1,
  process.env.CASHFREE_APP_ID,
  process.env.CASHFREE_SECRET_KEY
)


type OrderData = {
  orderId: string
  amount: number
  customerName: string
  customerEmail: string
  customerPhone: string
}


export async function createPaymentSession(orderData: OrderData) {
  const safeCustomerId = orderData.customerEmail.replace(/[^a-zA-Z0-9_-]/g, "_")
  const request = {
    order_id: orderData.orderId,
    order_amount: orderData.amount,
    order_currency: "INR",
    customer_details: {
      customer_id: safeCustomerId,
      customer_name: orderData.customerName,
      customer_email: orderData.customerEmail,
      customer_phone: orderData.customerPhone,
    },
    order_meta: {
      return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/booking/success?order_id={order_id}`,
    },
  }

  try {
    const response = await cashfree.PGCreateOrder(request)
    return response.data
  } catch (error: any) {
    console.error("Cashfree order creation failed:", error.response?.data || error.message)
    throw new Error("Failed to create payment session")
  }
}

export async function verifyPayment(orderId: string) {
  try {
    const response = await cashfree.PGFetchOrder(orderId)
    return response.data
  } catch (error: any) {
    console.error("Payment verification failed:", error.response?.data || error.message)
    throw new Error("Failed to verify payment")
  }
}

