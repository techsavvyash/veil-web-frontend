export interface User {
  uid: string
  email: string
  firstName: string
  lastName: string
  role: "buyer" | "seller" | "admin"
  createdAt: string
  updatedAt: string
}

export interface ApiListing {
  uid: string
  name: string
  description: string
  version: string
  endpoint: string
  baseUrl: string
  categoryId: number
  category?: Category
  documentation: string
  price: string
  pricingModel: "per_request" | "monthly" | "yearly"
  requestLimit: number
  isPublic: boolean
  rating?: number
  totalRatings?: number
  seller: User
  createdAt: string
  updatedAt: string
}

export interface Category {
  id: number
  name: string
  description: string
  createdAt: string
  updatedAt: string
}

export interface Subscription {
  uid: string
  apiUid: string
  userUid: string
  requestsLimit: number
  requestsUsed: number
  isActive: boolean
  createdAt: string
  updatedAt: string
  api: ApiListing
}

export interface ApiKey {
  uid: string
  name: string
  key: string
  subscriptionUid: string
  subscription: Subscription
  isActive: boolean
  expiresAt?: string
  lastUsed?: string
  requestsUsed: number
  createdAt: string
  updatedAt: string
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
