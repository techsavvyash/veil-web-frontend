"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { apiClient } from "./api-client"
import type { User } from "./types"

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, firstName: string, lastName: string, role?: "buyer" | "seller") => Promise<void>
  logout: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("auth_token")
    if (token) {
      apiClient
        .verifyToken()
        .then((response) => {
          // Handle both direct user response and wrapped response
          const user = response.user || response
          setUser(user)
        })
        .catch((error) => {
          console.error('Token verification failed:', error)
          localStorage.removeItem("auth_token")
        })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (email: string, password: string) => {
    const response = await apiClient.login({ email, password })
    localStorage.setItem("auth_token", response.token)
    setUser(response.user)
  }

  const register = async (email: string, password: string, firstName: string, lastName: string, role: "buyer" | "seller" = "buyer") => {
    const response = await apiClient.register({ email, password, firstName, lastName, role })
    localStorage.setItem("auth_token", response.token)
    setUser(response.user)
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
