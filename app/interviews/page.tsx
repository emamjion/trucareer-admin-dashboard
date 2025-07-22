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
import { Search, MoreHorizontal, Eye, Check, X, MessageSquare } from "lucide-react"
import { useState } from "react"

const interviewsData = [
  {
    id: 1,
    user: "Alice Johnson",
    company: "Google Inc.",
    position: "Software Engineer",
    difficulty: "Hard",
    outcome: "Selected",
    experience: "Great interview process with multiple rounds...",
    submittedDate: "2024-01-15",
    status: "Pending",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: 2,
    user: "Bob Smith",
    company: "Microsoft",
    position: "Product Manager",
    difficulty: "Medium",
    outcome: "Rejected",
    experience: "Interview was fair but questions were challenging...",
    submittedDate: "2024-01-12",
    status: "Approved",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: 3,
    user: "Carol Davis",
    company: "StartupXYZ",
    position: "Frontend Developer",
    difficulty: "Easy",
    outcome: "Selected",
    experience: "Very friendly interview process with practical questions...",
    submittedDate: "2024-01-10",
    status: "Approved",
    avatar: "/placeholder.svg?height=32&width=32",
  },
]

export default function InterviewsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [difficultyFilter, setDifficultyFilter] = useState("all")
  const [outcomeFilter, setOutcomeFilter] = useState("all")

  const filteredInterviews = interviewsData.filter((interview) => {
    const matchesSearch =
      interview.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      interview.position.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || interview.status === statusFilter
    const matchesDifficulty = difficultyFilter === "all" || interview.difficulty === difficultyFilter
    const matchesOutcome = outcomeFilter === "all" || interview.outcome === outcomeFilter

    return matchesSearch && matchesStatus && matchesDifficulty && matchesOutcome
  })

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Interview Experiences</h2>
            <p className="text-muted-foreground">Moderate interview experiences shared by users</p>
          </div>
          <Button>
            <MessageSquare className="mr-2 h-4 w-4" />
            Add Experience
          </Button>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
            <CardDescription>Filter and search through interview experiences</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search experiences..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Approved">Approved</SelectItem>
                  <SelectItem value="Rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
              <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Difficulties</SelectItem>
                  <SelectItem value="Easy">Easy</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Hard">Hard</SelectItem>
                </SelectContent>
              </Select>
              <Select value={outcomeFilter} onValueChange={setOutcomeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by outcome" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Outcomes</SelectItem>
                  <SelectItem value="Selected">Selected</SelectItem>
                  <SelectItem value="Rejected">Rejected</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Interviews Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Interview Experiences ({filteredInterviews.length})</CardTitle>
            <CardDescription>User-submitted interview experiences</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Difficulty</TableHead>
                  <TableHead>Outcome</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInterviews.map((interview) => (
                  <TableRow key={interview.id}>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={interview.avatar || "/placeholder.svg"} alt={interview.user} />
                          <AvatarFallback>
                            {interview.user
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{interview.user}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{interview.company}</TableCell>
                    <TableCell>{interview.position}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          interview.difficulty === "Easy"
                            ? "default"
                            : interview.difficulty === "Medium"
                              ? "secondary"
                              : "destructive"
                        }
                      >
                        {interview.difficulty}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          interview.outcome === "Selected"
                            ? "default"
                            : interview.outcome === "Rejected"
                              ? "destructive"
                              : "secondary"
                        }
                      >
                        {interview.outcome}
                      </Badge>
                    </TableCell>
                    <TableCell>{interview.submittedDate}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          interview.status === "Approved"
                            ? "default"
                            : interview.status === "Pending"
                              ? "secondary"
                              : "destructive"
                        }
                      >
                        {interview.status}
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
                            View Full Experience
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {interview.status === "Pending" && (
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
