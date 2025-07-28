"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, PackageIcon } from "lucide-react"
import type { Package } from "@/types"

interface PackageCardProps {
  package: Package
  onSelect: () => void
  isPopular?: boolean
}

export function PackageCard({ package: pkg, onSelect, isPopular = false }: PackageCardProps) {
  return (
    <Card
      className={`relative border-2 transition-all duration-300 bg-gradient-to-r from-white to-blue-50/30 ${
        isPopular ? "border-blue-500 shadow-lg" : "border-gray-100 hover:border-blue-200"
      }`}
    >
      {isPopular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <Badge className="bg-blue-500 text-white px-4 py-1">Most Popular</Badge>
        </div>
      )}

      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-xl flex items-center gap-2 mb-2">
              <PackageIcon className="h-5 w-5 text-blue-600" />
              {pkg.name}
            </CardTitle>
            <CardDescription className="text-base">{pkg.description}</CardDescription>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-green-600">₹{pkg.price.toLocaleString()}</div>
            <div className="text-sm text-gray-500">{pkg.duration} months</div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-6">
            <Badge className="bg-blue-100 text-blue-800 px-3 py-1">{pkg.totalSessions} sessions</Badge>
          </div>

          {pkg.features && pkg.features.length > 0 && (
            <div className="grid grid-cols-1 gap-2">
              {pkg.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2 text-sm text-gray-700">
                  <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                  {feature}
                </div>
              ))}
            </div>
          )}

          <Button
            onClick={onSelect}
            className={`w-full ${
              isPopular
                ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                : "bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800"
            } text-white`}
          >
            Choose This Package
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
