import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Clock, Users, MapPin, IndianRupee } from "lucide-react"
import type { Coach } from "@/types"

interface CoachCardProps {
  coach: Coach
  showBookButton?: boolean
}

export function CoachCard({ coach, showBookButton = true }: CoachCardProps) {
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

  const minPackagePrice = Math.min(...coach.packages.map((p) => Math.round(p.price / p.totalSessions)))

  return (
    <Card className="group hover:shadow-2xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm overflow-hidden">
      <div className="relative">
        <div className="aspect-[4/3] relative overflow-hidden">
          <Image
            src={coach.image || `/placeholder.svg?height=400&width=400&text=${coach.name}`}
            alt={coach.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
          <div className="absolute top-4 left-4">
            <Badge className={`${getSpecializationColor(coach.specialization)} text-sm font-medium`}>
              {getSpecializationIcon(coach.specialization)} {coach.specialization}
            </Badge>
          </div>
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="font-semibold text-sm">{coach.rating}</span>
            </div>
          </div>
          <div className="absolute bottom-4 left-4 text-white">
            <div className="flex items-center gap-1 text-sm">
              <MapPin className="h-4 w-4" />
              {coach.location}
            </div>
          </div>
        </div>
      </div>

      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-xl mb-2">{coach.name}</CardTitle>
            <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {coach.experience} years
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                {coach.reviewCount} reviews
              </div>
            </div>
          </div>
        </div>
        <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">{coach.bio}</p>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-4">
          {/* Certifications */}
          {coach.certifications && coach.certifications.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {coach.certifications.slice(0, 2).map((cert, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {cert}
                </Badge>
              ))}
              {coach.certifications.length > 2 && (
                <Badge variant="outline" className="text-xs">
                  +{coach.certifications.length - 2} more
                </Badge>
              )}
            </div>
          )}

          {/* Action Buttons */}
          {showBookButton && (
            <div className="flex gap-2">
              <Button asChild variant="outline" className="flex-1 border-gray-200 hover:bg-gray-50 bg-transparent">
                <Link href={`/coaches/${coach._id}`}>View Profile</Link>
              </Button>
              <Button
                asChild
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
              >
                <Link href={`/coaches/${coach._id}`}>Book Now</Link>
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
