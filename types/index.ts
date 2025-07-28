export interface Coach {
  _id: string
  name: string
  email: string
  phone: string
  specialization: "fitness" | "nutrition" | "both"
  bio: string
  experience: number
  location: string
  rating: number
  reviewCount: number
  image?: string
  certifications?: string[]
  packages: Package[]
  createdAt: Date
  updatedAt: Date
}

export interface Package {
  id: string
  name: string
  duration: number // in months
  totalSessions: number
  price: number
  description: string
  features?: string[]
}

export interface User {
  _id: string
  name: string
  email: string
  phone: string
  createdAt: Date
  updatedAt: Date
}

export interface Subscription {
  _id: string
  userId: string
  userName: string
  userEmail: string
  userPhone: string
  coachId: string
  coachName: string
  packageId: string
  packageName: string
  duration: number // in months
  totalSessions: number
  usedSessions: number
  price: number
  startDate: Date
  endDate: Date
  status: "pending" | "active" | "expired" | "cancelled"
  orderId?: string
  paymentSessionId?: string
  paymentId?: string
  paymentStatus?: "pending" | "completed" | "failed"
  notes?: string
  createdAt: Date
  updatedAt: Date
}

export interface Session {
  _id: string
  subscriptionId: string
  userId: string
  userName: string
  userEmail: string
  coachId: string
  coachName: string
  packageName: string
  date: string
  sessionType: "fitness" | "nutrition" | "consultation"
  status: "scheduled" | "completed" | "cancelled"
  notes?: string
  createdAt: Date
  updatedAt: Date
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}
