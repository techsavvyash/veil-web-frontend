"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Progress } from "@/components/ui/progress"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"
import {
  Key,
  Copy,
  Eye,
  EyeOff,
  MoreHorizontal,
  RefreshCw,
  Trash2,
  Plus,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Loader2,
  BarChart3,
  TrendingUp,
} from "lucide-react"
import { Navigation } from "@/components/navigation"
import { apiClient } from "@/lib/api-client"
import type { ApiKey, Subscription, CreateApiKeyRequest } from "@/lib/types"


export default function APIKeysPage() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([])
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [selectedKey, setSelectedKey] = useState<ApiKey | null>(null)
  const [showKey, setShowKey] = useState<{ [key: string]: boolean }>({})
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)
  const [newKeyName, setNewKeyName] = useState("")
  const [selectedSubscriptionUid, setSelectedSubscriptionUid] = useState<string>("")

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true)
        const [keysResponse, subscriptionsResponse] = await Promise.all([
          apiClient.getApiKeys(),
          apiClient.getUserSubscriptions()
        ])

        // Handle API response format - backend returns { apiKeys: [...] }
        const keys = keysResponse.apiKeys || keysResponse || []
        const subs = subscriptionsResponse.subscriptions || subscriptionsResponse || []

        setApiKeys(keys)
        setSubscriptions(subs)

        // Set first key as selected if available
        if (keys.length > 0 && !selectedKey) {
          setSelectedKey(keys[0])
        }
      } catch (error) {
        console.error('Failed to load data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  const handleCreateApiKey = async () => {
    if (!newKeyName.trim() || !selectedSubscriptionUid) return

    try {
      setIsCreating(true)
      const newKey = await apiClient.createApiKey(selectedSubscriptionUid, {
        name: newKeyName.trim()
      })

      setApiKeys(prev => [...prev, newKey])
      setSelectedKey(newKey)
      setIsCreateDialogOpen(false)
      setNewKeyName("")
      setSelectedSubscriptionUid("")
    } catch (error) {
      console.error('Failed to create API key:', error)
    } finally {
      setIsCreating(false)
    }
  }

  const handleRegenerateKey = async (keyUid: string) => {
    try {
      const regeneratedKey = await apiClient.regenerateApiKey(keyUid)
      setApiKeys(prev => prev.map(key => key.uid === keyUid ? regeneratedKey : key))
      if (selectedKey?.uid === keyUid) {
        setSelectedKey(regeneratedKey)
      }
    } catch (error) {
      console.error('Failed to regenerate API key:', error)
    }
  }

  const handleDeleteKey = async (keyUid: string) => {
    try {
      await apiClient.deleteApiKey(keyUid)
      setApiKeys(prev => prev.filter(key => key.uid !== keyUid))
      if (selectedKey?.uid === keyUid) {
        setSelectedKey(apiKeys.length > 1 ? apiKeys.find(k => k.uid !== keyUid) || null : null)
      }
    } catch (error) {
      console.error('Failed to delete API key:', error)
    }
  }

  const toggleKeyVisibility = (keyId: string) => {
    setShowKey((prev) => ({ ...prev, [keyId]: !prev[keyId] }))
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const maskKey = (key: string) => {
    return key.substring(0, 12) + "..." + key.substring(key.length - 4)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">API Keys</h1>
            <p className="text-muted-foreground">Manage your API keys and monitor usage</p>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90 mt-4 md:mt-0">
                <Plus className="h-4 w-4 mr-2" />
                Create New Key
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Create New API Key</DialogTitle>
                <DialogDescription>Generate a new API key for your subscribed APIs</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="keyName">Key Name</Label>
                  <Input
                    id="keyName"
                    placeholder="e.g., Production Key"
                    value={newKeyName}
                    onChange={(e) => setNewKeyName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="apiSelect">Select API</Label>
                  <select
                    className="w-full p-2 border border-border rounded-md bg-input"
                    value={selectedSubscriptionUid}
                    onChange={(e) => setSelectedSubscriptionUid(e.target.value)}
                  >
                    <option value="">Select a subscription</option>
                    {subscriptions.filter(sub => sub.isActive ?? sub.is_active).map(sub => (
                      <option key={sub.uid} value={sub.uid}>
                        {sub.api?.name || 'Unknown API'} - {sub.status}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                    onClick={handleCreateApiKey}
                    disabled={isCreating || !newKeyName.trim() || !selectedSubscriptionUid}
                  >
                    {isCreating ? (
                      <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Creating...</>
                    ) : (
                      'Generate Key'
                    )}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* API Keys List */}
          <div className="lg:col-span-1">
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Your API Keys</CardTitle>
                <CardDescription>Manage and monitor your active keys</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {apiKeys.length === 0 ? (
                    <div className="text-center py-8">
                      <Key className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium text-foreground mb-2">No API Keys</h3>
                      <p className="text-muted-foreground mb-4">Create your first API key to get started</p>
                    </div>
                  ) : (
                    apiKeys.map((key) => (
                      <div
                        key={key.uid}
                        className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                          selectedKey?.uid === key.uid
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        }`}
                        onClick={() => setSelectedKey(key)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-foreground text-sm">{key.name}</h4>
                          <Badge variant={(key.isActive ?? key.is_active) ? "default" : "destructive"} className="text-xs">
                            {(key.isActive ?? key.is_active) ? "active" : "inactive"}
                          </Badge>
                        </div>
                        <div className="text-xs text-muted-foreground mb-2">
                          {showKey[key.uid] ? (key.keyValue || key.key_value) : maskKey(key.keyValue || key.key_value)}
                        </div>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>Usage: {key.subscription ? ((key.subscription.requestsUsed || 0) / (key.subscription.requestsLimit || 1000) * 100).toFixed(1) : '0'}%</span>
                          <span>Last used: {key.lastUsed || key.last_used || 'Never'}</span>
                        </div>
                        <Progress value={key.subscription ? ((key.subscription.requestsUsed || 0) / (key.subscription.requestsLimit || 1000) * 100) : 0} className="mt-2 h-1" />
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Key Details and Analytics */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                {selectedKey ? (
                  <>
                {/* Key Info Card */}
                <Card className="border-border">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-foreground">{selectedKey.name}</CardTitle>
                        <CardDescription>{selectedKey.subscription?.api?.name || 'Unknown API'}</CardDescription>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm" className="bg-transparent">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem onClick={() => handleRegenerateKey(selectedKey.uid)}>
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Regenerate Key
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => copyToClipboard(selectedKey.keyValue || selectedKey.key_value)}>
                            <Copy className="h-4 w-4 mr-2" />
                            Copy Key
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteKey(selectedKey.uid)}>
                            <Trash2 className="h-4 w-4 mr-2" />
                            Revoke Key
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Key className="h-4 w-4 text-muted-foreground" />
                        <code className="text-sm font-mono">
                          {showKey[selectedKey.uid] ? (selectedKey.keyValue || selectedKey.key_value) : maskKey(selectedKey.keyValue || selectedKey.key_value)}
                        </code>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleKeyVisibility(selectedKey.uid)}
                          className="bg-transparent"
                        >
                          {showKey[selectedKey.uid] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(selectedKey.keyValue || selectedKey.key_value)}
                          className="bg-transparent"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-foreground">
                          {(selectedKey.requestsUsed || selectedKey.requests_used || 0).toLocaleString()}
                        </div>
                        <div className="text-sm text-muted-foreground">Requests</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-foreground">{(selectedKey.subscription?.requestsLimit || selectedKey.subscription?.requests_limit || 1000).toLocaleString()}</div>
                        <div className="text-sm text-muted-foreground">Limit</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-foreground">
                          {(((selectedKey.requestsUsed || selectedKey.requests_used || 0) / (selectedKey.subscription?.requestsLimit || selectedKey.subscription?.requests_limit || 1000)) * 100).toFixed(1)}%
                        </div>
                        <div className="text-sm text-muted-foreground">Usage</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-foreground">N/A</div>
                        <div className="text-sm text-muted-foreground">Uptime</div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Usage this month</span>
                        <span className="text-foreground">
                          {(selectedKey.requestsUsed || selectedKey.requests_used || 0).toLocaleString()} / {(selectedKey.subscription?.requestsLimit || selectedKey.subscription?.requests_limit || 1000).toLocaleString()}
                        </span>
                      </div>
                      <Progress value={((selectedKey.requestsUsed || selectedKey.requests_used || 0) / (selectedKey.subscription?.requestsLimit || selectedKey.subscription?.requests_limit || 1000)) * 100} className="h-2" />
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Stats */}
                <div className="grid md:grid-cols-3 gap-4">
                  <Card className="border-border">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-2">
                        <Activity className="h-5 w-5 text-green-500" />
                        <div>
                          <div className="text-sm text-muted-foreground">Status</div>
                          <div className="font-medium text-foreground capitalize">{(selectedKey.isActive ?? selectedKey.is_active) ? 'Active' : 'Inactive'}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="border-border">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-2">
                        <Clock className="h-5 w-5 text-blue-500" />
                        <div>
                          <div className="text-sm text-muted-foreground">Created</div>
                          <div className="font-medium text-foreground">{new Date(selectedKey.createdAt || selectedKey.created_at).toLocaleDateString()}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="border-border">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-5 w-5 text-primary" />
                        <div>
                          <div className="text-sm text-muted-foreground">Last Used</div>
                          <div className="font-medium text-foreground">
                            {(selectedKey.lastUsed || selectedKey.last_used) ? new Date(selectedKey.lastUsed || selectedKey.last_used).toLocaleDateString() : 'Never'}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                  </>
                ) : (
                  <Card className="border-border">
                    <CardContent className="p-8 text-center">
                      <Key className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium text-foreground mb-2">No API Key Selected</h3>
                      <p className="text-muted-foreground mb-4">Select an API key from the list to view its details</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="analytics" className="space-y-6">
                {/* Usage Chart */}
                <Card className="border-border">
                  <CardHeader>
                    <CardTitle className="text-foreground">Request Volume</CardTitle>
                    <CardDescription>Daily API requests over the last 7 days</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px] flex flex-col items-center justify-center text-center">
                      <TrendingUp className="h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium text-foreground mb-2">Analytics Coming Soon</h3>
                      <p className="text-muted-foreground max-w-sm">
                        Detailed usage analytics and request volume charts will be available here once we integrate with our analytics service.
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Response Status */}
                <Card className="border-border">
                  <CardHeader>
                    <CardTitle className="text-foreground">Response Status Distribution</CardTitle>
                    <CardDescription>HTTP response codes for the last 30 days</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px] flex flex-col items-center justify-center text-center">
                      <BarChart3 className="h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium text-foreground mb-2">Response Analytics Coming Soon</h3>
                      <p className="text-muted-foreground max-w-sm">
                        Response status distribution charts and error analytics will be available here once we integrate with our monitoring service.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="settings" className="space-y-6">
                <Card className="border-border">
                  <CardHeader>
                    <CardTitle className="text-foreground">Key Settings</CardTitle>
                    <CardDescription>Configure your API key permissions and limits</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="keyName" className="text-foreground">
                        Key Name
                      </Label>
                      <Input id="keyName" value={selectedKey?.name || ''} className="bg-input border-border" />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-foreground">Rate Limiting</Label>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="rateLimit" className="text-sm text-muted-foreground">
                            Requests per minute
                          </Label>
                          <Input id="rateLimit" type="number" value="1000" className="bg-input border-border" />
                        </div>
                        <div>
                          <Label htmlFor="burstLimit" className="text-sm text-muted-foreground">
                            Burst limit
                          </Label>
                          <Input id="burstLimit" type="number" value="2000" className="bg-input border-border" />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-foreground">Allowed Origins</Label>
                      <Input
                        placeholder="https://yourdomain.com, https://app.yourdomain.com"
                        className="bg-input border-border"
                      />
                      <p className="text-xs text-muted-foreground">Comma-separated list of allowed origins for CORS</p>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-foreground">IP Restrictions</Label>
                      <Input placeholder="192.168.1.0/24, 10.0.0.1" className="bg-input border-border" />
                      <p className="text-xs text-muted-foreground">
                        Comma-separated list of allowed IP addresses or CIDR blocks
                      </p>
                    </div>

                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" className="bg-transparent">
                        Cancel
                      </Button>
                      <Button className="bg-primary text-primary-foreground hover:bg-primary/90">Save Changes</Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border border-destructive/20">
                  <CardHeader>
                    <CardTitle className="text-foreground flex items-center">
                      <AlertTriangle className="h-5 w-5 text-destructive mr-2" />
                      Danger Zone
                    </CardTitle>
                    <CardDescription>Irreversible actions for this API key</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-4 border border-destructive/20 rounded-lg">
                      <div>
                        <h4 className="font-medium text-foreground">Regenerate API Key</h4>
                        <p className="text-sm text-muted-foreground">
                          Generate a new key and invalidate the current one
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        className="text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground bg-transparent"
                        onClick={() => selectedKey && handleRegenerateKey(selectedKey.uid)}
                      >
                        Regenerate
                      </Button>
                    </div>
                    <div className="flex items-center justify-between p-4 border border-destructive/20 rounded-lg">
                      <div>
                        <h4 className="font-medium text-foreground">Revoke API Key</h4>
                        <p className="text-sm text-muted-foreground">Permanently disable this key</p>
                      </div>
                      <Button variant="destructive" onClick={() => selectedKey && handleDeleteKey(selectedKey.uid)}>Revoke Key</Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}