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
    return this.request<{ user: User }>("/api/auth/verify")
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
    return this.request<Subscription>(`/api/marketplace/apis/${uid}/subscribe`, {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async rateApi(uid: string, data: RateApiRequest): Promise<void> {
    await this.request(`/api/marketplace/apis/${uid}/rate`, {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async getCategories(): Promise<{ categories: Category[] }> {
    return this.request<{ categories: Category[] }>("/api/marketplace/categories")
  }

  // Seller endpoints
  async getSellerDashboard(): Promise<any> {
    return this.request("/api/seller/dashboard")
  }

  async getSellerApis(): Promise<{ apis: ApiListing[] }> {
    return this.request<{ apis: ApiListing[] }>("/api/seller/apis")
  }

  async createApi(data: CreateApiRequest): Promise<ApiListing> {
    return this.request<ApiListing>("/api/seller/apis", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async getSellerApiDetails(uid: string): Promise<{ api: ApiListing }> {
    return this.request<{ api: ApiListing }>(`/api/seller/apis/${uid}`)
  }

  async updateApi(uid: string, data: Partial<CreateApiRequest>): Promise<ApiListing> {
    return this.request<ApiListing>(`/api/seller/apis/${uid}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  }

  async deleteApi(uid: string): Promise<void> {
    await this.request(`/api/seller/apis/${uid}`, {
      method: "DELETE",
    })
  }

  async getApiAnalytics(uid: string): Promise<any> {
    return this.request(`/api/seller/apis/${uid}/analytics`)
  }

  // API Keys endpoints
  async getApiKeys(): Promise<ApiKey[]> {
    return this.request<ApiKey[]>("/api/keys")
  }

  async createApiKey(subscriptionUid: string, data: CreateApiKeyRequest): Promise<ApiKey> {
    return this.request<ApiKey>("/api/keys", {
      method: "POST",
      body: JSON.stringify({ ...data, subscription_uid: subscriptionUid }),
    })
  }

  async getApiKeyDetails(uid: string): Promise<ApiKey> {
    return this.request<ApiKey>(`/api/keys/${uid}`)
  }

  async updateApiKey(uid: string, data: Partial<CreateApiKeyRequest>): Promise<ApiKey> {
    return this.request<ApiKey>(`/api/keys/${uid}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  }

  async deleteApiKey(uid: string): Promise<void> {
    await this.request(`/api/keys/${uid}`, {
      method: "DELETE",
    })
  }

  async regenerateApiKey(uid: string): Promise<ApiKey> {
    return this.request<ApiKey>(`/api/keys/${uid}/regenerate`, {
      method: "POST",
    })
  }

  // Profile endpoints
  async getProfile(): Promise<User> {
    return this.request<User>("/api/profile")
  }

  async updateProfile(data: Partial<User>): Promise<User> {
    return this.request<User>("/api/profile", {
      method: "PUT",
      body: JSON.stringify(data),
    })
  }

  async changePassword(data: ChangePasswordRequest): Promise<void> {
    await this.request("/api/profile/change-password", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  // User Dashboard endpoints
  async getUserDashboard(): Promise<any> {
    return this.request("/api/dashboard")
  }

  async getUserSubscriptions(): Promise<Subscription[]> {
    return this.request<Subscription[]>("/api/subscriptions")
  }

  async cancelSubscription(uid: string): Promise<void> {
    await this.request(`/api/subscriptions/${uid}/cancel`, {
      method: "POST",
    })
  }
}

export const apiClient = new ApiClient()
