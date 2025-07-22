"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Save, Shield, Bell, Globe, Users, Trash2, Plus } from "lucide-react"

const adminUsers = [
  {
    id: 1,
    name: "John Admin",
    email: "john@jobportal.com",
    role: "Super Admin",
    lastActive: "2 hours ago",
    status: "Active",
  },
  {
    id: 2,
    name: "Jane Moderator",
    email: "jane@jobportal.com",
    role: "Moderator",
    lastActive: "1 day ago",
    status: "Active",
  },
  {
    id: 3,
    name: "Mike Support",
    email: "mike@jobportal.com",
    role: "Support",
    lastActive: "3 days ago",
    status: "Inactive",
  },
]

export default function SettingsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
          <p className="text-muted-foreground">Manage your platform settings and configurations</p>
        </div>

        {/* General Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              General Settings
            </CardTitle>
            <CardDescription>Configure basic platform settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="siteName">Site Name</Label>
                <Input id="siteName" defaultValue="JobPortal" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="siteUrl">Site URL</Label>
                <Input id="siteUrl" defaultValue="https://jobportal.com" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="siteDescription">Site Description</Label>
              <Textarea
                id="siteDescription"
                defaultValue="The best platform for job seekers and employers to connect"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactEmail">Contact Email</Label>
              <Input id="contactEmail" defaultValue="contact@jobportal.com" />
            </div>
            <Button>
              <Save className="mr-2 h-4 w-4" />
              Save General Settings
            </Button>
          </CardContent>
        </Card>

        {/* Moderation Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Moderation Rules
            </CardTitle>
            <CardDescription>Configure content moderation and approval settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Auto-approve company registrations</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically approve new company registrations without manual review
                </p>
              </div>
              <Switch />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Auto-approve job postings</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically approve job postings from verified companies
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Require review approval</Label>
                <p className="text-sm text-muted-foreground">
                  All company reviews must be approved before being published
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Enable salary verification</Label>
                <p className="text-sm text-muted-foreground">
                  Require verification for salary reports above certain thresholds
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="space-y-2">
              <Label htmlFor="salaryThreshold">Salary Verification Threshold ($)</Label>
              <Input id="salaryThreshold" type="number" defaultValue="200000" />
            </div>
            <Button>
              <Save className="mr-2 h-4 w-4" />
              Save Moderation Settings
            </Button>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notification Preferences
            </CardTitle>
            <CardDescription>Configure admin notification settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>New user registrations</Label>
                <p className="text-sm text-muted-foreground">Get notified when new users register on the platform</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Pending reviews</Label>
                <p className="text-sm text-muted-foreground">Get notified when reviews are pending approval</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Flagged content</Label>
                <p className="text-sm text-muted-foreground">Get notified when content is flagged by users</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Weekly reports</Label>
                <p className="text-sm text-muted-foreground">Receive weekly analytics and activity reports</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Button>
              <Save className="mr-2 h-4 w-4" />
              Save Notification Settings
            </Button>
          </CardContent>
        </Card>

        {/* Admin Role Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Admin Role Management
            </CardTitle>
            <CardDescription>Manage admin users and their permissions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center mb-4">
              <div>
                <h4 className="text-sm font-medium">Admin Users</h4>
                <p className="text-sm text-muted-foreground">Manage users with admin access</p>
              </div>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Admin
              </Button>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Last Active</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {adminUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{user.role}</Badge>
                    </TableCell>
                    <TableCell>{user.lastActive}</TableCell>
                    <TableCell>
                      <Badge variant={user.status === "Active" ? "default" : "secondary"}>{user.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* API Settings */}
        <Card>
          <CardHeader>
            <CardTitle>API Configuration</CardTitle>
            <CardDescription>Configure API keys and external integrations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="emailProvider">Email Service Provider</Label>
              <Select defaultValue="sendgrid">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sendgrid">SendGrid</SelectItem>
                  <SelectItem value="mailgun">Mailgun</SelectItem>
                  <SelectItem value="ses">Amazon SES</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="emailApiKey">Email API Key</Label>
              <Input id="emailApiKey" type="password" placeholder="••••••••••••••••" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="analyticsId">Google Analytics ID</Label>
              <Input id="analyticsId" placeholder="GA-XXXXXXXXX-X" />
            </div>
            <Button>
              <Save className="mr-2 h-4 w-4" />
              Save API Settings
            </Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
