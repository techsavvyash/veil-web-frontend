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
    // Check if we're in the browser environment
    if (typeof window === 'undefined') {
      return {
        "Content-Type": "application/json",
      }
    }

    const token = localStorage.getItem("auth_token")
    console.log('API Client - getAuthHeaders - token found:', token ? 'Yes' : 'No')
    console.log('API Client - getAuthHeaders - token length:', token ? token.length : 0)

    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    }
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`
    const headers = {
      ...this.getAuthHeaders(),
      ...options.headers,
    }

    console.log(`API Client - ${options.method || 'GET'} ${endpoint}`)
    console.log('API Client - Headers:', headers)

    const response = await fetch(url, {
      ...options,
      headers,
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || errorData.error || `API Error: ${response.status} ${response.statusText}`)
    }

    const result = await response.json()

    // Handle BFF response structure with success/data wrapper
    if (result.success && result.data) {
      return result.data
    }

    return result
  }

  // Auth endpoints
  async register(data: RegisterRequest): Promise<AuthResponse> {
    return this.request<AuthResponse>("/api/v1/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async login(data: LoginRequest): Promise<AuthResponse> {
    return this.request<AuthResponse>("/api/v1/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async verifyToken(): Promise<{ user: User }> {
    return this.request<{ user: User }>("/api/v1/auth/verify-token", {
      method: "POST",
    })
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
      `/api/v1/marketplace/apis${queryString ? `?${queryString}` : ""}`,
    )
  }

  async getApiDetails(uid: string): Promise<{ api: ApiListing }> {
    return this.request<{ api: ApiListing }>(`/api/v1/marketplace/apis/${uid}`)
  }

  async subscribeToApi(uid: string, data: SubscribeRequest): Promise<Subscription> {
    return this.request<Subscription>(`/api/v1/marketplace/apis/${uid}/subscribe`, {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async rateApi(uid: string, data: RateApiRequest): Promise<void> {
    await this.request(`/api/v1/marketplace/apis/${uid}/rate`, {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async getCategories(): Promise<{ categories: Category[] }> {
    return this.request<{ categories: Category[] }>("/api/v1/marketplace/categories")
  }

  // Seller endpoints
  async getSellerDashboard(): Promise<any> {
    return this.request("/api/v1/seller/dashboard")
  }

  async getSellerApis(): Promise<{ apis: ApiListing[] }> {
    return this.request<{ apis: ApiListing[] }>("/api/v1/seller/apis")
  }

  async createApi(data: CreateApiRequest): Promise<ApiListing> {
    return this.request<ApiListing>("/api/v1/seller/apis", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async getSellerApiDetails(uid: string): Promise<{ api: ApiListing }> {
    return this.request<{ api: ApiListing }>(`/api/v1/seller/apis/${uid}`)
  }

  async updateApi(uid: string, data: Partial<CreateApiRequest>): Promise<ApiListing> {
    return this.request<ApiListing>(`/api/v1/seller/apis/${uid}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  }

  async deleteApi(uid: string): Promise<void> {
    await this.request(`/api/v1/seller/apis/${uid}`, {
      method: "DELETE",
    })
  }

  async getApiAnalytics(uid: string): Promise<any> {
    return this.request(`/api/v1/seller/apis/${uid}/analytics`)
  }

  async toggleApiStatus(uid: string): Promise<{ api: ApiListing }> {
    return this.request<{ api: ApiListing }>(`/api/v1/seller/apis/${uid}/toggle-status`, {
      method: "PATCH",
    })
  }

  // API Keys endpoints
  async getApiKeys(): Promise<ApiKey[]> {
    return this.request<ApiKey[]>("/api/v1/api-keys/")
  }

  async createApiKey(subscriptionUid: string, data: CreateApiKeyRequest): Promise<ApiKey> {
    return this.request<ApiKey>(`/api/v1/api-keys/subscription/${subscriptionUid}`, {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async getApiKeyDetails(uid: string): Promise<ApiKey> {
    return this.request<ApiKey>(`/api/v1/api-keys/${uid}`)
  }

  async updateApiKey(uid: string, data: Partial<CreateApiKeyRequest>): Promise<ApiKey> {
    return this.request<ApiKey>(`/api/v1/api-keys/${uid}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  }

  async deleteApiKey(uid: string): Promise<void> {
    await this.request(`/api/v1/api-keys/${uid}`, {
      method: "DELETE",
    })
  }

  async regenerateApiKey(uid: string): Promise<ApiKey> {
    return this.request<ApiKey>(`/api/v1/api-keys/${uid}/regenerate`, {
      method: "POST",
    })
  }

  // Profile endpoints
  async getProfile(): Promise<User> {
    return this.request<User>("/api/v1/profile/")
  }

  async updateProfile(data: Partial<User>): Promise<User> {
    return this.request<User>("/api/v1/profile/", {
      method: "PUT",
      body: JSON.stringify(data),
    })
  }

  async changePassword(data: ChangePasswordRequest): Promise<void> {
    await this.request("/api/v1/profile/change-password", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  // User Dashboard endpoints
  async getUserDashboard(): Promise<any> {
    return this.request("/api/v1/profile/dashboard")
  }

  async getUserSubscriptions(): Promise<Subscription[]> {
    return this.request<Subscription[]>("/api/v1/profile/subscriptions")
  }

  async cancelSubscription(uid: string): Promise<void> {
    await this.request(`/api/v1/profile/subscriptions/${uid}`, {
      method: "DELETE",
    })
  }
}

export const apiClient = new ApiClient()
