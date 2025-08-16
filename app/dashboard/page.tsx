"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { DollarSign, TrendingUp, Users, Activity, Plus, Settings, Eye, Pause, Play, MoreHorizontal } from "lucide-react"
import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Mock data
const revenueData = [
  { month: "Jan", revenue: 1200 },
  { month: "Feb", revenue: 1800 },
  { month: "Mar", revenue: 2400 },
  { month: "Apr", revenue: 3200 },
  { month: "May", revenue: 2800 },
  { month: "Jun", revenue: 4100 },
]

const usageData = [
  { day: "Mon", requests: 12000 },
  { day: "Tue", requests: 15000 },
  { day: "Wed", requests: 18000 },
  { day: "Thu", requests: 14000 },
  { day: "Fri", requests: 22000 },
  { day: "Sat", requests: 8000 },
  { day: "Sun", requests: 6000 },
]

const apiDistribution = [
  { name: "Weather Pro API", value: 45, color: "#3C3D3F" },
  { name: "AI Text Analyzer", value: 30, color: "#5C5D5F" },
  { name: "Image Recognition", value: 25, color: "#8C8D8F" },
]

const myAPIs = [
  {
    id: "1",
    name: "Weather Pro API",
    status: "active",
    subscribers: 5420,
    revenue: "$2,840",
    requests: "1.2M",
    uptime: 99.9,
  },
  {
    id: "2",
    name: "AI Text Analyzer",
    status: "active",
    subscribers: 3210,
    revenue: "$1,605",
    requests: "890K",
    uptime: 99.8,
  },
  {
    id: "3",
    name: "Image Recognition API",
    status: "paused",
    subscribers: 2180,
    revenue: "$1,090",
    requests: "654K",
    uptime: 99.5,
  },
]

export default function DashboardPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("30d")

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
          <Card className="border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">$5,535</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+12.5%</span> from last month
              </p>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Subscribers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">10,810</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+8.2%</span> from last month
              </p>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">API Requests</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">2.7M</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+15.3%</span> from last month
              </p>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Avg. Uptime</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">99.7%</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+0.2%</span> from last month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts and Analytics */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <Card className="lg:col-span-2 border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Revenue Overview</CardTitle>
              <CardDescription>Monthly revenue from all APIs</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={revenueData}>
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
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-foreground">API Usage Distribution</CardTitle>
              <CardDescription>Requests by API</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={apiDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {apiDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 space-y-2">
                {apiDistribution.map((item, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-muted-foreground">{item.name}</span>
                    </div>
                    <span className="font-medium text-foreground">{item.value}%</span>
                  </div>
                ))}
              </div>
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
            <div className="space-y-4">
              {myAPIs.map((api) => (
                <div
                  key={api.id}
                  className="flex flex-col md:flex-row md:items-center justify-between p-4 border border-border rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-foreground">{api.name}</h3>
                      <Badge variant={api.status === "active" ? "default" : "secondary"}>
                        {api.status === "active" ? "Active" : "Paused"}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Subscribers</span>
                        <div className="font-medium text-foreground">{api.subscribers.toLocaleString()}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Revenue</span>
                        <div className="font-medium text-foreground">{api.revenue}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Requests</span>
                        <div className="font-medium text-foreground">{api.requests}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Uptime</span>
                        <div className="font-medium text-foreground">{api.uptime}%</div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-4 md:mt-0">
                    <Button variant="outline" size="sm" className="bg-transparent">
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button variant="outline" size="sm" className="bg-transparent">
                      {api.status === "active" ? (
                        <>
                          <Pause className="h-4 w-4 mr-1" />
                          Pause
                        </>
                      ) : (
                        <>
                          <Play className="h-4 w-4 mr-1" />
                          Resume
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
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
