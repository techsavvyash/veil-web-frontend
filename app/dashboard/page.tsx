"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { DollarSign, TrendingUp, Users, Activity, Plus, Settings, Eye, Pause, Play, MoreHorizontal, AlertCircle } from "lucide-react"
import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { apiClient } from "@/lib/api-client"
import { useAuth } from "@/lib/auth"

interface DashboardStats {
  totalApis: number;
  totalSubscriptions: number;
  totalRevenue: string;
}

interface DashboardData {
  stats: DashboardStats;
  recentApis: API[];
}

interface ChartData {
  revenueData: Array<{ month: string; revenue: number }>;
  usageData: Array<{ day: string; requests: number }>;
  apiDistribution: Array<{ name: string; value: number; color: string }>;
}

interface API {
  id: number;
  uid: string;
  name: string;
  description: string;
  version: string;
  endpoint: string;
  price: string;
  pricingModel: string;
  isActive: boolean;
  isPublic: boolean;
  averageRating: string;
  totalRatings: number;
  totalSubscriptions: number;
  createdAt: string;
  category?: {
    id: number;
    name: string;
  };
}

export default function DashboardPage() {
  const { user } = useAuth()
  const [selectedPeriod, setSelectedPeriod] = useState("30d")
  const [myAPIs, setMyAPIs] = useState<API[]>([])
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [chartData, setChartData] = useState<ChartData | null>(null)
  const [loading, setLoading] = useState(true)
  const [dashboardLoading, setDashboardLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [dashboardError, setDashboardError] = useState<string | null>(null)

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) {
        setDashboardLoading(false)
        return
      }

      try {
        setDashboardLoading(true)
        const data = await apiClient.getSellerDashboard()
        setDashboardData(data)
      } catch (err: any) {
        setDashboardError(err.message || 'Failed to fetch dashboard data')
      } finally {
        setDashboardLoading(false)
      }
    }

    fetchDashboardData()
  }, [user])

  // Fetch user's APIs
  useEffect(() => {
    const fetchAPIs = async () => {
      if (!user) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        const data = await apiClient.getSellerApis()
        setMyAPIs(data.apis || [])
      } catch (err: any) {
        setError(err.message || 'Failed to fetch APIs')
      } finally {
        setLoading(false)
      }
    }

    fetchAPIs()
  }, [user])

  // Generate chart data from real APIs (placeholder implementation)
  useEffect(() => {
    if (myAPIs.length > 0) {
      // For now, generate placeholder chart data based on real API data
      // In a real implementation, this would come from analytics endpoints
      const apiDistribution = myAPIs.slice(0, 5).map((api, index) => ({
        name: api.name,
        value: Math.max(10, api.totalSubscriptions * 5), // Placeholder calculation
        color: `hsl(${index * 60}, 50%, 50%)`
      }))

      setChartData({
        revenueData: [], // Will be populated when revenue analytics are available
        usageData: [], // Will be populated when usage analytics are available
        apiDistribution: apiDistribution.length > 0 ? apiDistribution : []
      })
    }
  }, [myAPIs])

  // Toggle API status
  const toggleAPIStatus = async (uid: string) => {
    try {
      const token = localStorage.getItem('auth_token')
      if (!token) return

      const response = await fetch(`http://localhost:3000/api/v1/seller/apis/${uid}/toggle-status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('Failed to toggle API status')
      }

      const data = await response.json()
      if (data.success) {
        // Update the API in the local state
        setMyAPIs(prev => prev.map(api =>
          api.uid === uid
            ? { ...api, isActive: data.data.api.isActive }
            : api
        ))
      }
    } catch (err) {
      console.error('Error toggling API status:', err)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Seller Dashboard</h1>
            <p className="text-muted-foreground">Manage your APIs and track performance</p>
          </div>
          <div className="flex gap-3 mt-4 md:mt-0">
            <Link href="/dashboard/onboard">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Plus className="h-4 w-4 mr-2" />
                Add New API
              </Button>
            </Link>
            <Button variant="outline" className="bg-transparent">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {dashboardLoading ? (
            // Loading skeleton
            [...Array(4)].map((_, i) => (
              <Card key={i} className="border-border">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div className="h-4 w-24 bg-muted animate-pulse rounded" />
                  <div className="h-4 w-4 bg-muted animate-pulse rounded" />
                </CardHeader>
                <CardContent>
                  <div className="h-8 w-16 bg-muted animate-pulse rounded mb-2" />
                  <div className="h-3 w-20 bg-muted animate-pulse rounded" />
                </CardContent>
              </Card>
            ))
          ) : dashboardError ? (
            <div className="col-span-full">
              <Card className="border-destructive">
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-2 text-destructive">
                    <AlertCircle className="h-4 w-4" />
                    <span>Failed to load dashboard statistics: {dashboardError}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <>
              <Card className="border-border">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">
                    ${dashboardData?.stats.totalRevenue || '0.00'}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Revenue tracking coming soon
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Active Subscribers</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">
                    {dashboardData?.stats.totalSubscriptions.toLocaleString() || '0'}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Across all your APIs
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Published APIs</CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">
                    {dashboardData?.stats.totalApis || '0'}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {myAPIs.filter(api => api.isActive).length} active
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Avg. Rating</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">
                    {myAPIs.length > 0
                      ? (myAPIs.reduce((acc, api) => acc + parseFloat(api.averageRating || '0'), 0) / myAPIs.length).toFixed(1)
                      : '0.0'
                    }
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Based on {myAPIs.reduce((acc, api) => acc + api.totalRatings, 0)} reviews
                  </p>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        {/* Charts and Analytics */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <Card className="lg:col-span-2 border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Revenue Overview</CardTitle>
              <CardDescription>Monthly revenue from all APIs</CardDescription>
            </CardHeader>
            <CardContent>
              {dashboardLoading ? (
                <div className="h-[300px] flex items-center justify-center">
                  <div className="text-muted-foreground">Loading revenue data...</div>
                </div>
              ) : chartData?.revenueData.length ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData.revenueData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#5C5D5F" opacity={0.3} />
                    <XAxis dataKey="month" stroke="#5C5D5F" />
                    <YAxis stroke="#5C5D5F" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #5C5D5F",
                        borderRadius: "8px",
                      }}
                    />
                    <Bar dataKey="revenue" fill="#3C3D3F" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex flex-col items-center justify-center text-center">
                  <DollarSign className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">No Revenue Data Yet</h3>
                  <p className="text-muted-foreground max-w-sm">
                    Revenue tracking will appear here once you start earning from your APIs.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-foreground">API Subscription Distribution</CardTitle>
              <CardDescription>Subscribers by API</CardDescription>
            </CardHeader>
            <CardContent>
              {dashboardLoading ? (
                <div className="h-[300px] flex items-center justify-center">
                  <div className="text-muted-foreground">Loading distribution data...</div>
                </div>
              ) : chartData?.apiDistribution.length ? (
                <>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={chartData.apiDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {chartData.apiDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="mt-4 space-y-2 max-h-20 overflow-y-auto">
                    {chartData.apiDistribution.map((item, index) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                          <span className="text-muted-foreground truncate">{item.name}</span>
                        </div>
                        <span className="font-medium text-foreground">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="h-[300px] flex flex-col items-center justify-center text-center">
                  <Users className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">No Subscribers Yet</h3>
                  <p className="text-muted-foreground max-w-sm">
                    Your API subscription distribution will appear here once users start subscribing.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* API Management */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-foreground">My APIs</CardTitle>
            <CardDescription>Manage your published APIs</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <div className="text-muted-foreground">Loading your APIs...</div>
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <div className="text-red-500">{error}</div>
              </div>
            ) : myAPIs.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-muted-foreground">No APIs found. Create your first API to get started!</div>
                <Link href="/dashboard/onboard" className="mt-4 inline-block">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add New API
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {myAPIs.map((api) => (
                  <div
                    key={api.uid}
                    className="flex flex-col md:flex-row md:items-center justify-between p-4 border border-border rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-foreground">{api.name}</h3>
                        <Badge variant={api.isActive ? "default" : "secondary"}>
                          {api.isActive ? "Active" : "Inactive"}
                        </Badge>
                        {api.category && (
                          <Badge variant="outline">{api.category.name}</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{api.description}</p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Subscribers</span>
                          <div className="font-medium text-foreground">{api.totalSubscriptions.toLocaleString()}</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Price</span>
                          <div className="font-medium text-foreground">${api.price}</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Rating</span>
                          <div className="font-medium text-foreground">{api.averageRating}/5.0 ({api.totalRatings})</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Version</span>
                          <div className="font-medium text-foreground">{api.version}</div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-4 md:mt-0">
                      <Button variant="outline" size="sm" className="bg-transparent">
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-transparent"
                        onClick={() => toggleAPIStatus(api.uid)}
                      >
                        {api.isActive ? (
                          <>
                            <Pause className="h-4 w-4 mr-1" />
                            Deactivate
                          </>
                        ) : (
                          <>
                            <Play className="h-4 w-4 mr-1" />
                            Activate
                          </>
                        )}
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm" className="bg-transparent">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem>Edit API</DropdownMenuItem>
                          <DropdownMenuItem>View Analytics</DropdownMenuItem>
                          <DropdownMenuItem>Manage Pricing</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">Delete API</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
