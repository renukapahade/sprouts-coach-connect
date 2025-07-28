import type { Coach, User, Subscription, ApiResponse, PaginatedResponse } from "@/types"
import type { UserInput, PackageBookingInput } from "@/lib/validations"

const API_BASE = "/api"

class ApiClient {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE}${endpoint}`
    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    }

    const response = await fetch(url, config)

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: "Network error" }))
      throw new Error(error.error || `HTTP ${response.status}`)
    }

    return response.json()
  }

  // Coaches
  async getCoaches(params?: {
    page?: number
    limit?: number
    specialization?: string
    search?: string
  }): Promise<PaginatedResponse<Coach>> {
    const searchParams = new URLSearchParams()
    if (params?.page) searchParams.append("page", params.page.toString())
    if (params?.limit) searchParams.append("limit", params.limit.toString())
    if (params?.specialization && params.specialization !== "all") {
      searchParams.append("specialization", params.specialization)
    }
    if (params?.search) searchParams.append("search", params.search)

    const query = searchParams.toString()
    return this.request(`/coaches${query ? `?${query}` : ""}`)
  }

  async getCoach(id: string): Promise<Coach> {
    return this.request(`/coaches/${id}`)
  }

  async getFeaturedCoaches(): Promise<Coach[]> {
    const response = await this.getCoaches({ limit: 6 })
    return response.data
  }

  // Users
  async createUser(data: UserInput): Promise<ApiResponse<User>> {
    return this.request("/users", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async getUser(email: string): Promise<User | null> {
    try {
      return await this.request(`/users/${encodeURIComponent(email)}`)
    } catch {
      return null
    }
  }

  // Package Bookings (Subscriptions)
  async bookPackage(data: PackageBookingInput): Promise<ApiResponse<Subscription>> {
    return this.request("/subscriptions", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async getUserSubscriptions(email: string): Promise<Subscription[]> {
    const response: ApiResponse<Subscription[]> = await this.request(
      `/subscriptions?userEmail=${encodeURIComponent(email)}`,
    )
    return response.data || []
  }

  async getSubscription(id: string): Promise<Subscription> {
    return this.request(`/subscriptions/${id}`)
  }

  // Payments
  async createPaymentSession(subscriptionId: string): Promise<{
    paymentSessionId: string
    orderId: string
  }> {
    return this.request("/payments/create-session", {
      method: "POST",
      body: JSON.stringify({ subscriptionId }),
    })
  }

  async verifyPayment(orderId: string): Promise<ApiResponse<unknown>> {
    return this.request("/payments/verify", {
      method: "POST",
      body: JSON.stringify({ orderId }),
    })
  }
}

export const apiClient = new ApiClient()
