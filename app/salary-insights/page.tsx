"use client";

import { DashboardLayout } from "@/components/dashboard-layout";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Briefcase,
  Building2,
  Calendar,
  Download,
  Eye,
  Filter,
  GraduationCap,
  Grid3X3,
  IndianRupee,
  List,
  MapPin,
  Search,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { SalaryEntryDialog } from "./components/SalaryEntryDialog";

const dummyData = [
  {
    id: 1,
    designation: "Software Engineer",
    company: "Tech Corp",
    location: "Bangalore",
    experience: 3,
    qualification: "B.Tech",
    department: "Engineering",
    industry: "IT",
    jobLevel: "Mid",
    employmentType: "Full-time",
    baseSalary: 10,
    bonus: 2,
    stockOptions: 1,
    year: "2024",
    companySize: "1000+",
    skills: ["React", "Node.js", "Python"],
  },
  {
    id: 2,
    designation: "Product Manager",
    company: "InnoWare",
    location: "Mumbai",
    experience: 5,
    qualification: "MBA",
    department: "Product",
    industry: "SaaS",
    jobLevel: "Senior",
    employmentType: "Full-time",
    baseSalary: 18,
    bonus: 4,
    stockOptions: 2,
    year: "2023",
    companySize: "500-1000",
    skills: ["Strategy", "Analytics", "Leadership"],
  },
  {
    id: 3,
    designation: "Data Scientist",
    company: "DataTech",
    location: "Hyderabad",
    experience: 4,
    qualification: "M.Tech",
    department: "Data Science",
    industry: "Analytics",
    jobLevel: "Senior",
    employmentType: "Full-time",
    baseSalary: 15,
    bonus: 3,
    stockOptions: 1.5,
    year: "2024",
    companySize: "100-500",
    skills: ["Python", "ML", "SQL"],
  },
  {
    id: 4,
    designation: "Frontend Developer",
    company: "WebSolutions",
    location: "Pune",
    experience: 2,
    qualification: "B.Tech",
    department: "Engineering",
    industry: "IT",
    jobLevel: "Mid",
    employmentType: "Full-time",
    baseSalary: 8,
    bonus: 1,
    stockOptions: 0.5,
    year: "2024",
    companySize: "50-100",
    skills: ["React", "TypeScript", "CSS"],
  },
];

const salaryByExperience = [
  { experience: "0-1", avgSalary: 6 },
  { experience: "1-3", avgSalary: 9 },
  { experience: "3-5", avgSalary: 15 },
  { experience: "5-7", avgSalary: 22 },
  { experience: "7-10", avgSalary: 30 },
  { experience: "10+", avgSalary: 40 },
];

const salaryByLocation = [
  { name: "Bangalore", value: 35, color: "#0088FE" },
  { name: "Mumbai", value: 25, color: "#00C49F" },
  { name: "Hyderabad", value: 20, color: "#FFBB28" },
  { name: "Pune", value: 15, color: "#FF8042" },
  { name: "Others", value: 5, color: "#8884D8" },
];

export default function SalaryInsightsPage() {
  const [filter, setFilter] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [locationFilter, setLocationFilter] = useState("all");
  const [experienceFilter, setExperienceFilter] = useState("all");
  const [levelFilter, setLevelFilter] = useState("all");

  const filtered = dummyData.filter((item) => {
    const matchesSearch =
      item.designation.toLowerCase().includes(filter.toLowerCase()) ||
      item.company.toLowerCase().includes(filter.toLowerCase());
    const matchesLocation =
      locationFilter === "all" || item.location === locationFilter;
    const matchesExperience =
      experienceFilter === "all" ||
      (experienceFilter === "0-2" && item.experience <= 2) ||
      (experienceFilter === "3-5" &&
        item.experience >= 3 &&
        item.experience <= 5) ||
      (experienceFilter === "5+" && item.experience > 5);
    const matchesLevel = levelFilter === "all" || item.jobLevel === levelFilter;

    return (
      matchesSearch && matchesLocation && matchesExperience && matchesLevel
    );
  });

  const getJobLevelColor = (level: string) => {
    switch (level) {
      case "Entry":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "Mid":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "Senior":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
      case "Lead":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  const getTotalCTC = (item: any) => {
    return item.baseSalary + (item.bonus ?? 0) + (item.stockOptions ?? 0);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">
              Salary Insights
            </h2>
            <p className="text-muted-foreground">
              Explore salary data across different roles, companies, and
              locations
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <SalaryEntryDialog />
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Entries
              </CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dummyData.length}</div>
              <p className="text-xs text-muted-foreground">
                +12% from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Salary</CardTitle>
              <IndianRupee className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹12.8 LPA</div>
              <p className="text-xs text-muted-foreground">
                +8% from last year
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Top Location
              </CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Bangalore</div>
              <p className="text-xs text-muted-foreground">
                35% of all entries
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Growth Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+15%</div>
              <p className="text-xs text-muted-foreground">YoY salary growth</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Salary by Experience</CardTitle>
              <CardDescription>
                Average salary progression with experience
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={salaryByExperience}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="experience" />
                  <YAxis />
                  <Tooltip
                    formatter={(value) => [`₹${value} LPA`, "Average Salary"]}
                  />
                  <Bar dataKey="avgSalary" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Salary Distribution by Location</CardTitle>
              <CardDescription>Percentage of entries by city</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={salaryByLocation}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name} ${((percent ?? 0) * 100).toFixed(0)}%`
                    }
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {salaryByLocation.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters & Search
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search designation or company..."
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>
              <Select value={locationFilter} onValueChange={setLocationFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  <SelectItem value="Bangalore">Bangalore</SelectItem>
                  <SelectItem value="Mumbai">Mumbai</SelectItem>
                  <SelectItem value="Hyderabad">Hyderabad</SelectItem>
                  <SelectItem value="Pune">Pune</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={experienceFilter}
                onValueChange={setExperienceFilter}
              >
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Experience" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Experience</SelectItem>
                  <SelectItem value="0-2">0-2 years</SelectItem>
                  <SelectItem value="3-5">3-5 years</SelectItem>
                  <SelectItem value="5+">5+ years</SelectItem>
                </SelectContent>
              </Select>
              <Select value={levelFilter} onValueChange={setLevelFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="Entry">Entry</SelectItem>
                  <SelectItem value="Mid">Mid</SelectItem>
                  <SelectItem value="Senior">Senior</SelectItem>
                  <SelectItem value="Lead">Lead</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex gap-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "table" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("table")}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <Card>
          <CardHeader>
            <CardTitle>Salary Data ({filtered.length} entries)</CardTitle>
            <CardDescription>
              {viewMode === "grid"
                ? "Card view of salary entries"
                : "Table view of salary entries"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((entry) => (
                  <Card
                    key={entry.id}
                    className="hover:shadow-md transition-shadow"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                              {entry.company.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <CardTitle className="text-lg leading-tight">
                              {entry.designation}
                            </CardTitle>
                            <p className="text-sm text-muted-foreground flex items-center gap-1">
                              <Building2 className="h-3 w-3" />
                              {entry.company}
                            </p>
                          </div>
                        </div>
                        <Badge className={getJobLevelColor(entry.jobLevel)}>
                          {entry.jobLevel}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span>{entry.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Briefcase className="h-4 w-4 text-muted-foreground" />
                          <span>{entry.experience} yrs</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <GraduationCap className="h-4 w-4 text-muted-foreground" />
                          <span>{entry.qualification}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>{entry.year}</span>
                        </div>
                      </div>

                      <div className="border-t pt-3">
                        <div className="grid grid-cols-3 gap-2 text-center">
                          <div>
                            <p className="text-xs text-muted-foreground">
                              Base
                            </p>
                            <p className="font-semibold">
                              ₹{entry.baseSalary}L
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">
                              Bonus
                            </p>
                            <p className="font-semibold">
                              ₹{entry.bonus ?? 0}L
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">
                              Stock
                            </p>
                            <p className="font-semibold">
                              ₹{entry.stockOptions ?? 0}L
                            </p>
                          </div>
                        </div>
                        <div className="mt-3 p-2 bg-primary/5 rounded-lg text-center">
                          <p className="text-xs text-muted-foreground">
                            Total CTC
                          </p>
                          <p className="text-xl font-bold text-primary">
                            ₹{getTotalCTC(entry)} LPA
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1">
                        {entry.skills.slice(0, 3).map((skill, idx) => (
                          <Badge
                            key={idx}
                            variant="secondary"
                            className="text-xs"
                          >
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Designation</TableHead>
                      <TableHead>Company</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Exp</TableHead>
                      <TableHead>Level</TableHead>
                      <TableHead>Base</TableHead>
                      <TableHead>Bonus</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead>CTC</TableHead>
                      <TableHead>Year</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.map((entry) => (
                      <TableRow key={entry.id} className="hover:bg-muted/50">
                        <TableCell>
                          <div>
                            <p className="font-medium">{entry.designation}</p>
                            <p className="text-xs text-muted-foreground">
                              {entry.department}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarFallback className="text-xs">
                                {entry.company.substring(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            {entry.company}
                          </div>
                        </TableCell>
                        <TableCell>{entry.location}</TableCell>
                        <TableCell>{entry.experience}y</TableCell>
                        <TableCell>
                          <Badge
                            className={getJobLevelColor(entry.jobLevel)}
                            variant="secondary"
                          >
                            {entry.jobLevel}
                          </Badge>
                        </TableCell>
                        <TableCell>₹{entry.baseSalary}L</TableCell>
                        <TableCell>₹{entry.bonus ?? 0}L</TableCell>
                        <TableCell>₹{entry.stockOptions ?? 0}L</TableCell>
                        <TableCell>
                          <span className="font-semibold text-primary">
                            ₹{getTotalCTC(entry)}L
                          </span>
                        </TableCell>
                        <TableCell>{entry.year}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
