"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CreditCard, Activity, Upload, Download, Trash2, AlertTriangle } from "lucide-react"
import { Navigation } from "@/components/navigation"

// Mock user data
const userData = {
  name: "John Doe",
  email: "john.doe@example.com",
  phone: "+1 (555) 123-4567",
  company: "TechCorp Inc.",
  location: "San Francisco, CA",
  bio: "Full-stack developer passionate about APIs and developer tools. Building the next generation of web applications.",
  avatar: "/generic-user-avatar.png",
  joinDate: "January 2024",
  plan: "Professional",
  apiKeys: 8,
  totalRequests: "2.4M",
}

const subscriptions = [
  {
    id: "1",
    name: "Weather Pro API",
    plan: "Professional",
    price: "$75/month",
    status: "active",
    nextBilling: "2024-02-15",
    usage: "45,230 / 100,000 requests",
  },
  {
    id: "2",
    name: "AI Text Analyzer",
    plan: "Starter",
    price: "$25/month",
    status: "active",
    nextBilling: "2024-02-20",
    usage: "12,450 / 50,000 requests",
  },
]

const activityLog = [
  {
    id: "1",
    action: "API Key Generated",
    details: "Created new production key for Weather Pro API",
    timestamp: "2024-01-20 14:30",
    ip: "192.168.1.100",
  },
  {
    id: "2",
    action: "Subscription Updated",
    details: "Upgraded AI Text Analyzer to Professional plan",
    timestamp: "2024-01-19 09:15",
    ip: "192.168.1.100",
  },
  {
    id: "3",
    action: "Password Changed",
    details: "Account password was updated",
    timestamp: "2024-01-18 16:45",
    ip: "192.168.1.100",
  },
]

export default function ProfilePage() {
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    sms: false,
    marketing: true,
  })

  const [security, setSecurity] = useState({
    twoFactor: false,
    sessionTimeout: "24",
    ipRestriction: false,
  })

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Account Settings</h1>
          <p className="text-muted-foreground">Manage your profile, billing, and security preferences</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Profile Sidebar */}
          <div className="lg:col-span-1">
            <Card className="border-border">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <Avatar className="w-20 h-20 mb-4">
                    <AvatarImage src={userData.avatar || "/placeholder.svg"} alt={userData.name} />
                    <AvatarFallback className="text-lg">
                      {userData.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="font-semibold text-foreground mb-1">{userData.name}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{userData.email}</p>
                  <Badge variant="secondary" className="mb-4">
                    {userData.plan} Plan
                  </Badge>
                  <Button variant="outline" size="sm" className="w-full bg-transparent">
                    <Upload className="h-4 w-4 mr-2" />
                    Change Photo
                  </Button>
                </div>
                <Separator className="my-6" />
                <div className="space-y-4 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Member since</span>
                    <span className="text-foreground">{userData.joinDate}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">API Keys</span>
                    <span className="text-foreground">{userData.apiKeys}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Total Requests</span>
                    <span className="text-foreground">{userData.totalRequests}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="profile" className="space-y-6">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="billing">Billing</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
                <TabsTrigger value="notifications">Notifications</TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
              </TabsList>

              {/* Profile Tab */}
              <TabsContent value="profile" className="space-y-6">
                <Card className="border-border">
                  <CardHeader>
                    <CardTitle className="text-foreground">Personal Information</CardTitle>
                    <CardDescription>Update your personal details and contact information</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="firstName" className="text-foreground">
                          First Name
                        </Label>
                        <Input id="firstName" value="John" className="bg-input border-border" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName" className="text-foreground">
                          Last Name
                        </Label>
                        <Input id="lastName" value="Doe" className="bg-input border-border" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-foreground">
                        Email Address
                      </Label>
                      <Input id="email" type="email" value={userData.email} className="bg-input border-border" />
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-foreground">
                          Phone Number
                        </Label>
                        <Input id="phone" value={userData.phone} className="bg-input border-border" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="company" className="text-foreground">
                          Company
                        </Label>
                        <Input id="company" value={userData.company} className="bg-input border-border" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="location" className="text-foreground">
                        Location
                      </Label>
                      <Input id="location" value={userData.location} className="bg-input border-border" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bio" className="text-foreground">
                        Bio
                      </Label>
                      <Textarea
                        id="bio"
                        value={userData.bio}
                        rows={3}
                        className="bg-input border-border"
                        placeholder="Tell us about yourself..."
                      />
                    </div>

                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" className="bg-transparent">
                        Cancel
                      </Button>
                      <Button className="bg-primary text-primary-foreground hover:bg-primary/90">Save Changes</Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Billing Tab */}
              <TabsContent value="billing" className="space-y-6">
                <Card className="border-border">
                  <CardHeader>
                    <CardTitle className="text-foreground">Current Subscriptions</CardTitle>
                    <CardDescription>Manage your API subscriptions and billing</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {subscriptions.map((sub) => (
                        <div key={sub.id} className="border border-border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <h4 className="font-medium text-foreground">{sub.name}</h4>
                              <p className="text-sm text-muted-foreground">{sub.plan} Plan</p>
                            </div>
                            <div className="text-right">
                              <div className="font-medium text-foreground">{sub.price}</div>
                              <Badge variant={sub.status === "active" ? "default" : "secondary"} className="text-xs">
                                {sub.status}
                              </Badge>
                            </div>
                          </div>
                          <div className="flex items-center justify-between text-sm text-muted-foreground">
                            <span>Usage: {sub.usage}</span>
                            <span>Next billing: {sub.nextBilling}</span>
                          </div>
                          <div className="flex justify-end space-x-2 mt-3">
                            <Button variant="outline" size="sm" className="bg-transparent">
                              Manage
                            </Button>
                            <Button variant="outline" size="sm" className="bg-transparent text-destructive">
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border">
                  <CardHeader>
                    <CardTitle className="text-foreground">Payment Methods</CardTitle>
                    <CardDescription>Manage your payment methods and billing information</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="border border-border rounded-lg p-4 mb-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <CreditCard className="h-8 w-8 text-muted-foreground" />
                          <div>
                            <div className="font-medium text-foreground">•••• •••• •••• 4242</div>
                            <div className="text-sm text-muted-foreground">Expires 12/25</div>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" className="bg-transparent">
                            Edit
                          </Button>
                          <Button variant="outline" size="sm" className="bg-transparent text-destructive">
                            Remove
                          </Button>
                        </div>
                      </div>
                    </div>
                    <Button variant="outline" className="bg-transparent">
                      <CreditCard className="h-4 w-4 mr-2" />
                      Add Payment Method
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-border">
                  <CardHeader>
                    <CardTitle className="text-foreground">Billing History</CardTitle>
                    <CardDescription>Download your invoices and billing statements</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[1, 2, 3].map((invoice) => (
                        <div key={invoice} className="flex items-center justify-between py-2">
                          <div>
                            <div className="font-medium text-foreground">Invoice #INV-202401{invoice}</div>
                            <div className="text-sm text-muted-foreground">January {invoice}, 2024</div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <span className="font-medium text-foreground">$100.00</span>
                            <Button variant="outline" size="sm" className="bg-transparent">
                              <Download className="h-4 w-4 mr-1" />
                              Download
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Security Tab */}
              <TabsContent value="security" className="space-y-6">
                <Card className="border-border">
                  <CardHeader>
                    <CardTitle className="text-foreground">Password & Authentication</CardTitle>
                    <CardDescription>Manage your password and authentication settings</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword" className="text-foreground">
                        Current Password
                      </Label>
                      <Input id="currentPassword" type="password" className="bg-input border-border" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="newPassword" className="text-foreground">
                        New Password
                      </Label>
                      <Input id="newPassword" type="password" className="bg-input border-border" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword" className="text-foreground">
                        Confirm New Password
                      </Label>
                      <Input id="confirmPassword" type="password" className="bg-input border-border" />
                    </div>
                    <Button className="bg-primary text-primary-foreground hover:bg-primary/90">Update Password</Button>
                  </CardContent>
                </Card>

                <Card className="border-border">
                  <CardHeader>
                    <CardTitle className="text-foreground">Security Settings</CardTitle>
                    <CardDescription>Configure additional security measures for your account</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-foreground">Two-Factor Authentication</Label>
                        <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                      </div>
                      <Switch
                        checked={security.twoFactor}
                        onCheckedChange={(checked) => setSecurity({ ...security, twoFactor: checked })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="sessionTimeout" className="text-foreground">
                        Session Timeout (hours)
                      </Label>
                      <Select
                        value={security.sessionTimeout}
                        onValueChange={(value) => setSecurity({ ...security, sessionTimeout: value })}
                      >
                        <SelectTrigger className="bg-input border-border">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 hour</SelectItem>
                          <SelectItem value="8">8 hours</SelectItem>
                          <SelectItem value="24">24 hours</SelectItem>
                          <SelectItem value="168">1 week</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-foreground">IP Address Restrictions</Label>
                        <p className="text-sm text-muted-foreground">
                          Restrict account access to specific IP addresses
                        </p>
                      </div>
                      <Switch
                        checked={security.ipRestriction}
                        onCheckedChange={(checked) => setSecurity({ ...security, ipRestriction: checked })}
                      />
                    </div>

                    <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                      Save Security Settings
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Notifications Tab */}
              <TabsContent value="notifications" className="space-y-6">
                <Card className="border-border">
                  <CardHeader>
                    <CardTitle className="text-foreground">Notification Preferences</CardTitle>
                    <CardDescription>Choose how you want to receive notifications</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-foreground">Email Notifications</Label>
                        <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                      </div>
                      <Switch
                        checked={notifications.email}
                        onCheckedChange={(checked) => setNotifications({ ...notifications, email: checked })}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-foreground">Push Notifications</Label>
                        <p className="text-sm text-muted-foreground">Receive push notifications in your browser</p>
                      </div>
                      <Switch
                        checked={notifications.push}
                        onCheckedChange={(checked) => setNotifications({ ...notifications, push: checked })}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-foreground">SMS Notifications</Label>
                        <p className="text-sm text-muted-foreground">Receive important alerts via SMS</p>
                      </div>
                      <Switch
                        checked={notifications.sms}
                        onCheckedChange={(checked) => setNotifications({ ...notifications, sms: checked })}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-foreground">Marketing Communications</Label>
                        <p className="text-sm text-muted-foreground">Receive updates about new features and APIs</p>
                      </div>
                      <Switch
                        checked={notifications.marketing}
                        onCheckedChange={(checked) => setNotifications({ ...notifications, marketing: checked })}
                      />
                    </div>

                    <Button className="bg-primary text-primary-foreground hover:bg-primary/90">Save Preferences</Button>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Activity Tab */}
              <TabsContent value="activity" className="space-y-6">
                <Card className="border-border">
                  <CardHeader>
                    <CardTitle className="text-foreground">Account Activity</CardTitle>
                    <CardDescription>Recent activity and security events on your account</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {activityLog.map((activity) => (
                        <div key={activity.id} className="border-b border-border pb-4 last:border-b-0">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start space-x-3">
                              <Activity className="h-5 w-5 text-primary mt-0.5" />
                              <div>
                                <div className="font-medium text-foreground">{activity.action}</div>
                                <div className="text-sm text-muted-foreground">{activity.details}</div>
                                <div className="text-xs text-muted-foreground mt-1">
                                  {activity.timestamp} • IP: {activity.ip}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border border-destructive/20">
                  <CardHeader>
                    <CardTitle className="text-foreground flex items-center">
                      <AlertTriangle className="h-5 w-5 text-destructive mr-2" />
                      Danger Zone
                    </CardTitle>
                    <CardDescription>Irreversible actions for your account</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-4 border border-destructive/20 rounded-lg">
                      <div>
                        <h4 className="font-medium text-foreground">Export Account Data</h4>
                        <p className="text-sm text-muted-foreground">Download all your account data and API usage</p>
                      </div>
                      <Button variant="outline" className="bg-transparent">
                        <Download className="h-4 w-4 mr-2" />
                        Export Data
                      </Button>
                    </div>
                    <div className="flex items-center justify-between p-4 border border-destructive/20 rounded-lg">
                      <div>
                        <h4 className="font-medium text-foreground">Delete Account</h4>
                        <p className="text-sm text-muted-foreground">
                          Permanently delete your account and all associated data
                        </p>
                      </div>
                      <Button variant="destructive">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Account
                      </Button>
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
