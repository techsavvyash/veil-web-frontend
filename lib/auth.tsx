"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { apiClient } from "./api-client"
import type { User } from "./types"

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  register: (data: { email: string; password: string; firstName: string; lastName: string; role?: "buyer" | "seller" }) => Promise<void>
  logout: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if we're in the browser
    if (typeof window === 'undefined') {
      setLoading(false)
      return
    }

    const token = localStorage.getItem("auth_token")
    if (token) {
      console.log('Verifying existing token:', token.substring(0, 50) + '...')
      apiClient
        .verifyToken()
        .then((response) => {
          // Handle both direct user response and wrapped response
          const user = response.user || response
          console.log('Token verification successful:', user)
          setUser(user)
        })
        .catch((error) => {
          console.error('Token verification failed, clearing token:', error)
          localStorage.removeItem("auth_token")
          setUser(null)
        })
        .finally(() => setLoading(false))
    } else {
      console.log('No token found in localStorage')
      setLoading(false)
    }
  }, [])

  const login = async (email: string, password: string) => {
    const response = await apiClient.login({ email, password })
    localStorage.setItem("auth_token", response.token)
    setUser(response.user)
  }

  const register = async (data: { email: string; password: string; firstName: string; lastName: string; role?: "buyer" | "seller" }) => {
    try {
      // Clear any existing token first to avoid conflicts
      localStorage.removeItem("auth_token")

      const response = await apiClient.register(data)
      localStorage.setItem("auth_token", response.token)
      setUser(response.user)
      console.log('Registration successful, new token stored:', response.token.substring(0, 50) + '...')
    } catch (error) {
      console.error('Registration failed:', error)
      throw error
    }
  }

  const logout = () => {
    localStorage.removeItem("auth_token")
    setUser(null)
  }

  return <AuthContext.Provider value={{ user, login, register, logout, loading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
