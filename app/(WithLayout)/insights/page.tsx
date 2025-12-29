"use client";

import { DashboardLayout } from "@/components/dashboard-layout";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
import { cn } from "@/lib/utils";
import {
  Briefcase,
  Building2,
  Calendar,
  Check,
  ChevronsUpDown,
  Download,
  Edit,
  Eye,
  Filter,
  GraduationCap,
  Grid3X3,
  IndianRupee,
  List,
  MapPin,
  MoreHorizontal,
  Search,
  Trash2,
  TrendingUp,
} from "lucide-react";
import { useEffect, useState } from "react";
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
import { toast } from "sonner";
import { SalaryEntryDialog } from "./components/SalaryEntryDialog";

const API_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/salaries`;

type ExperienceSalary = {
  experience: string;
  avgSalary: number;
  count: number;
};

const departments = [
  "Executive Leadership",
  "Administration",
  "Human Resources (HR) & People Operations",
  "Finance & Accounting",
  "Information Technology (IT)",
  "Engineering & Development",
  "Product Development",
  "Product Management",
  "Operations",
  "Business Development",
  "Sales & Marketing",
  "Customer Service & Support",
  "Research & Development (R&D)",
  "Legal & Compliance",
  "Supply Chain & Procurement",
  "Quality Assurance (QA)",
  "Risk Management",
  "Public Relations (PR) & Corporate Communications",
  "Facilities & Maintenance",
  "Logistics & Distribution",
  "Data Science & Analytics",
  "Design & User Experience (UX/UI)",
  "Security (Physical & Cybersecurity)",
  "Project Management",
];

export default function SalaryInsightsPage() {
  const [salaryData, setSalaryData] = useState<any[]>([]);
  const [filter, setFilter] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [locationFilter, setLocationFilter] = useState("all");
  const [experienceFilter, setExperienceFilter] = useState("all");
  const [levelFilter, setLevelFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedSalary, setSelectedSalary] = useState<any>(null);
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const fetchSalaries = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setSalaryData(data.data);
      else toast.error("Failed to fetch salaries.");
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSalaries();
  }, []);

  const experienceYears = Array.from({ length: 16 }, (_, i) => i);

  const currentYear = new Date().getFullYear();
  const salaryYears = Array.from(
    { length: currentYear - 2020 + 1 },
    (_, i) => 2020 + i
  );
  // -------------------
  // HELPERS
  // -------------------
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
    const monthly = Number(item?.totalMonthly ?? 0);
    return parseFloat(((monthly * 12) / 100000).toFixed(2));
  };

  // Filtered Data
  const filtered = salaryData.filter((item) => {
    const matchesSearch =
      item.designation.toLowerCase().includes(filter.toLowerCase()) ||
      item.companyName.toLowerCase().includes(filter.toLowerCase());
    const matchesLocation =
      locationFilter === "all" || item.location === locationFilter;
    const matchesExperience =
      experienceFilter === "all" ||
      (experienceFilter === "0-2" && Number(item.experience) <= 2) ||
      (experienceFilter === "3-5" &&
        Number(item.experience) >= 3 &&
        Number(item.experience) <= 5) ||
      (experienceFilter === "5+" && Number(item.experience) > 5);
    const matchesLevel =
      levelFilter === "all" || item.experienceLevel === levelFilter;

    return (
      matchesSearch && matchesLocation && matchesExperience && matchesLevel
    );
  });

  // -------------------
  // CSV EXPORT
  // -------------------
  const exportCSV = () => {
    const headers = [
      "Designation",
      "Company",
      "Location",
      "Experience",
      "Level",
      "CTC (LPA)",
      "Year",
      "Department",
      "Employment Type",
    ];
    const rows = salaryData.map((item) => [
      item.designation,
      item.companyName,
      item.location,
      item.experience,
      item.experienceLevel,
      getTotalCTC(item),
      item.whichYearsSalary,
      item.department,
      item.employmentType,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows].map((e) => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "salary_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // -------------------
  // MODAL ACTIONS
  // -------------------
  const handleView = (entry: any) => {
    setSelectedSalary(entry);
    setOpenViewDialog(true);
  };

  const handleEdit = (entry: any) => {
    setSelectedSalary(entry);
    setOpenEditDialog(true);
  };

  const saveEdit = async () => {
    if (!selectedSalary || !token) return;
    try {
      const res = await fetch(`${API_URL}/${selectedSalary._id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(selectedSalary),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Salary updated successfully!");
        fetchSalaries();
      } else toast.error("Failed to update salary.");
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong.");
    } finally {
      setOpenEditDialog(false);
    }
  };

  const handleDelete = (entry: any) => {
    setSelectedSalary(entry);
    setOpenDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (!selectedSalary || !token) return;
    try {
      const res = await fetch(`${API_URL}/${selectedSalary._id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Salary deleted successfully!");
        fetchSalaries();
      } else toast.error("Failed to delete salary.");
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong.");
    } finally {
      setOpenDeleteDialog(false);
    }
  };

  // -------------------
  // CHARTS
  // -------------------
  const salaryByExperience: ExperienceSalary[] = [
    { experience: "0-1", avgSalary: 0, count: 0 },
    { experience: "1-3", avgSalary: 0, count: 0 },
    { experience: "3-5", avgSalary: 0, count: 0 },
    { experience: "5-7", avgSalary: 0, count: 0 },
    { experience: "7-10", avgSalary: 0, count: 0 },
    { experience: "10+", avgSalary: 0, count: 0 },
  ];

  const salaryByLocation: { name: string; value: number; color: string }[] = [];

  salaryData.forEach((item) => {
    const exp = Number(item.experience);
    if (exp <= 1) salaryByExperience[0].avgSalary += getTotalCTC(item);
    else if (exp <= 3) salaryByExperience[1].avgSalary += getTotalCTC(item);
    else if (exp <= 5) salaryByExperience[2].avgSalary += getTotalCTC(item);
    else if (exp <= 7) salaryByExperience[3].avgSalary += getTotalCTC(item);
    else if (exp <= 10) salaryByExperience[4].avgSalary += getTotalCTC(item);
    else salaryByExperience[5].avgSalary += getTotalCTC(item);

    const locIndex = salaryByLocation.findIndex(
      (l) => l.name === item.location
    );
    if (locIndex >= 0) salaryByLocation[locIndex].value += 1;
    else
      salaryByLocation.push({
        name: item.location,
        value: 1,
        color: "#" + Math.floor(Math.random() * 16777215).toString(16),
      });
  });

  salaryByExperience.forEach((item) => {
    if (item.count > 0)
      item.avgSalary = parseFloat((item.avgSalary / item.count).toFixed(1));
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">
              Salary Insights
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={exportCSV}>
              <Download className="mr-2 h-4 w-4" /> Export
            </Button>
            <SalaryEntryDialog onSuccess={fetchSalaries} />
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
              <div className="text-2xl font-bold">{salaryData.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Salary</CardTitle>
              <IndianRupee className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                BDT{" "}
                {salaryData.length
                  ? (
                      salaryData.reduce(
                        (acc, item) => acc + getTotalCTC(item),
                        0
                      ) / salaryData.length
                    ).toFixed(1)
                  : 0}{" "}
                Taka
              </div>
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
              {salaryByLocation.length > 0 ? (
                <div className="text-2xl font-bold">
                  {
                    salaryByLocation.reduce((a, b) =>
                      a.value > b.value ? a : b
                    ).name
                  }
                </div>
              ) : (
                <div className="text-2xl font-bold">-</div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Growth Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+15%</div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Salary by Experience</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={salaryByExperience}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="experience" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`BDT ${value} Taka`]} />
                  <Bar dataKey="avgSalary" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Salary Distribution by Location</CardTitle>
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
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Filters & Search */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters & Search
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search designation or company..."
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="pl-8"
                />
              </div>
              <Select value={locationFilter} onValueChange={setLocationFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  {Array.from(new Set(salaryData.map((d) => d.location))).map(
                    (loc) => (
                      <SelectItem key={loc} value={loc}>
                        {loc}
                      </SelectItem>
                    )
                  )}
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
          </CardHeader>
          <CardContent>
            {loading ? (
              <p>Loading...</p>
            ) : viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((entry) => (
                  <Card
                    key={entry._id}
                    className="hover:shadow-md transition-shadow"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                              {entry.companyName.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <CardTitle className="text-lg leading-tight">
                              {entry.designation}
                            </CardTitle>
                            <p className="text-sm text-muted-foreground flex items-center gap-1">
                              <Building2 className="h-3 w-3" />
                              {entry.companyName}
                            </p>
                          </div>
                        </div>
                        <Badge
                          className={getJobLevelColor(entry.experienceLevel)}
                        >
                          {entry.experienceLevel}
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
                          <span>{entry.department}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>{entry.whichYearsSalary}</span>
                        </div>
                      </div>
                      <div className="mt-3 p-2 bg-primary/5 rounded-lg text-center">
                        <p className="text-xs text-muted-foreground">
                          Total CTC
                        </p>
                        <p className="text-xl font-bold text-primary">
                          ${getTotalCTC(entry)} LPA
                        </p>
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
                      <TableHead>CTC</TableHead>
                      <TableHead>Year</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.map((entry) => (
                      <TableRow key={entry._id} className="hover:bg-muted/50">
                        <TableCell>{entry.designation}</TableCell>
                        <TableCell>{entry.companyName}</TableCell>
                        <TableCell>{entry.location}</TableCell>
                        <TableCell>{entry.experience}y</TableCell>
                        <TableCell>
                          <Badge
                            className={getJobLevelColor(entry.experienceLevel)}
                          >
                            {entry.experienceLevel}
                          </Badge>
                        </TableCell>
                        <TableCell>BDT{getTotalCTC(entry)}L</TableCell>
                        <TableCell>{entry.whichYearsSalary}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem
                                onClick={() => handleView(entry)}
                              >
                                <Eye className="mr-2 h-4 w-4" /> View
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleEdit(entry)}
                              >
                                <Edit className="mr-2 h-4 w-4" /> Edit
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={() => handleDelete(entry)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" /> Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        <Dialog open={openViewDialog} onOpenChange={setOpenViewDialog}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Salary Details</DialogTitle>
              <DialogDescription>
                Complete salary information overview
              </DialogDescription>
            </DialogHeader>

            {selectedSalary && (
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Designation</p>
                  <p className="font-medium">{selectedSalary.designation}</p>
                </div>

                <div>
                  <p className="text-muted-foreground">Company</p>
                  <p className="font-medium">{selectedSalary.companyName}</p>
                </div>

                <div>
                  <p className="text-muted-foreground">Location</p>
                  <p className="font-medium">{selectedSalary.location}</p>
                </div>

                <div>
                  <p className="text-muted-foreground">Department</p>
                  <p className="font-medium">{selectedSalary.department}</p>
                </div>

                <div>
                  <p className="text-muted-foreground">Experience</p>
                  <p className="font-medium">
                    {selectedSalary.experience} years
                  </p>
                </div>

                <div>
                  <p className="text-muted-foreground">Experience Level</p>
                  <Badge
                    className={getJobLevelColor(selectedSalary.experienceLevel)}
                  >
                    {selectedSalary.experienceLevel}
                  </Badge>
                </div>

                <div>
                  <p className="text-muted-foreground">Employment Type</p>
                  <p className="font-medium">{selectedSalary.employmentType}</p>
                </div>

                <div>
                  <p className="text-muted-foreground">Gender</p>
                  <p className="font-medium">{selectedSalary.gender}</p>
                </div>

                <div>
                  <p className="text-muted-foreground">Salary Year</p>
                  <p className="font-medium">
                    {selectedSalary.whichYearsSalary}
                  </p>
                </div>

                <div>
                  <p className="text-muted-foreground">Minimum Increment</p>
                  <p className="font-medium">
                    {selectedSalary.minimumIncrement}%
                  </p>
                </div>

                <div className="col-span-2 bg-primary/5 p-3 rounded-lg text-center">
                  <p className="text-xs text-muted-foreground">Total CTC</p>
                  <p className="text-xl font-bold text-primary">
                    BDT {getTotalCTC(selectedSalary)} LPA
                  </p>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Edit Modal */}
        <Dialog open={openEditDialog} onOpenChange={setOpenEditDialog}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Edit Salary Entry</DialogTitle>
              <DialogDescription>
                Update the salary information carefully
              </DialogDescription>
            </DialogHeader>

            {selectedSalary && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  saveEdit();
                }}
              >
                <div className="grid gap-4 py-4">
                  {/* Designation & Company */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Designation</Label>
                      <Input
                        value={selectedSalary.designation}
                        onChange={(e) =>
                          setSelectedSalary({
                            ...selectedSalary,
                            designation: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Company</Label>
                      <Input
                        value={selectedSalary.companyName}
                        onChange={(e) =>
                          setSelectedSalary({
                            ...selectedSalary,
                            companyName: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  {/* Location & Experience */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Location</Label>
                      <Input
                        value={selectedSalary.location}
                        onChange={(e) =>
                          setSelectedSalary({
                            ...selectedSalary,
                            location: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Experience(Years)</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-between"
                          >
                            {selectedSalary.experience} Years
                            <ChevronsUpDown className="h-4 w-4 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="p-0 max-h-60 overflow-y-auto">
                          <Command>
                            <CommandInput placeholder="Search experience..." />
                            <CommandGroup>
                              {experienceYears.map((year) => (
                                <CommandItem
                                  key={year}
                                  onSelect={() =>
                                    setSelectedSalary({
                                      ...selectedSalary,
                                      experience: year,
                                    })
                                  }
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      selectedSalary.experience === year
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                  {year} Years
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

                  {/* Experience Level & Department */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Experience Level</Label>
                      <Select
                        value={selectedSalary.experienceLevel}
                        onValueChange={(val) =>
                          setSelectedSalary({
                            ...selectedSalary,
                            experienceLevel: val,
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Entry">Entry</SelectItem>
                          <SelectItem value="Mid">Mid</SelectItem>
                          <SelectItem value="Senior">Senior</SelectItem>
                          <SelectItem value="Lead">Lead</SelectItem>
                          <SelectItem value="Manager">Manager</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Department</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-between"
                          >
                            {selectedSalary.department || "Select department"}
                            <ChevronsUpDown className="h-4 w-4 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="p-0 max-h-64 overflow-y-auto">
                          <Command>
                            <CommandInput placeholder="Search department..." />
                            <CommandEmpty>No department found</CommandEmpty>
                            <CommandGroup>
                              {departments.map((dept) => (
                                <CommandItem
                                  key={dept}
                                  onSelect={() =>
                                    setSelectedSalary({
                                      ...selectedSalary,
                                      department: dept,
                                    })
                                  }
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      selectedSalary.department === dept
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                  {dept}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

                  {/* Salary / Year / Increment */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Monthly Salary (BDT)</Label>
                      <Input
                        type="number"
                        value={selectedSalary.totalMonthly}
                        onChange={(e) =>
                          setSelectedSalary({
                            ...selectedSalary,
                            totalMonthly: Number(e.target.value),
                          })
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Salary Year</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-between"
                          >
                            {selectedSalary.whichYearsSalary}
                            <ChevronsUpDown className="h-4 w-4 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="p-0">
                          <Command>
                            <CommandGroup>
                              {salaryYears.map((year) => (
                                <CommandItem
                                  key={year}
                                  onSelect={() =>
                                    setSelectedSalary({
                                      ...selectedSalary,
                                      whichYearsSalary: year,
                                    })
                                  }
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      selectedSalary.whichYearsSalary === year
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                  {year}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className="space-y-2">
                      <Label>Minimum Increment (%)</Label>
                      <Input
                        type="number"
                        value={selectedSalary.minimumIncrement}
                        onChange={(e) =>
                          setSelectedSalary({
                            ...selectedSalary,
                            minimumIncrement: Number(e.target.value),
                          })
                        }
                      />
                    </div>
                  </div>

                  {/* Gender & Employment Type */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Gender</Label>
                      <Select
                        value={selectedSalary.gender}
                        onValueChange={(val) =>
                          setSelectedSalary({
                            ...selectedSalary,
                            gender: val,
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Male">Male</SelectItem>
                          <SelectItem value="Female">Female</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Employment Type</Label>
                      <Select
                        value={selectedSalary.employmentType}
                        onValueChange={(val) =>
                          setSelectedSalary({
                            ...selectedSalary,
                            employmentType: val,
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Full-time">Full-time</SelectItem>
                          <SelectItem value="Part-time">Part-time</SelectItem>
                          <SelectItem value="Contract">Contract</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setOpenEditDialog(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">Update Salary</Button>
                </DialogFooter>
              </form>
            )}
          </DialogContent>
        </Dialog>

        {/* Delete Modal */}
        <Dialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle>Confirm Delete</DialogTitle>
            </DialogHeader>
            <p>
              Are you sure you want to delete{" "}
              <strong>{selectedSalary?.designation}</strong> from{" "}
              <strong>{selectedSalary?.companyName}</strong>?
            </p>
            <div className="flex justify-end gap-2 mt-4">
              <Button
                variant="outline"
                onClick={() => setOpenDeleteDialog(false)}
              >
                Cancel
              </Button>
              <Button variant="destructive" onClick={confirmDelete}>
                Delete
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
