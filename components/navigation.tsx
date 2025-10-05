"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { User, LogOut, Settings, Key } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/lib/auth"

export function Navigation() {
  const { user, logout, loading } = useAuth()

  return (
    <header className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between p-6">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <Link href="/" className="text-white text-2xl font-bold">
          Veil
        </Link>
        <Badge variant="secondary" className="text-xs bg-white/10 text-white/80 border-white/20">
          BETA
        </Badge>
      </div>

      {/* Navigation */}
      <nav className="flex items-center space-x-2">
        <Link
          href="/marketplace"
          className="text-white/80 hover:text-white text-sm font-light px-3 py-2 rounded-full hover:bg-white/10 transition-all duration-200"
        >
          Marketplace
        </Link>
        {user && (
          <Link
            href="/dashboard"
            className="text-white/80 hover:text-white text-sm font-light px-3 py-2 rounded-full hover:bg-white/10 transition-all duration-200"
          >
            Dashboard
          </Link>
        )}
        <Link
          href="/docs"
          className="text-white/80 hover:text-white text-sm font-light px-3 py-2 rounded-full hover:bg-white/10 transition-all duration-200"
        >
          Docs
        </Link>
      </nav>

      {/* Login/User Section */}
      <div className="flex items-center">
        {loading ? (
          <div className="h-8 w-20 bg-white/10 animate-pulse rounded-full" />
        ) : user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full hover:bg-white/10">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg" alt={`${user.firstName || user.first_name} ${user.lastName || user.last_name}`} />
                  <AvatarFallback className="bg-white text-black">
                    {(user.firstName?.[0] || user.first_name?.[0] || '').toUpperCase()}
                    {(user.lastName?.[0] || user.last_name?.[0] || '').toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-black border-white/20" align="end" forceMount>
              <div className="flex items-center justify-start gap-2 p-2">
                <div className="flex flex-col space-y-1 leading-none">
                  <p className="font-medium text-white">{user.firstName || user.first_name} {user.lastName || user.last_name}</p>
                  <p className="w-[200px] truncate text-sm text-white/70">
                    {user.email}
                  </p>
                </div>
              </div>
              <DropdownMenuSeparator className="bg-white/20" />
              <DropdownMenuItem asChild className="text-white focus:bg-white/10 focus:text-white">
                <Link href="/profile">
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="text-white focus:bg-white/10 focus:text-white">
                <Link href="/keys">
                  <Key className="mr-2 h-4 w-4" />
                  API Keys
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="text-white focus:bg-white/10 focus:text-white">
                <Link href="/profile">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-white/20" />
              <DropdownMenuItem onClick={logout} className="text-white focus:bg-white/10 focus:text-white">
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="flex items-center gap-2">
            <Link href="/login">
              <Button variant="ghost" className="text-white hover:bg-white/10 text-xs font-light px-4 py-2 rounded-full">
                Sign In
              </Button>
            </Link>
            <Link href="/signup">
              <Button className="px-6 py-2 rounded-full bg-white text-black font-normal text-xs transition-all duration-300 hover:bg-white/90 cursor-pointer h-8 flex items-center">
                Get Started
              </Button>
            </Link>
          </div>
        )}
      </div>
    </header>
  )
}
