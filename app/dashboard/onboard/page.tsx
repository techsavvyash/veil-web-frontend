"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Plus, X, Upload, CheckCircle, Play, Shield, BarChart3, Webhook } from "lucide-react"
import Link from "next/link"
import { Navigation } from "@/components/navigation"

const categories = [
  "AI/ML",
  "Weather",
  "Finance",
  "Communication",
  "Utilities",
  "Data",
  "Security",
  "Social Media",
  "E-commerce",
  "Analytics",
]

const pricingModels = [
  { value: "per-request", label: "Per Request" },
  { value: "per-month", label: "Monthly Subscription" },
  { value: "per-user", label: "Per User" },
  { value: "tiered", label: "Tiered Pricing" },
]

export default function OnboardAPIPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [tags, setTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState("")
  const [endpoints, setEndpoints] = useState([{ method: "GET", path: "", description: "" }])
  const [testResults, setTestResults] = useState<{ endpoint: string; status: string; responseTime: number }[]>([])
  const [authMethod, setAuthMethod] = useState("")
  const [webhookUrl, setWebhookUrl] = useState("")

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()])
      setNewTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const addEndpoint = () => {
    setEndpoints([...endpoints, { method: "GET", path: "", description: "" }])
  }

  const removeEndpoint = (index: number) => {
    setEndpoints(endpoints.filter((_, i) => i !== index))
  }

  const updateEndpoint = (index: number, field: string, value: string) => {
    const updated = endpoints.map((endpoint, i) => (i === index ? { ...endpoint, [field]: value } : endpoint))
    setEndpoints(updated)
  }

  const testEndpoint = (endpoint: string) => {
    setTimeout(() => {
      const result = {
        endpoint,
        status: Math.random() > 0.2 ? "success" : "error",
        responseTime: Math.floor(Math.random() * 500) + 50,
      }
      setTestResults((prev) => [...prev, result])
    }, 1000)
  }

  const nextStep = () => setCurrentStep(Math.min(currentStep + 1, 7))
  const prevStep = () => setCurrentStep(Math.max(currentStep - 1, 1))

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/dashboard" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-foreground mb-2">Onboard New API</h1>
          <p className="text-muted-foreground">Add your API to the Veil marketplace</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between max-w-4xl">
            {[1, 2, 3, 4, 5, 6, 7].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step <= currentStep ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  }`}
                >
                  {step < currentStep ? <CheckCircle className="h-4 w-4" /> : step}
                </div>
                {step < 7 && <div className={`w-12 h-0.5 mx-1 ${step < currentStep ? "bg-primary" : "bg-muted"}`} />}
              </div>
            ))}
          </div>
          <div className="flex justify-between max-w-4xl mt-2 text-xs text-muted-foreground">
            <span>Basic Info</span>
            <span>Documentation</span>
            <span>Testing</span>
            <span>Authentication</span>
            <span>Monitoring</span>
            <span>Pricing</span>
            <span>Review</span>
          </div>
        </div>

        <div className="max-w-4xl">
          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Basic Information</CardTitle>
                <CardDescription>Tell us about your API</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="apiName" className="text-foreground">
                      API Name *
                    </Label>
                    <Input id="apiName" placeholder="e.g., Weather Pro API" className="bg-input border-border" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category" className="text-foreground">
                      Category *
                    </Label>
                    <Select>
                      <SelectTrigger className="bg-input border-border">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="shortDescription" className="text-foreground">
                    Short Description *
                  </Label>
                  <Input
                    id="shortDescription"
                    placeholder="Brief description of your API (max 100 characters)"
                    className="bg-input border-border"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="longDescription" className="text-foreground">
                    Detailed Description *
                  </Label>
                  <Textarea
                    id="longDescription"
                    placeholder="Provide a comprehensive description of your API's capabilities, use cases, and benefits..."
                    rows={4}
                    className="bg-input border-border"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-foreground">Tags</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="bg-muted">
                        {tag}
                        <button onClick={() => removeTag(tag)} className="ml-1 hover:text-destructive">
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder="Add a tag"
                      className="bg-input border-border"
                      onKeyPress={(e) => e.key === "Enter" && addTag()}
                    />
                    <Button onClick={addTag} variant="outline" className="bg-transparent">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="baseUrl" className="text-foreground">
                    Base URL *
                  </Label>
                  <Input id="baseUrl" placeholder="https://api.yourservice.com/v1" className="bg-input border-border" />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Documentation */}
          {currentStep === 2 && (
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-foreground">API Documentation</CardTitle>
                <CardDescription>Define your API endpoints and documentation</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-foreground">API Endpoints</Label>
                    <Button onClick={addEndpoint} variant="outline" size="sm" className="bg-transparent">
                      <Plus className="h-4 w-4 mr-1" />
                      Add Endpoint
                    </Button>
                  </div>

                  {endpoints.map((endpoint, index) => (
                    <div key={index} className="border border-border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-medium text-foreground">Endpoint {index + 1}</h4>
                        {endpoints.length > 1 && (
                          <Button
                            onClick={() => removeEndpoint(index)}
                            variant="outline"
                            size="sm"
                            className="bg-transparent text-destructive hover:text-destructive"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      <div className="grid md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label className="text-foreground">Method</Label>
                          <Select
                            value={endpoint.method}
                            onValueChange={(value) => updateEndpoint(index, "method", value)}
                          >
                            <SelectTrigger className="bg-input border-border">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="GET">GET</SelectItem>
                              <SelectItem value="POST">POST</SelectItem>
                              <SelectItem value="PUT">PUT</SelectItem>
                              <SelectItem value="DELETE">DELETE</SelectItem>
                              <SelectItem value="PATCH">PATCH</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-foreground">Path</Label>
                          <Input
                            value={endpoint.path}
                            onChange={(e) => updateEndpoint(index, "path", e.target.value)}
                            placeholder="/endpoint"
                            className="bg-input border-border"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-foreground">Description</Label>
                          <Input
                            value={endpoint.description}
                            onChange={(e) => updateEndpoint(index, "description", e.target.value)}
                            placeholder="What this endpoint does"
                            className="bg-input border-border"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator />

                <div className="space-y-4">
                  <Label className="text-foreground">OpenAPI Specification (Optional)</Label>
                  <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                    <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-2">Upload your OpenAPI/Swagger specification</p>
                    <p className="text-sm text-muted-foreground mb-4">Supports JSON and YAML formats</p>
                    <Button variant="outline" className="bg-transparent">
                      Choose File
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3: API Testing & Validation */}
          {currentStep === 3 && (
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center gap-2">
                  <Play className="h-5 w-5" />
                  API Testing & Validation
                </CardTitle>
                <CardDescription>Test your API endpoints to ensure they're working correctly</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <Label className="text-foreground">Test Endpoints</Label>
                  {endpoints.map((endpoint, index) => (
                    <div key={index} className="border border-border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="bg-transparent">
                            {endpoint.method}
                          </Badge>
                          <code className="text-sm bg-muted px-2 py-1 rounded">{endpoint.path}</code>
                        </div>
                        <Button
                          onClick={() => testEndpoint(endpoint.path)}
                          size="sm"
                          variant="outline"
                          className="bg-transparent"
                        >
                          <Play className="h-4 w-4 mr-1" />
                          Test
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground">{endpoint.description}</p>
                    </div>
                  ))}
                </div>

                {testResults.length > 0 && (
                  <div className="space-y-4">
                    <Label className="text-foreground">Test Results</Label>
                    <div className="space-y-2">
                      {testResults.map((result, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-2 h-2 rounded-full ${
                                result.status === "success" ? "bg-green-500" : "bg-red-500"
                              }`}
                            />
                            <code className="text-sm">{result.endpoint}</code>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>{result.responseTime}ms</span>
                            <Badge variant={result.status === "success" ? "default" : "destructive"}>
                              {result.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <Separator />

                <div className="space-y-4">
                  <Label className="text-foreground">Sample Request/Response</Label>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm text-muted-foreground">Sample Request</Label>
                      <Textarea
                        placeholder="Provide a sample request body (JSON)"
                        rows={4}
                        className="bg-input border-border font-mono text-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm text-muted-foreground">Sample Response</Label>
                      <Textarea
                        placeholder="Provide a sample response (JSON)"
                        rows={4}
                        className="bg-input border-border font-mono text-sm"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 4: Authentication & Security */}
          {currentStep === 4 && (
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Authentication & Security
                </CardTitle>
                <CardDescription>Configure how users will authenticate with your API</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <Label className="text-foreground">Authentication Method *</Label>
                  <Select value={authMethod} onValueChange={setAuthMethod}>
                    <SelectTrigger className="bg-input border-border">
                      <SelectValue placeholder="Select authentication method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="api-key">API Key</SelectItem>
                      <SelectItem value="bearer-token">Bearer Token</SelectItem>
                      <SelectItem value="oauth2">OAuth 2.0</SelectItem>
                      <SelectItem value="basic-auth">Basic Authentication</SelectItem>
                      <SelectItem value="custom">Custom Authentication</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {authMethod === "api-key" && (
                  <div className="space-y-4 p-4 bg-muted/30 rounded-lg">
                    <Label className="text-foreground">API Key Configuration</Label>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-sm text-muted-foreground">Header Name</Label>
                        <Input placeholder="X-API-Key" className="bg-input border-border" />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm text-muted-foreground">Key Format</Label>
                        <Select>
                          <SelectTrigger className="bg-input border-border">
                            <SelectValue placeholder="Select format" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="uuid">UUID</SelectItem>
                            <SelectItem value="random">Random String</SelectItem>
                            <SelectItem value="custom">Custom Format</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                )}

                {authMethod === "oauth2" && (
                  <div className="space-y-4 p-4 bg-muted/30 rounded-lg">
                    <Label className="text-foreground">OAuth 2.0 Configuration</Label>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label className="text-sm text-muted-foreground">Authorization URL</Label>
                        <Input
                          placeholder="https://api.yourservice.com/oauth/authorize"
                          className="bg-input border-border"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm text-muted-foreground">Token URL</Label>
                        <Input
                          placeholder="https://api.yourservice.com/oauth/token"
                          className="bg-input border-border"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm text-muted-foreground">Scopes</Label>
                        <Input placeholder="read write admin" className="bg-input border-border" />
                      </div>
                    </div>
                  </div>
                )}

                <Separator />

                <div className="space-y-4">
                  <Label className="text-foreground">Security Features</Label>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="rateLimit" />
                      <Label htmlFor="rateLimit" className="text-sm text-muted-foreground">
                        Enable rate limiting
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="ipWhitelist" />
                      <Label htmlFor="ipWhitelist" className="text-sm text-muted-foreground">
                        Allow IP whitelisting
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="httpsOnly" />
                      <Label htmlFor="httpsOnly" className="text-sm text-muted-foreground">
                        Require HTTPS only
                      </Label>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 5: Monitoring & Analytics */}
          {currentStep === 5 && (
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Monitoring & Analytics
                </CardTitle>
                <CardDescription>Configure monitoring and analytics for your API</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <Label className="text-foreground">Monitoring Configuration</Label>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="uptime" defaultChecked />
                      <Label htmlFor="uptime" className="text-sm text-muted-foreground">
                        Enable uptime monitoring
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="performance" defaultChecked />
                      <Label htmlFor="performance" className="text-sm text-muted-foreground">
                        Track response times and performance metrics
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="errors" defaultChecked />
                      <Label htmlFor="errors" className="text-sm text-muted-foreground">
                        Monitor error rates and status codes
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="usage" defaultChecked />
                      <Label htmlFor="usage" className="text-sm text-muted-foreground">
                        Track API usage and request patterns
                      </Label>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <Label className="text-foreground flex items-center gap-2">
                    <Webhook className="h-4 w-4" />
                    Webhook Configuration
                  </Label>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-sm text-muted-foreground">Webhook URL (Optional)</Label>
                      <Input
                        value={webhookUrl}
                        onChange={(e) => setWebhookUrl(e.target.value)}
                        placeholder="https://your-server.com/webhook"
                        className="bg-input border-border"
                      />
                      <p className="text-xs text-muted-foreground">
                        Receive notifications about API usage, errors, and other events
                      </p>
                    </div>
                    <div className="space-y-3">
                      <Label className="text-sm text-muted-foreground">Webhook Events</Label>
                      <div className="grid md:grid-cols-2 gap-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox id="webhook-usage" />
                          <Label htmlFor="webhook-usage" className="text-xs text-muted-foreground">
                            Usage threshold alerts
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="webhook-errors" />
                          <Label htmlFor="webhook-errors" className="text-xs text-muted-foreground">
                            Error rate alerts
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="webhook-downtime" />
                          <Label htmlFor="webhook-downtime" className="text-xs text-muted-foreground">
                            Downtime notifications
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="webhook-new-users" />
                          <Label htmlFor="webhook-new-users" className="text-xs text-muted-foreground">
                            New user subscriptions
                          </Label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 6: Pricing */}
          {currentStep === 6 && (
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Pricing Configuration</CardTitle>
                <CardDescription>Set up your API pricing model</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-foreground">Pricing Model *</Label>
                  <Select>
                    <SelectTrigger className="bg-input border-border">
                      <SelectValue placeholder="Select pricing model" />
                    </SelectTrigger>
                    <SelectContent>
                      {pricingModels.map((model) => (
                        <SelectItem key={model.value} value={model.value}>
                          {model.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="price" className="text-foreground">
                      Price *
                    </Label>
                    <Input id="price" type="number" step="0.01" placeholder="0.01" className="bg-input border-border" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="currency" className="text-foreground">
                      Currency *
                    </Label>
                    <Select>
                      <SelectTrigger className="bg-input border-border">
                        <SelectValue placeholder="USD" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD</SelectItem>
                        <SelectItem value="EUR">EUR</SelectItem>
                        <SelectItem value="GBP">GBP</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <Label className="text-foreground">Free Tier (Optional)</Label>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="freeTier" />
                    <Label htmlFor="freeTier" className="text-muted-foreground">
                      Offer a free tier with limited usage
                    </Label>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="freeRequests" className="text-foreground">
                        Free Requests per Month
                      </Label>
                      <Input id="freeRequests" type="number" placeholder="1000" className="bg-input border-border" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="rateLimits" className="text-foreground">
                        Rate Limits (requests/minute)
                      </Label>
                      <Input id="rateLimits" type="number" placeholder="60" className="bg-input border-border" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 7: Review */}
          {currentStep === 7 && (
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Review & Submit</CardTitle>
                <CardDescription>Review your API details before submission</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">API Information</h3>
                    <div className="bg-muted/30 rounded-lg p-4 space-y-2">
                      <p>
                        <span className="font-medium">Name:</span> Weather Pro API
                      </p>
                      <p>
                        <span className="font-medium">Category:</span> Weather
                      </p>
                      <p>
                        <span className="font-medium">Base URL:</span> https://api.weatherpro.com/v1
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Authentication & Security</h3>
                    <div className="bg-muted/30 rounded-lg p-4 space-y-2">
                      <p>
                        <span className="font-medium">Method:</span> {authMethod || "Not configured"}
                      </p>
                      <p>
                        <span className="font-medium">Rate Limiting:</span> Enabled
                      </p>
                      <p>
                        <span className="font-medium">HTTPS Only:</span> Required
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Monitoring</h3>
                    <div className="bg-muted/30 rounded-lg p-4 space-y-2">
                      <p>
                        <span className="font-medium">Uptime Monitoring:</span> Enabled
                      </p>
                      <p>
                        <span className="font-medium">Performance Tracking:</span> Enabled
                      </p>
                      <p>
                        <span className="font-medium">Webhook URL:</span> {webhookUrl || "Not configured"}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Pricing</h3>
                    <div className="bg-muted/30 rounded-lg p-4 space-y-2">
                      <p>
                        <span className="font-medium">Model:</span> Per Request
                      </p>
                      <p>
                        <span className="font-medium">Price:</span> $0.01 USD per request
                      </p>
                      <p>
                        <span className="font-medium">Free Tier:</span> 1,000 requests/month
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Terms & Conditions</h3>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="terms" />
                        <Label htmlFor="terms" className="text-sm text-muted-foreground">
                          I agree to the Veil API Provider Terms of Service
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="sla" />
                        <Label htmlFor="sla" className="text-sm text-muted-foreground">
                          I commit to maintaining 99% uptime SLA
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="support" />
                        <Label htmlFor="support" className="text-sm text-muted-foreground">
                          I will provide timely support to API users
                        </Label>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <Button onClick={prevStep} variant="outline" disabled={currentStep === 1} className="bg-transparent">
              Previous
            </Button>
            <div className="flex gap-3">
              <Button variant="outline" className="bg-transparent">
                Save Draft
              </Button>
              {currentStep < 7 ? (
                <Button onClick={nextStep} className="bg-primary text-primary-foreground hover:bg-primary/90">
                  Next
                </Button>
              ) : (
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90">Submit for Review</Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
