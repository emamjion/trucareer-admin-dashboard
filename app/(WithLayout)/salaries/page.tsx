"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Plus, DollarSign, TrendingUp, Edit, Trash2 } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts"
import { useState } from "react"

const salaryData = [
  {
    id: 1,
    role: "Software Engineer",
    company: "Google",
    experience: "3-5 years",
    location: "San Francisco, CA",
    baseSalary: 150000,
    bonus: 25000,
    totalCTC: 175000,
    submittedDate: "2024-01-15",
    status: "Verified",
  },
  {
    id: 2,
    role: "Data Scientist",
    company: "Microsoft",
    experience: "2-3 years",
    location: "Seattle, WA",
    baseSalary: 130000,
    bonus: 20000,
    totalCTC: 150000,
    submittedDate: "2024-01-12",
    status: "Pending",
  },
  {
    id: 3,
    role: "Product Manager",
    company: "Apple",
    experience: "5-7 years",
    location: "Cupertino, CA",
    baseSalary: 180000,
    bonus: 35000,
    totalCTC: 215000,
    submittedDate: "2024-01-10",
    status: "Verified",
  },
]

const salaryTrendData = [
  { role: "Software Engineer", avg2022: 120000, avg2023: 135000, avg2024: 150000 },
  { role: "Data Scientist", avg2022: 115000, avg2023: 128000, avg2024: 142000 },
  { role: "Product Manager", avg2022: 140000, avg2023: 155000, avg2024: 170000 },
  { role: "Designer", avg2022: 95000, avg2023: 105000, avg2024: 115000 },
  { role: "DevOps Engineer", avg2022: 110000, avg2023: 125000, avg2024: 138000 },
]

const experienceSalaryData = [
  { experience: "0-1", salary: 85000 },
  { experience: "1-2", salary: 95000 },
  { experience: "2-3", salary: 110000 },
  { experience: "3-5", salary: 135000 },
  { experience: "5-7", salary: 160000 },
  { experience: "7-10", salary: 185000 },
  { experience: "10+", salary: 220000 },
]

export default function SalariesPage() {
  const [showAddForm, setShowAddForm] = useState(false)

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Browse Salaries</h2>
            <p className="text-muted-foreground">Manage salary data and insights across roles and companies</p>
          </div>
          <Button onClick={() => setShowAddForm(!showAddForm)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Salary Data
          </Button>
        </div>

        {/* Add Salary Form */}
        {showAddForm && (
          <Card>
            <CardHeader>
              <CardTitle>Add New Salary Data</CardTitle>
              <CardDescription>Enter salary information for a specific role and company</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="role">Job Role</Label>
                  <Input id="role" placeholder="e.g., Software Engineer" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">Company</Label>
                  <Input id="company" placeholder="e.g., Google" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="experience">Experience Level</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select experience" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0-1">0-1 years</SelectItem>
                      <SelectItem value="1-2">1-2 years</SelectItem>
                      <SelectItem value="2-3">2-3 years</SelectItem>
                      <SelectItem value="3-5">3-5 years</SelectItem>
                      <SelectItem value="5-7">5-7 years</SelectItem>
                      <SelectItem value="7-10">7-10 years</SelectItem>
                      <SelectItem value="10+">10+ years</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input id="location" placeholder="e.g., San Francisco, CA" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="baseSalary">Base Salary ($)</Label>
                  <Input id="baseSalary" type="number" placeholder="150000" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bonus">Annual Bonus ($)</Label>
                  <Input id="bonus" type="number" placeholder="25000" />
                </div>
              </div>
              <div className="flex justify-end space-x-2 mt-4">
                <Button variant="outline" onClick={() => setShowAddForm(false)}>
                  Cancel
                </Button>
                <Button>Save Salary Data</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Salary Analytics */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Salary</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$145,000</div>
              <p className="text-xs text-muted-foreground">+8.2% from last year</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Salary Reports</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2,543</div>
              <p className="text-xs text-muted-foreground">+12.1% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Top Paying Role</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Product Manager</div>
              <p className="text-xs text-muted-foreground">$170,000 average</p>
            </CardContent>
          </Card>
        </div>

        {/* Salary Charts */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Salary Trends by Role</CardTitle>
              <CardDescription>Average salary progression over the years</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={salaryTrendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="role" angle={-45} textAnchor="end" height={100} />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, ""]} />
                  <Line type="monotone" dataKey="avg2022" stroke="#8884d8" name="2022" />
                  <Line type="monotone" dataKey="avg2023" stroke="#82ca9d" name="2023" />
                  <Line type="monotone" dataKey="avg2024" stroke="#ffc658" name="2024" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Salary by Experience</CardTitle>
              <CardDescription>How salary scales with years of experience</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={experienceSalaryData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="experience" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, "Average Salary"]} />
                  <Bar dataKey="salary" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Salary Data Table */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Salary Reports</CardTitle>
            <CardDescription>Latest salary data submissions</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Role</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Experience</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Base Salary</TableHead>
                  <TableHead>Total CTC</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {salaryData.map((salary) => (
                  <TableRow key={salary.id}>
                    <TableCell className="font-medium">{salary.role}</TableCell>
                    <TableCell>{salary.company}</TableCell>
                    <TableCell>{salary.experience}</TableCell>
                    <TableCell>{salary.location}</TableCell>
                    <TableCell>${salary.baseSalary.toLocaleString()}</TableCell>
                    <TableCell>${salary.totalCTC.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge variant={salary.status === "Verified" ? "default" : "secondary"}>{salary.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
