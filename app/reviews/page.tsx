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
import { Search, MoreHorizontal, Eye, Check, X, Flag, Star } from "lucide-react"
import { useState } from "react"

const reviewsData = [
  {
    id: 1,
    user: "John Doe",
    company: "Google Inc.",
    rating: 5,
    title: "Great place to work!",
    content: "Amazing work culture and great benefits. Highly recommend...",
    submittedDate: "2024-01-15",
    status: "Pending",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: 2,
    user: "Jane Smith",
    company: "Microsoft",
    rating: 4,
    title: "Good work-life balance",
    content: "Decent company with good benefits but can be slow-paced...",
    submittedDate: "2024-01-12",
    status: "Approved",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: 3,
    user: "Mike Johnson",
    company: "StartupXYZ",
    rating: 2,
    title: "Not recommended",
    content: "Poor management and unrealistic expectations...",
    submittedDate: "2024-01-10",
    status: "Flagged",
    avatar: "/placeholder.svg?height=32&width=32",
  },
]

export default function ReviewsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [ratingFilter, setRatingFilter] = useState("all")

  const filteredReviews = reviewsData.filter((review) => {
    const matchesSearch =
      review.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || review.status === statusFilter
    const matchesRating = ratingFilter === "all" || review.rating.toString() === ratingFilter

    return matchesSearch && matchesStatus && matchesRating
  })

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`h-4 w-4 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
    ))
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Reviews</h2>
          <p className="text-muted-foreground">Moderate and manage company reviews submitted by users</p>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
            <CardDescription>Filter and search through reviews</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search reviews..."
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
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Approved">Approved</SelectItem>
                  <SelectItem value="Flagged">Flagged</SelectItem>
                </SelectContent>
              </Select>
              <Select value={ratingFilter} onValueChange={setRatingFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by rating" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Ratings</SelectItem>
                  <SelectItem value="5">5 Stars</SelectItem>
                  <SelectItem value="4">4 Stars</SelectItem>
                  <SelectItem value="3">3 Stars</SelectItem>
                  <SelectItem value="2">2 Stars</SelectItem>
                  <SelectItem value="1">1 Star</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Reviews Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Reviews ({filteredReviews.length})</CardTitle>
            <CardDescription>Company reviews awaiting moderation</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Review</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReviews.map((review) => (
                  <TableRow key={review.id}>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={review.avatar || "/placeholder.svg"} alt={review.user} />
                          <AvatarFallback>
                            {review.user
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{review.user}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{review.company}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">{renderStars(review.rating)}</div>
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <div>
                        <div className="font-medium text-sm">{review.title}</div>
                        <div className="text-sm text-muted-foreground truncate">{review.content}</div>
                      </div>
                    </TableCell>
                    <TableCell>{review.submittedDate}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          review.status === "Approved"
                            ? "default"
                            : review.status === "Pending"
                              ? "secondary"
                              : "destructive"
                        }
                      >
                        {review.status}
                      </Badge>
                    </TableCell>
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
                            View Full Review
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {review.status === "Pending" && (
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
                          <DropdownMenuItem className="text-orange-600">
                            <Flag className="mr-2 h-4 w-4" />
                            Flag Review
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
