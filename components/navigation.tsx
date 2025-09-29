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
    <nav className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <Link href="/" className="text-2xl font-bold text-foreground">
              Veil
            </Link>
            <Badge variant="secondary" className="text-xs">
              BETA
            </Badge>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/marketplace" className="text-muted-foreground hover:text-foreground transition-colors">
              Marketplace
            </Link>
            {user && (
              <Link href="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">
                Dashboard
              </Link>
            )}
            {user && (
              <Link href="/keys" className="text-muted-foreground hover:text-foreground transition-colors">
                API Keys
              </Link>
            )}
            <Link href="/docs" className="text-muted-foreground hover:text-foreground transition-colors">
              Docs
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            {loading ? (
              <div className="h-8 w-20 bg-muted animate-pulse rounded" />
            ) : user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/placeholder.svg" alt={`${user.firstName || user.first_name} ${user.lastName || user.last_name}`} />
                      <AvatarFallback>
                        {(user.firstName?.[0] || user.first_name?.[0] || '').toUpperCase()}
                        {(user.lastName?.[0] || user.last_name?.[0] || '').toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">{user.firstName || user.first_name} {user.lastName || user.last_name}</p>
                      <p className="w-[200px] truncate text-sm text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/keys">
                      <Key className="mr-2 h-4 w-4" />
                      API Keys
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/profile">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" className="text-foreground">
                    Sign In
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button className="bg-primary text-primary-foreground hover:bg-primary/90">Get Started</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
