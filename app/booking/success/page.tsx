"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, XCircle, Loader2, Package, Calendar } from "lucide-react"
import { apiClient } from "@/lib/api-client"

export default function BookingSuccessPage() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get("order_id")
  const [verificationStatus, setVerificationStatus] = useState<"loading" | "success" | "failed">("loading")

  useEffect(() => {
    if (orderId) {
      verifyPayment()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId])

  const verifyPayment = async () => {
    try {
      const response = await apiClient.verifyPayment(orderId!)

      if (response.success) {
        setVerificationStatus("success")
        // You could fetch subscription details here if needed
      } else {
        setVerificationStatus("failed")
      }
    } catch (error) {
      console.error("Payment verification error:", error)
      setVerificationStatus("failed")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-0 bg-white/80 backdrop-blur-sm shadow-2xl">
        <CardHeader className="text-center">
          {verificationStatus === "loading" && (
            <>
              <Loader2 className="h-16 w-16 animate-spin text-blue-600 mx-auto mb-4" />
              <CardTitle className="text-2xl">Verifying Payment...</CardTitle>
              <CardDescription className="text-base">Please wait while we confirm your booking</CardDescription>
            </>
          )}

          {verificationStatus === "success" && (
            <>
              <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-12 w-12 text-white" />
              </div>
              <CardTitle className="text-2xl text-green-600 mb-2">Package Booked Successfully!</CardTitle>
              <CardDescription className="text-base">
                Your training package has been activated and is ready to use
              </CardDescription>
            </>
          )}

          {verificationStatus === "failed" && (
            <>
              <div className="w-20 h-20 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <XCircle className="h-12 w-12 text-white" />
              </div>
              <CardTitle className="text-2xl text-red-600 mb-2">Payment Failed</CardTitle>
              <CardDescription className="text-base">
                There was an issue processing your payment. Please try again.
              </CardDescription>
            </>
          )}
        </CardHeader>

        <CardContent className="text-center space-y-6">
          {verificationStatus === "success" && (
            <div className="space-y-4">
              <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Package className="h-5 w-5 text-green-600" />
                  <span className="font-semibold text-green-600">What&apos;s Next?</span>
                </div>
                <p className="text-sm text-gray-700">
                  You can now book individual sessions from your package through your dashboard.
                </p>
              </div>

              <div className="text-sm text-gray-600 space-y-1">
                <p>✅ Package activated successfully</p>
                <p>✅ Confirmation email sent</p>
                <p>✅ Ready to book sessions</p>
              </div>

              {orderId && (
                <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
                  Order ID: <span className="font-mono">{orderId}</span>
                </div>
              )}
            </div>
          )}

          {verificationStatus === "failed" && (
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                If you believe this is an error, please contact our support team with your order ID.
              </p>
              {orderId && (
                <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
                  Order ID: <span className="font-mono">{orderId}</span>
                </div>
              )}
            </div>
          )}

          <div className="flex flex-col gap-3">
            <Button
              asChild
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
            >
              <Link href="/dashboard">
                <Calendar className="h-4 w-4 mr-2" />
                View My Bookings
              </Link>
            </Button>

            <Button asChild variant="outline" className="border-2 border-gray-200 hover:bg-gray-50 bg-transparent">
              <Link href="/coaches">Browse More Coaches</Link>
            </Button>

            <Button asChild variant="ghost" className="text-gray-600 hover:text-gray-800">
              <Link href="/">Go Home</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
