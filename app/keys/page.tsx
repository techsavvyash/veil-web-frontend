"use client"

import { useState } from "react"
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
} from "lucide-react"
import { Navigation } from "@/components/navigation"

// Mock data
const apiKeys = [
  {
    id: "1",
    name: "Weather Pro API - Production",
    apiName: "Weather Pro API",
    key: "veil_live_sk_1234567890abcdef",
    status: "active",
    created: "2024-01-15",
    lastUsed: "2024-01-20",
    requests: 45230,
    limit: 100000,
    environment: "production",
  },
  {
    id: "2",
    name: "AI Text Analyzer - Development",
    apiName: "AI Text Analyzer",
    key: "veil_test_sk_abcdef1234567890",
    status: "active",
    created: "2024-01-10",
    lastUsed: "2024-01-19",
    requests: 12450,
    limit: 50000,
    environment: "development",
  },
  {
    id: "3",
    name: "Crypto Market Data - Production",
    apiName: "Crypto Market Data",
    key: "veil_live_sk_fedcba0987654321",
    status: "revoked",
    created: "2023-12-20",
    lastUsed: "2024-01-18",
    requests: 89760,
    limit: 200000,
    environment: "production",
  },
]

const usageData = [
  { date: "Jan 14", requests: 1200 },
  { date: "Jan 15", requests: 1800 },
  { date: "Jan 16", requests: 2400 },
  { date: "Jan 17", requests: 1900 },
  { date: "Jan 18", requests: 3200 },
  { date: "Jan 19", requests: 2800 },
  { date: "Jan 20", requests: 4100 },
]

const errorData = [
  { type: "200 OK", count: 42150, color: "#22c55e" },
  { type: "400 Bad Request", count: 1250, color: "#f59e0b" },
  { type: "401 Unauthorized", count: 890, color: "#ef4444" },
  { type: "429 Rate Limited", count: 340, color: "#8b5cf6" },
  { type: "500 Server Error", count: 120, color: "#6b7280" },
]

export default function APIKeysPage() {
  const [selectedKey, setSelectedKey] = useState(apiKeys[0])
  const [showKey, setShowKey] = useState<{ [key: string]: boolean }>({})
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  const toggleKeyVisibility = (keyId: string) => {
    setShowKey((prev) => ({ ...prev, [keyId]: !prev[keyId] }))
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const maskKey = (key: string) => {
    return key.substring(0, 12) + "..." + key.substring(key.length - 4)
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
                  <Input id="keyName" placeholder="e.g., Production Key" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="apiSelect">Select API</Label>
                  <select className="w-full p-2 border border-border rounded-md bg-input">
                    <option>Weather Pro API</option>
                    <option>AI Text Analyzer</option>
                    <option>Crypto Market Data</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="environment">Environment</Label>
                  <select className="w-full p-2 border border-border rounded-md bg-input">
                    <option>Production</option>
                    <option>Development</option>
                    <option>Testing</option>
                  </select>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button className="bg-primary text-primary-foreground hover:bg-primary/90">Generate Key</Button>
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
                  {apiKeys.map((key) => (
                    <div
                      key={key.id}
                      className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                        selectedKey.id === key.id
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                      onClick={() => setSelectedKey(key)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-foreground text-sm">{key.name}</h4>
                        <Badge variant={key.status === "active" ? "default" : "destructive"} className="text-xs">
                          {key.status}
                        </Badge>
                      </div>
                      <div className="text-xs text-muted-foreground mb-2">
                        {showKey[key.id] ? key.key : maskKey(key.key)}
                      </div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>Usage: {((key.requests / key.limit) * 100).toFixed(1)}%</span>
                        <span>Last used: {key.lastUsed}</span>
                      </div>
                      <Progress value={(key.requests / key.limit) * 100} className="mt-2 h-1" />
                    </div>
                  ))}
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
                {/* Key Info Card */}
                <Card className="border-border">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-foreground">{selectedKey.name}</CardTitle>
                        <CardDescription>{selectedKey.apiName}</CardDescription>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm" className="bg-transparent">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem>
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Regenerate Key
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Copy className="h-4 w-4 mr-2" />
                            Copy Key
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
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
                          {showKey[selectedKey.id] ? selectedKey.key : maskKey(selectedKey.key)}
                        </code>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleKeyVisibility(selectedKey.id)}
                          className="bg-transparent"
                        >
                          {showKey[selectedKey.id] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(selectedKey.key)}
                          className="bg-transparent"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-foreground">
                          {selectedKey.requests.toLocaleString()}
                        </div>
                        <div className="text-sm text-muted-foreground">Requests</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-foreground">{selectedKey.limit.toLocaleString()}</div>
                        <div className="text-sm text-muted-foreground">Limit</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-foreground">
                          {((selectedKey.requests / selectedKey.limit) * 100).toFixed(1)}%
                        </div>
                        <div className="text-sm text-muted-foreground">Usage</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-foreground">99.8%</div>
                        <div className="text-sm text-muted-foreground">Uptime</div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Usage this month</span>
                        <span className="text-foreground">
                          {selectedKey.requests.toLocaleString()} / {selectedKey.limit.toLocaleString()}
                        </span>
                      </div>
                      <Progress value={(selectedKey.requests / selectedKey.limit) * 100} className="h-2" />
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
                          <div className="font-medium text-foreground capitalize">{selectedKey.status}</div>
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
                          <div className="font-medium text-foreground">{selectedKey.created}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="border-border">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-5 w-5 text-primary" />
                        <div>
                          <div className="text-sm text-muted-foreground">Environment</div>
                          <div className="font-medium text-foreground capitalize">{selectedKey.environment}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="analytics" className="space-y-6">
                {/* Usage Chart */}
                <Card className="border-border">
                  <CardHeader>
                    <CardTitle className="text-foreground">Request Volume</CardTitle>
                    <CardDescription>Daily API requests over the last 7 days</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={usageData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#5C5D5F" opacity={0.3} />
                        <XAxis dataKey="date" stroke="#5C5D5F" />
                        <YAxis stroke="#5C5D5F" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "white",
                            border: "1px solid #5C5D5F",
                            borderRadius: "8px",
                          }}
                        />
                        <Line type="monotone" dataKey="requests" stroke="#3C3D3F" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Response Status */}
                <Card className="border-border">
                  <CardHeader>
                    <CardTitle className="text-foreground">Response Status Distribution</CardTitle>
                    <CardDescription>HTTP response codes for the last 30 days</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={errorData} layout="horizontal">
                        <CartesianGrid strokeDasharray="3 3" stroke="#5C5D5F" opacity={0.3} />
                        <XAxis type="number" stroke="#5C5D5F" />
                        <YAxis dataKey="type" type="category" stroke="#5C5D5F" width={120} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "white",
                            border: "1px solid #5C5D5F",
                            borderRadius: "8px",
                          }}
                        />
                        <Bar dataKey="count" fill="#3C3D3F" />
                      </BarChart>
                    </ResponsiveContainer>
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
                      <Input id="keyName" value={selectedKey.name} className="bg-input border-border" />
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
                      >
                        Regenerate
                      </Button>
                    </div>
                    <div className="flex items-center justify-between p-4 border border-destructive/20 rounded-lg">
                      <div>
                        <h4 className="font-medium text-foreground">Revoke API Key</h4>
                        <p className="text-sm text-muted-foreground">Permanently disable this key</p>
                      </div>
                      <Button variant="destructive">Revoke Key</Button>
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
