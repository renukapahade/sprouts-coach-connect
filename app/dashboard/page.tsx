"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Package, CalendarIcon, Award, Users, TrendingUp, Target } from "lucide-react"
import type { Subscription } from "@/types"
import { apiClient } from "@/lib/api-client"

export default function DashboardPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [loading, setLoading] = useState(true)
  const [clientEmail, setClientEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)


  const fetchUserData = async () => {
    setLoading(true)
    try {
      const subscriptionsData = await apiClient.getUserSubscriptions(clientEmail)
      setSubscriptions(subscriptionsData)
    } catch (error) {
      console.error("Error fetching user data:", error)
    } finally {
      setLoading(false)
    }
  }

  if (!clientEmail || !submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <Card className="w-full max-w-md border-0 bg-white/80 backdrop-blur-sm shadow-2xl">
          <CardHeader className="text-center pb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-2xl">Access Your Dashboard</CardTitle>
            <CardDescription className="text-base">
              Enter your email to view your subscriptions and packages
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="email" className="text-sm font-semibold">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="mt-1 h-12"
                />
              </div>
              <Button
                onClick={async () => {
                  await fetchUserData()
                  setSubmitted(true)
                }}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white h-12"
                disabled={!clientEmail}
              >
                Access Dashboard
              </Button>

            </div>
          </CardContent>
        </Card>
      </div>
    )
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
                Coaches
              </Link>
              <Button
                variant="outline"
                onClick={() => {
                  setClientEmail("")
                  setSubmitted(false)
                  setSubscriptions([])
                }}
                className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
              >
                Switch Account
              </Button>
            </nav>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              Welcome to Your
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {" "}
                Dashboard
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Track your progress and manage your training packages
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <Card className="border-0 bg-white/80 backdrop-blur-sm text-center">
              <CardContent className="p-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mx-auto mb-2">
                  <Package className="h-6 w-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{subscriptions.length}</div>
                <div className="text-sm text-gray-600">Active Packages</div>
              </CardContent>
            </Card>
            <Card className="border-0 bg-white/80 backdrop-blur-sm text-center">
              <CardContent className="p-4">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl flex items-center justify-center mx-auto mb-2">
                  <CalendarIcon className="h-6 w-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {subscriptions.reduce((acc, sub) => acc + sub.totalSessions, 0)}
                </div>
                <div className="text-sm text-gray-600">Total Sessions</div>
              </CardContent>
            </Card>
            <Card className="border-0 bg-white/80 backdrop-blur-sm text-center">
              <CardContent className="p-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-2">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {subscriptions.reduce((acc, sub) => acc + sub.usedSessions, 0)}
                </div>
                <div className="text-sm text-gray-600">Used Sessions</div>
              </CardContent>
            </Card>
            <Card className="border-0 bg-white/80 backdrop-blur-sm text-center">
              <CardContent className="p-4">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center mx-auto mb-2">
                  <Target className="h-6 w-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {subscriptions.reduce((acc, sub) => acc + (sub.totalSessions - sub.usedSessions), 0)}
                </div>
                <div className="text-sm text-gray-600">Remaining</div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Subscriptions */}
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">My Training Packages</h2>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <LoadingSpinner size="lg" />
            </div>
          ) : subscriptions.length > 0 ? (
            <div className="grid gap-6">
              {subscriptions.map((subscription) => (
                <Card
                  key={subscription._id}
                  className="border-0 bg-white/80 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center">
                          <Package className="h-8 w-8 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-xl mb-2">{subscription.packageName}</CardTitle>
                          <CardDescription className="text-base">
                            Coach: <span className="font-semibold">{subscription.coachName}</span>
                          </CardDescription>
                        </div>
                      </div>
                      <Badge
                        variant={subscription.status === "active" ? "default" : "secondary"}
                        className={
                          subscription.status === "active" ? "bg-green-500 text-white" : "bg-gray-500 text-white"
                        }
                      >
                        {subscription.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-semibold text-gray-700">Sessions Progress</span>
                            <span className="text-sm font-bold text-blue-600">
                              {subscription.usedSessions} / {subscription.totalSessions}
                            </span>
                          </div>
                          <div className="w-full bg-blue-200 rounded-full h-3">
                            <div
                              className="bg-gradient-to-r from-blue-600 to-purple-600 h-3 rounded-full transition-all duration-500"
                              style={{ width: `${(subscription.usedSessions / subscription.totalSessions) * 100}%` }}
                            ></div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="text-center p-3 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl">
                            <div className="text-lg font-bold text-green-600">
                              {new Date(subscription.endDate).toLocaleDateString()}
                            </div>
                            <div className="text-xs text-gray-600">Valid Until</div>
                          </div>
                          <div className="text-center p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
                            <div className="text-lg font-bold text-purple-600">
                              ₹{subscription.price.toLocaleString()}
                            </div>
                            <div className="text-xs text-gray-600">Amount Paid</div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-center">
                        <div className="text-center p-6 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl">
                          <h4 className="font-semibold text-gray-800 mb-2">Package Active</h4>
                          <p className="text-sm text-gray-600 mb-4">
                            Contact your coach directly to schedule sessions from this package
                          </p>
                          <div className="text-xs text-gray-500">Sessions are managed by your coach</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-xl">
              <CardContent className="text-center py-16">
                <div className="w-24 h-24 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Package className="h-12 w-12 text-blue-600" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">No Active Packages</h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  You don't have any active packages yet. Browse our coaches and find the perfect training package for
                  you.
                </p>
                <Button
                  asChild
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3"
                >
                  <Link href="/coaches">Browse Coaches</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
