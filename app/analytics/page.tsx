"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarDays, Download, TrendingUp } from "lucide-react"
import {
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  ComposedChart,
} from "recharts"
import { useState } from "react"

const userGrowthData = [
  { month: "Jan", users: 1200, companies: 45, jobs: 120, reviews: 89 },
  { month: "Feb", users: 1400, companies: 52, jobs: 145, reviews: 112 },
  { month: "Mar", users: 1800, companies: 61, jobs: 189, reviews: 156 },
  { month: "Apr", users: 2200, companies: 73, jobs: 234, reviews: 201 },
  { month: "May", users: 2800, companies: 89, jobs: 298, reviews: 267 },
  { month: "Jun", users: 3200, companies: 95, jobs: 356, reviews: 324 },
]

const topCompaniesData = [
  { name: "Google", reviews: 1250, jobs: 45, rating: 4.5 },
  { name: "Microsoft", reviews: 980, jobs: 32, rating: 4.3 },
  { name: "Apple", reviews: 876, jobs: 28, rating: 4.4 },
  { name: "Amazon", reviews: 743, jobs: 67, rating: 3.9 },
  { name: "Meta", reviews: 654, jobs: 23, rating: 4.1 },
]

const jobCategoryData = [
  { name: "Software Engineering", value: 1200, color: "#0088FE" },
  { name: "Data Science", value: 800, color: "#00C49F" },
  { name: "Product Management", value: 600, color: "#FFBB28" },
  { name: "Design", value: 400, color: "#FF8042" },
  { name: "Marketing", value: 300, color: "#8884D8" },
  { name: "Sales", value: 250, color: "#82CA9D" },
]

const salaryTrendsData = [
  { role: "Software Engineer", junior: 75000, mid: 95000, senior: 130000 },
  { role: "Data Scientist", junior: 80000, mid: 105000, senior: 140000 },
  { role: "Product Manager", junior: 85000, mid: 115000, senior: 155000 },
  { role: "Designer", junior: 65000, mid: 85000, senior: 115000 },
  { role: "DevOps Engineer", junior: 78000, mid: 98000, senior: 135000 },
]

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82CA9D"]

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("6months")

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Analytics</h2>
            <p className="text-muted-foreground">Comprehensive insights and reports for your platform</p>
          </div>
          <div className="flex items-center space-x-2">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select time range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1month">Last Month</SelectItem>
                <SelectItem value="3months">Last 3 Months</SelectItem>
                <SelectItem value="6months">Last 6 Months</SelectItem>
                <SelectItem value="1year">Last Year</SelectItem>
              </SelectContent>
            </Select>
            <Button>
              <Download className="mr-2 h-4 w-4" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$45,231</div>
              <p className="text-xs text-muted-foreground">+20.1% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Users</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12,543</div>
              <p className="text-xs text-muted-foreground">+12.5% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Job Applications</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8,901</div>
              <p className="text-xs text-muted-foreground">+15.3% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Session Duration</CardTitle>
              <CalendarDays className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8m 42s</div>
              <p className="text-xs text-muted-foreground">+2.1% from last month</p>
            </CardContent>
          </Card>
        </div>

        {/* Growth Charts */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Platform Growth</CardTitle>
              <CardDescription>Monthly growth across all metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <ComposedChart data={userGrowthData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="users" fill="#8884d8" name="Users" />
                  <Line type="monotone" dataKey="companies" stroke="#ff7300" name="Companies" />
                  <Line type="monotone" dataKey="jobs" stroke="#00ff00" name="Jobs" />
                </ComposedChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Job Categories</CardTitle>
              <CardDescription>Distribution of job postings by category</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <PieChart>
                  <Pie
                    data={jobCategoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {jobCategoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Top Companies and Salary Trends */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Top Companies by Reviews</CardTitle>
              <CardDescription>Companies with the most user engagement</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={topCompaniesData} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={80} />
                  <Tooltip />
                  <Bar dataKey="reviews" fill="#8884d8" name="Reviews" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Salary Trends by Role</CardTitle>
              <CardDescription>Average salaries across experience levels</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={salaryTrendsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="role" angle={-45} textAnchor="end" height={100} />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, ""]} />
                  <Bar dataKey="junior" fill="#8884d8" name="Junior" />
                  <Bar dataKey="mid" fill="#82ca9d" name="Mid-level" />
                  <Bar dataKey="senior" fill="#ffc658" name="Senior" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* User Activity Heatmap */}
        <Card>
          <CardHeader>
            <CardTitle>User Activity Timeline</CardTitle>
            <CardDescription>Daily active users over the past 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={userGrowthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="users"
                  stroke="#8884d8"
                  fill="#8884d8"
                  fillOpacity={0.6}
                  name="Active Users"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
