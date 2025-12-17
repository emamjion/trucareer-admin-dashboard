"use client";

import { DashboardLayout } from "@/components/dashboard-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { DollarSign, Edit, Plus, Trash2, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { toast } from "sonner";

interface Salary {
  _id: string;
  jobTitle: string;
  companyName: string;
  location: string;
  experienceMin: number;
  experienceMax: number;
  experienceLabel: string;
  minSalary: number;
  maxSalary: number;
  avgSalary: number;
  salaryType: "monthly" | "yearly";
  currency: string;
  employmentType: "full-time" | "part-time" | "contract";
  category: string;
  qualification: string;
  status: "approved" | "pending" | "rejected";
}

const salaryTrendData = [
  {
    role: "Software Engineer",
    avg2022: 120000,
    avg2023: 135000,
    avg2024: 150000,
  },
  { role: "Data Scientist", avg2022: 115000, avg2023: 128000, avg2024: 142000 },
  {
    role: "Product Manager",
    avg2022: 140000,
    avg2023: 155000,
    avg2024: 170000,
  },
  { role: "Designer", avg2022: 95000, avg2023: 105000, avg2024: 115000 },
  {
    role: "DevOps Engineer",
    avg2022: 110000,
    avg2023: 125000,
    avg2024: 138000,
  },
];

const experienceSalaryData = [
  { experience: "0-1", salary: 85000 },
  { experience: "1-2", salary: 95000 },
  { experience: "2-3", salary: 110000 },
  { experience: "3-5", salary: 135000 },
  { experience: "5-7", salary: 160000 },
  { experience: "7-10", salary: 185000 },
  { experience: "10+", salary: 220000 },
];

export default function SalariesPage() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [salaryData, setSalaryData] = useState<Salary[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedSalary, setSelectedSalary] = useState<Salary | null>(null);
  const [updating, setUpdating] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [creating, setCreating] = useState(false);

  const [newSalary, setNewSalary] = useState({
    jobTitle: "",
    companyName: "",
    location: "",
    experienceMin: "",
    experienceMax: "",
    minSalary: "",
    maxSalary: "",
    salaryType: "monthly",
    currency: "BDT",
    employmentType: "full-time",
    category: "",
    qualification: "",
    status: "approved",
  });

  useEffect(() => {
    const fetchSalaries = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/browse-salary/browse-all-salaries`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const result: {
          success: boolean;
          data: Salary[];
        } = await res.json();

        if (res.ok) {
          setSalaryData(result.data);
        }
      } catch (error) {
        console.error("Failed to fetch salaries", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSalaries();
  }, []);

  const handleCreateSalary = async () => {
    try {
      setCreating(true);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/browse-salary/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            ...newSalary,
            experienceMin: Number(newSalary.experienceMin),
            experienceMax: Number(newSalary.experienceMax),
            minSalary: Number(newSalary.minSalary),
            maxSalary: Number(newSalary.maxSalary),
          }),
        }
      );

      const result = await res.json();

      if (!res.ok) throw new Error(result.message);

      // add to table instantly
      setSalaryData((prev) => [result.data, ...prev]);

      toast.success("Salary created successfully", {
        description: `${result.data.jobTitle} - ${result.data.companyName}`,
      });

      setShowAddForm(false);

      // reset form
      setNewSalary({
        jobTitle: "",
        companyName: "",
        location: "",
        experienceMin: "",
        experienceMax: "",
        minSalary: "",
        maxSalary: "",
        salaryType: "monthly",
        currency: "BDT",
        employmentType: "full-time",
        category: "",
        qualification: "",
        status: "approved",
      });
    } catch (error) {
      console.error(error);
    } finally {
      setCreating(false);
    }
  };

  const handleEditClick = (salary: Salary) => {
    setSelectedSalary(salary);
    setEditOpen(true);
  };

  const handleUpdateSalary = async () => {
    if (!selectedSalary) return;

    try {
      setUpdating(true);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/browse-salary/update/${selectedSalary._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            jobTitle: selectedSalary.jobTitle,
            companyName: selectedSalary.companyName,
            location: selectedSalary.location,
            experienceMin: selectedSalary.experienceMin,
            experienceMax: selectedSalary.experienceMax,
            minSalary: selectedSalary.minSalary,
            maxSalary: selectedSalary.maxSalary,
            salaryType: selectedSalary.salaryType,
            currency: selectedSalary.currency,
            employmentType: selectedSalary.employmentType,
            category: selectedSalary.category,
            qualification: selectedSalary.qualification,
            status: selectedSalary.status,
          }),
        }
      );

      const result = await res.json();

      if (res.ok) {
        setSalaryData((prev) =>
          prev.map((item) =>
            item._id === selectedSalary._id ? result.data : item
          )
        );

        toast.success("Salary updated successfully", {
          description: `${result.data.jobTitle} - ${result.data.companyName}`,
        });
        setEditOpen(false);
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error("Update failed", error);
    } finally {
      setUpdating(false);
    }
  };

  const confirmDelete = async () => {
    if (!selectedSalary) return;

    try {
      setDeleting(true);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/browse-salary/delete/${selectedSalary._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Delete failed");
      }

      // remove from table instantly
      setSalaryData((prev) =>
        prev.filter((item) => item._id !== selectedSalary._id)
      );

      toast.success("Salary deleted successfully", {
        description: `${selectedSalary.jobTitle} - ${selectedSalary.companyName}`,
      });

      setOpenDeleteDialog(false);
      setSelectedSalary(null);
    } catch (error) {
      console.error("Delete failed", error);
    } finally {
      setDeleting(false);
    }
  };

  // Average salary
  const avgSalary = salaryData.length
    ? Math.round(
        salaryData.reduce(
          (acc, s) => acc + (s.minSalary + s.maxSalary) / 2,
          0
        ) / salaryData.length
      )
    : 0;

  // Salary Reports count
  const salaryReportsCount = salaryData.length;

  // Top Paying Role
  const topRole = salaryData
    .map((s) => ({
      role: s.jobTitle,
      avgSalary: (s.minSalary + s.maxSalary) / 2,
    }))
    .sort((a, b) => b.avgSalary - a.avgSalary)[0] || {
    role: "-",
    avgSalary: 0,
  };

  // Salary Trends by Role (LineChart)
  const salaryTrendDataDynamic = salaryData.map((s) => ({
    role: s.jobTitle,
    avg2022: s.minSalary, // dummy for example, you can add year field in backend
    avg2023: s.minSalary + 1000,
    avg2024: (s.minSalary + s.maxSalary) / 2,
  }));

  // Salary by Experience (BarChart)
  const experienceSalaryDataDynamic = salaryData.map((s) => ({
    experience: `${s.experienceMin}-${s.experienceMax}`,
    salary: (s.minSalary + s.maxSalary) / 2,
  }));

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">
              Browse Salaries
            </h2>
            <p className="text-muted-foreground">
              Manage salary data and insights across roles and companies
            </p>
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
              <CardDescription>
                Enter salary information for a specific role and company
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="jobTitle">Job Role</Label>
                  <Input
                    id="jobTitle"
                    placeholder="e.g., Software Engineer"
                    value={newSalary.jobTitle}
                    onChange={(e) =>
                      setNewSalary({ ...newSalary, jobTitle: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="companyName">Company</Label>
                  <Input
                    id="companyName"
                    placeholder="e.g., Amazon"
                    value={newSalary.companyName}
                    onChange={(e) =>
                      setNewSalary({
                        ...newSalary,
                        companyName: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="experienceMin">Experience Min (years)</Label>
                  <Input
                    type="number"
                    id="experienceMin"
                    placeholder="2"
                    value={newSalary.experienceMin}
                    onChange={(e) =>
                      setNewSalary({
                        ...newSalary,
                        experienceMin: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="experienceMax">Experience Max (years)</Label>
                  <Input
                    type="number"
                    id="experienceMax"
                    placeholder="5"
                    value={newSalary.experienceMax}
                    onChange={(e) =>
                      setNewSalary({
                        ...newSalary,
                        experienceMax: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    placeholder="e.g., Dhaka"
                    value={newSalary.location}
                    onChange={(e) =>
                      setNewSalary({ ...newSalary, location: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="minSalary">Min Salary</Label>
                  <Input
                    type="number"
                    id="minSalary"
                    placeholder="50000"
                    value={newSalary.minSalary}
                    onChange={(e) =>
                      setNewSalary({ ...newSalary, minSalary: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maxSalary">Max Salary</Label>
                  <Input
                    type="number"
                    id="maxSalary"
                    placeholder="90000"
                    value={newSalary.maxSalary}
                    onChange={(e) =>
                      setNewSalary({ ...newSalary, maxSalary: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="salaryType">Salary Type</Label>
                  <Select
                    value={newSalary.salaryType}
                    onValueChange={(value) =>
                      setNewSalary({ ...newSalary, salaryType: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Salary Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="yearly">Yearly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="employmentType">Employment Type</Label>
                  <Select
                    value={newSalary.employmentType}
                    onValueChange={(value) =>
                      setNewSalary({ ...newSalary, employmentType: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Employment Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="full-time">Full Time</SelectItem>
                      <SelectItem value="part-time">Part Time</SelectItem>
                      <SelectItem value="contract">Contract</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    placeholder="e.g., Engineering"
                    value={newSalary.category}
                    onChange={(e) =>
                      setNewSalary({ ...newSalary, category: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="qualification">Qualification</Label>
                  <Input
                    id="qualification"
                    placeholder="e.g., Bachelor"
                    value={newSalary.qualification}
                    onChange={(e) =>
                      setNewSalary({
                        ...newSalary,
                        qualification: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 mt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowAddForm(false)}
                  disabled={creating}
                >
                  Cancel
                </Button>
                <Button onClick={handleCreateSalary} disabled={creating}>
                  {creating ? "Saving..." : "Save Salary Data"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Salary Analytics */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Average Salary
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${avgSalary.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                {/* Example: change from last year */}
                {salaryData.length > 0
                  ? `+${Math.round((avgSalary / 1000) * 2)}% from last year`
                  : ""}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Salary Reports
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{salaryReportsCount}</div>
              <p className="text-xs text-muted-foreground">
                {/* Example: change from last month */}
                {salaryData.length > 0
                  ? `+${Math.round(salaryReportsCount * 0.1)}% from last month`
                  : ""}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Top Paying Role
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{topRole.role}</div>
              <p className="text-xs text-muted-foreground">
                ${topRole.avgSalary.toLocaleString()} average
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Salary Charts */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Salary Trends by Role</CardTitle>
              <CardDescription>
                Average salary progression over the years
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={salaryTrendDataDynamic}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="role"
                    angle={-45}
                    textAnchor="end"
                    height={100}
                  />
                  <YAxis />
                  <Tooltip
                    formatter={(value) => [`$${value.toLocaleString()}`, ""]}
                  />
                  <Line
                    type="monotone"
                    dataKey="avg2022"
                    stroke="#8884d8"
                    name="2022"
                  />
                  <Line
                    type="monotone"
                    dataKey="avg2023"
                    stroke="#82ca9d"
                    name="2023"
                  />
                  <Line
                    type="monotone"
                    dataKey="avg2024"
                    stroke="#ffc658"
                    name="2024"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Salary by Experience</CardTitle>
              <CardDescription>
                How salary scales with years of experience
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={experienceSalaryDataDynamic}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="experience" />
                  <YAxis />
                  <Tooltip
                    formatter={(value) => [
                      `$${value.toLocaleString()}`,
                      "Average Salary",
                    ]}
                  />
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
                  <TableHead>Job Title</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Experience</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Salary Range</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : salaryData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center">
                      No salary data found
                    </TableCell>
                  </TableRow>
                ) : (
                  salaryData.map((salary) => (
                    <TableRow key={salary._id}>
                      <TableCell className="font-medium">
                        {salary.jobTitle}
                      </TableCell>
                      <TableCell>{salary.companyName}</TableCell>
                      <TableCell>{salary.experienceLabel}</TableCell>
                      <TableCell>{salary.location}</TableCell>
                      <TableCell>
                        {salary.minSalary.toLocaleString()} -{" "}
                        {salary.maxSalary.toLocaleString()} {salary.currency}
                      </TableCell>
                      <TableCell>{salary.salaryType}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            salary.status === "approved"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {salary.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditClick(salary)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedSalary(salary);
                              setOpenDeleteDialog(true);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Dialog open={editOpen} onOpenChange={setEditOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Salary Data</DialogTitle>
              <DialogDescription>
                Update salary information and save changes
              </DialogDescription>
            </DialogHeader>

            {selectedSalary && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Job Title</Label>
                  <Input
                    value={selectedSalary.jobTitle}
                    onChange={(e) =>
                      setSelectedSalary({
                        ...selectedSalary,
                        jobTitle: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Company Name</Label>
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
                  <Label>Experience Min (years)</Label>
                  <Input
                    type="number"
                    value={selectedSalary.experienceMin}
                    onChange={(e) =>
                      setSelectedSalary({
                        ...selectedSalary,
                        experienceMin: Number(e.target.value),
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Experience Max (years)</Label>
                  <Input
                    type="number"
                    value={selectedSalary.experienceMax}
                    onChange={(e) =>
                      setSelectedSalary({
                        ...selectedSalary,
                        experienceMax: Number(e.target.value),
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Minimum Salary</Label>
                  <Input
                    type="number"
                    value={selectedSalary.minSalary}
                    onChange={(e) =>
                      setSelectedSalary({
                        ...selectedSalary,
                        minSalary: Number(e.target.value),
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Maximum Salary</Label>
                  <Input
                    type="number"
                    value={selectedSalary.maxSalary}
                    onChange={(e) =>
                      setSelectedSalary({
                        ...selectedSalary,
                        maxSalary: Number(e.target.value),
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Salary Type</Label>
                  <Select
                    value={selectedSalary.salaryType}
                    onValueChange={(value) =>
                      setSelectedSalary({
                        ...selectedSalary,
                        salaryType: value as any,
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="yearly">Yearly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Qualification</Label>
                  <Input
                    value={selectedSalary.qualification}
                    onChange={(e) =>
                      setSelectedSalary({
                        ...selectedSalary,
                        qualification: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select
                    value={selectedSalary.status}
                    onValueChange={(value) =>
                      setSelectedSalary({
                        ...selectedSalary,
                        status: value as any,
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => setEditOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpdateSalary} disabled={updating}>
                {updating ? "Updating..." : "Update Salary"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle>Confirm Delete</DialogTitle>
            </DialogHeader>

            <p>
              Are you sure you want to delete{" "}
              <strong>{selectedSalary?.jobTitle}</strong> from{" "}
              <strong>{selectedSalary?.companyName}</strong>?
            </p>

            <div className="flex justify-end gap-2 mt-4">
              <Button
                variant="outline"
                onClick={() => setOpenDeleteDialog(false)}
                disabled={deleting}
              >
                Cancel
              </Button>

              <Button
                variant="destructive"
                onClick={confirmDelete}
                disabled={deleting}
              >
                {deleting ? "Deleting..." : "Delete"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
