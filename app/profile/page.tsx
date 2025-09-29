"use client"

import { useState, useEffect } from "react"
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
import { CreditCard, Activity, Upload, Download, Trash2, AlertTriangle, User as UserIcon, Calendar, Key, Clock, AlertCircle } from "lucide-react"
import { Navigation } from "@/components/navigation"
import { useAuth } from "@/lib/auth"
import { apiClient } from "@/lib/api-client"
import type { User, Subscription } from "@/lib/types"

interface DashboardData {
  stats: {
    totalSubscriptions: number
    totalApiKeys: number
  }
  recentSubscriptions: any[]
  recentApiKeys: any[]
}

interface UserProfile extends User {
  id: number
  isActive: boolean
  emailVerified: boolean
}

export default function ProfilePage() {
  const { user: authUser } = useAuth()
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [loading, setLoading] = useState(true)
  const [profileLoading, setProfileLoading] = useState(true)
  const [subscriptionsLoading, setSubscriptionsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [profileError, setProfileError] = useState<string | null>(null)
  const [subscriptionsError, setSubscriptionsError] = useState<string | null>(null)
  const [updating, setUpdating] = useState(false)
  const [passwordChanging, setPasswordChanging] = useState(false)

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

  const [profileFormData, setProfileFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
  })

  const [passwordFormData, setPasswordFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  // Fetch user profile
  useEffect(() => {
    const fetchProfile = async () => {
      if (!authUser) {
        setProfileLoading(false)
        return
      }

      try {
        setProfileLoading(true)
        const response = await apiClient.getProfile()
        const user = response.user || response
        setUserProfile(user)
        setProfileFormData({
          firstName: user?.firstName || user?.first_name || '',
          lastName: user?.lastName || user?.last_name || '',
          email: user?.email || '',
        })
      } catch (err: any) {
        setProfileError(err.message || 'Failed to fetch profile data')
      } finally {
        setProfileLoading(false)
      }
    }

    fetchProfile()
  }, [authUser])

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboard = async () => {
      if (!authUser) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        const response = await apiClient.getUserDashboard()
        setDashboardData(response.data || response)
      } catch (err: any) {
        setError(err.message || 'Failed to fetch dashboard data')
      } finally {
        setLoading(false)
      }
    }

    fetchDashboard()
  }, [authUser])

  // Fetch subscriptions
  useEffect(() => {
    const fetchSubscriptions = async () => {
      if (!authUser) {
        setSubscriptionsLoading(false)
        return
      }

      try {
        setSubscriptionsLoading(true)
        const response = await apiClient.getUserSubscriptions()
        const data = response.data || response
        setSubscriptions(data.subscriptions || data || [])
      } catch (err: any) {
        setSubscriptionsError(err.message || 'Failed to fetch subscriptions')
      } finally {
        setSubscriptionsLoading(false)
      }
    }

    fetchSubscriptions()
  }, [authUser])

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!userProfile) return

    try {
      setUpdating(true)
      const response = await apiClient.updateProfile(profileFormData)
      const user = response.user || response
      setUserProfile(user)
      alert('Profile updated successfully!')
    } catch (err: any) {
      alert(err.message || 'Failed to update profile')
    } finally {
      setUpdating(false)
    }
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()

    if (passwordFormData.newPassword !== passwordFormData.confirmPassword) {
      alert('New passwords do not match')
      return
    }

    try {
      setPasswordChanging(true)
      await apiClient.changePassword({
        currentPassword: passwordFormData.currentPassword,
        newPassword: passwordFormData.newPassword,
      })
      alert('Password changed successfully!')
      setPasswordFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      })
    } catch (err: any) {
      alert(err.message || 'Failed to change password')
    } finally {
      setPasswordChanging(false)
    }
  }

  const handleSubscriptionCancel = async (uid: string) => {
    if (!confirm('Are you sure you want to cancel this subscription?')) {
      return
    }

    try {
      await apiClient.cancelSubscription(uid)
      setSubscriptions(prev => prev.filter(sub => sub.uid !== uid))
      alert('Subscription cancelled successfully')
    } catch (err: any) {
      alert(err.message || 'Failed to cancel subscription')
    }
  }

  if (!authUser) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <UserIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">Please sign in</h3>
            <p className="text-muted-foreground">You need to be signed in to view your profile.</p>
          </div>
        </div>
      </div>
    )
  }

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
                  {profileLoading ? (
                    <>
                      <div className="w-20 h-20 mb-4 bg-muted animate-pulse rounded-full" />
                      <div className="h-5 w-32 bg-muted animate-pulse rounded mb-1" />
                      <div className="h-4 w-48 bg-muted animate-pulse rounded mb-2" />
                      <div className="h-6 w-24 bg-muted animate-pulse rounded mb-4" />
                    </>
                  ) : profileError ? (
                    <div className="text-center">
                      <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
                      <p className="text-destructive">{profileError}</p>
                    </div>
                  ) : userProfile ? (
                    <>
                      <Avatar className="w-20 h-20 mb-4">
                        <AvatarImage src="/placeholder.svg" alt={`${userProfile.firstName} ${userProfile.lastName}`} />
                        <AvatarFallback className="text-lg">
                          {(userProfile.firstName?.[0] || userProfile.first_name?.[0] || '').toUpperCase()}
                          {(userProfile.lastName?.[0] || userProfile.last_name?.[0] || '').toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <h3 className="font-semibold text-foreground mb-1">
                        {userProfile.firstName || userProfile.first_name} {userProfile.lastName || userProfile.last_name}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-2">{userProfile.email}</p>
                      <Badge variant="secondary" className="mb-4">
                        {userProfile.role === 'seller' ? 'Seller' : userProfile.role === 'buyer' ? 'Buyer' : 'User'}
                      </Badge>
                      <Button variant="outline" size="sm" className="w-full bg-transparent">
                        <Upload className="h-4 w-4 mr-2" />
                        Change Photo
                      </Button>
                    </>
                  ) : (
                    <div className="text-center">
                      <UserIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No profile data found</p>
                    </div>
                  )}
                </div>
                <Separator className="my-6" />
                <div className="space-y-4 text-sm">
                  {loading ? (
                    [...Array(3)].map((_, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <div className="h-4 w-20 bg-muted animate-pulse rounded" />
                        <div className="h-4 w-16 bg-muted animate-pulse rounded" />
                      </div>
                    ))
                  ) : error ? (
                    <div className="text-center text-destructive text-sm">{error}</div>
                  ) : (
                    <>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Member since</span>
                        <span className="text-foreground">
                          {userProfile ? new Date(userProfile.createdAt || userProfile.created_at || '').toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long'
                          }) : 'N/A'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">API Keys</span>
                        <span className="text-foreground">{dashboardData?.stats.totalApiKeys || 0}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Subscriptions</span>
                        <span className="text-foreground">{dashboardData?.stats.totalSubscriptions || 0}</span>
                      </div>
                    </>
                  )}
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
                    {profileLoading ? (
                      <div className="space-y-6">
                        {[...Array(6)].map((_, i) => (
                          <div key={i} className="space-y-2">
                            <div className="h-4 w-24 bg-muted animate-pulse rounded" />
                            <div className="h-10 w-full bg-muted animate-pulse rounded" />
                          </div>
                        ))}
                      </div>
                    ) : profileError ? (
                      <div className="text-center py-8">
                        <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
                        <p className="text-destructive">{profileError}</p>
                      </div>
                    ) : (
                      <form onSubmit={handleProfileUpdate} className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="firstName" className="text-foreground">
                              First Name
                            </Label>
                            <Input
                              id="firstName"
                              value={profileFormData.firstName}
                              onChange={(e) => setProfileFormData(prev => ({ ...prev, firstName: e.target.value }))}
                              className="bg-input border-border"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="lastName" className="text-foreground">
                              Last Name
                            </Label>
                            <Input
                              id="lastName"
                              value={profileFormData.lastName}
                              onChange={(e) => setProfileFormData(prev => ({ ...prev, lastName: e.target.value }))}
                              className="bg-input border-border"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="email" className="text-foreground">
                            Email Address
                          </Label>
                          <Input
                            id="email"
                            type="email"
                            value={profileFormData.email}
                            onChange={(e) => setProfileFormData(prev => ({ ...prev, email: e.target.value }))}
                            className="bg-input border-border"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label className="text-foreground">Account Status</Label>
                          <div className="flex items-center space-x-4">
                            <Badge variant={userProfile?.isActive ? "default" : "secondary"}>
                              {userProfile?.isActive ? "Active" : "Inactive"}
                            </Badge>
                            <Badge variant={userProfile?.emailVerified ? "default" : "secondary"}>
                              {userProfile?.emailVerified ? "Email Verified" : "Email Unverified"}
                            </Badge>
                          </div>
                        </div>

                        <div className="flex justify-end space-x-2">
                          <Button
                            type="button"
                            variant="outline"
                            className="bg-transparent"
                            onClick={() => {
                              setProfileFormData({
                                firstName: userProfile?.firstName || userProfile?.first_name || '',
                                lastName: userProfile?.lastName || userProfile?.last_name || '',
                                email: userProfile?.email || '',
                              })
                            }}
                          >
                            Cancel
                          </Button>
                          <Button
                            type="submit"
                            className="bg-primary text-primary-foreground hover:bg-primary/90"
                            disabled={updating}
                          >
                            {updating ? 'Saving...' : 'Save Changes'}
                          </Button>
                        </div>
                      </form>
                    )}
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
                    {subscriptionsLoading ? (
                      <div className="space-y-4">
                        {[...Array(2)].map((_, i) => (
                          <div key={i} className="border border-border rounded-lg p-4">
                            <div className="flex items-center justify-between mb-3">
                              <div>
                                <div className="h-5 w-32 bg-muted animate-pulse rounded mb-2" />
                                <div className="h-4 w-24 bg-muted animate-pulse rounded" />
                              </div>
                              <div className="text-right">
                                <div className="h-5 w-16 bg-muted animate-pulse rounded mb-2" />
                                <div className="h-4 w-12 bg-muted animate-pulse rounded" />
                              </div>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="h-4 w-40 bg-muted animate-pulse rounded" />
                              <div className="h-4 w-24 bg-muted animate-pulse rounded" />
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : subscriptionsError ? (
                      <div className="text-center py-8">
                        <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
                        <p className="text-destructive">{subscriptionsError}</p>
                      </div>
                    ) : subscriptions.length === 0 ? (
                      <div className="text-center py-8">
                        <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-foreground mb-2">No Active Subscriptions</h3>
                        <p className="text-muted-foreground mb-4">You haven't subscribed to any APIs yet.</p>
                        <Button>
                          Browse Marketplace
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {subscriptions.map((sub) => (
                          <div key={sub.uid} className="border border-border rounded-lg p-4">
                            <div className="flex items-center justify-between mb-3">
                              <div>
                                <h4 className="font-medium text-foreground">{sub.api?.name || 'Unknown API'}</h4>
                                <p className="text-sm text-muted-foreground">{sub.api?.pricingModel?.replace('_', ' ') || 'Unknown Plan'}</p>
                              </div>
                              <div className="text-right">
                                <div className="font-medium text-foreground">
                                  {sub.api?.price ? `$${sub.api.price}` : 'Free'}
                                </div>
                                <Badge variant={sub.status === "active" ? "default" : "secondary"} className="text-xs">
                                  {sub.status}
                                </Badge>
                              </div>
                            </div>
                            <div className="flex items-center justify-between text-sm text-muted-foreground">
                              <span>Usage: {(sub.requestsUsed ?? sub.requests_used) || 0} / {(sub.requestsLimit ?? sub.requests_limit) || 1000} requests</span>
                              <span>Since: {new Date(sub.createdAt || sub.created_at || Date.now()).toLocaleDateString()}</span>
                            </div>
                            <div className="flex justify-end space-x-2 mt-3">
                              <Button variant="outline" size="sm" className="bg-transparent">
                                View API
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="bg-transparent text-destructive"
                                onClick={() => handleSubscriptionCancel(sub.uid)}
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card className="border-border">
                  <CardHeader>
                    <CardTitle className="text-foreground">Payment Methods</CardTitle>
                    <CardDescription>Manage your payment methods and billing information</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-foreground mb-2">No Payment Methods</h3>
                      <p className="text-muted-foreground mb-4">Payment integration coming soon. You'll be able to manage your payment methods here.</p>
                      <Button variant="outline" className="bg-transparent" disabled>
                        <CreditCard className="h-4 w-4 mr-2" />
                        Add Payment Method
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border">
                  <CardHeader>
                    <CardTitle className="text-foreground">Billing History</CardTitle>
                    <CardDescription>Download your invoices and billing statements</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <Download className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-foreground mb-2">No Billing History</h3>
                      <p className="text-muted-foreground">Your billing history will appear here once you have paid subscriptions.</p>
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
                  <CardContent>
                    <form onSubmit={handlePasswordChange} className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="currentPassword" className="text-foreground">
                          Current Password
                        </Label>
                        <Input
                          id="currentPassword"
                          type="password"
                          value={passwordFormData.currentPassword}
                          onChange={(e) => setPasswordFormData(prev => ({ ...prev, currentPassword: e.target.value }))}
                          className="bg-input border-border"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="newPassword" className="text-foreground">
                          New Password
                        </Label>
                        <Input
                          id="newPassword"
                          type="password"
                          value={passwordFormData.newPassword}
                          onChange={(e) => setPasswordFormData(prev => ({ ...prev, newPassword: e.target.value }))}
                          className="bg-input border-border"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword" className="text-foreground">
                          Confirm New Password
                        </Label>
                        <Input
                          id="confirmPassword"
                          type="password"
                          value={passwordFormData.confirmPassword}
                          onChange={(e) => setPasswordFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                          className="bg-input border-border"
                          required
                        />
                      </div>
                      <Button
                        type="submit"
                        className="bg-primary text-primary-foreground hover:bg-primary/90"
                        disabled={passwordChanging}
                      >
                        {passwordChanging ? 'Updating...' : 'Update Password'}
                      </Button>
                    </form>
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
                    {loading ? (
                      <div className="space-y-4">
                        {[...Array(3)].map((_, i) => (
                          <div key={i} className="border-b border-border pb-4 last:border-b-0">
                            <div className="flex items-start space-x-3">
                              <div className="h-5 w-5 bg-muted animate-pulse rounded mt-0.5" />
                              <div className="flex-1">
                                <div className="h-4 w-32 bg-muted animate-pulse rounded mb-2" />
                                <div className="h-3 w-48 bg-muted animate-pulse rounded mb-1" />
                                <div className="h-3 w-40 bg-muted animate-pulse rounded" />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : error ? (
                      <div className="text-center py-8">
                        <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
                        <p className="text-destructive">{error}</p>
                      </div>
                    ) : dashboardData?.recentApiKeys?.length || dashboardData?.recentSubscriptions?.length ? (
                      <div className="space-y-4">
                        {dashboardData.recentSubscriptions?.slice(0, 3).map((sub) => (
                          <div key={sub.uid} className="border-b border-border pb-4 last:border-b-0">
                            <div className="flex items-start space-x-3">
                              <Activity className="h-5 w-5 text-primary mt-0.5" />
                              <div>
                                <div className="font-medium text-foreground">API Subscription</div>
                                <div className="text-sm text-muted-foreground">Subscribed to {sub.api?.name}</div>
                                <div className="text-xs text-muted-foreground mt-1">
                                  {new Date(sub.createdAt || sub.created_at || Date.now()).toLocaleString()}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                        {dashboardData.recentApiKeys?.slice(0, 2).map((key) => (
                          <div key={key.uid} className="border-b border-border pb-4 last:border-b-0">
                            <div className="flex items-start space-x-3">
                              <Key className="h-5 w-5 text-primary mt-0.5" />
                              <div>
                                <div className="font-medium text-foreground">API Key Created</div>
                                <div className="text-sm text-muted-foreground">Created key "{key.name}" for {key.api?.name}</div>
                                <div className="text-xs text-muted-foreground mt-1">
                                  {new Date(key.createdAt || key.created_at || Date.now()).toLocaleString()}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-foreground mb-2">No Recent Activity</h3>
                        <p className="text-muted-foreground">Your account activity will appear here as you use the platform.</p>
                      </div>
                    )}
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
