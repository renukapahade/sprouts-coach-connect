"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { PackageCard } from "@/components/package-card"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Star, Clock, Award, Mail, Phone, Package, Users, MapPin, Shield, Heart, Target } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import type { Coach, Package as PackageType } from "@/types"
import { apiClient } from "@/lib/api-client"
import Script from "next/script"

// Add this interface at the top of the file after imports
interface CashfreeWindow extends Window {
  Cashfree: {
    new (config: { mode: string }): {
      checkout: (options: { paymentSessionId: string; redirectTarget: string }) => void
    }
  }
}

declare const window: CashfreeWindow

export default function CoachProfilePage() {
  const params = useParams()
  const router = useRouter()
  const [coach, setCoach] = useState<Coach | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedPackage, setSelectedPackage] = useState<PackageType | null>(null)
  const [bookingForm, setBookingForm] = useState({
    clientName: "",
    clientEmail: "",
    clientPhone: "",
    notes: "",
  })
  const [isBookingDialogOpen, setIsBookingDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    fetchCoach()
  }, [params.id])

  const fetchCoach = async () => {
    try {
      const data = await apiClient.getCoach(params.id as string)
      setCoach(data)
    } catch (error) {
      console.error("Error fetching coach:", error)
    } finally {
      setLoading(false)
    }
  }

  const handlePackageBooking = async () => {
    if (!coach || !selectedPackage) return

    setIsSubmitting(true)
    try {
      // Create subscription
      const subscriptionData = {
        coachId: coach._id,
        packageId: selectedPackage.id,
        clientName: bookingForm.clientName,
        clientEmail: bookingForm.clientEmail,
        clientPhone: bookingForm.clientPhone,
        notes: bookingForm.notes,
      }

      const response = await apiClient.bookPackage(subscriptionData)

      if (response.data) {
        // Create payment session
        const paymentData = await apiClient.createPaymentSession(response.data._id)

        // Redirect to payment
        redirectToPayment(paymentData.paymentSessionId)
      }
    } catch (error) {
      console.error("Error booking package:", error)
      toast({
        title: "Booking Failed",
        description: error instanceof Error ? error.message : "Failed to book package",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const redirectToPayment = (paymentSessionId: string) => {
    const cashfree = new window.Cashfree({
      mode: process.env.NODE_ENV === "production" ? "production" : "sandbox",
    })

    cashfree.checkout({
      paymentSessionId,
      redirectTarget: "_self",
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!coach) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Users className="h-12 w-12 text-gray-400" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Coach Not Found</h1>
          <p className="text-gray-600 mb-6">The coach you&apos;re looking for doesn&apos;t exist or has been removed.</p>
          <Button
            asChild
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
          >
            <Link href="/coaches">Browse All Coaches</Link>
          </Button>
        </div>
      </div>
    )
  }

  const getSpecializationColor = (spec: string) => {
    switch (spec) {
      case "fitness":
        return "bg-blue-500 text-white"
      case "nutrition":
        return "bg-green-500 text-white"
      case "both":
        return "bg-purple-500 text-white"
      default:
        return "bg-gray-500 text-white"
    }
  }

  const getSpecializationIcon = (spec: string) => {
    switch (spec) {
      case "fitness":
        return "💪"
      case "nutrition":
        return "🥗"
      case "both":
        return "⚡"
      default:
        return "👨‍⚕️"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-white/20 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Award className="h-6 w-6 text-white" />
              </div>
              <div>
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  CoachConnect
                </span>
                <p className="text-xs text-gray-500">Your Wellness Journey</p>
              </div>
            </Link>
            <nav className="flex items-center space-x-6">
              <Link href="/coaches" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
                All Coaches
              </Link>
              <Link href="/dashboard" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
                My Bookings
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Hero Card */}
          <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-xl overflow-hidden mb-8">
            <div className="relative">
              <div className="h-64 bg-gradient-to-r from-blue-600 to-purple-600 relative overflow-hidden">
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="absolute bottom-6 left-6 text-white">
                  <Badge className={`${getSpecializationColor(coach.specialization)} mb-3`}>
                    {getSpecializationIcon(coach.specialization)} {coach.specialization}
                  </Badge>
                  <h1 className="text-4xl font-bold mb-2">{coach.name}</h1>
                  <div className="flex items-center gap-4 text-white/90">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {coach.experience} years experience
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      {coach.rating} ({coach.reviewCount} reviews)
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {coach.location}
                    </div>
                  </div>
                </div>
                <div className="absolute bottom-6 right-6">
                  <div className="w-32 h-32 rounded-2xl overflow-hidden border-4 border-white/20 shadow-2xl">
                    <Image
                      src={coach.image || `/placeholder.svg?height=200&width=200&text=${coach.name}`}
                      alt={coach.name}
                      width={128}
                      height={128}
                      className="object-cover w-full h-full"
                    />
                  </div>
                </div>
              </div>
            </div>

            <CardContent className="p-8">
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
                  <div className="flex items-center justify-center gap-1 mb-2">
                    <Package className="h-5 w-5 text-blue-600" />
                    <span className="text-2xl font-bold text-blue-600">{coach.packages.length}</span>
                  </div>
                  <p className="text-sm text-gray-600">Packages</p>
                </div>
                <div className="text-center p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl">
                  <div className="flex items-center justify-center gap-1 mb-2">
                    <Users className="h-5 w-5 text-green-600" />
                    <span className="text-2xl font-bold text-green-600">{coach.reviewCount}</span>
                  </div>
                  <p className="text-sm text-gray-600">Happy Clients</p>
                </div>
                <div className="text-center p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
                  <div className="flex items-center justify-center gap-1 mb-2">
                    <Target className="h-5 w-5 text-purple-600" />
                    <span className="text-2xl font-bold text-purple-600">{coach.rating}</span>
                  </div>
                  <p className="text-sm text-gray-600">Average Rating</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <div className="flex items-center gap-2 text-gray-600">
                  <Mail className="h-4 w-4" />
                  {coach.email}
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Phone className="h-4 w-4" />
                  {coach.phone}
                </div>
              </div>

              <div className="space-y-8">
                <div>
                  <h3 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                    <Heart className="h-6 w-6 text-red-500" />
                    About Me
                  </h3>
                  <p className="text-gray-700 leading-relaxed text-lg">{coach.bio}</p>
                </div>

                {coach.certifications && coach.certifications.length > 0 && (
                  <div>
                    <h3 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                      <Shield className="h-6 w-6 text-blue-500" />
                      Certifications & Credentials
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {coach.certifications.map((cert, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="text-sm px-4 py-2 border-2 border-blue-200 text-blue-700 bg-blue-50"
                        >
                          <Award className="h-4 w-4 mr-2" />
                          {cert}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Training Packages */}
                <div>
                  <h3 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                    <Package className="h-6 w-6 text-purple-500" />
                    Packages
                  </h3>
                  <div className="grid gap-6 md:grid-cols-2">
                    {coach.packages.map((pkg, index) => (
                      <PackageCard
                        key={pkg.id}
                        package={pkg}
                        onSelect={() => {
                          setSelectedPackage(pkg)
                          setIsBookingDialogOpen(true)
                        }}
                        isPopular={index === 0} // Make first package popular
                      />
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Package Booking Dialog */}
      <Dialog open={isBookingDialogOpen} onOpenChange={setIsBookingDialogOpen}>
        <DialogContent className="sm:max-w-md bg-white/95 backdrop-blur-sm">
          <DialogHeader>
            <DialogTitle className="text-xl">Book {selectedPackage?.name}</DialogTitle>
            <DialogDescription>Enter your details to book this package</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="clientName" className="text-sm font-semibold">
                Full Name
              </Label>
              <Input
                id="clientName"
                value={bookingForm.clientName}
                onChange={(e) => setBookingForm({ ...bookingForm, clientName: e.target.value })}
                placeholder="Enter your full name"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="clientEmail" className="text-sm font-semibold">
                Email
              </Label>
              <Input
                id="clientEmail"
                type="email"
                value={bookingForm.clientEmail}
                onChange={(e) => setBookingForm({ ...bookingForm, clientEmail: e.target.value })}
                placeholder="Enter your email"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="clientPhone" className="text-sm font-semibold">
                Phone
              </Label>
              <Input
                id="clientPhone"
                value={bookingForm.clientPhone}
                onChange={(e) => setBookingForm({ ...bookingForm, clientPhone: e.target.value })}
                placeholder="Enter your phone number"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="notes" className="text-sm font-semibold">
                Goals & Notes (Optional)
              </Label>
              <Textarea
                id="notes"
                value={bookingForm.notes}
                onChange={(e) => setBookingForm({ ...bookingForm, notes: e.target.value })}
                placeholder="Your fitness goals and any specific requirements..."
                className="mt-1"
              />
            </div>

            <Separator />

            {selectedPackage && (
              <div className="space-y-2 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
                <div className="flex justify-between">
                  <span className="font-medium">Package:</span>
                  <span>{selectedPackage.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Duration:</span>
                  <span>{selectedPackage.duration} months</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Sessions:</span>
                  <span>{selectedPackage.totalSessions}</span>
                </div>
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total:</span>
                  <span className="text-green-600">₹{selectedPackage.price.toLocaleString()}</span>
                </div>
              </div>
            )}

            <Button
              onClick={handlePackageBooking}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white h-12"
              disabled={isSubmitting || !bookingForm.clientName || !bookingForm.clientEmail || !bookingForm.clientPhone}
            >
              {isSubmitting ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  Processing...
                </>
              ) : (
                "Proceed to Payment"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Cashfree SDK */}
      <Script
        src="https://sdk.cashfree.com/js/v3/cashfree.js"
        strategy="afterInteractive"
        onLoad={() => console.log("Cashfree SDK loaded")}
        onError={() => console.error("Failed to load Cashfree SDK")}
      />

    </div>
  )
}
