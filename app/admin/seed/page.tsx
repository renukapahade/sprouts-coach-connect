"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Database, Users, UserCheck, CheckCircle, AlertCircle } from "lucide-react"

export default function SeedDatabasePage() {
  const [isSeeding, setIsSeeding] = useState(false)
  const [seedingStatus, setSeedingStatus] = useState<{
    coaches: number
    users: number
    subscriptions: number
    error?: string
  } | null>(null)

  const seedDatabase = async () => {
    setIsSeeding(true)
    setSeedingStatus(null)

    try {
      // This would call your seeding API endpoint
      const response = await fetch("/api/admin/seed", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error("Failed to seed database")
      }

      const result = await response.json()
      setSeedingStatus(result)
    } catch (error) {
      setSeedingStatus({
        coaches: 0,
        users: 0,
        subscriptions: 0,
        error: error instanceof Error ? error.message : "Unknown error occurred",
      })
    } finally {
      setIsSeeding(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Database Seeding</h1>
          <p className="text-xl text-gray-600">Initialize your database with Indian coaches and users</p>
        </div>

        <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-xl mb-8">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2 text-2xl">
              <Database className="h-6 w-6 text-purple-600" />
              Seed Database
            </CardTitle>
            <CardDescription>
              This will add Indian coaches, users, and create necessary indexes with cultural context
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button
              onClick={seedDatabase}
              disabled={isSeeding}
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3"
            >
              {isSeeding ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  Seeding Database...
                </>
              ) : (
                <>
                  <Database className="h-5 w-5 mr-2" />
                  Seed Database
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {seedingStatus && (
          <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {seedingStatus.error ? (
                  <AlertCircle className="h-5 w-5 text-red-600" />
                ) : (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                )}
                Seeding Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              {seedingStatus.error ? (
                <div className="text-red-600">
                  <p className="font-semibold">Error occurred:</p>
                  <p>{seedingStatus.error}</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Indian coaches added:</span>
                    <Badge className="bg-blue-500 text-white">{seedingStatus.coaches}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Users added:</span>
                    <Badge className="bg-green-500 text-white">{seedingStatus.users}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Sample subscriptions:</span>
                    <Badge className="bg-purple-500 text-white">{seedingStatus.subscriptions}</Badge>
                  </div>
                  <div className="mt-4 p-3 bg-green-50 rounded-lg">
                    <p className="text-green-800 font-semibold">✅ Database seeded successfully!</p>
                    <p className="text-green-700 text-sm">
                      You can now browse Indian coaches and test bookings with culturally relevant data.
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
