"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, MoreHorizontal, Eye, Check, X, Trash2, Building2, Star } from "lucide-react"
import { useState } from "react"

const companiesData = [
  {
    id: 1,
    name: "Google Inc.",
    logo: "/placeholder.svg?height=40&width=40",
    industry: "Technology",
    size: "10,000+",
    location: "Mountain View, CA",
    status: "Approved",
    reviews: 1250,
    rating: 4.5,
    jobs: 45,
    submittedDate: "2024-01-15",
  },
  {
    id: 2,
    name: "Microsoft Corporation",
    logo: "/placeholder.svg?height=40&width=40",
    industry: "Technology",
    size: "5,000-10,000",
    location: "Redmond, WA",
    status: "Approved",
    reviews: 980,
    rating: 4.3,
    jobs: 32,
    submittedDate: "2024-01-10",
  },
  {
    id: 3,
    name: "StartupXYZ",
    logo: "/placeholder.svg?height=40&width=40",
    industry: "Fintech",
    size: "50-100",
    location: "San Francisco, CA",
    status: "Pending",
    reviews: 12,
    rating: 4.0,
    jobs: 5,
    submittedDate: "2024-01-20",
  },
  {
    id: 4,
    name: "TechCorp Ltd",
    logo: "/placeholder.svg?height=40&width=40",
    industry: "Software",
    size: "500-1000",
    location: "Austin, TX",
    status: "Rejected",
    reviews: 45,
    rating: 3.2,
    jobs: 0,
    submittedDate: "2024-01-18",
  },
]

export default function CompaniesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [industryFilter, setIndustryFilter] = useState("all")

  const filteredCompanies = companiesData.filter((company) => {
    const matchesSearch =
      company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.location.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || company.status === statusFilter
    const matchesIndustry = industryFilter === "all" || company.industry === industryFilter

    return matchesSearch && matchesStatus && matchesIndustry
  })

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Companies</h2>
            <p className="text-muted-foreground">Manage all registered companies on your platform</p>
          </div>
          <Button>
            <Building2 className="mr-2 h-4 w-4" />
            Add Company
          </Button>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
            <CardDescription>Filter and search through companies</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search companies..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Approved">Approved</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
              <Select value={industryFilter} onValueChange={setIndustryFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by industry" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Industries</SelectItem>
                  <SelectItem value="Technology">Technology</SelectItem>
                  <SelectItem value="Fintech">Fintech</SelectItem>
                  <SelectItem value="Software">Software</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Companies Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Companies ({filteredCompanies.length})</CardTitle>
            <CardDescription>A list of all registered companies</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Company</TableHead>
                  <TableHead>Industry</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Reviews</TableHead>
                  <TableHead>Jobs</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCompanies.map((company) => (
                  <TableRow key={company.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={company.logo || "/placeholder.svg"} alt={company.name} />
                          <AvatarFallback>{company.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{company.name}</div>
                          <div className="text-sm text-muted-foreground">{company.location}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{company.industry}</Badge>
                    </TableCell>
                    <TableCell>{company.size}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          company.status === "Approved"
                            ? "default"
                            : company.status === "Pending"
                              ? "secondary"
                              : "destructive"
                        }
                      >
                        {company.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span>{company.rating}</span>
                        <span className="text-muted-foreground">({company.reviews})</span>
                      </div>
                    </TableCell>
                    <TableCell>{company.jobs}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            View Profile
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {company.status === "Pending" && (
                            <>
                              <DropdownMenuItem className="text-green-600">
                                <Check className="mr-2 h-4 w-4" />
                                Approve
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600">
                                <X className="mr-2 h-4 w-4" />
                                Reject
                              </DropdownMenuItem>
                            </>
                          )}
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
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
