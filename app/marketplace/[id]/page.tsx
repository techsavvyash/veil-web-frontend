"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Star, Users, Shield, Zap, Clock, CheckCircle, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Navigation } from "@/components/navigation"

// Mock API detail data
const mockAPIDetail = {
  id: "1",
  name: "Weather Pro API",
  description: "Advanced weather forecasting with 15-day predictions and historical data",
  longDescription:
    "Weather Pro API provides comprehensive weather data including current conditions, hourly forecasts up to 48 hours, daily forecasts up to 15 days, and historical weather data. Our API uses advanced machine learning models to provide highly accurate predictions with global coverage.",
  category: "Weather",
  price: "$0.01",
  priceUnit: "per request",
  rating: 4.8,
  reviews: 1247,
  users: 5420,
  provider: "WeatherTech Inc.",
  tags: ["weather", "forecast", "climate", "meteorology"],
  featured: true,
  endpoints: [
    { method: "GET", path: "/current", description: "Get current weather conditions" },
    { method: "GET", path: "/forecast/hourly", description: "Get hourly forecast up to 48 hours" },
    { method: "GET", path: "/forecast/daily", description: "Get daily forecast up to 15 days" },
    { method: "GET", path: "/historical", description: "Get historical weather data" },
  ],
  features: [
    "Global coverage with 200+ countries",
    "Real-time weather updates every 15 minutes",
    "Machine learning enhanced accuracy",
    "Historical data going back 10 years",
    "Multiple data formats (JSON, XML)",
    "99.9% uptime SLA",
  ],
  pricing: [
    { tier: "Starter", requests: "1,000", price: "$10", features: ["Basic weather data", "Email support"] },
    {
      tier: "Professional",
      requests: "10,000",
      price: "$75",
      features: ["All weather data", "Priority support", "Historical data"],
    },
    {
      tier: "Enterprise",
      requests: "100,000+",
      price: "Custom",
      features: ["Custom solutions", "Dedicated support", "SLA guarantees"],
    },
  ],
}

export default function APIDetailPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link href="/marketplace" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Marketplace
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <h1 className="text-3xl font-bold text-foreground">{mockAPIDetail.name}</h1>
                {mockAPIDetail.featured && (
                  <Badge variant="secondary" className="bg-primary/10 text-primary">
                    Featured
                  </Badge>
                )}
                <Badge variant="outline">{mockAPIDetail.category}</Badge>
              </div>
              <p className="text-lg text-muted-foreground mb-4">{mockAPIDetail.description}</p>

              {/* Stats */}
              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{mockAPIDetail.rating}</span>
                  <span className="text-muted-foreground">({mockAPIDetail.reviews} reviews)</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>{mockAPIDetail.users.toLocaleString()} users</span>
                </div>
                <div className="text-muted-foreground">by {mockAPIDetail.provider}</div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mt-4">
                {mockAPIDetail.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="bg-muted">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="documentation">Docs</TabsTrigger>
                <TabsTrigger value="pricing">Pricing</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <Card className="border-border">
                  <CardHeader>
                    <CardTitle className="text-foreground">About this API</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">{mockAPIDetail.longDescription}</p>
                  </CardContent>
                </Card>

                <Card className="border-border">
                  <CardHeader>
                    <CardTitle className="text-foreground">Key Features</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-3">
                      {mockAPIDetail.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                          <span className="text-muted-foreground">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="documentation" className="space-y-6">
                <Card className="border-border">
                  <CardHeader>
                    <CardTitle className="text-foreground">API Endpoints</CardTitle>
                    <CardDescription>Available endpoints and their descriptions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {mockAPIDetail.endpoints.map((endpoint, index) => (
                        <div key={index} className="border border-border rounded-lg p-4">
                          <div className="flex items-center gap-3 mb-2">
                            <Badge variant="outline" className="font-mono text-xs">
                              {endpoint.method}
                            </Badge>
                            <code className="text-sm bg-muted px-2 py-1 rounded">{endpoint.path}</code>
                          </div>
                          <p className="text-muted-foreground text-sm">{endpoint.description}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="pricing" className="space-y-6">
                <div className="grid md:grid-cols-3 gap-6">
                  {mockAPIDetail.pricing.map((plan, index) => (
                    <Card key={index} className="border-border">
                      <CardHeader>
                        <CardTitle className="text-foreground">{plan.tier}</CardTitle>
                        <CardDescription>{plan.requests} requests/month</CardDescription>
                        <div className="text-2xl font-bold text-foreground">{plan.price}</div>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {plan.features.map((feature, featureIndex) => (
                            <li key={featureIndex} className="flex items-center gap-2 text-sm">
                              <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                              <span className="text-muted-foreground">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="reviews" className="space-y-6">
                <Card className="border-border">
                  <CardHeader>
                    <CardTitle className="text-foreground">Customer Reviews</CardTitle>
                    <CardDescription>What developers are saying about this API</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[1, 2, 3].map((review) => (
                        <div key={review} className="border-b border-border pb-4 last:border-b-0">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="flex">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star key={star} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              ))}
                            </div>
                            <span className="text-sm text-muted-foreground">by Developer{review}</span>
                          </div>
                          <p className="text-muted-foreground text-sm">
                            Great API with reliable data and excellent documentation. Easy to integrate and very
                            responsive support team.
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Purchase Card */}
            <Card className="border-border sticky top-4">
              <CardHeader>
                <CardTitle className="text-foreground">Get Started</CardTitle>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-foreground">{mockAPIDetail.price}</span>
                  <span className="text-muted-foreground">{mockAPIDetail.priceUnit}</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">Subscribe Now</Button>
                <Button variant="outline" className="w-full bg-transparent">
                  Try Free Sample
                </Button>

                <Separator />

                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-primary" />
                    <span className="text-muted-foreground">99.9% uptime SLA</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-primary" />
                    <span className="text-muted-foreground">Instant activation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-primary" />
                    <span className="text-muted-foreground">24/7 support</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Provider Info */}
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Provider</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <div className="font-medium text-foreground">{mockAPIDetail.provider}</div>
                    <div className="text-sm text-muted-foreground">Verified Provider</div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Leading provider of weather data services with over 10 years of experience in meteorological data.
                  </div>
                  <Button variant="outline" size="sm" className="w-full bg-transparent">
                    View Profile
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
