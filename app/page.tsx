"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CoachCard } from "@/components/coach-card"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Search, Filter, Award } from "lucide-react"
import type { Coach } from "@/types"
import { apiClient } from "@/lib/api-client"

export default function HomePage() {
  const [featuredCoaches, setFeaturedCoaches] = useState<Coach[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [specialization, setSpecialization] = useState("all")

  useEffect(() => {
    fetchFeaturedCoaches()
  }, [])

  const fetchFeaturedCoaches = async () => {
    try {
      const coaches = await apiClient.getFeaturedCoaches()
      setFeaturedCoaches(coaches)
    } catch (error) {
      console.error("Error fetching featured coaches:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (searchTerm) params.append("search", searchTerm)
    if (specialization !== "all") params.append("specialization", specialization)

    window.location.href = `/coaches?${params.toString()}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Modern Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-white/20 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Award className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  CoachConnect
                </h1>
                <p className="text-xs text-gray-500">Your Wellness Journey</p>
              </div>
            </div>
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/coaches" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
                All Coaches
              </Link>
              <Link href="/dashboard" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
                Dashboard
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
        <div className="container mx-auto text-center relative">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Transform Your Life with
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent block">
                Expert Coaches
              </span>
            </h2>
            <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
              Connect with certified fitness trainers and nutrition experts. Choose from flexible packages and achieve
              your health goals with personalized guidance from India&apos;s top coaches.
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-12">
              <div className="flex flex-col md:flex-row gap-4 p-2 items-center bg-white rounded-2xl shadow-xl border border-white/20">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    placeholder="Search coaches, specializations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 border-0 bg-transparent text-lg h-14 focus:ring-0"
                    onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                  />
                </div>
                <Select value={specialization} onValueChange={setSpecialization}>
                  <SelectTrigger className="md:w-48 border-0 bg-transparent h-14">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Specialization" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Specializations</SelectItem>
                    <SelectItem value="fitness">Fitness Training</SelectItem>
                    <SelectItem value="nutrition">Nutrition</SelectItem>
                    <SelectItem value="both">Both</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  size="lg"
                  onClick={handleSearch}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white h-14 px-8 rounded-xl"
                >
                  Find Coaches
                </Button>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">500+</div>
                <div className="text-gray-600">Expert Coaches</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">10k+</div>
                <div className="text-gray-600">Happy Clients</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">50k+</div>
                <div className="text-gray-600">Sessions Completed</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">4.9★</div>
                <div className="text-gray-600">Average Rating</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Coaches */}
      <section className="py-20 px-4 bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-gray-900 mb-4">Meet Our Top Coaches</h3>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Handpicked experts ready to guide you on your wellness journey
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <LoadingSpinner size="lg" />
            </div>
          ) : (
            <>
              <div className="grid lg:grid-cols-3 gap-8">
                {featuredCoaches.map((coach) => (
                  <CoachCard key={coach._id} coach={coach} />
                ))}
              </div>

              <div className="text-center mt-12">
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white bg-transparent"
                >
                  <Link href="/coaches">View All Coaches</Link>
                </Button>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                  <Award className="h-6 w-6 text-white" />
                </div>
                <div>
                  <span className="text-xl font-bold">CoachConnect</span>
                  <p className="text-xs text-gray-400">Your Wellness Journey</p>
                </div>
              </div>
              <p className="text-gray-400 leading-relaxed">
                Connecting you with India&apos;s best fitness and nutrition experts for a healthier, happier you.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-lg">Services</h4>
              <ul className="space-y-3 text-gray-400">
                <li>
                  <Link href="/coaches?specialization=fitness" className="hover:text-white transition-colors">
                    Fitness Training
                  </Link>
                </li>
                <li>
                  <Link href="/coaches?specialization=nutrition" className="hover:text-white transition-colors">
                    Nutrition Counseling
                  </Link>
                </li>
                <li>
                  <Link href="/coaches" className="hover:text-white transition-colors">
                    All Coaches
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-lg">Company</h4>
              <ul className="space-y-3 text-gray-400">
                <li>
                  <Link href="/about" className="hover:text-white transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white transition-colors">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-white transition-colors">
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-lg">Support</h4>
              <ul className="space-y-3 text-gray-400">
                <li>
                  <Link href="/help" className="hover:text-white transition-colors">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="hover:text-white transition-colors">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-white transition-colors">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2024 CoachConnect. All rights reserved. Made with ❤️ for your wellness journey.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
