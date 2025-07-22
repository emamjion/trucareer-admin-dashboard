"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Users, Building2, Briefcase, Star, TrendingUp, TrendingDown, Eye } from "lucide-react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"

const overviewData = [
  {
    title: "Total Users",
    value: "12,543",
    change: "+12.5%",
    trend: "up",
    icon: Users,
    description: "Active job seekers and employers",
  },
  {
    title: "Companies",
    value: "1,234",
    change: "+8.2%",
    trend: "up",
    icon: Building2,
    description: "Registered companies",
  },
  {
    title: "Job Postings",
    value: "3,456",
    change: "-2.1%",
    trend: "down",
    icon: Briefcase,
    description: "Active job listings",
  },
  {
    title: "Reviews",
    value: "8,901",
    change: "+15.3%",
    trend: "up",
    icon: Star,
    description: "Company reviews submitted",
  },
]

const userGrowthData = [
  { month: "Jan", users: 1200, companies: 45 },
  { month: "Feb", users: 1400, companies: 52 },
  { month: "Mar", users: 1800, companies: 61 },
  { month: "Apr", users: 2200, companies: 73 },
  { month: "May", users: 2800, companies: 89 },
  { month: "Jun", users: 3200, companies: 95 },
]

const activityData = [
  { name: "Job Applications", value: 2400 },
  { name: "Company Reviews", value: 1398 },
  { name: "Salary Reports", value: 800 },
  { name: "Interview Experiences", value: 600 },
]

const recentActivities = [
  {
    id: 1,
    type: "review",
    user: "John Doe",
    action: "submitted a review for",
    target: "Google Inc.",
    time: "2 minutes ago",
    status: "pending",
  },
  {
    id: 2,
    type: "job",
    user: "TechCorp",
    action: "posted a new job",
    target: "Senior Developer",
    time: "15 minutes ago",
    status: "active",
  },
  {
    id: 3,
    type: "user",
    user: "Jane Smith",
    action: "registered as",
    target: "Job Seeker",
    time: "1 hour ago",
    status: "verified",
  },
  {
    id: 4,
    type: "salary",
    user: "Anonymous",
    action: "reported salary for",
    target: "Software Engineer at Microsoft",
    time: "2 hours ago",
    status: "approved",
  },
]

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"]

export default function Dashboard() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">Welcome back! Here's what's happening with your platform today.</p>
        </div>

        {/* Overview Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {overviewData.map((item) => (
            <Card key={item.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
                <item.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{item.value}</div>
                <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                  <span className={`flex items-center ${item.trend === "up" ? "text-green-600" : "text-red-600"}`}>
                    {item.trend === "up" ? (
                      <TrendingUp className="h-3 w-3 mr-1" />
                    ) : (
                      <TrendingDown className="h-3 w-3 mr-1" />
                    )}
                    {item.change}
                  </span>
                  <span>from last month</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>User Growth</CardTitle>
              <CardDescription>Monthly user and company registrations</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={userGrowthData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="users" stroke="#8884d8" strokeWidth={2} name="Users" />
                  <Line type="monotone" dataKey="companies" stroke="#82ca9d" strokeWidth={2} name="Companies" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Platform Activity</CardTitle>
              <CardDescription>Distribution of user activities</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <PieChart>
                  <Pie
                    data={activityData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {activityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest actions on your platform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center space-x-4">
                  <div className="flex-1 space-y-1">
                    <p className="text-sm">
                      <span className="font-medium">{activity.user}</span> {activity.action}{" "}
                      <span className="font-medium">{activity.target}</span>
                    </p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                  <Badge
                    variant={
                      activity.status === "pending"
                        ? "secondary"
                        : activity.status === "active"
                          ? "default"
                          : activity.status === "approved"
                            ? "default"
                            : "outline"
                    }
                  >
                    {activity.status}
                  </Badge>
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
