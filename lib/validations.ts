import { z } from "zod"

export const CoachSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone must be at least 10 characters"),
  specialization: z.enum(["fitness", "nutrition", "both"]),
  bio: z.string().min(50, "Bio must be at least 50 characters"),
  experience: z.number().min(1, "Experience must be at least 1 year"),
  location: z.string().min(2, "Location is required"),
  rating: z.number().min(0).max(5).default(4.8),
  reviewCount: z.number().min(0).default(0),
  image: z.string().url("Invalid image URL").optional(),
  certifications: z.array(z.string()).optional(),
  packages: z
    .array(
      z.object({
        id: z.string(),
        name: z.string(),
        duration: z.number().min(1, "Duration must be at least 1 month"), // in months
        totalSessions: z.number().min(1, "Must have at least 1 session"),
        price: z.number().min(1, "Price must be greater than 0"),
        description: z.string(),
        features: z.array(z.string()).optional(),
      }),
    )
    .min(1, "At least one package is required"),
})

export const UserSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone must be at least 10 characters"),
})

export const PackageBookingSchema = z.object({
  coachId: z.string(),
  packageId: z.string(),
  clientName: z.string().min(2, "Name must be at least 2 characters"),
  clientEmail: z.string().email("Invalid email address"),
  clientPhone: z.string().min(10, "Phone must be at least 10 characters"),
  notes: z.string().optional(),
})

export type CoachInput = z.infer<typeof CoachSchema>
export type UserInput = z.infer<typeof UserSchema>
export type PackageBookingInput = z.infer<typeof PackageBookingSchema>
