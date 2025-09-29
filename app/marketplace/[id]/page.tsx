"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Star, Users, Shield, Zap, Clock, CheckCircle, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { useAuth } from "@/lib/auth"
import { apiClient } from "@/lib/api-client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import type { ApiListing } from "@/lib/types"

interface APIDetailPageProps {
  params: Promise<{
    id: string
  }>
}

export default function APIDetailPage({ params }: APIDetailPageProps) {
  const { user } = useAuth()
  const router = useRouter()
  const [api, setApi] = useState<ApiListing | null>(null)
  const [loading, setLoading] = useState(true)
  const [subscribing, setSubscribing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  useEffect(() => {
    async function fetchApi() {
      try {
        setLoading(true)
        const resolvedParams = await params
        const response = await apiClient.getApiDetails(resolvedParams.id)
        setApi(response.api)
      } catch (err: any) {
        setError(err.message || 'Failed to load API details')
      } finally {
        setLoading(false)
      }
    }

    fetchApi()
  }, [params])

  const handleSubscribe = async () => {
    if (!user) {
      router.push('/login')
      return
    }

    if (!api) return

    try {
      setSubscribing(true)
      setError(null)
      await apiClient.subscribeToApi(api.uid, {})
      setSuccessMessage('Successfully subscribed to API! You can now create API keys to start using it.')
    } catch (err: any) {
      setError(err.message || 'Failed to subscribe to API')
    } finally {
      setSubscribing(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">Loading API details...</div>
        </div>
      </div>
    )
  }

  if (error && !api) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-red-500">Error: {error}</div>
        </div>
      </div>
    )
  }

  if (!api) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">API not found</div>
        </div>
      </div>
    )
  }
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
                <h1 className="text-3xl font-bold text-foreground">{api.name}</h1>
                <Badge variant="outline">{api.category?.name || 'General'}</Badge>
                {api.isActive && (
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    Active
                  </Badge>
                )}
              </div>
              <p className="text-lg text-muted-foreground mb-4">{api.description}</p>

              {/* Stats */}
              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{api.averageRating || '0.0'}</span>
                  <span className="text-muted-foreground">({api.totalRatings || 0} reviews)</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>{api.totalSubscriptions || 0} subscribers</span>
                </div>
                <div className="text-muted-foreground">Version: {api.version}</div>
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
                    <p className="text-muted-foreground leading-relaxed">{api.description}</p>
                    {api.documentation && (
                      <div className="mt-4">
                        <h4 className="font-medium text-foreground mb-2">Documentation</h4>
                        <div className="prose text-muted-foreground max-w-none">
                          {api.documentation}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card className="border-border">
                  <CardHeader>
                    <CardTitle className="text-foreground">API Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                        <span className="text-muted-foreground">Base URL: {api.baseUrl}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                        <span className="text-muted-foreground">Endpoint: {api.endpoint}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                        <span className="text-muted-foreground">Pricing: {api.pricingModel.replace('_', ' ')}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                        <span className="text-muted-foreground">Request Limit: {api.requestLimit}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="documentation" className="space-y-6">
                <Card className="border-border">
                  <CardHeader>
                    <CardTitle className="text-foreground">API Documentation</CardTitle>
                    <CardDescription>How to use this API</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="border border-border rounded-lg p-4">
                        <div className="flex items-center gap-3 mb-2">
                          <Badge variant="outline" className="font-mono text-xs">
                            GET/POST
                          </Badge>
                          <code className="text-sm bg-muted px-2 py-1 rounded">{api.baseUrl}{api.endpoint}</code>
                        </div>
                        <p className="text-muted-foreground text-sm">
                          Base endpoint for this API. Check the documentation for specific methods and parameters.
                        </p>
                      </div>
                      {api.documentation && (
                        <div className="prose text-muted-foreground max-w-none">
                          <pre className="bg-muted p-4 rounded text-sm overflow-x-auto">
                            {api.documentation}
                          </pre>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="pricing" className="space-y-6">
                <Card className="border-border">
                  <CardHeader>
                    <CardTitle className="text-foreground">Pricing Information</CardTitle>
                    <CardDescription>How this API is priced</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="text-2xl font-bold text-foreground">
                        {api.price ? `$${api.price}` : 'Free'}
                      </div>
                      <div className="text-muted-foreground">
                        Pricing model: {api.pricingModel.replace('_', ' ')}
                      </div>
                      <div className="text-muted-foreground">
                        Request limit: {api.requestLimit} requests
                      </div>
                    </div>
                  </CardContent>
                </Card>
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
                  <span className="text-2xl font-bold text-foreground">
                    {api.price ? `$${api.price}` : 'Free'}
                  </span>
                  <span className="text-muted-foreground">
                    {api.pricingModel.replace('_', ' ')}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {error && (
                  <div className="text-red-500 text-sm p-2 bg-red-50 dark:bg-red-900/20 rounded">
                    {error}
                  </div>
                )}
                {successMessage && (
                  <div className="text-green-500 text-sm p-2 bg-green-50 dark:bg-green-900/20 rounded">
                    {successMessage}
                  </div>
                )}
                <Button
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                  onClick={handleSubscribe}
                  disabled={subscribing}
                >
                  {subscribing ? 'Subscribing...' : user ? 'Subscribe Now' : 'Sign In to Subscribe'}
                </Button>
                <Button variant="outline" className="w-full bg-transparent">
                  View Documentation
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

            {/* API Info */}
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-foreground">API Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <div className="font-medium text-foreground">API ID: {api.uid}</div>
                    <div className="text-sm text-muted-foreground">
                      Status: {api.isActive ? 'Active' : 'Inactive'}
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Created: {new Date(api.createdAt).toLocaleDateString()}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Category: {api.category?.name || 'General'}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
