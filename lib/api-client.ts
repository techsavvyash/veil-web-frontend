import type {
  User,
  ApiListing,
  Category,
  Subscription,
  ApiKey,
  AuthResponse,
  RegisterRequest,
  LoginRequest,
  CreateApiRequest,
  SubscribeRequest,
  RateApiRequest,
  CreateApiKeyRequest,
  ChangePasswordRequest,
} from "./types"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"

class ApiClient {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem("auth_token")
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    }
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`
    const response = await fetch(url, {
      ...options,
      headers: {
        ...this.getAuthHeaders(),
        ...options.headers,
      },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || `API Error: ${response.status} ${response.statusText}`)
    }

    return response.json()
  }

  // Auth endpoints
  async register(data: RegisterRequest): Promise<AuthResponse> {
    return this.request<AuthResponse>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async login(data: LoginRequest): Promise<AuthResponse> {
    return this.request<AuthResponse>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async verifyToken(): Promise<{ user: User }> {
    const token = localStorage.getItem("auth_token")
    if (!token) {
      throw new Error("No token found")
    }

    // Extract user ID from mock token
    const userId = token.replace("mock_jwt_token_", "")
    return { user: { uid: userId, email: "mock@example.com", name: "Mock User", role: "buyer" } as User }
  }

  // Marketplace endpoints
  async getMarketplaceApis(params?: { search?: string; category?: string; page?: number; limit?: number }): Promise<{
    apis: ApiListing[]
    total: number
    page: number
    limit: number
    total_pages: number
  }> {
    const searchParams = new URLSearchParams()
    if (params?.search) searchParams.set("search", params.search)
    if (params?.category) searchParams.set("category", params.category)
    if (params?.page) searchParams.set("page", params.page.toString())
    if (params?.limit) searchParams.set("limit", params.limit.toString())

    const queryString = searchParams.toString()
    return this.request<{ apis: ApiListing[]; total: number; page: number; limit: number; total_pages: number }>(
      `/api/marketplace/apis${queryString ? `?${queryString}` : ""}`,
    )
  }

  async getApiDetails(uid: string): Promise<{ api: ApiListing }> {
    return this.request<{ api: ApiListing }>(`/api/marketplace/apis/${uid}`)
  }

  async subscribeToApi(uid: string, data: SubscribeRequest): Promise<Subscription> {
    return {
      uid: `sub-${Date.now()}`,
      user_uid: "user-1",
      api_uid: uid,
      status: "active",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    } as Subscription
  }

  async rateApi(uid: string, data: RateApiRequest): Promise<void> {
    console.log(`[v0] Mock rating API ${uid} with rating:`, data.rating)
  }

  async getCategories(): Promise<{ categories: Category[] }> {
    return this.request<{ categories: Category[] }>("/api/marketplace/categories")
  }

  async getSellerDashboard(): Promise<any> {
    return {
      total_apis: 3,
      total_subscribers: 4230,
      total_revenue: 15420.5,
      monthly_revenue: 2340.75,
      recent_subscriptions: [],
    }
  }

  async getSellerApis(): Promise<ApiListing[]> {
    const response = await this.getMarketplaceApis()
    return response.apis
  }

  async createApi(data: CreateApiRequest): Promise<ApiListing> {
    return {
      uid: `api-${Date.now()}`,
      name: data.name,
      description: data.description,
      documentation: data.documentation || "",
      base_url: data.base_url,
      version: data.version,
      status: "pending",
      seller_uid: "user-2",
      category_uid: data.category_uid,
      pricing_model: data.pricing_model,
      base_price: data.base_price || 0,
      price_per_request: data.price_per_request || 0,
      rate_limit: data.rate_limit || 1000,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      average_rating: 0,
      total_ratings: 0,
      total_subscribers: 0,
    } as ApiListing
  }

  async getSellerApiDetails(uid: string): Promise<ApiListing> {
    const response = await this.getApiDetails(uid)
    return response.api
  }

  async updateApi(uid: string, data: Partial<CreateApiRequest>): Promise<ApiListing> {
    const existing = await this.getSellerApiDetails(uid)
    return { ...existing, ...data, updated_at: new Date().toISOString() }
  }

  async deleteApi(uid: string): Promise<void> {
    console.log(`[v0] Mock deleting API ${uid}`)
  }

  async getApiAnalytics(uid: string): Promise<any> {
    return {
      total_requests: 15420,
      monthly_requests: 2340,
      revenue: 1250.3,
      subscribers: 45,
      usage_by_day: Array.from({ length: 30 }, (_, i) => ({
        date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        requests: Math.floor(Math.random() * 100) + 50,
      })),
    }
  }

  async getApiKeys(): Promise<ApiKey[]> {
    return [
      {
        uid: "key-1",
        subscription_uid: "sub-1",
        key: "veil_sk_test_1234567890abcdef",
        name: "Production Key",
        last_used: "2024-01-16T14:30:00Z",
        created_at: "2024-01-15T10:00:00Z",
        updated_at: "2024-01-15T10:00:00Z",
      },
    ]
  }

  async createApiKey(subscriptionUid: string, data: CreateApiKeyRequest): Promise<ApiKey> {
    return {
      uid: `key-${Date.now()}`,
      subscription_uid: subscriptionUid,
      key: `veil_sk_${Math.random().toString(36).substring(2, 15)}`,
      name: data.name,
      last_used: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
  }

  async getApiKeyDetails(uid: string): Promise<ApiKey> {
    const keys = await this.getApiKeys()
    const key = keys.find((k) => k.uid === uid)
    if (!key) throw new Error("API key not found")
    return key
  }

  async updateApiKey(uid: string, data: Partial<CreateApiKeyRequest>): Promise<ApiKey> {
    const existing = await this.getApiKeyDetails(uid)
    return { ...existing, ...data, updated_at: new Date().toISOString() }
  }

  async deleteApiKey(uid: string): Promise<void> {
    console.log(`[v0] Mock deleting API key ${uid}`)
  }

  async regenerateApiKey(uid: string): Promise<ApiKey> {
    const existing = await this.getApiKeyDetails(uid)
    return {
      ...existing,
      key: `veil_sk_${Math.random().toString(36).substring(2, 15)}`,
      updated_at: new Date().toISOString(),
    }
  }

  async getProfile(): Promise<User> {
    return {
      uid: "user-1",
      email: "john@example.com",
      name: "John Doe",
      role: "buyer",
      created_at: "2024-01-15T10:00:00Z",
      updated_at: "2024-01-15T10:00:00Z",
    }
  }

  async updateProfile(data: Partial<User>): Promise<User> {
    const existing = await this.getProfile()
    return { ...existing, ...data, updated_at: new Date().toISOString() }
  }

  async changePassword(data: ChangePasswordRequest): Promise<void> {
    console.log(`[v0] Mock changing password for user`)
  }

  async getUserDashboard(): Promise<any> {
    return {
      total_subscriptions: 5,
      active_keys: 8,
      monthly_usage: 12450,
      monthly_spend: 89.5,
    }
  }

  async getUserSubscriptions(): Promise<Subscription[]> {
    return [
      {
        uid: "sub-1",
        user_uid: "user-1",
        api_uid: "api-1",
        status: "active",
        created_at: "2024-01-15T10:00:00Z",
        updated_at: "2024-01-15T10:00:00Z",
      },
    ]
  }

  async cancelSubscription(uid: string): Promise<void> {
    console.log(`[v0] Mock canceling subscription ${uid}`)
  }
}

export const apiClient = new ApiClient()
