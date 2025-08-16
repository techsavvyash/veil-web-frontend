"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Star, Users, Loader2 } from "lucide-react"
import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { apiClient } from "@/lib/api-client"
import type { ApiListing, Category } from "@/lib/types"

export default function MarketplacePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [sortBy, setSortBy] = useState("featured")
  const [apis, setApis] = useState<ApiListing[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const [apisResponse, categoriesResponse] = await Promise.all([
          apiClient.getMarketplaceApis(),
          apiClient.getCategories()
        ])
        
        setApis(apisResponse.apis)
        setCategories(categoriesResponse.categories)
      } catch (err) {
        console.error('Failed to load marketplace data:', err)
        setError(err instanceof Error ? err.message : 'Failed to load data')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const categoryNames = ["All", ...categories.map(cat => cat.name)]

  const filteredAPIs = apis.filter((api) => {
    const matchesSearch =
      api.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      api.description.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesCategory = selectedCategory === "All" || 
      api.category?.name === selectedCategory
    
    return matchesSearch && matchesCategory
  })

  const sortedAPIs = [...filteredAPIs].sort((a, b) => {
    switch (sortBy) {
      case "rating":
        const aRating = Number.parseFloat(a.averageRating || "0")
        const bRating = Number.parseFloat(b.averageRating || "0")
        return bRating - aRating
      case "users":
        return (b.totalSubscriptions || 0) - (a.totalSubscriptions || 0)
      case "price-low":
        const aPrice = Number.parseFloat(a.price || "0")
        const bPrice = Number.parseFloat(b.price || "0")
        return aPrice - bPrice
      case "price-high":
        const aPriceHigh = Number.parseFloat(a.price || "0")
        const bPriceHigh = Number.parseFloat(b.price || "0")
        return bPriceHigh - aPriceHigh
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    }
  })

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">API Marketplace</h1>
          <p className="text-lg text-muted-foreground">
            Discover and integrate powerful APIs to accelerate your development
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search APIs, categories, or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-input border-border"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-48 bg-input border-border">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categoryNames.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-48 bg-input border-border">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="users">Most Popular</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            <span className="ml-2 text-muted-foreground">Loading APIs...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-8 w-8 text-destructive" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Failed to load APIs</h3>
            <p className="text-muted-foreground">{error}</p>
          </div>
        )}

        {/* Results Count */}
        {!loading && !error && (
          <div className="mb-6">
            <p className="text-muted-foreground">
              Showing {sortedAPIs.length} of {apis.length} APIs
            </p>
          </div>
        )}

        {/* API Grid */}
        {!loading && !error && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedAPIs.map((api) => {
              const priceDisplay = api.price 
                ? `$${Number.parseFloat(api.price).toFixed(3)}`
                : "Free"
              
              return (
                <Card
                  key={api.uid}
                  className="border-border hover:shadow-lg transition-all duration-200 hover:border-primary/50"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <CardTitle className="text-foreground text-lg">{api.name}</CardTitle>
                          {api.isActive && (
                            <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                              Active
                            </Badge>
                          )}
                        </div>
                        {api.category && (
                          <Badge variant="outline" className="text-xs mb-2">
                            {api.category.name}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <CardDescription className="text-sm leading-relaxed">{api.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Version and Pricing Model */}
                      <div className="flex flex-wrap gap-1">
                        {api.version && (
                          <Badge variant="secondary" className="text-xs bg-muted">
                            v{api.version}
                          </Badge>
                        )}
                        {api.pricingModel && (
                          <Badge variant="secondary" className="text-xs bg-muted">
                            {api.pricingModel.replace("_", " ")}
                          </Badge>
                        )}
                      </div>

                      {/* Stats */}
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span>{Number.parseFloat(api.averageRating || "0").toFixed(1)}</span>
                          <span>({api.totalRatings || 0})</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          <span>{(api.totalSubscriptions || 0).toLocaleString()}</span>
                        </div>
                      </div>

                      {/* Pricing */}
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-lg font-semibold text-foreground">{priceDisplay}</span>
                          <span className="text-sm text-muted-foreground ml-1">
                            {api.pricingModel === "per_request" ? "per request" : api.pricingModel || ""}
                          </span>
                        </div>
                        <Link href={`/marketplace/${api.uid}`}>
                          <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
                            View Details
                          </Button>
                        </Link>
                      </div>

                      {/* Rate Limit */}
                      {api.requestLimit && (
                        <div className="text-xs text-muted-foreground border-t border-border pt-3">
                          Rate limit: {api.requestLimit.toLocaleString()} requests
                        </div>
                      )}

                      {/* Seller */}
                      {api.seller && (
                        <div className="text-xs text-muted-foreground border-t border-border pt-3">
                          by {api.seller.firstName} {api.seller.lastName}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && sortedAPIs.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">No APIs found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  )
}
