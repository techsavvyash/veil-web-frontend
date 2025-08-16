export interface User {
  uid: string
  email: string
  first_name: string
  last_name: string
  role: "buyer" | "seller" | "admin"
  created_at: string
  updated_at: string
  // Legacy fields for compatibility
  firstName?: string
  lastName?: string
  createdAt?: string
  updatedAt?: string
}

export interface ApiListing {
  id: number
  uid: string
  name: string
  description: string
  version: string
  endpoint: string
  baseUrl?: string
  categoryId?: number
  documentation?: string
  price: string
  pricingModel: "per_request" | "monthly" | "yearly"
  requestLimit: number
  isPublic?: boolean
  isActive?: boolean
  status?: "pending" | "approved" | "rejected"
  averageRating?: string
  totalRatings?: number
  totalSubscriptions?: number
  sellerId?: number
  seller?: {
    id: number
    firstName: string
    lastName: string
  }
  category?: {
    id: number
    name: string
  }
  createdAt: string
  updatedAt?: string
  // Derived fields for compatibility
  category_uid?: string
  average_rating?: number
  total_ratings?: number
  total_subscribers?: number
  seller_uid?: string
  created_at?: string
  updated_at?: string
  price_per_request?: number
  base_price?: number
  rate_limit?: number
}

export interface Category {
  id: number
  name: string
  description?: string
  createdAt?: string
  updatedAt?: string
  // Derived fields for compatibility
  uid?: string
  created_at?: string
  updated_at?: string
}

export interface Subscription {
  uid: string
  api_uid: string
  user_uid: string
  requests_limit: number
  requests_used: number
  is_active: boolean
  status: "active" | "suspended" | "cancelled"
  created_at: string
  updated_at: string
  api: ApiListing
  // Legacy fields for compatibility
  apiUid?: string
  userUid?: string
  requestsLimit?: number
  requestsUsed?: number
  isActive?: boolean
  createdAt?: string
  updatedAt?: string
}

export interface ApiKey {
  uid: string
  name: string
  key: string
  key_value: string
  subscription_uid: string
  subscription: Subscription
  is_active: boolean
  expires_at?: string
  last_used?: string
  requests_used: number
  created_at: string
  updated_at: string
  // Legacy fields for compatibility
  subscriptionUid?: string
  isActive?: boolean
  expiresAt?: string
  lastUsed?: string
  requestsUsed?: number
  createdAt?: string
  updatedAt?: string
}

export interface AuthResponse {
  token: string
  user: User
}

export interface RegisterRequest {
  email: string
  password: string
  firstName: string
  lastName: string
  role?: "buyer" | "seller"
}

export interface LoginRequest {
  email: string
  password: string
}

export interface CreateApiRequest {
  name: string
  description: string
  version?: string
  endpoint: string
  baseUrl: string
  categoryId?: number
  documentation?: string
  price?: string
  pricingModel?: "per_request" | "monthly" | "yearly"
  requestLimit?: number
  isPublic?: boolean
}

export interface SubscribeRequest {
  requestsLimit?: number
}

export interface RateApiRequest {
  rating: number
  review?: string
}

export interface CreateApiKeyRequest {
  name: string
  expiresAt?: string
}

export interface ChangePasswordRequest {
  currentPassword: string
  newPassword: string
}
