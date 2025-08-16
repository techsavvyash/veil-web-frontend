"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Star, Users } from "lucide-react"
import Link from "next/link"
import { Navigation } from "@/components/navigation"

// Mock API data
const mockAPIs = [
  {
    id: "1",
    name: "Weather Pro API",
    description: "Advanced weather forecasting with 15-day predictions and historical data",
    category: "Weather",
    price: "$0.01",
    priceUnit: "per request",
    rating: 4.8,
    reviews: 1247,
    users: 5420,
    provider: "WeatherTech Inc.",
    tags: ["weather", "forecast", "climate"],
    featured: true,
  },
  {
    id: "2",
    name: "AI Text Analyzer",
    description: "Sentiment analysis, entity extraction, and text classification powered by ML",
    category: "AI/ML",
    price: "$0.05",
    priceUnit: "per analysis",
    rating: 4.9,
    reviews: 892,
    users: 3210,
    provider: "NLP Solutions",
    tags: ["ai", "nlp", "sentiment", "text"],
    featured: true,
  },
  {
    id: "3",
    name: "Crypto Market Data",
    description: "Real-time cryptocurrency prices, market cap, and trading volume data",
    category: "Finance",
    price: "$0.02",
    priceUnit: "per request",
    rating: 4.6,
    reviews: 2156,
    users: 8930,
    provider: "CryptoData Ltd.",
    tags: ["crypto", "finance", "trading", "market"],
  },
  {
    id: "4",
    name: "Image Recognition API",
    description: "Object detection, face recognition, and image classification services",
    category: "AI/ML",
    price: "$0.10",
    priceUnit: "per image",
    rating: 4.7,
    reviews: 654,
    users: 2180,
    provider: "VisionAI Corp.",
    tags: ["ai", "computer-vision", "recognition", "ml"],
  },
  {
    id: "5",
    name: "SMS Gateway Pro",
    description: "Global SMS delivery with delivery reports and two-way messaging",
    category: "Communication",
    price: "$0.08",
    priceUnit: "per SMS",
    rating: 4.5,
    reviews: 1834,
    users: 6750,
    provider: "MessageFlow",
    tags: ["sms", "messaging", "communication", "global"],
  },
  {
    id: "6",
    name: "QR Code Generator",
    description: "Generate custom QR codes with logos, colors, and tracking analytics",
    category: "Utilities",
    price: "$0.01",
    priceUnit: "per code",
    rating: 4.4,
    reviews: 423,
    users: 1560,
    provider: "QRTech Solutions",
    tags: ["qr", "generator", "tracking", "analytics"],
  },
]

const categories = ["All", "AI/ML", "Weather", "Finance", "Communication", "Utilities", "Data", "Security"]

export default function MarketplacePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [sortBy, setSortBy] = useState("featured")

  const filteredAPIs = mockAPIs.filter((api) => {
    const matchesSearch =
      api.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      api.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      api.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesCategory = selectedCategory === "All" || api.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const sortedAPIs = [...filteredAPIs].sort((a, b) => {
    switch (sortBy) {
      case "rating":
        return b.rating - a.rating
      case "users":
        return b.users - a.users
      case "price-low":
        return Number.parseFloat(a.price.replace("$", "")) - Number.parseFloat(b.price.replace("$", ""))
      case "price-high":
        return Number.parseFloat(b.price.replace("$", "")) - Number.parseFloat(a.price.replace("$", ""))
      default:
        return b.featured ? 1 : -1
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
                {categories.map((category) => (
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

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-muted-foreground">
            Showing {sortedAPIs.length} of {mockAPIs.length} APIs
          </p>
        </div>

        {/* API Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedAPIs.map((api) => (
            <Card
              key={api.id}
              className="border-border hover:shadow-lg transition-all duration-200 hover:border-primary/50"
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <CardTitle className="text-foreground text-lg">{api.name}</CardTitle>
                      {api.featured && (
                        <Badge variant="secondary" className="text-xs bg-primary/10 text-primary">
                          Featured
                        </Badge>
                      )}
                    </div>
                    <Badge variant="outline" className="text-xs mb-2">
                      {api.category}
                    </Badge>
                  </div>
                </div>
                <CardDescription className="text-sm leading-relaxed">{api.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Tags */}
                  <div className="flex flex-wrap gap-1">
                    {api.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs bg-muted">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span>{api.rating}</span>
                      <span>({api.reviews})</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>{api.users.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Pricing */}
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-lg font-semibold text-foreground">{api.price}</span>
                      <span className="text-sm text-muted-foreground ml-1">{api.priceUnit}</span>
                    </div>
                    <Link href={`/marketplace/${api.id}`}>
                      <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
                        View Details
                      </Button>
                    </Link>
                  </div>

                  {/* Provider */}
                  <div className="text-xs text-muted-foreground border-t border-border pt-3">by {api.provider}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {sortedAPIs.length === 0 && (
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
