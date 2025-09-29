"use client"

import { useState, useEffect } from "react"
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
import { apiClient } from "@/lib/api-client"
import { useAuth } from "@/lib/auth"

// Categories will be fetched from API

const pricingModels = [
  { value: "per_request", label: "Per Request" },
  { value: "monthly", label: "Monthly Subscription" },
  { value: "yearly", label: "Yearly Subscription" },
  { value: "free", label: "Free" },
]

export default function OnboardAPIPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [submitError, setSubmitError] = useState("")
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const { user } = useAuth()

  // Form data state
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    shortDescription: "",
    longDescription: "",
    baseUrl: "",
    version: "1.0.0",
    price: "0.01",
    pricingModel: "per_request" as "per_request" | "monthly" | "yearly" | "free",
    requestLimit: 1000,
    isPublic: true,
    documentation: "",
    currency: "USD",
    sampleRequest: "",
    sampleResponse: "",
    apiKeyHeaderName: "X-API-Key",
    apiKeyFormat: "uuid",
    oauthAuthUrl: "",
    oauthTokenUrl: "",
    oauthScopes: "",
    rateLimitPerMin: 60,
    freeTierEnabled: false,
    rateLimit: true,
    ipWhitelist: false,
    httpsOnly: true,
    uptimeMonitoring: true,
    performanceTracking: true,
    errorMonitoring: true,
    usageTracking: true,
    termsAccepted: false,
    slaAccepted: false,
    supportAccepted: false
  })
  
  const [tags, setTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState("")
  const [endpoints, setEndpoints] = useState([{ method: "GET", path: "", description: "" }])
  const [testResults, setTestResults] = useState<{ endpoint: string; status: string; responseTime: number }[]>([])
  const [authMethod, setAuthMethod] = useState("")
  const [webhookUrl, setWebhookUrl] = useState("")
  const [categories, setCategories] = useState<Array<{id: number, name: string, description?: string}>>([])
  const [categoriesLoading, setCategoriesLoading] = useState(true)

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

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setCategoriesLoading(true)
        const response = await apiClient.getCategories()
        setCategories(response.categories)
      } catch (error) {
        console.error('Failed to fetch categories:', error)
        // Fallback to basic categories if API fails
        setCategories([
          { id: 1, name: "Weather", description: "Weather and climate APIs" },
          { id: 2, name: "Finance", description: "Financial data and trading APIs" },
          { id: 3, name: "AI/ML", description: "Artificial Intelligence and Machine Learning APIs" },
          { id: 4, name: "Communication", description: "Messaging and communication APIs" },
        ])
      } finally {
        setCategoriesLoading(false)
      }
    }

    fetchCategories()
  }, [])

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async () => {
    if (!user) {
      setSubmitError("You must be logged in to submit an API")
      return
    }

    setLoading(true)
    setSubmitError("")

    try {
      // Find the category ID from the fetched categories
      const selectedCategory = categories.find(cat => cat.name === formData.category)
      if (!selectedCategory) {
        setSubmitError("Please select a valid category")
        return
      }

      // Create full endpoint URL if path is relative
      const endpointUrl = endpoints[0]?.path 
        ? (endpoints[0].path.startsWith('http') ? endpoints[0].path : `${formData.baseUrl}${endpoints[0].path}`)
        : formData.baseUrl

      const apiData = {
        name: formData.name,
        description: formData.longDescription,
        version: formData.version,
        endpoint: endpointUrl,
        baseUrl: formData.baseUrl,
        categoryId: selectedCategory.id,
        documentation: formData.documentation,
        price: formData.price,
        pricingModel: formData.pricingModel,
        requestLimit: formData.requestLimit,
        isPublic: formData.isPublic,
        methods: endpoints.map(e => e.method) as ("GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "OPTIONS" | "HEAD")[],
        requiredHeaders: authMethod ? [{ name: "Authorization", description: `${authMethod} authentication required` }] : []
      }

      await apiClient.createApi(apiData)
      setSubmitSuccess(true)
    } catch (error) {
      console.error("Failed to submit API:", error)
      setSubmitError(error instanceof Error ? error.message : "Failed to submit API. Please try again.")
    } finally {
      setLoading(false)
    }
  }

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

        {/* Error/Success Messages */}
        {submitError && (
          <div className="max-w-4xl mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <div className="text-red-800 dark:text-red-200">{submitError}</div>
          </div>
        )}
        
        {submitSuccess && (
          <div className="max-w-4xl mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <div className="text-green-800 dark:text-green-200">
              🎉 API submitted successfully! It will be reviewed and published to the marketplace soon.
            </div>
          </div>
        )}

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
                    <Input 
                      id="apiName" 
                      placeholder="e.g., Weather Pro API" 
                      className="bg-input border-border"
                      value={formData.name}
                      onChange={(e) => updateFormData("name", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category" className="text-foreground">
                      Category *
                    </Label>
                    <Select value={formData.category} onValueChange={(value) => updateFormData("category", value)}>
                      <SelectTrigger className="bg-input border-border">
                        <SelectValue placeholder={categoriesLoading ? "Loading categories..." : "Select a category"} />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.name}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="baseUrl" className="text-foreground">
                      Base URL *
                    </Label>
                    <Input 
                      id="baseUrl" 
                      placeholder="https://api.yourservice.com/v1" 
                      className="bg-input border-border"
                      value={formData.baseUrl}
                      onChange={(e) => updateFormData("baseUrl", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="version" className="text-foreground">
                      Version *
                    </Label>
                    <Input 
                      id="version" 
                      placeholder="1.0.0" 
                      className="bg-input border-border"
                      value={formData.version}
                      onChange={(e) => updateFormData("version", e.target.value)}
                    />
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
                    value={formData.shortDescription}
                    onChange={(e) => updateFormData("shortDescription", e.target.value)}
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
                    value={formData.longDescription}
                    onChange={(e) => updateFormData("longDescription", e.target.value)}
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
                  <Label className="text-foreground">Documentation</Label>
                  <Textarea
                    placeholder="Provide additional documentation, usage examples, or any other relevant information..."
                    rows={4}
                    className="bg-input border-border"
                    value={formData.documentation}
                    onChange={(e) => updateFormData("documentation", e.target.value)}
                  />
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
                        value={formData.sampleRequest}
                        onChange={(e) => updateFormData("sampleRequest", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm text-muted-foreground">Sample Response</Label>
                      <Textarea
                        placeholder="Provide a sample response (JSON)"
                        rows={4}
                        className="bg-input border-border font-mono text-sm"
                        value={formData.sampleResponse}
                        onChange={(e) => updateFormData("sampleResponse", e.target.value)}
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
                        <Input 
                          placeholder="X-API-Key" 
                          className="bg-input border-border"
                          value={formData.apiKeyHeaderName}
                          onChange={(e) => updateFormData("apiKeyHeaderName", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm text-muted-foreground">Key Format</Label>
                        <Select value={formData.apiKeyFormat} onValueChange={(value) => updateFormData("apiKeyFormat", value)}>
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
                          value={formData.oauthAuthUrl}
                          onChange={(e) => updateFormData("oauthAuthUrl", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm text-muted-foreground">Token URL</Label>
                        <Input
                          placeholder="https://api.yourservice.com/oauth/token"
                          className="bg-input border-border"
                          value={formData.oauthTokenUrl}
                          onChange={(e) => updateFormData("oauthTokenUrl", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm text-muted-foreground">Scopes</Label>
                        <Input 
                          placeholder="read write admin" 
                          className="bg-input border-border"
                          value={formData.oauthScopes}
                          onChange={(e) => updateFormData("oauthScopes", e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                )}

                <Separator />

                <div className="space-y-4">
                  <Label className="text-foreground">Security Features</Label>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="rateLimit"
                        checked={formData.rateLimit}
                        onCheckedChange={(checked) => updateFormData("rateLimit", checked)}
                      />
                      <Label htmlFor="rateLimit" className="text-sm text-muted-foreground">
                        Enable rate limiting
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="ipWhitelist"
                        checked={formData.ipWhitelist}
                        onCheckedChange={(checked) => updateFormData("ipWhitelist", checked)}
                      />
                      <Label htmlFor="ipWhitelist" className="text-sm text-muted-foreground">
                        Allow IP whitelisting
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="httpsOnly"
                        checked={formData.httpsOnly}
                        onCheckedChange={(checked) => updateFormData("httpsOnly", checked)}
                      />
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
                      <Checkbox 
                        id="uptime"
                        checked={formData.uptimeMonitoring}
                        onCheckedChange={(checked) => updateFormData("uptimeMonitoring", checked)}
                      />
                      <Label htmlFor="uptime" className="text-sm text-muted-foreground">
                        Enable uptime monitoring
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="performance"
                        checked={formData.performanceTracking}
                        onCheckedChange={(checked) => updateFormData("performanceTracking", checked)}
                      />
                      <Label htmlFor="performance" className="text-sm text-muted-foreground">
                        Track response times and performance metrics
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="errors"
                        checked={formData.errorMonitoring}
                        onCheckedChange={(checked) => updateFormData("errorMonitoring", checked)}
                      />
                      <Label htmlFor="errors" className="text-sm text-muted-foreground">
                        Monitor error rates and status codes
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="usage"
                        checked={formData.usageTracking}
                        onCheckedChange={(checked) => updateFormData("usageTracking", checked)}
                      />
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
                  <Select value={formData.pricingModel} onValueChange={(value) => updateFormData("pricingModel", value as "per_request" | "monthly" | "yearly" | "free")}>
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
                    <Input 
                      id="price" 
                      type="number" 
                      step="0.01" 
                      placeholder="0.01" 
                      className="bg-input border-border"
                      value={formData.price}
                      onChange={(e) => updateFormData("price", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="currency" className="text-foreground">
                      Currency *
                    </Label>
                    <Select value={formData.currency} onValueChange={(value) => updateFormData("currency", value)}>
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
                    <Checkbox 
                      id="freeTier"
                      checked={formData.freeTierEnabled}
                      onCheckedChange={(checked) => updateFormData("freeTierEnabled", checked)}
                    />
                    <Label htmlFor="freeTier" className="text-muted-foreground">
                      Offer a free tier with limited usage
                    </Label>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="freeRequests" className="text-foreground">
                        Free Requests per Month
                      </Label>
                      <Input 
                        id="freeRequests" 
                        type="number" 
                        placeholder="1000" 
                        className="bg-input border-border"
                        value={formData.requestLimit}
                        onChange={(e) => updateFormData("requestLimit", parseInt(e.target.value) || 1000)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="rateLimits" className="text-foreground">
                        Rate Limits (requests/minute)
                      </Label>
                      <Input 
                        id="rateLimits" 
                        type="number" 
                        placeholder="60" 
                        className="bg-input border-border"
                        value={formData.rateLimitPerMin}
                        onChange={(e) => updateFormData("rateLimitPerMin", parseInt(e.target.value) || 60)}
                      />
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
                        <span className="font-medium">Name:</span> {formData.name || 'Not specified'}
                      </p>
                      <p>
                        <span className="font-medium">Category:</span> {formData.category || 'Not selected'}
                      </p>
                      <p>
                        <span className="font-medium">Base URL:</span> {formData.baseUrl || 'Not specified'}
                      </p>
                      <p>
                        <span className="font-medium">Version:</span> {formData.version || 'Not specified'}
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
                        <span className="font-medium">Rate Limiting:</span> {formData.rateLimit ? 'Enabled' : 'Disabled'}
                      </p>
                      <p>
                        <span className="font-medium">HTTPS Only:</span> {formData.httpsOnly ? 'Required' : 'Optional'}
                      </p>
                      <p>
                        <span className="font-medium">IP Whitelisting:</span> {formData.ipWhitelist ? 'Enabled' : 'Disabled'}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Monitoring</h3>
                    <div className="bg-muted/30 rounded-lg p-4 space-y-2">
                      <p>
                        <span className="font-medium">Uptime Monitoring:</span> {formData.uptimeMonitoring ? 'Enabled' : 'Disabled'}
                      </p>
                      <p>
                        <span className="font-medium">Performance Tracking:</span> {formData.performanceTracking ? 'Enabled' : 'Disabled'}
                      </p>
                      <p>
                        <span className="font-medium">Error Monitoring:</span> {formData.errorMonitoring ? 'Enabled' : 'Disabled'}
                      </p>
                      <p>
                        <span className="font-medium">Usage Tracking:</span> {formData.usageTracking ? 'Enabled' : 'Disabled'}
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
                        <span className="font-medium">Model:</span> {pricingModels.find(m => m.value === formData.pricingModel)?.label || 'Not selected'}
                      </p>
                      <p>
                        <span className="font-medium">Price:</span> {formData.pricingModel === 'free' ? 'Free' : `$${formData.price} ${formData.currency} ${formData.pricingModel === 'per_request' ? 'per request' : `per ${formData.pricingModel.replace('ly', '')}`}`}
                      </p>
                      <p>
                        <span className="font-medium">Request Limit:</span> {formData.requestLimit.toLocaleString()} requests
                      </p>
                      <p>
                        <span className="font-medium">Rate Limit:</span> {formData.rateLimitPerMin} requests/minute
                      </p>
                      {formData.freeTierEnabled && (
                        <p>
                          <span className="font-medium">Free Tier:</span> {formData.requestLimit.toLocaleString()} requests/month
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Terms & Conditions</h3>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="terms"
                          checked={formData.termsAccepted}
                          onCheckedChange={(checked) => updateFormData("termsAccepted", checked)}
                        />
                        <Label htmlFor="terms" className="text-sm text-muted-foreground">
                          I agree to the Veil API Provider Terms of Service
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="sla"
                          checked={formData.slaAccepted}
                          onCheckedChange={(checked) => updateFormData("slaAccepted", checked)}
                        />
                        <Label htmlFor="sla" className="text-sm text-muted-foreground">
                          I commit to maintaining 99% uptime SLA
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="support"
                          checked={formData.supportAccepted}
                          onCheckedChange={(checked) => updateFormData("supportAccepted", checked)}
                        />
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
                <Button 
                  onClick={handleSubmit}
                  disabled={loading}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {loading ? "Submitting..." : "Submit for Review"}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
